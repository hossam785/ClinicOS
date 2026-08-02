import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Check,
  Archive,
  RotateCcw,
  ExternalLink,
  ShieldAlert,
  Clock,
} from 'lucide-react'
import type { NotificationItem } from '../types/notification'
import { NotificationPriorityBadge } from './NotificationPriorityBadge'
import { NotificationCategoryBadge } from './NotificationCategoryBadge'

interface NotificationCardProps {
  notification: NotificationItem
  onInspect: (item: NotificationItem) => void
  onMarkRead: (id: string) => void
  onArchive: (id: string) => void
  onRestore: (id: string) => void
  onAcknowledge: (id: string) => void
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onInspect,
  onMarkRead,
  onArchive,
  onRestore,
  onAcknowledge,
}) => {
  const navigate = useNavigate()

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch {
      return dateStr
    }
  }

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
    } catch {
      return dateStr
    }
  }

  const handleNavigate = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!notification.isRead) {
      onMarkRead(notification.id)
    }
    if (notification.targetRoute) {
      navigate(notification.targetRoute)
    }
  }

  return (
    <div
      onClick={() => onInspect(notification)}
      className={`group relative flex flex-col md:flex-row md:items-center justify-between p-4 mb-3 rounded-lg border transition-all cursor-pointer ${
        notification.isArchived
          ? 'bg-slate-50 border-slate-200 opacity-75'
          : !notification.isRead
          ? 'bg-blue-50/40 border-blue-200 shadow-sm hover:border-blue-300'
          : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
      }`}
      style={{
        borderLeft: !notification.isRead
          ? '4px solid #2563EB'
          : notification.priority === 'CRITICAL' && !notification.isAcknowledged
          ? '4px solid #DC2626'
          : undefined,
      }}
    >
      {/* Left Metadata & Message */}
      <div className="flex-1 pr-4">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <NotificationPriorityBadge priority={notification.priority} />
          <NotificationCategoryBadge category={notification.category} />
          <span className="text-xs text-slate-400 font-mono">{notification.notificationNumber}</span>
          <span className="flex items-center gap-1 text-xs text-slate-500 ml-auto md:ml-2">
            <Clock className="w-3 h-3" />
            {formatDate(notification.createdAt)} at {formatTime(notification.createdAt)}
          </span>
        </div>

        <h4
          className={`text-sm mb-1 ${
            !notification.isRead ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'
          }`}
        >
          {notification.title}
        </h4>
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{notification.message}</p>
      </div>

      {/* Right Interactive Action Toolbar */}
      <div className="flex items-center gap-2 mt-3 md:mt-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
        {/* Critical Acknowledge Action */}
        {notification.priority === 'CRITICAL' && !notification.isAcknowledged && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onAcknowledge(notification.id)
            }}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            Acknowledge
          </button>
        )}

        {/* Deep Link Action */}
        {notification.targetRoute && (
          <button
            type="button"
            onClick={handleNavigate}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Open associated record"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            Open Record
          </button>
        )}

        {/* Mark Read */}
        {!notification.isRead && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onMarkRead(notification.id)
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors"
            title="Mark as read"
          >
            <Check className="w-3.5 h-3.5" />
            Mark Read
          </button>
        )}

        {/* Archive / Restore */}
        {notification.isArchived ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onRestore(notification.id)
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            title="Restore from archive"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Restore
          </button>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onArchive(notification.id)
            }}
            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Archive notification"
          >
            <Archive className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
