// Offline Audit Alert Banner Component — ClinicOS

import React from 'react'
import { Shield, RefreshCw } from 'lucide-react'

export interface OfflineAuditBannerProps {
  isOffline: boolean
  pendingSyncCount?: number
}

export const OfflineAuditBanner: React.FC<OfflineAuditBannerProps> = ({
  isOffline,
  pendingSyncCount = 0,
}) => {
  if (!isOffline && pendingSyncCount === 0) return null

  return (
    <div
      role="alert"
      className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <Shield className="h-5 w-5 shrink-0 text-amber-600" />
        <div>
          <span className="font-bold">
            {isOffline ? 'Desktop Operating Offline Mode:' : 'Pending Synchronization Queue:'}
          </span>{' '}
          Audit records are enqueued locally in SQLite with cryptographic HMAC SHA-256 signatures. Zero event loss.
        </div>
      </div>

      {pendingSyncCount > 0 && (
        <div className="flex items-center gap-1.5 font-bold text-amber-700">
          <RefreshCw className="h-4 w-4 animate-spin text-amber-600" />
          <span>{pendingSyncCount} Pending Sync</span>
        </div>
      )}
    </div>
  )
}
