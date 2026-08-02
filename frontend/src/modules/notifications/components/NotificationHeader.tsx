import React from 'react'
import { Link } from 'react-router-dom'
import { Search, CheckCheck, SlidersHorizontal, RefreshCw } from 'lucide-react'
import type { NotificationCategory, NotificationPriority } from '../types/notification'

interface NotificationHeaderProps {
  totalUnread: number
  search: string
  onSearchChange: (value: string) => void
  categoryFilter: NotificationCategory | 'ALL'
  onCategoryChange: (category: NotificationCategory | 'ALL') => void
  priorityFilter: NotificationPriority | 'ALL'
  onPriorityChange: (priority: NotificationPriority | 'ALL') => void
  onMarkAllRead: () => void
  onRefresh: () => void
}

export const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  totalUnread,
  search,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  priorityFilter,
  onPriorityChange,
  onMarkAllRead,
  onRefresh,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              Notifications Management
              {totalUnread > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                  {totalUnread} Unread
                </span>
              )}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Centralized platform alert hub and real-time operational notifications.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Refresh notifications"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onMarkAllRead}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Mark All Read
          </button>

          <Link
            to="/dashboard/notifications/preferences"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Preferences
          </Link>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-4">
        {/* Search Input */}
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notifications by title, message, code..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Category Filter */}
        <div>
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value as NotificationCategory | 'ALL')}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="ALL">All Categories</option>
            <option value="APPOINTMENT">Appointments</option>
            <option value="PATIENT">Patients</option>
            <option value="MEDICAL_RECORD">Medical Records</option>
            <option value="PRESCRIPTION">Prescriptions</option>
            <option value="FINANCIAL">Financials</option>
            <option value="SYSTEM">System</option>
            <option value="ADMINISTRATIVE">Administrative</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value as NotificationPriority | 'ALL')}
            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low Priority</option>
            <option value="NORMAL">Normal Priority</option>
            <option value="HIGH">High Priority</option>
            <option value="CRITICAL">Critical Priority</option>
          </select>
        </div>
      </div>
    </div>
  )
}
