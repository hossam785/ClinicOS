// Desktop Offline Synchronization Engine Backend Types — Module-018

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
  queueId?: string
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

export interface IFileSyncChunk {
  chunkId: string
  attachmentId: string
  tenantId: string
  clinicId: string
  chunkIndex: number
  totalChunks: number
  chunkSizeBytes: number
  sha256Checksum: string
  status: 'PENDING' | 'UPLOADING' | 'COMPLETED' | 'FAILED'
  uploadedAt?: string
  createdAt: string
}

export interface IDeviceRegistration {
  deviceId: string
  deviceName: string
  tenantId: string
  clinicId: string
  licenseKey: string
  deviceSecretHash: string
  deviceFingerprint: string
  osPlatform: string
  appVersion: string
  licenseStatus: 'ACTIVE' | 'EXPIRED' | 'PENDING_RENEWAL'
  authenticationStatus: 'AUTHENTICATED' | 'REJECTED' | 'EXPIRED'
  lastHeartbeatAt: string
  lastSuccessfulSyncAt: string
  registeredAt: string
}

export interface ISyncSession {
  sessionId: string
  tenantId: string
  clinicId: string
  deviceId: string
  startedAt: string
  finishedAt?: string
  status: 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
  uploadedRecords: number
  downloadedRecords: number
  conflicts: number
  failures: number
  durationMs: number
}

export interface ISyncLogEntry {
  logId: string
  sessionId: string
  tenantId: string
  clinicId: string
  deviceId: string
  eventType:
    | 'SYNC_START'
    | 'SYNC_SUCCESS'
    | 'SYNC_FAILED'
    | 'RETRY_ATTEMPT'
    | 'CONFLICT_DETECTED'
    | 'MANUAL_SYNC'
    | 'DEVICE_REGISTERED'
    | 'DELTA_SYNC_PROCESSED'
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

export interface IRegisterDevicePayload {
  licenseKey: string
  deviceName: string
  deviceFingerprint: string
  osPlatform: string
  appVersion: string
}

export interface IIncrementalDeltaPayload {
  deviceId: string
  lastSyncVersion: number
  outgoingMutations: Array<{
    queueId: string
    entityType: EntityType
    entityId: string
    operationType: QueueOperationType
    delta: Record<string, unknown>
    localVersion: number
    checksum: string
  }>
}

export interface IResolveConflictPayload {
  resolutionChoice: 'KEEP_LOCAL' | 'USE_REMOTE' | 'MANUAL_MERGE'
  mergedPayload?: Record<string, unknown>
}
