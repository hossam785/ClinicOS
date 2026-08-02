// Desktop Offline Synchronization Engine API Service — Module-018

import type {
  ISyncStatusSummary,
  ISyncQueueItem,
  ISyncConflict,
  IFileSyncProgress,
  IDeviceStatus,
  ISyncLogEntry,
  ISyncDiagnostics,
  ISyncConfig,
} from '../types/syncEngine.types'

class SyncEngineApiService {
  private mockStatus: ISyncStatusSummary = {
    syncState: 'IDLE',
    isOffline: false,
    lastSuccessfulSyncAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    nextScheduledSyncAt: new Date(Date.now() + 1000 * 58).toISOString(),
    pendingQueueCount: 0,
    failedQueueCount: 0,
    conflictCount: 0,
    localSequenceVersion: 18,
    serverSequenceVersion: 18,
    deviceId: 'dev_pc_doctor_01',
    isDeviceAuthorized: true,
  }

  private mockQueue: ISyncQueueItem[] = [
    {
      queueId: 'sq_101',
      tenantId: 'tenant-default',
      clinicId: 'clinic-default',
      entityType: 'PATIENT',
      entityId: 'pat_101',
      entityTitle: 'Ahmed Ali (MRN-2026-0042)',
      operationType: 'UPDATE',
      payloadJson: JSON.stringify({ phone: '01009876543' }),
      status: 'SYNCED',
      priority: 2,
      retryCount: 0,
      maxRetries: 10,
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    },
    {
      queueId: 'sq_102',
      tenantId: 'tenant-default',
      clinicId: 'clinic-default',
      entityType: 'MEDICAL_RECORD',
      entityId: 'rec_8812',
      entityTitle: 'Progress Note — Diabetes Follow-up',
      operationType: 'CREATE',
      payloadJson: JSON.stringify({ note: 'Blood pressure 130/85' }),
      status: 'SYNCED',
      priority: 2,
      retryCount: 0,
      maxRetries: 10,
      createdAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    },
  ]

  private mockConflicts: ISyncConflict[] = []

  private mockFileTransfers: IFileSyncProgress[] = [
    {
      fileSyncId: 'fs_01',
      attachmentId: 'att_xray_042',
      fileName: 'Chest_XRay_Ahmed_Ali.dicom',
      fileSizeBytes: 26214400, // 25 MB
      uploadedBytes: 26214400,
      uploadedChunks: 5,
      totalChunks: 5,
      transferSpeedKbps: 0,
      estimatedRemainingSeconds: 0,
      uploadStatus: 'COMPLETED',
      checksum: 'e3b0c44298fc1c149afbf4c8996fb924',
    },
  ]

  private mockDeviceStatus: IDeviceStatus = {
    deviceId: 'dev_pc_doctor_01',
    deviceName: 'Dr. Mansoor PC (Clinic Room 1)',
    tenantId: 'tenant-default',
    clinicId: 'clinic-default',
    licenseStatus: 'ACTIVE',
    licenseKey: 'LIC-2026-CLINICOS-ENTERPRISE',
    authenticationStatus: 'AUTHENTICATED',
    lastHeartbeatAt: new Date().toISOString(),
    lastSuccessfulSyncAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    applicationVersion: '1.0.0',
    databaseVersion: '1.0',
    synchronizationVersion: '1.0',
  }

  private mockConfig: ISyncConfig = {
    tenantId: 'tenant-default',
    clinicId: 'clinic-default',
    automaticSync: true,
    syncIntervalSeconds: 60,
    syncAttachments: true,
    syncReports: true,
    syncNotifications: true,
    bandwidthLimitKbps: 10240,
    conflictPolicyDefault: 'ENTITY_STANDARD',
    retryLimit: 10,
  }

  async getStatus(): Promise<ISyncStatusSummary> {
    return { ...this.mockStatus }
  }

  async triggerManualSync(): Promise<{ success: boolean; recordsSynced: number }> {
    this.mockStatus.syncState = 'SYNCHRONIZING'
    await new Promise((res) => setTimeout(res, 1200))
    this.mockStatus.syncState = 'IDLE'
    this.mockStatus.lastSuccessfulSyncAt = new Date().toISOString()
    return { success: true, recordsSynced: this.mockQueue.length }
  }

  async getQueue(): Promise<ISyncQueueItem[]> {
    return [...this.mockQueue]
  }

  async retryQueueItem(queueId: string): Promise<boolean> {
    const item = this.mockQueue.find((q) => q.queueId === queueId)
    if (item) {
      item.status = 'WAITING'
      item.retryCount += 1
      return true
    }
    return false
  }

  async getConflicts(): Promise<ISyncConflict[]> {
    return [...this.mockConflicts]
  }

  async resolveConflict(
    conflictId: string,
    choice: 'KEEP_LOCAL' | 'USE_REMOTE' | 'MANUAL_MERGE'
  ): Promise<boolean> {
    const index = this.mockConflicts.findIndex((c) => c.conflictId === conflictId)
    if (index !== -1) {
      this.mockConflicts[index].resolutionStatus = 'MANUAL_RESOLVED'
      this.mockConflicts[index].conflictPolicyApplied = choice === 'KEEP_LOCAL' ? 'DESKTOP_WINS' : 'SERVER_WINS'
      this.mockStatus.conflictCount = Math.max(0, this.mockStatus.conflictCount - 1)
      return true
    }
    return false
  }

  async getFileTransfers(): Promise<IFileSyncProgress[]> {
    return [...this.mockFileTransfers]
  }

  async getDeviceStatus(): Promise<IDeviceStatus> {
    return { ...this.mockDeviceStatus }
  }

  async getSyncLogs(): Promise<ISyncLogEntry[]> {
    return [
      {
        logId: 'log_01',
        sessionId: 'ss_01',
        tenantId: 'tenant-default',
        clinicId: 'clinic-default',
        deviceId: 'dev_pc_doctor_01',
        eventType: 'SYNC_SUCCESS',
        recordCount: 2,
        durationMs: 420,
        eventHash: 'e3b0c44298fc1c149afbf4c8996fb924',
        createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
      },
    ]
  }

  async getDiagnostics(): Promise<ISyncDiagnostics> {
    return {
      internetStatus: 'CONNECTED',
      serverReachability: 'REACHABLE',
      authenticationStatus: 'VALID',
      queueHealthStatus: 'HEALTHY',
      databaseIntegrityStatus: 'INTACT',
      storageAvailableMb: 45000,
      diagnosticsCheckedAt: new Date().toISOString(),
    }
  }

  async getConfig(): Promise<ISyncConfig> {
    return { ...this.mockConfig }
  }

  async updateConfig(newConfig: Partial<ISyncConfig>): Promise<ISyncConfig> {
    this.mockConfig = { ...this.mockConfig, ...newConfig }
    return { ...this.mockConfig }
  }
}

export const syncEngineApi = new SyncEngineApiService()
