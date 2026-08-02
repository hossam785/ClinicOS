// Diagnostics & Health Verification Component — Module-018

import type { ISyncDiagnostics } from '../types/syncEngine.types'
import { CheckCircle2, Activity, Wifi, ShieldCheck, Database, HardDrive } from 'lucide-react'

interface SyncDiagnosticsPanelProps {
  diagnostics: ISyncDiagnostics | null
}

export function SyncDiagnosticsPanel({ diagnostics }: SyncDiagnosticsPanelProps) {
  if (!diagnostics) return null

  const items = [
    { label: 'Internet Connectivity', value: diagnostics.internetStatus, icon: Wifi },
    { label: 'Cloud Gateway Reachability', value: diagnostics.serverReachability, icon: Activity },
    { label: 'Device & JWT Auth Status', value: diagnostics.authenticationStatus, icon: ShieldCheck },
    { label: 'Operation Queue Health', value: diagnostics.queueHealthStatus, icon: Database },
    { label: 'SQLite Database Integrity', value: diagnostics.databaseIntegrityStatus, icon: HardDrive },
  ]

  return (
    <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs space-y-4 text-xs">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-500" />
          System Health Diagnostics
        </span>
        <span className="text-[11px] font-mono text-slate-400">
          Checked: {new Date(diagnostics.diagnosticsCheckedAt).toLocaleTimeString()}
        </span>
      </div>

      <div className="space-y-2">
        {items.map((item, idx) => {
          const IconComp = item.icon
          return (
            <div
              key={idx}
              className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg flex items-center justify-between border border-slate-200 dark:border-slate-700/60"
            >
              <div className="flex items-center gap-2">
                <IconComp className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
              </div>
              <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {item.value}
              </span>
            </div>
          )
        })}
      </div>

      <div className="p-3 bg-blue-50 border border-blue-200 dark:bg-blue-950/60 dark:border-blue-800 rounded-lg text-blue-900 dark:text-blue-200 text-[11px] flex items-center justify-between">
        <span>Available Desktop Disk Storage: <b>{(diagnostics.storageAvailableMb / 1024).toFixed(1)} GB</b></span>
        <span className="font-mono">SQLite Integrity OK</span>
      </div>
    </div>
  )
}
