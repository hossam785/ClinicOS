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

export interface Notification {
  _id: string
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
  deletedAt?: string | null
  version: number
}

export interface NotificationPreferences {
  _id: string
  tenantId: string
  userId: string
  role: string
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
  createdAt: string
  updatedAt: string
  version: number
}

export interface NotificationQueueItem {
  _id: string
  tenantId: string
  queueType: 'OFFLINE_SYNC' | 'EXTERNAL_DELIVERY_RETRY' | 'BATCH_BROADCAST'
  clientRequestId: string
  payloadReference: Record<string, unknown>
  retryCount: number
  retryAfter: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  lastAttempt?: string | null
  errorMessage?: string | null
  createdAt: string
  updatedAt: string
}

export interface NotificationAuditLog {
  _id: string
  tenantId: string
  notificationId?: string
  action: 'CREATE' | 'READ' | 'READ_ALL' | 'ACKNOWLEDGE' | 'ARCHIVE' | 'RESTORE' | 'PREFERENCE_UPDATE' | 'SYNC'
  actorUserId: string
  actorRole: string
  ipAddress?: string
  userAgent?: string
  details?: Record<string, unknown>
  timestamp: string
}

export interface QueryNotificationsDto {
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

export interface CreateNotificationDto {
  tenantId: string
  clinicId: string
  notificationType: NotificationType
  category: NotificationCategory
  priority: NotificationPriority
  title: string
  message: string
  sourceModule: string
  sourceEntity: string
  sourceEntityId: string
  targetRoute: string
  targetId: string
  recipientUserIds?: string[]
  recipientRoles?: string[]
  metadata?: Record<string, unknown>
  clientRequestId?: string
}

export interface UpdatePreferencesDto {
  enableAppointmentNotifications?: boolean
  enableFinancialNotifications?: boolean
  enableAdministrativeNotifications?: boolean
  enableSystemNotifications?: boolean
}

export interface NotificationUnreadSummary {
  totalUnread: number
  highPriorityUnread: number
  criticalUnacknowledged: number
  byCategory: Partial<Record<NotificationCategory, number>>
}
