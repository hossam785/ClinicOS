// Desktop Offline Synchronization Engine Domain Types — Module-018

export type SyncStateMode =
  | 'OFFLINE'
  | 'CONNECTING'
  | 'AUTHENTICATING'
  | 'SYNCHRONIZING'
  | 'IDLE'
  | 'RETRY'
  | 'CONFLICT'
  | 'ERROR'

export type QueueItemStatus =
  | 'WAITING'
  | 'UPLOADING'
  | 'DOWNLOADING'
  | 'SYNCED'
  | 'RETRY_PENDING'
  | 'CONFLICT'
  | 'FAILED'
  | 'CANCELLED'

export type QueueOperationType = 'CREATE' | 'UPDATE' | 'DELETE' | 'RESTORE' | 'UPLOAD_FILE' | 'DOWNLOAD_FILE'

export type EntityType =
  | 'PATIENT'
  | 'APPOINTMENT'
  | 'MEDICAL_RECORD'
  | 'PRESCRIPTION'
  | 'ATTACHMENT'
  | 'REPORT'
  | 'SETTING'

export interface ISyncStatusSummary {
  syncState: SyncStateMode
  isOffline: boolean
  lastSuccessfulSyncAt: string | null
  nextScheduledSyncAt: string | null
  pendingQueueCount: number
  failedQueueCount: number
  conflictCount: number
  localSequenceVersion: number
  serverSequenceVersion: number
  deviceId: string
  isDeviceAuthorized: boolean
}

export interface ISyncQueueItem {
  queueId: string
  tenantId: string
  clinicId: string
  entityType: EntityType
  entityId: string
  entityTitle: string
  operationType: QueueOperationType
  payloadJson: string
  status: QueueItemStatus
  priority: number // 1 = URGENT, 2 = STANDARD, 3 = BULK
  retryCount: number
  maxRetries: number
  nextRetryAt?: string
  errorMessage?: string
  createdAt: string
  updatedAt: string
}

export interface ISyncConflict {
  conflictId: string
  tenantId: string
  clinicId: string
  queueId: string
  entityType: EntityType
  entityId: string
  entityTitle: string
  localVersionJson: Record<string, unknown>
  remoteVersionJson: Record<string, unknown>
  conflictPolicyApplied: 'LAST_WRITE_WINS' | 'DESKTOP_WINS' | 'SERVER_WINS' | 'MANUAL'
  resolutionStatus: 'AUTO_RESOLVED' | 'PENDING_MANUAL' | 'MANUAL_RESOLVED'
  resolvedByUserId?: string
  resolvedAt?: string
  createdAt: string
}

export interface IFileSyncProgress {
  fileSyncId: string
  attachmentId: string
  fileName: string
  fileSizeBytes: number
  uploadedBytes: number
  uploadedChunks: number
  totalChunks: number
  transferSpeedKbps: number
  estimatedRemainingSeconds: number
  uploadStatus: 'PENDING' | 'UPLOADING' | 'COMPLETED' | 'PAUSED' | 'FAILED'
  checksum: string
}

export interface IDeviceStatus {
  deviceId: string
  deviceName: string
  tenantId: string
  clinicId: string
  licenseStatus: 'ACTIVE' | 'EXPIRED' | 'PENDING_RENEWAL'
  licenseKey: string
  authenticationStatus: 'AUTHENTICATED' | 'REJECTED' | 'EXPIRED'
  lastHeartbeatAt: string
  lastSuccessfulSyncAt: string
  applicationVersion: string
  databaseVersion: string
  synchronizationVersion: string
}

export interface ISyncLogEntry {
  logId: string
  sessionId: string
  tenantId: string
  clinicId: string
  deviceId: string
  eventType: 'SYNC_START' | 'SYNC_SUCCESS' | 'SYNC_FAILED' | 'RETRY_ATTEMPT' | 'CONFLICT_DETECTED' | 'MANUAL_SYNC'
  entityType?: EntityType
  recordCount: number
  durationMs: number
  eventHash: string
  createdAt: string
}

export interface ISyncDiagnostics {
  internetStatus: 'CONNECTED' | 'DISCONNECTED'
  serverReachability: 'REACHABLE' | 'UNREACHABLE'
  authenticationStatus: 'VALID' | 'INVALID'
  queueHealthStatus: 'HEALTHY' | 'DEGRADED' | 'CORRUPTED'
  databaseIntegrityStatus: 'INTACT' | 'CORRUPTED'
  storageAvailableMb: number
  diagnosticsCheckedAt: string
}

export interface ISyncConfig {
  tenantId: string
  clinicId: string
  automaticSync: boolean
  syncIntervalSeconds: number
  syncAttachments: boolean
  syncReports: boolean
  syncNotifications: boolean
  bandwidthLimitKbps: number
  conflictPolicyDefault: 'ENTITY_STANDARD' | 'DESKTOP_WINS' | 'SERVER_WINS'
  retryLimit: number
}
