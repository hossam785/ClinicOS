// Audit Logs Express Controllers — ClinicOS

import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '@/modules/auth/auth.types'
import { auditLogsRepository } from './auditLogs.repository'
import { auditEngineService } from './auditEngine.service'
import { AppError } from '@/shared/errors/AppError'
import type { AuditFilterParams } from './auditLogs.types'

export class AuditLogsController {
  /**
   * GET /api/v1/audit-logs
   * Retrieves paginated audit roster with multi-parameter filtering.
   */
  async getAuditLogs(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.user?.tenantId
      const role = req.user?.role

      if (!tenantId) {
        return next(new AppError('Unauthorized access context missing tenant ID.', 401, 'UNAUTHORIZED'))
      }

      // Security RBAC Gate
      if (role === 'Receptionist' || role === 'Nurse') {
        return next(new AppError('Role is unauthorized to inspect audit logs.', 403, 'AUDIT_ACCESS_RESTRICTED'))
      }

      // Platform Owner Isolation Barrier
      if (tenantId === 'PLATFORM' || role === 'SUPER_ADMIN') {
        // Return platform system logs only
        const platformLogs = await auditLogsRepository.findPaginated('PLATFORM', {
          page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
          limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20,
        })

        res.status(200).json({
          success: true,
          data: {
            items: platformLogs.items,
            pagination: {
              totalItems: platformLogs.total,
              totalPages: Math.ceil(platformLogs.total / 20) || 1,
              currentPage: 1,
              limit: 20,
              hasNextPage: false,
              hasPrevPage: false,
            },
          },
          meta: { timestamp: new Date().toISOString() },
        })
        return
      }

      const params: AuditFilterParams = {
        page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 20,
        module: req.query.module as AuditFilterParams['module'],
        severity: req.query.severity as AuditFilterParams['severity'],
        action: req.query.action as string,
        userId: req.query.userId as string,
        entityType: req.query.entityType as string,
        entityId: req.query.entityId as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        search: req.query.search as string,
      }

      const result = await auditLogsRepository.findPaginated(tenantId, params)

      const limit = params.limit || 20
      const currentPage = params.page || 1
      const totalPages = Math.ceil(result.total / limit) || 1

      res.status(200).json({
        success: true,
        data: {
          items: result.items,
          pagination: {
            totalItems: result.total,
            totalPages,
            currentPage,
            limit,
            hasNextPage: currentPage < totalPages,
            hasPrevPage: currentPage > 1,
          },
        },
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/v1/audit-logs/:id
   * Inspects complete audit record metadata and sanitized state diff.
   */
  async getAuditLogById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.user?.tenantId
      const role = req.user?.role
      const { id } = req.params

      if (!tenantId) {
        return next(new AppError('Unauthorized access context missing tenant ID.', 401, 'UNAUTHORIZED'))
      }

      if (role === 'Receptionist' || role === 'Nurse') {
        return next(new AppError('Role is unauthorized to inspect audit logs.', 403, 'AUDIT_ACCESS_RESTRICTED'))
      }

      const record = await auditLogsRepository.findById(tenantId, id)
      if (!record) {
        return next(new AppError('Audit record not found.', 404, 'AUDIT_RECORD_NOT_FOUND'))
      }

      res.status(200).json({
        success: true,
        data: record,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/v1/audit-logs/recent
   * Optimized widget endpoint returning 10 most recent system audit events.
   */
  async getRecentAuditEvents(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.user?.tenantId
      if (!tenantId) {
        return next(new AppError('Unauthorized access context missing tenant ID.', 401, 'UNAUTHORIZED'))
      }

      const recentEvents = await auditLogsRepository.findRecent(tenantId, 10)

      res.status(200).json({
        success: true,
        data: { recentEvents },
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/v1/audit-logs/critical
   * Unacknowledged high-priority security critical alerts.
   */
  async getCriticalAuditEvents(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.user?.tenantId
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10

      if (!tenantId) {
        return next(new AppError('Unauthorized access context missing tenant ID.', 401, 'UNAUTHORIZED'))
      }

      const criticalEvents = await auditLogsRepository.findCritical(tenantId, limit)

      res.status(200).json({
        success: true,
        data: { criticalEvents },
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/v1/audit-logs/statistics
   * Returns aggregated statistics metrics summarizing audit counts.
   */
  async getAuditStatistics(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.user?.tenantId
      if (!tenantId) {
        return next(new AppError('Unauthorized access context missing tenant ID.', 401, 'UNAUTHORIZED'))
      }

      const stats = await auditLogsRepository.aggregateStatistics(tenantId)

      res.status(200).json({
        success: true,
        data: stats,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /api/v1/audit-logs/export
   * Generates document statement export (PDF, Excel, CSV).
   */
  async exportAuditLogs(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.user?.tenantId
      const userId = req.user?.userId || 'usr_mgr_01'
      const role = req.user?.role || 'ClinicAdmin'

      if (!tenantId) {
        return next(new AppError('Unauthorized access context missing tenant ID.', 401, 'UNAUTHORIZED'))
      }

      const result = await auditEngineService.generateAuditExport(
        tenantId,
        userId,
        req.user?.email || 'Sarah Jenkins',
        role,
        req.body
      )

      res.status(200).json({
        success: true,
        data: result,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /api/v1/audit-logs/sync
   * Uploads offline desktop audit queue batch.
   */
  async syncAuditLogs(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.user?.tenantId
      const userId = req.user?.userId || 'usr_mgr_01'
      const role = req.user?.role || 'ClinicAdmin'

      if (!tenantId) {
        return next(new AppError('Unauthorized access context missing tenant ID.', 401, 'UNAUTHORIZED'))
      }

      const result = await auditEngineService.processOfflineSync(
        tenantId,
        userId,
        req.user?.email || 'Sarah Jenkins',
        role,
        req.body
      )

      res.status(200).json({
        success: true,
        data: result,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }
}

export const auditLogsController = new AuditLogsController()
