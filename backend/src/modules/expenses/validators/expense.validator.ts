import { AppError } from '@/shared/errors/AppError'
import type {
  CreateExpenseDto,
  UpdateExpenseDto,
  RejectExpenseDto,
  PayExpenseDto,
  ArchiveExpenseDto,
  QueryExpensesDto,
  CreateExpenseCategoryDto,
  UpdateExpenseCategoryDto,
  PaymentMethod,
  ExpenseStatus,
} from '../types/expense.types'

const VALID_PAYMENT_METHODS: PaymentMethod[] = [
  'CASH',
  'BANK_TRANSFER',
  'CREDIT_CARD',
  'CHEQUE',
  'OTHER',
]

const VALID_STATUSES: ExpenseStatus[] = [
  'DRAFT',
  'PENDING_APPROVAL',
  'APPROVED',
  'REJECTED',
  'PAID',
  'ARCHIVED',
]

export class ExpenseValidator {
  static validateCreateExpense(body: unknown): CreateExpenseDto {
    if (!body || typeof body !== 'object') {
      throw new AppError('Invalid request payload', 400, 'INVALID_PAYLOAD')
    }

    const data = body as Partial<CreateExpenseDto>

    if (!data.categoryId || typeof data.categoryId !== 'string' || !data.categoryId.trim()) {
      throw new AppError('Category ID is required', 400, 'MISSING_CATEGORY')
    }

    if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
      throw new AppError('Expense title is required', 400, 'MISSING_TITLE')
    }

    if (data.amount === undefined || typeof data.amount !== 'number' || data.amount <= 0 || isNaN(data.amount)) {
      throw new AppError('Expense amount must be a positive number greater than 0', 400, 'INVALID_AMOUNT')
    }

    if (!data.currency || typeof data.currency !== 'string' || data.currency.trim().length !== 3) {
      throw new AppError('Currency code must be a valid 3-letter ISO string', 400, 'INVALID_CURRENCY')
    }

    if (!data.expenseDate || typeof data.expenseDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data.expenseDate)) {
      throw new AppError('Expense date must be a valid date string (YYYY-MM-DD)', 400, 'INVALID_DATE')
    }

    if (!data.paymentMethod || !VALID_PAYMENT_METHODS.includes(data.paymentMethod as PaymentMethod)) {
      throw new AppError('Payment method must be one of: CASH, BANK_TRANSFER, CREDIT_CARD, CHEQUE, OTHER', 400, 'INVALID_PAYMENT_METHOD')
    }

    return {
      clinicId: data.clinicId?.trim() || 'branch_main',
      categoryId: data.categoryId.trim(),
      title: data.title.trim(),
      description: data.description?.trim(),
      amount: Number(data.amount.toFixed(2)),
      currency: data.currency.trim().toUpperCase(),
      expenseDate: data.expenseDate.trim(),
      paymentMethod: data.paymentMethod as PaymentMethod,
      vendorName: data.vendorName?.trim(),
      vendorTaxId: data.vendorTaxId?.trim(),
      receiptAttachmentUrl: data.receiptAttachmentUrl?.trim(),
      notes: data.notes?.trim(),
      submitForApproval: Boolean(data.submitForApproval),
    }
  }

  static validateUpdateExpense(body: unknown): UpdateExpenseDto {
    if (!body || typeof body !== 'object') {
      throw new AppError('Invalid request payload', 400, 'INVALID_PAYLOAD')
    }

    const data = body as Partial<UpdateExpenseDto>

    if (data.amount !== undefined) {
      if (typeof data.amount !== 'number' || data.amount <= 0 || isNaN(data.amount)) {
        throw new AppError('Expense amount must be a positive number greater than 0', 400, 'INVALID_AMOUNT')
      }
    }

    if (data.currency !== undefined) {
      if (typeof data.currency !== 'string' || data.currency.trim().length !== 3) {
        throw new AppError('Currency code must be a valid 3-letter ISO string', 400, 'INVALID_CURRENCY')
      }
    }

    if (data.expenseDate !== undefined) {
      if (typeof data.expenseDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data.expenseDate)) {
        throw new AppError('Expense date must be a valid date string (YYYY-MM-DD)', 400, 'INVALID_DATE')
      }
    }

    if (data.paymentMethod !== undefined) {
      if (!VALID_PAYMENT_METHODS.includes(data.paymentMethod as PaymentMethod)) {
        throw new AppError('Payment method must be one of: CASH, BANK_TRANSFER, CREDIT_CARD, CHEQUE, OTHER', 400, 'INVALID_PAYMENT_METHOD')
      }
    }

    return {
      categoryId: data.categoryId?.trim(),
      title: data.title?.trim(),
      description: data.description?.trim(),
      amount: data.amount !== undefined ? Number(data.amount.toFixed(2)) : undefined,
      currency: data.currency?.trim().toUpperCase(),
      expenseDate: data.expenseDate?.trim(),
      paymentMethod: data.paymentMethod as PaymentMethod | undefined,
      vendorName: data.vendorName?.trim(),
      vendorTaxId: data.vendorTaxId?.trim(),
      receiptAttachmentUrl: data.receiptAttachmentUrl?.trim(),
      notes: data.notes?.trim(),
    }
  }

  static validateRejectExpense(body: unknown): RejectExpenseDto {
    if (!body || typeof body !== 'object') {
      throw new AppError('Rejection reason is required', 400, 'MISSING_REJECTION_REASON')
    }
    const data = body as Partial<RejectExpenseDto>
    if (!data.reason || typeof data.reason !== 'string' || !data.reason.trim()) {
      throw new AppError('Rejection reason is required and cannot be empty', 400, 'MISSING_REJECTION_REASON')
    }
    return { reason: data.reason.trim() }
  }

  static validatePayExpense(body: unknown): PayExpenseDto {
    if (!body || typeof body !== 'object') {
      throw new AppError('Payment details are required', 400, 'MISSING_PAYMENT_METHOD')
    }
    const data = body as Partial<PayExpenseDto>
    if (!data.paymentDate || typeof data.paymentDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data.paymentDate)) {
      throw new AppError('Payment date must be a valid date string (YYYY-MM-DD)', 400, 'INVALID_DATE')
    }
    if (!data.paymentMethod || !VALID_PAYMENT_METHODS.includes(data.paymentMethod as PaymentMethod)) {
      throw new AppError('Valid payment method is required when executing payment', 400, 'MISSING_PAYMENT_METHOD')
    }
    return {
      paymentDate: data.paymentDate.trim(),
      paymentMethod: data.paymentMethod as PaymentMethod,
    }
  }

  static validateArchiveExpense(body: unknown): ArchiveExpenseDto {
    if (!body || typeof body !== 'object') {
      throw new AppError('Archival reason is required', 400, 'MISSING_ARCHIVE_REASON')
    }
    const data = body as Partial<ArchiveExpenseDto>
    if (!data.reason || typeof data.reason !== 'string' || !data.reason.trim()) {
      throw new AppError('Archival reason is required and cannot be empty', 400, 'MISSING_ARCHIVE_REASON')
    }
    return { reason: data.reason.trim() }
  }

  static validateQuery(query: Record<string, unknown>): QueryExpensesDto {
    const page = query.page ? parseInt(String(query.page), 10) : 1
    const limit = query.limit ? parseInt(String(query.limit), 10) : 10

    const status = query.status as ExpenseStatus | undefined
    if (status && !VALID_STATUSES.includes(status)) {
      throw new AppError('Invalid status filter', 400, 'INVALID_STATUS')
    }

    const paymentMethod = query.paymentMethod as PaymentMethod | undefined
    if (paymentMethod && !VALID_PAYMENT_METHODS.includes(paymentMethod)) {
      throw new AppError('Invalid payment method filter', 400, 'INVALID_PAYMENT_METHOD')
    }

    return {
      page: isNaN(page) || page < 1 ? 1 : page,
      limit: isNaN(limit) || limit < 1 ? 10 : limit > 100 ? 100 : limit,
      categoryId: query.categoryId ? String(query.categoryId).trim() : undefined,
      status,
      paymentMethod,
      vendorName: query.vendorName ? String(query.vendorName).trim() : undefined,
      startDate: query.startDate ? String(query.startDate).trim() : undefined,
      endDate: query.endDate ? String(query.endDate).trim() : undefined,
      minAmount: query.minAmount ? parseFloat(String(query.minAmount)) : undefined,
      maxAmount: query.maxAmount ? parseFloat(String(query.maxAmount)) : undefined,
      search: query.search ? String(query.search).trim() : undefined,
    }
  }

  static validateCreateCategory(body: unknown): CreateExpenseCategoryDto {
    if (!body || typeof body !== 'object') {
      throw new AppError('Invalid request payload', 400, 'INVALID_PAYLOAD')
    }
    const data = body as Partial<CreateExpenseCategoryDto>

    if (!data.categoryName || typeof data.categoryName !== 'string' || !data.categoryName.trim()) {
      throw new AppError('Category name is required', 400, 'MISSING_CATEGORY_NAME')
    }
    if (!data.categoryCode || typeof data.categoryCode !== 'string' || !data.categoryCode.trim()) {
      throw new AppError('Category code is required', 400, 'MISSING_CATEGORY_CODE')
    }

    return {
      clinicId: data.clinicId?.trim() || 'branch_main',
      categoryName: data.categoryName.trim(),
      categoryCode: data.categoryCode.trim().toUpperCase(),
      description: data.description?.trim(),
      color: data.color?.trim() || '#2563EB',
      icon: data.icon?.trim() || 'Tag',
    }
  }

  static validateUpdateCategory(body: unknown): UpdateExpenseCategoryDto {
    if (!body || typeof body !== 'object') {
      throw new AppError('Invalid request payload', 400, 'INVALID_PAYLOAD')
    }
    const data = body as Partial<UpdateExpenseCategoryDto>

    return {
      categoryName: data.categoryName?.trim(),
      categoryCode: data.categoryCode?.trim().toUpperCase(),
      description: data.description?.trim(),
      color: data.color?.trim(),
      icon: data.icon?.trim(),
    }
  }
}
