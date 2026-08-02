// Desktop Offline Synchronization Engine Repository — Module-018

import type {
  ISyncStatusSummary,
  ISyncQueueItem,
  ISyncConflict,
  IFileSyncChunk,
  IDeviceRegistration,
  ISyncSession,
  ISyncLogEntry,
  ISyncDiagnostics,
  ISyncConfig,
} from './syncEngine.types'

export class SyncEngineRepository {
  private statusSummary: ISyncStatusSummary = {
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

  private queueStore: Map<string, ISyncQueueItem> = new Map([
    [
      'sq_101',
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
    ],
  ])

  private conflictsStore: Map<string, ISyncConflict> = new Map()

  private fileChunksStore: Map<string, IFileSyncChunk> = new Map()

  private deviceStore: Map<string, IDeviceRegistration> = new Map([
    [
      'dev_pc_doctor_01',
      {
        deviceId: 'dev_pc_doctor_01',
        deviceName: 'Dr. Mansoor PC (Clinic Room 1)',
        tenantId: 'tenant-default',
        clinicId: 'clinic-default',
        licenseKey: 'LIC-2026-CLINICOS-ENTERPRISE',
        deviceSecretHash: 'hash_sec_dev_991823ab881920',
        deviceFingerprint: 'hw_hash_a8f9001b223c4d5e',
        osPlatform: 'WINDOWS_11_X64',
        appVersion: '1.0.0',
        licenseStatus: 'ACTIVE',
        authenticationStatus: 'AUTHENTICATED',
        lastHeartbeatAt: new Date().toISOString(),
        lastSuccessfulSyncAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
        registeredAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
    ],
  ])

  private sessionsStore: Map<string, ISyncSession> = new Map()

  private logsStore: ISyncLogEntry[] = [
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

  private configStore: ISyncConfig = {
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

  async getStatusSummary(tenantId: string, clinicId: string): Promise<ISyncStatusSummary> {
    const pending = Array.from(this.queueStore.values()).filter(
      (q) => q.tenantId === tenantId && q.clinicId === clinicId && q.status === 'WAITING'
    ).length

    const failed = Array.from(this.queueStore.values()).filter(
      (q) => q.tenantId === tenantId && q.clinicId === clinicId && q.status === 'FAILED'
    ).length

    const conflicts = Array.from(this.conflictsStore.values()).filter(
      (c) => c.tenantId === tenantId && c.clinicId === clinicId && c.resolutionStatus === 'PENDING_MANUAL'
    ).length

    return {
      ...this.statusSummary,
      pendingQueueCount: pending,
      failedQueueCount: failed,
      conflictCount: conflicts,
    }
  }

  async registerDevice(device: IDeviceRegistration): Promise<IDeviceRegistration> {
    this.deviceStore.set(device.deviceId, device)
    return device
  }

  async getDevice(deviceId: string): Promise<IDeviceRegistration | null> {
    return this.deviceStore.get(deviceId) || null
  }

  async updateHeartbeat(deviceId: string): Promise<boolean> {
    const dev = this.deviceStore.get(deviceId)
    if (dev) {
      dev.lastHeartbeatAt = new Date().toISOString()
      return true
    }
    return false
  }

  async getQueueItems(tenantId: string, clinicId: string): Promise<ISyncQueueItem[]> {
    return Array.from(this.queueStore.values()).filter(
      (q) => q.tenantId === tenantId && q.clinicId === clinicId
    )
  }

  async enqueueOperation(item: ISyncQueueItem): Promise<ISyncQueueItem> {
    this.queueStore.set(item.queueId, item)
    return item
  }

  async updateQueueStatus(queueId: string, status: ISyncQueueItem['status'], errorMsg?: string): Promise<boolean> {
    const item = this.queueStore.get(queueId)
    if (item) {
      item.status = status
      item.updatedAt = new Date().toISOString()
      if (errorMsg) item.errorMessage = errorMsg
      return true
    }
    return false
  }

  async saveConflict(conflict: ISyncConflict): Promise<ISyncConflict> {
    this.conflictsStore.set(conflict.conflictId, conflict)
    return conflict
  }

  async getConflicts(tenantId: string, clinicId: string): Promise<ISyncConflict[]> {
    return Array.from(this.conflictsStore.values()).filter(
      (c) => c.tenantId === tenantId && c.clinicId === clinicId
    )
  }

  async resolveConflict(conflictId: string, policy: ISyncConflict['conflictPolicyApplied']): Promise<boolean> {
    const cnf = this.conflictsStore.get(conflictId)
    if (cnf) {
      cnf.resolutionStatus = 'MANUAL_RESOLVED'
      cnf.conflictPolicyApplied = policy
      cnf.resolvedAt = new Date().toISOString()
      return true
    }
    return false
  }

  async saveFileChunk(chunk: IFileSyncChunk): Promise<IFileSyncChunk> {
    this.fileChunksStore.set(chunk.chunkId, chunk)
    return chunk
  }

  async getFileChunks(attachmentId: string): Promise<IFileSyncChunk[]> {
    return Array.from(this.fileChunksStore.values()).filter((c) => c.attachmentId === attachmentId)
  }

  async saveSyncLog(log: ISyncLogEntry): Promise<ISyncLogEntry> {
    this.logsStore.unshift(log)
    return log
  }

  async getSyncLogs(tenantId: string, clinicId: string): Promise<ISyncLogEntry[]> {
    return this.logsStore.filter((l) => l.tenantId === tenantId && l.clinicId === clinicId)
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

  async getConfig(tenantId: string, clinicId: string): Promise<ISyncConfig> {
    return { ...this.configStore, tenantId, clinicId }
  }

  async updateConfig(tenantId: string, clinicId: string, updates: Partial<ISyncConfig>): Promise<ISyncConfig> {
    this.configStore = { ...this.configStore, ...updates, tenantId, clinicId }
    return { ...this.configStore }
  }
}
