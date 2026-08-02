import React from 'react';
import { ShieldCheck, Download } from 'lucide-react';
import type { IPlatformAuditEntry } from '../types/platformControl.types';

interface PlatformAuditCenterProps {
  auditLogs: IPlatformAuditEntry[];
  onAction: (actionName: string, id: string) => void;
}

export const PlatformAuditCenter: React.FC<PlatformAuditCenterProps> = ({ auditLogs, onAction }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-bold text-white">Immutable Cryptographic Audit Center</h2>
        </div>
        <button
          onClick={() => onAction('EXPORT_AUDIT_LOGS', 'ALL')}
          className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          Export Audit Logs (JSON/CSV)
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/50 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Administrator</th>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Entity Type & ID</th>
              <th className="py-3 px-4">IP Address</th>
              <th className="py-3 px-4">SHA-256 Hash Signature</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm">
            {auditLogs.map((log) => (
              <tr key={log.auditId} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-4 text-xs font-mono text-slate-400">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="py-3.5 px-4 font-semibold text-white">
                  {log.adminName}
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {log.action}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-xs">
                  <span className="text-slate-300 font-medium">{log.entityType}: </span>
                  <span className="text-slate-500 font-mono">{log.entityId}</span>
                </td>
                <td className="py-3.5 px-4 text-xs font-mono text-slate-400">{log.ipAddress}</td>
                <td className="py-3.5 px-4 font-mono text-xs text-emerald-400 truncate max-w-[200px]" title={log.eventHash}>
                  {log.eventHash}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
