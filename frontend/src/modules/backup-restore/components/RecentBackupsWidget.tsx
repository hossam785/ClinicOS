import React from 'react';
import type { BackupMetadata } from '../types/backupRestore';
import { BackupStatusBadge } from './BackupStatusBadge';
import { Database, ArrowRight } from 'lucide-react';

interface Props {
  backups: BackupMetadata[];
  onViewAllClick: () => void;
  onInspectClick: (backup: BackupMetadata) => void;
}

export const RecentBackupsWidget: React.FC<Props> = ({ backups, onViewAllClick, onInspectClick }) => {
  const recent = backups.slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
          <Database className="w-4 h-4 text-indigo-600" />
          Recent Backup Archives
        </h3>
        <button
          onClick={onViewAllClick}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          Full Roster <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {recent.map((b) => (
          <div
            key={b._id}
            onClick={() => onInspectClick(b)}
            className="py-2.5 flex items-center justify-between text-xs hover:bg-slate-50 rounded-lg px-2 cursor-pointer transition-colors"
          >
            <div>
              <span className="font-mono font-bold text-slate-900">{b.backupId}</span>
              <span className="text-slate-500 ml-2 font-medium">{b.backupName}</span>
            </div>
            <div className="flex items-center gap-2">
              <BackupStatusBadge type={b.backupType} status={b.verification?.integrityStatus} />
              <span className="text-slate-400 font-mono text-[10px]">{new Date(b.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
