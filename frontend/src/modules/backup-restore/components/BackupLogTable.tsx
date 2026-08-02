import React from 'react';
import type { BackupMetadata } from '../types/backupRestore';
import { BackupStatusBadge } from './BackupStatusBadge';
import { HardDrive, Eye, ShieldCheck, RotateCcw } from 'lucide-react';

interface Props {
  backups: BackupMetadata[];
  isLoading?: boolean;
  onInspectClick: (backup: BackupMetadata) => void;
  onVerifyClick: (backupId: string) => void;
  onRestoreClick: (backupId: string) => void;
}

export const BackupLogTable: React.FC<Props> = ({
  backups,
  isLoading,
  onInspectClick,
  onVerifyClick,
  onRestoreClick,
}) => {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoString;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 space-y-4 shadow-sm animate-pulse">
        <div className="h-6 bg-slate-100 rounded w-1/4"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-slate-50 rounded w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (backups.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
        <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
          <HardDrive className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-900">Zero Backup Archives Found</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
          No backups match your search filters or zero backup records have been generated yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm" aria-label="Backup Management Roster Table">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">Backup ID & Label</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Created Date</th>
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3">Version</th>
              <th className="px-4 py-3">Integrity</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {backups.map((backup) => (
              <tr key={backup._id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-4 py-3.5">
                  <div className="font-mono text-xs font-bold text-slate-900">{backup.backupId}</div>
                  <div className="text-xs text-slate-500 font-medium">{backup.backupName}</div>
                </td>

                <td className="px-4 py-3.5">
                  <BackupStatusBadge type={backup.backupType} />
                </td>

                <td className="px-4 py-3.5 text-xs text-slate-600 font-medium">
                  {formatDate(backup.createdAt)}
                </td>

                <td className="px-4 py-3.5 text-xs text-slate-700 font-mono">
                  {formatBytes(backup.fileInformation?.fileSizeBytes || 0)}
                </td>

                <td className="px-4 py-3.5">
                  <div className="text-xs font-semibold text-slate-800">v{backup.applicationVersion}</div>
                  <div className="text-[10px] text-slate-400">Schema v{backup.schemaVersion}</div>
                </td>

                <td className="px-4 py-3.5">
                  <BackupStatusBadge status={backup.verification?.integrityStatus} />
                </td>

                <td className="px-4 py-3.5 text-right space-x-1 whitespace-nowrap">
                  <button
                    onClick={() => onInspectClick(backup)}
                    aria-label={`Inspect Backup ${backup.backupId}`}
                    title="Inspect Details"
                    className="p-1.5 rounded text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 focus-visible:ring-2 focus-visible:ring-indigo-600 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onVerifyClick(backup.backupId)}
                    aria-label={`Verify Checksum for ${backup.backupId}`}
                    title="Verify Checksum"
                    className="p-1.5 rounded text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 focus-visible:ring-2 focus-visible:ring-emerald-600 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onRestoreClick(backup.backupId)}
                    aria-label={`Restore System from ${backup.backupId}`}
                    title="Restore System"
                    className="p-1.5 rounded text-rose-600 hover:text-rose-700 hover:bg-rose-50 focus-visible:ring-2 focus-visible:ring-rose-600 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
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
