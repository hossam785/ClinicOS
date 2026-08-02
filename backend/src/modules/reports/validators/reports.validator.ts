// Reports & Analytics Request Payload & Query Validator — ClinicOS

import { AppError } from '@/shared/errors/AppError'
import type { ReportFilterParams, ExportReportPayload, ExportFormat, ReportCategory, ReportType } from '../types/reports.types'

export class ReportsValidator {
  static validateFilterParams(params: ReportFilterParams): ReportFilterParams {
    const validated: ReportFilterParams = { ...params }

    if (params.page !== undefined) {
      const pageNum = Number(params.page)
      if (isNaN(pageNum) || pageNum < 1) {
        throw new AppError('Invalid page parameter: must be a positive integer >= 1.', 400, 'INVALID_PAGE_PARAM')
      }
      validated.page = pageNum
    }

    if (params.limit !== undefined) {
      const limitNum = Number(params.limit)
      if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
        throw new AppError('Invalid limit parameter: must be between 1 and 100.', 400, 'INVALID_LIMIT_PARAM')
      }
      validated.limit = limitNum
    }

    if (params.startDate && params.endDate) {
      const start = new Date(params.startDate).getTime()
      const end = new Date(params.endDate).getTime()
      if (isNaN(start) || isNaN(end)) {
        throw new AppError('Invalid date format: must be valid ISO 8601 strings.', 400, 'INVALID_DATE_FORMAT')
      }
      if (start > end) {
        throw new AppError('Invalid date range: startDate cannot be after endDate.', 400, 'INVALID_DATE_RANGE')
      }
    }

    if (params.categoryId && params.categoryId !== 'ALL') {
      const validCategories: ReportCategory[] = [
        'EXECUTIVE',
        'PATIENT',
        'APPOINTMENT',
        'DOCTOR',
        'FINANCIAL',
        'MEDICAL',
        'OPERATIONAL',
      ]
      if (!validCategories.includes(params.categoryId as ReportCategory)) {
        throw new AppError(`Invalid report category: ${params.categoryId}.`, 400, 'INVALID_CATEGORY_PARAM')
      }
    }

    return validated
  }

  static validateExportPayload(payload: ExportReportPayload): ExportReportPayload {
    if (!payload || typeof payload !== 'object') {
      throw new AppError('Invalid export payload format.', 400, 'INVALID_EXPORT_PAYLOAD')
    }

    const validReportTypes: ReportType[] = [
      'BUSINESS_OVERVIEW',
      'FINANCIAL_PROFIT_LOSS',
      'DOCTOR_PERFORMANCE',
      'PATIENT_DEMOGRAPHICS',
      'APPOINTMENT_ANALYTICS',
      'MEDICAL_ANONYMIZED',
      'OPERATIONAL_SECURITY',
    ]

    if (!payload.reportType || !validReportTypes.includes(payload.reportType)) {
      throw new AppError(`Invalid reportType: ${payload.reportType}.`, 400, 'INVALID_REPORT_TYPE')
    }

    const validFormats: ExportFormat[] = ['PDF', 'EXCEL', 'CSV']
    if (!payload.exportFormat || !validFormats.includes(payload.exportFormat)) {
      throw new AppError(`Invalid exportFormat: ${payload.exportFormat}.`, 400, 'INVALID_EXPORT_FORMAT')
    }

    if (payload.filterParams) {
      ReportsValidator.validateFilterParams(payload.filterParams)
    }

    return payload
  }
}
