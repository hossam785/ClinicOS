import React from 'react'
import { BellOff, Search, Archive, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNotifications } from '../hooks/useNotifications'
import { NotificationHeader } from '../components/NotificationHeader'
import { NotificationCard } from '../components/NotificationCard'
import { NotificationDetailsModal } from '../components/NotificationDetailsModal'
import { CriticalNotificationBanner } from '../components/CriticalNotificationBanner'
import Loader from '@/design-system/components/Loader'

export const NotificationCenterView: React.FC = () => {
  const {
    notifications,
    unreadCount,
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
    inspectNotification,
    closeDetails,
    markAsRead,
    markAllAsRead,
    acknowledgeCritical,
    archiveNotification,
    restoreNotification,
    refreshList,
  } = useNotifications()

  // Find first unacknowledged critical alert for top banner
  const criticalUnacknowledgedItem = notifications.find(
    (item) => item.priority === 'CRITICAL' && !item.isAcknowledged
  ) || null

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <NotificationHeader
        totalUnread={unreadCount.totalUnread}
        search={search}
        onSearchChange={setSearch}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        onMarkAllRead={markAllAsRead}
        onRefresh={refreshList}
      />

      {/* Critical Alert Pinned Banner */}
      <CriticalNotificationBanner
        criticalNotification={criticalUnacknowledgedItem}
        onAcknowledge={acknowledgeCritical}
      />

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => {
            setActiveTab('all')
            setPage(1)
          }}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          All Notifications
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('unread')
            setPage(1)
          }}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === 'unread'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          Unread
          {unreadCount.totalUnread > 0 && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'unread' ? 'bg-blue-800 text-blue-100' : 'bg-blue-100 text-blue-700'
              }`}
            >
              {unreadCount.totalUnread}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('read')
            setPage(1)
          }}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'read'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          Read
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('archived')
            setPage(1)
          }}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === 'archived'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          Archived
        </button>
      </div>

      {/* Main Roster List / Skeletons / Empty States */}
      {loading ? (
        <div className="py-12 text-center">
          <Loader size="medium" />
          <p className="text-xs text-slate-500 mt-2">Loading notifications inbox...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 rounded-xl border border-red-200 text-center">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-red-900 mb-1">Failed to load notifications</h3>
          <p className="text-xs text-red-700 mb-3">{error}</p>
          <button
            type="button"
            onClick={refreshList}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Retry Loading
          </button>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
          {search ? (
            <div>
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800 mb-1">No matching notifications found</h3>
              <p className="text-xs text-slate-500 mb-4">
                No notifications matched your search query "{search}".
              </p>
              <button
                type="button"
                onClick={() => setSearch('')}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                Clear Search
              </button>
            </div>
          ) : activeTab === 'archived' ? (
            <div>
              <Archive className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800 mb-1">No archived notifications</h3>
              <p className="text-xs text-slate-500">Archived items will appear here.</p>
            </div>
          ) : (
            <div>
              <BellOff className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800 mb-1">You're all caught up!</h3>
              <p className="text-xs text-slate-500">No active notifications in this view.</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="space-y-3">
            {notifications.map((item) => (
              <NotificationCard
                key={item.id}
                notification={item}
                onInspect={inspectNotification}
                onMarkRead={markAsRead}
                onArchive={archiveNotification}
                onRestore={restoreNotification}
                onAcknowledge={acknowledgeCritical}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-200 text-xs text-slate-500">
            <span>
              Showing Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalItems} total items)
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Inspector Modal */}
      <NotificationDetailsModal
        notification={selectedNotification}
        isOpen={isDetailsOpen}
        onClose={closeDetails}
        onMarkRead={markAsRead}
        onArchive={archiveNotification}
        onRestore={restoreNotification}
        onAcknowledge={acknowledgeCritical}
      />
    </div>
  )
}
