import React from 'react';
import { DollarSign, ArrowUpRight } from 'lucide-react';
import type { IPlatformSubscription } from '../types/platformControl.types';

interface PlatformSubscriptionCenterProps {
  subscriptions: IPlatformSubscription[];
  onAction: (actionName: string, id: string) => void;
}

export const PlatformSubscriptionCenter: React.FC<PlatformSubscriptionCenterProps> = ({ subscriptions, onAction }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">Subscription Management Center</h2>
        </div>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {subscriptions.map((sub) => {
          const storagePercent = Math.round((sub.usedStorageMb / sub.storageLimitMb) * 100);

          return (
            <div key={sub.subscriptionId} className="bg-slate-950 border border-slate-800 rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">{sub.clinicName}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{sub.tenantId}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {sub.plan}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-400">Billing Cycle</p>
                  <p className="font-semibold text-white mt-0.5">{sub.billingCycle}</p>
                </div>
                <div>
                  <p className="text-slate-400">Expiration Date</p>
                  <p className="font-semibold text-white mt-0.5">{new Date(sub.expiresAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-slate-400">Device Entitlement</p>
                  <p className="font-semibold text-white mt-0.5">{sub.maxDevices} PCs Allowed</p>
                </div>
                <div>
                  <p className="text-slate-400">Staff Entitlement</p>
                  <p className="font-semibold text-white mt-0.5">{sub.maxUsers} Users Allowed</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>Storage Utilization</span>
                  <span>{storagePercent}% ({Math.round(sub.usedStorageMb / 1024)}GB / {Math.round(sub.storageLimitMb / 1024)}GB)</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all" style={{ width: `${storagePercent}%` }} />
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => onAction('RENEW_SUBSCRIPTION', sub.subscriptionId)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
                >
                  Renew Plan
                </button>
                <button
                  onClick={() => onAction('UPGRADE_SUBSCRIPTION', sub.subscriptionId)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                >
                  Upgrade Tier
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
