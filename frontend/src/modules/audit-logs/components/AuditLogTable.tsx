// Audit Log Roster Table Component — ClinicOS

import React from 'react'
import type { AuditLogRecord } from '../types/auditLogs'
import { AuditSeverityBadge } from './AuditSeverityBadge'
import { Eye, Clock, User, Shield } from 'lucide-react'

export interface AuditLogTableProps {
  records: AuditLogRecord[]
  loading?: boolean
  onInspectRecord: (id: string) => void
  onInvestigateCorrelation?: (correlationId: string) => void
}

export const AuditLogTable: React.FC<AuditLogTableProps> = ({
  records,
  loading = false,
  onInspectRecord,
  onInvestigateCorrelation,
}) => {
  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3 animate-pulse">
        <div className="h-6 w-full rounded bg-slate-200" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 w-full rounded bg-slate-100" />
        ))}
      </div>
    )
  }

  if (records.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <Shield className="mx-auto h-10 w-10 text-slate-400 mb-3" />
        <h3 className="text-base font-bold text-slate-800">Zero Audit Records Found</h3>
        <p className="mt-1 text-xs text-slate-500">
          No audit log entries match your active query filters. System operational.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs" aria-label="Audit Logs Data Table">
          <thead className="border-b border-slate-200 bg-slate-50 font-semibold uppercase tracking-wider text-slate-600">
            <tr>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Audit Number</th>
              <th className="px-4 py-3 text-center">Severity</th>
              <th className="px-4 py-3">Module & Action</th>
              <th className="px-4 py-3">Actor Context</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {records.map((record) => (
              <tr key={record._id} className="transition hover:bg-slate-50">
                {/* Timestamp */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{new Date(record.eventTimestamp).toLocaleString()}</span>
                  </div>
                </td>

                {/* Audit Number */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="font-mono font-bold text-indigo-600">{record.auditNumber}</span>
                  <span className="block text-[10px] text-slate-400">{record.operatingMode}</span>
                </td>

                {/* Severity */}
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <AuditSeverityBadge severity={record.severity} />
                </td>

                {/* Module & Action */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div>
                    <span className="font-bold text-slate-900">{record.action}</span>
                    <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      {record.module} ({record.entityType})
                    </span>
                  </div>
                </td>

                {/* Actor */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    <div>
                      <span className="font-bold">{record.userDisplayName}</span>
                      <span className="block text-[10px] text-slate-400">{record.userRole}</span>
                    </div>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-4 py-3 whitespace-nowrap text-right space-x-2">
                  {onInvestigateCorrelation && record.correlationId && (
                    <button
                      type="button"
                      onClick={() => onInvestigateCorrelation(record.correlationId)}
                      className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Trace
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onInspectRecord(record._id)}
                    className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700 hover:bg-indigo-100"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Inspect
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
