// Global Synchronization Indicator Badge Component — Module-018

import type { ISyncStatusSummary } from '../types/syncEngine.types'
import { CheckCircle2, RefreshCw, WifiOff, AlertTriangle, AlertCircle } from 'lucide-react'

interface GlobalSyncIndicatorProps {
  status: ISyncStatusSummary | null
  onClick?: () => void
}

export function GlobalSyncIndicator({ status, onClick }: GlobalSyncIndicatorProps) {
  if (!status) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs animate-pulse">
        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
        <span>Initializing Sync...</span>
      </div>
    )
  }

  let badgeStyle = 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
  let Icon = CheckCircle2
  let label = 'Synced'

  if (status.syncState === 'OFFLINE' || status.isOffline) {
    badgeStyle = 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
    Icon = WifiOff
    label = 'Offline Mode'
  } else if (status.syncState === 'SYNCHRONIZING') {
    badgeStyle = 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800'
    Icon = RefreshCw
    label = `Syncing (${status.pendingQueueCount})...`
  } else if (status.conflictCount > 0) {
    badgeStyle = 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
    Icon = AlertTriangle
    label = `${status.conflictCount} Conflict`
  } else if (status.syncState === 'ERROR' || status.failedQueueCount > 0) {
    badgeStyle = 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800'
    Icon = AlertCircle
    label = 'Sync Error'
  }

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer shadow-xs hover:shadow-md ${badgeStyle}`}
      title="Click to open Synchronization Center Workspace (Shortcut: Ctrl + Shift + S)"
    >
      <Icon className={`w-3.5 h-3.5 ${status.syncState === 'SYNCHRONIZING' ? 'animate-spin' : ''}`} />
      <span>{label}</span>
    </button>
  )
}
