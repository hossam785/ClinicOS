// Reports & Analytics Domain Types & DTOs — ClinicOS

export type ReportCategory =
  | 'EXECUTIVE'
  | 'PATIENT'
  | 'APPOINTMENT'
  | 'DOCTOR'
  | 'FINANCIAL'
  | 'MEDICAL'
  | 'OPERATIONAL'

export type ReportType =
  | 'BUSINESS_OVERVIEW'
  | 'FINANCIAL_PROFIT_LOSS'
  | 'DOCTOR_PERFORMANCE'
  | 'PATIENT_DEMOGRAPHICS'
  | 'APPOINTMENT_ANALYTICS'
  | 'MEDICAL_ANONYMIZED'
  | 'OPERATIONAL_SECURITY'

export type ExportFormat = 'PDF' | 'EXCEL' | 'CSV'

export interface KpiMetric {
  value: number
  currency?: string
  changeVsYesterday?: number
  unit?: string
}

export interface AppointmentKpiBreakdown {
  total: number
  completed: number
  waiting: number
  canceled: number
}

export interface NotificationKpiBreakdown {
  unreadCount: number
  criticalAlerts: number
}

export interface DashboardKpiData {
  todaysPatients: KpiMetric
  todaysAppointments: AppointmentKpiBreakdown
  revenueToday: KpiMetric
  expensesToday: KpiMetric
  outstandingSettlements: KpiMetric
  activeDoctorsOnDuty: { count: number }
  pendingNotifications: NotificationKpiBreakdown
}

export interface ChartSeriesPoint {
  label: string
  value: number
  secondaryValue?: number
}

export interface ChartDataset {
  metric: 'REVENUE' | 'APPOINTMENTS' | 'PATIENTS' | 'EXPENSES'
  interval: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUAL'
  series: ChartSeriesPoint[]
}

export interface ReportFilterParams {
  startDate?: string
  endDate?: string
  doctorId?: string
  categoryId?: string
  clinicId?: string
  status?: string
  search?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface FinancialBreakdownItem {
  categoryName: string
  accountCode?: string
  transactionCount: number
  invoicedTotal: number
  paidAmount: number
}

export interface FinancialReportData {
  reportType: 'FINANCIAL_PROFIT_LOSS'
  period: { startDate: string; endDate: string }
  summary: {
    grossRevenue: number
    totalOperatingExpenses: number
    netOperatingProfit: number
    netProfitMarginPercentage: number
  }
  revenueBreakdown: Array<{ paymentMethod: string; totalAmount: number }>
  expenseBreakdown: FinancialBreakdownItem[]
}

export interface DoctorPerformanceItem {
  doctorId: string
  doctorName: string
  specialty: string
  scheduledAppointments: number
  completedVisits: number
  canceledVisits: number
  noShowVisits: number
  completionRatePercentage: number
  totalRevenueGenerated: number
  uniquePatients: number
}

export interface PatientDemographicCohort {
  cohort: string
  count: number
}

export interface PatientAnalyticsData {
  newPatientsCount: number
  returningPatientsCount: number
  returningRatioPercentage: number
  ageDistribution: PatientDemographicCohort[]
  genderDistribution: Array<{ gender: string; count: number }>
}

export interface AppointmentAnalyticsData {
  totalAppointments: number
  completedCount: number
  canceledCount: number
  noShowCount: number
  cancellationRatePercentage: number
  noShowRatePercentage: number
  averageWaitTimeMinutes: number
  averageConsultationTimeMinutes: number
}

export interface MedicalDiagnosisStat {
  code: string
  description: string
  occurrenceCount: number
}

export interface MedicalProcedureStat {
  code: string
  description: string
  occurrenceCount: number
}

export interface MedicalAnalyticsData {
  topDiagnoses: MedicalDiagnosisStat[]
  commonProcedures: MedicalProcedureStat[]
}

export interface BackupJobRecord {
  jobId: string
  status: 'SUCCESS' | 'FAILED' | 'IN_PROGRESS'
  completedAt: string
  fileSizeBytes: number
}

export interface OperationalAnalyticsData {
  receptionPerformance: { averageCheckInDurationSeconds: number }
  securityAudit: { successfulLogins: number; failedLoginAttempts: number; lockoutEvents: number }
  databaseBackupHistory: BackupJobRecord[]
}

export interface ReportSnapshotItem {
  _id: string
  reportNumber: string
  tenantId: string
  clinicId: string
  reportType: ReportType
  reportCategory: ReportCategory
  title: string
  description?: string
  filterParams: ReportFilterParams
  reportData: Record<string, unknown>
  exportInfo?: {
    exported: boolean
    exportFormat?: ExportFormat
    exportedAt?: string
    exportedBy?: string
  }
  metadata: {
    generatedAt: string
    generatedBy: string
    executionTimeMs?: number
    dataVersion?: number
  }
  createdAt: string
}

export interface ExportReportPayload {
  reportType: ReportType
  exportFormat: ExportFormat
  filterParams: ReportFilterParams
}

export interface PaginationMeta {
  totalItems: number
  totalPages: number
  currentPage: number
  limit: number
  hasNextPage: boolean
  hasPrevPage: boolean
}
