import React from 'react';
import { Activity, RefreshCw, CheckCircle2 } from 'lucide-react';
import type { IPlatformSyncOverview } from '../types/platformControl.types';

interface PlatformSyncTelemetryProps {
  syncOverview: IPlatformSyncOverview[];
  onAction: (actionName: string, id: string) => void;
}

export const PlatformSyncTelemetry: React.FC<PlatformSyncTelemetryProps> = ({ syncOverview, onAction }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-teal-400" />
          <h2 className="text-lg font-bold text-white">Global Synchronization Telemetry</h2>
        </div>
        <button
          onClick={() => onAction('REFRESH_SYNC', 'GLOBAL')}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Gateway Telemetry
        </button>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {syncOverview.map((item) => (
          <div key={item.tenantId} className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">{item.clinicName}</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{item.tenantId}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {item.health}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <p className="text-slate-400">Online PCs</p>
                <p className="font-bold text-white text-base mt-0.5">{item.activeDevices}</p>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <p className="text-slate-400">Queue Items</p>
                <p className="font-bold text-teal-400 text-base mt-0.5">{item.pendingQueueItems}</p>
              </div>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <p className="text-slate-400">Conflicts</p>
                <p className="font-bold text-amber-400 text-base mt-0.5">{item.unresolvedConflicts}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Last Successful Gateway Sync:</span>
              <span className="font-mono text-slate-200">{new Date(item.lastSuccessfulSync).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
