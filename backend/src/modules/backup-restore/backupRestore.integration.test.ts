// Backup & Restore Integration Validation Test Suite — ClinicOS

import { backupRestoreController } from './backupRestore.controller'
import { BackupStatisticsData } from './backupRestore.types'
import {
  validateTriggerBackup,
  validateBackupQueryParams,
  validateRestoreBackup,
  validateUpdateRetention,
  validateSyncBackupMetadata,
} from './backupRestore.validator'
import { Request, Response } from 'express'
import { AuthenticatedRequest } from '@/modules/auth/auth.types'
import { AppError } from '@/shared/errors/AppError'

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`[ASSERTION_FAILED] ${message}`)
  }
}

async function runBackupRestoreIntegrationTests() {
  console.info('=============================================================')
  console.info('=== STARTING BACKUP & RESTORE MODULE INTEGRATION SUITE    ===')
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

  const userIdDoctor = 'usr_doc_99'
  const roleDoctor = 'Doctor'

  const platformAdminUserId = 'usr_super_admin'
  const platformAdminRole = 'SUPER_ADMIN'

  // -------------------------------------------------------------
  // GROUP 1: Request Validation Pipelines
  // -------------------------------------------------------------
  console.info('--- GROUP 1: Request Validation Pipelines ---')

  // Test 1.1: Invalid backupType
  try {
    const req = { body: { backupType: 'INVALID_TYPE', backupName: 'Valid_Name' } } as Request
    let errorCaught: AppError | null = null
    validateTriggerBackup(req, {} as Response, (err) => {
      errorCaught = err as AppError
    })
    assert(errorCaught !== null, 'Should catch error for invalid backupType')
    assert((errorCaught as unknown as AppError).errorCode === 'INVALID_BACKUP_TYPE', 'Should return INVALID_BACKUP_TYPE code')
    console.info('✓ Test 1.1 Passed: Invalid backupType caught correctly')
    passedCount++
  } catch (err) {
    console.error('✗ Test 1.1 Failed:', (err as Error).message)
    failedCount++
  }

  // Test 1.2: Invalid backupName length
  try {
    const req = { body: { backupType: 'MANUAL', backupName: 'ab' } } as Request
    let errorCaught: AppError | null = null
    validateTriggerBackup(req, {} as Response, (err) => {
      errorCaught = err as AppError
    })
    assert(errorCaught !== null, 'Should catch error for short backupName')
    assert((errorCaught as unknown as AppError).errorCode === 'INVALID_BACKUP_NAME', 'Should return INVALID_BACKUP_NAME code')
    console.info('✓ Test 1.2 Passed: Short backupName caught correctly')
    passedCount++
  } catch (err) {
    console.error('✗ Test 1.2 Failed:', (err as Error).message)
    failedCount++
  }

  // Test 1.3: Invalid query pagination parameters
  try {
    const req = { query: { page: 'invalid' } } as unknown as Request
    let errorCaught: AppError | null = null
    validateBackupQueryParams(req, {} as Response, (err) => {
      errorCaught = err as AppError
    })
    assert(errorCaught !== null, 'Should catch error for invalid page parameter')
    assert((errorCaught as unknown as AppError).errorCode === 'INVALID_PAGE', 'Should return INVALID_PAGE code')
    console.info('✓ Test 1.3 Passed: Invalid page parameter caught correctly')
    passedCount++
  } catch (err) {
    console.error('✗ Test 1.3 Failed:', (err as Error).message)
    failedCount++
  }

  // Test 1.4: Missing confirmation phrase on restore
  try {
    const req = { body: {} } as Request
    let errorCaught: AppError | null = null
    validateRestoreBackup(req, {} as Response, (err) => {
      errorCaught = err as AppError
    })
    assert(errorCaught !== null, 'Should catch error for missing confirmationPhrase')
    assert((errorCaught as unknown as AppError).errorCode === 'CONFIRMATION_REQUIRED', 'Should return CONFIRMATION_REQUIRED code')
    console.info('✓ Test 1.4 Passed: Missing confirmation phrase caught correctly')
    passedCount++
  } catch (err) {
    console.error('✗ Test 1.4 Failed:', (err as Error).message)
    failedCount++
  }

  // Test 1.5: Invalid retention mode
  try {
    const req = { body: { retentionMode: 'INVALID_MODE', autoCleanupEnabled: true } } as Request
    let errorCaught: AppError | null = null
    validateUpdateRetention(req, {} as Response, (err) => {
      errorCaught = err as AppError
    })
    assert(errorCaught !== null, 'Should catch error for invalid retentionMode')
    assert((errorCaught as unknown as AppError).errorCode === 'INVALID_RETENTION_MODE', 'Should return INVALID_RETENTION_MODE code')
    console.info('✓ Test 1.5 Passed: Invalid retention mode caught correctly')
    passedCount++
  } catch (err) {
    console.error('✗ Test 1.5 Failed:', (err as Error).message)
    failedCount++
  }

  // Test 1.6: Invalid offline sync payload
  try {
    const req = { body: { localBackupMetadata: 'not_an_array' } } as unknown as Request
    let errorCaught: AppError | null = null
    validateSyncBackupMetadata(req, {} as Response, (err) => {
      errorCaught = err as AppError
    })
    assert(errorCaught !== null, 'Should catch error for invalid sync payload')
    assert((errorCaught as unknown as AppError).errorCode === 'INVALID_SYNC_PAYLOAD', 'Should return INVALID_SYNC_PAYLOAD code')
    console.info('✓ Test 1.6 Passed: Invalid offline sync payload caught correctly')
    passedCount++
  } catch (err) {
    console.error('✗ Test 1.6 Failed:', (err as Error).message)
    failedCount++
  }

  // -------------------------------------------------------------
  // GROUP 2: Security & Permission Guards
  // -------------------------------------------------------------
  console.info('\n--- GROUP 2: Security & Permission Guards ---')

  // Test 2.1: Platform Owner Isolation Barrier
  try {
    const req = {
      user: { userId: platformAdminUserId, role: platformAdminRole, tenantId: 'PLATFORM', email: 'admin@platform.com' },
      headers: { 'x-tenant-id': 'PLATFORM' },
    } as unknown as AuthenticatedRequest
    const res = mockRes()
    let errorCaught: AppError | null = null
    await backupRestoreController.getBackups(req, res, (err) => {
      errorCaught = err as AppError
    })
    assert(errorCaught !== null, 'Should block Platform Owner from clinic backup roster')
    assert(
      (errorCaught as unknown as AppError).errorCode === 'PLATFORM_ADMIN_BACKUP_RESTRICTED',
      'Should return PLATFORM_ADMIN_BACKUP_RESTRICTED error code'
    )
    console.info('✓ Test 2.1 Passed: Platform Owner barrier enforced correctly')
    passedCount++
  } catch (err) {
    console.error('✗ Test 2.1 Failed:', (err as Error).message)
    failedCount++
  }

  // Test 2.2: RBAC Permission Guard (Doctor Forbidden)
  try {
    const req = {
      user: { userId: userIdDoctor, role: roleDoctor, tenantId: tenantIdClinic, email: 'doctor@clinic.com' },
      headers: { 'x-tenant-id': tenantIdClinic },
    } as unknown as AuthenticatedRequest
    const res = mockRes()
    let errorCaught: AppError | null = null
    await backupRestoreController.triggerBackup(req, res, (err) => {
      errorCaught = err as AppError
    })
    assert(errorCaught !== null, 'Should block Doctor role from creating backups')
    assert(
      (errorCaught as unknown as AppError).errorCode === 'BACKUP_ACCESS_RESTRICTED',
      'Should return BACKUP_ACCESS_RESTRICTED error code'
    )
    console.info('✓ Test 2.2 Passed: RBAC permission guard enforced correctly')
    passedCount++
  } catch (err) {
    console.error('✗ Test 2.2 Failed:', (err as Error).message)
    failedCount++
  }

  // -------------------------------------------------------------
  // GROUP 3: Backup Engine Workflows
  // -------------------------------------------------------------
  console.info('\n--- GROUP 3: Backup Engine Workflows ---')

  let createdBackupId = ''

  // Test 3.1: Trigger Manual Backup
  try {
    const req = {
      user: { userId: userIdManager, role: roleManager, tenantId: tenantIdClinic, email: 'manager@clinic.com' },
      headers: { 'x-tenant-id': tenantIdClinic },
      body: {
        backupType: 'MANUAL',
        backupName: 'Integration_Test_Manual_Snapshot',
        backupReason: 'Automated integration test validation',
      },
    } as unknown as AuthenticatedRequest
    const res = mockRes()
    await backupRestoreController.triggerBackup(req, res, () => {})
    const body = res.body as { success: boolean; data: { backupId: string; backupName: string; status: { backupStatus: string } } }
    assert(res.statusCode === 201, 'Should return 201 Created status')
    assert(body.success === true, 'Response should indicate success')
    assert(body.data.backupId.startsWith('BK-'), 'Backup ID should have BK- prefix')
    assert(body.data.status.backupStatus === 'COMPLETED', 'Backup status should be COMPLETED')
    createdBackupId = body.data.backupId
    console.info('✓ Test 3.1 Passed: Trigger Manual Backup succeeded:', createdBackupId)
    passedCount++
  } catch (err) {
    console.error('✗ Test 3.1 Failed:', (err as Error).message)
    failedCount++
  }

  // Test 3.2: Get Backup Metadata Roster
  try {
    const req = {
      user: { userId: userIdManager, role: roleManager, tenantId: tenantIdClinic, email: 'manager@clinic.com' },
      headers: { 'x-tenant-id': tenantIdClinic },
      query: { page: '1', limit: '10' },
    } as unknown as AuthenticatedRequest
    const res = mockRes()
    await backupRestoreController.getBackups(req, res, () => {})
    const body = res.body as { success: boolean; data: { items: Array<{ backupId: string }>; pagination: { totalItems: number } } }
    assert(res.statusCode === 200, 'Should return 200 OK status')
    assert(body.data.items.length > 0, 'Should return items in roster')
    console.info('✓ Test 3.2 Passed: Get Backup Metadata Roster succeeded, total items:', body.data.pagination.totalItems)
    passedCount++
  } catch (err) {
    console.error('✗ Test 3.2 Failed:', (err as Error).message)
    failedCount++
  }

  // Test 3.3: Get Backup Details by ID
  try {
    const req = {
      user: { userId: userIdManager, role: roleManager, tenantId: tenantIdClinic, email: 'manager@clinic.com' },
      headers: { 'x-tenant-id': tenantIdClinic },
      params: { id: createdBackupId },
    } as unknown as AuthenticatedRequest
    const res = mockRes()
    await backupRestoreController.getBackupById(req, res, () => {})
    const body = res.body as { success: boolean; data: { backupId: string; security: { encrypted: boolean } } }
    assert(res.statusCode === 200, 'Should return 200 OK status')
    assert(body.data.backupId === createdBackupId, 'Returned backup ID should match target')
    assert(body.data.security.encrypted === true, 'Backup should be encrypted')
    console.info('✓ Test 3.3 Passed: Get Backup Details by ID succeeded')
    passedCount++
  } catch (err) {
    console.error('✗ Test 3.3 Failed:', (err as Error).message)
    failedCount++
  }

  // -------------------------------------------------------------
  // GROUP 4: Verification Engine Workflows
  // -------------------------------------------------------------
  console.info('\n--- GROUP 4: Verification Engine Workflows ---')

  // Test 4.1: Verify SHA-256 Checksum & Schema Compatibility
  try {
    const req = {
      user: { userId: userIdManager, role: roleManager, tenantId: tenantIdClinic, email: 'manager@clinic.com' },
      headers: { 'x-tenant-id': tenantIdClinic },
      params: { id: createdBackupId },
    } as unknown as AuthenticatedRequest
    const res = mockRes()
    await backupRestoreController.verifyBackup(req, res, () => {})
    const body = res.body as { success: boolean; data: { verificationResult: string; checksumVerified: boolean } }
    assert(res.statusCode === 200, 'Should return 200 OK status')
    assert(body.data.verificationResult === 'PASSED', 'Verification result should be PASSED')
    assert(body.data.checksumVerified === true, 'Checksum should be verified')
    console.info('✓ Test 4.1 Passed: Verify Backup SHA-256 Checksum succeeded')
    passedCount++
  } catch (err) {
    console.error('✗ Test 4.1 Failed:', (err as Error).message)
    failedCount++
  }

  // -------------------------------------------------------------
  // GROUP 5: Disaster Restore Engine Workflows
  // -------------------------------------------------------------
  console.info('\n--- GROUP 5: Disaster Restore Engine Workflows ---')

  // Test 5.1: Execute System Disaster Restore (with mandatory safety snapshot)
  try {
    const req = {
      user: { userId: userIdManager, role: roleManager, tenantId: tenantIdClinic, email: 'manager@clinic.com' },
      headers: { 'x-tenant-id': tenantIdClinic },
      params: { id: createdBackupId },
      body: {
        confirmationPhrase: 'CONFIRM_RESTORE_INTEGRATION_TEST',
        reason: 'Automated integration disaster recovery validation test',
      },
    } as unknown as AuthenticatedRequest
    const res = mockRes()
    await backupRestoreController.restoreBackup(req, res, () => {})
    const body = res.body as { success: boolean; data: { restoreId: string; safetyBackupId: string; restoreStatus: string } }
    assert(res.statusCode === 200, 'Should return 200 OK status')
    assert(body.data.restoreStatus === 'COMPLETED', 'Restore status should be COMPLETED')
    assert(body.data.safetyBackupId.includes('_SAFETY'), 'Safety backup ID should include _SAFETY suffix')
    console.info('✓ Test 5.1 Passed: Execute System Restore succeeded, Safety Backup:', body.data.safetyBackupId)
    passedCount++
  } catch (err) {
    console.error('✗ Test 5.1 Failed:', (err as Error).message)
    failedCount++
  }

  // Test 5.2: Get Restore Execution History Roster
  try {
    const req = {
      user: { userId: userIdManager, role: roleManager, tenantId: tenantIdClinic, email: 'manager@clinic.com' },
      headers: { 'x-tenant-id': tenantIdClinic },
    } as unknown as AuthenticatedRequest
    const res = mockRes()
    await backupRestoreController.getRestoreHistory(req, res, () => {})
    const body = res.body as { success: boolean; data: { restores: Array<{ restoreId: string }> } }
    assert(res.statusCode === 200, 'Should return 200 OK status')
    assert(body.data.restores.length > 0, 'Restore history should contain records')
    console.info('✓ Test 5.2 Passed: Get Restore History succeeded, count:', body.data.restores.length)
    passedCount++
  } catch (err) {
    console.error('✗ Test 5.2 Failed:', (err as Error).message)
    failedCount++
  }

  // -------------------------------------------------------------
  // GROUP 6: Retention Governance & Auto-Cleanup
  // -------------------------------------------------------------
  console.info('\n--- GROUP 6: Retention Governance & Auto-Cleanup ---')

  // Test 6.1: Update Retention Policy & Trigger Auto-Cleanup
  try {
    const req = {
      user: { userId: userIdManager, role: roleManager, tenantId: tenantIdClinic, email: 'manager@clinic.com' },
      headers: { 'x-tenant-id': tenantIdClinic },
      body: {
        retentionMode: 'LAST_5',
        autoCleanupEnabled: true,
      },
    } as unknown as AuthenticatedRequest
    const res = mockRes()
    await backupRestoreController.updateRetentionPolicy(req, res, () => {})
    const body = res.body as { success: boolean; data: { retentionMode: string; retentionCount: number } }
    assert(res.statusCode === 200, 'Should return 200 OK status')
    assert(body.data.retentionMode === 'LAST_5', 'Retention mode should be LAST_5')
    assert(body.data.retentionCount === 5, 'Retention count should be 5')
    console.info('✓ Test 6.1 Passed: Update Retention Policy succeeded')
    passedCount++
  } catch (err) {
    console.error('✗ Test 6.1 Failed:', (err as Error).message)
    failedCount++
  }

  // -------------------------------------------------------------
  // GROUP 7: Offline Desktop Synchronization
  // -------------------------------------------------------------
  console.info('\n--- GROUP 7: Offline Desktop Synchronization ---')

  // Test 7.1: Sync Offline Desktop Backup Metadata
  try {
    const req = {
      user: { userId: userIdManager, role: roleManager, tenantId: tenantIdClinic, email: 'manager@clinic.com' },
      headers: { 'x-tenant-id': tenantIdClinic },
      body: {
        localBackupMetadata: [
          {
            backupId: 'BK-OFFLINE-TEST-001',
            backupName: 'Offline_Desktop_Snapshot_001',
            backupType: 'MANUAL',
            fileSizeBytes: 42000000,
            checksum: 'f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2',
            createdAt: new Date().toISOString(),
          },
        ],
      },
    } as unknown as AuthenticatedRequest
    const res = mockRes()
    await backupRestoreController.syncBackupMetadata(req, res, () => {})
    const body = res.body as { success: boolean; data: { syncedCount: number; syncedIds: string[] } }
    assert(res.statusCode === 200, 'Should return 200 OK status')
    assert(body.data.syncedCount === 1, 'Should sync 1 offline backup item')
    assert(body.data.syncedIds.includes('BK-OFFLINE-TEST-001'), 'Synced IDs should include offline ID')
    console.info('✓ Test 7.1 Passed: Sync Offline Desktop Metadata succeeded')
    passedCount++
  } catch (err) {
    console.error('✗ Test 7.1 Failed:', (err as Error).message)
    failedCount++
  }

  // -------------------------------------------------------------
  // GROUP 8: Aggregate Statistics & Health Summary
  // -------------------------------------------------------------
  console.info('\n--- GROUP 8: Aggregate Statistics & Health Summary ---')

  // Test 8.1: Retrieve Backup Health & Storage Statistics
  try {
    const req = {
      user: { userId: userIdManager, role: roleManager, tenantId: tenantIdClinic, email: 'manager@clinic.com' },
      headers: { 'x-tenant-id': tenantIdClinic },
    } as unknown as AuthenticatedRequest
    const res = mockRes()
    await backupRestoreController.getStatistics(req, res, () => {})
    const body = res.body as { success: boolean; data: BackupStatisticsData }
    assert(res.statusCode === 200, 'Should return 200 OK status')
    assert(body.data.totalBackupsCount > 0, 'Total backups count should be greater than 0')
    assert(body.data.verifiedBackupsCount > 0, 'Verified backups count should be greater than 0')
    assert(body.data.systemHealthStatus === 'HEALTHY', 'System health status should be HEALTHY')
    console.info('✓ Test 8.1 Passed: Get Statistics succeeded, total storage:', body.data.totalStorageSizeBytes, 'bytes')
    passedCount++
  } catch (err) {
    console.error('✗ Test 8.1 Failed:', (err as Error).message)
    failedCount++
  }

  // -------------------------------------------------------------
  // TEST SUITE SUMMARY
  // -------------------------------------------------------------
  console.info('\n=============================================================')
  console.info(`=== BACKUP & RESTORE INTEGRATION SUITE COMPLETE: ${passedCount} PASSED, ${failedCount} FAILED ===`)
  console.info('=============================================================\n')

  if (failedCount > 0) {
    process.exit(1)
  }
}

// Execute test suite when run directly
if (require.main === module) {
  runBackupRestoreIntegrationTests().catch((err) => {
    console.error('Integration suite encountered fatal error:', err)
    process.exit(1)
  })
}

export { runBackupRestoreIntegrationTests }
