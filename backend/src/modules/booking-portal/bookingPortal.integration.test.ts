// Online Booking Portal Integration Validation Test Suite — Module-015

import { BookingPortalController } from './bookingPortal.controller'
import { BookingPortalValidator } from './bookingPortal.validator'
import { Request, Response } from 'express'
import { AuthenticatedRequest } from '@/modules/auth/auth.types'

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`[ASSERTION_FAILED] ${message}`)
  }
}

async function runBookingPortalIntegrationTests() {
  console.info('=============================================================')
  console.info('=== STARTING ONLINE BOOKING PORTAL MODULE INTEGRATION SUITE ===')
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

  // Helper for running tests
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

  // -------------------------------------------------------------------
  // GROUP 1: PUBLIC DOCTOR PROFILE & SATELLITE COLLECTIONS INTEGRATION
  // -------------------------------------------------------------------
  await runTest('Group 1.1: Fetch Public Doctor Profile Bundle by Valid Slug', async () => {
    const req = { params: { slug: 'dr-ahmed-al-mansoor' } } as unknown as Request
    const res = mockRes()
    let nextCalled = false

    await BookingPortalController.getPublicDoctorProfile(req, res, () => {
      nextCalled = true
    })

    assert(!nextCalled, 'Next function should not be called on success')
    assert(res.statusCode === 200, `Expected HTTP 200, got ${res.statusCode}`)

    const body = res.body as { status: string; data: Record<string, unknown> }
    assert(body.status === 'success', 'Response status must be success')

    const data = body.data as { profile: Record<string, unknown>; services: unknown[] }
    assert(data.profile.doctorName === 'Dr. Ahmed Al-Mansoor', 'Doctor name mismatch')
    assert(data.profile.consultationFee === 350, 'Fee mismatch')
    assert(Array.isArray(data.services) && data.services.length > 0, 'Services list missing')
  })

  await runTest('Group 1.2: Fetch Public Doctor Profile by Invalid Slug Throws 404', async () => {
    const req = { params: { slug: 'non-existent-doctor-slug' } } as unknown as Request
    const res = mockRes()
    let errorCaught: unknown = null

    await BookingPortalController.getPublicDoctorProfile(req, res, (err: unknown) => {
      errorCaught = err
    })

    assert(errorCaught !== null, 'Expected error for non-existent slug')
    assert((errorCaught as { statusCode?: number }).statusCode === 404, 'Expected HTTP 404 error')
  })

  await runTest('Group 1.3: Fetch Public Services Endpoint', async () => {
    const req = { params: { slug: 'dr-ahmed-al-mansoor' } } as unknown as Request
    const res = mockRes()

    await BookingPortalController.getPublicServices(req, res, () => {})
    assert(res.statusCode === 200, 'Expected HTTP 200')
    const body = res.body as { status: string; data: unknown[] }
    assert(Array.isArray(body.data) && body.data.length >= 3, 'Expected at least 3 active services')
  })

  // -------------------------------------------------------------------
  // GROUP 2: AVAILABILITY ENGINE & TIME SLOT CALCULATION
  // -------------------------------------------------------------------
  await runTest('Group 2.1: Calculate Available Time Slots for Shift Day', async () => {
    const req = {
      params: { slug: 'dr-ahmed-al-mansoor' },
      query: { date: '2026-08-05' },
    } as unknown as Request
    const res = mockRes()

    await BookingPortalController.getPublicCalendar(req, res, () => {})
    assert(res.statusCode === 200, 'Expected HTTP 200')

    const body = res.body as { status: string; data: { isShiftDay: boolean; availableSlots: Array<{ time: string; available: boolean }> } }
    assert(body.data.isShiftDay === true, 'Date should be marked as shift day')
    assert(Array.isArray(body.data.availableSlots), 'Slots array expected')
    assert(body.data.availableSlots.some((s) => s.available), 'Should have available slots')
  })

  // -------------------------------------------------------------------
  // GROUP 3: PUBLIC BOOKING ENGINE WORKFLOW & ANTI-SPAM
  // -------------------------------------------------------------------
  await runTest('Group 3.1: Reject Honeypot Spam Submission', async () => {
    const req = {
      params: { slug: 'dr-ahmed-al-mansoor' },
      body: {
        serviceId: 'srv_01',
        appointmentDate: '2026-08-05',
        appointmentTime: '16:00',
        patientName: 'Bot Spammer',
        patientPhone: '+201000000000',
        honeypot: 'spam_bot_filled_value',
      },
    } as unknown as Request
    const res = mockRes()
    let errorCaught: unknown = null

    await BookingPortalController.submitPublicBooking(req, res, (err: unknown) => {
      errorCaught = err
    })

    assert(errorCaught !== null, 'Honeypot fill must throw error')
    assert(
      (errorCaught as { errorCode?: string }).errorCode === 'SPAM_DETECTED',
      `Expected SPAM_DETECTED, got ${(errorCaught as { errorCode?: string }).errorCode}`
    )
  })

  await runTest('Group 3.2: Successfully Process Valid Public Appointment Booking', async () => {
    const req = {
      params: { slug: 'dr-ahmed-al-mansoor' },
      body: {
        serviceId: 'srv_01',
        appointmentDate: '2026-08-05',
        appointmentTime: '16:30',
        patientName: 'Test Patient Integration',
        patientPhone: '+201234567890',
        notes: 'Integration test appointment booking',
      },
    } as unknown as Request
    const res = mockRes()

    await BookingPortalController.submitPublicBooking(req, res, () => {})
    assert(res.statusCode === 201, `Expected HTTP 201 Created, got ${res.statusCode}`)

    const body = res.body as { status: string; data: { bookingReference: string; status: string } }
    assert(body.status === 'success', 'Booking status must be success')
    assert(body.data.bookingReference.startsWith('APT-'), 'Reference code format mismatch')
    assert(body.data.status === 'APPOINTMENT_SCHEDULED', 'Status code mismatch')
  })

  // -------------------------------------------------------------------
  // GROUP 4: DASHBOARD DOCTOR PROFILE & BIOGRAPHY MANAGEMENT
  // -------------------------------------------------------------------
  await runTest('Group 4.1: Fetch and Update Dashboard Profile Bio', async () => {
    const req = {
      user: { userId: 'doc_ahmed_01', role: 'Doctor', tenantId: 'tenant-default-001' },
      body: {
        doctorName: 'Dr. Ahmed Al-Mansoor',
        doctorTitle: 'Senior Consultant Cardiologist',
        consultationFee: 400,
      },
    } as unknown as AuthenticatedRequest
    const res = mockRes()

    await BookingPortalController.updateDashboardProfile(req, res, () => {})
    assert(res.statusCode === 200, 'Expected HTTP 200')

    const body = res.body as { status: string; data: { doctorTitle: string; consultationFee: number } }
    assert(body.data.doctorTitle === 'Senior Consultant Cardiologist', 'Title update failed')
    assert(body.data.consultationFee === 400, 'Fee update failed')
  })

  // -------------------------------------------------------------------
  // GROUP 5: DASHBOARD VISUAL BRANDING & COLOR TOKEN MANAGEMENT
  // -------------------------------------------------------------------
  await runTest('Group 5.1: Validate and Update Visual Branding Color Tokens', async () => {
    const req = {
      user: { userId: 'doc_ahmed_01', role: 'Doctor', tenantId: 'tenant-default-001' },
      body: {
        coverImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d',
        profileImage: 'https://images.unsplash.com/photo-1622253692010',
        primaryColor: '#0284C7',
        secondaryColor: '#0F172A',
        accentColor: '#F59E0B',
      },
    } as unknown as AuthenticatedRequest
    const res = mockRes()

    await BookingPortalController.updateBranding(req, res, () => {})
    assert(res.statusCode === 200, 'Expected HTTP 200')

    const body = res.body as { status: string; data: { primaryColor: string } }
    assert(body.data.primaryColor === '#0284C7', 'Primary color update failed')
  })

  await runTest('Group 5.2: Reject Invalid Hex Color Code Format', async () => {
    try {
      BookingPortalValidator.validateBranding({ primaryColor: 'invalid_color_code' })
      assert(false, 'Should have thrown INVALID_COLOR_HEX')
    } catch (err: unknown) {
      assert((err as { errorCode?: string }).errorCode === 'INVALID_COLOR_HEX', `Expected INVALID_COLOR_HEX, got ${(err as { errorCode?: string }).errorCode}`)
    }
  })

  // -------------------------------------------------------------------
  // GROUP 6: DASHBOARD SERVICES CATALOG CRUD OPERATIONS
  // -------------------------------------------------------------------
  await runTest('Group 6.1: Create New Service in Catalog', async () => {
    const req = {
      user: { userId: 'doc_ahmed_01', role: 'Doctor', tenantId: 'tenant-default-001' },
      body: {
        title: 'Cardiac Stress ECG Test',
        description: 'Treadmill stress ECG diagnostic test.',
        duration: 45,
        consultationFee: 750,
        icon: 'Activity',
      },
    } as unknown as AuthenticatedRequest
    const res = mockRes()

    await BookingPortalController.createDashboardService(req, res, () => {})
    assert(res.statusCode === 201, 'Expected HTTP 201 Created')

    const body = res.body as { status: string; data: { serviceId: string; title: string } }
    assert(body.data.title === 'Cardiac Stress ECG Test', 'Service title mismatch')
    assert(body.data.serviceId.startsWith('srv_'), 'Service ID prefix mismatch')
  })

  // -------------------------------------------------------------------
  // GROUP 7: DASHBOARD GALLERY & FAQ MANAGEMENT
  // -------------------------------------------------------------------
  await runTest('Group 7.1: Add New FAQ Item', async () => {
    const req = {
      user: { userId: 'doc_ahmed_01', role: 'Doctor', tenantId: 'tenant-default-001' },
      body: {
        question: 'Are walk-in consultations accepted?',
        answer: 'Walk-ins are welcomed subject to slot availability, but online booking is strongly recommended.',
        displayOrder: 4,
      },
    } as unknown as AuthenticatedRequest
    const res = mockRes()

    await BookingPortalController.createDashboardFaq(req, res, () => {})
    assert(res.statusCode === 201, 'Expected HTTP 201 Created')

    const body = res.body as { status: string; data: { faqId: string; question: string } }
    assert(body.data.question === 'Are walk-in consultations accepted?', 'Question mismatch')
  })

  // -------------------------------------------------------------------
  // GROUP 8: DASHBOARD SEO & CUSTOM SLUG MANAGEMENT
  // -------------------------------------------------------------------
  await runTest('Group 8.1: Update SEO Title and Meta Description', async () => {
    const req = {
      user: { userId: 'doc_ahmed_01', role: 'Doctor', tenantId: 'tenant-default-001' },
      body: {
        seoTitle: 'Dr. Ahmed Al-Mansoor — Lead Cardiology Specialist',
        seoDescription: 'Book online appointment with top rated cardiology expert in Cairo.',
        seoKeywords: ['Cardiology', 'Cairo', 'Heart Specialist'],
      },
    } as unknown as AuthenticatedRequest
    const res = mockRes()

    await BookingPortalController.updateSeo(req, res, () => {})
    assert(res.statusCode === 200, 'Expected HTTP 200')

    const body = res.body as { status: string; data: { seoTitle: string } }
    assert(body.data.seoTitle === 'Dr. Ahmed Al-Mansoor — Lead Cardiology Specialist', 'SEO title update failed')
  })

  // -------------------------------------------------------------------
  // GROUP 9: PLATFORM OWNER SECURITY ISOLATION BARRIER
  // -------------------------------------------------------------------
  await runTest('Group 9.1: Enforce Platform Owner Barrier for SuperAdmin (PLATFORM_ADMIN_BRANDING_RESTRICTED)', async () => {
    const req = {
      user: { userId: 'super_admin_01', role: 'SUPER_ADMIN', tenantId: 'PLATFORM' },
      body: { primaryColor: '#FF0000' },
    } as unknown as AuthenticatedRequest
    const res = mockRes()
    let errorCaught: unknown = null

    await BookingPortalController.updateBranding(req, res, (err: unknown) => {
      errorCaught = err
    })

    assert(errorCaught !== null, 'Platform Owner access must be restricted')
    assert(
      (errorCaught as { errorCode?: string }).errorCode === 'PLATFORM_ADMIN_BRANDING_RESTRICTED',
      `Expected PLATFORM_ADMIN_BRANDING_RESTRICTED, got ${(errorCaught as { errorCode?: string }).errorCode}`
    )
  })

  // -------------------------------------------------------------------
  // GROUP 10: ANALYTICS METRICS INTEGRATION
  // -------------------------------------------------------------------
  await runTest('Group 10.1: Fetch Portal Analytics Dashboard Metrics', async () => {
    const req = {
      user: { userId: 'doc_ahmed_01', role: 'Doctor', tenantId: 'tenant-default-001' },
      query: { period: '2026-08' },
    } as unknown as AuthenticatedRequest
    const res = mockRes()

    await BookingPortalController.getDashboardAnalytics(req, res, () => {})
    assert(res.statusCode === 200, 'Expected HTTP 200')

    const body = res.body as { status: string; data: { summary: { pageViews: number; bookingRequests: number } } }
    assert(typeof body.data.summary.pageViews === 'number', 'Page views count missing')
    assert(typeof body.data.summary.bookingRequests === 'number', 'Booking requests count missing')
  })

  console.info('\n=============================================================')
  console.info(`=== INTEGRATION TEST RESULTS: ${passedCount} PASSED, ${failedCount} FAILED ===`)
  console.info('=============================================================\n')

  if (failedCount > 0) {
    process.exit(1)
  }
}

// Execute suite
runBookingPortalIntegrationTests().catch((err) => {
  console.error('Unhandled failure in integration test runner:', err)
  process.exit(1)
})
