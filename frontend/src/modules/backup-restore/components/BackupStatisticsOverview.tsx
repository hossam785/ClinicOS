import React from 'react';
import type { BackupStatistics } from '../types/backupRestore';
import { Database, ShieldCheck, RotateCcw, HardDrive } from 'lucide-react';

interface Props {
  statistics: BackupStatistics | null;
  isLoading?: boolean;
}

export const BackupStatisticsOverview: React.FC<Props> = ({ statistics, isLoading }) => {
  if (isLoading || !statistics) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-xl"></div>
        ))}
      </div>
    );
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 MB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
          <Database className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Backups</div>
          <div className="text-2xl font-bold text-slate-900">{statistics.totalBackupsCount}</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Verified Archives</div>
          <div className="text-2xl font-bold text-emerald-600">{statistics.verifiedBackupsCount}</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
        <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
          <RotateCcw className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Restores Executed</div>
          <div className="text-2xl font-bold text-slate-900">{statistics.totalRestoreCount}</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
          <HardDrive className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Storage Usage</div>
          <div className="text-2xl font-bold text-slate-900">{formatBytes(statistics.totalStorageSizeBytes)}</div>
        </div>
      </div>
    </div>
  );
};
