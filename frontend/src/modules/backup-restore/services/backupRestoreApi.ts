import type {
  BackupMetadata,
  RestoreHistoryEntry,
  RetentionPolicyConfig,
  BackupVerificationReport,
  BackupStatistics,
  BackupFilterParams,
  BackupType,
} from '../types/backupRestore';

const MOCK_BACKUPS: BackupMetadata[] = [
  {
    _id: 'bk_001',
    backupId: 'BK-202608-00001',
    tenantId: 'tenant-clinic-001',
    clinicId: 'branch-main',
    backupName: 'Daily_Auto_20260801',
    backupType: 'AUTOMATIC',
    backupReason: 'Scheduled Daily System Protection',
    createdBy: 'usr_system',
    createdAt: '2026-08-01T00:00:00.000Z',
    applicationVersion: '2.4.0',
    databaseVersion: '2.4.0',
    schemaVersion: 14,
    contentScope: {
      databaseIncluded: true,
      uploadedFilesIncluded: true,
      attachmentsIncluded: true,
      auditLogsIncluded: true,
      reportsIncluded: true,
      settingsIncluded: true,
    },
    fileInformation: {
      filePath: 'C:/ClinicOS/backups/BK-202608-00001.cbk',
      fileName: 'BK-202608-00001.cbk',
      fileSizeBytes: 48500200,
      compressionMethod: 'ZIP_AES',
      compressionRatio: 2.45,
    },
    security: {
      encrypted: true,
      encryptionAlgorithm: 'AES-256-GCM',
      keyDerivationAlgorithm: 'Argon2id',
      passwordProtected: true,
    },
    verification: {
      checksum: 'a3f5b8c9d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8',
      checksumAlgorithm: 'SHA-256',
      integrityStatus: 'VERIFIED',
      verificationDate: '2026-08-01T00:01:15.000Z',
      verifiedBy: 'usr_system',
    },
    status: {
      backupStatus: 'COMPLETED',
      restoreCompatible: true,
      archived: false,
    },
  },
  {
    _id: 'bk_002',
    backupId: 'BK-202607-00099',
    tenantId: 'tenant-clinic-001',
    clinicId: 'branch-main',
    backupName: 'Pre_Migration_v2.4.0',
    backupType: 'PRE_UPGRADE',
    backupReason: 'Mandatory Pre-Upgrade Database Snapshot',
    createdBy: 'usr_mgr_01',
    createdAt: '2026-07-28T14:00:00.000Z',
    applicationVersion: '2.3.9',
    databaseVersion: '2.3.9',
    schemaVersion: 13,
    contentScope: {
      databaseIncluded: true,
      uploadedFilesIncluded: true,
      attachmentsIncluded: true,
      auditLogsIncluded: true,
      reportsIncluded: true,
      settingsIncluded: true,
    },
    fileInformation: {
      filePath: 'C:/ClinicOS/backups/BK-202607-00099.cbk',
      fileName: 'BK-202607-00099.cbk',
      fileSizeBytes: 46200000,
      compressionMethod: 'ZIP_AES',
      compressionRatio: 2.40,
    },
    security: {
      encrypted: true,
      encryptionAlgorithm: 'AES-256-GCM',
      keyDerivationAlgorithm: 'Argon2id',
      passwordProtected: true,
    },
    verification: {
      checksum: 'b4e6c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8',
      checksumAlgorithm: 'SHA-256',
      integrityStatus: 'VERIFIED',
      verificationDate: '2026-07-28T14:01:10.000Z',
      verifiedBy: 'usr_mgr_01',
    },
    status: {
      backupStatus: 'COMPLETED',
      restoreCompatible: true,
      archived: false,
    },
  },
];

const MOCK_RESTORES: RestoreHistoryEntry[] = [
  {
    _id: 'rst_001',
    restoreId: 'RST-202607-00001',
    backupId: 'BK-202607-00099',
    safetyBackupId: 'BK-202607-00099_SAFETY',
    tenantId: 'tenant-clinic-001',
    clinicId: 'branch-main',
    restoredBy: 'usr_mgr_01',
    restoredAt: '2026-07-28T15:30:00.000Z',
    restoreStatus: 'COMPLETED',
    rollbackPerformed: false,
    durationMs: 4250,
    applicationVersion: '2.4.0',
    databaseVersion: '2.4.0',
  },
];

const MOCK_RETENTION: RetentionPolicyConfig = {
  tenantId: 'tenant-clinic-001',
  clinicId: 'branch-main',
  retentionMode: 'LAST_10',
  retentionCount: 10,
  autoCleanupEnabled: true,
  automaticSchedule: 'DAILY',
  lastCleanupDate: '2026-08-01T00:02:00.000Z',
  updatedBy: 'usr_mgr_01',
  updatedAt: '2026-07-15T10:00:00.000Z',
};

const MOCK_STATS: BackupStatistics = {
  totalBackupsCount: 15,
  verifiedBackupsCount: 14,
  corruptedBackupsCount: 0,
  totalRestoreCount: 1,
  totalStorageSizeBytes: 727503000,
  lastBackupDate: '2026-08-01T00:00:00.000Z',
  systemHealthStatus: 'HEALTHY',
};

export const backupRestoreApi = {
  async getBackups(params?: BackupFilterParams): Promise<{ items: BackupMetadata[]; total: number }> {
    let filtered = [...MOCK_BACKUPS];

    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.backupId.toLowerCase().includes(q) ||
          b.backupName.toLowerCase().includes(q) ||
          b.createdBy.toLowerCase().includes(q)
      );
    }

    if (params?.backupType && params.backupType !== 'ALL') {
      filtered = filtered.filter((b) => b.backupType === params.backupType);
    }

    if (params?.integrityStatus && params.integrityStatus !== 'ALL') {
      filtered = filtered.filter((b) => b.verification.integrityStatus === params.integrityStatus);
    }

    return { items: filtered, total: filtered.length };
  },

  async getBackupById(id: string): Promise<BackupMetadata | null> {
    const found = MOCK_BACKUPS.find((b) => b._id === id || b.backupId === id);
    return found || null;
  },

  async createBackup(payload: { backupType: BackupType; backupName?: string; backupReason?: string }): Promise<BackupMetadata> {
    const newId = `BK-${new Date().toISOString().slice(0, 7).replace('-', '')}-${Math.floor(10000 + Math.random() * 90000)}`;
    const created: BackupMetadata = {
      _id: `bk_${Date.now()}`,
      backupId: newId,
      tenantId: 'tenant-clinic-001',
      clinicId: 'branch-main',
      backupName: payload.backupName || `Manual_Backup_${Date.now()}`,
      backupType: payload.backupType,
      backupReason: payload.backupReason || 'Manual On-Demand Backup Request',
      createdBy: 'usr_mgr_01',
      createdAt: new Date().toISOString(),
      applicationVersion: '2.4.0',
      databaseVersion: '2.4.0',
      schemaVersion: 14,
      contentScope: {
        databaseIncluded: true,
        uploadedFilesIncluded: true,
        attachmentsIncluded: true,
        auditLogsIncluded: true,
        reportsIncluded: true,
        settingsIncluded: true,
      },
      fileInformation: {
        filePath: `C:/ClinicOS/backups/${newId}.cbk`,
        fileName: `${newId}.cbk`,
        fileSizeBytes: 49100000,
        compressionMethod: 'ZIP_AES',
        compressionRatio: 2.42,
      },
      security: {
        encrypted: true,
        encryptionAlgorithm: 'AES-256-GCM',
        keyDerivationAlgorithm: 'Argon2id',
        passwordProtected: true,
      },
      verification: {
        checksum: 'c5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
        checksumAlgorithm: 'SHA-256',
        integrityStatus: 'VERIFIED',
        verificationDate: new Date().toISOString(),
        verifiedBy: 'usr_mgr_01',
      },
      status: {
        backupStatus: 'COMPLETED',
        restoreCompatible: true,
        archived: false,
      },
    };

    MOCK_BACKUPS.unshift(created);
    return created;
  },

  async verifyBackup(id: string): Promise<BackupVerificationReport> {
    const backup = await this.getBackupById(id);
    return {
      verificationId: `VRF-${Date.now()}`,
      backupId: backup?.backupId || id,
      verificationType: 'MANUAL',
      verificationResult: 'PASSED',
      checksumVerified: true,
      databaseVerified: true,
      attachmentVerified: true,
      executionTimeMs: 340,
      verifiedAt: new Date().toISOString(),
    };
  },

  async getRestoreHistory(): Promise<RestoreHistoryEntry[]> {
    return [...MOCK_RESTORES];
  },

  async getRetentionPolicy(): Promise<RetentionPolicyConfig> {
    return { ...MOCK_RETENTION };
  },

  async updateRetentionPolicy(updates: Partial<RetentionPolicyConfig>): Promise<RetentionPolicyConfig> {
    Object.assign(MOCK_RETENTION, updates, { updatedAt: new Date().toISOString() });
    return { ...MOCK_RETENTION };
  },

  async getBackupStatistics(): Promise<BackupStatistics> {
    return {
      ...MOCK_STATS,
      totalBackupsCount: MOCK_BACKUPS.length,
      lastBackupDate: MOCK_BACKUPS[0]?.createdAt || MOCK_STATS.lastBackupDate,
    };
  },
};
