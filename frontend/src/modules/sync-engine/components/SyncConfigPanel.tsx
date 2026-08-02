// Multi-Tenant Sync Configuration Settings Component — Module-018

import type { ISyncConfig } from '../types/syncEngine.types'
import { Settings, Save } from 'lucide-react'

interface SyncConfigPanelProps {
  config: ISyncConfig | null
  onSaveConfig?: (newConfig: Partial<ISyncConfig>) => void
}

export function SyncConfigPanel({ config, onSaveConfig }: SyncConfigPanelProps) {
  if (!config) return null

  return (
    <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs space-y-4 text-xs">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <span className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
          <Settings className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          Multi-Tenant Sync Configuration
        </span>
        <span className="text-[11px] font-mono text-slate-400">Admin Privileges Required</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Automatic Background Sync Toggle */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg space-y-2">
          <div className="font-bold text-slate-900 dark:text-slate-100">Automatic Background Sync</div>
          <div className="text-[11px] text-slate-500">Periodically push and pull entity deltas transparently</div>
          <select
            value={config.automaticSync ? 'true' : 'false'}
            onChange={(e) => onSaveConfig && onSaveConfig({ automaticSync: e.target.value === 'true' })}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-slate-100"
          >
            <option value="true">Enabled (Recommended)</option>
            <option value="false">Disabled (Manual Only)</option>
          </select>
        </div>

        {/* Sync Interval Dropdown */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg space-y-2">
          <div className="font-bold text-slate-900 dark:text-slate-100">Sync Interval Frequency</div>
          <div className="text-[11px] text-slate-500">Background heartbeats check interval</div>
          <select
            value={config.syncIntervalSeconds}
            onChange={(e) => onSaveConfig && onSaveConfig({ syncIntervalSeconds: Number(e.target.value) })}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-slate-100"
          >
            <option value={30}>Every 30 seconds</option>
            <option value={60}>Every 60 seconds (Default)</option>
            <option value={300}>Every 5 minutes</option>
            <option value={900}>Every 15 minutes</option>
          </select>
        </div>

        {/* Sync Attachments Toggle */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg space-y-2">
          <div className="font-bold text-slate-900 dark:text-slate-100">Sync Large File Attachments</div>
          <div className="text-[11px] text-slate-500">Enable 5MB chunked resumable binary uploads</div>
          <select
            value={config.syncAttachments ? 'true' : 'false'}
            onChange={(e) => onSaveConfig && onSaveConfig({ syncAttachments: e.target.value === 'true' })}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-slate-100"
          >
            <option value="true">Enabled</option>
            <option value="false">Disabled</option>
          </select>
        </div>

        {/* Conflict Policy Selector */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg space-y-2">
          <div className="font-bold text-slate-900 dark:text-slate-100">Default Conflict Policy</div>
          <div className="text-[11px] text-slate-500">Fallback policy when entity conflict occurs</div>
          <select
            value={config.conflictPolicyDefault}
            onChange={(e) =>
              onSaveConfig &&
              onSaveConfig({
                conflictPolicyDefault: e.target.value as ISyncConfig['conflictPolicyDefault'],
              })
            }
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-900 dark:text-slate-100"
          >
            <option value="ENTITY_STANDARD">Entity Standard (Recommended)</option>
            <option value="DESKTOP_WINS">Desktop Wins Always</option>
            <option value="SERVER_WINS">Server Wins Always</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={() => onSaveConfig && onSaveConfig(config)}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-xs transition-all flex items-center gap-1.5 text-xs"
        >
          <Save className="w-4 h-4" />
          <span>Save Configuration</span>
        </button>
      </div>
    </div>
  )
}
