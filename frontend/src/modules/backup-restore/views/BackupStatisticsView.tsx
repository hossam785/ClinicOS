import React from 'react';
import { useBackupRestore } from '../hooks/useBackupRestore';
import { BackupStatisticsOverview } from '../components/BackupStatisticsOverview';
import { BackupSecurityAlertWidget } from '../components/BackupSecurityAlertWidget';
import { Activity } from 'lucide-react';

export const BackupStatisticsView: React.FC = () => {
  const { statistics, isLoading } = useBackupRestore();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-600" />
          Backup Analytics & System Health Overview
        </h2>
        <p className="text-sm text-slate-500">
          Aggregated data resilience metrics, storage consumption trends, and verification success rates.
        </p>
      </div>

      <BackupSecurityAlertWidget statistics={statistics} />

      <BackupStatisticsOverview statistics={statistics} isLoading={isLoading} />
    </div>
  );
};
