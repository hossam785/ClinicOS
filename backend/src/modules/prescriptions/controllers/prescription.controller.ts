import type { Request, Response, NextFunction } from 'express'
import type { PrescriptionService } from '../services/prescription.service'
import type { AuthenticatedRequest } from '../../auth/auth.types'
import type { QueryPrescriptionsDto, PrescriptionStatus } from '../types/prescription.types'

export class PrescriptionController {
  constructor(private prescriptionService: PrescriptionService) {}

  private extractContext(req: Request): { tenantId: string; actorId: string; actorRole?: string } {
    const authReq = req as AuthenticatedRequest
    const tenantId = (req.headers['x-tenant-id'] as string) || authReq.user?.tenantId || 'clinic-101'
    const actorId = authReq.user?.userId || 'system-actor'
    const actorRole = authReq.user?.role || (req.headers['x-user-role'] as string) || undefined
    return { tenantId, actorId, actorRole }
  }

  createPrescription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId, actorId, actorRole } = this.extractContext(req)
      const prescription = await this.prescriptionService.createPrescription(tenantId, actorId, actorRole, req.body)

      res.status(201).json({
        success: true,
        data: prescription,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  listPrescriptions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId, actorRole } = this.extractContext(req)
      const queryParams: QueryPrescriptionsDto = {
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        patientId: req.query.patientId as string,
        doctorId: req.query.doctorId as string,
        status: req.query.status as PrescriptionStatus,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        medicineName: req.query.medicineName as string,
        prescriptionNumber: req.query.prescriptionNumber as string,
        search: req.query.search as string,
      }

      const result = await this.prescriptionService.listPrescriptions(tenantId, actorRole, queryParams)

      res.status(200).json({
        success: true,
        data: result.data,
        meta: {
          page: result.page,
          limit: queryParams.limit || 20,
          total: result.total,
          totalPages: result.totalPages,
          timestamp: new Date().toISOString(),
        },
      })
    } catch (error) {
      next(error)
    }
  }

  getPrescriptionById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId, actorRole } = this.extractContext(req)
      const { id } = req.params
      const prescription = await this.prescriptionService.getPrescriptionById(tenantId, id, actorRole)

      res.status(200).json({
        success: true,
        data: prescription,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  getPatientHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId, actorRole } = this.extractContext(req)
      const { patientId } = req.params
      const includeArchived = req.query.includeArchived === 'true'
      const history = await this.prescriptionService.getPatientHistory(tenantId, patientId, actorRole, includeArchived)

      res.status(200).json({
        success: true,
        data: history,
        meta: { total: history.length, timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  getMedicalRecordPrescriptions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId, actorRole } = this.extractContext(req)
      const { recordId } = req.params
      const list = await this.prescriptionService.getMedicalRecordPrescriptions(tenantId, recordId, actorRole)

      res.status(200).json({
        success: true,
        data: list,
        meta: { total: list.length, timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  updatePrescription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId, actorId, actorRole } = this.extractContext(req)
      const { id } = req.params
      const prescription = await this.prescriptionService.updatePrescription(tenantId, id, actorId, actorRole, req.body)

      res.status(200).json({
        success: true,
        data: prescription,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  finalizePrescription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId, actorId, actorRole } = this.extractContext(req)
      const { id } = req.params
      const prescription = await this.prescriptionService.finalizePrescription(tenantId, id, actorId, actorRole)

      res.status(200).json({
        success: true,
        data: prescription,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  archivePrescription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId, actorId, actorRole } = this.extractContext(req)
      const { id } = req.params
      const reason = req.body?.reason || ''
      const prescription = await this.prescriptionService.archivePrescription(tenantId, id, actorId, actorRole, reason)

      res.status(200).json({
        success: true,
        data: prescription,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  restorePrescription = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId, actorId, actorRole } = this.extractContext(req)
      const { id } = req.params
      const prescription = await this.prescriptionService.restorePrescription(tenantId, id, actorId, actorRole)

      res.status(200).json({
        success: true,
        data: prescription,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  registerPrint = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId, actorId, actorRole } = this.extractContext(req)
      const { id } = req.params
      const actionType = req.body?.actionType || 'PRINT_DIRECT'
      const prescription = await this.prescriptionService.registerPrint(tenantId, id, actorId, actorRole, actionType)

      res.status(200).json({
        success: true,
        data: prescription,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }

  registerPdfExport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tenantId, actorId, actorRole } = this.extractContext(req)
      const { id } = req.params
      const prescription = await this.prescriptionService.registerPdfExport(tenantId, id, actorId, actorRole)

      res.status(200).json({
        success: true,
        data: prescription,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (error) {
      next(error)
    }
  }
}
