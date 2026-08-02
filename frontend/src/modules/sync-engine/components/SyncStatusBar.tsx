// Sync Status Bar Summary Cards Component — Module-018

import type { ISyncStatusSummary } from '../types/syncEngine.types'
import { HardDrive, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react'

interface SyncStatusBarProps {
  status: ISyncStatusSummary | null
}

export function SyncStatusBar({ status }: SyncStatusBarProps) {
  if (!status) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
      {/* Connection & Auth Card */}
      <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs flex items-center justify-between">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Network & Security
          </div>
          <div className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${status.isOffline ? 'bg-slate-400' : 'bg-emerald-500'}`} />
            {status.isOffline ? 'Offline Autonomy' : 'Online & Authenticated'}
          </div>
          <div className="text-slate-500 text-[11px] mt-0.5 font-mono">{status.deviceId}</div>
        </div>
        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
          <ShieldCheck className="w-5 h-5" />
        </div>
      </div>

      {/* Queue Health Card */}
      <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs flex items-center justify-between">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Pending Queue
          </div>
          <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
            {status.pendingQueueCount} Pending Mutations
          </div>
          <div className="text-slate-500 text-[11px] mt-0.5">
            {status.failedQueueCount > 0 ? `${status.failedQueueCount} failed items` : '100% Queue Optimal'}
          </div>
        </div>
        <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
          <RefreshCw className="w-5 h-5" />
        </div>
      </div>

      {/* Conflict Monitor Card */}
      <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs flex items-center justify-between">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Conflict Monitor
          </div>
          <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
            {status.conflictCount} Conflicts
          </div>
          <div className="text-slate-500 text-[11px] mt-0.5">Policy: Desktop Wins</div>
        </div>
        <div className="p-2 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
          <AlertTriangle className="w-5 h-5" />
        </div>
      </div>

      {/* Last Sync Execution Card */}
      <div className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs flex items-center justify-between">
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            Sequence Vector
          </div>
          <div className="font-bold text-slate-900 dark:text-slate-100 text-sm font-mono">
            v{status.localSequenceVersion} / v{status.serverSequenceVersion}
          </div>
          <div className="text-slate-500 text-[11px] mt-0.5">
            {status.lastSuccessfulSyncAt ? `Last: ${new Date(status.lastSuccessfulSyncAt).toLocaleTimeString()}` : 'Never'}
          </div>
        </div>
        <div className="p-2 rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
          <HardDrive className="w-5 h-5" />
        </div>
      </div>
    </div>
  )
}
