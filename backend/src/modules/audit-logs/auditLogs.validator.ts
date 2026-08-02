// Audit Logs Request Validators — ClinicOS

import { Request, Response, NextFunction } from 'express'
import { AppError } from '@/shared/errors/AppError'
import type { AuditModule, AuditSeverity, ExportFormat } from './auditLogs.types'

const VALID_MODULES: Array<AuditModule | 'ALL'> = [
  'ALL',
  'AUTH',
  'USERS',
  'PATIENTS',
  'APPOINTMENTS',
  'MEDICAL_RECORDS',
  'PRESCRIPTIONS',
  'EXPENSES',
  'DOCTOR_FINANCIALS',
  'SYSTEM',
  'CLINIC',
]

const VALID_SEVERITIES: Array<AuditSeverity | 'ALL'> = [
  'ALL',
  'INFORMATION',
  'WARNING',
  'ERROR',
  'CRITICAL',
]

const VALID_EXPORT_FORMATS: ExportFormat[] = ['PDF', 'EXCEL', 'CSV']

export function validateAuditQueryParams(req: Request, _res: Response, next: NextFunction): void {
  const { page, limit, module, severity, startDate, endDate } = req.query

  if (page !== undefined) {
    const pageNum = parseInt(page as string, 10)
    if (isNaN(pageNum) || pageNum < 1) {
      return next(new AppError('Page query parameter must be a positive integer.', 400, 'INVALID_PAGE_PARAM'))
    }
  }

  if (limit !== undefined) {
    const limitNum = parseInt(limit as string, 10)
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return next(new AppError('Limit query parameter must be an integer between 1 and 100.', 400, 'INVALID_LIMIT_PARAM'))
    }
  }

  if (module !== undefined && !VALID_MODULES.includes(module as AuditModule)) {
    return next(new AppError(`Invalid audit module parameter: ${module}`, 400, 'INVALID_MODULE_PARAM'))
  }

  if (severity !== undefined && !VALID_SEVERITIES.includes(severity as AuditSeverity)) {
    return next(new AppError(`Invalid audit severity parameter: ${severity}`, 400, 'INVALID_SEVERITY_PARAM'))
  }

  if (startDate && endDate) {
    const start = new Date(startDate as string)
    const end = new Date(endDate as string)
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
      return next(new AppError('startDate must be a valid date preceding or equal to endDate.', 400, 'INVALID_DATE_RANGE'))
    }
  }

  next()
}

export function validateExportPayload(req: Request, _res: Response, next: NextFunction): void {
  const { exportFormat } = req.body || {}

  if (!exportFormat || !VALID_EXPORT_FORMATS.includes(exportFormat as ExportFormat)) {
    return next(
      new AppError(
        `Invalid or missing exportFormat. Must be one of: ${VALID_EXPORT_FORMATS.join(', ')}`,
        400,
        'INVALID_EXPORT_FORMAT'
      )
    )
  }

  next()
}

export function validateSyncPayload(req: Request, _res: Response, next: NextFunction): void {
  const { queuedAuditLogs } = req.body || {}

  if (!Array.isArray(queuedAuditLogs)) {
    return next(
      new AppError('queuedAuditLogs must be a non-empty array of queued offline audit records.', 400, 'INVALID_SYNC_PAYLOAD')
    )
  }

  next()
}
