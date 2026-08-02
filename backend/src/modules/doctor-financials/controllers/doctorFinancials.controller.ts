import { Request, Response, NextFunction } from 'express'
import { DoctorFinancialsService, UserContext } from '../services/doctorFinancials.service'
import { DoctorFinancialsValidator } from '../validators/doctorFinancials.validator'

interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    role: string
    tenantId: string
    clinicId?: string
  }
}

export class DoctorFinancialsController {
  constructor(private service: DoctorFinancialsService) {}

  private getUserContext(req: AuthenticatedRequest): UserContext {
    return {
      userId: req.user?.id || 'usr-manager-1',
      role: req.user?.role || 'CLINIC_MANAGER',
      tenantId: req.user?.tenantId || (req.headers['x-tenant-id'] as string) || 'clinic-101',
      clinicId: req.user?.clinicId || 'branch_main',
    }
  }

  getAccountSummary = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userContext = this.getUserContext(req)
      const doctorId = req.params.doctorId
      const data = await this.service.getAccountSummary(userContext, doctorId)
      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  getDashboardSummary = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userContext = this.getUserContext(req)
      const data = await this.service.getDashboardSummary(userContext)
      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  createSettlement = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userContext = this.getUserContext(req)
      const dto = DoctorFinancialsValidator.validateCreateSettlement(req.body)
      const data = await this.service.createSettlement(userContext, dto)
      res.status(201).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  getSettlementById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userContext = this.getUserContext(req)
      const id = req.params.id
      const data = await this.service.getSettlementById(userContext, id)
      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  updateSettlement = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userContext = this.getUserContext(req)
      const id = req.params.id
      const dto = DoctorFinancialsValidator.validateUpdateSettlement(req.body)
      const data = await this.service.updateSettlement(userContext, id, dto)
      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  submitSettlement = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userContext = this.getUserContext(req)
      const id = req.params.id
      const data = await this.service.submitSettlement(userContext, id)
      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  approveSettlement = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userContext = this.getUserContext(req)
      const id = req.params.id
      const data = await this.service.approveSettlement(userContext, id)
      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  rejectSettlement = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userContext = this.getUserContext(req)
      const id = req.params.id
      const dto = DoctorFinancialsValidator.validateRejectSettlement(req.body)
      const data = await this.service.rejectSettlement(userContext, id, dto)
      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  recordPayment = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userContext = this.getUserContext(req)
      const id = req.params.id
      const dto = DoctorFinancialsValidator.validateRecordPayment(req.body)
      const data = await this.service.recordPayment(userContext, id, dto)
      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  closeSettlement = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userContext = this.getUserContext(req)
      const id = req.params.id
      const data = await this.service.closeSettlement(userContext, id)
      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  archiveSettlement = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userContext = this.getUserContext(req)
      const id = req.params.id
      const dto = DoctorFinancialsValidator.validateArchiveSettlement(req.body)
      const data = await this.service.archiveSettlement(userContext, id, dto)
      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  restoreSettlement = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userContext = this.getUserContext(req)
      const id = req.params.id
      const data = await this.service.restoreSettlement(userContext, id)
      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  listSettlements = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userContext = this.getUserContext(req)
      const params = DoctorFinancialsValidator.validateQuery(req.query as Record<string, unknown>)
      const result = await this.service.listSettlements(userContext, params)
      res.status(200).json({
        success: true,
        data: result.data,
        meta: {
          total: result.total,
          page: result.page,
          totalPages: result.totalPages,
          timestamp: new Date().toISOString(),
        },
      })
    } catch (err) {
      next(err)
    }
  }
}
