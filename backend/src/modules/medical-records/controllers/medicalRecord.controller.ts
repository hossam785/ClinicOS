import type { Request, Response, NextFunction } from 'express'
import type { MedicalRecordService } from '../services/medicalRecord.service'
import type { AuthenticatedRequest } from '../../auth/auth.types'

export class MedicalRecordController {
  constructor(private recordService: MedicalRecordService) {}

  private extractTenantAndActor(req: Request): { tenantId: string; actorId: string } {
    const authReq = req as AuthenticatedRequest
    const tenantId = (req.headers['x-tenant-id'] as string) || authReq.user?.tenantId || 'clinic-101'
    const actorId = authReq.user?.userId || 'system-actor'
    return { tenantId, actorId }
  }

  createRecord = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId, actorId } = this.extractTenantAndActor(req)
      const record = await this.recordService.createRecord(tenantId, actorId, req.body)

      res.status(201).json({
        success: true,
        data: record,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  listRecords = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId } = this.extractTenantAndActor(req)
      const { status, doctorId, search } = req.query as { status?: string; doctorId?: string; search?: string }
      const records = await this.recordService.listRecords(tenantId, status, doctorId, search)

      res.status(200).json({
        success: true,
        data: { records, total: records.length },
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  getRecordById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId } = this.extractTenantAndActor(req)
      const { id } = req.params
      const record = await this.recordService.getRecordById(tenantId, id)

      res.status(200).json({
        success: true,
        data: record,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  getPatientHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId } = this.extractTenantAndActor(req)
      const { patientId } = req.params
      const history = await this.recordService.getPatientHistory(tenantId, patientId)

      res.status(200).json({
        success: true,
        data: { history, total: history.length },
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  updateRecord = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId, actorId } = this.extractTenantAndActor(req)
      const { id } = req.params
      const record = await this.recordService.updateRecord(tenantId, id, actorId, req.body)

      res.status(200).json({
        success: true,
        data: record,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  completeRecord = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId, actorId } = this.extractTenantAndActor(req)
      const { id } = req.params
      const record = await this.recordService.completeRecord(tenantId, id, actorId)

      res.status(200).json({
        success: true,
        data: record,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  addAddendum = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId, actorId } = this.extractTenantAndActor(req)
      const { id } = req.params
      const { text } = req.body || {}

      const record = await this.recordService.addAddendum(tenantId, id, actorId, text)

      res.status(200).json({
        success: true,
        data: record,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  archiveRecord = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId, actorId } = this.extractTenantAndActor(req)
      const { id } = req.params
      const record = await this.recordService.archiveRecord(tenantId, id, actorId)

      res.status(200).json({
        success: true,
        data: record,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }
}
