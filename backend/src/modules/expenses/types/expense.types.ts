export type ExpenseStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'PAID'
  | 'ARCHIVED'

export type PaymentMethod =
  | 'CASH'
  | 'BANK_TRANSFER'
  | 'CREDIT_CARD'
  | 'CHEQUE'
  | 'OTHER'

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
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
  archived: boolean
  version: number
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

export interface ExpenseAuditLog {
  _id: string
  expenseId: string
  expenseNumber: string
  tenantId: string
  actorId: string
  actorRole: string
  action: string
  previousStatus?: ExpenseStatus
  newStatus?: ExpenseStatus
  amount: number
  currency: string
  paymentMethod: PaymentMethod
  details?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
  timestamp: string
}

export interface CreateExpenseDto {
  clinicId: string
  categoryId: string
  title: string
  description?: string
  amount: number
  currency: string
  expenseDate: string
  paymentMethod: PaymentMethod
  vendorName?: string
  vendorTaxId?: string
  receiptAttachmentUrl?: string
  notes?: string
  submitForApproval?: boolean
}

export interface UpdateExpenseDto {
  categoryId?: string
  title?: string
  description?: string
  amount?: number
  currency?: string
  expenseDate?: string
  paymentMethod?: PaymentMethod
  vendorName?: string
  vendorTaxId?: string
  receiptAttachmentUrl?: string
  notes?: string
}

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

export interface QueryExpensesDto {
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
}

export interface CreateExpenseCategoryDto {
  clinicId?: string
  categoryName: string
  categoryCode: string
  description?: string
  color?: string
  icon?: string
}

export interface UpdateExpenseCategoryDto {
  categoryName?: string
  categoryCode?: string
  description?: string
  color?: string
  icon?: string
}

export interface CategoryBreakdownItem {
  categoryId: string
  categoryName: string
  amount: number
  percentage: number
  color?: string
}

export interface ExpenseDashboardSummary {
  totalExpenseAmountMonth: number
  paidExpenseAmountMonth: number
  pendingApprovalAmount: number
  pendingApprovalCount: number
  draftCount: number
  rejectedCount: number
  categoryBreakdown: CategoryBreakdownItem[]
  recentExpenses: Expense[]
}
