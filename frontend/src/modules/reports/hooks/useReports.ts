// Reports & Analytics Custom React Hook — ClinicOS

import { useState, useCallback, useEffect } from 'react'
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
  ReportCategory,
} from '../types/reports'
import { reportsApi } from '../services/reportsApi'

export interface UseReportsReturn {
  kpis: DashboardKpiData | null
  charts: ChartDataset | null
  financialData: FinancialReportData | null
  doctorsData: DoctorPerformanceItem[]
  patientData: PatientAnalyticsData | null
  appointmentData: AppointmentAnalyticsData | null
  medicalData: MedicalAnalyticsData | null
  operationalData: OperationalAnalyticsData | null
  historyItems: ReportSnapshotItem[]
  selectedSnapshot: ReportSnapshotItem | null
  pagination: PaginationMeta
  filters: ReportFilterParams
  activeCategory: ReportCategory | 'ALL'
  isLoading: boolean
  isExporting: boolean
  error: string | null
  isOffline: boolean
  setFilters: React.Dispatch<React.SetStateAction<ReportFilterParams>>
  setActiveCategory: (category: ReportCategory | 'ALL') => void
  fetchDashboardKpis: (clinicId?: string) => Promise<void>
  fetchDashboardCharts: (metric?: 'REVENUE' | 'APPOINTMENTS' | 'PATIENTS' | 'EXPENSES', interval?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUAL') => Promise<void>
  fetchFinancialReport: () => Promise<void>
  fetchDoctorReports: () => Promise<void>
  fetchPatientReports: () => Promise<void>
  fetchAppointmentReports: () => Promise<void>
  fetchMedicalReports: () => Promise<void>
  fetchOperationalReports: () => Promise<void>
  fetchHistory: () => Promise<void>
  inspectHistorySnapshot: (id: string) => Promise<void>
  clearSelectedSnapshot: () => void
  triggerExport: (payload: ExportReportPayload) => Promise<boolean>
  refreshActiveView: () => Promise<void>
}

export function useReports(initialCategory: ReportCategory | 'ALL' = 'ALL'): UseReportsReturn {
  const [kpis, setKpis] = useState<DashboardKpiData | null>(null)
  const [charts, setCharts] = useState<ChartDataset | null>(null)
  const [financialData, setFinancialData] = useState<FinancialReportData | null>(null)
  const [doctorsData, setDoctorsData] = useState<DoctorPerformanceItem[]>([])
  const [patientData, setPatientData] = useState<PatientAnalyticsData | null>(null)
  const [appointmentData, setAppointmentData] = useState<AppointmentAnalyticsData | null>(null)
  const [medicalData, setMedicalData] = useState<MedicalAnalyticsData | null>(null)
  const [operationalData, setOperationalData] = useState<OperationalAnalyticsData | null>(null)
  const [historyItems, setHistoryItems] = useState<ReportSnapshotItem[]>([])
  const [selectedSnapshot, setSelectedSnapshot] = useState<ReportSnapshotItem | null>(null)

  const [pagination, setPagination] = useState<PaginationMeta>({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 20,
    hasNextPage: false,
    hasPrevPage: false,
  })

  const [filters, setFilters] = useState<ReportFilterParams>({
    page: 1,
    limit: 20,
    doctorId: 'ALL',
    categoryId: 'ALL',
  })

  const [activeCategory, setActiveCategory] = useState<ReportCategory | 'ALL'>(initialCategory)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isExporting, setIsExporting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const fetchDashboardKpis = useCallback(async (clinicId?: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await reportsApi.getDashboardKpis(clinicId)
      if (res.success && res.data) {
        setKpis(res.data)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch dashboard KPIs'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchDashboardCharts = useCallback(
    async (
      metric: 'REVENUE' | 'APPOINTMENTS' | 'PATIENTS' | 'EXPENSES' = 'REVENUE',
      interval: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ANNUAL' = 'MONTHLY'
    ) => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await reportsApi.getDashboardCharts({
          metric,
          interval,
          startDate: filters.startDate,
          endDate: filters.endDate,
        })
        if (res.success && res.data) {
          setCharts(res.data)
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to fetch dashboard charts'
        setError(message)
      } finally {
        setIsLoading(false)
      }
    },
    [filters.startDate, filters.endDate]
  )

  const fetchFinancialReport = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await reportsApi.getFinancialReport(filters)
      if (res.success && res.data) {
        setFinancialData(res.data)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch financial report'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  const fetchDoctorReports = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await reportsApi.getDoctorReports(filters)
      if (res.success && res.data?.doctors) {
        setDoctorsData(res.data.doctors)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch doctor reports'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  const fetchPatientReports = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await reportsApi.getPatientReports(filters)
      if (res.success && res.data) {
        setPatientData(res.data)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch patient reports'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  const fetchAppointmentReports = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await reportsApi.getAppointmentReports(filters)
      if (res.success && res.data) {
        setAppointmentData(res.data)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch appointment reports'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  const fetchMedicalReports = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await reportsApi.getMedicalReports(filters)
      if (res.success && res.data) {
        setMedicalData(res.data)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch medical reports'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  const fetchOperationalReports = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await reportsApi.getOperationalReports(filters)
      if (res.success && res.data) {
        setOperationalData(res.data)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch operational reports'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  const fetchHistory = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await reportsApi.getReportHistory({
        ...filters,
        categoryId: activeCategory !== 'ALL' ? activeCategory : filters.categoryId,
      })
      if (res.success && res.data) {
        setHistoryItems(res.data.items)
        setPagination(res.data.pagination)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch report history'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [filters, activeCategory])

  const inspectHistorySnapshot = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await reportsApi.getReportHistoryById(id)
      if (res.success && res.data) {
        setSelectedSnapshot(res.data)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to inspect report snapshot'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const clearSelectedSnapshot = useCallback(() => {
    setSelectedSnapshot(null)
  }, [])

  const triggerExport = useCallback(async (payload: ExportReportPayload): Promise<boolean> => {
    setIsExporting(true)
    setError(null)
    try {
      const res = await reportsApi.exportReport(payload)
      if (res.success) {
        return true
      }
      return false
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to export report'
      setError(message)
      return false
    } finally {
      setIsExporting(false)
    }
  }, [])

  const refreshActiveView = useCallback(async () => {
    await fetchDashboardKpis()
    await fetchDashboardCharts()
  }, [fetchDashboardKpis, fetchDashboardCharts])

  return {
    kpis,
    charts,
    financialData,
    doctorsData,
    patientData,
    appointmentData,
    medicalData,
    operationalData,
    historyItems,
    selectedSnapshot,
    pagination,
    filters,
    activeCategory,
    isLoading,
    isExporting,
    error,
    isOffline,
    setFilters,
    setActiveCategory,
    fetchDashboardKpis,
    fetchDashboardCharts,
    fetchFinancialReport,
    fetchDoctorReports,
    fetchPatientReports,
    fetchAppointmentReports,
    fetchMedicalReports,
    fetchOperationalReports,
    fetchHistory,
    inspectHistorySnapshot,
    clearSelectedSnapshot,
    triggerExport,
    refreshActiveView,
  }
}
