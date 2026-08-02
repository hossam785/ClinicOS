// Device Registry & License Status Component — Module-018

import type { IDeviceStatus } from '../types/syncEngine.types'
import { ShieldCheck, Cpu, Key, Calendar } from 'lucide-react'

interface SyncDeviceStatusProps {
  device: IDeviceStatus | null
}

export function SyncDeviceStatus({ device }: SyncDeviceStatusProps) {
  if (!device) return null

  return (
    <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs space-y-4 text-xs">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <span className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
            <Cpu className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            {device.deviceName}
          </span>
          <div className="text-slate-500 font-mono text-[11px] mt-0.5">{device.deviceId}</div>
        </div>
        <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-1 rounded-full font-bold text-[11px] flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          {device.licenseStatus}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700 dark:text-slate-300">
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg space-y-1">
          <div className="text-slate-400 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
            <Key className="w-3 h-3 text-amber-500" /> License Identity Key
          </div>
          <div className="font-mono font-semibold text-slate-900 dark:text-slate-100 text-xs truncate">
            {device.licenseKey}
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg space-y-1">
          <div className="text-slate-400 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
            <Calendar className="w-3 h-3 text-blue-500" /> Last Successful Sync
          </div>
          <div className="font-mono font-semibold text-slate-900 dark:text-slate-100 text-xs">
            {new Date(device.lastSuccessfulSyncAt).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-slate-500 font-mono text-[11px]">
        <span>App Version: <b>v{device.applicationVersion}</b></span>
        <span>DB Schema: <b>v{device.databaseVersion}</b></span>
        <span>Sync Protocol: <b>v{device.synchronizationVersion}</b></span>
      </div>
    </div>
  )
}
