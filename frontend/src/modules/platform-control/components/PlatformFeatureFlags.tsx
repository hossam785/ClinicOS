import React from 'react';
import { Sliders } from 'lucide-react';
import type { IPlatformFeatureFlag } from '../types/platformControl.types';

interface PlatformFeatureFlagsProps {
  featureFlags: IPlatformFeatureFlag[];
  onAction: (actionName: string, id: string) => void;
}

export const PlatformFeatureFlags: React.FC<PlatformFeatureFlagsProps> = ({ featureFlags, onAction }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-teal-400" />
          <h2 className="text-lg font-bold text-white">Staged Feature Rollout Manager</h2>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/50 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Feature Key</th>
              <th className="py-3 px-4">Rollout Status</th>
              <th className="py-3 px-4">Rollout Percentage</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm">
            {featureFlags.map((ff) => (
              <tr key={ff.featureId} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 font-mono text-xs font-bold text-white">
                  {ff.featureName}
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    {ff.status}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3 max-w-[200px]">
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-400" style={{ width: `${ff.rolloutPercentage}%` }} />
                    </div>
                    <span className="text-xs font-mono text-slate-300">{ff.rolloutPercentage}%</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => onAction('TOGGLE_FEATURE_FLAG', ff.featureId)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
                  >
                    Adjust Rollout
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
