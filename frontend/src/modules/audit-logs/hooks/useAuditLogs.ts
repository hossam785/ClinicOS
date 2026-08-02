// Audit Logs Custom React Hook — ClinicOS

import { useState, useCallback, useEffect } from 'react'
import type {
  AuditLogRecord,
  AuditFilterParams,
  AuditStatisticsData,
  ExportAuditPayload,
  ExportAuditResult,
  PaginationMeta,
} from '../types/auditLogs'
import { auditLogsApi } from '../services/auditLogsApi'

export function useAuditLogs(initialFilters?: AuditFilterParams) {
  const [logs, setLogs] = useState<AuditLogRecord[]>([])
  const [selectedRecord, setSelectedRecord] = useState<AuditLogRecord | null>(null)
  const [recentEvents, setRecentEvents] = useState<AuditLogRecord[]>([])
  const [criticalEvents, setCriticalEvents] = useState<AuditLogRecord[]>([])
  const [statistics, setStatistics] = useState<AuditStatisticsData | null>(null)

  const [filters, setFilters] = useState<AuditFilterParams>({
    page: 1,
    limit: 20,
    module: 'ALL',
    severity: 'ALL',
    search: '',
    ...initialFilters,
  })

  const [pagination, setPagination] = useState<PaginationMeta>({
    totalItems: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 20,
    hasNextPage: false,
    hasPrevPage: false,
  })

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

  const fetchAuditLogs = useCallback(async (customFilters?: AuditFilterParams) => {
    setIsLoading(true)
    setError(null)
    try {
      const activeFilters = customFilters || filters
      const response = await auditLogsApi.getAuditLogs(activeFilters)
      setLogs(response.items)
      setPagination(response.pagination)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch audit log records.'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [filters])

  const inspectRecord = useCallback(async (id: string) => {
    setIsLoading(true)
    try {
      const record = await auditLogsApi.getAuditLogById(id)
      setSelectedRecord(record)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to inspect audit record.'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchRecentEvents = useCallback(async () => {
    try {
      const events = await auditLogsApi.getRecentAuditEvents()
      setRecentEvents(events)
    } catch {
      // Non-blocking background fetch
    }
  }, [])

  const fetchCriticalEvents = useCallback(async (limit = 10) => {
    try {
      const events = await auditLogsApi.getCriticalAuditEvents(limit)
      setCriticalEvents(events)
    } catch {
      // Non-blocking background fetch
    }
  }, [])

  const fetchStatistics = useCallback(async () => {
    setIsLoading(true)
    try {
      const stats = await auditLogsApi.getAuditStatistics()
      setStatistics(stats)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load audit statistics.'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const triggerExport = useCallback(async (payload: ExportAuditPayload): Promise<ExportAuditResult> => {
    setIsExporting(true)
    try {
      const result = await auditLogsApi.exportAuditLogs(payload)
      return result
    } finally {
      setIsExporting(false)
    }
  }, [])

  const clearSelectedRecord = useCallback(() => {
    setSelectedRecord(null)
  }, [])

  return {
    logs,
    selectedRecord,
    recentEvents,
    criticalEvents,
    statistics,
    filters,
    pagination,
    isLoading,
    isExporting,
    isOffline,
    error,
    setFilters,
    fetchAuditLogs,
    inspectRecord,
    fetchRecentEvents,
    fetchCriticalEvents,
    fetchStatistics,
    triggerExport,
    clearSelectedRecord,
  }
}
