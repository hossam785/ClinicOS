import React from 'react';
import { Building2, Cpu, Key, Activity, DollarSign } from 'lucide-react';
import type { IPlatformStats } from '../types/platformControl.types';

interface PlatformMetricsHeaderProps {
  stats: IPlatformStats | null;
}

export const PlatformMetricsHeader: React.FC<PlatformMetricsHeaderProps> = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
        <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Total Clinics</p>
          <p className="text-xl font-bold text-white mt-0.5">{stats.totalClinics.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
        <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Active Clinics</p>
          <p className="text-xl font-bold text-emerald-400 mt-0.5">{stats.activeClinics.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
        <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400">
          <Cpu className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Active Desktop PCs</p>
          <p className="text-xl font-bold text-white mt-0.5">{stats.activeDevices.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
        <div className="p-3 bg-purple-500/10 rounded-lg text-purple-400">
          <Key className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Licenses Issued</p>
          <p className="text-xl font-bold text-white mt-0.5">{stats.issuedLicenses.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
        <div className="p-3 bg-teal-500/10 rounded-lg text-teal-400">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Sync Health Rate</p>
          <p className="text-xl font-bold text-teal-400 mt-0.5">{stats.syncHealthPercentage}%</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
        <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
          <DollarSign className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">Monthly Revenue</p>
          <p className="text-xl font-bold text-white mt-0.5">${stats.monthlyRevenueUsd.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};
