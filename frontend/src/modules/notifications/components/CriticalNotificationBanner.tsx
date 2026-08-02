import React from 'react'
import { AlertCircle, ShieldAlert } from 'lucide-react'
import type { NotificationItem } from '../types/notification'

interface CriticalNotificationBannerProps {
  criticalNotification: NotificationItem | null
  onAcknowledge: (id: string) => void
}

export const CriticalNotificationBanner: React.FC<CriticalNotificationBannerProps> = ({
  criticalNotification,
  onAcknowledge,
}) => {
  if (!criticalNotification || criticalNotification.isAcknowledged) return null

  return (
    <div className="bg-red-600 text-white px-4 py-3 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-pulse">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-white shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-red-800 px-2 py-0.5 rounded text-red-100 mr-2">
            CRITICAL ALERT
          </span>
          <span className="text-sm font-bold">{criticalNotification.title}: </span>
          <span className="text-xs text-red-100">{criticalNotification.message}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onAcknowledge(criticalNotification.id)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-red-700 hover:bg-red-50 text-xs font-bold transition-colors shrink-0 shadow-xs"
      >
        <ShieldAlert className="w-4 h-4 text-red-700" />
        Acknowledge Alert
      </button>
    </div>
  )
}
