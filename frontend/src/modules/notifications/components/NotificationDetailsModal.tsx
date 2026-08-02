import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  X,
  ExternalLink,
  Check,
  Archive,
  RotateCcw,
  ShieldAlert,
  Clock,
  Server,
} from 'lucide-react'
import type { NotificationItem } from '../types/notification'
import { NotificationPriorityBadge } from './NotificationPriorityBadge'
import { NotificationCategoryBadge } from './NotificationCategoryBadge'

interface NotificationDetailsModalProps {
  notification: NotificationItem | null
  isOpen: boolean
  onClose: () => void
  onMarkRead: (id: string) => void
  onArchive: (id: string) => void
  onRestore: (id: string) => void
  onAcknowledge: (id: string) => void
}

export const NotificationDetailsModal: React.FC<NotificationDetailsModalProps> = ({
  notification,
  isOpen,
  onClose,
  onMarkRead,
  onArchive,
  onRestore,
  onAcknowledge,
}) => {
  const navigate = useNavigate()

  if (!isOpen || !notification) return null

  const handleOpenRecord = () => {
    onClose()
    if (notification.targetRoute) {
      navigate(notification.targetRoute)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-fade-in">
      <div
        className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <NotificationPriorityBadge priority={notification.priority} />
            <NotificationCategoryBadge category={notification.category} />
            <span className="text-xs text-slate-400 font-mono">{notification.notificationNumber}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div>
            <h3 id="notification-modal-title" className="text-lg font-semibold text-slate-900 mb-2">
              {notification.title}
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
              {notification.message}
            </p>
          </div>

          {/* System & Source Metadata */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <span className="text-slate-400 block mb-0.5">Source Module</span>
              <span className="font-medium text-slate-800 flex items-center gap-1">
                <Server className="w-3.5 h-3.5 text-slate-500" />
                {notification.sourceModule}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Source Entity</span>
              <span className="font-medium text-slate-800 font-mono">
                {notification.sourceEntity} ({notification.sourceEntityId})
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Received At</span>
              <span className="font-medium text-slate-800 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {new Date(notification.createdAt).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Status</span>
              <span className="font-medium text-slate-800">
                {notification.isRead ? 'Read' : 'Unread'} {notification.isArchived ? '(Archived)' : ''}
              </span>
            </div>
          </div>

          {/* Context Dynamic Metadata */}
          {notification.metadata && Object.keys(notification.metadata).length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Contextual Data
              </h4>
              <div className="bg-slate-50 rounded-lg border border-slate-200 divide-y divide-slate-100 text-xs">
                {Object.entries(notification.metadata).map(([key, value]) => (
                  <div key={key} className="flex justify-between px-3 py-2">
                    <span className="text-slate-500 font-mono">{key}</span>
                    <span className="font-medium text-slate-800">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-2">
            {notification.priority === 'CRITICAL' && !notification.isAcknowledged && (
              <button
                type="button"
                onClick={() => {
                  onAcknowledge(notification.id)
                  onClose()
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors"
              >
                <ShieldAlert className="w-4 h-4" />
                Acknowledge Alert
              </button>
            )}

            {!notification.isRead && (
              <button
                type="button"
                onClick={() => onMarkRead(notification.id)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
              >
                <Check className="w-4 h-4" />
                Mark Read
              </button>
            )}

            {notification.isArchived ? (
              <button
                type="button"
                onClick={() => {
                  onRestore(notification.id)
                  onClose()
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Restore
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onArchive(notification.id)
                  onClose()
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <Archive className="w-4 h-4" />
                Archive
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {notification.targetRoute && (
              <button
                type="button"
                onClick={handleOpenRecord}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Open Associated Record
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
