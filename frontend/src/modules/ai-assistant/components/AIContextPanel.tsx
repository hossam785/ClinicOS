// AI Context Panel Component — Module-017

import type { IAIContextState } from '../types/aiAssistant.types'
import { UserCheck, ShieldCheck, Database, Layers, Lock } from 'lucide-react'

interface AIContextPanelProps {
  context: IAIContextState
}

export function AIContextPanel({ context }: AIContextPanelProps) {
  return (
    <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs text-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <span className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          Active Workspace Context
        </span>
        <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          Isolated
        </span>
      </div>

      {/* Active Focused Patient Card */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/60">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
          <UserCheck className="w-3.5 h-3.5 text-blue-500" />
          Focused Patient Profile
        </div>
        {context.activePatientName ? (
          <div>
            <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              {context.activePatientName}
            </div>
            <div className="text-slate-500 font-mono text-[11px] mt-0.5">
              {context.activePatientMrn || context.activePatientId}
            </div>
          </div>
        ) : (
          <div className="text-slate-400 italic">No specific patient focused</div>
        )}
      </div>

      {/* RBAC Role Scope */}
      <div className="space-y-2 text-slate-600 dark:text-slate-300 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">RBAC Role Scope:</span>
          <span className="font-semibold bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 px-2 py-0.5 rounded font-mono text-[11px]">
            {context.appliedRoleScope}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-500">Active Module:</span>
          <span className="font-medium text-slate-800 dark:text-slate-200">
            {context.activeModule || 'Dashboard'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-500">Tenant Isolation:</span>
          <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <Lock className="w-3 h-3 text-emerald-500" />
            {context.tenantId}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-500">Data Source:</span>
          <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <Database className="w-3 h-3 text-blue-500" />
            Local SQLite FTS5
          </span>
        </div>
      </div>
    </div>
  )
}
