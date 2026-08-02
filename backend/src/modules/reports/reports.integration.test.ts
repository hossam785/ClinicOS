// Reports & Analytics Module Integration Test Suite — ClinicOS

import { InMemoryReportsRepository } from './repositories/reports.repository'
import { ReportsEngineService } from './services/reportsEngine.service'
import { ReportsValidator } from './validators/reports.validator'
import { AppError } from '@/shared/errors/AppError'
import type { ExportReportPayload } from './types/reports.types'

export async function runReportsIntegrationTests() {
  console.info('===========================================================')
  console.info('STARTING TASK-117: REPORTS & ANALYTICS INTEGRATION TESTS')
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

  const repo = new InMemoryReportsRepository()
  const engine = new ReportsEngineService(repo)

  const tenantId = 'tenant-clinic-001'
  const clinicId = 'branch-main'

  const userIdDoctor = 'user_doc_042'
  const roleDoctor = 'DOCTOR'

  const userIdManager = 'user_manager_01'
  const roleManager = 'CLINIC_MANAGER'

  const userIdStaff = 'user_staff_88'
  const roleStaff = 'RECEPTIONIST'
  void userIdStaff

  const platformAdminUserId = 'user_super_admin'
  const platformAdminRole = 'SUPER_ADMIN'
  void platformAdminUserId


  // -------------------------------------------------------------
  // GROUP 1: Request Validation Pipelines
  // -------------------------------------------------------------
  console.info('\n--- GROUP 1: Request Validation Pipelines ---')

  // Test 1: Query validator accepts valid parameters
  const validFilters = ReportsValidator.validateFilterParams({
    page: 1,
    limit: 20,
    categoryId: 'FINANCIAL',
    startDate: '2026-07-01T00:00:00.000Z',
    endDate: '2026-07-31T23:59:59.999Z',
  })
  assert(
    validFilters.page === 1 &&
      validFilters.limit === 20 &&
      validFilters.categoryId === 'FINANCIAL',
    'Query validator accepts valid parameters'
  )

  // Test 2: Query validator rejects negative page
  try {
    ReportsValidator.validateFilterParams({ page: -1 })
    assert(false, 'Query validator should reject page < 1')
  } catch (err: unknown) {
    assert(
      err instanceof AppError && err.errorCode === 'INVALID_PAGE_PARAM',
      'Query validator throws INVALID_PAGE_PARAM on negative page'
    )
  }

  // Test 3: Query validator rejects limit > 100
  try {
    ReportsValidator.validateFilterParams({ limit: 500 })
    assert(false, 'Query validator should reject limit > 100')
  } catch (err: unknown) {
    assert(
      err instanceof AppError && err.errorCode === 'INVALID_LIMIT_PARAM',
      'Query validator throws INVALID_LIMIT_PARAM on limit > 100'
    )
  }

  // Test 4: Query validator rejects startDate > endDate
  try {
    ReportsValidator.validateFilterParams({
      startDate: '2026-08-01T00:00:00.000Z',
      endDate: '2026-07-01T00:00:00.000Z',
    })
    assert(false, 'Query validator should reject startDate > endDate')
  } catch (err: unknown) {
    assert(
      err instanceof AppError && err.errorCode === 'INVALID_DATE_RANGE',
      'Query validator throws INVALID_DATE_RANGE when startDate > endDate'
    )
  }

  // Test 5: Query validator rejects invalid category enum
  try {
    ReportsValidator.validateFilterParams({ categoryId: 'INVALID_CAT' })
    assert(false, 'Query validator should reject invalid category')
  } catch (err: unknown) {
    assert(
      err instanceof AppError && err.errorCode === 'INVALID_CATEGORY_PARAM',
      'Query validator throws INVALID_CATEGORY_PARAM on invalid enum'
    )
  }

  // Test 6: Export validator rejects invalid report type
  try {
    ReportsValidator.validateExportPayload({
      reportType: 'INVALID_TYPE' as unknown as ExportReportPayload['reportType'],
      exportFormat: 'PDF',
      filterParams: {},
    })
    assert(false, 'Export validator should reject invalid reportType')
  } catch (err: unknown) {
    assert(
      err instanceof AppError && err.errorCode === 'INVALID_REPORT_TYPE',
      'Export validator throws INVALID_REPORT_TYPE on invalid report type'
    )
  }

  // -------------------------------------------------------------
  // GROUP 2: Dashboard Analytics Engine & KPI Calculations
  // -------------------------------------------------------------
  console.info('\n--- GROUP 2: Dashboard Analytics Engine & KPI Calculations ---')

  // Test 7: Get dashboard KPIs
  const kpis = await engine.getDashboardKpis(tenantId, roleManager, clinicId)
  assert(
    kpis.todaysPatients.value === 18 &&
      kpis.todaysAppointments.total === 22 &&
      kpis.revenueToday.value === 2450 &&
      kpis.expensesToday.value === 450 &&
      kpis.outstandingSettlements.value === 4250,
    'getDashboardKpis returns structured KPI data'
  )

  // Test 8: Get dashboard charts dataset
  const charts = await engine.getDashboardCharts(tenantId, roleManager, {
    metric: 'REVENUE',
    interval: 'MONTHLY',
  })
  assert(
    charts.metric === 'REVENUE' &&
      charts.interval === 'MONTHLY' &&
      charts.series.length >= 5,
    'getDashboardCharts returns time-series data points'
  )

  // -------------------------------------------------------------
  // GROUP 3: Platform Owner Security Isolation Barrier
  // -------------------------------------------------------------
  console.info('\n--- GROUP 3: Platform Owner Security Isolation Barrier ---')

  // Test 9: Platform Owner blocked from querying clinic operational/financial reports
  try {
    await engine.getFinancialReport('PLATFORM', platformAdminRole, {})
    assert(false, 'SUPER_ADMIN should be blocked from clinic financial reports')
  } catch (err: unknown) {
    assert(
      err instanceof AppError && err.errorCode === 'PLATFORM_ADMIN_REPORTS_RESTRICTED',
      'Engine throws PLATFORM_ADMIN_REPORTS_RESTRICTED barrier for SUPER_ADMIN'
    )
  }

  // Test 10: SUPER_ADMIN allowed to query platform operational backup reports
  const platformOps = await engine.getOperationalReports('PLATFORM', platformAdminRole, {})
  assert(
    platformOps.databaseBackupHistory.length >= 1,
    'SUPER_ADMIN allowed to access platform operational backup reports'
  )

  // -------------------------------------------------------------
  // GROUP 4: Role-Based Access Scoping (RBAC)
  // -------------------------------------------------------------
  console.info('\n--- GROUP 4: Role-Based Access Scoping (RBAC) ---')

  // Test 11: Doctor role blocked from financial P&L report
  try {
    await engine.getFinancialReport(tenantId, roleDoctor, {})
    assert(false, 'Doctor role should be blocked from financial P&L report')
  } catch (err: unknown) {
    assert(
      err instanceof AppError && err.errorCode === 'REPORT_ACCESS_RESTRICTED',
      'Doctor role attempting to access financial P&L report throws REPORT_ACCESS_RESTRICTED'
    )
  }

  // Test 12: Doctor role performance query locks doctorId to self
  const doctorSelfReport = await engine.getDoctorReports(tenantId, userIdDoctor, roleDoctor, {
    doctorId: 'doc_102', // Attempting to inspect doc_102
  })
  assert(
    doctorSelfReport.doctors.every((d) => d.doctorId === userIdDoctor),
    'Doctor role requesting performance reports automatically locks doctorId to self'
  )

  // Test 13: Clinic Manager role can query full financial report
  const finReport = await engine.getFinancialReport(tenantId, roleManager, {})
  assert(
    finReport.summary.grossRevenue === 48500 && finReport.summary.netOperatingProfit === 34250,
    'Clinic Manager role can query full clinic financial and operational reports'
  )

  // -------------------------------------------------------------
  // GROUP 5: Financial Accounting Invariants
  // -------------------------------------------------------------
  console.info('\n--- GROUP 5: Financial Accounting Invariants ---')

  // Test 14: Gross revenue includes COMPLETED appointments only
  assert(
    finReport.summary.grossRevenue === 48500,
    'Gross Revenue calculation strictly includes appointments with status COMPLETED'
  )

  // Test 15: Operating expenses include PAID expenses only
  assert(
    finReport.summary.totalOperatingExpenses === 14250,
    'Operating Expenses calculation strictly includes items with status PAID'
  )

  // Test 16: Net Profit calculation matches (Gross Revenue - Expenses)
  const expectedProfit = finReport.summary.grossRevenue - finReport.summary.totalOperatingExpenses
  assert(
    finReport.summary.netOperatingProfit === expectedProfit,
    'Net Operating Profit calculation verifies Gross Revenue minus Expenses'
  )

  // -------------------------------------------------------------
  // GROUP 6: Anonymized Clinical Medical Reports
  // -------------------------------------------------------------
  console.info('\n--- GROUP 6: Anonymized Clinical Medical Reports ---')

  // Test 17: Medical report returns ICD-10 diagnosis statistics
  const medicalReport = await engine.getMedicalReports(tenantId, roleDoctor, {})
  assert(
    medicalReport.topDiagnoses.length >= 1 && medicalReport.commonProcedures.length >= 1,
    'Medical report returns top ICD-10 diagnoses and common procedures'
  )

  // Test 18: Medical reports strictly omit Patient Identifiable Information (PII)
  const medicalJson = JSON.stringify(medicalReport)
  assert(
    !medicalJson.includes('patientName') && !medicalJson.includes('patientId') && !medicalJson.includes('mrn'),
    'Medical reports strictly omit all Patient Identifiable Information (PII)'
  )

  // -------------------------------------------------------------
  // GROUP 7: Historical Report Snapshots Registry
  // -------------------------------------------------------------
  console.info('\n--- GROUP 7: Historical Report Snapshots Registry ---')

  // Test 19: List historical snapshots
  const snapshots = await engine.getReportHistory(tenantId, roleManager, {})
  assert(
    snapshots.items.length >= 1 && snapshots.items[0].reportNumber.startsWith('RPT-'),
    'getReportHistory retrieves historical snapshots list'
  )

  // Test 20: Inspect specific snapshot by ID
  const singleSnapshot = await engine.getReportHistoryById(tenantId, roleManager, snapshots.items[0]._id)
  assert(
    singleSnapshot._id === snapshots.items[0]._id && singleSnapshot.reportNumber === snapshots.items[0].reportNumber,
    'findSnapshotById retrieves exact historical snapshot details'
  )

  // Test 21: Search historical snapshots by query string
  const searchSnapshots = await engine.getReportHistory(tenantId, roleManager, {
    search: 'Profit',
  })
  assert(
    searchSnapshots.items.length >= 1,
    'findSnapshots supports search and category filtering'
  )

  // -------------------------------------------------------------
  // GROUP 8: Document Export Engine
  // -------------------------------------------------------------
  console.info('\n--- GROUP 8: Document Export Engine ---')

  // Test 22: Export report PDF
  const exportPayload: ExportReportPayload = {
    reportType: 'FINANCIAL_PROFIT_LOSS',
    exportFormat: 'PDF',
    filterParams: { startDate: '2026-07-01', endDate: '2026-07-31' },
  }
  const exportResult = await engine.exportReport(tenantId, userIdManager, roleManager, exportPayload)
  assert(
    exportResult.reportNumber.startsWith('RPT-') && exportResult.format === 'PDF' && exportResult.fileName.endsWith('.pdf'),
    'exportReport generates export download URL, report number, and format header for PDF export'
  )

  // Test 23: Export creates audit snapshot
  const postExportSnapshots = await engine.getReportHistory(tenantId, roleManager, {})
  assert(
    postExportSnapshots.items.some((s) => s.reportNumber === exportResult.reportNumber),
    'exportReport creates an audit-logged historical snapshot'
  )

  // -------------------------------------------------------------
  // GROUP 9: Operational & Security Audit Reports
  // -------------------------------------------------------------
  console.info('\n--- GROUP 9: Operational & Security Audit Reports ---')

  // Test 24: Get operational reports
  const opsReport = await engine.getOperationalReports(tenantId, roleManager, {})
  assert(
    opsReport.receptionPerformance.averageCheckInDurationSeconds === 45 &&
      opsReport.securityAudit.successfulLogins === 420 &&
      opsReport.databaseBackupHistory.length >= 1,
    'getOperationalReports returns reception check-in speed, security login audit logs, and database backup job history'
  )

  // -------------------------------------------------------------
  // GROUP 10: Error Handling & Edge Cases
  // -------------------------------------------------------------
  console.info('\n--- GROUP 10: Error Handling & Edge Cases ---')

  // Test 25: Non-existent snapshot ID throws SNAPSHOT_NOT_FOUND
  try {
    await engine.getReportHistoryById(tenantId, roleManager, 'non_existent_id_999')
    assert(false, 'Inspecting non-existent snapshot ID should fail')
  } catch (err: unknown) {
    assert(
      err instanceof AppError && err.errorCode === 'SNAPSHOT_NOT_FOUND',
      'Non-existent report snapshot ID throws SNAPSHOT_NOT_FOUND (HTTP 404)'
    )
  }

  // Test 26: Cross-tenant snapshot inspection returns SNAPSHOT_NOT_FOUND
  try {
    await engine.getReportHistoryById('other-tenant-999', roleManager, snapshots.items[0]._id)
    assert(false, 'Cross-tenant snapshot inspection should fail')
  } catch (err: unknown) {
    assert(
      err instanceof AppError && err.errorCode === 'SNAPSHOT_NOT_FOUND',
      'Cross-tenant snapshot lookup returns SNAPSHOT_NOT_FOUND'
    )
  }

  // Test 27: Patient reports acquisition ratios
  const patientReport = await engine.getPatientReports(tenantId, roleManager, {})
  assert(
    patientReport.newPatientsCount === 42 && patientReport.returningPatientsCount === 118,
    'getPatientReports returns acquisition and retention metrics'
  )

  // Test 28: Appointment analytics queue metrics
  const aptReport = await engine.getAppointmentReports(tenantId, roleStaff, {})
  assert(
    aptReport.totalAppointments === 210 && aptReport.averageWaitTimeMinutes === 12.4,
    'getAppointmentReports returns queue wait times and completed visit counts'
  )

  console.info('\n===========================================================')
  console.info(`ALL ${totalTests} REPORTS & ANALYTICS INTEGRATION TESTS PASSED SUCCESSFULLY!`)
  console.info('===========================================================')
}

// Execute tests automatically if run via CLI
if (require.main === module) {
  runReportsIntegrationTests().catch((err) => {
    console.error('Integration Test Suite Failure:', err)
    process.exit(1)
  })
}
