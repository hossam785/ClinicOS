import type {
  Notification,
  NotificationPriority,
  NotificationCategory,
  NotificationType,
  NotificationPreferences,
  NotificationQueueItem,
  NotificationAuditLog,
  QueryNotificationsDto,
  NotificationUnreadSummary,
} from '../types/notification.types'

export interface INotificationRepository {
  create(notification: Notification): Promise<Notification>
  findById(tenantId: string, id: string): Promise<Notification | null>
  findByNotificationNumber(tenantId: string, number: string): Promise<Notification | null>
  findByClientRequestId(tenantId: string, clientRequestId: string): Promise<Notification | null>
  list(
    tenantId: string,
    userId: string,
    role: string,
    params: QueryNotificationsDto
  ): Promise<{ data: Notification[]; total: number; page: number; totalPages: number }>
  getRecent(tenantId: string, userId: string, role: string, limit?: number): Promise<Notification[]>
  getUnreadSummary(tenantId: string, userId: string, role: string): Promise<NotificationUnreadSummary>
  markAsRead(tenantId: string, userId: string, id: string): Promise<Notification | null>
  markAllAsRead(tenantId: string, userId: string, role: string): Promise<number>
  acknowledgeCritical(tenantId: string, userId: string, id: string, notes?: string): Promise<Notification | null>
  archive(tenantId: string, userId: string, id: string): Promise<Notification | null>
  restore(tenantId: string, userId: string, id: string): Promise<Notification | null>
  getPreferences(tenantId: string, userId: string, role: string): Promise<NotificationPreferences>
  updatePreferences(
    tenantId: string,
    userId: string,
    role: string,
    updates: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences>
  syncBatch(
    tenantId: string,
    userId: string,
    role: string,
    queuedNotifications: Record<string, unknown>[]
  ): Promise<{ processedCount: number; duplicateCount: number; syncedIds: string[]; ignoredDuplicateRequestIds: string[] }>
  createAuditLog(log: NotificationAuditLog): Promise<void>
  getNextSequence(tenantId: string): Promise<number>
}

export class InMemoryNotificationRepository implements INotificationRepository {
  private notifications: Map<string, Notification> = new Map()
  private preferences: Map<string, NotificationPreferences> = new Map()
  private queues: Map<string, NotificationQueueItem> = new Map()
  private auditLogs: NotificationAuditLog[] = []
  private sequences: Map<string, number> = new Map()

  constructor() {
    this.seedInitialData()
  }

  private seedInitialData(): void {
    const now = new Date()
    const fiveMinAgo = new Date(now.getTime() - 5 * 60 * 1000).toISOString()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString()
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()

    const sampleNotifications: Notification[] = [
      {
        _id: 'notif_001',
        notificationNumber: 'NOT-202608-00001',
        tenantId: 'clinic-101',
        clinicId: 'clinic-branch-01',
        recipientUserId: 'user_doc_042',
        recipientRole: 'DOCTOR',
        title: 'Patient Checked-In',
        message: 'Patient Sarah Jenkins has arrived in the waiting room for Appointment APT-202608-00012.',
        notificationType: 'PATIENT_CHECKED_IN',
        category: 'APPOINTMENT',
        priority: 'HIGH',
        sourceModule: 'APPOINTMENTS',
        sourceEntity: 'Appointment',
        sourceEntityId: 'apt_88129031',
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
        syncedAt: fiveMinAgo,
        clientRequestId: 'req_seed_001',
        targetRoute: '/dashboard/appointments/queue',
        targetId: 'APT-202608-00012',
        metadata: { patientName: 'Sarah Jenkins', appointmentTime: '10:30 AM' },
        createdAt: fiveMinAgo,
        updatedAt: fiveMinAgo,
        version: 1,
      },
      {
        _id: 'notif_002',
        notificationNumber: 'NOT-202608-00002',
        tenantId: 'clinic-101',
        clinicId: 'clinic-branch-01',
        recipientUserId: 'user_manager_01',
        recipientRole: 'CLINIC_MANAGER',
        title: 'Expense Approval Required',
        message: 'Expense EXP-202607-00104 ($1,450.00 - Medical Supplies) requires Clinic Manager approval.',
        notificationType: 'EXPENSE_APPROVAL_REQUIRED',
        category: 'FINANCIAL',
        priority: 'HIGH',
        sourceModule: 'EXPENSES',
        sourceEntity: 'Expense',
        sourceEntityId: 'exp_66901a8b1',
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
        syncedAt: oneHourAgo,
        clientRequestId: 'req_seed_002',
        targetRoute: '/dashboard/expenses/EXP-202607-00104',
        targetId: 'EXP-202607-00104',
        metadata: { amount: 1450, categoryName: 'Medical Supplies' },
        createdAt: oneHourAgo,
        updatedAt: oneHourAgo,
        version: 1,
      },
      {
        _id: 'notif_003',
        notificationNumber: 'NOT-202608-00003',
        tenantId: 'clinic-101',
        clinicId: 'clinic-branch-01',
        recipientUserId: 'user_doc_042',
        recipientRole: 'DOCTOR',
        title: 'Doctor Settlement Ready',
        message: 'Settlement Statement STL-202607-00002 for July 2026 is ready for review ($4,250.00).',
        notificationType: 'DOCTOR_SETTLEMENT_READY',
        category: 'FINANCIAL',
        priority: 'NORMAL',
        sourceModule: 'DOCTOR_FINANCIALS',
        sourceEntity: 'DoctorSettlement',
        sourceEntityId: 'stl_202607_02',
        deliveryStatus: 'DELIVERED',
        readStatus: 'READ',
        isRead: true,
        readAt: yesterday,
        isArchived: false,
        archivedAt: null,
        isAcknowledged: false,
        acknowledgedAt: null,
        acknowledgedBy: null,
        syncStatus: 'SYNCHRONIZED',
        syncVersion: 1,
        syncedAt: yesterday,
        clientRequestId: 'req_seed_003',
        targetRoute: '/dashboard/doctor-financials/portal',
        targetId: 'STL-202607-00002',
        metadata: { netPayout: 4250, period: 'July 2026' },
        createdAt: yesterday,
        updatedAt: yesterday,
        version: 1,
      },
      {
        _id: 'notif_004',
        notificationNumber: 'NOT-202608-00004',
        tenantId: 'PLATFORM',
        clinicId: 'SYSTEM',
        recipientUserId: 'user_platform_admin',
        recipientRole: 'SUPER_ADMIN',
        title: 'System Backup Failed',
        message: 'Automated database backup job failed due to remote cloud storage timeout.',
        notificationType: 'BACKUP_FAILED',
        category: 'SYSTEM',
        priority: 'CRITICAL',
        sourceModule: 'SYSTEM',
        sourceEntity: 'BackupJob',
        sourceEntityId: 'job_bck_991',
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
        syncedAt: fiveMinAgo,
        clientRequestId: 'req_seed_004',
        targetRoute: '/admin/system/backups',
        targetId: 'JOB-991',
        metadata: { errorCode: 'STORAGE_TIMEOUT' },
        createdAt: fiveMinAgo,
        updatedAt: fiveMinAgo,
        version: 1,
      },
    ]

    sampleNotifications.forEach((n) => this.notifications.set(n._id, n))
    this.sequences.set('clinic-101', 4)
    this.sequences.set('PLATFORM', 1)
  }

  async getNextSequence(tenantId: string): Promise<number> {
    const current = this.sequences.get(tenantId) || 0
    const next = current + 1
    this.sequences.set(tenantId, next)
    return next
  }

  async create(notification: Notification): Promise<Notification> {
    this.notifications.set(notification._id, notification)
    return notification
  }

  async findById(tenantId: string, id: string): Promise<Notification | null> {
    const item = this.notifications.get(id)
    if (!item) return null
    if (tenantId !== 'PLATFORM' && item.tenantId !== tenantId) return null
    return item
  }

  async findByNotificationNumber(tenantId: string, number: string): Promise<Notification | null> {
    for (const item of this.notifications.values()) {
      if (item.notificationNumber === number) {
        if (tenantId === 'PLATFORM' || item.tenantId === tenantId) {
          return item
        }
      }
    }
    return null
  }

  async findByClientRequestId(tenantId: string, clientRequestId: string): Promise<Notification | null> {
    for (const item of this.notifications.values()) {
      if (item.clientRequestId === clientRequestId && item.tenantId === tenantId) {
        return item
      }
    }
    return null
  }

  async list(
    tenantId: string,
    userId: string,
    role: string,
    params: QueryNotificationsDto
  ): Promise<{ data: Notification[]; total: number; page: number; totalPages: number }> {
    let items = Array.from(this.notifications.values())

    // 1. Tenant & Security Scoping
    if (role === 'SUPER_ADMIN') {
      items = items.filter((item) => item.tenantId === 'PLATFORM')
    } else {
      items = items.filter((item) => item.tenantId === tenantId)
      // Scoping for non-managers
      if (role !== 'CLINIC_MANAGER') {
        items = items.filter((item) => item.recipientUserId === userId || item.recipientRole === role)
      }
    }

    // 2. Archive Filter
    const archived = params.archived ?? false
    items = items.filter((item) => item.isArchived === archived)

    // 3. Read Status Filter
    if (params.readStatus && params.readStatus !== 'ALL') {
      if (params.readStatus === 'UNREAD') {
        items = items.filter((item) => !item.isRead)
      } else if (params.readStatus === 'READ') {
        items = items.filter((item) => item.isRead)
      }
    }

    // 4. Category Filter
    if (params.category && params.category !== 'ALL') {
      items = items.filter((item) => item.category === params.category)
    }

    // 5. Priority Filter
    if (params.priority && params.priority !== 'ALL') {
      items = items.filter((item) => item.priority === params.priority)
    }

    // 6. Free-Text Search
    if (params.search) {
      const q = params.search.toLowerCase()
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.message.toLowerCase().includes(q) ||
          item.notificationNumber.toLowerCase().includes(q)
      )
    }

    // 7. Date Range
    if (params.startDate) {
      items = items.filter((item) => item.createdAt >= params.startDate!)
    }
    if (params.endDate) {
      items = items.filter((item) => item.createdAt <= params.endDate!)
    }

    // 8. Sorting
    items.sort((a, b) => {
      const order = params.sortOrder === 'asc' ? 1 : -1
      return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * order
    })

    const page = params.page || 1
    const limit = params.limit || 20
    const total = items.length
    const totalPages = Math.ceil(total / limit) || 1
    const startIndex = (page - 1) * limit
    const paginatedItems = items.slice(startIndex, startIndex + limit)

    return {
      data: paginatedItems,
      total,
      page,
      totalPages,
    }
  }

  async getRecent(tenantId: string, userId: string, role: string, limit = 5): Promise<Notification[]> {
    let items = Array.from(this.notifications.values()).filter((item) => !item.isArchived && !item.isRead)

    if (role === 'SUPER_ADMIN') {
      items = items.filter((item) => item.tenantId === 'PLATFORM')
    } else {
      items = items.filter((item) => item.tenantId === tenantId)
      if (role !== 'CLINIC_MANAGER') {
        items = items.filter((item) => item.recipientUserId === userId || item.recipientRole === role)
      }
    }

    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    return items.slice(0, limit)
  }

  async getUnreadSummary(tenantId: string, userId: string, role: string): Promise<NotificationUnreadSummary> {
    let items = Array.from(this.notifications.values()).filter((item) => !item.isArchived)

    if (role === 'SUPER_ADMIN') {
      items = items.filter((item) => item.tenantId === 'PLATFORM')
    } else {
      items = items.filter((item) => item.tenantId === tenantId)
      if (role !== 'CLINIC_MANAGER') {
        items = items.filter((item) => item.recipientUserId === userId || item.recipientRole === role)
      }
    }

    const unreadItems = items.filter((item) => !item.isRead)
    const totalUnread = unreadItems.length
    const highPriorityUnread = unreadItems.filter((item) => item.priority === 'HIGH').length
    const criticalUnacknowledged = items.filter((item) => item.priority === 'CRITICAL' && !item.isAcknowledged).length

    const byCategory: Partial<Record<string, number>> = {}
    unreadItems.forEach((item) => {
      byCategory[item.category] = (byCategory[item.category] || 0) + 1
    })

    return {
      totalUnread,
      highPriorityUnread,
      criticalUnacknowledged,
      byCategory,
    }
  }

  async markAsRead(tenantId: string, userId: string, id: string): Promise<Notification | null> {
    const item = await this.findById(tenantId, id)
    if (!item) return null

    const now = new Date().toISOString()
    item.isRead = true
    item.readStatus = 'READ'
    item.readAt = now
    item.updatedAt = now
    item.version += 1
    this.notifications.set(id, item)
    return item
  }

  async markAllAsRead(tenantId: string, userId: string, role: string): Promise<number> {
    let count = 0
    const now = new Date().toISOString()

    for (const item of this.notifications.values()) {
      if (role === 'SUPER_ADMIN') {
        if (item.tenantId !== 'PLATFORM') continue
      } else {
        if (item.tenantId !== tenantId) continue
        if (role !== 'CLINIC_MANAGER' && item.recipientUserId !== userId && item.recipientRole !== role) continue
      }

      if (!item.isRead && !item.isArchived) {
        item.isRead = true
        item.readStatus = 'READ'
        item.readAt = now
        item.updatedAt = now
        item.version += 1
        this.notifications.set(item._id, item)
        count += 1
      }
    }

    return count
  }

  async acknowledgeCritical(tenantId: string, userId: string, id: string, notes?: string): Promise<Notification | null> {
    const item = await this.findById(tenantId, id)
    if (!item) return null

    const now = new Date().toISOString()
    item.isAcknowledged = true
    item.acknowledgedAt = now
    item.acknowledgedBy = userId
    item.isRead = true
    item.readStatus = 'READ'
    item.readAt = now
    item.updatedAt = now
    item.version += 1
    if (notes && item.metadata) {
      item.metadata.acknowledgementNotes = notes
    }
    this.notifications.set(id, item)
    return item
  }

  async archive(tenantId: string, userId: string, id: string): Promise<Notification | null> {
    const item = await this.findById(tenantId, id)
    if (!item) return null

    const now = new Date().toISOString()
    item.isArchived = true
    item.archivedAt = now
    item.updatedAt = now
    item.version += 1
    this.notifications.set(id, item)
    return item
  }

  async restore(tenantId: string, userId: string, id: string): Promise<Notification | null> {
    const item = await this.findById(tenantId, id)
    if (!item) return null

    const now = new Date().toISOString()
    item.isArchived = false
    item.archivedAt = null
    item.updatedAt = now
    item.version += 1
    this.notifications.set(id, item)
    return item
  }

  async getPreferences(tenantId: string, userId: string, role: string): Promise<NotificationPreferences> {
    const key = `${tenantId}_${userId}`
    let pref = this.preferences.get(key)
    if (!pref) {
      const now = new Date().toISOString()
      pref = {
        _id: `pref_${userId}`,
        tenantId,
        userId,
        role,
        enableAppointmentNotifications: true,
        enableFinancialNotifications: true,
        enableAdministrativeNotifications: true,
        enableSystemNotifications: true,
        futureChannels: {
          channelInApp: true,
          channelWhatsApp: false,
          channelSMS: false,
          channelEmail: false,
          channelPush: false,
        },
        createdAt: now,
        updatedAt: now,
        version: 1,
      }
      this.preferences.set(key, pref)
    }
    return pref
  }

  async updatePreferences(
    tenantId: string,
    userId: string,
    role: string,
    updates: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    const current = await this.getPreferences(tenantId, userId, role)
    const updated: NotificationPreferences = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
      version: current.version + 1,
    }
    this.preferences.set(`${tenantId}_${userId}`, updated)
    return updated
  }

  async syncBatch(
    tenantId: string,
    userId: string,
    role: string,
    queuedNotifications: Record<string, unknown>[]
  ): Promise<{ processedCount: number; duplicateCount: number; syncedIds: string[]; ignoredDuplicateRequestIds: string[] }> {
    let processedCount = 0
    let duplicateCount = 0
    const syncedIds: string[] = []
    const ignoredDuplicateRequestIds: string[] = []
    const now = new Date().toISOString()

    for (const q of queuedNotifications) {
      const clientReqId = typeof q.clientRequestId === 'string' ? q.clientRequestId : undefined
      if (clientReqId) {
        const existing = await this.findByClientRequestId(tenantId, clientReqId)
        if (existing) {
          duplicateCount += 1
          ignoredDuplicateRequestIds.push(clientReqId)
          continue
        }
      }

      const seq = await this.getNextSequence(tenantId)
      const seqStr = String(seq).padStart(5, '0')
      const notifNumber = `NOT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${seqStr}`
      const newId = `notif_sync_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`

      const item: Notification = {
        _id: newId,
        notificationNumber: notifNumber,
        tenantId,
        clinicId: (q.clinicId as string) || 'branch_main',
        recipientUserId: userId,
        recipientRole: role,
        title: (q.title as string) || 'Offline Event',
        message: (q.message as string) || 'Notification generated offline.',
        notificationType: (q.notificationType as NotificationType) || 'SYSTEM_UPDATE',
        category: (q.category as NotificationCategory) || 'SYSTEM',
        priority: (q.priority as NotificationPriority) || 'NORMAL',
        sourceModule: (q.sourceModule as string) || 'OFFLINE_SYNC',
        sourceEntity: (q.sourceEntity as string) || 'SyncQueue',
        sourceEntityId: (q.sourceEntityId as string) || newId,
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
        clientRequestId: clientReqId || null,
        targetRoute: (q.targetRoute as string) || '/dashboard/notifications',
        targetId: (q.targetId as string) || newId,
        metadata: (q.metadata as Record<string, unknown>) || {},
        createdAt: (q.localCreatedAt as string) || now,
        updatedAt: now,
        version: 1,
      }

      await this.create(item)
      processedCount += 1
      syncedIds.push(newId)
    }

    return {
      processedCount,
      duplicateCount,
      syncedIds,
      ignoredDuplicateRequestIds,
    }
  }

  async createAuditLog(log: NotificationAuditLog): Promise<void> {
    this.auditLogs.push(log)
  }
}
