import { AppError } from '@/shared/errors/AppError'
import type { IExpenseRepository } from '../repositories/expense.repository'
import type {
  Expense,
  ExpenseCategory,
  CreateExpenseDto,
  UpdateExpenseDto,
  RejectExpenseDto,
  PayExpenseDto,
  ArchiveExpenseDto,
  QueryExpensesDto,
  CreateExpenseCategoryDto,
  UpdateExpenseCategoryDto,
  ExpenseDashboardSummary,
} from '../types/expense.types'

export interface UserContext {
  userId: string
  role: string
  tenantId: string
  clinicId?: string
}

export class ExpenseService {
  constructor(private expenseRepo: IExpenseRepository) {}

  private enforceTenantAndRoleAccess(userContext: UserContext): void {
    if (userContext.role === 'PLATFORM_ADMIN') {
      throw new AppError(
        'Platform Administrators are strictly barred from viewing or managing clinic financial records.',
        403,
        'PLATFORM_ADMIN_FINANCIAL_RESTRICTED'
      )
    }
  }

  private generateExpenseNumber(yearMonth: string, sequence: number): string {
    const padded = String(sequence).padStart(5, '0')
    return `EXP-${yearMonth}-${padded}`
  }

  async createExpense(userContext: UserContext, dto: CreateExpenseDto): Promise<Expense> {
    this.enforceTenantAndRoleAccess(userContext)

    // Verify category existence in tenant
    const category = await this.expenseRepo.findCategoryById(userContext.tenantId, dto.categoryId)
    if (!category || category.archived) {
      throw new AppError('Specified expense category does not exist or has been archived', 404, 'INVALID_CATEGORY')
    }

    const today = new Date()
    const yearMonth = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}`
    const sequence = await this.expenseRepo.getNextSequence(userContext.tenantId)
    const expenseNumber = this.generateExpenseNumber(yearMonth, sequence)

    const now = new Date().toISOString()
    const status = dto.submitForApproval ? 'PENDING_APPROVAL' : 'DRAFT'

    const newExpense: Expense = {
      _id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      expenseNumber,
      tenantId: userContext.tenantId,
      clinicId: dto.clinicId || userContext.clinicId || 'branch_main',
      categoryId: category._id,
      categoryName: category.categoryName,
      title: dto.title,
      description: dto.description,
      amount: dto.amount,
      currency: dto.currency,
      expenseDate: dto.expenseDate,
      paymentMethod: dto.paymentMethod,
      vendorName: dto.vendorName,
      vendorTaxId: dto.vendorTaxId,
      receiptAttachmentUrl: dto.receiptAttachmentUrl,
      notes: dto.notes,
      status,
      auditInfo: {
        createdBy: userContext.userId,
        createdAt: now,
        submittedAt: dto.submitForApproval ? now : undefined,
      },
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
      archived: false,
      version: 1,
    }

    const created = await this.expenseRepo.create(newExpense)

    // Audit Log Emission
    await this.expenseRepo.createAuditLog({
      _id: `audit-${Date.now()}`,
      expenseId: created._id,
      expenseNumber: created.expenseNumber,
      tenantId: userContext.tenantId,
      actorId: userContext.userId,
      actorRole: userContext.role,
      action: dto.submitForApproval ? 'EXPENSE_SUBMITTED' : 'EXPENSE_CREATED',
      newStatus: created.status,
      amount: created.amount,
      currency: created.currency,
      paymentMethod: created.paymentMethod,
      timestamp: now,
    })

    return created
  }

  async getExpenseById(userContext: UserContext, id: string): Promise<Expense> {
    this.enforceTenantAndRoleAccess(userContext)

    const expense = await this.expenseRepo.findById(userContext.tenantId, id)
    if (!expense) {
      throw new AppError('Expense record not found', 404, 'EXPENSE_NOT_FOUND')
    }
    return expense
  }

  async updateExpense(userContext: UserContext, id: string, dto: UpdateExpenseDto): Promise<Expense> {
    this.enforceTenantAndRoleAccess(userContext)

    const expense = await this.expenseRepo.findById(userContext.tenantId, id)
    if (!expense) {
      throw new AppError('Expense record not found', 404, 'EXPENSE_NOT_FOUND')
    }

    // Immutability rule: PAID, APPROVED, or ARCHIVED expenses cannot be modified directly
    if (expense.status === 'PAID') {
      throw new AppError('Paid expenses are immutable and cannot be updated.', 409, 'EXPENSE_LOCKED')
    }
    if (expense.status === 'APPROVED') {
      throw new AppError('Approved expenses are locked. Un-approve or pay the expense.', 409, 'EXPENSE_LOCKED')
    }
    if (expense.archived) {
      throw new AppError('Archived expenses must be restored before editing.', 400, 'EXPENSE_ARCHIVED')
    }

    let categoryName = expense.categoryName
    if (dto.categoryId && dto.categoryId !== expense.categoryId) {
      const cat = await this.expenseRepo.findCategoryById(userContext.tenantId, dto.categoryId)
      if (!cat || cat.archived) {
        throw new AppError('Specified expense category does not exist or has been archived', 404, 'INVALID_CATEGORY')
      }
      categoryName = cat.categoryName
    }

    const updates: Partial<Expense> = {
      ...(dto.categoryId && { categoryId: dto.categoryId, categoryName }),
      ...(dto.title && { title: dto.title }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.amount !== undefined && { amount: dto.amount }),
      ...(dto.currency && { currency: dto.currency }),
      ...(dto.expenseDate && { expenseDate: dto.expenseDate }),
      ...(dto.paymentMethod && { paymentMethod: dto.paymentMethod }),
      ...(dto.vendorName !== undefined && { vendorName: dto.vendorName }),
      ...(dto.vendorTaxId !== undefined && { vendorTaxId: dto.vendorTaxId }),
      ...(dto.receiptAttachmentUrl !== undefined && { receiptAttachmentUrl: dto.receiptAttachmentUrl }),
      ...(dto.notes !== undefined && { notes: dto.notes }),
    }

    const updated = await this.expenseRepo.update(userContext.tenantId, id, updates)
    if (!updated) {
      throw new AppError('Failed to update expense', 500, 'UPDATE_FAILED')
    }

    const now = new Date().toISOString()
    await this.expenseRepo.createAuditLog({
      _id: `audit-${Date.now()}`,
      expenseId: updated._id,
      expenseNumber: updated.expenseNumber,
      tenantId: userContext.tenantId,
      actorId: userContext.userId,
      actorRole: userContext.role,
      action: 'EXPENSE_UPDATED',
      previousStatus: expense.status,
      newStatus: updated.status,
      amount: updated.amount,
      currency: updated.currency,
      paymentMethod: updated.paymentMethod,
      timestamp: now,
    })

    return updated
  }

  async submitExpense(userContext: UserContext, id: string): Promise<Expense> {
    this.enforceTenantAndRoleAccess(userContext)

    const expense = await this.expenseRepo.findById(userContext.tenantId, id)
    if (!expense) {
      throw new AppError('Expense record not found', 404, 'EXPENSE_NOT_FOUND')
    }

    if (expense.status !== 'DRAFT' && expense.status !== 'REJECTED') {
      throw new AppError(`Cannot submit expense in ${expense.status} status for approval.`, 400, 'INVALID_STATUS_TRANSITION')
    }

    const now = new Date().toISOString()
    const updates: Partial<Expense> = {
      status: 'PENDING_APPROVAL',
      auditInfo: {
        ...expense.auditInfo,
        submittedAt: now,
      },
    }

    const updated = await this.expenseRepo.update(userContext.tenantId, id, updates)
    if (!updated) {
      throw new AppError('Failed to submit expense', 500, 'SUBMIT_FAILED')
    }

    await this.expenseRepo.createAuditLog({
      _id: `audit-${Date.now()}`,
      expenseId: updated._id,
      expenseNumber: updated.expenseNumber,
      tenantId: userContext.tenantId,
      actorId: userContext.userId,
      actorRole: userContext.role,
      action: 'EXPENSE_SUBMITTED',
      previousStatus: expense.status,
      newStatus: 'PENDING_APPROVAL',
      amount: updated.amount,
      currency: updated.currency,
      paymentMethod: updated.paymentMethod,
      timestamp: now,
    })

    return updated
  }

  async approveExpense(userContext: UserContext, id: string): Promise<Expense> {
    this.enforceTenantAndRoleAccess(userContext)

    if (userContext.role !== 'CLINIC_MANAGER') {
      throw new AppError('Only Clinic Managers are authorized to approve expenses.', 403, 'INSUFFICIENT_PERMISSIONS')
    }

    const expense = await this.expenseRepo.findById(userContext.tenantId, id)
    if (!expense) {
      throw new AppError('Expense record not found', 404, 'EXPENSE_NOT_FOUND')
    }

    if (expense.status !== 'PENDING_APPROVAL') {
      throw new AppError(`Cannot approve expense in ${expense.status} status. Must be PENDING_APPROVAL.`, 400, 'INVALID_STATUS_TRANSITION')
    }

    const now = new Date().toISOString()
    const updates: Partial<Expense> = {
      status: 'APPROVED',
      auditInfo: {
        ...expense.auditInfo,
        approvedBy: userContext.userId,
        approvedAt: now,
      },
    }

    const updated = await this.expenseRepo.update(userContext.tenantId, id, updates)
    if (!updated) {
      throw new AppError('Failed to approve expense', 500, 'APPROVE_FAILED')
    }

    await this.expenseRepo.createAuditLog({
      _id: `audit-${Date.now()}`,
      expenseId: updated._id,
      expenseNumber: updated.expenseNumber,
      tenantId: userContext.tenantId,
      actorId: userContext.userId,
      actorRole: userContext.role,
      action: 'EXPENSE_APPROVED',
      previousStatus: 'PENDING_APPROVAL',
      newStatus: 'APPROVED',
      amount: updated.amount,
      currency: updated.currency,
      paymentMethod: updated.paymentMethod,
      timestamp: now,
    })

    return updated
  }

  async rejectExpense(userContext: UserContext, id: string, dto: RejectExpenseDto): Promise<Expense> {
    this.enforceTenantAndRoleAccess(userContext)

    if (userContext.role !== 'CLINIC_MANAGER') {
      throw new AppError('Only Clinic Managers are authorized to reject expenses.', 403, 'INSUFFICIENT_PERMISSIONS')
    }

    const expense = await this.expenseRepo.findById(userContext.tenantId, id)
    if (!expense) {
      throw new AppError('Expense record not found', 404, 'EXPENSE_NOT_FOUND')
    }

    if (expense.status !== 'PENDING_APPROVAL') {
      throw new AppError(`Cannot reject expense in ${expense.status} status. Must be PENDING_APPROVAL.`, 400, 'INVALID_STATUS_TRANSITION')
    }

    const now = new Date().toISOString()
    const updates: Partial<Expense> = {
      status: 'REJECTED',
      auditInfo: {
        ...expense.auditInfo,
        rejectedBy: userContext.userId,
        rejectedAt: now,
        rejectionReason: dto.reason,
      },
    }

    const updated = await this.expenseRepo.update(userContext.tenantId, id, updates)
    if (!updated) {
      throw new AppError('Failed to reject expense', 500, 'REJECT_FAILED')
    }

    await this.expenseRepo.createAuditLog({
      _id: `audit-${Date.now()}`,
      expenseId: updated._id,
      expenseNumber: updated.expenseNumber,
      tenantId: userContext.tenantId,
      actorId: userContext.userId,
      actorRole: userContext.role,
      action: 'EXPENSE_REJECTED',
      previousStatus: 'PENDING_APPROVAL',
      newStatus: 'REJECTED',
      amount: updated.amount,
      currency: updated.currency,
      paymentMethod: updated.paymentMethod,
      details: { reason: dto.reason },
      timestamp: now,
    })

    return updated
  }

  async payExpense(userContext: UserContext, id: string, dto: PayExpenseDto): Promise<Expense> {
    this.enforceTenantAndRoleAccess(userContext)

    if (userContext.role !== 'CLINIC_MANAGER') {
      throw new AppError('Only Clinic Managers are authorized to execute expense payments.', 403, 'INSUFFICIENT_PERMISSIONS')
    }

    const expense = await this.expenseRepo.findById(userContext.tenantId, id)
    if (!expense) {
      throw new AppError('Expense record not found', 404, 'EXPENSE_NOT_FOUND')
    }

    if (expense.status !== 'APPROVED') {
      throw new AppError(`Cannot mark expense as PAID in ${expense.status} status. Must be APPROVED first.`, 400, 'INVALID_STATUS_TRANSITION')
    }

    const now = new Date().toISOString()
    const updates: Partial<Expense> = {
      status: 'PAID',
      paymentDate: dto.paymentDate,
      paymentMethod: dto.paymentMethod,
      auditInfo: {
        ...expense.auditInfo,
        paidBy: userContext.userId,
        paidAt: now,
      },
    }

    const updated = await this.expenseRepo.update(userContext.tenantId, id, updates)
    if (!updated) {
      throw new AppError('Failed to execute expense payment', 500, 'PAYMENT_FAILED')
    }

    await this.expenseRepo.createAuditLog({
      _id: `audit-${Date.now()}`,
      expenseId: updated._id,
      expenseNumber: updated.expenseNumber,
      tenantId: userContext.tenantId,
      actorId: userContext.userId,
      actorRole: userContext.role,
      action: 'EXPENSE_PAID',
      previousStatus: 'APPROVED',
      newStatus: 'PAID',
      amount: updated.amount,
      currency: updated.currency,
      paymentMethod: updated.paymentMethod,
      details: { paymentDate: dto.paymentDate },
      timestamp: now,
    })

    return updated
  }

  async archiveExpense(userContext: UserContext, id: string, dto: ArchiveExpenseDto): Promise<Expense> {
    this.enforceTenantAndRoleAccess(userContext)

    if (userContext.role !== 'CLINIC_MANAGER') {
      throw new AppError('Only Clinic Managers are authorized to archive expenses.', 403, 'INSUFFICIENT_PERMISSIONS')
    }

    const expense = await this.expenseRepo.findById(userContext.tenantId, id)
    if (!expense) {
      throw new AppError('Expense record not found', 404, 'EXPENSE_NOT_FOUND')
    }

    const now = new Date().toISOString()
    const updates: Partial<Expense> = {
      archived: true,
      status: 'ARCHIVED',
      auditInfo: {
        ...expense.auditInfo,
        archivedBy: userContext.userId,
        archivedAt: now,
        archivedReason: dto.reason,
      },
    }

    const updated = await this.expenseRepo.update(userContext.tenantId, id, updates)
    if (!updated) {
      throw new AppError('Failed to archive expense', 500, 'ARCHIVE_FAILED')
    }

    await this.expenseRepo.createAuditLog({
      _id: `audit-${Date.now()}`,
      expenseId: updated._id,
      expenseNumber: updated.expenseNumber,
      tenantId: userContext.tenantId,
      actorId: userContext.userId,
      actorRole: userContext.role,
      action: 'EXPENSE_ARCHIVED',
      previousStatus: expense.status,
      newStatus: 'ARCHIVED',
      amount: updated.amount,
      currency: updated.currency,
      paymentMethod: updated.paymentMethod,
      details: { reason: dto.reason },
      timestamp: now,
    })

    return updated
  }

  async restoreExpense(userContext: UserContext, id: string): Promise<Expense> {
    this.enforceTenantAndRoleAccess(userContext)

    if (userContext.role !== 'CLINIC_MANAGER') {
      throw new AppError('Only Clinic Managers are authorized to restore archived expenses.', 403, 'INSUFFICIENT_PERMISSIONS')
    }

    const expense = await this.expenseRepo.findById(userContext.tenantId, id)
    if (!expense) {
      throw new AppError('Expense record not found', 404, 'EXPENSE_NOT_FOUND')
    }

    if (!expense.archived) {
      throw new AppError('Expense is already active and not archived.', 400, 'EXPENSE_NOT_ARCHIVED')
    }

    const now = new Date().toISOString()
    const restoredStatus = expense.auditInfo.approvedBy ? 'APPROVED' : 'DRAFT'

    const updates: Partial<Expense> = {
      archived: false,
      status: restoredStatus,
    }

    const updated = await this.expenseRepo.update(userContext.tenantId, id, updates)
    if (!updated) {
      throw new AppError('Failed to restore expense', 500, 'RESTORE_FAILED')
    }

    await this.expenseRepo.createAuditLog({
      _id: `audit-${Date.now()}`,
      expenseId: updated._id,
      expenseNumber: updated.expenseNumber,
      tenantId: userContext.tenantId,
      actorId: userContext.userId,
      actorRole: userContext.role,
      action: 'EXPENSE_RESTORED',
      previousStatus: 'ARCHIVED',
      newStatus: restoredStatus,
      amount: updated.amount,
      currency: updated.currency,
      paymentMethod: updated.paymentMethod,
      timestamp: now,
    })

    return updated
  }

  async listExpenses(userContext: UserContext, params: QueryExpensesDto) {
    this.enforceTenantAndRoleAccess(userContext)
    return this.expenseRepo.list(userContext.tenantId, params)
  }

  async getDashboardSummary(userContext: UserContext): Promise<ExpenseDashboardSummary> {
    this.enforceTenantAndRoleAccess(userContext)
    return this.expenseRepo.getDashboardSummary(userContext.tenantId)
  }

  // Category Management Service Methods
  async getCategories(userContext: UserContext, includeArchived?: boolean): Promise<ExpenseCategory[]> {
    this.enforceTenantAndRoleAccess(userContext)
    return this.expenseRepo.getCategories(userContext.tenantId, includeArchived)
  }

  async createCategory(userContext: UserContext, dto: CreateExpenseCategoryDto): Promise<ExpenseCategory> {
    this.enforceTenantAndRoleAccess(userContext)

    if (userContext.role !== 'CLINIC_MANAGER') {
      throw new AppError('Only Clinic Managers are authorized to create custom categories.', 403, 'INSUFFICIENT_PERMISSIONS')
    }

    const existingCode = await this.expenseRepo.findCategoryByCode(userContext.tenantId, dto.categoryCode)
    if (existingCode) {
      throw new AppError(`Category code ${dto.categoryCode} already exists in tenant workspace.`, 409, 'DUPLICATE_CATEGORY_CODE')
    }

    const now = new Date().toISOString()
    const newCategory: ExpenseCategory = {
      _id: `cat-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      tenantId: userContext.tenantId,
      clinicId: dto.clinicId || userContext.clinicId || 'branch_main',
      categoryName: dto.categoryName,
      categoryCode: dto.categoryCode,
      description: dto.description,
      color: dto.color || '#2563EB',
      icon: dto.icon || 'Tag',
      isSystem: false,
      isActive: true,
      sortOrder: 99,
      createdAt: now,
      updatedAt: now,
      archived: false,
      version: 1,
    }

    return this.expenseRepo.createCategory(newCategory)
  }

  async updateCategory(userContext: UserContext, id: string, dto: UpdateExpenseCategoryDto): Promise<ExpenseCategory> {
    this.enforceTenantAndRoleAccess(userContext)

    if (userContext.role !== 'CLINIC_MANAGER') {
      throw new AppError('Only Clinic Managers are authorized to update categories.', 403, 'INSUFFICIENT_PERMISSIONS')
    }

    const category = await this.expenseRepo.findCategoryById(userContext.tenantId, id)
    if (!category) {
      throw new AppError('Category not found', 404, 'CATEGORY_NOT_FOUND')
    }

    if (category.isSystem && (dto.categoryName || dto.categoryCode)) {
      throw new AppError('Protected system preset categories cannot be renamed or have their code modified.', 400, 'SYSTEM_CATEGORY_PROTECTED')
    }

    const updates: Partial<ExpenseCategory> = {
      ...(dto.categoryName && { categoryName: dto.categoryName }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.color && { color: dto.color }),
      ...(dto.icon && { icon: dto.icon }),
    }

    const updated = await this.expenseRepo.updateCategory(userContext.tenantId, id, updates)
    if (!updated) {
      throw new AppError('Failed to update category', 500, 'UPDATE_FAILED')
    }
    return updated
  }

  async archiveCategory(userContext: UserContext, id: string): Promise<ExpenseCategory> {
    this.enforceTenantAndRoleAccess(userContext)

    if (userContext.role !== 'CLINIC_MANAGER') {
      throw new AppError('Only Clinic Managers are authorized to archive categories.', 403, 'INSUFFICIENT_PERMISSIONS')
    }

    const category = await this.expenseRepo.findCategoryById(userContext.tenantId, id)
    if (!category) {
      throw new AppError('Category not found', 404, 'CATEGORY_NOT_FOUND')
    }

    if (category.isSystem) {
      throw new AppError('Protected system preset categories cannot be archived.', 400, 'SYSTEM_CATEGORY_PROTECTED')
    }

    const updated = await this.expenseRepo.updateCategory(userContext.tenantId, id, { archived: true, isActive: false })
    if (!updated) {
      throw new AppError('Failed to archive category', 500, 'ARCHIVE_FAILED')
    }
    return updated
  }

  async restoreCategory(userContext: UserContext, id: string): Promise<ExpenseCategory> {
    this.enforceTenantAndRoleAccess(userContext)

    if (userContext.role !== 'CLINIC_MANAGER') {
      throw new AppError('Only Clinic Managers are authorized to restore categories.', 403, 'INSUFFICIENT_PERMISSIONS')
    }

    const category = await this.expenseRepo.findCategoryById(userContext.tenantId, id)
    if (!category) {
      throw new AppError('Category not found', 404, 'CATEGORY_NOT_FOUND')
    }

    const updated = await this.expenseRepo.updateCategory(userContext.tenantId, id, { archived: false, isActive: true })
    if (!updated) {
      throw new AppError('Failed to restore category', 500, 'RESTORE_FAILED')
    }
    return updated
  }
}
