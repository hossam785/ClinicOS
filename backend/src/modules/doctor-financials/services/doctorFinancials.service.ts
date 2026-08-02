import { AppError } from '@/shared/errors/AppError'
import type { IDoctorFinancialsRepository } from '../repositories/doctorFinancials.repository'
import type {
  Settlement,
  DoctorFinancialAccount,
  DoctorFinancialsDashboardSummary,
  CreateSettlementDto,
  UpdateSettlementDto,
  RejectSettlementDto,
  RecordPaymentDto,
  ArchiveSettlementDto,
  QuerySettlementsDto,
} from '../types/doctorFinancials.types'

export interface UserContext {
  userId: string
  role: string
  tenantId: string
  clinicId?: string
}

export class DoctorFinancialsService {
  constructor(private repo: IDoctorFinancialsRepository) {}

  private enforceTenantAndRoleAccess(userContext: UserContext, targetDoctorId?: string): void {
    if (userContext.role === 'PLATFORM_ADMIN') {
      throw new AppError(
        'Platform Administrators are strictly barred from viewing or managing clinic financial records.',
        403,
        'PLATFORM_ADMIN_FINANCIAL_RESTRICTED'
      )
    }

    if (userContext.role === 'RECEPTIONIST') {
      throw new AppError('Receptionists are not authorized to access doctor financial accounts.', 403, 'INSUFFICIENT_PERMISSIONS')
    }

    if (userContext.role === 'DOCTOR' && targetDoctorId && targetDoctorId !== userContext.userId) {
      throw new AppError('Doctors are strictly restricted to viewing their own financial accounts only.', 403, 'INSUFFICIENT_PERMISSIONS')
    }
  }

  private generateSettlementNumber(yearMonth: string, sequence: number): string {
    const padded = String(sequence).padStart(5, '0')
    return `STL-${yearMonth}-${padded}`
  }

  async createSettlement(userContext: UserContext, dto: CreateSettlementDto): Promise<Settlement> {
    this.enforceTenantAndRoleAccess(userContext)

    if (userContext.role !== 'CLINIC_MANAGER') {
      throw new AppError('Only Clinic Managers are authorized to create doctor settlement statements.', 403, 'INSUFFICIENT_PERMISSIONS')
    }

    const today = new Date()
    const yearMonth = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}`
    const sequence = await this.repo.getNextSequence(userContext.tenantId)
    const settlementNumber = this.generateSettlementNumber(yearMonth, sequence)
    const now = new Date().toISOString()

    const completedVisitsCount = 20
    const grossRevenue = 20000
    const doctorShare = 12000 // 60% split
    const clinicShare = 8000

    const newSettlement: Settlement = {
      _id: `stl-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      settlementNumber,
      tenantId: userContext.tenantId,
      clinicId: dto.clinicId || userContext.clinicId || 'branch_main',
      doctorId: dto.doctorId,
      doctorName: dto.doctorId === 'doc-101' ? 'Dr. Sarah Jenkins' : 'Dr. Michael Chen',
      settlementPeriod: {
        startDate: dto.startDate,
        endDate: dto.endDate,
      },
      completedVisitsCount,
      grossRevenue,
      doctorShare,
      clinicShare,
      amountPaid: 0,
      outstandingBalance: doctorShare,
      paymentMethod: 'BANK_TRANSFER',
      status: 'DRAFT',
      notes: dto.notes,
      auditInfo: {
        createdBy: userContext.userId,
        createdAt: now,
      },
      createdAt: now,
      updatedAt: now,
      archived: false,
      version: 1,
    }

    const created = await this.repo.create(newSettlement)

    await this.repo.createAuditLog({
      _id: `audit-${Date.now()}`,
      settlementId: created._id,
      settlementNumber: created.settlementNumber,
      tenantId: userContext.tenantId,
      actorId: userContext.userId,
      actorRole: userContext.role,
      action: 'SETTLEMENT_CREATED',
      newStatus: created.status,
      doctorShare: created.doctorShare,
      timestamp: now,
    })

    return created
  }

  async getSettlementById(userContext: UserContext, id: string): Promise<Settlement> {
    const settlement = await this.repo.findById(userContext.tenantId, id)
    if (!settlement) {
      throw new AppError('Settlement statement record not found', 404, 'SETTLEMENT_NOT_FOUND')
    }

    this.enforceTenantAndRoleAccess(userContext, settlement.doctorId)
    return settlement
  }

  async updateSettlement(userContext: UserContext, id: string, dto: UpdateSettlementDto): Promise<Settlement> {
    this.enforceTenantAndRoleAccess(userContext)

    if (userContext.role !== 'CLINIC_MANAGER') {
      throw new AppError('Only Clinic Managers are authorized to update settlement statements.', 403, 'INSUFFICIENT_PERMISSIONS')
    }

    const settlement = await this.repo.findById(userContext.tenantId, id)
    if (!settlement) {
      throw new AppError('Settlement statement record not found', 404, 'SETTLEMENT_NOT_FOUND')
    }

    if (settlement.status !== 'DRAFT') {
      throw new AppError(`Cannot update settlement in ${settlement.status} status. Only DRAFT settlements are editable.`, 409, 'SETTLEMENT_LOCKED')
    }

    const updates: Partial<Settlement> = {
      ...(dto.startDate || dto.endDate
        ? {
            settlementPeriod: {
              startDate: dto.startDate || settlement.settlementPeriod.startDate,
              endDate: dto.endDate || settlement.settlementPeriod.endDate,
            },
          }
        : {}),
      ...(dto.notes !== undefined && { notes: dto.notes }),
    }

    const updated = await this.repo.update(userContext.tenantId, id, updates)
    if (!updated) {
      throw new AppError('Failed to update settlement statement', 500, 'UPDATE_FAILED')
    }

    const now = new Date().toISOString()
    await this.repo.createAuditLog({
      _id: `audit-${Date.now()}`,
      settlementId: updated._id,
      settlementNumber: updated.settlementNumber,
      tenantId: userContext.tenantId,
      actorId: userContext.userId,
      actorRole: userContext.role,
      action: 'SETTLEMENT_UPDATED',
      previousStatus: settlement.status,
      newStatus: updated.status,
      doctorShare: updated.doctorShare,
      timestamp: now,
    })

    return updated
  }

  async submitSettlement(userContext: UserContext, id: string): Promise<Settlement> {
    this.enforceTenantAndRoleAccess(userContext)

    if (userContext.role !== 'CLINIC_MANAGER') {
      throw new AppError('Only Clinic Managers are authorized to submit settlement statements.', 403, 'INSUFFICIENT_PERMISSIONS')
    }

    const settlement = await this.repo.findById(userContext.tenantId, id)
    if (!settlement) {
      throw new AppError('Settlement statement record not found', 404, 'SETTLEMENT_NOT_FOUND')
    }

    if (settlement.status !== 'DRAFT') {
      throw new AppError(`Cannot submit settlement in ${settlement.status} status. Must be DRAFT or REJECTED.`, 400, 'INVALID_STATUS_TRANSITION')
    }

    const now = new Date().toISOString()
    const updates: Partial<Settlement> = {
      status: 'PENDING_REVIEW',
      auditInfo: {
        ...settlement.auditInfo,
        submittedBy: userContext.userId,
        submittedAt: now,
      },
    }

    const updated = await this.repo.update(userContext.tenantId, id, updates)
    if (!updated) {
      throw new AppError('Failed to submit settlement statement', 500, 'SUBMIT_FAILED')
    }

    await this.repo.createAuditLog({
      _id: `audit-${Date.now()}`,
      settlementId: updated._id,
      settlementNumber: updated.settlementNumber,
      tenantId: userContext.tenantId,
      actorId: userContext.userId,
      actorRole: userContext.role,
      action: 'SETTLEMENT_SUBMITTED',
      previousStatus: settlement.status,
      newStatus: 'PENDING_REVIEW',
      doctorShare: updated.doctorShare,
      timestamp: now,
    })

    return updated
  }

  async approveSettlement(userContext: UserContext, id: string): Promise<Settlement> {
    this.enforceTenantAndRoleAccess(userContext)

    if (userContext.role !== 'CLINIC_MANAGER') {
      throw new AppError('Only Clinic Managers are authorized to approve settlement statements.', 403, 'INSUFFICIENT_PERMISSIONS')
    }

    const settlement = await this.repo.findById(userContext.tenantId, id)
    if (!settlement) {
      throw new AppError('Settlement statement record not found', 404, 'SETTLEMENT_NOT_FOUND')
    }

    if (settlement.status !== 'PENDING_REVIEW') {
      throw new AppError(`Cannot approve settlement in ${settlement.status} status. Must be PENDING_REVIEW.`, 400, 'INVALID_STATUS_TRANSITION')
    }

    const now = new Date().toISOString()
    const updates: Partial<Settlement> = {
      status: 'APPROVED',
      auditInfo: {
        ...settlement.auditInfo,
        approvedBy: userContext.userId,
        approvedAt: now,
      },
    }

    const updated = await this.repo.update(userContext.tenantId, id, updates)
    if (!updated) {
      throw new AppError('Failed to approve settlement statement', 500, 'APPROVE_FAILED')
    }

    await this.repo.createAuditLog({
      _id: `audit-${Date.now()}`,
      settlementId: updated._id,
      settlementNumber: updated.settlementNumber,
      tenantId: userContext.tenantId,
      actorId: userContext.userId,
      actorRole: userContext.role,
      action: 'SETTLEMENT_APPROVED',
      previousStatus: 'PENDING_REVIEW',
      newStatus: 'APPROVED',
      doctorShare: updated.doctorShare,
      timestamp: now,
    })

    return updated
  }

  async rejectSettlement(userContext: UserContext, id: string, dto: RejectSettlementDto): Promise<Settlement> {
    this.enforceTenantAndRoleAccess(userContext)

    if (userContext.role !== 'CLINIC_MANAGER') {
      throw new AppError('Only Clinic Managers are authorized to reject settlement statements.', 403, 'INSUFFICIENT_PERMISSIONS')
    }

    const settlement = await this.repo.findById(userContext.tenantId, id)
    if (!settlement) {
      throw new AppError('Settlement statement record not found', 404, 'SETTLEMENT_NOT_FOUND')
    }

    if (settlement.status !== 'PENDING_REVIEW') {
      throw new AppError(`Cannot reject settlement in ${settlement.status} status. Must be PENDING_REVIEW.`, 400, 'INVALID_STATUS_TRANSITION')
    }

    const now = new Date().toISOString()
    const updates: Partial<Settlement> = {
      status: 'DRAFT',
      auditInfo: {
        ...settlement.auditInfo,
        rejectedBy: userContext.userId,
        rejectedAt: now,
        rejectionReason: dto.reason,
      },
    }

    const updated = await this.repo.update(userContext.tenantId, id, updates)
    if (!updated) {
      throw new AppError('Failed to reject settlement statement', 500, 'REJECT_FAILED')
    }

    await this.repo.createAuditLog({
      _id: `audit-${Date.now()}`,
      settlementId: updated._id,
      settlementNumber: updated.settlementNumber,
      tenantId: userContext.tenantId,
      actorId: userContext.userId,
      actorRole: userContext.role,
      action: 'SETTLEMENT_REJECTED',
      previousStatus: 'PENDING_REVIEW',
      newStatus: 'DRAFT',
      doctorShare: updated.doctorShare,
      details: { reason: dto.reason },
      timestamp: now,
    })

    return updated
  }

  async recordPayment(userContext: UserContext, id: string, dto: RecordPaymentDto): Promise<Settlement> {
    this.enforceTenantAndRoleAccess(userContext)

    if (userContext.role !== 'CLINIC_MANAGER') {
      throw new AppError('Only Clinic Managers are authorized to record payment disbursements.', 403, 'INSUFFICIENT_PERMISSIONS')
    }

    const settlement = await this.repo.findById(userContext.tenantId, id)
    if (!settlement) {
      throw new AppError('Settlement statement record not found', 404, 'SETTLEMENT_NOT_FOUND')
    }

    if (settlement.status !== 'APPROVED' && settlement.status !== 'PAID') {
      throw new AppError(`Cannot record payment for settlement in ${settlement.status} status. Must be APPROVED or PAID.`, 400, 'INVALID_STATUS_TRANSITION')
    }

    if (dto.amountPaid > settlement.outstandingBalance) {
      throw new AppError(
        `Payment amount of ${dto.amountPaid} EGP exceeds remaining outstanding balance of ${settlement.outstandingBalance} EGP.`,
        400,
        'INVALID_PAYMENT_AMOUNT'
      )
    }

    const now = new Date().toISOString()
    const newAmountPaid = settlement.amountPaid + dto.amountPaid
    const newOutstanding = settlement.doctorShare - newAmountPaid
    const newStatus = newOutstanding === 0 ? 'CLOSED' : 'PAID'

    const newPaymentRecord = {
      paymentId: `pmt-${Date.now()}`,
      amountPaid: dto.amountPaid,
      paymentDate: dto.paymentDate,
      paymentMethod: dto.paymentMethod,
      referenceNumber: dto.referenceNumber,
      notes: dto.notes,
      recordedBy: userContext.userId,
      recordedAt: now,
    }

    const updates: Partial<Settlement> = {
      amountPaid: newAmountPaid,
      outstandingBalance: newOutstanding,
      status: newStatus,
      paymentMethod: dto.paymentMethod,
      paymentRecords: [...(settlement.paymentRecords || []), newPaymentRecord],
      ...(newOutstanding === 0 && {
        auditInfo: {
          ...settlement.auditInfo,
          closedBy: userContext.userId,
          closedAt: now,
        },
      }),
    }

    const updated = await this.repo.update(userContext.tenantId, id, updates)
    if (!updated) {
      throw new AppError('Failed to record payment disbursement', 500, 'PAYMENT_FAILED')
    }

    await this.repo.createAuditLog({
      _id: `audit-${Date.now()}`,
      settlementId: updated._id,
      settlementNumber: updated.settlementNumber,
      tenantId: userContext.tenantId,
      actorId: userContext.userId,
      actorRole: userContext.role,
      action: 'PAYMENT_DISBURSED',
      previousStatus: settlement.status,
      newStatus: updated.status,
      doctorShare: updated.doctorShare,
      amountPaid: dto.amountPaid,
      details: { paymentDate: dto.paymentDate, paymentMethod: dto.paymentMethod, referenceNumber: dto.referenceNumber },
      timestamp: now,
    })

    return updated
  }

  async closeSettlement(userContext: UserContext, id: string): Promise<Settlement> {
    this.enforceTenantAndRoleAccess(userContext)

    if (userContext.role !== 'CLINIC_MANAGER') {
      throw new AppError('Only Clinic Managers are authorized to close settlement statements.', 403, 'INSUFFICIENT_PERMISSIONS')
    }

    const settlement = await this.repo.findById(userContext.tenantId, id)
    if (!settlement) {
      throw new AppError('Settlement statement record not found', 404, 'SETTLEMENT_NOT_FOUND')
    }

    if (settlement.outstandingBalance > 0) {
      throw new AppError(
        `Cannot close settlement statement with remaining unpaid balance of ${settlement.outstandingBalance} EGP. Must disburse full balance first.`,
        400,
        'UNSETTLED_BALANCE_REMAINS'
      )
    }

    const now = new Date().toISOString()
    const updates: Partial<Settlement> = {
      status: 'CLOSED',
      auditInfo: {
        ...settlement.auditInfo,
        closedBy: userContext.userId,
        closedAt: now,
      },
    }

    const updated = await this.repo.update(userContext.tenantId, id, updates)
    if (!updated) {
      throw new AppError('Failed to close settlement statement', 500, 'CLOSE_FAILED')
    }

    await this.repo.createAuditLog({
      _id: `audit-${Date.now()}`,
      settlementId: updated._id,
      settlementNumber: updated.settlementNumber,
      tenantId: userContext.tenantId,
      actorId: userContext.userId,
      actorRole: userContext.role,
      action: 'SETTLEMENT_CLOSED',
      previousStatus: settlement.status,
      newStatus: 'CLOSED',
      doctorShare: updated.doctorShare,
      timestamp: now,
    })

    return updated
  }

  async archiveSettlement(userContext: UserContext, id: string, dto: ArchiveSettlementDto): Promise<Settlement> {
    this.enforceTenantAndRoleAccess(userContext)

    if (userContext.role !== 'CLINIC_MANAGER') {
      throw new AppError('Only Clinic Managers are authorized to archive settlement statements.', 403, 'INSUFFICIENT_PERMISSIONS')
    }

    const settlement = await this.repo.findById(userContext.tenantId, id)
    if (!settlement) {
      throw new AppError('Settlement statement record not found', 404, 'SETTLEMENT_NOT_FOUND')
    }

    const now = new Date().toISOString()
    const updates: Partial<Settlement> = {
      archived: true,
      status: 'ARCHIVED',
      auditInfo: {
        ...settlement.auditInfo,
        archivedBy: userContext.userId,
        archivedAt: now,
        archivedReason: dto.reason,
      },
    }

    const updated = await this.repo.update(userContext.tenantId, id, updates)
    if (!updated) {
      throw new AppError('Failed to archive settlement statement', 500, 'ARCHIVE_FAILED')
    }

    await this.repo.createAuditLog({
      _id: `audit-${Date.now()}`,
      settlementId: updated._id,
      settlementNumber: updated.settlementNumber,
      tenantId: userContext.tenantId,
      actorId: userContext.userId,
      actorRole: userContext.role,
      action: 'SETTLEMENT_ARCHIVED',
      previousStatus: settlement.status,
      newStatus: 'ARCHIVED',
      doctorShare: updated.doctorShare,
      details: { reason: dto.reason },
      timestamp: now,
    })

    return updated
  }

  async restoreSettlement(userContext: UserContext, id: string): Promise<Settlement> {
    this.enforceTenantAndRoleAccess(userContext)

    if (userContext.role !== 'CLINIC_MANAGER') {
      throw new AppError('Only Clinic Managers are authorized to restore settlement statements.', 403, 'INSUFFICIENT_PERMISSIONS')
    }

    const settlement = await this.repo.findById(userContext.tenantId, id)
    if (!settlement) {
      throw new AppError('Settlement statement record not found', 404, 'SETTLEMENT_NOT_FOUND')
    }

    if (!settlement.archived) {
      throw new AppError('Settlement statement is active and not archived.', 400, 'SETTLEMENT_NOT_ARCHIVED')
    }

    const now = new Date().toISOString()
    const restoredStatus = settlement.auditInfo.approvedBy ? 'APPROVED' : 'DRAFT'
    const updates: Partial<Settlement> = {
      archived: false,
      status: restoredStatus,
    }

    const updated = await this.repo.update(userContext.tenantId, id, updates)
    if (!updated) {
      throw new AppError('Failed to restore settlement statement', 500, 'RESTORE_FAILED')
    }

    await this.repo.createAuditLog({
      _id: `audit-${Date.now()}`,
      settlementId: updated._id,
      settlementNumber: updated.settlementNumber,
      tenantId: userContext.tenantId,
      actorId: userContext.userId,
      actorRole: userContext.role,
      action: 'SETTLEMENT_RESTORED',
      previousStatus: 'ARCHIVED',
      newStatus: restoredStatus,
      doctorShare: updated.doctorShare,
      timestamp: now,
    })

    return updated
  }

  async listSettlements(userContext: UserContext, params: QuerySettlementsDto) {
    this.enforceTenantAndRoleAccess(userContext, params.doctorId)
    // If user is doctor, force filter doctorId = userId
    const effectiveParams =
      userContext.role === 'DOCTOR' ? { ...params, doctorId: userContext.userId } : params

    return this.repo.list(userContext.tenantId, effectiveParams)
  }

  async getAccountSummary(userContext: UserContext, doctorId: string): Promise<DoctorFinancialAccount> {
    this.enforceTenantAndRoleAccess(userContext, doctorId)
    return this.repo.getAccountSummary(userContext.tenantId, doctorId)
  }

  async getDashboardSummary(userContext: UserContext): Promise<DoctorFinancialsDashboardSummary> {
    this.enforceTenantAndRoleAccess(userContext)
    return this.repo.getDashboardSummary(userContext.tenantId)
  }
}
