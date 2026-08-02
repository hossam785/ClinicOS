import type { Request, Response, NextFunction } from 'express'
import type { AppointmentService } from '../services/appointment.service'
import type { AuthenticatedRequest } from '../../auth/auth.types'
import type { AppointmentStatus } from '../types/appointment.types'

export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  private extractTenantAndActor(req: Request): { tenantId: string; actorId: string } {
    const authReq = req as AuthenticatedRequest
    const tenantId = (req.headers['x-tenant-id'] as string) || authReq.user?.tenantId || 'clinic-101'
    const actorId = authReq.user?.userId || 'system-actor'
    return { tenantId, actorId }
  }

  createAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId, actorId } = this.extractTenantAndActor(req)
      const appointment = await this.appointmentService.createAppointment(tenantId, actorId, req.body)

      res.status(201).json({
        success: true,
        data: appointment,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  listAppointments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId } = this.extractTenantAndActor(req)
      const { status, doctorId, search } = req.query as { status?: string; doctorId?: string; search?: string }
      const appointments = await this.appointmentService.listAppointments(tenantId, status, doctorId, search)

      res.status(200).json({
        success: true,
        data: { appointments, total: appointments.length },
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  getAppointmentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId } = this.extractTenantAndActor(req)
      const { id } = req.params
      const appointment = await this.appointmentService.getAppointmentById(tenantId, id)

      res.status(200).json({
        success: true,
        data: appointment,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  checkAvailability = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId } = this.extractTenantAndActor(req)
      const { doctorId, date, startTime, endTime } = req.query as {
        doctorId: string
        date: string
        startTime: string
        endTime: string
      }

      const result = await this.appointmentService.checkAvailability(tenantId, doctorId, date, startTime, endTime)

      res.status(200).json({
        success: true,
        data: result,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  getDailyQueue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId } = this.extractTenantAndActor(req)
      const { date } = req.query as { date?: string }
      const queue = await this.appointmentService.getDailyQueue(tenantId, date)

      res.status(200).json({
        success: true,
        data: { queue, total: queue.length },
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  updateAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId, actorId } = this.extractTenantAndActor(req)
      const { id } = req.params
      const appointment = await this.appointmentService.updateAppointment(tenantId, id, actorId, req.body)

      res.status(200).json({
        success: true,
        data: appointment,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  checkInPatient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId, actorId } = this.extractTenantAndActor(req)
      const { id } = req.params
      const appointment = await this.appointmentService.checkInPatient(tenantId, id, actorId)

      res.status(200).json({
        success: true,
        data: appointment,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  startConsultation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId, actorId } = this.extractTenantAndActor(req)
      const { id } = req.params
      const appointment = await this.appointmentService.startConsultation(tenantId, id, actorId)

      res.status(200).json({
        success: true,
        data: appointment,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  completeConsultation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId, actorId } = this.extractTenantAndActor(req)
      const { id } = req.params
      const appointment = await this.appointmentService.completeConsultation(tenantId, id, actorId)

      res.status(200).json({
        success: true,
        data: appointment,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  cancelAppointment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId, actorId } = this.extractTenantAndActor(req)
      const { id } = req.params
      const { reason } = req.body || {}

      const appointment = await this.appointmentService.cancelAppointment(tenantId, id, actorId, reason)

      res.status(200).json({
        success: true,
        data: appointment,
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

      const appointment = await this.appointmentService.updateStatus(tenantId, id, actorId, status as AppointmentStatus, reason)

      res.status(200).json({
        success: true,
        data: appointment,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }
}
