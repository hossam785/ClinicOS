// Synchronization History Table Component — Module-018

import type { ISyncLogEntry } from '../types/syncEngine.types'
import { CheckCircle2, History } from 'lucide-react'

interface SyncHistoryTableProps {
  logs: ISyncLogEntry[]
}

export function SyncHistoryTable({ logs }: SyncHistoryTableProps) {
  if (!logs || logs.length === 0) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
        <History className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
        <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
          No Sync History Records
        </h4>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden text-xs">
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <span className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
          Synchronization Event Audit Logs ({logs.length})
        </span>
        <span className="text-[11px] text-slate-400 font-mono">SHA-256 Hashed</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
              <th className="p-3">Timestamp</th>
              <th className="p-3">Event Type</th>
              <th className="p-3">Records Mutated</th>
              <th className="p-3">Duration (ms)</th>
              <th className="p-3">Status</th>
              <th className="p-3 font-mono">Cryptographic Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
            {logs.map((log) => (
              <tr key={log.logId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="p-3 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{log.eventType}</td>
                <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">{log.recordCount}</td>
                <td className="p-3 font-mono text-slate-600 dark:text-slate-400">{log.durationMs} ms</td>
                <td className="p-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    <CheckCircle2 className="w-3 h-3" />
                    SUCCESS
                  </span>
                </td>
                <td className="p-3 font-mono text-[10px] text-slate-400">
                  {log.eventHash.substring(0, 16)}...
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
