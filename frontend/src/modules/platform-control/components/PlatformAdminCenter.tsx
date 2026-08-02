import React from 'react';
import { ShieldCheck, Plus } from 'lucide-react';
import type { IPlatformAdminUser } from '../types/platformControl.types';

interface PlatformAdminCenterProps {
  admins: IPlatformAdminUser[];
  onAction: (actionName: string, adminId: string) => void;
}

export const PlatformAdminCenter: React.FC<PlatformAdminCenterProps> = ({ admins, onAction }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-bold text-white">Platform Administrator Accounts</h2>
        </div>
        <button
          onClick={() => onAction('CREATE_ADMIN', 'NEW')}
          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Add Administrator Account
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/50 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Administrator</th>
              <th className="py-3 px-4">RBAC Role</th>
              <th className="py-3 px-4">MFA Status</th>
              <th className="py-3 px-4">Last Login</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm">
            {admins.map((adm) => (
              <tr key={adm.administratorId} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4">
                  <p className="font-semibold text-white">{adm.fullName}</p>
                  <p className="text-xs text-slate-400">{adm.email}</p>
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    {adm.role}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-xs font-semibold text-emerald-400">
                  {adm.mfaEnabled ? 'ENABLED (TOTP)' : 'DISABLED'}
                </td>
                <td className="py-3.5 px-4 text-xs text-slate-400">
                  {new Date(adm.lastLoginAt).toLocaleString()}
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {adm.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right space-x-2">
                  <button
                    onClick={() => onAction('RESET_MFA', adm.administratorId)}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded transition-colors"
                  >
                    Reset MFA
                  </button>
                  <button
                    onClick={() => onAction('DEACTIVATE_ADMIN', adm.administratorId)}
                    className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-medium rounded transition-colors"
                  >
                    Deactivate
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
