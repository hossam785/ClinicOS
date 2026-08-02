import { InMemoryDoctorFinancialsRepository } from './repositories/doctorFinancials.repository'
import { DoctorFinancialsService, UserContext } from './services/doctorFinancials.service'
import { DoctorFinancialsValidator } from './validators/doctorFinancials.validator'
import type { CreateSettlementDto, RecordPaymentDto, PaymentMethod } from './types/doctorFinancials.types'
import { AppError } from '@/shared/errors/AppError'

async function runDoctorFinancialsIntegrationTests() {
  console.info('===========================================================')
  console.info('STARTING TASK-099: DOCTOR FINANCIAL ACCOUNTS INTEGRATION TESTS')
  console.info('===========================================================')

  let totalTests = 0

  function assert(condition: boolean, testName: string, failureDetails?: string) {
    totalTests++
    if (condition) {
      console.info(`[PASS] Test #${totalTests}: ${testName}`)
    } else {
      console.error(`[FAIL] Test #${totalTests}: ${testName}`)
      if (failureDetails) console.error(`       Details: ${failureDetails}`)
      throw new Error(`Integration Test Failed: ${testName} - ${failureDetails || ''}`)
    }
  }

  const repo = new InMemoryDoctorFinancialsRepository()
  const service = new DoctorFinancialsService(repo)

  const tenantId = 'clinic-101'
  const managerContext: UserContext = {
    userId: 'usr-manager-1',
    role: 'CLINIC_MANAGER',
    tenantId,
    clinicId: 'branch_main',
  }
  const doctorContext: UserContext = {
    userId: 'doc-101',
    role: 'DOCTOR',
    tenantId,
    clinicId: 'branch_main',
  }
  const otherDoctorContext: UserContext = {
    userId: 'doc-999',
    role: 'DOCTOR',
    tenantId,
    clinicId: 'branch_main',
  }
  const receptionistContext: UserContext = {
    userId: 'usr-receptionist-1',
    role: 'RECEPTIONIST',
    tenantId,
    clinicId: 'branch_main',
  }
  const platformAdminContext: UserContext = {
    userId: 'usr-admin-99',
    role: 'PLATFORM_ADMIN',
    tenantId: 'system-tenant',
  }

  // -------------------------------------------------------------
  // GROUP 1: Pre-database Request Validation Pipelines
  // -------------------------------------------------------------
  console.info('\n--- GROUP 1: Pre-database Request Validation Pipelines ---')

  try {
    DoctorFinancialsValidator.validateCreateSettlement({ doctorId: '', startDate: '2026-07-01', endDate: '2026-07-15' })
    assert(false, 'Validation: Empty Doctor ID should throw error')
  } catch (err) {
    assert(err instanceof AppError && err.errorCode === 'INVALID_DOCTOR_ID', 'Validation: Rejected empty doctor ID')
  }

  try {
    DoctorFinancialsValidator.validateCreateSettlement({ doctorId: 'doc-101', startDate: 'invalid-date', endDate: '2026-07-15' })
    assert(false, 'Validation: Invalid start date format should throw error')
  } catch (err) {
    assert(err instanceof AppError && err.errorCode === 'INVALID_DATE', 'Validation: Rejected invalid start date')
  }

  try {
    DoctorFinancialsValidator.validateCreateSettlement({ doctorId: 'doc-101', startDate: '2026-07-20', endDate: '2026-07-10' })
    assert(false, 'Validation: Start date after end date should throw error')
  } catch (err) {
    assert(err instanceof AppError && err.errorCode === 'INVALID_DATE_RANGE', 'Validation: Rejected invalid date range bounds')
  }

  try {
    DoctorFinancialsValidator.validateRecordPayment({ amountPaid: -500, paymentDate: '2026-07-16', paymentMethod: 'CASH' })
    assert(false, 'Validation: Negative payment amount should throw error')
  } catch (err) {
    assert(err instanceof AppError && err.errorCode === 'INVALID_PAYMENT_AMOUNT', 'Validation: Rejected negative payment amount')
  }

  try {
    DoctorFinancialsValidator.validateRecordPayment({ amountPaid: 1000, paymentDate: '2026-07-16', paymentMethod: 'BITCOIN' })
    assert(false, 'Validation: Unsupported payment method should throw error')
  } catch (err) {
    assert(err instanceof AppError && err.errorCode === 'INVALID_PAYMENT_METHOD', 'Validation: Rejected invalid payment method')
  }

  try {
    DoctorFinancialsValidator.validateArchiveSettlement({ reason: '   ' })
    assert(false, 'Validation: Whitespace archival reason should throw error')
  } catch (err) {
    assert(err instanceof AppError && err.errorCode === 'MISSING_ARCHIVE_REASON', 'Validation: Rejected empty archival reason')
  }

  // -------------------------------------------------------------
  // GROUP 2: Platform Owner Financial Privacy Barrier
  // -------------------------------------------------------------
  console.info('\n--- GROUP 2: Platform Owner Financial Privacy Barrier ---')

  try {
    await service.getDashboardSummary(platformAdminContext)
    assert(false, 'Security: Platform Admin should be barred from financial dashboard')
  } catch (err) {
    assert(err instanceof AppError && err.errorCode === 'PLATFORM_ADMIN_FINANCIAL_RESTRICTED', 'Security: Platform Admin barred from financial dashboard')
  }

  try {
    await service.getAccountSummary(platformAdminContext, 'doc-101')
    assert(false, 'Security: Platform Admin should be barred from doctor account summary')
  } catch (err) {
    assert(err instanceof AppError && err.errorCode === 'PLATFORM_ADMIN_FINANCIAL_RESTRICTED', 'Security: Platform Admin barred from account summary')
  }

  try {
    await service.createSettlement(platformAdminContext, { doctorId: 'doc-101', startDate: '2026-07-01', endDate: '2026-07-15' })
    assert(false, 'Security: Platform Admin should be barred from creating settlements')
  } catch (err) {
    assert(err instanceof AppError && err.errorCode === 'PLATFORM_ADMIN_FINANCIAL_RESTRICTED', 'Security: Platform Admin barred from settlement creation')
  }

  // -------------------------------------------------------------
  // GROUP 3: Doctor Self-Service Ownership Scoping
  // -------------------------------------------------------------
  console.info('\n--- GROUP 3: Doctor Self-Service Ownership Scoping ---')

  const docOwnAccount = await service.getAccountSummary(doctorContext, 'doc-101')
  assert(docOwnAccount.doctorId === 'doc-101', 'Doctor Ownership: Doctor can view own financial account')

  try {
    await service.getAccountSummary(otherDoctorContext, 'doc-101')
    assert(false, 'Doctor Ownership: Doctor should not access another doctor financial account')
  } catch (err) {
    assert(err instanceof AppError && err.errorCode === 'INSUFFICIENT_PERMISSIONS', 'Doctor Ownership: Blocked unauthorized doctor cross-access')
  }

  // -------------------------------------------------------------
  // GROUP 4: Role-Based Access Control (RBAC)
  // -------------------------------------------------------------
  console.info('\n--- GROUP 4: Role-Based Access Control (RBAC) ---')

  try {
    await service.createSettlement(receptionistContext, { doctorId: 'doc-101', startDate: '2026-07-01', endDate: '2026-07-15' })
    assert(false, 'RBAC: Receptionist should not create settlements')
  } catch (err) {
    assert(err instanceof AppError && err.errorCode === 'INSUFFICIENT_PERMISSIONS', 'RBAC: Receptionist blocked from creation')
  }

  try {
    await service.approveSettlement(receptionistContext, 'stl-103')
    assert(false, 'RBAC: Receptionist should not approve settlements')
  } catch (err) {
    assert(err instanceof AppError && err.errorCode === 'INSUFFICIENT_PERMISSIONS', 'RBAC: Receptionist blocked from approval')
  }

  // -------------------------------------------------------------
  // GROUP 5: State Machine Lifecycle Workflow Transitions
  // -------------------------------------------------------------
  console.info('\n--- GROUP 5: State Machine Lifecycle Workflow Transitions ---')

  const createDto: CreateSettlementDto = {
    doctorId: 'doc-101',
    startDate: '2026-07-01',
    endDate: '2026-07-15',
    notes: 'Integration test settlement statement',
  }

  const created = await service.createSettlement(managerContext, createDto)
  assert(created.status === 'DRAFT', 'Workflow: Created settlement initialized in DRAFT status')
  assert(created.settlementNumber.startsWith('STL-'), 'Workflow: Settlement code generated correctly')
  assert(created.doctorShare === 12000, 'Workflow: 60% doctor share computed correctly')
  assert(created.outstandingBalance === 12000, 'Workflow: Initial outstanding balance equals doctor share')

  const updatedDraft = await service.updateSettlement(managerContext, created._id, { notes: 'Updated notes for integration test' })
  assert(updatedDraft?.notes === 'Updated notes for integration test', 'Workflow: DRAFT settlement updated successfully')

  const submitted = await service.submitSettlement(managerContext, created._id)
  assert(submitted.status === 'PENDING_REVIEW', 'Workflow: Submitted settlement transitioned to PENDING_REVIEW')

  try {
    await service.updateSettlement(managerContext, created._id, { notes: 'Illegal update after submission' })
    assert(false, 'Workflow: Updating PENDING_REVIEW settlement should throw error')
  } catch (err) {
    assert(err instanceof AppError && err.errorCode === 'SETTLEMENT_LOCKED', 'Workflow: Prevented updating locked settlement')
  }

  const approved = await service.approveSettlement(managerContext, created._id)
  assert(approved.status === 'APPROVED', 'Workflow: Approved settlement transitioned to APPROVED status')
  assert(approved.auditInfo.approvedBy === 'usr-manager-1', 'Workflow: Approval audit info recorded')

  // -------------------------------------------------------------
  // GROUP 6: Financial Engine Calculations & Payment Disbursements
  // -------------------------------------------------------------
  console.info('\n--- GROUP 6: Financial Engine Calculations & Payment Disbursements ---')

  const partialPmtDto: RecordPaymentDto = {
    amountPaid: 5000,
    paymentDate: '2026-07-17',
    paymentMethod: 'BANK_TRANSFER' as PaymentMethod,
    referenceNumber: 'TRX-PARTIAL-001',
    notes: 'First partial disbursement',
  }

  const partialPaid = await service.recordPayment(managerContext, created._id, partialPmtDto)
  assert(partialPaid.status === 'PAID', 'Disbursement: Partial payment transitioned status to PAID')
  assert(partialPaid.amountPaid === 5000, 'Disbursement: Total amount paid updated to 5000 EGP')
  assert(partialPaid.outstandingBalance === 7000, 'Disbursement: Outstanding balance reduced to 7000 EGP')
  assert(partialPaid.paymentRecords?.length === 1, 'Disbursement: Payment record log appended')

  try {
    await service.recordPayment(managerContext, created._id, {
      amountPaid: 10000,
      paymentDate: '2026-07-18',
      paymentMethod: 'CASH',
    })
    assert(false, 'Overpayment Guard: Disbursing 10000 EGP when 7000 EGP remains should throw error')
  } catch (err) {
    assert(err instanceof AppError && err.errorCode === 'INVALID_PAYMENT_AMOUNT', 'Overpayment Guard: Prevented overpayment exceeding outstanding balance')
  }

  try {
    await service.closeSettlement(managerContext, created._id)
    assert(false, 'Closing Guard: Closing settlement with 7000 EGP remaining balance should throw error')
  } catch (err) {
    assert(err instanceof AppError && err.errorCode === 'UNSETTLED_BALANCE_REMAINS', 'Closing Guard: Prevented closing settlement with remaining balance')
  }

  const finalPmtDto: RecordPaymentDto = {
    amountPaid: 7000,
    paymentDate: '2026-07-19',
    paymentMethod: 'BANK_TRANSFER',
    referenceNumber: 'TRX-FINAL-002',
    notes: 'Final balance settlement payout',
  }

  const fullyPaid = await service.recordPayment(managerContext, created._id, finalPmtDto)
  assert(fullyPaid.status === 'CLOSED', 'Disbursement: Full payout automatically closed settlement statement')
  assert(fullyPaid.outstandingBalance === 0, 'Disbursement: Outstanding balance reached exactly 0 EGP')
  assert(fullyPaid.paymentRecords?.length === 2, 'Disbursement: Payment record history contains 2 entries')

  // -------------------------------------------------------------
  // GROUP 7: Soft-Delete Archival & Restoration
  // -------------------------------------------------------------
  console.info('\n--- GROUP 7: Soft-Delete Archival & Restoration ---')

  const archived = await service.archiveSettlement(managerContext, created._id, { reason: 'Annual audit archiving' })
  assert(archived.archived === true, 'Archival: Settlement marked as archived')
  assert(archived.status === 'ARCHIVED', 'Archival: Settlement status updated to ARCHIVED')
  assert(archived.auditInfo.archivedReason === 'Annual audit archiving', 'Archival: Archival reason recorded in audit log')

  const restored = await service.restoreSettlement(managerContext, created._id)
  assert(restored.archived === false, 'Restoration: Settlement restored from archive')
  assert(restored.status === 'APPROVED', 'Restoration: Settlement returned to APPROVED active status')

  // -------------------------------------------------------------
  // GROUP 8: Multi-Tenant Workspace Isolation
  // -------------------------------------------------------------
  console.info('\n--- GROUP 8: Multi-Tenant Workspace Isolation ---')

  const otherTenantContext: UserContext = {
    userId: 'usr-manager-999',
    role: 'CLINIC_MANAGER',
    tenantId: 'clinic-999',
    clinicId: 'branch_other',
  }

  try {
    await service.getSettlementById(otherTenantContext, created._id)
    assert(false, 'Multi-Tenant: Accessing cross-tenant settlement should throw 404')
  } catch (err) {
    assert(err instanceof AppError && err.errorCode === 'SETTLEMENT_NOT_FOUND', 'Multi-Tenant: Prevented cross-tenant data access')
  }

  // -------------------------------------------------------------
  // GROUP 9: Governance Audit Log Verification
  // -------------------------------------------------------------
  console.info('\n--- GROUP 9: Governance Audit Log Verification ---')

  const auditLogs = await repo.getAuditLogs(tenantId, created._id)
  assert(auditLogs.length >= 6, 'Audit Logs: Recorded complete governance event chain')
  assert(auditLogs.some((l) => l.action === 'SETTLEMENT_CREATED'), 'Audit Logs: Contains SETTLEMENT_CREATED event')
  assert(auditLogs.some((l) => l.action === 'SETTLEMENT_APPROVED'), 'Audit Logs: Contains SETTLEMENT_APPROVED event')
  assert(auditLogs.some((l) => l.action === 'PAYMENT_DISBURSED'), 'Audit Logs: Contains PAYMENT_DISBURSED event')
  assert(auditLogs.some((l) => l.action === 'SETTLEMENT_ARCHIVED'), 'Audit Logs: Contains SETTLEMENT_ARCHIVED event')
  assert(auditLogs.some((l) => l.action === 'SETTLEMENT_RESTORED'), 'Audit Logs: Contains SETTLEMENT_RESTORED event')

  // -------------------------------------------------------------
  // GROUP 10: Dashboard & Roster Summary Aggregations
  // -------------------------------------------------------------
  console.info('\n--- GROUP 10: Dashboard & Roster Summary Aggregations ---')

  const dashSummary = await service.getDashboardSummary(managerContext)
  assert(dashSummary.totalEarningsYtd > 0, 'Dashboard: Realized doctor earnings aggregated correctly')
  assert(dashSummary.totalClinicShareYtd > 0, 'Dashboard: Retained clinic share aggregated correctly')
  assert(dashSummary.recentSettlements.length > 0, 'Dashboard: Recent settlement roster populated')

  console.info('\n===========================================================')
  console.info(`ALL ${totalTests} DOCTOR FINANCIAL ACCOUNTS INTEGRATION TESTS PASSED SUCCESSFULLY!`)
  console.info('===========================================================')
}

runDoctorFinancialsIntegrationTests().catch((err) => {
  console.error('Integration test suite failed with error:', err)
  process.exit(1)
})
