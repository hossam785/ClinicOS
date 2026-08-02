// Desktop Offline Synchronization Engine Service — Module-018

import type {
  ISyncStatusSummary,
  ISyncQueueItem,
  ISyncConflict,
  ISyncLogEntry,
  ISyncDiagnostics,
  ISyncConfig,
  IIncrementalDeltaPayload,
  IResolveConflictPayload,
} from './syncEngine.types'
import { SyncEngineRepository } from './syncEngine.repository'
import { SyncEngineCore } from './syncEngine.core'

export class SyncEngineService {
  private repository: SyncEngineRepository
  private core: SyncEngineCore

  constructor(repository: SyncEngineRepository, core: SyncEngineCore) {
    this.repository = repository
    this.core = core
  }

  async getStatusSummary(tenantId: string, clinicId: string): Promise<ISyncStatusSummary> {
    return this.repository.getStatusSummary(tenantId, clinicId)
  }

  async registerDevice(
    tenantId: string,
    clinicId: string,
    payload: {
      licenseKey: string
      deviceName: string
      deviceFingerprint: string
      osPlatform: string
      appVersion: string
    }
  ): Promise<{ deviceId: string; deviceSecret: string; registeredAt: string }> {
    return this.core.processDeviceRegistration(tenantId, clinicId, payload)
  }

  async processHeartbeat(
    deviceId: string,
    currentLocalVersion: number
  ): Promise<{
    currentServerVersion: number
    hasPendingServerDeltas: boolean
    licenseStatus: string
    recommendedSyncIntervalSeconds: number
  }> {
    await this.repository.updateHeartbeat(deviceId)
    const device = await this.repository.getDevice(deviceId)

    return {
      currentServerVersion: currentLocalVersion,
      hasPendingServerDeltas: false,
      licenseStatus: device?.licenseStatus || 'ACTIVE',
      recommendedSyncIntervalSeconds: 60,
    }
  }

  async processIncrementalDelta(tenantId: string, clinicId: string, payload: IIncrementalDeltaPayload) {
    return this.core.processIncrementalDelta(tenantId, clinicId, payload)
  }

  async processFileChunkUpload(
    tenantId: string,
    clinicId: string,
    attachmentId: string,
    chunkIndex: number,
    totalChunks: number,
    chunkSizeBytes: number,
    sha256Checksum: string
  ) {
    return this.core.processFileChunkUpload(
      tenantId,
      clinicId,
      attachmentId,
      chunkIndex,
      totalChunks,
      chunkSizeBytes,
      sha256Checksum
    )
  }

  async getQueue(tenantId: string, clinicId: string): Promise<ISyncQueueItem[]> {
    return this.repository.getQueueItems(tenantId, clinicId)
  }

  async retryQueue(tenantId: string, clinicId: string, queueIds?: string[]): Promise<{ retriedCount: number }> {
    const queue = await this.repository.getQueueItems(tenantId, clinicId)
    let count = 0
    for (const item of queue) {
      if (item.status === 'FAILED' && (!queueIds || queueIds.includes(item.queueId))) {
        await this.repository.updateQueueStatus(item.queueId, 'WAITING')
        count += 1
      }
    }
    return { retriedCount: count }
  }

  async getConflicts(tenantId: string, clinicId: string): Promise<ISyncConflict[]> {
    return this.repository.getConflicts(tenantId, clinicId)
  }

  async resolveConflict(conflictId: string, payload: IResolveConflictPayload): Promise<{ success: boolean }> {
    const policy = payload.resolutionChoice === 'KEEP_LOCAL' ? 'DESKTOP_WINS' : 'SERVER_WINS'
    const success = await this.repository.resolveConflict(conflictId, policy)
    return { success }
  }

  async getSyncLogs(tenantId: string, clinicId: string): Promise<ISyncLogEntry[]> {
    return this.repository.getSyncLogs(tenantId, clinicId)
  }

  async getDiagnostics(): Promise<ISyncDiagnostics> {
    return this.repository.getDiagnostics()
  }

  async getConfig(tenantId: string, clinicId: string): Promise<ISyncConfig> {
    return this.repository.getConfig(tenantId, clinicId)
  }

  async updateConfig(tenantId: string, clinicId: string, updates: Partial<ISyncConfig>): Promise<ISyncConfig> {
    return this.repository.updateConfig(tenantId, clinicId, updates)
  }
}
