import React, { useEffect } from 'react'
import { X, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { NotificationItem } from '../types/notification'
import { NotificationPriorityBadge } from './NotificationPriorityBadge'

interface DesktopToastContainerProps {
  toasts: NotificationItem[]
  onDismiss: (id: string) => void
  onMarkRead: (id: string) => void
}

export const DesktopToastContainer: React.FC<DesktopToastContainerProps> = ({
  toasts,
  onDismiss,
  onMarkRead,
}) => {
  const navigate = useNavigate()

  // Limit to max 3 visible toasts
  const visibleToasts = toasts.slice(0, 3)

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {visibleToasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={onDismiss}
          onMarkRead={onMarkRead}
          onNavigate={(route) => navigate(route)}
        />
      ))}
    </div>
  )
}

interface ToastItemProps {
  toast: NotificationItem
  onDismiss: (id: string) => void
  onMarkRead: (id: string) => void
  onNavigate: (route: string) => void
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss, onMarkRead, onNavigate }) => {
  useEffect(() => {
    // Auto dismiss logic
    let timer: ReturnType<typeof setTimeout> | null = null
    if (toast.priority === 'LOW' || toast.priority === 'NORMAL') {
      timer = setTimeout(() => onDismiss(toast.id), 5000)
    } else if (toast.priority === 'HIGH') {
      timer = setTimeout(() => onDismiss(toast.id), 10000)
    }
    // CRITICAL does not auto-dismiss

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [toast, onDismiss])

  return (
    <div
      className={`pointer-events-auto p-4 rounded-xl border shadow-xl transition-all duration-300 animate-slide-up ${
        toast.priority === 'CRITICAL'
          ? 'bg-red-950 text-white border-red-800'
          : toast.priority === 'HIGH'
          ? 'bg-amber-950 text-white border-amber-800'
          : 'bg-slate-900 text-white border-slate-800'
      }`}
      role="alert"
    >
      <div className="flex items-start justify-between gap-3 mb-1">
        <NotificationPriorityBadge priority={toast.priority} />
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          className="text-slate-400 hover:text-white transition-colors"
          aria-label="Dismiss toast"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <h5 className="text-xs font-bold text-white mb-1">{toast.title}</h5>
      <p className="text-xs text-slate-300 leading-relaxed mb-2">{toast.message}</p>

      {toast.targetRoute && (
        <button
          type="button"
          onClick={() => {
            onMarkRead(toast.id)
            onDismiss(toast.id)
            onNavigate(toast.targetRoute)
          }}
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
        >
          Open Record
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}
