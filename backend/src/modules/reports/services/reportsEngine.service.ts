// Centralized Reports & Analytics Engine Service — ClinicOS

import { AppError } from '@/shared/errors/AppError'
import type {
  DashboardKpiData,
  ChartDataset,
  ReportFilterParams,
  FinancialReportData,
  DoctorPerformanceItem,
  PatientAnalyticsData,
  AppointmentAnalyticsData,
  MedicalAnalyticsData,
  OperationalAnalyticsData,
  ReportSnapshotItem,
  ExportReportPayload,
} from '../types/reports.types'
import { reportsRepository, type IReportsRepository } from '../repositories/reports.repository'

export class ReportsEngineService {
  constructor(private readonly repository: IReportsRepository = reportsRepository) {}

  /**
   * Enforces Platform Owner Privacy Barrier
   * Security Rule: PLATFORM_ADMIN_REPORTS_RESTRICTED
   */
  private enforcePlatformIsolation(tenantId: string, role: string): void {
    if (role === 'SUPER_ADMIN' || tenantId === 'PLATFORM') {
      throw new AppError(
        'Access Denied: Platform Owners operating under tenant PLATFORM cannot view, query, or export operational or financial clinic reports.',
        403,
        'PLATFORM_ADMIN_REPORTS_RESTRICTED'
      )
    }
  }

  async getDashboardKpis(tenantId: string, role: string, clinicId?: string): Promise<DashboardKpiData> {
    this.enforcePlatformIsolation(tenantId, role)
    return await this.repository.getDashboardKpiData(tenantId, clinicId)
  }

  async getDashboardCharts(
    tenantId: string,
    role: string,
    params: {
      interval?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUAL'
      metric?: 'REVENUE' | 'APPOINTMENTS' | 'PATIENTS' | 'EXPENSES'
      startDate?: string
      endDate?: string
    }
  ): Promise<ChartDataset> {
    this.enforcePlatformIsolation(tenantId, role)

    const interval = params.interval || 'MONTHLY'
    const metric = params.metric || 'REVENUE'

    return {
      metric,
      interval,
      series: [
        { label: 'Jan 2026', value: 38200 },
        { label: 'Feb 2026', value: 41500 },
        { label: 'Mar 2026', value: 45100 },
        { label: 'Apr 2026', value: 42900 },
        { label: 'May 2026', value: 47800 },
        { label: 'Jun 2026', value: 46200 },
        { label: 'Jul 2026', value: 48500 },
      ],
    }
  }

  async getFinancialReport(tenantId: string, role: string, params: ReportFilterParams): Promise<FinancialReportData> {
    this.enforcePlatformIsolation(tenantId, role)

    if (role === 'DOCTOR' || role === 'RECEPTIONIST') {
      throw new AppError('Access Restricted: Your user role is not authorized to view financial P&L reports.', 403, 'REPORT_ACCESS_RESTRICTED')
    }

    return await this.repository.getFinancialReportData(tenantId, params)
  }

  async getDoctorReports(
    tenantId: string,
    userId: string,
    role: string,
    params: ReportFilterParams
  ): Promise<{ doctors: DoctorPerformanceItem[] }> {
    this.enforcePlatformIsolation(tenantId, role)

    const filterParams: ReportFilterParams = { ...params }

    // If role is DOCTOR, lock doctorId parameter to self
    if (role === 'DOCTOR') {
      filterParams.doctorId = userId
    }

    const items = await this.repository.getDoctorPerformanceData(tenantId, filterParams)
    const filtered = filterParams.doctorId && filterParams.doctorId !== 'ALL'
      ? items.filter((d) => d.doctorId === filterParams.doctorId)
      : items

    return { doctors: filtered }
  }

  async getPatientReports(tenantId: string, role: string, params: ReportFilterParams): Promise<PatientAnalyticsData> {
    this.enforcePlatformIsolation(tenantId, role)
    return await this.repository.getPatientAnalyticsData(tenantId, params)
  }

  async getAppointmentReports(tenantId: string, role: string, params: ReportFilterParams): Promise<AppointmentAnalyticsData> {
    this.enforcePlatformIsolation(tenantId, role)
    return await this.repository.getAppointmentAnalyticsData(tenantId, params)
  }

  async getMedicalReports(tenantId: string, role: string, params: ReportFilterParams): Promise<MedicalAnalyticsData> {
    this.enforcePlatformIsolation(tenantId, role)
    return await this.repository.getMedicalAnalyticsData(tenantId, params)
  }

  async getOperationalReports(tenantId: string, role: string, params: ReportFilterParams): Promise<OperationalAnalyticsData> {
    // Platform Owners can query operational system backups under tenantId PLATFORM
    if (role !== 'SUPER_ADMIN') {
      this.enforcePlatformIsolation(tenantId, role)
    }
    return await this.repository.getOperationalAnalyticsData(tenantId, params)
  }

  async getReportHistory(
    tenantId: string,
    role: string,
    params: ReportFilterParams
  ): Promise<{ items: ReportSnapshotItem[]; total: number; page: number; totalPages: number }> {
    this.enforcePlatformIsolation(tenantId, role)
    return await this.repository.findSnapshots(tenantId, params)
  }

  async getReportHistoryById(tenantId: string, role: string, id: string): Promise<ReportSnapshotItem> {
    this.enforcePlatformIsolation(tenantId, role)

    const item = await this.repository.findSnapshotById(tenantId, id)
    if (!item) {
      throw new AppError(`Report snapshot not found with ID ${id}.`, 404, 'SNAPSHOT_NOT_FOUND')
    }
    return item
  }

  async exportReport(
    tenantId: string,
    userId: string,
    role: string,
    payload: ExportReportPayload
  ): Promise<{ reportNumber: string; downloadUrl: string; format: string; fileName: string }> {
    this.enforcePlatformIsolation(tenantId, role)

    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14)
    const reportNumber = `RPT-${timestamp.slice(0, 6)}-${Math.floor(1000 + Math.random() * 9000)}`
    const fileName = `Report_${payload.reportType}_${timestamp}.${payload.exportFormat.toLowerCase()}`

    const snapshot: ReportSnapshotItem = {
      _id: `rpt_${Date.now()}`,
      reportNumber,
      tenantId,
      clinicId: payload.filterParams.clinicId || 'branch-main',
      reportType: payload.reportType,
      reportCategory: 'EXECUTIVE',
      title: `${payload.reportType} Statement`,
      filterParams: payload.filterParams,
      reportData: { status: 'COMPLETED' },
      exportInfo: {
        exported: true,
        exportFormat: payload.exportFormat,
        exportedAt: new Date().toISOString(),
        exportedBy: userId,
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        generatedBy: userId,
        executionTimeMs: 45,
        dataVersion: 1,
      },
      createdAt: new Date().toISOString(),
    }

    await this.repository.saveSnapshot(snapshot)

    return {
      reportNumber,
      downloadUrl: `/api/v1/reports/history/${snapshot._id}`,
      format: payload.exportFormat,
      fileName,
    }
  }
}

export const reportsEngineService = new ReportsEngineService()
