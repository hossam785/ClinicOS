export type ExpenseStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'PAID' | 'ARCHIVED'

export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'CREDIT_CARD' | 'CHEQUE' | 'OTHER'

export interface ExpenseAuditInfo {
  createdBy: string
  createdAt: string
  submittedAt?: string
  approvedBy?: string
  approvedAt?: string
  rejectedBy?: string
  rejectedAt?: string
  rejectionReason?: string
  paidBy?: string
  paidAt?: string
  archivedBy?: string
  archivedAt?: string
  archivedReason?: string
}

export interface Expense {
  _id: string
  expenseNumber: string
  tenantId: string
  clinicId: string
  categoryId: string
  categoryName: string
  title: string
  description?: string
  amount: number
  currency: string
  expenseDate: string
  paymentDate?: string
  paymentMethod: PaymentMethod
  vendorName?: string
  vendorTaxId?: string
  receiptAttachmentUrl?: string
  notes?: string
  status: ExpenseStatus
  auditInfo: ExpenseAuditInfo
  archived: boolean
  version: number
  createdAt: string
  updatedAt: string
}

export interface ExpenseCategory {
  _id: string
  tenantId: string
  clinicId: string
  categoryName: string
  categoryCode: string
  description?: string
  color?: string
  icon?: string
  isSystem: boolean
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
  archived: boolean
  version: number
}

export interface CreateExpenseDto {
  clinicId: string
  categoryId: string
  title: string
  description?: string
  amount: number
  currency: string
  expenseDate: string
  paymentDate?: string
  paymentMethod: PaymentMethod
  vendorName?: string
  vendorTaxId?: string
  notes?: string
  submitForApproval?: boolean
}

export type UpdateExpenseDto = Partial<Omit<CreateExpenseDto, 'clinicId'>>

export interface RejectExpenseDto {
  reason: string
}

export interface PayExpenseDto {
  paymentDate: string
  paymentMethod: PaymentMethod
}

export interface ArchiveExpenseDto {
  reason: string
}

export interface CreateCategoryDto {
  clinicId?: string
  categoryName: string
  categoryCode: string
  description?: string
  color?: string
  icon?: string
  sortOrder?: number
}

export type UpdateCategoryDto = Partial<CreateCategoryDto>

export interface ExpenseQueryParams {
  page?: number
  limit?: number
  categoryId?: string
  status?: ExpenseStatus
  paymentMethod?: PaymentMethod
  vendorName?: string
  startDate?: string
  endDate?: string
  minAmount?: number
  maxAmount?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ExpenseDashboardSummary {
  totalExpenseAmountMonth: number
  paidExpenseAmountMonth: number
  pendingApprovalAmount: number
  pendingApprovalCount: number
  draftCount: number
  rejectedCount: number
  categoryBreakdown: Array<{
    categoryId: string
    categoryName: string
    color: string
    amount: number
    percentage: number
  }>
  recentExpenses: Expense[]
}
