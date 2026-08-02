import React from 'react';
import type { BackupMetadata } from '../types/backupRestore';
import { BackupStatusBadge } from './BackupStatusBadge';
import { X, ShieldCheck, RotateCcw, Copy, Lock, FileText, Database } from 'lucide-react';

interface Props {
  backup: BackupMetadata | null;
  onClose: () => void;
  onVerify: (id: string) => void;
  onRestore: (id: string) => void;
}

export const BackupDetailsModal: React.FC<Props> = ({
  backup,
  onClose,
  onVerify,
  onRestore,
}) => {
  if (!backup) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-bold text-slate-900">{backup.backupId}</span>
              <BackupStatusBadge type={backup.backupType} status={backup.verification?.integrityStatus} />
            </div>
            <p className="text-sm text-slate-500 mt-0.5">{backup.backupName}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Modal"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-700">
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold block">Creation Date</span>
              <span className="font-semibold text-slate-900">{new Date(backup.createdAt).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold block">Created By</span>
              <span className="font-semibold text-slate-900">{backup.createdBy}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold block">App & DB Version</span>
              <span className="font-semibold text-slate-900">v{backup.applicationVersion} (Schema v{backup.schemaVersion})</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold block">Restore Compatibility</span>
              <span className="font-semibold text-emerald-600">COMPATIBLE</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-600" />
              File & Cryptographic Security
            </h4>
            <div className="p-4 bg-slate-950 text-slate-200 rounded-xl font-mono text-xs space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">File Name:</span>
                <span>{backup.fileInformation?.fileName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Archive Size:</span>
                <span>{formatBytes(backup.fileInformation?.fileSizeBytes || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Encryption:</span>
                <span>{backup.security?.encryptionAlgorithm} ({backup.security?.keyDerivationAlgorithm})</span>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span>SHA-256 Checksum Manifest:</span>
                  <button
                    onClick={() => copyToClipboard(backup.verification?.checksum || '')}
                    aria-label="Copy SHA-256 Checksum"
                    className="p-1 hover:text-white transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="break-all text-[11px] text-emerald-400">{backup.verification?.checksum}</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-600" />
              Included Data Scope
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg border border-slate-200 bg-emerald-50/50 text-emerald-800 font-medium flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-emerald-600" /> Patients & Charts
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-emerald-50/50 text-emerald-800 font-medium flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-emerald-600" /> Prescriptions
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-emerald-50/50 text-emerald-800 font-medium flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-emerald-600" /> Appointments
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-emerald-50/50 text-emerald-800 font-medium flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-emerald-600" /> Financial Settlements
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-emerald-50/50 text-emerald-800 font-medium flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-emerald-600" /> Complete Audit Logs
              </div>
              <div className="p-2.5 rounded-lg border border-slate-200 bg-emerald-50/50 text-emerald-800 font-medium flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-emerald-600" /> File Scans & Attachments
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => onVerify(backup.backupId)}
            aria-label="Verify Checksum"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-emerald-600 transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            Verify Checksum
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-medium transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onRestore(backup.backupId);
              }}
              aria-label="Restore System from Backup"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm focus-visible:ring-2 focus-visible:ring-rose-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Restore System
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
