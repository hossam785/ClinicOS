import { AppError } from '@/shared/errors/AppError'
import type {
  CreateSettlementDto,
  UpdateSettlementDto,
  RejectSettlementDto,
  RecordPaymentDto,
  ArchiveSettlementDto,
  QuerySettlementsDto,
  PaymentMethod,
  SettlementStatus,
} from '../types/doctorFinancials.types'

const VALID_PAYMENT_METHODS: PaymentMethod[] = ['CASH', 'BANK_TRANSFER', 'CHEQUE', 'CREDIT_CARD']
const VALID_SETTLEMENT_STATUSES: SettlementStatus[] = ['DRAFT', 'PENDING_REVIEW', 'APPROVED', 'PAID', 'CLOSED', 'ARCHIVED']

export class DoctorFinancialsValidator {
  private static isValidDateString(dateStr: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false
    const d = new Date(dateStr)
    return !isNaN(d.getTime())
  }

  static validateCreateSettlement(body: Record<string, unknown>): CreateSettlementDto {
    if (!body.doctorId || typeof body.doctorId !== 'string' || body.doctorId.trim() === '') {
      throw new AppError('Doctor ID is required and cannot be empty.', 400, 'INVALID_DOCTOR_ID')
    }

    if (!body.startDate || typeof body.startDate !== 'string' || !this.isValidDateString(body.startDate)) {
      throw new AppError('Start date is required and must be in YYYY-MM-DD format.', 400, 'INVALID_DATE')
    }

    if (!body.endDate || typeof body.endDate !== 'string' || !this.isValidDateString(body.endDate)) {
      throw new AppError('End date is required and must be in YYYY-MM-DD format.', 400, 'INVALID_DATE')
    }

    if (new Date(body.startDate) > new Date(body.endDate)) {
      throw new AppError('Start date cannot be after end date.', 400, 'INVALID_DATE_RANGE')
    }

    return {
      doctorId: body.doctorId.trim(),
      clinicId: typeof body.clinicId === 'string' ? body.clinicId.trim() : undefined,
      startDate: body.startDate,
      endDate: body.endDate,
      notes: typeof body.notes === 'string' ? body.notes.trim() : undefined,
    }
  }

  static validateUpdateSettlement(body: Record<string, unknown>): UpdateSettlementDto {
    if (body.startDate !== undefined) {
      if (typeof body.startDate !== 'string' || !this.isValidDateString(body.startDate)) {
        throw new AppError('Start date must be in YYYY-MM-DD format.', 400, 'INVALID_DATE')
      }
    }

    if (body.endDate !== undefined) {
      if (typeof body.endDate !== 'string' || !this.isValidDateString(body.endDate)) {
        throw new AppError('End date must be in YYYY-MM-DD format.', 400, 'INVALID_DATE')
      }
    }

    if (body.startDate && body.endDate && new Date(body.startDate as string) > new Date(body.endDate as string)) {
      throw new AppError('Start date cannot be after end date.', 400, 'INVALID_DATE_RANGE')
    }

    return {
      startDate: typeof body.startDate === 'string' ? body.startDate : undefined,
      endDate: typeof body.endDate === 'string' ? body.endDate : undefined,
      notes: typeof body.notes === 'string' ? body.notes.trim() : undefined,
    }
  }

  static validateRejectSettlement(body: Record<string, unknown>): RejectSettlementDto {
    if (!body.reason || typeof body.reason !== 'string' || body.reason.trim() === '') {
      throw new AppError('Rejection reason string is required and cannot be empty.', 400, 'MISSING_REJECTION_REASON')
    }
    return { reason: body.reason.trim() }
  }

  static validateRecordPayment(body: Record<string, unknown>): RecordPaymentDto {
    if (typeof body.amountPaid !== 'number' || isNaN(body.amountPaid) || body.amountPaid <= 0) {
      throw new AppError('Payment amount must be a positive number greater than zero.', 400, 'INVALID_PAYMENT_AMOUNT')
    }

    if (!body.paymentDate || typeof body.paymentDate !== 'string' || !this.isValidDateString(body.paymentDate)) {
      throw new AppError('Payment date is required and must be in YYYY-MM-DD format.', 400, 'INVALID_DATE')
    }

    if (!body.paymentMethod || !VALID_PAYMENT_METHODS.includes(body.paymentMethod as PaymentMethod)) {
      throw new AppError(`Invalid payment method. Allowed: ${VALID_PAYMENT_METHODS.join(', ')}`, 400, 'INVALID_PAYMENT_METHOD')
    }

    return {
      amountPaid: body.amountPaid,
      paymentDate: body.paymentDate,
      paymentMethod: body.paymentMethod as PaymentMethod,
      referenceNumber: typeof body.referenceNumber === 'string' ? body.referenceNumber.trim() : undefined,
      notes: typeof body.notes === 'string' ? body.notes.trim() : undefined,
    }
  }

  static validateArchiveSettlement(body: Record<string, unknown>): ArchiveSettlementDto {
    if (!body.reason || typeof body.reason !== 'string' || body.reason.trim() === '') {
      throw new AppError('Archival reason string is required and cannot be empty.', 400, 'MISSING_ARCHIVE_REASON')
    }
    return { reason: body.reason.trim() }
  }

  static validateQuery(query: Record<string, unknown>): QuerySettlementsDto {
    const page = query.page ? parseInt(String(query.page), 10) : 1
    const limit = query.limit ? parseInt(String(query.limit), 10) : 10

    if (isNaN(page) || page < 1) {
      throw new AppError('Query page must be a positive integer >= 1.', 400, 'INVALID_QUERY')
    }
    if (isNaN(limit) || limit < 1 || limit > 100) {
      throw new AppError('Query limit must be between 1 and 100.', 400, 'INVALID_QUERY')
    }

    if (query.status && !VALID_SETTLEMENT_STATUSES.includes(query.status as SettlementStatus)) {
      throw new AppError(`Invalid status query. Allowed: ${VALID_SETTLEMENT_STATUSES.join(', ')}`, 400, 'INVALID_STATUS')
    }

    if (query.paymentMethod && !VALID_PAYMENT_METHODS.includes(query.paymentMethod as PaymentMethod)) {
      throw new AppError(`Invalid paymentMethod query. Allowed: ${VALID_PAYMENT_METHODS.join(', ')}`, 400, 'INVALID_PAYMENT_METHOD')
    }

    return {
      doctorId: typeof query.doctorId === 'string' ? query.doctorId.trim() : undefined,
      status: query.status as SettlementStatus | undefined,
      paymentMethod: query.paymentMethod as PaymentMethod | undefined,
      startDate: typeof query.startDate === 'string' ? query.startDate : undefined,
      endDate: typeof query.endDate === 'string' ? query.endDate : undefined,
      search: typeof query.search === 'string' ? query.search.trim() : undefined,
      page,
      limit,
      sortBy: typeof query.sortBy === 'string' ? query.sortBy : undefined,
      sortOrder: query.sortOrder === 'asc' || query.sortOrder === 'desc' ? query.sortOrder : 'desc',
    }
  }
}
