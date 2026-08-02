import { Request, Response, NextFunction } from 'express'
import { ClinicService } from './clinic.service'
import { ClinicValidator } from './clinic.validator'
import type { AuthenticatedRequest } from '../auth/auth.types'

export class ClinicController {
  public static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || (req as AuthenticatedRequest).user?.tenantId
      if (!tenantId) {
        res.status(400).json({ success: false, error: { message: 'Missing tenant scoping identifier.' } })
        return
      }

      const clinic = await ClinicService.getClinicProfile(tenantId)

      res.status(200).json({
        success: true,
        data: clinic,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (req.headers['x-correlation-id'] as string) || 'none',
        },
      })
    } catch (err) {
      next(err)
    }
  }

  public static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || (req as AuthenticatedRequest).user?.tenantId
      const actorId = (req as AuthenticatedRequest).user?.userId || 'unknown'

      if (!tenantId) {
        res.status(400).json({ success: false, error: { message: 'Missing tenant scoping identifier.' } })
        return
      }

      ClinicValidator.updateProfile(req.body)
      const updated = await ClinicService.updateClinicProfile(tenantId, req.body, actorId)

      res.status(200).json({
        success: true,
        data: updated,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (req.headers['x-correlation-id'] as string) || 'none',
        },
      })
    } catch (err) {
      next(err)
    }
  }

  public static async getOperatingHours(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || (req as AuthenticatedRequest).user?.tenantId
      if (!tenantId) {
        res.status(400).json({ success: false, error: { message: 'Missing tenant scoping identifier.' } })
        return
      }

      const clinic = await ClinicService.getClinicProfile(tenantId)

      res.status(200).json({
        success: true,
        data: { operatingHours: clinic.operatingHours },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (req.headers['x-correlation-id'] as string) || 'none',
        },
      })
    } catch (err) {
      next(err)
    }
  }

  public static async updateOperatingHours(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || (req as AuthenticatedRequest).user?.tenantId
      const actorId = (req as AuthenticatedRequest).user?.userId || 'unknown'

      if (!tenantId) {
        res.status(400).json({ success: false, error: { message: 'Missing tenant scoping identifier.' } })
        return
      }

      ClinicValidator.updateOperatingHours(req.body)
      const updatedSchedule = await ClinicService.updateOperatingHours(tenantId, req.body.schedule, actorId)

      res.status(200).json({
        success: true,
        data: { operatingHours: updatedSchedule },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (req.headers['x-correlation-id'] as string) || 'none',
        },
      })
    } catch (err) {
      next(err)
    }
  }

  public static async getHolidays(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || (req as AuthenticatedRequest).user?.tenantId
      if (!tenantId) {
        res.status(400).json({ success: false, error: { message: 'Missing tenant scoping identifier.' } })
        return
      }

      const holidays = await ClinicService.getHolidays(tenantId)

      res.status(200).json({
        success: true,
        data: { holidays },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (req.headers['x-correlation-id'] as string) || 'none',
        },
      })
    } catch (err) {
      next(err)
    }
  }

  public static async addHoliday(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || (req as AuthenticatedRequest).user?.tenantId
      const actorId = (req as AuthenticatedRequest).user?.userId || 'unknown'

      if (!tenantId) {
        res.status(400).json({ success: false, error: { message: 'Missing tenant scoping identifier.' } })
        return
      }

      ClinicValidator.addHoliday(req.body)
      const holiday = await ClinicService.addHoliday(tenantId, req.body, actorId)

      res.status(201).json({
        success: true,
        data: holiday,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (req.headers['x-correlation-id'] as string) || 'none',
        },
      })
    } catch (err) {
      next(err)
    }
  }

  public static async deleteHoliday(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = (req.headers['x-tenant-id'] as string) || (req as AuthenticatedRequest).user?.tenantId
      const actorId = (req as AuthenticatedRequest).user?.userId || 'unknown'
      const { holidayId } = req.params

      if (!tenantId) {
        res.status(400).json({ success: false, error: { message: 'Missing tenant scoping identifier.' } })
        return
      }

      await ClinicService.deleteHoliday(tenantId, holidayId, actorId)

      res.status(200).json({
        success: true,
        data: { message: 'Holiday exception deleted successfully.' },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (req.headers['x-correlation-id'] as string) || 'none',
        },
      })
    } catch (err) {
      next(err)
    }
  }

  public static async listClinics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const statusFilter = req.query.status as string | undefined
      const searchTerm = req.query.search as string | undefined

      const clinics = await ClinicService.listClinics(statusFilter, searchTerm)

      res.status(200).json({
        success: true,
        data: { clinics },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (req.headers['x-correlation-id'] as string) || 'none',
        },
      })
    } catch (err) {
      next(err)
    }
  }

  public static async getClinicById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const clinic = await ClinicService.getClinicById(id)

      res.status(200).json({
        success: true,
        data: clinic,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (req.headers['x-correlation-id'] as string) || 'none',
        },
      })
    } catch (err) {
      next(err)
    }
  }

  public static async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params
      const actorId = (req as AuthenticatedRequest).user?.userId || 'admin'

      ClinicValidator.updateStatus(req.body)
      const updated = await ClinicService.updateStatus(id, req.body.status, req.body.reason, actorId)

      res.status(200).json({
        success: true,
        data: updated,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (req.headers['x-correlation-id'] as string) || 'none',
        },
      })
    } catch (err) {
      next(err)
    }
  }
}
