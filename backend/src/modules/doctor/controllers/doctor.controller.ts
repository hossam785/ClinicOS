import type { Request, Response, NextFunction } from 'express'
import type { DoctorService } from '../services/doctor.service'
import type { AuthenticatedRequest } from '../../auth/auth.types'

export class DoctorController {
  constructor(private doctorService: DoctorService) {}

  private extractTenantAndActor(req: Request): { tenantId: string; actorId: string } {
    const authReq = req as AuthenticatedRequest
    const tenantId = (req.headers['x-tenant-id'] as string) || authReq.user?.tenantId || 'clinic-101'
    const actorId = authReq.user?.userId || 'system-actor'
    return { tenantId, actorId }
  }

  inviteDoctor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId, actorId } = this.extractTenantAndActor(req)
      const doctor = await this.doctorService.inviteDoctor(tenantId, actorId, req.body)

      res.status(201).json({
        success: true,
        data: doctor,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  listDoctors = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId } = this.extractTenantAndActor(req)
      const { status, search } = req.query as { status?: string; search?: string }
      const doctors = await this.doctorService.listDoctors(tenantId, status, search)

      res.status(200).json({
        success: true,
        data: { doctors, total: doctors.length },
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  getDoctorById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId } = this.extractTenantAndActor(req)
      const { id } = req.params
      const doctor = await this.doctorService.getDoctorById(tenantId, id)

      res.status(200).json({
        success: true,
        data: doctor,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  updateDoctorProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId, actorId } = this.extractTenantAndActor(req)
      const { id } = req.params
      const doctor = await this.doctorService.updateDoctorProfile(tenantId, id, actorId, req.body)

      res.status(200).json({
        success: true,
        data: doctor,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  updateFees = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId, actorId } = this.extractTenantAndActor(req)
      const { id } = req.params
      const { consultationFee, defaultConsultationDuration } = req.body

      const doctor = await this.doctorService.updateFees(
        tenantId,
        id,
        actorId,
        Number(consultationFee),
        Number(defaultConsultationDuration)
      )

      res.status(200).json({
        success: true,
        data: doctor,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  updateSchedule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId, actorId } = this.extractTenantAndActor(req)
      const { id } = req.params
      const { shifts } = req.body

      const doctor = await this.doctorService.updateSchedule(tenantId, id, actorId, shifts)

      res.status(200).json({
        success: true,
        data: doctor,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  getLeaves = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId } = this.extractTenantAndActor(req)
      const { id } = req.params
      const leaves = await this.doctorService.getLeaves(tenantId, id)

      res.status(200).json({
        success: true,
        data: { leaves },
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  addLeave = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId, actorId } = this.extractTenantAndActor(req)
      const { id } = req.params
      const leave = await this.doctorService.addLeave(tenantId, id, actorId, req.body)

      res.status(201).json({
        success: true,
        data: leave,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  deleteLeave = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId, actorId } = this.extractTenantAndActor(req)
      const { id, leaveId } = req.params
      await this.doctorService.deleteLeave(tenantId, id, actorId, leaveId)

      res.status(200).json({
        success: true,
        data: { message: 'Leave exception removed successfully.' },
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  verifyLicense = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId, actorId } = this.extractTenantAndActor(req)
      const { id } = req.params
      const doctor = await this.doctorService.verifyLicense(tenantId, id, actorId)

      res.status(200).json({
        success: true,
        data: doctor,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId, actorId } = this.extractTenantAndActor(req)
      const { id } = req.params
      const { status, reason } = req.body

      const doctor = await this.doctorService.updateStatus(tenantId, id, actorId, status, reason)

      res.status(200).json({
        success: true,
        data: doctor,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }
}
