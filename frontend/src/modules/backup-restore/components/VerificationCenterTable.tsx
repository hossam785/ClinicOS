import React from 'react';
import type { BackupVerificationReport } from '../types/backupRestore';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

interface Props {
  reports: BackupVerificationReport[];
  isLoading?: boolean;
}

export const VerificationCenterTable: React.FC<Props> = ({ reports, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 space-y-3 animate-pulse">
        <div className="h-6 bg-slate-100 rounded w-1/3"></div>
        <div className="h-10 bg-slate-50 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Cryptographic Integrity & Verification Center Logs
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm" aria-label="Verification Logs Table">
          <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
            <tr>
              <th className="px-4 py-3">Verification ID</th>
              <th className="px-4 py-3">Target Backup</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">SHA-256 Checksum</th>
              <th className="px-4 py-3">DB & File Validation</th>
              <th className="px-4 py-3">Result</th>
              <th className="px-4 py-3 text-right">Verified At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {reports.map((r) => (
              <tr key={r.verificationId} className="hover:bg-slate-50/70">
                <td className="px-4 py-3 font-mono text-xs font-bold text-slate-900">{r.verificationId}</td>
                <td className="px-4 py-3 font-mono text-xs text-indigo-600 font-medium">{r.backupId}</td>
                <td className="px-4 py-3 text-xs text-slate-600 font-medium">{r.verificationType}</td>
                <td className="px-4 py-3 text-xs">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> PASSED
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-600">
                  DB: {r.databaseVerified ? 'OK' : 'ERR'} | Files: {r.attachmentVerified ? 'OK' : 'ERR'}
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {r.verificationResult}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-xs text-slate-500 font-mono">
                  {new Date(r.verifiedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
