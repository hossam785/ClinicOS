import React from 'react';
import type { BackupFilterParams, BackupType, IntegrityStatus } from '../types/backupRestore';
import { Search, Filter, Plus, RefreshCw, RotateCcw } from 'lucide-react';

interface Props {
  filters: BackupFilterParams;
  onFilterChange: (updated: BackupFilterParams) => void;
  onCreateBackupClick: () => void;
  onRestoreWizardClick: () => void;
  onRefreshClick: () => void;
  isCreating?: boolean;
}

export const BackupFilterHeader: React.FC<Props> = ({
  filters,
  onFilterChange,
  onCreateBackupClick,
  onRestoreWizardClick,
  onRefreshClick,
  isCreating,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Backup & Disaster Recovery</h2>
          <p className="text-sm text-slate-500">
            Offline-first data protection, automated backups, and safe system disaster recovery control.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onRefreshClick}
            aria-label="Refresh Backup Roster"
            className="p-2.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-indigo-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onRestoreWizardClick}
            aria-label="Open Disaster Restore Wizard"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 font-medium text-sm focus-visible:ring-2 focus-visible:ring-rose-600 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Restore Wizard
          </button>

          <button
            onClick={onCreateBackupClick}
            disabled={isCreating}
            aria-label="Create Manual Backup"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-indigo-600 disabled:opacity-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {isCreating ? 'Creating Backup...' : 'Create Backup'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search backup ID or label..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filters.backupType || 'ALL'}
            onChange={(e) => onFilterChange({ ...filters, backupType: e.target.value as BackupType | 'ALL' })}
            aria-label="Filter by Backup Type"
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900"
          >
            <option value="ALL">All Backup Types</option>
            <option value="MANUAL">Manual</option>
            <option value="AUTOMATIC">Automatic</option>
            <option value="PRE_UPGRADE">Pre-Upgrade</option>
            <option value="EMERGENCY">Emergency</option>
            <option value="SAFETY_PRE_RESTORE">Safety Snapshot</option>
          </select>
        </div>

        <div>
          <select
            value={filters.integrityStatus || 'ALL'}
            onChange={(e) => onFilterChange({ ...filters, integrityStatus: e.target.value as IntegrityStatus | 'ALL' })}
            aria-label="Filter by Integrity Status"
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900"
          >
            <option value="ALL">All Verification Statuses</option>
            <option value="VERIFIED">Verified</option>
            <option value="UNVERIFIED">Unverified</option>
            <option value="CORRUPTED">Corrupted</option>
          </select>
        </div>

        <div>
          <input
            type="date"
            aria-label="Filter by Date"
            value={filters.startDate || ''}
            onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value })}
            className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 text-slate-900"
          />
        </div>
      </div>
    </div>
  );
};
