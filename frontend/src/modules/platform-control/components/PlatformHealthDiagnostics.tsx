import React from 'react';
import { Activity, CheckCircle2, Zap } from 'lucide-react';
import type { IPlatformHealth } from '../types/platformControl.types';

interface PlatformHealthDiagnosticsProps {
  healthServices: IPlatformHealth[];
  onAction: (actionName: string, id: string) => void;
}

export const PlatformHealthDiagnostics: React.FC<PlatformHealthDiagnosticsProps> = ({ healthServices, onAction }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-bold text-white">Platform Infrastructure Health Diagnostics</h2>
        </div>
        <button
          onClick={() => onAction('RUN_DIAGNOSTICS', 'SYSTEM')}
          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5"
        >
          <Activity className="w-3.5 h-3.5" />
          Run System Diagnostic Check
        </button>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {healthServices.map((svc) => (
          <div key={svc.serviceName} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">{svc.serviceName}</h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {svc.status}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
                <span>Latency: <strong className="text-white">{svc.responseTimeMs}ms</strong></span>
                <span>Uptime: <strong className="text-emerald-400">{svc.uptimePercentage}%</strong></span>
              </div>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-slate-400">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
