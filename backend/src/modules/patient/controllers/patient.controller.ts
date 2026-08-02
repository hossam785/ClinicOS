import type { Request, Response, NextFunction } from 'express'
import type { PatientService } from '../services/patient.service'
import type { AuthenticatedRequest } from '../../auth/auth.types'
import type { PatientStatus } from '../types/patient.types'

export class PatientController {
  constructor(private patientService: PatientService) {}

  private extractTenantAndActor(req: Request): { tenantId: string; actorId: string } {
    const authReq = req as AuthenticatedRequest
    const tenantId = (req.headers['x-tenant-id'] as string) || authReq.user?.tenantId || 'clinic-101'
    const actorId = authReq.user?.userId || 'system-actor'
    return { tenantId, actorId }
  }

  createPatient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId, actorId } = this.extractTenantAndActor(req)
      const patient = await this.patientService.createPatient(tenantId, actorId, req.body)

      res.status(201).json({
        success: true,
        data: patient,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  listPatients = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId } = this.extractTenantAndActor(req)
      const { status, search } = req.query as { status?: string; search?: string }
      const patients = await this.patientService.listPatients(tenantId, status, search)

      res.status(200).json({
        success: true,
        data: { patients, total: patients.length },
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  getPatientById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId } = this.extractTenantAndActor(req)
      const { id } = req.params
      const patient = await this.patientService.getPatientById(tenantId, id)

      res.status(200).json({
        success: true,
        data: patient,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  updatePatient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId, actorId } = this.extractTenantAndActor(req)
      const { id } = req.params
      const patient = await this.patientService.updatePatient(tenantId, id, actorId, req.body)

      res.status(200).json({
        success: true,
        data: patient,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  archivePatient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId, actorId } = this.extractTenantAndActor(req)
      const { id } = req.params
      const { reason } = req.body || {}

      const patient = await this.patientService.archivePatient(tenantId, id, actorId, reason)

      res.status(200).json({
        success: true,
        data: patient,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  restorePatient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId, actorId } = this.extractTenantAndActor(req)
      const { id } = req.params

      const patient = await this.patientService.restorePatient(tenantId, id, actorId)

      res.status(200).json({
        success: true,
        data: patient,
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

      const patient = await this.patientService.updateStatus(tenantId, id, actorId, status as PatientStatus, reason)

      res.status(200).json({
        success: true,
        data: patient,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }
}
