// Express Controller for Offline AI Medical Assistant — Module-017

import { Response, NextFunction } from 'express'
import type { AuthenticatedRequest } from '@/modules/auth/auth.types'
import { AIAssistantService } from './aiAssistant.service'

export class AIAssistantController {
  static async query(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.user?.tenantId || 'tenant-default'
      const clinicId = 'clinic-default'
      const user = req.user || { userId: 'usr_doc_01', role: 'DOCTOR', tenantId: 'tenant-default' }

      const result = await AIAssistantService.processQuery(req.body, {
        tenantId,
        clinicId,
        userId: user.userId,
        userRole: user.role,
      })

      res.status(200).json({
        status: 'success',
        data: result,
      })
    } catch (err) {
      next(err)
    }
  }

  static async getStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userRole = req.user?.role || 'DOCTOR'
      const status = await AIAssistantService.getEngineStatus(userRole)

      res.status(200).json({
        status: 'success',
        data: status,
      })
    } catch (err) {
      next(err)
    }
  }

  static async listSessions(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.user?.tenantId || 'tenant-default'
      const clinicId = 'clinic-default'
      const userId = req.user?.userId || 'usr_doc_01'

      const sessions = await AIAssistantService.listSessions(tenantId, clinicId, userId)

      res.status(200).json({
        status: 'success',
        data: sessions,
      })
    } catch (err) {
      next(err)
    }
  }

  static async rebuildIndex(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.user?.tenantId || 'tenant-default'
      const clinicId = 'clinic-default'

      const result = await AIAssistantService.rebuildIndex(tenantId, clinicId)

      res.status(200).json({
        status: 'success',
        data: result,
      })
    } catch (err) {
      next(err)
    }
  }
}
