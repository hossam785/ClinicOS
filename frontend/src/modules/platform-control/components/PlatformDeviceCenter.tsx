import React from 'react';
import { Cpu } from 'lucide-react';
import type { IPlatformDevice } from '../types/platformControl.types';

interface PlatformDeviceCenterProps {
  devices: IPlatformDevice[];
  onAction: (actionName: string, deviceId: string) => void;
}

export const PlatformDeviceCenter: React.FC<PlatformDeviceCenterProps> = ({ devices, onAction }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-bold text-white">Registered Desktop Device Registry</h2>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/50 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Device Name & Fingerprint</th>
              <th className="py-3 px-4">Clinic Tenant</th>
              <th className="py-3 px-4">OS Platform & App Build</th>
              <th className="py-3 px-4">Last Sync Time</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm">
            {devices.map((dev) => (
              <tr key={dev.deviceId} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4">
                  <p className="font-semibold text-white">{dev.deviceName}</p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{dev.deviceFingerprint}</p>
                </td>
                <td className="py-3.5 px-4">
                  <p className="text-slate-200">{dev.clinicName}</p>
                  <p className="text-xs text-slate-500 font-mono">{dev.tenantId}</p>
                </td>
                <td className="py-3.5 px-4 text-xs text-slate-300">
                  <p className="font-medium text-slate-200">{dev.operatingSystem}</p>
                  <p className="text-slate-500">v{dev.applicationVersion}</p>
                </td>
                <td className="py-3.5 px-4 text-xs text-slate-400">
                  {new Date(dev.lastSyncAt).toLocaleTimeString()}
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {dev.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right space-x-2">
                  <button
                    onClick={() => onAction('TRANSFER_DEVICE', dev.deviceId)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded transition-colors"
                  >
                    Transfer
                  </button>
                  <button
                    onClick={() => onAction('REVOKE_DEVICE', dev.deviceId)}
                    className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-medium rounded transition-colors"
                  >
                    Revoke PC
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
