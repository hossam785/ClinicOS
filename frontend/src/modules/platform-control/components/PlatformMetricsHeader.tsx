import React from 'react';
import { Building2, Cpu, Key, Activity, DollarSign } from 'lucide-react';
import type { IPlatformStats } from '../types/platformControl.types';

interface PlatformMetricsHeaderProps {
  stats: IPlatformStats | null;
}

export const PlatformMetricsHeader: React.FC<PlatformMetricsHeaderProps> = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="platform-metrics-grid mb-6">
      <div className="platform-metric-card">
        <div className="platform-metric-icon bg-blue-500/15 text-blue-400">
          <Building2 size={22} />
        </div>
        <div>
          <p className="platform-metric-label">Total Clinics</p>
          <p className="platform-metric-value text-white">{stats.totalClinics.toLocaleString()}</p>
        </div>
      </div>

      <div className="platform-metric-card">
        <div className="platform-metric-icon bg-emerald-500/15 text-emerald-400">
          <Building2 size={22} />
        </div>
        <div>
          <p className="platform-metric-label">Active Clinics</p>
          <p className="platform-metric-value text-emerald-400">{stats.activeClinics.toLocaleString()}</p>
        </div>
      </div>

      <div className="platform-metric-card">
        <div className="platform-metric-icon bg-amber-500/15 text-amber-400">
          <Cpu size={22} />
        </div>
        <div>
          <p className="platform-metric-label">Active Desktop PCs</p>
          <p className="platform-metric-value text-white">{stats.activeDevices.toLocaleString()}</p>
        </div>
      </div>

      <div className="platform-metric-card">
        <div className="platform-metric-icon bg-purple-500/15 text-purple-400">
          <Key size={22} />
        </div>
        <div>
          <p className="platform-metric-label">Licenses Issued</p>
          <p className="platform-metric-value text-white">{stats.issuedLicenses.toLocaleString()}</p>
        </div>
      </div>

      <div className="platform-metric-card">
        <div className="platform-metric-icon bg-teal-500/15 text-teal-400">
          <Activity size={22} />
        </div>
        <div>
          <p className="platform-metric-label">Sync Health Rate</p>
          <p className="platform-metric-value text-teal-400">{stats.syncHealthPercentage}%</p>
        </div>
      </div>

      <div className="platform-metric-card">
        <div className="platform-metric-icon bg-emerald-500/15 text-emerald-400">
          <DollarSign size={22} />
        </div>
        <div>
          <p className="platform-metric-label">Monthly Revenue</p>
          <p className="platform-metric-value text-white">${stats.monthlyRevenueUsd.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};
