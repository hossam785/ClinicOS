import React from 'react';
import type { IntegrityStatus, BackupType } from '../types/backupRestore';
import { ShieldCheck, ShieldAlert, AlertTriangle, Clock } from 'lucide-react';

interface Props {
  status?: IntegrityStatus;
  type?: BackupType;
}

export const BackupStatusBadge: React.FC<Props> = ({ status, type }) => {
  if (type === 'PRE_UPGRADE') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
        <Clock className="w-3.5 h-3.5" />
        Pre-Upgrade
      </span>
    );
  }

  if (type === 'SAFETY_PRE_RESTORE') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
        <ShieldCheck className="w-3.5 h-3.5" />
        Safety Snapshot
      </span>
    );
  }

  switch (status) {
    case 'VERIFIED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Verified
        </span>
      );
    case 'CORRUPTED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          Corrupted
        </span>
      );
    case 'UNVERIFIED':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          Unverified
        </span>
      );
  }
};
