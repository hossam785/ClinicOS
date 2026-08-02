import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, CheckCheck, ExternalLink, Inbox } from 'lucide-react'
import type { NotificationItem, NotificationUnreadCount } from '../types/notification'
import { NotificationPriorityBadge } from './NotificationPriorityBadge'

interface HeaderNotificationBellProps {
  unreadCount: NotificationUnreadCount
  recentNotifications: NotificationItem[]
  onMarkRead: (id: string) => void
  onMarkAllRead: () => void
}

export const HeaderNotificationBell: React.FC<HeaderNotificationBellProps> = ({
  unreadCount,
  recentNotifications,
  onMarkRead,
  onMarkAllRead,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const hasHighOrCritical =
    (unreadCount.highPriorityUnread || 0) > 0 || (unreadCount.criticalUnacknowledged || 0) > 0

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={`Notifications - ${unreadCount.totalUnread} unread`}
        title="Notifications"
      >
        <Bell className={`w-5 h-5 ${hasHighOrCritical ? 'text-amber-600 animate-pulse' : ''}`} />

        {unreadCount.totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow-xs">
            {unreadCount.totalUnread > 99 ? '99+' : unreadCount.totalUnread}
          </span>
        )}
      </button>

      {/* Flyout Dropdown Drawer */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-scale-up">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Recent Notifications
              </h4>
              {unreadCount.totalUnread > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-700">
                  {unreadCount.totalUnread} Unread
                </span>
              )}
            </div>
            {unreadCount.totalUnread > 0 && (
              <button
                type="button"
                onClick={() => {
                  onMarkAllRead()
                }}
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark All Read
              </button>
            )}
          </div>

          {/* Roster Items */}
          <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {recentNotifications.length === 0 ? (
              <div className="p-6 text-center text-slate-400">
                <Inbox className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-xs">No unread notifications.</p>
              </div>
            ) : (
              recentNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setIsOpen(false)
                    if (!item.isRead) onMarkRead(item.id)
                    if (item.targetRoute) navigate(item.targetRoute)
                    else navigate('/dashboard/notifications')
                  }}
                  className="p-3 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <NotificationPriorityBadge priority={item.priority} />
                    <span className="text-[10px] text-slate-400">
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h5 className="text-xs font-semibold text-slate-900 mb-0.5">{item.title}</h5>
                  <p className="text-xs text-slate-600 line-clamp-2">{item.message}</p>
                </div>
              ))
            )}
          </div>

          {/* Footer Link */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
            <Link
              to="/dashboard/notifications"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              View Notification Center
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
