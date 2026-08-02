import React from 'react';
import type { RetentionPolicyConfig, RetentionMode } from '../types/backupRestore';
import { Settings, ShieldCheck, Clock } from 'lucide-react';

interface Props {
  config: RetentionPolicyConfig | null;
  onUpdate: (updates: Partial<RetentionPolicyConfig>) => void;
}

export const RetentionPolicyCard: React.FC<Props> = ({ config, onUpdate }) => {
  if (!config) return null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-600" />
            Retention Governance & Automatic Schedule Settings
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure automated backup scheduling, local disk retention limits, and storage cleanup invariants.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Retention Limit Strategy
          </label>
          <div className="space-y-2">
            {[
              { mode: 'LAST_5', label: 'Last 5 Verified Backups' },
              { mode: 'LAST_10', label: 'Last 10 Verified Backups' },
              { mode: 'LAST_20', label: 'Last 20 Verified Backups' },
              { mode: 'UNLIMITED', label: 'Unlimited (Manual Cleanup Required)' },
            ].map((opt) => (
              <label
                key={opt.mode}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  config.retentionMode === opt.mode
                    ? 'border-indigo-600 bg-indigo-50/50 font-bold text-indigo-950'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{opt.label}</span>
                <input
                  type="radio"
                  name="retentionMode"
                  checked={config.retentionMode === opt.mode}
                  onChange={() => onUpdate({ retentionMode: opt.mode as RetentionMode })}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Automatic Schedule Frequency
          </label>
          <div className="space-y-2">
            {[
              { freq: 'DAILY' as const, label: 'Daily (Midnight 00:00 UTC)' },
              { freq: 'WEEKLY' as const, label: 'Weekly (Sunday 02:00 UTC)' },
              { freq: 'MONTHLY' as const, label: 'Monthly (1st of month)' },
              { freq: 'OFF' as const, label: 'Disabled (Manual Only)' },
            ].map((opt) => (
              <label
                key={opt.freq}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  config.automaticSchedule === opt.freq
                    ? 'border-indigo-600 bg-indigo-50/50 font-bold text-indigo-950'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {opt.label}
                </span>
                <input
                  type="radio"
                  name="automaticSchedule"
                  checked={config.automaticSchedule === opt.freq}
                  onChange={() => onUpdate({ automaticSchedule: opt.freq })}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
        <div className="font-bold flex items-center gap-2 text-emerald-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Protected Newest Backup Invariant Active
        </div>
        <p>
          The system permanently protects your most recent verified backup archive. Retention cleanup rules will never purge the newest backup, guaranteeing continuous data recovery capabilities.
        </p>
      </div>
    </div>
  );
};
