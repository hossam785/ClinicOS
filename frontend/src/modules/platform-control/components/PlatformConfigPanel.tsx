import React, { useState } from 'react';
import { Sliders, Save } from 'lucide-react';
import type { IPlatformGlobalConfig } from '../types/platformControl.types';

interface PlatformConfigPanelProps {
  config: IPlatformGlobalConfig | null;
  onAction: (actionName: string, id: string) => void;
}

export const PlatformConfigPanel: React.FC<PlatformConfigPanelProps> = ({ config, onAction }) => {
  const [maintenanceMode, setMaintenanceMode] = useState(config?.maintenanceMode || false);
  const [minDesktopVersion, setMinDesktopVersion] = useState(config?.minimumDesktopVersion || '1.0.0');
  const [minSyncVersion, setMinSyncVersion] = useState(config?.minimumSyncVersion || '1.0.0');

  if (!config) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-bold text-white">Global Platform Configuration</h2>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-2xl">
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-base">Global Maintenance Mode</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Pauses non-essential background tasks across all clinic desktop instances.
            </p>
          </div>
          <button
            onClick={() => setMaintenanceMode(!maintenanceMode)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              maintenanceMode
                ? 'bg-rose-600 text-white hover:bg-rose-500'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {maintenanceMode ? 'MAINTENANCE ACTIVE' : 'NORMAL OPERATION'}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Minimum Required Desktop Application Version
            </label>
            <input
              type="text"
              value={minDesktopVersion}
              onChange={(e) => setMinDesktopVersion(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Minimum Required Sync Protocol Version
            </label>
            <input
              type="text"
              value={minSyncVersion}
              onChange={(e) => setMinSyncVersion(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={() => onAction('SAVE_CONFIG', 'GLOBAL')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            Save Configuration Changes
          </button>
        </div>
      </div>
    </div>
  );
};
