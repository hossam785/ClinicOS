// Backup & Restore HTTP Controllers — ClinicOS
// Express route controllers for Module-014 API operations.

import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '@/modules/auth/auth.types'
import { AppError } from '@/shared/errors/AppError'
import { backupRestoreService, UserContext } from './backupRestore.service'

const ALLOWED_BACKUP_ROLES = ['ClinicOwner', 'ClinicAdmin', 'ClinicManager', 'ADMIN', 'MANAGER', 'OWNER']

export class BackupRestoreController {
  /**
   * Enforces Platform Owner privacy barrier & RBAC permission guards.
   */
  private enforceSecurityGuards(req: AuthenticatedRequest): UserContext {
    const user = req.user
    const tenantId = (req.headers['x-tenant-id'] as string) || user?.tenantId || 'tenant-clinic-001'

    if (!user) {
      throw new AppError('Authentication credentials required.', 401, 'UNAUTHORIZED')
    }

    // Platform Owner Barrier Guard
    if (tenantId === 'PLATFORM' || user.role === 'SUPER_ADMIN') {
      throw new AppError(
        'Platform administrators cannot perform operational clinic backup or restore actions.',
        403,
        'PLATFORM_ADMIN_BACKUP_RESTRICTED'
      )
    }

    // RBAC Permission Guard
    if (!ALLOWED_BACKUP_ROLES.includes(user.role)) {
      throw new AppError(
        'Insufficient privileges to perform backup and disaster recovery operations.',
        403,
        'BACKUP_ACCESS_RESTRICTED'
      )
    }

    return {
      userId: user.userId || 'usr_unknown',
      userRole: user.role,
      userDisplayName: user.email || user.role,
      tenantId,
      clinicId: 'branch-main',
    }
  }

  /**
   * Trigger Manual / Emergency Backup
   * POST /api/v1/backups
   */
  async triggerBackup(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const ctx = this.enforceSecurityGuards(req)
      const data = await backupRestoreService.triggerBackup(ctx, req.body)

      res.status(201).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get Backup Metadata Roster
   * GET /api/v1/backups
   */
  async getBackups(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const ctx = this.enforceSecurityGuards(req)
      const data = await backupRestoreService.getBackupsList(ctx.tenantId, req.query)

      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get Backup Details by ID
   * GET /api/v1/backups/:id
   */
  async getBackupById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const ctx = this.enforceSecurityGuards(req)
      const data = await backupRestoreService.getBackupById(ctx.tenantId, req.params.id)

      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Verify Checksum & Integrity Status
   * POST /api/v1/backups/:id/verify
   */
  async verifyBackup(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const ctx = this.enforceSecurityGuards(req)
      const data = await backupRestoreService.verifyBackup(ctx, req.params.id)

      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Execute System Disaster Restore
   * POST /api/v1/backups/:id/restore
   */
  async restoreBackup(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const ctx = this.enforceSecurityGuards(req)
      const data = await backupRestoreService.restoreBackup(ctx, req.params.id, req.body)

      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get Restore Execution History
   * GET /api/v1/backups/restores
   */
  async getRestoreHistory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const ctx = this.enforceSecurityGuards(req)
      const restores = await backupRestoreService.getRestoreHistory(ctx.tenantId)

      res.status(200).json({
        success: true,
        data: { restores },
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get Retention Policy
   * GET /api/v1/backups/retention
   */
  async getRetentionPolicy(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const ctx = this.enforceSecurityGuards(req)
      const data = await backupRestoreService.getRetentionPolicy(ctx.tenantId)

      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Update Retention Policy
   * PUT /api/v1/backups/retention
   */
  async updateRetentionPolicy(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const ctx = this.enforceSecurityGuards(req)
      const data = await backupRestoreService.updateRetentionPolicy(ctx, req.body)

      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Get Backup Statistics & Health Status
   * GET /api/v1/backups/statistics
   */
  async getStatistics(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const ctx = this.enforceSecurityGuards(req)
      const data = await backupRestoreService.getStatistics(ctx.tenantId)

      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Offline Desktop Backup Metadata Sync
   * POST /api/v1/backups/sync
   */
  async syncBackupMetadata(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const ctx = this.enforceSecurityGuards(req)
      const data = await backupRestoreService.syncBackupMetadata(ctx, req.body)

      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }
}

export const backupRestoreController = new BackupRestoreController()
