import { useState, useEffect, useCallback } from 'react'
import { notificationApi } from '../services/notificationApi'
import type {
  NotificationItem,
  NotificationPreferences,
  NotificationUnreadCount,
  NotificationListParams,
  NotificationCategory,
  NotificationPriority,
  ReadStatus,
} from '../types/notification'

export type NotificationTab = 'all' | 'unread' | 'read' | 'archived'

export function useNotifications(autoRefreshIntervalMs = 30000) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [recentNotifications, setRecentNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState<NotificationUnreadCount>({
    totalUnread: 0,
    highPriorityUnread: 0,
    criticalUnacknowledged: 0,
    byCategory: {},
  })
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null)

  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Filters & State
  const [activeTab, setActiveTab] = useState<NotificationTab>('all')
  const [search, setSearch] = useState<string>('')
  const [categoryFilter, setCategoryFilter] = useState<NotificationCategory | 'ALL'>('ALL')
  const [priorityFilter, setPriorityFilter] = useState<NotificationPriority | 'ALL'>('ALL')
  const [page, setPage] = useState<number>(1)
  const [limit] = useState<number>(20)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [totalItems, setTotalItems] = useState<number>(0)

  // Selected item inspector details drawer
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false)

  // Toast stack
  const [activeToasts, setActiveToasts] = useState<NotificationItem[]>([])

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await notificationApi.getUnreadCount()
      if (response.success && response.data) {
        setUnreadCount(response.data)
      }
    } catch (err: unknown) {
      console.error('Failed to fetch unread notification count:', err)
    }
  }, [])

  const fetchRecent = useCallback(async () => {
    try {
      const response = await notificationApi.getRecentNotifications()
      if (response.success && response.data) {
        setRecentNotifications(response.data.recent || [])
      }
    } catch (err: unknown) {
      console.error('Failed to fetch recent notifications:', err)
    }
  }, [])

  const fetchList = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let isArchived = false
      let readStatus: ReadStatus | 'ALL' = 'ALL'

      if (activeTab === 'unread') {
        readStatus = 'UNREAD'
        isArchived = false
      } else if (activeTab === 'read') {
        readStatus = 'READ'
        isArchived = false
      } else if (activeTab === 'archived') {
        isArchived = true
        readStatus = 'ALL'
      } else {
        isArchived = false
        readStatus = 'ALL'
      }

      const params: NotificationListParams = {
        page,
        limit,
        search: search.trim() || undefined,
        category: categoryFilter,
        priority: priorityFilter,
        readStatus,
        archived: isArchived,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }

      const response = await notificationApi.getNotifications(params)
      if (response.success && response.data) {
        setNotifications(response.data.items || [])
        setTotalPages(response.data.pagination.totalPages || 1)
        setTotalItems(response.data.pagination.totalItems || 0)
      }
    } catch (err: unknown) {
      console.error('Failed to fetch notifications list:', err)
      const msg = err instanceof Error ? err.message : 'Failed to load notifications list.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }, [activeTab, search, categoryFilter, priorityFilter, page, limit])

  const fetchPreferences = useCallback(async () => {
    try {
      const response = await notificationApi.getPreferences()
      if (response.success && response.data) {
        setPreferences(response.data)
      }
    } catch (err: unknown) {
      console.error('Failed to fetch notification preferences:', err)
    }
  }, [])

  // Initial load
  useEffect(() => {
    fetchList()
    fetchUnreadCount()
    fetchRecent()
    fetchPreferences()
  }, [fetchList, fetchUnreadCount, fetchRecent, fetchPreferences])

  // Polling auto-refresh
  useEffect(() => {
    if (!autoRefreshIntervalMs || autoRefreshIntervalMs <= 0) return
    const interval = setInterval(() => {
      fetchUnreadCount()
      fetchRecent()
    }, autoRefreshIntervalMs)
    return () => clearInterval(interval)
  }, [autoRefreshIntervalMs, fetchUnreadCount, fetchRecent])

  // Mark single as read
  const markAsRead = async (id: string) => {
    try {
      await notificationApi.markAsRead(id)
      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isRead: true, readStatus: 'READ' as const } : item))
      )
      setRecentNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isRead: true, readStatus: 'READ' as const } : item))
      )
      fetchUnreadCount()
    } catch (err: unknown) {
      console.error('Failed to mark notification as read:', err)
    }
  }

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead()
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true, readStatus: 'READ' as const })))
      setRecentNotifications((prev) => prev.map((item) => ({ ...item, isRead: true, readStatus: 'READ' as const })))
      fetchUnreadCount()
      fetchList()
    } catch (err: unknown) {
      console.error('Failed to mark all notifications as read:', err)
    }
  }

  // Acknowledge critical
  const acknowledgeCritical = async (id: string, notes?: string) => {
    try {
      await notificationApi.acknowledgeCritical(id, notes)
      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isAcknowledged: true, isRead: true } : item))
      )
      fetchUnreadCount()
      fetchList()
    } catch (err: unknown) {
      console.error('Failed to acknowledge critical notification:', err)
    }
  }

  // Archive
  const archiveNotification = async (id: string) => {
    try {
      await notificationApi.archiveNotification(id)
      setNotifications((prev) => prev.filter((item) => item.id !== id))
      fetchUnreadCount()
      fetchList()
    } catch (err: unknown) {
      console.error('Failed to archive notification:', err)
    }
  }

  // Restore
  const restoreNotification = async (id: string) => {
    try {
      await notificationApi.restoreNotification(id)
      setNotifications((prev) => prev.filter((item) => item.id !== id))
      fetchUnreadCount()
      fetchList()
    } catch (err: unknown) {
      console.error('Failed to restore notification:', err)
    }
  }

  // Inspect details
  const inspectNotification = (item: NotificationItem) => {
    setSelectedNotification(item)
    setIsDetailsOpen(true)
    if (!item.isRead) {
      markAsRead(item.id)
    }
  }

  const closeDetails = () => {
    setIsDetailsOpen(false)
    setSelectedNotification(null)
  }

  // Dismiss toast
  const dismissToast = (id: string) => {
    setActiveToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return {
    notifications,
    recentNotifications,
    unreadCount,
    preferences,
    loading,
    error,
    activeTab,
    setActiveTab,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    priorityFilter,
    setPriorityFilter,
    page,
    setPage,
    totalPages,
    totalItems,
    selectedNotification,
    isDetailsOpen,
    activeToasts,
    inspectNotification,
    closeDetails,
    markAsRead,
    markAllAsRead,
    acknowledgeCritical,
    archiveNotification,
    restoreNotification,
    dismissToast,
    refreshList: fetchList,
    refreshUnread: fetchUnreadCount,
  }
}
