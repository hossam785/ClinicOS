// Reports & Analytics REST API Service Client — ClinicOS

import { apiClient } from '@/services/apiClient'
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
  PaginationMeta,
} from '../types/reports'

export interface DashboardKpiResponse {
  success: boolean
  data: DashboardKpiData
  meta?: { timestamp: string }
}

export interface DashboardChartsResponse {
  success: boolean
  data: ChartDataset
  meta?: { timestamp: string }
}

export interface FinancialReportResponse {
  success: boolean
  data: FinancialReportData
  meta?: { timestamp: string }
}

export interface DoctorReportsResponse {
  success: boolean
  data: { doctors: DoctorPerformanceItem[] }
  meta?: { timestamp: string }
}

export interface PatientReportsResponse {
  success: boolean
  data: PatientAnalyticsData
  meta?: { timestamp: string }
}

export interface AppointmentReportsResponse {
  success: boolean
  data: AppointmentAnalyticsData
  meta?: { timestamp: string }
}

export interface MedicalReportsResponse {
  success: boolean
  data: MedicalAnalyticsData
  meta?: { timestamp: string }
}

export interface OperationalReportsResponse {
  success: boolean
  data: OperationalAnalyticsData
  meta?: { timestamp: string }
}

export interface ReportHistoryResponse {
  success: boolean
  data: {
    items: ReportSnapshotItem[]
    pagination: PaginationMeta
  }
  meta?: { timestamp: string }
}

export interface SingleReportHistoryResponse {
  success: boolean
  data: ReportSnapshotItem
  meta?: { timestamp: string }
}

export interface ExportReportResponse {
  success: boolean
  data: {
    reportNumber: string
    downloadUrl: string
    format: string
    fileName: string
  }
  meta?: { timestamp: string }
}

export const reportsApi = {
  getDashboardKpis: async (clinicId?: string): Promise<DashboardKpiResponse> => {
    const url = clinicId ? `/api/v1/reports/dashboard?clinicId=${encodeURIComponent(clinicId)}` : '/api/v1/reports/dashboard'
    return await apiClient.get<DashboardKpiResponse>(url)
  },

  getDashboardCharts: async (params?: {
    interval?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUAL'
    metric?: 'REVENUE' | 'APPOINTMENTS' | 'PATIENTS' | 'EXPENSES'
    startDate?: string
    endDate?: string
  }): Promise<DashboardChartsResponse> => {
    const searchParams = new URLSearchParams()
    if (params?.interval) searchParams.append('interval', params.interval)
    if (params?.metric) searchParams.append('metric', params.metric)
    if (params?.startDate) searchParams.append('startDate', params.startDate)
    if (params?.endDate) searchParams.append('endDate', params.endDate)

    const queryStr = searchParams.toString()
    const url = `/api/v1/reports/dashboard/charts${queryStr ? `?${queryStr}` : ''}`
    return await apiClient.get<DashboardChartsResponse>(url)
  },

  getFinancialReport: async (params?: ReportFilterParams): Promise<FinancialReportResponse> => {
    const searchParams = new URLSearchParams()
    if (params?.startDate) searchParams.append('startDate', params.startDate)
    if (params?.endDate) searchParams.append('endDate', params.endDate)
    if (params?.doctorId && params.doctorId !== 'ALL') searchParams.append('doctorId', params.doctorId)

    const queryStr = searchParams.toString()
    const url = `/api/v1/reports/financial${queryStr ? `?${queryStr}` : ''}`
    return await apiClient.get<FinancialReportResponse>(url)
  },

  getDoctorReports: async (params?: ReportFilterParams): Promise<DoctorReportsResponse> => {
    const searchParams = new URLSearchParams()
    if (params?.startDate) searchParams.append('startDate', params.startDate)
    if (params?.endDate) searchParams.append('endDate', params.endDate)
    if (params?.doctorId && params.doctorId !== 'ALL') searchParams.append('doctorId', params.doctorId)

    const queryStr = searchParams.toString()
    const url = `/api/v1/reports/doctors${queryStr ? `?${queryStr}` : ''}`
    return await apiClient.get<DoctorReportsResponse>(url)
  },

  getPatientReports: async (params?: ReportFilterParams): Promise<PatientReportsResponse> => {
    const searchParams = new URLSearchParams()
    if (params?.startDate) searchParams.append('startDate', params.startDate)
    if (params?.endDate) searchParams.append('endDate', params.endDate)

    const queryStr = searchParams.toString()
    const url = `/api/v1/reports/patients${queryStr ? `?${queryStr}` : ''}`
    return await apiClient.get<PatientReportsResponse>(url)
  },

  getAppointmentReports: async (params?: ReportFilterParams): Promise<AppointmentReportsResponse> => {
    const searchParams = new URLSearchParams()
    if (params?.startDate) searchParams.append('startDate', params.startDate)
    if (params?.endDate) searchParams.append('endDate', params.endDate)

    const queryStr = searchParams.toString()
    const url = `/api/v1/reports/appointments${queryStr ? `?${queryStr}` : ''}`
    return await apiClient.get<AppointmentReportsResponse>(url)
  },

  getMedicalReports: async (params?: ReportFilterParams): Promise<MedicalReportsResponse> => {
    const searchParams = new URLSearchParams()
    if (params?.startDate) searchParams.append('startDate', params.startDate)
    if (params?.endDate) searchParams.append('endDate', params.endDate)

    const queryStr = searchParams.toString()
    const url = `/api/v1/reports/medical${queryStr ? `?${queryStr}` : ''}`
    return await apiClient.get<MedicalReportsResponse>(url)
  },

  getOperationalReports: async (params?: ReportFilterParams): Promise<OperationalReportsResponse> => {
    const searchParams = new URLSearchParams()
    if (params?.startDate) searchParams.append('startDate', params.startDate)
    if (params?.endDate) searchParams.append('endDate', params.endDate)

    const queryStr = searchParams.toString()
    const url = `/api/v1/reports/operations${queryStr ? `?${queryStr}` : ''}`
    return await apiClient.get<OperationalReportsResponse>(url)
  },

  getReportHistory: async (params?: ReportFilterParams): Promise<ReportHistoryResponse> => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.search) searchParams.append('search', params.search)
    if (params?.categoryId && params.categoryId !== 'ALL') searchParams.append('reportCategory', params.categoryId)
    if (params?.startDate) searchParams.append('startDate', params.startDate)
    if (params?.endDate) searchParams.append('endDate', params.endDate)
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy)
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder)

    const queryStr = searchParams.toString()
    const url = `/api/v1/reports/history${queryStr ? `?${queryStr}` : ''}`
    return await apiClient.get<ReportHistoryResponse>(url)
  },

  getReportHistoryById: async (id: string): Promise<SingleReportHistoryResponse> => {
    return await apiClient.get<SingleReportHistoryResponse>(`/api/v1/reports/history/${id}`)
  },

  exportReport: async (payload: ExportReportPayload): Promise<ExportReportResponse> => {
    return await apiClient.post<ExportReportResponse>('/api/v1/reports/export', payload)
  },
}
