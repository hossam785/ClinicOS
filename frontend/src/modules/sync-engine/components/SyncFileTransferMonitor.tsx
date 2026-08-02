// File Attachment Transfer Monitor Component — Module-018

import type { IFileSyncProgress } from '../types/syncEngine.types'
import { Paperclip, CheckCircle2, HardDrive } from 'lucide-react'

interface SyncFileTransferMonitorProps {
  transfers: IFileSyncProgress[]
}

export function SyncFileTransferMonitor({ transfers }: SyncFileTransferMonitorProps) {
  if (!transfers || transfers.length === 0) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
        <Paperclip className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
        <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
          No Active File Transfers
        </h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          All patient attachments and DICOM files are synchronized.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3 text-xs">
      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
        <span className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <HardDrive className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          Resumable Chunk File Sync ({transfers.length})
        </span>
        <span className="text-[11px] text-slate-400 font-mono">5 MB Chunks</span>
      </div>

      {transfers.map((tf) => {
        const percentage = Math.round((tf.uploadedBytes / tf.fileSizeBytes) * 100) || 100

        return (
          <div
            key={tf.fileSyncId}
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Paperclip className="w-4 h-4 text-blue-500" />
                <span className="font-bold text-slate-900 dark:text-slate-100">{tf.fileName}</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                {(tf.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Chunk {tf.uploadedChunks} of {tf.totalChunks} ({percentage}%)
              </span>
              <span>Checksum: {tf.checksum.substring(0, 12)}...</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
