export type NotificationPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL'

export type NotificationCategory =
  | 'APPOINTMENT'
  | 'PATIENT'
  | 'MEDICAL_RECORD'
  | 'PRESCRIPTION'
  | 'FINANCIAL'
  | 'SYSTEM'
  | 'ADMINISTRATIVE'

export type NotificationType =
  | 'APT_NEW'
  | 'APT_UPDATED'
  | 'APT_CANCELLED'
  | 'APT_RESCHEDULED'
  | 'PATIENT_CHECKED_IN'
  | 'CONSULTATION_STARTED'
  | 'CONSULTATION_COMPLETED'
  | 'NO_SHOW'
  | 'PATIENT_NEW'
  | 'PATIENT_UPDATED'
  | 'PATIENT_IMPORTANT_NOTE'
  | 'VISIT_NEW'
  | 'RECORD_UPDATED'
  | 'PRESCRIPTION_CREATED'
  | 'PRESCRIPTION_UPDATED'
  | 'EXPENSE_NEW'
  | 'EXPENSE_APPROVAL_REQUIRED'
  | 'EXPENSE_PAID'
  | 'DOCTOR_SETTLEMENT_READY'
  | 'SETTLEMENT_PAID'
  | 'BACKUP_COMPLETED'
  | 'BACKUP_FAILED'
  | 'DATABASE_RESTORE'
  | 'SYSTEM_UPDATE'
  | 'LICENSE_EXPIRATION_WARNING'
  | 'SYNC_COMPLETED'
  | 'SYNC_FAILED'
  | 'USER_CREATED'
  | 'PERMISSION_CHANGED'
  | 'ROLE_UPDATED'
  | 'FAILED_LOGIN_ATTEMPTS'

export type DeliveryStatus = 'PENDING' | 'DELIVERED' | 'FAILED'
export type ReadStatus = 'UNREAD' | 'READ'
export type SyncStatus = 'SYNCHRONIZED' | 'QUEUED' | 'FAILED'

export interface NotificationItem {
  id: string
  notificationNumber: string
  tenantId: string
  clinicId: string
  recipientUserId: string
  recipientRole: string
  title: string
  message: string
  notificationType: NotificationType
  category: NotificationCategory
  priority: NotificationPriority
  sourceModule: string
  sourceEntity: string
  sourceEntityId: string
  deliveryStatus: DeliveryStatus
  readStatus: ReadStatus
  isRead: boolean
  readAt?: string | null
  isArchived: boolean
  archivedAt?: string | null
  isAcknowledged: boolean
  acknowledgedAt?: string | null
  acknowledgedBy?: string | null
  syncStatus: SyncStatus
  syncVersion: number
  syncedAt?: string | null
  clientRequestId?: string | null
  targetRoute: string
  targetId: string
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface NotificationPreferences {
  userId: string
  tenantId: string
  enableAppointmentNotifications: boolean
  enableFinancialNotifications: boolean
  enableAdministrativeNotifications: boolean
  enableSystemNotifications: boolean
  futureChannels?: {
    channelInApp: boolean
    channelWhatsApp: boolean
    channelSMS: boolean
    channelEmail: boolean
    channelPush: boolean
  }
}

export interface NotificationUnreadCount {
  totalUnread: number
  highPriorityUnread: number
  criticalUnacknowledged: number
  byCategory: Partial<Record<NotificationCategory, number>>
}

export interface NotificationListParams {
  page?: number
  limit?: number
  search?: string
  category?: NotificationCategory | 'ALL'
  priority?: NotificationPriority | 'ALL'
  readStatus?: ReadStatus | 'ALL'
  archived?: boolean
  startDate?: string
  endDate?: string
  sortBy?: 'createdAt' | 'priority'
  sortOrder?: 'asc' | 'desc'
}
