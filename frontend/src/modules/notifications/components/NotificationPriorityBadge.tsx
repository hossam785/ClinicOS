import React from 'react'
import { Info, Bell, AlertTriangle, AlertCircle } from 'lucide-react'
import type { NotificationPriority } from '../types/notification'

interface NotificationPriorityBadgeProps {
  priority: NotificationPriority
  className?: string
}

export const NotificationPriorityBadge: React.FC<NotificationPriorityBadgeProps> = ({ priority, className = '' }) => {
  switch (priority) {
    case 'LOW':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 ${className}`}
        >
          <Info className="w-3.5 h-3.5 text-slate-500" />
          Low
        </span>
      )
    case 'NORMAL':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 ${className}`}
        >
          <Bell className="w-3.5 h-3.5 text-blue-600" />
          Normal
        </span>
      )
    case 'HIGH':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-300 ${className}`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          High
        </span>
      )
    case 'CRITICAL':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-300 animate-pulse ${className}`}
        >
          <AlertCircle className="w-3.5 h-3.5 text-red-600" />
          Critical
        </span>
      )
    default:
      return null
  }
}
