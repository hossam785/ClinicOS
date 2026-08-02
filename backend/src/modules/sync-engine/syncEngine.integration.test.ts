// Desktop Offline Synchronization Engine Automated Integration Test Suite — Module-018

import { SyncEngineRepository } from './syncEngine.repository'
import { SyncEngineCore } from './syncEngine.core'
import { SyncEngineService } from './syncEngine.service'
import { SyncEngineValidator } from './syncEngine.validator'

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`[ASSERTION_FAILED] ${message}`)
  }
}

export async function runSyncEngineIntegrationTests(): Promise<{ passedCount: number; failedCount: number }> {
  console.info('=================================================================')
  console.info('=== STARTING DESKTOP SYNC ENGINE INTEGRATION TEST SUITE ===')
  console.info('=================================================================\n')

  let passedCount = 0
  let failedCount = 0

  const runTestGroup = async (name: string, fn: () => Promise<void>) => {
    try {
      await fn()
      passedCount++
      console.info(`[PASS] ${name}`)
    } catch (err: unknown) {
      failedCount++
      const message = err instanceof Error ? err.message : String(err)
      console.error(`[FAIL] ${name}: ${message}`)
    }
  }

  const repository = new SyncEngineRepository()
  const core = new SyncEngineCore(repository)
  const service = new SyncEngineService(repository, core)

  const tenantId = 'tenant-test-018'
  const clinicId = 'clinic-test-018'

  // Test Group 1: Device Registration & Identity Generation
  await runTestGroup('Group 1: Device Registration & Identity Generation', async () => {
    const payload = {
      licenseKey: 'LIC-2026-TEST-KEY',
      deviceName: 'Doctor Room 1 PC',
      deviceFingerprint: 'hw_fingerprint_hash_901234',
      osPlatform: 'WINDOWS_11_X64',
      appVersion: '1.0.0',
    }

    SyncEngineValidator.validateRegisterDevice(payload)
    const result = await service.registerDevice(tenantId, clinicId, payload)

    assert(Boolean(result.deviceId), 'Device ID should be generated')
    assert(result.deviceId.startsWith('dev_'), 'Device ID must start with dev_')
    assert(result.deviceSecret.startsWith('sec_dev_'), 'Device secret must start with sec_dev_')
    assert(Boolean(result.registeredAt), 'Registered timestamp should be present')
  })

  // Test Group 2: Device Heartbeat & Version Vector Check
  await runTestGroup('Group 2: Device Heartbeat & Version Vector Check', async () => {
    const deviceId = 'dev_pc_doctor_01'
    SyncEngineValidator.validateHeartbeat(deviceId, 18)

    const heartbeat = await service.processHeartbeat(deviceId, 18)

    assert(heartbeat.currentServerVersion === 18, 'Server sequence version should be 18')
    assert(heartbeat.licenseStatus === 'ACTIVE', 'License status should be ACTIVE')
    assert(heartbeat.hasPendingServerDeltas === false, 'Pending server deltas should be false')
  })

  // Test Group 3: Incremental Delta Sync Mutation Acceptance
  await runTestGroup('Group 3: Incremental Delta Sync Mutation Acceptance', async () => {
    const payload = {
      deviceId: 'dev_pc_doctor_01',
      lastSyncVersion: 18,
      outgoingMutations: [
        {
          queueId: 'sq_test_01',
          entityType: 'PATIENT' as const,
          entityId: 'pat_test_101',
          operationType: 'UPDATE' as const,
          delta: { phoneNumber: '01009876543' },
          localVersion: 3,
          checksum: 'e3b0c44298fc1c149afbf4c8996fb924',
        },
      ],
    }

    SyncEngineValidator.validateIncrementalDelta(payload)
    const deltaResult = await service.processIncrementalDelta(tenantId, clinicId, payload)

    assert(deltaResult.newSyncVersion > 18, 'New sync version should be incremented')
    assert(deltaResult.acceptedQueueIds.includes('sq_test_01'), 'Queue sq_test_01 should be accepted')
    assert(deltaResult.conflicts.length === 0, 'No conflicts should be detected for valid delta')
  })

  // Test Group 4: Conflict Detection & Manual Resolution (Desktop Wins / Server Wins)
  await runTestGroup('Group 4: Conflict Detection & Manual Resolution', async () => {
    const payload = {
      deviceId: 'dev_pc_doctor_01',
      lastSyncVersion: 18,
      outgoingMutations: [
        {
          queueId: 'sq_conflict_01',
          entityType: 'APPOINTMENT' as const,
          entityId: 'app_conflict_99',
          operationType: 'UPDATE' as const,
          delta: { status: 'CANCELLED' },
          localVersion: 1, // Triggers conflict rule in core
          checksum: 'checksum_conflict_123',
        },
      ],
    }

    const deltaResult = await service.processIncrementalDelta(tenantId, clinicId, payload)

    assert(deltaResult.conflicts.length === 1, 'Should detect 1 conflict')
    const conflict = deltaResult.conflicts[0]
    assert(conflict.resolutionStatus === 'PENDING_MANUAL', 'Conflict status should be PENDING_MANUAL')

    // Resolve conflict with KEEP_LOCAL (Desktop Wins)
    SyncEngineValidator.validateResolveConflict({ resolutionChoice: 'KEEP_LOCAL' })
    const resolveResult = await service.resolveConflict(conflict.conflictId, {
      resolutionChoice: 'KEEP_LOCAL',
    })

    assert(resolveResult.success === true, 'Conflict resolution should succeed')
  })

  // Test Group 5: Resumable 5MB Chunk Attachment File Sync
  await runTestGroup('Group 5: Resumable 5MB Chunk Attachment File Sync', async () => {
    const attachmentId = 'att_xray_test_01'
    const chunkResult = await service.processFileChunkUpload(
      tenantId,
      clinicId,
      attachmentId,
      0,
      3,
      5242880,
      'sha256_chunk_hash_0'
    )

    assert(chunkResult.attachmentId === attachmentId, 'Attachment ID should match')
    assert(chunkResult.chunkIndex === 0, 'Chunk index should be 0')
    assert(chunkResult.isComplete === false, 'Chunk transfer should not be complete after chunk 0 of 3')
    assert(chunkResult.nextRequiredChunk === 1, 'Next required chunk index should be 1')
  })

  // Test Group 6: Operation Queue Status & Retry Trigger
  await runTestGroup('Group 6: Operation Queue Status & Retry Trigger', async () => {
    const queue = await service.getQueue(tenantId, clinicId)
    assert(Array.isArray(queue), 'Queue should be an array')

    const retryResult = await service.retryQueue(tenantId, clinicId)
    assert(typeof retryResult.retriedCount === 'number', 'Retried count should be a number')
  })

  // Test Group 7: Health Diagnostics & Storage Availability Check
  await runTestGroup('Group 7: Health Diagnostics & Storage Availability Check', async () => {
    const diagnostics = await service.getDiagnostics()

    assert(diagnostics.internetStatus === 'CONNECTED', 'Internet status should be CONNECTED')
    assert(diagnostics.serverReachability === 'REACHABLE', 'Server should be REACHABLE')
    assert(diagnostics.databaseIntegrityStatus === 'INTACT', 'Database integrity should be INTACT')
    assert(diagnostics.storageAvailableMb > 0, 'Storage available MB should be greater than 0')
  })

  // Test Group 8: Multi-Tenant Sync Configuration Management
  await runTestGroup('Group 8: Multi-Tenant Sync Configuration Management', async () => {
    const config = await service.getConfig(tenantId, clinicId)
    assert(config.automaticSync === true, 'Automatic sync should be true by default')

    const updated = await service.updateConfig(tenantId, clinicId, {
      syncIntervalSeconds: 300,
    })

    assert(updated.syncIntervalSeconds === 300, 'Sync interval seconds should be updated to 300')
  })

  // Test Group 9: Cryptographic SHA-256 Audit Log Dispatches
  await runTestGroup('Group 9: Cryptographic SHA-256 Audit Log Dispatches', async () => {
    const logs = await service.getSyncLogs(tenantId, clinicId)

    assert(Array.isArray(logs), 'Audit logs should be an array')
    assert(logs.length > 0, 'Audit logs length should be greater than 0')
    assert(Boolean(logs[0].eventHash), 'Event hash should be present')
  })

  // Test Group 10: Overall Sync Engine Status Summary
  await runTestGroup('Group 10: Overall Sync Engine Status Summary', async () => {
    const summary = await service.getStatusSummary(tenantId, clinicId)

    assert(summary.syncState === 'IDLE', 'Sync state should be IDLE')
    assert(summary.isOffline === false, 'Is offline should be false')
    assert(summary.isDeviceAuthorized === true, 'Is device authorized should be true')
  })

  console.info('\n=================================================================')
  console.info(`=== SUITE COMPLETE: ${passedCount} PASSED, ${failedCount} FAILED ===`)
  console.info('=================================================================\n')

  return { passedCount, failedCount }
}

// Self-executing runner when executed via ts-node directly
if (require.main === module) {
  runSyncEngineIntegrationTests()
    .then(({ failedCount }) => {
      if (failedCount > 0) {
        process.exit(1)
      }
    })
    .catch((err) => {
      console.error('Unhandled failure during integration test suite execution:', err)
      process.exit(1)
    })
}
