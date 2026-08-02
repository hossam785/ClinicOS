export type BackupType = 'MANUAL' | 'AUTOMATIC' | 'PRE_UPGRADE' | 'EMERGENCY' | 'SAFETY_PRE_RESTORE';

export type IntegrityStatus = 'UNVERIFIED' | 'VERIFIED' | 'CORRUPTED';

export type BackupStatus = 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

export type RestoreStatus = 'COMPLETED' | 'FAILED' | 'ROLLBACK_EXECUTED';

export type RetentionMode = 'LAST_5' | 'LAST_10' | 'LAST_20' | 'UNLIMITED';

export interface ContentScope {
  databaseIncluded: boolean;
  uploadedFilesIncluded: boolean;
  attachmentsIncluded: boolean;
  auditLogsIncluded: boolean;
  reportsIncluded: boolean;
  settingsIncluded: boolean;
}

export interface FileInformation {
  filePath: string;
  fileName: string;
  fileSizeBytes: number;
  compressionMethod: string;
  compressionRatio: number;
}

export interface SecurityProperties {
  encrypted: boolean;
  encryptionAlgorithm: string;
  keyDerivationAlgorithm: string;
  passwordProtected: boolean;
}

export interface VerificationInfo {
  checksum: string;
  checksumAlgorithm: string;
  integrityStatus: IntegrityStatus;
  verificationDate?: string;
  verifiedBy?: string;
}

export interface BackupStatusInfo {
  backupStatus: BackupStatus;
  restoreCompatible: boolean;
  archived: boolean;
}

export interface BackupMetadata {
  _id: string;
  backupId: string;
  tenantId: string;
  clinicId: string;
  backupName: string;
  backupType: BackupType;
  backupReason: string;
  createdBy: string;
  createdAt: string;
  applicationVersion: string;
  databaseVersion: string;
  schemaVersion: number;
  contentScope: ContentScope;
  fileInformation: FileInformation;
  security: SecurityProperties;
  verification: VerificationInfo;
  status: BackupStatusInfo;
}

export interface RestoreHistoryEntry {
  _id: string;
  restoreId: string;
  backupId: string;
  safetyBackupId: string;
  tenantId: string;
  clinicId: string;
  restoredBy: string;
  restoredAt: string;
  restoreStatus: RestoreStatus;
  rollbackPerformed: boolean;
  durationMs: number;
  applicationVersion: string;
  databaseVersion: string;
}

export interface RetentionPolicyConfig {
  tenantId: string;
  clinicId: string;
  retentionMode: RetentionMode;
  retentionCount: number;
  autoCleanupEnabled: boolean;
  automaticSchedule: 'OFF' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  lastCleanupDate?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface BackupVerificationReport {
  verificationId: string;
  backupId: string;
  verificationType: 'MANUAL' | 'PRE_RESTORE' | 'AUTOMATIC';
  verificationResult: 'PASSED' | 'FAILED';
  checksumVerified: boolean;
  databaseVerified: boolean;
  attachmentVerified: boolean;
  executionTimeMs: number;
  verifiedAt: string;
}

export interface BackupStatistics {
  totalBackupsCount: number;
  verifiedBackupsCount: number;
  corruptedBackupsCount: number;
  totalRestoreCount: number;
  totalStorageSizeBytes: number;
  lastBackupDate: string;
  systemHealthStatus: 'HEALTHY' | 'WARNING' | 'CRITICAL';
}

export interface OfflineSyncQueueItem {
  backupId: string;
  backupName: string;
  backupType: BackupType;
  fileSizeBytes: number;
  checksum: string;
  createdAt: string;
  synced: boolean;
}

export interface BackupFilterParams {
  search?: string;
  backupType?: BackupType | 'ALL';
  integrityStatus?: IntegrityStatus | 'ALL';
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface RestoreWizardState {
  currentStep: number;
  selectedBackupId: string | null;
  confirmationPhrase: string;
  reason: string;
  isExecuting: boolean;
  progressPercentage: number;
  currentStageMessage: string;
  safetyBackupGenerated: boolean;
  restoreError: string | null;
  rollbackExecuted: boolean;
}
