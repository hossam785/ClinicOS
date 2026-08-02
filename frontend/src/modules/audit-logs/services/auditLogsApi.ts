// Audit Logs REST API Service — ClinicOS

import { apiClient } from '@/services/apiClient'
import type {
  AuditLogRecord,
  AuditFilterParams,
  AuditStatisticsData,
  ExportAuditPayload,
  ExportAuditResult,
  SyncAuditPayload,
  SyncAuditResult,
  PaginationMeta,
} from '../types/auditLogs'

export interface AuditLogsRosterResponse {
  success: boolean
  data: {
    items: AuditLogRecord[]
    pagination: PaginationMeta
  }
  meta?: { timestamp: string }
}

export interface AuditLogDetailsResponse {
  success: boolean
  data: AuditLogRecord
  meta?: { timestamp: string }
}

export interface RecentAuditEventsResponse {
  success: boolean
  data: {
    recentEvents: AuditLogRecord[]
  }
  meta?: { timestamp: string }
}

export interface CriticalAuditEventsResponse {
  success: boolean
  data: {
    criticalEvents: AuditLogRecord[]
  }
  meta?: { timestamp: string }
}

export interface AuditStatisticsResponse {
  success: boolean
  data: AuditStatisticsData
  meta?: { timestamp: string }
}

export interface ExportAuditResponse {
  success: boolean
  data: ExportAuditResult
  meta?: { timestamp: string }
}

export interface SyncAuditResponse {
  success: boolean
  data: SyncAuditResult
  meta?: { timestamp: string }
}

export const auditLogsApi = {
  getAuditLogs: async (
    params?: AuditFilterParams
  ): Promise<{ items: AuditLogRecord[]; pagination: PaginationMeta }> => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append('page', String(params.page))
    if (params?.limit) searchParams.append('limit', String(params.limit))
    if (params?.module && params.module !== 'ALL') searchParams.append('module', params.module)
    if (params?.severity && params.severity !== 'ALL') searchParams.append('severity', params.severity)
    if (params?.action) searchParams.append('action', params.action)
    if (params?.userId) searchParams.append('userId', params.userId)
    if (params?.entityType) searchParams.append('entityType', params.entityType)
    if (params?.entityId) searchParams.append('entityId', params.entityId)
    if (params?.startDate) searchParams.append('startDate', params.startDate)
    if (params?.endDate) searchParams.append('endDate', params.endDate)
    if (params?.search) searchParams.append('search', params.search)

    const queryStr = searchParams.toString()
    const url = `/api/v1/audit-logs${queryStr ? `?${queryStr}` : ''}`
    const res = await apiClient.get<AuditLogsRosterResponse>(url)
    return res.data
  },

  getAuditLogById: async (id: string): Promise<AuditLogRecord> => {
    const res = await apiClient.get<AuditLogDetailsResponse>(`/api/v1/audit-logs/${id}`)
    return res.data
  },

  getRecentAuditEvents: async (): Promise<AuditLogRecord[]> => {
    const res = await apiClient.get<RecentAuditEventsResponse>('/api/v1/audit-logs/recent')
    return res.data.recentEvents
  },

  getCriticalAuditEvents: async (limit = 10): Promise<AuditLogRecord[]> => {
    const res = await apiClient.get<CriticalAuditEventsResponse>(`/api/v1/audit-logs/critical?limit=${limit}`)
    return res.data.criticalEvents
  },

  getAuditStatistics: async (): Promise<AuditStatisticsData> => {
    const res = await apiClient.get<AuditStatisticsResponse>('/api/v1/audit-logs/statistics')
    return res.data
  },

  exportAuditLogs: async (payload: ExportAuditPayload): Promise<ExportAuditResult> => {
    const res = await apiClient.post<ExportAuditResponse>('/api/v1/audit-logs/export', payload)
    return res.data
  },

  syncAuditLogs: async (payload: SyncAuditPayload): Promise<SyncAuditResult> => {
    const res = await apiClient.post<SyncAuditResponse>('/api/v1/audit-logs/sync', payload)
    return res.data
  },
}
