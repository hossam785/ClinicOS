// Synchronization Center Workspace Container View — Module-018

import { useSyncEngine } from '../hooks/useSyncEngine'
import { GlobalSyncIndicator } from '../components/GlobalSyncIndicator'
import { SyncStatusBar } from '../components/SyncStatusBar'
import { SyncQueueMonitor } from '../components/SyncQueueMonitor'
import { SyncConflictCenter } from '../components/SyncConflictCenter'
import { SyncFileTransferMonitor } from '../components/SyncFileTransferMonitor'
import { SyncDeviceStatus } from '../components/SyncDeviceStatus'
import { SyncHistoryTable } from '../components/SyncHistoryTable'
import { SyncDiagnosticsPanel } from '../components/SyncDiagnosticsPanel'
import { SyncConfigPanel } from '../components/SyncConfigPanel'
import { RefreshCw, HardDrive, AlertTriangle, Paperclip, Cpu, History, Activity, Settings, X } from 'lucide-react'

export default function SyncCenterWorkspaceView() {
  const {
    status,
    queue,
    conflicts,
    fileTransfers,
    deviceStatus,
    logs,
    diagnostics,
    config,
    isSyncingNow,
    activeTab,
    setActiveTab,
    isCenterOpen,
    setIsCenterOpen,
    triggerManualSync,
    resolveConflict,
    retryQueueItem,
    updateConfig,
  } = useSyncEngine()

  return (
    <div className="p-6 bg-slate-100 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 font-sans space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Desktop Offline Synchronization Center</h2>
            <p className="text-xs text-slate-500">
              Offline-First Hybrid Synchronization Engine (Shortcut: <b>Ctrl + Shift + S</b>)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <GlobalSyncIndicator status={status} onClick={() => setIsCenterOpen(true)} />
          <button
            onClick={triggerManualSync}
            disabled={isSyncingNow}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 text-white font-semibold rounded-xl shadow-xs transition-all text-xs cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncingNow ? 'animate-spin' : ''}`} />
            <span>{isSyncingNow ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        </div>
      </div>

      {/* Metric Summary Cards Bar */}
      <SyncStatusBar status={status} />

      {/* Main Tabbed Workspace */}
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs">
          {[
            { id: 'QUEUE', label: `Queue (${queue.length})`, icon: HardDrive },
            { id: 'CONFLICTS', label: `Conflicts (${conflicts.length})`, icon: AlertTriangle },
            { id: 'FILES', label: `Files (${fileTransfers.length})`, icon: Paperclip },
            { id: 'DEVICE', label: 'Device Status', icon: Cpu },
            { id: 'HISTORY', label: 'Audit Logs', icon: History },
            { id: 'DIAGNOSTICS', label: 'Diagnostics', icon: Activity },
            { id: 'CONFIG', label: 'Configuration', icon: Settings },
          ].map((tab) => {
            const IconComp = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-xs border border-slate-200 dark:border-slate-700'
                    : 'text-slate-500 hover:bg-slate-200/60 dark:hover:bg-slate-800/40'
                }`}
              >
                <IconComp className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Active Tab Panel */}
        <div className="animate-in fade-in duration-150">
          {activeTab === 'QUEUE' && <SyncQueueMonitor queue={queue} onRetryItem={retryQueueItem} />}
          {activeTab === 'CONFLICTS' && (
            <SyncConflictCenter conflicts={conflicts} onResolve={resolveConflict} />
          )}
          {activeTab === 'FILES' && <SyncFileTransferMonitor transfers={fileTransfers} />}
          {activeTab === 'DEVICE' && <SyncDeviceStatus device={deviceStatus} />}
          {activeTab === 'HISTORY' && <SyncHistoryTable logs={logs} />}
          {activeTab === 'DIAGNOSTICS' && <SyncDiagnosticsPanel diagnostics={diagnostics} />}
          {activeTab === 'CONFIG' && <SyncConfigPanel config={config} onSaveConfig={updateConfig} />}
        </div>
      </div>

      {/* Floating Modal Launcher Overlay (When triggered via Ctrl+Shift+S) */}
      {isCenterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-primary-600" />
                Sync Center Modal Overlay
              </span>
              <button
                onClick={() => setIsCenterOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              <SyncStatusBar status={status} />
              <div className="mt-4">
                <SyncQueueMonitor queue={queue} onRetryItem={retryQueueItem} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
