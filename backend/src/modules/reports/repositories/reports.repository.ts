// Reports & Analytics Repository & Data Store — ClinicOS

import type {
  ReportSnapshotItem,
  ReportFilterParams,
  DashboardKpiData,
  FinancialReportData,
  DoctorPerformanceItem,
  PatientAnalyticsData,
  AppointmentAnalyticsData,
  MedicalAnalyticsData,
  OperationalAnalyticsData,
} from '../types/reports.types'

export interface IReportsRepository {
  saveSnapshot(snapshot: ReportSnapshotItem): Promise<ReportSnapshotItem>
  findSnapshotById(tenantId: string, id: string): Promise<ReportSnapshotItem | null>
  findSnapshots(
    tenantId: string,
    params: ReportFilterParams
  ): Promise<{ items: ReportSnapshotItem[]; total: number; page: number; totalPages: number }>
  getDashboardKpiData(tenantId: string, clinicId?: string): Promise<DashboardKpiData>
  getFinancialReportData(tenantId: string, params: ReportFilterParams): Promise<FinancialReportData>
  getDoctorPerformanceData(tenantId: string, params: ReportFilterParams): Promise<DoctorPerformanceItem[]>
  getPatientAnalyticsData(tenantId: string, params: ReportFilterParams): Promise<PatientAnalyticsData>
  getAppointmentAnalyticsData(tenantId: string, params: ReportFilterParams): Promise<AppointmentAnalyticsData>
  getMedicalAnalyticsData(tenantId: string, params: ReportFilterParams): Promise<MedicalAnalyticsData>
  getOperationalAnalyticsData(tenantId: string, params: ReportFilterParams): Promise<OperationalAnalyticsData>
}

export class InMemoryReportsRepository implements IReportsRepository {
  private snapshots: ReportSnapshotItem[] = []

  constructor() {
    this.seedInitialSnapshots()
  }

  private seedInitialSnapshots(): void {
    this.snapshots.push({
      _id: 'rpt_202608_00001',
      reportNumber: 'RPT-202608-00001',
      tenantId: 'tenant-clinic-001',
      clinicId: 'branch-main',
      reportType: 'FINANCIAL_PROFIT_LOSS',
      reportCategory: 'FINANCIAL',
      title: 'Monthly Profit and Loss Statement - July 2026',
      description: 'Finalized financial statement of gross revenue, paid expenses, and net profit.',
      filterParams: {
        startDate: '2026-07-01T00:00:00.000Z',
        endDate: '2026-07-31T23:59:59.999Z',
      },
      reportData: {
        summary: {
          grossRevenue: 48500,
          totalOperatingExpenses: 14250,
          netOperatingProfit: 34250,
          netProfitMarginPercentage: 70.62,
        },
      },
      exportInfo: {
        exported: true,
        exportFormat: 'PDF',
        exportedAt: '2026-08-01T01:15:00.000Z',
        exportedBy: 'usr_manager_01',
      },
      metadata: {
        generatedAt: '2026-08-01T01:15:00.000Z',
        generatedBy: 'usr_manager_01',
        executionTimeMs: 142,
        dataVersion: 1,
      },
      createdAt: '2026-08-01T01:15:00.000Z',
    })
  }

  async saveSnapshot(snapshot: ReportSnapshotItem): Promise<ReportSnapshotItem> {
    const existingIndex = this.snapshots.findIndex(
      (s) => s.tenantId === snapshot.tenantId && s._id === snapshot._id
    )
    if (existingIndex >= 0) {
      this.snapshots[existingIndex] = { ...snapshot, updatedAt: new Date().toISOString() }
      return this.snapshots[existingIndex]
    }
    this.snapshots.unshift(snapshot)
    return snapshot
  }

  async findSnapshotById(tenantId: string, id: string): Promise<ReportSnapshotItem | null> {
    const item = this.snapshots.find((s) => s.tenantId === tenantId && s._id === id)
    return item || null
  }

  async findSnapshots(
    tenantId: string,
    params: ReportFilterParams
  ): Promise<{ items: ReportSnapshotItem[]; total: number; page: number; totalPages: number }> {
    let filtered = this.snapshots.filter((s) => s.tenantId === tenantId)

    if (params.categoryId && params.categoryId !== 'ALL') {
      filtered = filtered.filter((s) => s.reportCategory === params.categoryId)
    }

    if (params.search && params.search.trim() !== '') {
      const q = params.search.toLowerCase()
      filtered = filtered.filter(
        (s) => s.title.toLowerCase().includes(q) || s.reportNumber.toLowerCase().includes(q)
      )
    }

    const page = params.page || 1
    const limit = params.limit || 20
    const total = filtered.length
    const totalPages = Math.ceil(total / limit) || 1
    const startIndex = (page - 1) * limit
    const items = filtered.slice(startIndex, startIndex + limit)

    return { items, total, page, totalPages }
  }

  async getDashboardKpiData(_tenantId: string, _clinicId?: string): Promise<DashboardKpiData> {
    return {
      todaysPatients: { value: 18, changeVsYesterday: 12.5 },
      todaysAppointments: { total: 22, completed: 14, waiting: 5, canceled: 3 },
      revenueToday: { value: 2450, currency: 'USD' },
      expensesToday: { value: 450, currency: 'USD' },
      outstandingSettlements: { value: 4250, currency: 'USD' },
      activeDoctorsOnDuty: { count: 4 },
      pendingNotifications: { unreadCount: 6, criticalAlerts: 1 },
    }
  }

  async getFinancialReportData(_tenantId: string, params: ReportFilterParams): Promise<FinancialReportData> {
    return {
      reportType: 'FINANCIAL_PROFIT_LOSS',
      period: {
        startDate: params.startDate || '2026-07-01',
        endDate: params.endDate || '2026-07-31',
      },
      summary: {
        grossRevenue: 48500,
        totalOperatingExpenses: 14250,
        netOperatingProfit: 34250,
        netProfitMarginPercentage: 70.62,
      },
      revenueBreakdown: [
        { paymentMethod: 'CASH', totalAmount: 28500 },
        { paymentMethod: 'CREDIT_CARD', totalAmount: 20000 },
      ],
      expenseBreakdown: [
        { categoryName: 'Facility Rent', accountCode: 'EXP-201', transactionCount: 1, invoicedTotal: 5000, paidAmount: 5000 },
        { categoryName: 'Medical Supplies', accountCode: 'EXP-202', transactionCount: 12, invoicedTotal: 6250, paidAmount: 6250 },
        { categoryName: 'Utilities & Internet', accountCode: 'EXP-203', transactionCount: 3, invoicedTotal: 3000, paidAmount: 3000 },
      ],
    }
  }

  async getDoctorPerformanceData(_tenantId: string, _params: ReportFilterParams): Promise<DoctorPerformanceItem[]> {
    return [
      {
        doctorId: 'doc_101',
        doctorName: 'Dr. Alexander Fleming',
        specialty: 'Cardiology',
        scheduledAppointments: 85,
        completedVisits: 78,
        canceledVisits: 5,
        noShowVisits: 2,
        completionRatePercentage: 91.76,
        totalRevenueGenerated: 15600,
        uniquePatients: 62,
      },
      {
        doctorId: 'doc_102',
        doctorName: 'Dr. Elizabeth Blackwell',
        specialty: 'Pediatrics',
        scheduledAppointments: 68,
        completedVisits: 64,
        canceledVisits: 3,
        noShowVisits: 1,
        completionRatePercentage: 94.12,
        totalRevenueGenerated: 11200,
        uniquePatients: 54,
      },
    ]
  }

  async getPatientAnalyticsData(_tenantId: string, _params: ReportFilterParams): Promise<PatientAnalyticsData> {
    return {
      newPatientsCount: 42,
      returningPatientsCount: 118,
      returningRatioPercentage: 73.75,
      ageDistribution: [
        { cohort: '<18', count: 15 },
        { cohort: '18-35', count: 55 },
        { cohort: '36-50', count: 48 },
        { cohort: '>50', count: 42 },
      ],
      genderDistribution: [
        { gender: 'FEMALE', count: 92 },
        { gender: 'MALE', count: 68 },
      ],
    }
  }

  async getAppointmentAnalyticsData(_tenantId: string, _params: ReportFilterParams): Promise<AppointmentAnalyticsData> {
    return {
      totalAppointments: 210,
      completedCount: 175,
      canceledCount: 20,
      noShowCount: 15,
      cancellationRatePercentage: 9.52,
      noShowRatePercentage: 7.14,
      averageWaitTimeMinutes: 12.4,
      averageConsultationTimeMinutes: 18.6,
    }
  }

  async getMedicalAnalyticsData(_tenantId: string, _params: ReportFilterParams): Promise<MedicalAnalyticsData> {
    return {
      topDiagnoses: [
        { code: 'I10', description: 'Essential (primary) hypertension', occurrenceCount: 38 },
        { code: 'E11', description: 'Type 2 diabetes mellitus', occurrenceCount: 29 },
        { code: 'J06.9', description: 'Acute upper respiratory infection, unspecified', occurrenceCount: 24 },
      ],
      commonProcedures: [
        { code: '99213', description: 'Office Consultation Level 3', occurrenceCount: 84 },
        { code: '93000', description: 'Electrocardiogram Complete', occurrenceCount: 22 },
      ],
    }
  }

  async getOperationalAnalyticsData(_tenantId: string, _params: ReportFilterParams): Promise<OperationalAnalyticsData> {
    return {
      receptionPerformance: { averageCheckInDurationSeconds: 45 },
      securityAudit: { successfulLogins: 420, failedLoginAttempts: 3, lockoutEvents: 0 },
      databaseBackupHistory: [
        { jobId: 'job_991', status: 'SUCCESS', completedAt: '2026-08-01T00:00:00.000Z', fileSizeBytes: 45891200 },
      ],
    }
  }
}

export const reportsRepository = new InMemoryReportsRepository()
