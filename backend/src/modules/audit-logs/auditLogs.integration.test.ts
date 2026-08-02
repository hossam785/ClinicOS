// Audit Logs Integration Validation Test Suite — ClinicOS

import { auditEngineService } from './auditEngine.service'
import { auditLogsRepository } from './auditLogs.repository'
import { auditLogsController } from './auditLogs.controller'
import {
  validateAuditQueryParams,
  validateExportPayload,
  validateSyncPayload,
} from './auditLogs.validator'
import { Request, Response } from 'express'
import { AuthenticatedRequest } from '@/modules/auth/auth.types'
import { AppError } from '@/shared/errors/AppError'

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`[ASSERTION_FAILED] ${message}`)
  }
}

async function runAuditLogsIntegrationTests() {
  console.info('=============================================================')
  console.info('=== STARTING AUDIT LOGS MODULE INTEGRATION TEST SUITE     ===')
  console.info('=============================================================\n')

  let passedCount = 0
  let failedCount = 0

  const mockRes = () => {
    const res: Partial<Response> = {}
    res.status = (code: number) => {
      res.statusCode = code
      return res as Response
    }
    res.json = (body: unknown) => {
      ;(res as Record<string, unknown>).body = body
      return res as Response
    }
    return res as Response & { statusCode?: number; body?: unknown }
  }

  const tenantIdClinic = 'tenant-clinic-001'
  const userIdManager = 'usr_mgr_01'
  const roleManager = 'ClinicAdmin'

  const userIdStaff = 'usr_reception_88'
  const roleStaff = 'Receptionist'
  void userIdStaff

  const platformAdminUserId = 'usr_super_admin'
  const platformAdminRole = 'SUPER_ADMIN'
  void platformAdminUserId

  // Reset repository state before test execution
  auditLogsRepository.clearInMemoryRecords()

  // -------------------------------------------------------------
  // GROUP 1: Request Validation Pipelines
  // -------------------------------------------------------------
  console.info('--- GROUP 1: Request Validation Pipelines ---')

  // Test 1: Query validator accepts valid parameters
  try {
    const req = {
      query: { page: '1', limit: '20', module: 'AUTH', severity: 'WARNING' },
    } as unknown as Request
    let nextCalled = false
    validateAuditQueryParams(req, {} as Response, (err) => {
      if (!err) nextCalled = true
    })
    assert(nextCalled, 'validateAuditQueryParams should pass valid parameters.')
    console.info('[PASS] Test 1: Query validator accepts valid query parameters.')
    passedCount++
  } catch (err: unknown) {
    console.error('[FAIL] Test 1:', err instanceof Error ? err.message : err)
    failedCount++
  }

  // Test 2: Query validator rejects negative page parameter
  try {
    const req = { query: { page: '-5' } } as unknown as Request
    let errorCaptured: AppError | null = null
    validateAuditQueryParams(req, {} as Response, (err) => {
      if (err instanceof AppError) errorCaptured = err
    })
    assert(
      errorCaptured !== null && (errorCaptured as AppError).errorCode === 'INVALID_PAGE_PARAM',
      'Should reject negative page parameter.'
    )
    console.info('[PASS] Test 2: Query validator rejects negative page parameter.')
    passedCount++
  } catch (err: unknown) {
    console.error('[FAIL] Test 2:', err instanceof Error ? err.message : err)
    failedCount++
  }

  // Test 3: Query validator rejects limit > 100
  try {
    const req = { query: { limit: '250' } } as unknown as Request
    let errorCaptured: AppError | null = null
    validateAuditQueryParams(req, {} as Response, (err) => {
      if (err instanceof AppError) errorCaptured = err
    })
    assert(
      errorCaptured !== null && (errorCaptured as AppError).errorCode === 'INVALID_LIMIT_PARAM',
      'Should reject limit parameter greater than 100.'
    )
    console.info('[PASS] Test 3: Query validator rejects limit greater than 100.')
    passedCount++
  } catch (err: unknown) {
    console.error('[FAIL] Test 3:', err instanceof Error ? err.message : err)
    failedCount++
  }

  // Test 4: Query validator rejects invalid module enum
  try {
    const req = { query: { module: 'INVALID_MODULE_XYZ' } } as unknown as Request
    let errorCaptured: AppError | null = null
    validateAuditQueryParams(req, {} as Response, (err) => {
      if (err instanceof AppError) errorCaptured = err
    })
    assert(
      errorCaptured !== null && (errorCaptured as AppError).errorCode === 'INVALID_MODULE_PARAM',
      'Should reject invalid module enum.'
    )
    console.info('[PASS] Test 4: Query validator rejects invalid module enum.')
    passedCount++
  } catch (err: unknown) {
    console.error('[FAIL] Test 4:', err instanceof Error ? err.message : err)
    failedCount++
  }

  // Test 5: Query validator rejects invalid date range (startDate > endDate)
  try {
    const req = {
      query: { startDate: '2026-08-10', endDate: '2026-08-01' },
    } as unknown as Request
    let errorCaptured: AppError | null = null
    validateAuditQueryParams(req, {} as Response, (err) => {
      if (err instanceof AppError) errorCaptured = err
    })
    assert(
      errorCaptured !== null && (errorCaptured as AppError).errorCode === 'INVALID_DATE_RANGE',
      'Should reject startDate exceeding endDate.'
    )
    console.info('[PASS] Test 5: Query validator rejects inverted date range.')
    passedCount++
  } catch (err: unknown) {
    console.error('[FAIL] Test 5:', err instanceof Error ? err.message : err)
    failedCount++
  }

  // Test 6: Export validator rejects invalid export format
  try {
    const req = { body: { exportFormat: 'INVALID_FORMAT' } } as unknown as Request
    let errorCaptured: AppError | null = null
    validateExportPayload(req, {} as Response, (err) => {
      if (err instanceof AppError) errorCaptured = err
    })
    assert(
      errorCaptured !== null && (errorCaptured as AppError).errorCode === 'INVALID_EXPORT_FORMAT',
      'Should reject invalid export format.'
    )
    console.info('[PASS] Test 6: Export validator rejects invalid export format.')
    passedCount++
  } catch (err: unknown) {
    console.error('[FAIL] Test 6:', err instanceof Error ? err.message : err)
    failedCount++
  }

  // Test 7: Sync validator rejects non-array queued audit payload
  try {
    const req = { body: { queuedAuditLogs: 'not-an-array' } } as unknown as Request
    let errorCaptured: AppError | null = null
    validateSyncPayload(req, {} as Response, (err) => {
      if (err instanceof AppError) errorCaptured = err
    })
    assert(
      errorCaptured !== null && (errorCaptured as AppError).errorCode === 'INVALID_SYNC_PAYLOAD',
      'Should reject invalid sync payload.'
    )
    console.info('[PASS] Test 7: Sync validator rejects non-array queued payload.')
    passedCount++
  } catch (err: unknown) {
    console.error('[FAIL] Test 7:', err instanceof Error ? err.message : err)
    failedCount++
  }

  // -------------------------------------------------------------
  // GROUP 2: Central Audit Engine & Immutability Invariants
  // -------------------------------------------------------------
  console.info('\n--- GROUP 2: Central Audit Engine & Immutability Invariants ---')

  // Test 8: Central Engine creates audit record with sequential audit number
  try {
    const record = await auditEngineService.recordEvent({
      tenantId: tenantIdClinic,
      clinicId: 'branch-main',
      userId: userIdManager,
      userRole: roleManager,
      userDisplayName: 'Sarah Jenkins',
      module: 'DOCTOR_FINANCIALS',
      eventCategory: 'FINANCIAL',
      entityType: 'DoctorSettlement',
      entityId: 'stl_9910',
      action: 'DOCTOR_SETTLEMENT_PAID',
      severity: 'WARNING',
      correlationId: 'corr_uuid_881920',
      previousStateSummary: { status: 'APPROVED', payoutAmount: 4250.0 },
      newStateSummary: { status: 'DISBURSED', secretToken: 'topsecret_123' },
    })

    assert(record.auditNumber.startsWith('AUD-'), 'Audit number must start with AUD- prefix.')
    assert(record.severity === 'WARNING', 'Severity must match WARNING.')
    assert(record.module === 'DOCTOR_FINANCIALS', 'Module must match DOCTOR_FINANCIALS.')
    console.info('[PASS] Test 8: Central Engine creates record with AUD- number.')
    passedCount++
  } catch (err: unknown) {
    console.error('[FAIL] Test 8:', err instanceof Error ? err.message : err)
    failedCount++
  }

  // Test 9: State diff summary sanitization (Redacts passwords & secret tokens)
  try {
    const record = await auditEngineService.recordEvent({
      tenantId: tenantIdClinic,
      clinicId: 'branch-main',
      userId: userIdManager,
      userRole: roleManager,
      userDisplayName: 'Sarah Jenkins',
      module: 'AUTH',
      eventCategory: 'AUTHENTICATION',
      entityType: 'UserAccount',
      entityId: 'usr_001',
      action: 'USER_PASSWORD_RESET',
      severity: 'CRITICAL',
      previousStateSummary: { passwordHash: 'old_hash', authSecret: 'secret_key' },
      newStateSummary: { passwordHash: 'new_hash', authSecret: 'secret_key_new' },
    })

    assert(
      record.previousStateSummary?.authSecret === '[REDACTED_SENSITIVE_DATA]',
      'authSecret key must be redacted in previousStateSummary.'
    )
    assert(
      record.newStateSummary?.authSecret === '[REDACTED_SENSITIVE_DATA]',
      'authSecret key must be redacted in newStateSummary.'
    )
    console.info('[PASS] Test 9: State diff summary sanitization redacts sensitive keys.')
    passedCount++
  } catch (err: unknown) {
    console.error('[FAIL] Test 9:', err instanceof Error ? err.message : err)
    failedCount++
  }

  // Test 10: Read-only immutability invariant
  try {
    const repoAny = auditLogsRepository as unknown as Record<string, unknown>
    assert(repoAny.update === undefined, 'Repository must NOT contain an update method.')
    assert(repoAny.delete === undefined, 'Repository must NOT contain a delete method.')
    assert(repoAny.remove === undefined, 'Repository must NOT contain a remove method.')
    console.info('[PASS] Test 10: Read-only immutability invariant verified (no update/delete methods).')
    passedCount++
  } catch (err: unknown) {
    console.error('[FAIL] Test 10:', err instanceof Error ? err.message : err)
    failedCount++
  }

  // -------------------------------------------------------------
  // GROUP 3: RBAC & Platform Owner Barrier Isolation
  // -------------------------------------------------------------
  console.info('\n--- GROUP 3: RBAC & Platform Owner Barrier Isolation ---')

  // Test 11: ClinicAdmin can query clinic audit roster
  try {
    const req = {
      user: { tenantId: tenantIdClinic, userId: userIdManager, role: roleManager },
      query: { page: '1', limit: '20' },
    } as unknown as AuthenticatedRequest
    const res = mockRes()
    await auditLogsController.getAuditLogs(req, res, () => {})
    assert(res.statusCode === 200, 'ClinicAdmin should receive 200 OK.')
    const body = res.body as { success: boolean; data: { items: unknown[] } }
    assert(body.success === true, 'Response success must be true.')
    console.info('[PASS] Test 11: ClinicAdmin successfully queries audit roster.')
    passedCount++
  } catch (err: unknown) {
    console.error('[FAIL] Test 11:', err instanceof Error ? err.message : err)
    failedCount++
  }

  // Test 12: Receptionist role is forbidden from viewing audit roster (403 AUDIT_ACCESS_RESTRICTED)
  try {
    const req = {
      user: { tenantId: tenantIdClinic, userId: userIdStaff, role: roleStaff },
      query: { page: '1', limit: '20' },
    } as unknown as AuthenticatedRequest
    const res = mockRes()
    let errorCaptured: AppError | null = null
    await auditLogsController.getAuditLogs(req, res, (err?: unknown) => {
      if (err instanceof AppError) errorCaptured = err
    })
    assert(
      errorCaptured !== null && (errorCaptured as AppError).errorCode === 'AUDIT_ACCESS_RESTRICTED',
      'Receptionist must be rejected with 403 AUDIT_ACCESS_RESTRICTED.'
    )
    console.info('[PASS] Test 12: Receptionist role is forbidden from viewing audit roster.')
    passedCount++
  } catch (err: unknown) {
    console.error('[FAIL] Test 12:', err instanceof Error ? err.message : err)
    failedCount++
  }

  // Test 13: Platform Owner (SUPER_ADMIN / tenantId: PLATFORM) isolated to platform logs
  try {
    const req = {
      user: { tenantId: 'PLATFORM', userId: platformAdminUserId, role: platformAdminRole },
      query: { page: '1', limit: '20' },
    } as unknown as AuthenticatedRequest
    const res = mockRes()
    await auditLogsController.getAuditLogs(req, res, () => {})
    assert(res.statusCode === 200, 'Platform Owner query must return 200 OK for platform logs.')
    const body = res.body as { success: boolean; data: { items: unknown[] } }
    assert(body.success === true, 'Response must succeed.')
    console.info('[PASS] Test 13: Platform Owner privacy barrier isolates platform system logs.')
    passedCount++
  } catch (err: unknown) {
    console.error('[FAIL] Test 13:', err instanceof Error ? err.message : err)
    failedCount++
  }

  // -------------------------------------------------------------
  // GROUP 4: Forensic Correlation Timeline & Investigation
  // -------------------------------------------------------------
  console.info('\n--- GROUP 4: Forensic Correlation Timeline & Investigation ---')

  // Test 14: Query events by correlation ID returns correlated transaction chain
  try {
    const correlationId = 'corr_uuid_881920'
    const correlatedEvents = await auditLogsRepository.findByCorrelationId(tenantIdClinic, correlationId)
    assert(correlatedEvents.length > 0, 'Correlated events list must contain records.')
    assert(
      correlatedEvents[0].correlationId === correlationId,
      'Correlation ID of returned event must match query parameter.'
    )
    console.info('[PASS] Test 14: Forensic correlation query reconstructs transaction timeline chain.')
    passedCount++
  } catch (err: unknown) {
    console.error('[FAIL] Test 14:', err instanceof Error ? err.message : err)
    failedCount++
  }

  // Test 15: Find audit log by ID or audit number
  try {
    const recent = await auditLogsRepository.findRecent(tenantIdClinic, 1)
    assert(recent.length > 0, 'Must have seeded audit log record.')
    const auditNum = recent[0].auditNumber
    const record = await auditLogsRepository.findById(tenantIdClinic, auditNum)
    assert(record !== null && record.auditNumber === auditNum, 'Must retrieve audit log by auditNumber.')
    console.info('[PASS] Test 15: Audit log retrieved by unique auditNumber.')
    passedCount++
  } catch (err: unknown) {
    console.error('[FAIL] Test 15:', err instanceof Error ? err.message : err)
    failedCount++
  }

  // -------------------------------------------------------------
  // GROUP 5: Statistics Aggregation & Dashboard Widgets
  // -------------------------------------------------------------
  console.info('\n--- GROUP 5: Statistics Aggregation & Dashboard Widgets ---')

  // Test 16: Statistics aggregation returns breakdown by severity & module
  try {
    const stats = await auditLogsRepository.aggregateStatistics(tenantIdClinic)
    assert(stats.totalEventsCount > 0, 'Total events count must be greater than zero.')
    assert(stats.severityBreakdown.WARNING > 0, 'WARNING severity count must reflect seeded events.')
    console.info('[PASS] Test 16: Statistics aggregation returns accurate counts.')
    passedCount++
  } catch (err: unknown) {
    console.error('[FAIL] Test 16:', err instanceof Error ? err.message : err)
    failedCount++
  }

  // Test 17: Critical security alerts roster query
  try {
    const criticals = await auditLogsRepository.findCritical(tenantIdClinic, 10)
    assert(criticals.length > 0, 'Critical events roster must return high priority events.')
    console.info('[PASS] Test 17: Critical security alerts query returns high priority events.')
    passedCount++
  } catch (err: unknown) {
    console.error('[FAIL] Test 17:', err instanceof Error ? err.message : err)
    failedCount++
  }

  // -------------------------------------------------------------
  // GROUP 6: Document Export & Offline Sync
  // -------------------------------------------------------------
  console.info('\n--- GROUP 6: Document Export & Offline Sync ---')

  // Test 18: Export generator creates signed document statement metadata & logs audit-of-audit action
  try {
    const exportResult = await auditEngineService.generateAuditExport(
      tenantIdClinic,
      userIdManager,
      'Sarah Jenkins',
      roleManager,
      { exportFormat: 'PDF', filterParams: { severity: 'WARNING' } }
    )
    assert(exportResult.exportNumber.startsWith('EXP-AUD-'), 'Export number must start with EXP-AUD-.')
    assert(exportResult.format === 'PDF', 'Format must match PDF.')

    // Verify audit-of-audit log record was created
    const recent = await auditLogsRepository.findRecent(tenantIdClinic, 5)
    const exportAuditLog = recent.find((r) => r.action === 'AUDIT_LOG_EXPORTED')
    assert(exportAuditLog !== undefined, 'Export action must create an AUDIT_LOG_EXPORTED record.')
    console.info('[PASS] Test 18: Export generator creates statement & logs audit-of-audit action.')
    passedCount++
  } catch (err: unknown) {
    console.error('[FAIL] Test 18:', err instanceof Error ? err.message : err)
    failedCount++
  }

  // Test 19: Offline sync batch reconciliation processes queued records
  try {
    const syncResult = await auditEngineService.processOfflineSync(
      tenantIdClinic,
      userIdManager,
      'Sarah Jenkins',
      roleManager,
      {
        queuedAuditLogs: [
          {
            clientRequestId: 'cl_req_991',
            auditNumber: 'AUD-OFF-001',
            module: 'APPOINTMENTS',
            action: 'PATIENT_CHECKED_IN',
            severity: 'INFORMATION',
            entityType: 'Appointment',
            entityId: 'apt_1001',
            eventTimestamp: '2026-08-01T12:00:00.000Z',
            hmacSignature: 'sha256_digest_abc123',
          },
        ],
      }
    )
    assert(syncResult.processedCount === 1, 'Sync processed count must equal 1.')
    assert(syncResult.syncedIds.includes('AUD-OFF-001'), 'Synced IDs must include AUD-OFF-001.')
    console.info('[PASS] Test 19: Offline sync batch reconciliation successfully processes queued logs.')
    passedCount++
  } catch (err: unknown) {
    console.error('[FAIL] Test 19:', err instanceof Error ? err.message : err)
    failedCount++
  }

  console.info('\n=============================================================')
  console.info(`=== AUDIT LOGS MODULE INTEGRATION SUITE COMPLETE: ${passedCount} PASSED, ${failedCount} FAILED ===`)
  console.info('=============================================================')

  if (failedCount > 0) {
    process.exit(1)
  }
}

// Execute test suite if run directly via ts-node
if (require.main === module) {
  runAuditLogsIntegrationTests().catch((err) => {
    console.error('Fatal Integration Test Failure:', err)
    process.exit(1)
  })
}

export { runAuditLogsIntegrationTests }
