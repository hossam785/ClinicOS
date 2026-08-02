// Desktop Offline Synchronization Engine REST Controller — Module-018

import { Request, Response, NextFunction } from 'express'
import { SyncEngineService } from './syncEngine.service'
import { SyncEngineRepository } from './syncEngine.repository'
import { SyncEngineCore } from './syncEngine.core'
import { SyncEngineValidator } from './syncEngine.validator'

const repository = new SyncEngineRepository()
const core = new SyncEngineCore(repository)
export const syncEngineService = new SyncEngineService(repository, core)

export class SyncEngineController {
  // GET /api/v1/sync/status
  async getStatusSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || 'tenant-default'
      const clinicId = (req.headers['x-clinic-id'] as string) || 'clinic-default'
      const summary = await syncEngineService.getStatusSummary(tenantId, clinicId)

      res.status(200).json({
        status: 'success',
        data: summary,
      })
    } catch (err) {
      next(err)
    }
  }

  // POST /api/v1/sync/device/register
  async registerDevice(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || 'tenant-default'
      const clinicId = (req.headers['x-clinic-id'] as string) || 'clinic-default'
      SyncEngineValidator.validateRegisterDevice(req.body)

      const result = await syncEngineService.registerDevice(tenantId, clinicId, req.body)

      res.status(201).json({
        status: 'success',
        data: result,
      })
    } catch (err) {
      next(err)
    }
  }

  // POST /api/v1/sync/device/heartbeat
  async processHeartbeat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { deviceId, currentLocalVersion } = req.body || {}
      SyncEngineValidator.validateHeartbeat(deviceId, currentLocalVersion)
      const result = await syncEngineService.processHeartbeat(deviceId, currentLocalVersion)

      res.status(200).json({
        status: 'success',
        data: result,
      })
    } catch (err) {
      next(err)
    }
  }

  // POST /api/v1/sync/incremental
  async processIncrementalDelta(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || 'tenant-default'
      const clinicId = (req.headers['x-clinic-id'] as string) || 'clinic-default'
      SyncEngineValidator.validateIncrementalDelta(req.body)

      const result = await syncEngineService.processIncrementalDelta(tenantId, clinicId, req.body)

      res.status(200).json({
        status: 'success',
        data: result,
      })
    } catch (err) {
      next(err)
    }
  }

  // POST /api/v1/sync/files/upload
  async processFileChunkUpload(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || 'tenant-default'
      const clinicId = (req.headers['x-clinic-id'] as string) || 'clinic-default'

      const attachmentId = (req.headers['x-attachment-id'] as string) || 'att_default'
      const chunkIndex = Number(req.headers['x-chunk-index'] || 0)
      const totalChunks = Number(req.headers['x-total-chunks'] || 1)
      const sha256Checksum = (req.headers['x-chunk-sha256'] as string) || 'checksum_default'
      const chunkSizeBytes = req.body ? req.body.length || 5242880 : 5242880

      const result = await syncEngineService.processFileChunkUpload(
        tenantId,
        clinicId,
        attachmentId,
        chunkIndex,
        totalChunks,
        chunkSizeBytes,
        sha256Checksum
      )

      res.status(200).json({
        status: 'success',
        data: result,
      })
    } catch (err) {
      next(err)
    }
  }

  // GET /api/v1/sync/queue
  async getQueue(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || 'tenant-default'
      const clinicId = (req.headers['x-clinic-id'] as string) || 'clinic-default'
      const queue = await syncEngineService.getQueue(tenantId, clinicId)

      res.status(200).json({
        status: 'success',
        data: queue,
      })
    } catch (err) {
      next(err)
    }
  }

  // POST /api/v1/sync/queue/retry
  async retryQueue(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || 'tenant-default'
      const clinicId = (req.headers['x-clinic-id'] as string) || 'clinic-default'

      const result = await syncEngineService.retryQueue(tenantId, clinicId, req.body?.queueIds)

      res.status(200).json({
        status: 'success',
        data: result,
      })
    } catch (err) {
      next(err)
    }
  }

  // GET /api/v1/sync/conflicts
  async getConflicts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || 'tenant-default'
      const clinicId = (req.headers['x-clinic-id'] as string) || 'clinic-default'
      const conflicts = await syncEngineService.getConflicts(tenantId, clinicId)

      res.status(200).json({
        status: 'success',
        data: conflicts,
      })
    } catch (err) {
      next(err)
    }
  }

  // POST /api/v1/sync/conflicts/:conflictId/resolve
  async resolveConflict(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { conflictId } = req.params
      SyncEngineValidator.validateResolveConflict(req.body)

      const result = await syncEngineService.resolveConflict(conflictId, req.body)

      res.status(200).json({
        status: 'success',
        data: result,
      })
    } catch (err) {
      next(err)
    }
  }

  // GET /api/v1/sync/logs
  async getSyncLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || 'tenant-default'
      const clinicId = (req.headers['x-clinic-id'] as string) || 'clinic-default'
      const logs = await syncEngineService.getSyncLogs(tenantId, clinicId)

      res.status(200).json({
        status: 'success',
        data: logs,
      })
    } catch (err) {
      next(err)
    }
  }

  // GET /api/v1/sync/diagnostics
  async getDiagnostics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const diagnostics = await syncEngineService.getDiagnostics()

      res.status(200).json({
        status: 'success',
        data: diagnostics,
      })
    } catch (err) {
      next(err)
    }
  }

  // GET /api/v1/sync/config
  async getConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || 'tenant-default'
      const clinicId = (req.headers['x-clinic-id'] as string) || 'clinic-default'
      const config = await syncEngineService.getConfig(tenantId, clinicId)

      res.status(200).json({
        status: 'success',
        data: config,
      })
    } catch (err) {
      next(err)
    }
  }

  // PATCH /api/v1/sync/config
  async updateConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || 'tenant-default'
      const clinicId = (req.headers['x-clinic-id'] as string) || 'clinic-default'

      const updated = await syncEngineService.updateConfig(tenantId, clinicId, req.body || {})

      res.status(200).json({
        status: 'success',
        data: updated,
      })
    } catch (err) {
      next(err)
    }
  }
}

export const syncEngineController = new SyncEngineController()
