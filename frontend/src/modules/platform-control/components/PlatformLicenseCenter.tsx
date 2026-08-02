import React from 'react';
import { Key, Plus } from 'lucide-react';
import type { IPlatformLicense } from '../types/platformControl.types';

interface PlatformLicenseCenterProps {
  licenses: IPlatformLicense[];
  onAction: (actionName: string, licenseId: string) => void;
}

export const PlatformLicenseCenter: React.FC<PlatformLicenseCenterProps> = ({ licenses, onAction }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-bold text-white">Cryptographic 256-Bit License Management</h2>
        </div>
        <button
          onClick={() => onAction('GENERATE_LICENSE', 'NEW')}
          className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm rounded-lg transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Issue New License Key
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/50 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">License Key String</th>
              <th className="py-3 px-4">Clinic Tenant</th>
              <th className="py-3 px-4">Device Quota</th>
              <th className="py-3 px-4">Expiration Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm">
            {licenses.map((lic) => (
              <tr key={lic.licenseId} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 font-mono text-xs font-bold text-purple-300">
                  {lic.licenseKey}
                </td>
                <td className="py-3.5 px-4">
                  <p className="font-semibold text-white">{lic.clinicName}</p>
                  <p className="text-xs text-slate-500 font-mono">{lic.tenantId}</p>
                </td>
                <td className="py-3.5 px-4">
                  <span className="text-white font-semibold">{lic.activatedDevices}</span>
                  <span className="text-slate-500 text-xs"> / {lic.deviceLimit} PCs</span>
                </td>
                <td className="py-3.5 px-4 text-slate-300 text-xs">
                  {new Date(lic.expirationDate).toLocaleDateString()}
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {lic.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right space-x-2">
                  <button
                    onClick={() => onAction('RENEW_LICENSE', lic.licenseId)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded transition-colors"
                  >
                    Renew
                  </button>
                  <button
                    onClick={() => onAction('REVOKE_LICENSE', lic.licenseId)}
                    className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-medium rounded transition-colors"
                  >
                    Revoke
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
