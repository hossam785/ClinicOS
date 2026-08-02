// Backup & Restore Repository Layer — ClinicOS
// Handles data persistence, querying, covered index simulation, and retention management for Module-014.

import type {
  IBackupMetadata,
  IBackupRestoreHistory,
  IBackupRetentionPolicy,
  IBackupVerificationHistory,
  BackupQueryParams,
  BackupStatisticsData,
} from './backupRestore.types'

export class BackupRestoreRepository {
  private backupsStore: IBackupMetadata[] = []
  private restoreHistoryStore: IBackupRestoreHistory[] = []
  private retentionPolicyStore: Map<string, IBackupRetentionPolicy> = new Map()
  private verificationHistoryStore: IBackupVerificationHistory[] = []

  constructor() {
    this.seedInitialData()
  }

  private seedInitialData(): void {
    const defaultTenant = 'tenant-clinic-001'
    const defaultClinic = 'branch-main'

    // Initial Retention Policy
    this.retentionPolicyStore.set(defaultTenant, {
      _id: 'ret_policy_001',
      tenantId: defaultTenant,
      clinicId: defaultClinic,
      retentionMode: 'LAST_10',
      retentionCount: 10,
      autoCleanupEnabled: true,
      lastCleanupDate: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedBy: 'usr_mgr_01',
      updatedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    })

    // Initial Seed Backups
    const sampleBackups: IBackupMetadata[] = [
      {
        _id: 'bk_meta_001',
        backupId: 'BK-202608-00001',
        tenantId: defaultTenant,
        clinicId: defaultClinic,
        backupName: 'Daily_Auto_20260801',
        backupType: 'AUTOMATIC',
        backupReason: 'Scheduled Daily System Protection',
        createdBy: 'usr_system',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
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
          verificationDate: new Date(Date.now() - 86400000 * 2 + 75000).toISOString(),
          verifiedBy: 'usr_system',
        },
        status: {
          backupStatus: 'COMPLETED',
          restoreCompatible: true,
          archived: false,
        },
      },
      {
        _id: 'bk_meta_002',
        backupId: 'BK-202608-00002',
        tenantId: defaultTenant,
        clinicId: defaultClinic,
        backupName: 'Pre_Migration_Snapshot_20260801',
        backupType: 'MANUAL',
        backupReason: 'Manual snapshot prior to system configuration update',
        createdBy: 'usr_mgr_01',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
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
          filePath: 'C:/ClinicOS/backups/BK-202608-00002.cbk',
          fileName: 'BK-202608-00002.cbk',
          fileSizeBytes: 52100400,
          compressionMethod: 'ZIP_AES',
          compressionRatio: 2.38,
        },
        security: {
          encrypted: true,
          encryptionAlgorithm: 'AES-256-GCM',
          keyDerivationAlgorithm: 'Argon2id',
          passwordProtected: true,
        },
        verification: {
          checksum: 'b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0',
          checksumAlgorithm: 'SHA-256',
          integrityStatus: 'VERIFIED',
          verificationDate: new Date(Date.now() - 86400000 + 45000).toISOString(),
          verifiedBy: 'usr_mgr_01',
        },
        status: {
          backupStatus: 'COMPLETED',
          restoreCompatible: true,
          archived: false,
        },
      },
    ]

    this.backupsStore.push(...sampleBackups)
  }

  async createBackup(metadata: IBackupMetadata): Promise<IBackupMetadata> {
    this.backupsStore.unshift(metadata)
    return metadata
  }

  async findBackupById(tenantId: string, backupId: string): Promise<IBackupMetadata | null> {
    const backup = this.backupsStore.find(
      (b) => b.tenantId === tenantId && (b.backupId === backupId || b._id === backupId)
    )
    return backup || null
  }

  async getBackupsList(
    tenantId: string,
    params: BackupQueryParams
  ): Promise<{ items: IBackupMetadata[]; totalItems: number; totalPages: number }> {
    const page = params.page || 1
    const limit = params.limit || 20

    let filtered = this.backupsStore.filter(
      (b) => b.tenantId === tenantId && !b.status.archived
    )

    if (params.backupType) {
      filtered = filtered.filter((b) => b.backupType === params.backupType)
    }

    if (params.integrityStatus) {
      filtered = filtered.filter((b) => b.verification.integrityStatus === params.integrityStatus)
    }

    if (params.startDate) {
      const startMs = new Date(params.startDate).getTime()
      filtered = filtered.filter((b) => new Date(b.createdAt).getTime() >= startMs)
    }

    if (params.endDate) {
      const endMs = new Date(params.endDate).getTime()
      filtered = filtered.filter((b) => new Date(b.createdAt).getTime() <= endMs)
    }

    if (params.search) {
      const query = params.search.toLowerCase()
      filtered = filtered.filter(
        (b) =>
          b.backupName.toLowerCase().includes(query) ||
          b.backupId.toLowerCase().includes(query) ||
          b.backupReason.toLowerCase().includes(query)
      )
    }

    // Sort by createdAt descending
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const totalItems = filtered.length
    const totalPages = Math.ceil(totalItems / limit) || 1
    const startIndex = (page - 1) * limit
    const items = filtered.slice(startIndex, startIndex + limit)

    return { items, totalItems, totalPages }
  }

  async updateVerificationStatus(
    tenantId: string,
    backupId: string,
    verificationInfo: IBackupMetadata['verification']
  ): Promise<IBackupMetadata | null> {
    const backup = await this.findBackupById(tenantId, backupId)
    if (!backup) return null

    backup.verification = verificationInfo
    return backup
  }

  async recordRestoreAttempt(history: IBackupRestoreHistory): Promise<IBackupRestoreHistory> {
    this.restoreHistoryStore.unshift(history)
    return history
  }

  async getRestoreHistory(tenantId: string): Promise<IBackupRestoreHistory[]> {
    return this.restoreHistoryStore.filter((r) => r.tenantId === tenantId)
  }

  async recordVerificationHistory(
    record: IBackupVerificationHistory
  ): Promise<IBackupVerificationHistory> {
    this.verificationHistoryStore.unshift(record)
    return record
  }

  async getRetentionPolicy(tenantId: string, clinicId = 'branch-main'): Promise<IBackupRetentionPolicy> {
    let policy = this.retentionPolicyStore.get(tenantId)
    if (!policy) {
      policy = {
        _id: `ret_policy_${Date.now()}`,
        tenantId,
        clinicId,
        retentionMode: 'LAST_10',
        retentionCount: 10,
        autoCleanupEnabled: true,
        updatedBy: 'usr_system',
        updatedAt: new Date().toISOString(),
      }
      this.retentionPolicyStore.set(tenantId, policy)
    }
    return policy
  }

  async updateRetentionPolicy(
    tenantId: string,
    updates: Partial<IBackupRetentionPolicy>
  ): Promise<IBackupRetentionPolicy> {
    const existing = await this.getRetentionPolicy(tenantId)
    const updated: IBackupRetentionPolicy = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    this.retentionPolicyStore.set(tenantId, updated)
    return updated
  }

  async aggregateStatistics(tenantId: string): Promise<BackupStatisticsData> {
    const tenantBackups = this.backupsStore.filter(
      (b) => b.tenantId === tenantId && !b.status.archived
    )
    const tenantRestores = this.restoreHistoryStore.filter((r) => r.tenantId === tenantId)

    const totalBackupsCount = tenantBackups.length
    const verifiedBackupsCount = tenantBackups.filter(
      (b) => b.verification.integrityStatus === 'VERIFIED'
    ).length
    const corruptedBackupsCount = tenantBackups.filter(
      (b) => b.verification.integrityStatus === 'CORRUPTED'
    ).length
    const totalRestoreCount = tenantRestores.length

    const totalStorageSizeBytes = tenantBackups.reduce(
      (acc, b) => acc + (b.fileInformation?.fileSizeBytes || 0),
      0
    )

    const sortedByDate = [...tenantBackups].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    const lastBackupDate = sortedByDate[0]?.createdAt

    let systemHealthStatus: 'HEALTHY' | 'DEGRADED' | 'CRITICAL' = 'HEALTHY'
    if (corruptedBackupsCount > 0) {
      systemHealthStatus = 'DEGRADED'
    }
    if (totalBackupsCount > 0 && verifiedBackupsCount === 0) {
      systemHealthStatus = 'CRITICAL'
    }

    return {
      totalBackupsCount,
      verifiedBackupsCount,
      corruptedBackupsCount,
      totalRestoreCount,
      totalStorageSizeBytes,
      lastBackupDate,
      systemHealthStatus,
    }
  }

  async executeRetentionCleanup(tenantId: string): Promise<{ deletedCount: number }> {
    const policy = await this.getRetentionPolicy(tenantId)
    if (!policy.autoCleanupEnabled || policy.retentionMode === 'UNLIMITED') {
      return { deletedCount: 0 }
    }

    let maxAllowed = 10
    if (policy.retentionMode === 'LAST_5') maxAllowed = 5
    if (policy.retentionMode === 'LAST_10') maxAllowed = 10
    if (policy.retentionMode === 'LAST_20') maxAllowed = 20

    const tenantBackups = this.backupsStore
      .filter((b) => b.tenantId === tenantId && !b.status.archived)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    if (tenantBackups.length <= maxAllowed) {
      return { deletedCount: 0 }
    }

    // Protect latest verified backup and safety backups linked to restore history
    const activeRestoreSafetyIds = new Set(
      this.restoreHistoryStore.map((r) => r.safetyBackupId)
    )
    const latestVerified = tenantBackups.find((b) => b.verification.integrityStatus === 'VERIFIED')

    const candidatesForDeletion = tenantBackups.slice(maxAllowed)
    let deletedCount = 0

    for (const backup of candidatesForDeletion) {
      if (latestVerified && backup.backupId === latestVerified.backupId) {
        continue // Protect latest verified
      }
      if (activeRestoreSafetyIds.has(backup.backupId)) {
        continue // Protect safety backup in active restore history
      }

      backup.status.archived = true
      deletedCount++
    }

    policy.lastCleanupDate = new Date().toISOString()
    this.retentionPolicyStore.set(tenantId, policy)

    return { deletedCount }
  }
}

export const backupRestoreRepository = new BackupRestoreRepository()
