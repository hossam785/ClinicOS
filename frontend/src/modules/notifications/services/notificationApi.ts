import { apiClient } from '@/services/apiClient'
import type {
  NotificationItem,
  NotificationPreferences,
  NotificationUnreadCount,
  NotificationListParams,
} from '../types/notification'

export interface NotificationSingleResponse {
  success: boolean
  data: NotificationItem
  meta?: { timestamp: string }
}

export interface NotificationListResponse {
  success: boolean
  data: {
    items: NotificationItem[]
    pagination: {
      totalItems: number
      totalPages: number
      currentPage: number
      limit: number
      hasNextPage: boolean
      hasPrevPage: boolean
    }
  }
  meta?: { timestamp: string }
}

export interface NotificationUnreadCountResponse {
  success: boolean
  data: NotificationUnreadCount
  meta?: { timestamp: string }
}

export interface NotificationRecentResponse {
  success: boolean
  data: {
    recent: NotificationItem[]
    totalUnread: number
  }
  meta?: { timestamp: string }
}

export interface NotificationPreferencesResponse {
  success: boolean
  data: NotificationPreferences
  meta?: { timestamp: string }
}

export interface NotificationSyncResponse {
  success: boolean
  data: {
    processedCount: number
    duplicateCount: number
    syncedIds: string[]
    ignoredDuplicateRequestIds: string[]
  }
  meta?: { timestamp: string }
}

export const notificationApi = {
  getNotifications: async (params?: NotificationListParams): Promise<NotificationListResponse> => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.search) searchParams.append('search', params.search)
    if (params?.category && params.category !== 'ALL') searchParams.append('category', params.category)
    if (params?.priority && params.priority !== 'ALL') searchParams.append('priority', params.priority)
    if (params?.readStatus && params.readStatus !== 'ALL') searchParams.append('readStatus', params.readStatus)
    if (params?.archived !== undefined) searchParams.append('archived', params.archived.toString())
    if (params?.startDate) searchParams.append('startDate', params.startDate)
    if (params?.endDate) searchParams.append('endDate', params.endDate)
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy)
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder)

    const queryStr = searchParams.toString()
    const url = `/api/v1/notifications${queryStr ? `?${queryStr}` : ''}`
    return await apiClient.get<NotificationListResponse>(url)
  },

  getRecentNotifications: async (): Promise<NotificationRecentResponse> => {
    return await apiClient.get<NotificationRecentResponse>('/api/v1/notifications/recent')
  },

  getUnreadCount: async (): Promise<NotificationUnreadCountResponse> => {
    return await apiClient.get<NotificationUnreadCountResponse>('/api/v1/notifications/unread-count')
  },

  getNotificationById: async (id: string): Promise<NotificationSingleResponse> => {
    return await apiClient.get<NotificationSingleResponse>(`/api/v1/notifications/${id}`)
  },

  markAsRead: async (id: string): Promise<NotificationSingleResponse> => {
    return await apiClient.patch<NotificationSingleResponse>(`/api/v1/notifications/${id}/read`, {})
  },

  markAllAsRead: async (): Promise<{ success: boolean; data: { markedCount: number; readAt: string } }> => {
    return await apiClient.patch<{ success: boolean; data: { markedCount: number; readAt: string } }>(
      '/api/v1/notifications/read-all',
      {}
    )
  },

  acknowledgeCritical: async (id: string, notes?: string): Promise<NotificationSingleResponse> => {
    return await apiClient.patch<NotificationSingleResponse>(`/api/v1/notifications/${id}/acknowledge`, { notes })
  },

  archiveNotification: async (id: string): Promise<NotificationSingleResponse> => {
    return await apiClient.patch<NotificationSingleResponse>(`/api/v1/notifications/${id}/archive`, {})
  },

  restoreNotification: async (id: string): Promise<NotificationSingleResponse> => {
    return await apiClient.patch<NotificationSingleResponse>(`/api/v1/notifications/${id}/restore`, {})
  },

  getPreferences: async (): Promise<NotificationPreferencesResponse> => {
    return await apiClient.get<NotificationPreferencesResponse>('/api/v1/notification-preferences')
  },

  updatePreferences: async (
    preferences: Partial<NotificationPreferences>
  ): Promise<NotificationPreferencesResponse> => {
    return await apiClient.put<NotificationPreferencesResponse>('/api/v1/notification-preferences', preferences)
  },

  syncOfflineQueue: async (queuedNotifications: Record<string, unknown>[]): Promise<NotificationSyncResponse> => {
    return await apiClient.post<NotificationSyncResponse>('/api/v1/notifications/sync', { queuedNotifications })
  },
}
