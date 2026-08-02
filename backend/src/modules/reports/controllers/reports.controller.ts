// Reports & Analytics HTTP Controllers — ClinicOS

import { Response, NextFunction } from 'express'
import type { AuthenticatedRequest } from '@/modules/auth/auth.types'
import { AppError } from '@/shared/errors/AppError'
import { reportsEngineService } from '../services/reportsEngine.service'
import { ReportsValidator } from '../validators/reports.validator'
import type { ReportFilterParams, ExportReportPayload } from '../types/reports.types'

export class ReportsController {
  private static getUserContext(req: AuthenticatedRequest) {
    if (!req.user) {
      throw new AppError('Authentication context missing', 401, 'UNAUTHORIZED')
    }
    const tenantId = req.user.tenantId || (req.headers['x-tenant-id'] as string) || 'tenant-clinic-001'
    const userId = req.user.userId
    const role = req.user.role
    const clinicId = (req.query.clinicId as string) || 'branch-main'

    return { tenantId, userId, role, clinicId }
  }

  static async getDashboardKpis(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tenantId, role, clinicId } = ReportsController.getUserContext(req)
      const data = await reportsEngineService.getDashboardKpis(tenantId, role, clinicId)

      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  static async getDashboardCharts(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tenantId, role } = ReportsController.getUserContext(req)
      const interval = req.query.interval as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUAL'
      const metric = req.query.metric as 'REVENUE' | 'APPOINTMENTS' | 'PATIENTS' | 'EXPENSES'
      const startDate = req.query.startDate as string
      const endDate = req.query.endDate as string

      const data = await reportsEngineService.getDashboardCharts(tenantId, role, {
        interval,
        metric,
        startDate,
        endDate,
      })

      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  static async getFinancialReport(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tenantId, role } = ReportsController.getUserContext(req)
      const params = ReportsValidator.validateFilterParams(req.query as unknown as ReportFilterParams)
      const data = await reportsEngineService.getFinancialReport(tenantId, role, params)

      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  static async getDoctorReports(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tenantId, userId, role } = ReportsController.getUserContext(req)
      const params = ReportsValidator.validateFilterParams(req.query as unknown as ReportFilterParams)
      const data = await reportsEngineService.getDoctorReports(tenantId, userId, role, params)

      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  static async getPatientReports(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tenantId, role } = ReportsController.getUserContext(req)
      const params = ReportsValidator.validateFilterParams(req.query as unknown as ReportFilterParams)
      const data = await reportsEngineService.getPatientReports(tenantId, role, params)

      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  static async getAppointmentReports(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tenantId, role } = ReportsController.getUserContext(req)
      const params = ReportsValidator.validateFilterParams(req.query as unknown as ReportFilterParams)
      const data = await reportsEngineService.getAppointmentReports(tenantId, role, params)

      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  static async getMedicalReports(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tenantId, role } = ReportsController.getUserContext(req)
      const params = ReportsValidator.validateFilterParams(req.query as unknown as ReportFilterParams)
      const data = await reportsEngineService.getMedicalReports(tenantId, role, params)

      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  static async getOperationalReports(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tenantId, role } = ReportsController.getUserContext(req)
      const params = ReportsValidator.validateFilterParams(req.query as unknown as ReportFilterParams)
      const data = await reportsEngineService.getOperationalReports(tenantId, role, params)

      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  static async getReportHistory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tenantId, role } = ReportsController.getUserContext(req)
      const params = ReportsValidator.validateFilterParams(req.query as unknown as ReportFilterParams)
      const result = await reportsEngineService.getReportHistory(tenantId, role, params)

      res.status(200).json({
        success: true,
        data: {
          items: result.items,
          pagination: {
            totalItems: result.total,
            totalPages: result.totalPages,
            currentPage: result.page,
            limit: params.limit || 20,
            hasNextPage: result.page < result.totalPages,
            hasPrevPage: result.page > 1,
          },
        },
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  static async getReportHistoryById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tenantId, role } = ReportsController.getUserContext(req)
      const { id } = req.params
      const data = await reportsEngineService.getReportHistoryById(tenantId, role, id)

      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  static async exportReport(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tenantId, userId, role } = ReportsController.getUserContext(req)
      const payload = ReportsValidator.validateExportPayload(req.body as ExportReportPayload)
      const data = await reportsEngineService.exportReport(tenantId, userId, role, payload)

      res.status(200).json({
        success: true,
        data,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }
}
