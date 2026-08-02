export type SettlementStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'PAID'
  | 'CLOSED'
  | 'ARCHIVED'

export type CompensationModel = 'PERCENTAGE' | 'FIXED' | 'HYBRID'

export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'CHEQUE' | 'CREDIT_CARD'

export interface SettlementPeriod {
  startDate: string
  endDate: string
}

export interface VisitLineItem {
  visitId: string
  visitDate: string
  patientName: string
  treatmentName: string
  grossAmount: number
  doctorShare: number
  clinicShare: number
}

export interface PaymentRecord {
  paymentId: string
  amountPaid: number
  paymentDate: string
  paymentMethod: PaymentMethod
  referenceNumber?: string
  notes?: string
  recordedBy: string
  recordedAt: string
}

export interface SettlementAuditInfo {
  createdBy: string
  createdAt: string
  submittedBy?: string
  submittedAt?: string
  approvedBy?: string
  approvedAt?: string
  rejectedBy?: string
  rejectedAt?: string
  rejectionReason?: string
  closedBy?: string
  closedAt?: string
  archivedBy?: string
  archivedAt?: string
  archivedReason?: string
}

export interface Settlement {
  _id: string
  settlementNumber: string
  tenantId: string
  clinicId: string
  doctorId: string
  doctorName: string
  settlementPeriod: SettlementPeriod
  completedVisitsCount: number
  grossRevenue: number
  doctorShare: number
  clinicShare: number
  amountPaid: number
  outstandingBalance: number
  paymentMethod: PaymentMethod
  status: SettlementStatus
  auditInfo: SettlementAuditInfo
  lineItems?: VisitLineItem[]
  paymentRecords?: PaymentRecord[]
  notes?: string
  createdAt: string
  updatedAt: string
  archived: boolean
  version: number
}

export interface DoctorFinancialAccount {
  doctorId: string
  doctorName: string
  tenantId: string
  compensationModel: CompensationModel
  compensationPercentage?: number
  fixedFeePerVisit?: number
  currency: string
  totalRealizedEarnings: number
  totalDisbursedPaid: number
  unsettledBalance: number
  lastSettlementDate?: string
}

export interface DoctorFinancialsDashboardSummary {
  totalEarningsYtd: number
  totalClinicShareYtd: number
  pendingDisbursalBalance: number
  completedVisitsMonth: number
  recentPaymentsCount: number
  recentSettlements: Settlement[]
}

export interface CreateSettlementDto {
  doctorId: string
  clinicId?: string
  startDate: string
  endDate: string
  notes?: string
}

export interface UpdateSettlementDto {
  startDate?: string
  endDate?: string
  notes?: string
}

export interface RecordPaymentDto {
  amountPaid: number
  paymentDate: string
  paymentMethod: PaymentMethod
  referenceNumber?: string
  notes?: string
}

export interface QuerySettlementsParams {
  doctorId?: string
  status?: SettlementStatus
  paymentMethod?: PaymentMethod
  startDate?: string
  endDate?: string
  search?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
