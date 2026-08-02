import React from 'react';
import { ShieldCheck, ShieldAlert, ArrowRight } from 'lucide-react';
import type { BackupStatistics } from '../types/backupRestore';
import { useNavigate } from 'react-router-dom';

interface Props {
  statistics?: BackupStatistics | null;
}

export const BackupSecurityAlertWidget: React.FC<Props> = ({ statistics }) => {
  const navigate = useNavigate();

  if (!statistics) return null;

  if (statistics.corruptedBackupsCount > 0) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <div>
            <h4 className="text-sm font-bold text-rose-900">Backup Corrupted Warning Alert</h4>
            <p className="text-xs text-rose-700">
              {statistics.corruptedBackupsCount} backup archive failed SHA-256 integrity verification. Inspection required.
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/dashboard/backup/verify')}
          className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 hover:text-rose-900"
        >
          View Verification Log <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600" />
        <div>
          <h4 className="text-sm font-bold text-emerald-900">Data Protection Status: Healthy</h4>
          <p className="text-xs text-emerald-700">
            All recent backup archives are verified with valid SHA-256 manifests. System restore ready.
          </p>
        </div>
      </div>
      <button
        onClick={() => navigate('/dashboard/backup/history')}
        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900"
      >
        View Backup Roster <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
