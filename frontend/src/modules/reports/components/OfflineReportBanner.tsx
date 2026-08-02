// Offline Local Cache Alert Banner Component — ClinicOS

import React from 'react'
import { WifiOff } from 'lucide-react'

export interface OfflineReportBannerProps {
  isOffline: boolean
}

export const OfflineReportBanner: React.FC<OfflineReportBannerProps> = ({ isOffline }) => {
  if (!isOffline) return null

  return (
    <div className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 shadow-sm">
      <div className="flex items-center gap-2.5">
        <WifiOff className="h-4 w-4 shrink-0 text-amber-600" />
        <div>
          <span className="font-bold">Offline Analytical Mode:</span>
          <span className="ml-1">Reports and KPIs are computed from local SQLite database cache. Auto-sync will refresh data upon reconnection.</span>
        </div>
      </div>
    </div>
  )
}
