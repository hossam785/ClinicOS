// Backup & Restore Module Types & Interfaces — ClinicOS

export type BackupType = 'MANUAL' | 'AUTOMATIC' | 'PRE_UPGRADE' | 'EMERGENCY' | 'SAFETY_PRE_RESTORE'
export type IntegrityStatus = 'UNVERIFIED' | 'VERIFIED' | 'CORRUPTED'
export type BackupStatus = 'IN_PROGRESS' | 'COMPLETED' | 'FAILED'
export type RestoreStatus = 'COMPLETED' | 'FAILED' | 'ROLLBACK_EXECUTED'
export type RetentionMode = 'LAST_5' | 'LAST_10' | 'LAST_20' | 'UNLIMITED'
export type VerificationType = 'MANUAL' | 'PRE_RESTORE' | 'AUTOMATIC'
export type VerificationResult = 'PASSED' | 'FAILED'

export interface IBackupContentScope {
  databaseIncluded: boolean
  uploadedFilesIncluded: boolean
  attachmentsIncluded: boolean
  auditLogsIncluded: boolean
  reportsIncluded: boolean
  settingsIncluded: boolean
}

export interface IBackupFileInformation {
  filePath: string
  fileName: string
  fileSizeBytes: number
  compressionMethod: string
  compressionRatio: number
}

export interface IBackupSecurity {
  encrypted: boolean
  encryptionAlgorithm: string
  keyDerivationAlgorithm: string
  passwordProtected: boolean
}

export interface IBackupVerificationInfo {
  checksum: string
  checksumAlgorithm: string
  integrityStatus: IntegrityStatus
  verificationDate?: string
  verifiedBy?: string
}

export interface IBackupStatusInfo {
  backupStatus: BackupStatus
  restoreCompatible: boolean
  archived: boolean
}

export interface IBackupMetadata {
  _id: string
  backupId: string
  tenantId: string
  clinicId: string
  backupName: string
  backupType: BackupType
  backupReason: string
  createdBy: string
  createdAt: string
  applicationVersion: string
  databaseVersion: string
  schemaVersion: number
  contentScope: IBackupContentScope
  fileInformation: IBackupFileInformation
  security: IBackupSecurity
  verification: IBackupVerificationInfo
  status: IBackupStatusInfo
}

export interface IBackupRestoreHistory {
  _id: string
  restoreId: string
  backupId: string
  safetyBackupId: string
  tenantId: string
  clinicId: string
  restoredBy: string
  restoredAt: string
  restoreStatus: RestoreStatus
  rollbackPerformed: boolean
  durationMs: number
  applicationVersion: string
  databaseVersion: string
  message?: string
}

export interface IBackupRetentionPolicy {
  _id: string
  tenantId: string
  clinicId: string
  retentionMode: RetentionMode
  retentionCount: number
  autoCleanupEnabled: boolean
  lastCleanupDate?: string
  updatedBy: string
  updatedAt: string
}

export interface IBackupVerificationHistory {
  _id: string
  verificationId: string
  backupId: string
  tenantId: string
  clinicId: string
  verificationType: VerificationType
  verificationResult: VerificationResult
  checksumVerified: boolean
  databaseVerified: boolean
  attachmentVerified: boolean
  executionTimeMs: number
  verifiedAt: string
}

export interface BackupQueryParams {
  page?: number
  limit?: number
  backupType?: BackupType
  integrityStatus?: IntegrityStatus
  startDate?: string
  endDate?: string
  search?: string
}

export interface TriggerBackupPayload {
  backupType: 'MANUAL' | 'EMERGENCY'
  backupName: string
  backupReason?: string
}

export interface RestoreBackupPayload {
  confirmationPhrase: string
  reason?: string
}

export interface UpdateRetentionPayload {
  retentionMode: RetentionMode
  retentionCount?: number
  autoCleanupEnabled: boolean
}

export interface OfflineBackupSyncItem {
  backupId: string
  backupName: string
  backupType: BackupType
  fileSizeBytes: number
  checksum: string
  createdAt: string
}

export interface SyncBackupMetadataPayload {
  localBackupMetadata: OfflineBackupSyncItem[]
}

export interface SyncBackupMetadataResult {
  syncedCount: number
  ignoredCount: number
  syncedIds: string[]
}

export interface BackupStatisticsData {
  totalBackupsCount: number
  verifiedBackupsCount: number
  corruptedBackupsCount: number
  totalRestoreCount: number
  totalStorageSizeBytes: number
  lastBackupDate?: string
  systemHealthStatus: 'HEALTHY' | 'DEGRADED' | 'CRITICAL'
}
