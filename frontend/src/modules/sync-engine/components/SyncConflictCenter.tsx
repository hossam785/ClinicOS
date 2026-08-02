// Conflict Resolution Center Component — Module-018

import type { ISyncConflict } from '../types/syncEngine.types'
import { ShieldCheck, ArrowRight } from 'lucide-react'

interface SyncConflictCenterProps {
  conflicts: ISyncConflict[]
  onResolve?: (conflictId: string, choice: 'KEEP_LOCAL' | 'USE_REMOTE') => void
}

export function SyncConflictCenter({ conflicts, onResolve }: SyncConflictCenterProps) {
  if (!conflicts || conflicts.length === 0) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
        <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
        <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
          No Sync Conflicts Detected
        </h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Local desktop records and cloud sequence vectors are completely aligned.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4 text-xs">
      <div className="p-3 bg-amber-50 border border-amber-200 dark:bg-amber-950/60 dark:border-amber-800 rounded-xl text-amber-900 dark:text-amber-200 flex items-center justify-between">
        <span className="font-semibold">
          Attention Required: {conflicts.length} unresolved entity version conflicts.
        </span>
        <span className="text-[11px] font-mono">Manual Inspection Mode</span>
      </div>

      {conflicts.map((cnf) => (
        <div
          key={cnf.conflictId}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
            <div>
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{cnf.entityTitle}</span>
              <span className="ml-2 font-mono text-[11px] text-slate-400">({cnf.entityType})</span>
            </div>
            <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">
              Detected: {new Date(cnf.createdAt).toLocaleTimeString()}
            </span>
          </div>

          {/* Side-by-Side Version Diff Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Desktop Version Card */}
            <div className="p-3 rounded-lg bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-1">
              <div className="font-bold text-blue-900 dark:text-blue-200 text-xs flex items-center justify-between">
                <span>Local Desktop Version</span>
                <span className="font-mono text-[10px]">v{String(cnf.localVersionJson.version || 1)}</span>
              </div>
              <pre className="text-[11px] font-mono bg-white/80 dark:bg-slate-900/80 p-2 rounded text-slate-800 dark:text-slate-200 overflow-x-auto">
                {JSON.stringify(cnf.localVersionJson, null, 2)}
              </pre>
            </div>

            {/* Server Version Card */}
            <div className="p-3 rounded-lg bg-purple-50/60 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-1">
              <div className="font-bold text-purple-900 dark:text-purple-200 text-xs flex items-center justify-between">
                <span>Remote Cloud Version</span>
                <span className="font-mono text-[10px]">v{String(cnf.remoteVersionJson.version || 1)}</span>
              </div>
              <pre className="text-[11px] font-mono bg-white/80 dark:bg-slate-900/80 p-2 rounded text-slate-800 dark:text-slate-200 overflow-x-auto">
                {JSON.stringify(cnf.remoteVersionJson, null, 2)}
              </pre>
            </div>
          </div>

          {/* Action Resolution Controls */}
          {onResolve && (
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => onResolve(cnf.conflictId, 'KEEP_LOCAL')}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1"
              >
                <span>Keep Desktop Version</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onResolve(cnf.conflictId, 'USE_REMOTE')}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1"
              >
                <span>Use Server Version</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
