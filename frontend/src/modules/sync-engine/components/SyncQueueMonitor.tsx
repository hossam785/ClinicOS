// Operation Queue Monitor Component — Module-018

import type { ISyncQueueItem } from '../types/syncEngine.types'
import { RefreshCw, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

interface SyncQueueMonitorProps {
  queue: ISyncQueueItem[]
  onRetryItem?: (queueId: string) => void
}

export function SyncQueueMonitor({ queue, onRetryItem }: SyncQueueMonitorProps) {
  if (!queue || queue.length === 0) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
        <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
          Operation Queue Empty
        </h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          All local desktop records are fully synchronized with the cloud master database.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden text-xs">
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <span className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px]">
          Enqueued Mutations ({queue.length})
        </span>
        <span className="text-[11px] text-slate-400 font-mono">SQLite sync_queue</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 text-[11px] uppercase tracking-wider font-semibold">
              <th className="p-3">Priority</th>
              <th className="p-3">Entity Type</th>
              <th className="p-3">Entity Title</th>
              <th className="p-3">Operation</th>
              <th className="p-3">Status</th>
              <th className="p-3">Enqueued At</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
            {queue.map((item) => (
              <tr key={item.queueId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="p-3 font-mono text-[11px]">
                  <span
                    className={`px-2 py-0.5 rounded ${
                      item.priority === 1
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    T{item.priority}
                  </span>
                </td>
                <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">{item.entityType}</td>
                <td className="p-3 text-slate-700 dark:text-slate-300">{item.entityTitle}</td>
                <td className="p-3 font-mono text-[11px] text-blue-600 dark:text-blue-400 font-bold">
                  {item.operationType}
                </td>
                <td className="p-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.status === 'SYNCED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : item.status === 'FAILED'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                    }`}
                  >
                    {item.status === 'SYNCED' ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : item.status === 'FAILED' ? (
                      <AlertCircle className="w-3 h-3" />
                    ) : (
                      <Clock className="w-3 h-3" />
                    )}
                    {item.status}
                  </span>
                </td>
                <td className="p-3 text-slate-400 font-mono text-[11px]">
                  {new Date(item.createdAt).toLocaleTimeString()}
                </td>
                <td className="p-3 text-right">
                  {item.status === 'FAILED' && onRetryItem && (
                    <button
                      onClick={() => onRetryItem(item.queueId)}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 hover:bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-300 rounded text-[11px] font-semibold transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Retry
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
