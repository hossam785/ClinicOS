import { AppError } from '@/shared/errors/AppError'
import type { INotificationRepository } from '../repositories/notification.repository'
import type {
  Notification,
  CreateNotificationDto,
  QueryNotificationsDto,
  NotificationPreferences,
  NotificationUnreadSummary,
  UpdatePreferencesDto,
} from '../types/notification.types'

export class NotificationEngineService {
  constructor(private repository: INotificationRepository) {}

  /**
   * Centralized Notification Engine Trigger method.
   * Every business domain module (Appointments, Patients, EMR, Prescriptions, Expenses, Financials, System)
   * MUST call this method to generate platform notifications.
   */
  async generateNotification(dto: CreateNotificationDto): Promise<Notification[]> {
    // 1. Enforce Platform Isolation Barrier (PLATFORM_ADMIN_CLINIC_NOTIFICATIONS_RESTRICTED)
    if (dto.tenantId === 'PLATFORM') {
      // Platform infrastructure notifications target Platform Owner SUPER_ADMIN only
      dto.recipientRoles = ['SUPER_ADMIN']
    } else {
      // Clinic operational notifications NEVER target Platform Owner
      if (dto.recipientRoles) {
        dto.recipientRoles = dto.recipientRoles.filter((role) => role !== 'SUPER_ADMIN')
      }
    }

    // 2. Resolve Target Recipients
    const recipientUserIds = dto.recipientUserIds || []
    const recipientRoles = dto.recipientRoles || []

    if (recipientUserIds.length === 0 && recipientRoles.length === 0) {
      // Default recipient role fallback based on category
      if (dto.category === 'APPOINTMENT' || dto.category === 'PATIENT') {
        recipientRoles.push('RECEPTIONIST', 'CLINIC_MANAGER')
      } else if (dto.category === 'FINANCIAL') {
        recipientRoles.push('CLINIC_MANAGER', 'ACCOUNTANT')
      } else if (dto.category === 'SYSTEM' || dto.category === 'ADMINISTRATIVE') {
        recipientRoles.push('CLINIC_MANAGER')
      }
    }

    const createdNotifications: Notification[] = []
    const now = new Date().toISOString()

    // 3. Process Recipient User ID Dispatches
    for (const userId of recipientUserIds) {
      // Check user preferences if non-critical
      if (dto.priority !== 'CRITICAL') {
        const prefs = await this.repository.getPreferences(dto.tenantId, userId, 'STAFF')
        if (dto.category === 'APPOINTMENT' && !prefs.enableAppointmentNotifications) continue
        if (dto.category === 'FINANCIAL' && !prefs.enableFinancialNotifications) continue
        if (dto.category === 'ADMINISTRATIVE' && !prefs.enableAdministrativeNotifications) continue
        if (dto.category === 'SYSTEM' && !prefs.enableSystemNotifications) continue
      }

      const seq = await this.repository.getNextSequence(dto.tenantId)
      const seqStr = String(seq).padStart(5, '0')
      const notifNumber = `NOT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${seqStr}`
      const notifId = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`

      const item: Notification = {
        _id: notifId,
        notificationNumber: notifNumber,
        tenantId: dto.tenantId,
        clinicId: dto.clinicId,
        recipientUserId: userId,
        recipientRole: 'USER',
        title: dto.title,
        message: dto.message,
        notificationType: dto.notificationType,
        category: dto.category,
        priority: dto.priority,
        sourceModule: dto.sourceModule,
        sourceEntity: dto.sourceEntity,
        sourceEntityId: dto.sourceEntityId,
        deliveryStatus: 'DELIVERED',
        readStatus: 'UNREAD',
        isRead: false,
        readAt: null,
        isArchived: false,
        archivedAt: null,
        isAcknowledged: false,
        acknowledgedAt: null,
        acknowledgedBy: null,
        syncStatus: 'SYNCHRONIZED',
        syncVersion: 1,
        syncedAt: now,
        clientRequestId: dto.clientRequestId || null,
        targetRoute: dto.targetRoute,
        targetId: dto.targetId,
        metadata: dto.metadata || {},
        createdAt: now,
        updatedAt: now,
        version: 1,
      }

      const created = await this.repository.create(item)
      createdNotifications.push(created)
    }

    // 4. Process Recipient Role Broadcast Dispatches
    for (const role of recipientRoles) {
      const seq = await this.repository.getNextSequence(dto.tenantId)
      const seqStr = String(seq).padStart(5, '0')
      const notifNumber = `NOT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${seqStr}`
      const notifId = `notif_role_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`

      const item: Notification = {
        _id: notifId,
        notificationNumber: notifNumber,
        tenantId: dto.tenantId,
        clinicId: dto.clinicId,
        recipientUserId: `role_${role.toLowerCase()}`,
        recipientRole: role,
        title: dto.title,
        message: dto.message,
        notificationType: dto.notificationType,
        category: dto.category,
        priority: dto.priority,
        sourceModule: dto.sourceModule,
        sourceEntity: dto.sourceEntity,
        sourceEntityId: dto.sourceEntityId,
        deliveryStatus: 'DELIVERED',
        readStatus: 'UNREAD',
        isRead: false,
        readAt: null,
        isArchived: false,
        archivedAt: null,
        isAcknowledged: false,
        acknowledgedAt: null,
        acknowledgedBy: null,
        syncStatus: 'SYNCHRONIZED',
        syncVersion: 1,
        syncedAt: now,
        clientRequestId: dto.clientRequestId || null,
        targetRoute: dto.targetRoute,
        targetId: dto.targetId,
        metadata: dto.metadata || {},
        createdAt: now,
        updatedAt: now,
        version: 1,
      }

      const created = await this.repository.create(item)
      createdNotifications.push(created)
    }

    return createdNotifications
  }

  async listNotifications(
    tenantId: string,
    userId: string,
    role: string,
    params: QueryNotificationsDto
  ) {
    // Platform Owner isolation check
    if (role === 'SUPER_ADMIN' && tenantId !== 'PLATFORM') {
      throw new AppError(
        'Access Denied: Platform Owners cannot view operational clinic notifications.',
        403,
        'PLATFORM_ADMIN_CLINIC_NOTIFICATIONS_RESTRICTED'
      )
    }

    return await this.repository.list(tenantId, userId, role, params)
  }

  async getRecentNotifications(tenantId: string, userId: string, role: string, limit = 5) {
    if (role === 'SUPER_ADMIN' && tenantId !== 'PLATFORM') {
      throw new AppError(
        'Access Denied: Platform Owners cannot view operational clinic notifications.',
        403,
        'PLATFORM_ADMIN_CLINIC_NOTIFICATIONS_RESTRICTED'
      )
    }

    const recent = await this.repository.getRecent(tenantId, userId, role, limit)
    const summary = await this.repository.getUnreadSummary(tenantId, userId, role)

    return {
      recent,
      totalUnread: summary.totalUnread,
    }
  }

  async getUnreadCount(tenantId: string, userId: string, role: string): Promise<NotificationUnreadSummary> {
    if (role === 'SUPER_ADMIN' && tenantId !== 'PLATFORM') {
      return { totalUnread: 0, highPriorityUnread: 0, criticalUnacknowledged: 0, byCategory: {} }
    }
    return await this.repository.getUnreadSummary(tenantId, userId, role)
  }

  async getNotificationById(tenantId: string, userId: string, role: string, id: string): Promise<Notification> {
    const notification = await this.repository.findById(tenantId, id)
    if (!notification) {
      throw new AppError(`Notification with ID "${id}" was not found.`, 404, 'NOTIFICATION_NOT_FOUND')
    }

    // Ownership & Security Check
    if (role === 'SUPER_ADMIN') {
      if (notification.tenantId !== 'PLATFORM') {
        throw new AppError(
          'Access Denied: Platform Owners cannot view operational clinic notifications.',
          403,
          'PLATFORM_ADMIN_CLINIC_NOTIFICATIONS_RESTRICTED'
        )
      }
    } else {
      if (notification.tenantId !== tenantId) {
        throw new AppError('Access Denied: Cross-tenant notification access forbidden.', 403, 'TENANT_ACCESS_DENIED')
      }
      if (
        role !== 'CLINIC_MANAGER' &&
        notification.recipientUserId !== userId &&
        notification.recipientRole !== role
      ) {
        throw new AppError('Access Denied: You do not have permission to view this notification.', 403, 'NOTIFICATION_ACCESS_RESTRICTED')
      }
    }

    return notification
  }

  async markAsRead(tenantId: string, userId: string, role: string, id: string): Promise<Notification> {
    await this.getNotificationById(tenantId, userId, role, id)
    const updated = await this.repository.markAsRead(tenantId, userId, id)
    if (!updated) {
      throw new AppError('Failed to mark notification as read.', 500, 'UPDATE_FAILED')
    }

    await this.repository.createAuditLog({
      _id: `audit_${Date.now()}`,
      tenantId,
      notificationId: id,
      action: 'READ',
      actorUserId: userId,
      actorRole: role,
      timestamp: new Date().toISOString(),
    })

    return updated
  }

  async markAllAsRead(tenantId: string, userId: string, role: string) {
    const markedCount = await this.repository.markAllAsRead(tenantId, userId, role)

    await this.repository.createAuditLog({
      _id: `audit_${Date.now()}`,
      tenantId,
      action: 'READ_ALL',
      actorUserId: userId,
      actorRole: role,
      details: { markedCount },
      timestamp: new Date().toISOString(),
    })

    return {
      markedCount,
      readAt: new Date().toISOString(),
    }
  }

  async acknowledgeCritical(tenantId: string, userId: string, role: string, id: string, notes?: string): Promise<Notification> {
    const item = await this.getNotificationById(tenantId, userId, role, id)
    if (item.priority !== 'CRITICAL') {
      throw new AppError('Only CRITICAL priority notifications require formal acknowledgment.', 400, 'NOT_CRITICAL_PRIORITY')
    }

    const updated = await this.repository.acknowledgeCritical(tenantId, userId, id, notes)
    if (!updated) {
      throw new AppError('Failed to acknowledge critical notification.', 500, 'ACKNOWLEDGE_FAILED')
    }

    await this.repository.createAuditLog({
      _id: `audit_${Date.now()}`,
      tenantId,
      notificationId: id,
      action: 'ACKNOWLEDGE',
      actorUserId: userId,
      actorRole: role,
      details: { notes },
      timestamp: new Date().toISOString(),
    })

    return updated
  }

  async archiveNotification(tenantId: string, userId: string, role: string, id: string): Promise<Notification> {
    await this.getNotificationById(tenantId, userId, role, id)
    const updated = await this.repository.archive(tenantId, userId, id)
    if (!updated) {
      throw new AppError('Failed to archive notification.', 500, 'ARCHIVE_FAILED')
    }

    await this.repository.createAuditLog({
      _id: `audit_${Date.now()}`,
      tenantId,
      notificationId: id,
      action: 'ARCHIVE',
      actorUserId: userId,
      actorRole: role,
      timestamp: new Date().toISOString(),
    })

    return updated
  }

  async restoreNotification(tenantId: string, userId: string, role: string, id: string): Promise<Notification> {
    await this.getNotificationById(tenantId, userId, role, id)
    const updated = await this.repository.restore(tenantId, userId, id)
    if (!updated) {
      throw new AppError('Failed to restore notification.', 500, 'RESTORE_FAILED')
    }

    await this.repository.createAuditLog({
      _id: `audit_${Date.now()}`,
      tenantId,
      notificationId: id,
      action: 'RESTORE',
      actorUserId: userId,
      actorRole: role,
      timestamp: new Date().toISOString(),
    })

    return updated
  }

  async getPreferences(tenantId: string, userId: string, role: string): Promise<NotificationPreferences> {
    return await this.repository.getPreferences(tenantId, userId, role)
  }

  async updatePreferences(
    tenantId: string,
    userId: string,
    role: string,
    dto: UpdatePreferencesDto
  ): Promise<NotificationPreferences> {
    const updated = await this.repository.updatePreferences(tenantId, userId, role, dto)

    await this.repository.createAuditLog({
      _id: `audit_${Date.now()}`,
      tenantId,
      action: 'PREFERENCE_UPDATE',
      actorUserId: userId,
      actorRole: role,
      details: { dto },
      timestamp: new Date().toISOString(),
    })

    return updated
  }

  async syncOfflineQueue(tenantId: string, userId: string, role: string, queuedNotifications: Record<string, unknown>[]) {
    const result = await this.repository.syncBatch(tenantId, userId, role, queuedNotifications)

    await this.repository.createAuditLog({
      _id: `audit_${Date.now()}`,
      tenantId,
      action: 'SYNC',
      actorUserId: userId,
      actorRole: role,
      details: { processedCount: result.processedCount, duplicateCount: result.duplicateCount },
      timestamp: new Date().toISOString(),
    })

    return result
  }
}
