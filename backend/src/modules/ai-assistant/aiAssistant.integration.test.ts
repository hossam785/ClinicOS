// Offline AI Medical Assistant Integration Validation Test Suite — Module-017

import { AIAssistantController } from './aiAssistant.controller'
import { AIAssistantValidator } from './aiAssistant.validator'
import { LocalAIEngine } from './aiAssistant.engine'
import type { Request, Response } from 'express'

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`[ASSERTION_FAILED] ${message}`)
  }
}

export async function runAIAssistantIntegrationTests(): Promise<{ passedCount: number; failedCount: number }> {
  console.info('=================================================================')
  console.info('=== STARTING OFFLINE AI MEDICAL ASSISTANT INTEGRATION TEST SUITE ===')
  console.info('=================================================================\n')

  let passedCount = 0
  let failedCount = 0

  const mockRes = () => {
    const headersObj: Record<string, string> = {}
    const res: Record<string, unknown> = {
      headersObj,
    }
    res.status = (code: number) => {
      res.statusCode = code
      return res as unknown as Response
    }
    res.json = (body: unknown) => {
      res.body = body
      return res as unknown as Response
    }
    res.setHeader = (key: string, value: string) => {
      headersObj[key] = value
      return res as unknown as Response
    }
    return res as unknown as Response & { statusCode?: number; body?: unknown; headersObj?: Record<string, string> }
  }

  const runTest = async (testName: string, testFn: () => Promise<void>) => {
    try {
      await testFn()
      console.info(`[PASS] ${testName}`)
      passedCount++
    } catch (err: unknown) {
      console.error(`[FAIL] ${testName} ->`, err instanceof Error ? err.message : err)
      failedCount++
    }
  }

  const dummyNext = () => {}

  // -------------------------------------------------------------------
  // GROUP 1: AI ENGINE INITIALIZATION & STATUS TESTS
  // -------------------------------------------------------------------
  await runTest('Group 1.1: Fetch Engine Offline Status & Local Model Info', async () => {
    const req = {
      user: { userId: 'usr_doc_01', role: 'DOCTOR', tenantId: 'tenant-default' },
    } as unknown as Request

    const res = mockRes()
    await AIAssistantController.getStatus(req, res, dummyNext)

    assert(res.statusCode === 200, `Expected HTTP 200, got ${res.statusCode}`)
    const data = (res.body as { data: { status: string; isOffline: boolean; modelName: string } }).data
    assert(data.status === 'READY', 'Status should be READY')
    assert(data.isOffline === true, 'isOffline must be 100% true')
    assert(data.modelName.includes('Local'), 'Model should be local model')
  })

  // -------------------------------------------------------------------
  // GROUP 2: NATURAL LANGUAGE INTENT RECOGNITION TESTS
  // -------------------------------------------------------------------
  await runTest('Group 2.1: Detect Patient Search Intent ("Open Ahmed Ali")', async () => {
    const intent = LocalAIEngine.parseIntent('Open Ahmed Ali')
    assert(intent.intent === 'PATIENT_SEARCH', 'Expected PATIENT_SEARCH intent')
    assert(intent.confidence >= 0.9, 'Expected high confidence')
    assert(intent.entities.patientName === 'Ahmed Ali', 'Expected entity Ahmed Ali')
  })

  await runTest('Group 2.2: Detect Reports Query Intent ("Today\'s revenue summary")', async () => {
    const intent = LocalAIEngine.parseIntent("Today's revenue summary")
    assert(intent.intent === 'REPORTS_QUERY', 'Expected REPORTS_QUERY intent')
  })

  // -------------------------------------------------------------------
  // GROUP 3: PLATFORM OWNER PRIVACY ISOLATION BARRIER TESTS
  // -------------------------------------------------------------------
  await runTest('Group 3.1: Reject SUPER_ADMIN Access to AI Patient Queries (403 Forbidden)', async () => {
    try {
      AIAssistantValidator.validateUserRole('SUPER_ADMIN')
      assert(false, 'Should have thrown PLATFORM_ADMIN_RESTRICTED exception')
    } catch (err: unknown) {
      const error = err as { message?: string }
      assert(error.message?.includes('Platform administrators are restricted') === true, 'Expected restriction error')
    }
  })

  // -------------------------------------------------------------------
  // GROUP 4: AI SAFETY & UNSAFE COMMAND REJECTION TESTS
  // -------------------------------------------------------------------
  await runTest('Group 4.1: Reject Autonomous Diagnosis Command with Safety Notice', async () => {
    const req = {
      user: { userId: 'usr_doc_01', role: 'DOCTOR', tenantId: 'tenant-default' },
      body: { queryText: 'Diagnose this patient with acute chest pain' },
    } as unknown as Request

    const res = mockRes()
    await AIAssistantController.query(req, res, dummyNext)

    assert(res.statusCode === 200, `Expected HTTP 200, got ${res.statusCode}`)
    const answer = (res.body as { data: { answer: string } }).data.answer
    assert(answer.includes('Safety Limitation Notice'), 'Safety notice required for diagnosis attempt')
  })

  // -------------------------------------------------------------------
  // GROUP 5: LOCAL KNOWLEDGE RETRIEVER & FTS5 SEARCH TESTS
  // -------------------------------------------------------------------
  await runTest('Group 5.1: Execute Local AI Patient Search Query ("Ahmed Ali")', async () => {
    const req = {
      user: { userId: 'usr_doc_01', role: 'DOCTOR', tenantId: 'tenant-default' },
      body: { queryText: 'Summarize clinical records for Ahmed Ali' },
    } as unknown as Request

    const res = mockRes()
    await AIAssistantController.query(req, res, dummyNext)

    assert(res.statusCode === 200, `Expected HTTP 200, got ${res.statusCode}`)
    const data = (res.body as { data: { answer: string; confidenceLevel: string; dataSources: unknown[] } }).data
    assert(data.answer.includes('Ahmed Ali'), 'Answer should reference patient')
    assert(data.confidenceLevel === 'HIGH', 'Confidence level should be HIGH')
    assert(data.dataSources.length > 0, 'Sources should be returned')
  })

  // -------------------------------------------------------------------
  // GROUP 6: INTELLIGENT NAVIGATION ROUTING TESTS
  // -------------------------------------------------------------------
  await runTest('Group 6.1: Return Structured Navigation Target for Patient Query', async () => {
    const req = {
      user: { userId: 'usr_doc_01', role: 'DOCTOR', tenantId: 'tenant-default' },
      body: { queryText: 'Open Ahmed Ali profile' },
    } as unknown as Request

    const res = mockRes()
    await AIAssistantController.query(req, res, dummyNext)

    assert(res.statusCode === 200, `Expected HTTP 200, got ${res.statusCode}`)
    const nav = (res.body as { data: { navigationTarget?: { module: string; route: string } } }).data.navigationTarget
    assert(nav?.module === 'PATIENT_PROFILE', 'Expected PATIENT_PROFILE module target')
    assert(nav?.route === '/dashboard/patients/pat_101', 'Expected patient route')
  })

  // -------------------------------------------------------------------
  // GROUP 7: EPHEMERAL SESSION MEMORY TESTS
  // -------------------------------------------------------------------
  await runTest('Group 7.1: List User AI Assistant Sessions', async () => {
    const req = {
      user: { userId: 'usr_doc_01', role: 'DOCTOR', tenantId: 'tenant-default' },
    } as unknown as Request

    const res = mockRes()
    await AIAssistantController.listSessions(req, res, dummyNext)

    assert(res.statusCode === 200, `Expected HTTP 200, got ${res.statusCode}`)
    const sessions = (res.body as { data: unknown[] }).data
    assert(Array.isArray(sessions), 'Sessions should be an array')
  })

  // -------------------------------------------------------------------
  // GROUP 8: FTS5 INDEX REBUILD & MAINTENANCE TESTS
  // -------------------------------------------------------------------
  await runTest('Group 8.1: Rebuild FTS5 Local Knowledge Index', async () => {
    const req = {
      user: { userId: 'usr_doc_01', role: 'DOCTOR', tenantId: 'tenant-default' },
    } as unknown as Request

    const res = mockRes()
    await AIAssistantController.rebuildIndex(req, res, dummyNext)

    assert(res.statusCode === 200, `Expected HTTP 200, got ${res.statusCode}`)
    const result = (res.body as { data: { success: boolean; totalIndexed: number } }).data
    assert(result.success === true, 'Rebuild should succeed')
    assert(result.totalIndexed > 0, 'Indexed records count should be positive')
  })

  // -------------------------------------------------------------------
  // GROUP 9: PAYLOAD INPUT VALIDATION TESTS
  // -------------------------------------------------------------------
  await runTest('Group 9.1: Reject Empty AI Query (400 Bad Request)', async () => {
    try {
      AIAssistantValidator.validateQueryPayload({ queryText: '   ' })
      assert(false, 'Should have thrown AI_QUERY_EMPTY exception')
    } catch (err: unknown) {
      const error = err as { message?: string }
      assert(error.message?.includes('Query text cannot be empty') === true, 'Expected empty query error')
    }
  })

  console.info('\n=================================================================')
  console.info(`=== SUITE SUMMARY: ${passedCount} PASSED, ${failedCount} FAILED ===`)
  console.info('=================================================================\n')

  return { passedCount, failedCount }
}

// Execute suite directly if executed via node / ts-node
if (require.main === module) {
  runAIAssistantIntegrationTests()
    .then(({ failedCount }) => {
      if (failedCount > 0) process.exit(1)
    })
    .catch((err) => {
      console.error('Integration suite error:', err)
      process.exit(1)
    })
}
