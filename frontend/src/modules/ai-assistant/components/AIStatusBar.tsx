// AI Status Bar Component — Module-017

import type { AIServerStatus } from '../types/aiAssistant.types'
import { Shield, Sparkles, Database, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react'

interface AIStatusBarProps {
  status: AIServerStatus | null
  onRebuildIndex?: () => void
}

export function AIStatusBar({ status, onRebuildIndex }: AIStatusBarProps) {
  if (!status) {
    return (
      <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 animate-pulse text-xs text-slate-500">
        <span>Initializing local AI engine status...</span>
      </div>
    )
  }

  const isReady = status.status === 'READY'

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900 text-white rounded-lg border border-slate-800 shadow-sm text-xs">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isReady ? 'bg-emerald-400' : 'bg-amber-400'
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
              isReady ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          />
        </span>
        <span className="font-semibold tracking-wide text-slate-100 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          {status.modelName}
        </span>
        <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono text-[11px]">
          {status.modelFormat}
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Offline Security Shield Badge */}
        <div className="flex items-center gap-1.5 text-emerald-400 font-medium bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-full text-[11px]">
          <Shield className="w-3.5 h-3.5" />
          <span>100% Offline & Private</span>
        </div>

        {/* Index Status */}
        <div className="flex items-center gap-1.5 text-slate-300">
          <Database className="w-3.5 h-3.5 text-blue-400" />
          <span>Index Sync: {status.indexSyncPercentage}%</span>
          {isReady ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          )}
        </div>

        {/* Rebuild Index Button */}
        {onRebuildIndex && (
          <button
            onClick={onRebuildIndex}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors ml-1"
            title="Rebuild local FTS5 search index"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Sync</span>
          </button>
        )}
      </div>
    </div>
  )
}
