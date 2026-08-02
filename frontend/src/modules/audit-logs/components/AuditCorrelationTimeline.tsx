// Forensic Investigation Correlation Timeline Component — ClinicOS

import React from 'react'
import type { AuditLogRecord } from '../types/auditLogs'
import { AuditSeverityBadge } from './AuditSeverityBadge'
import { Clock, User, Shield, ArrowLeft } from 'lucide-react'

export interface AuditCorrelationTimelineProps {
  correlationId: string
  records: AuditLogRecord[]
  loading?: boolean
  onBackToRoster: () => void
  onInspectRecord: (id: string) => void
}

export const AuditCorrelationTimeline: React.FC<AuditCorrelationTimelineProps> = ({
  correlationId,
  records,
  loading = false,
  onBackToRoster,
  onInspectRecord,
}) => {
  return (
    <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToRoster}
            className="rounded-lg border border-slate-300 p-2 text-slate-600 hover:bg-slate-50"
            aria-label="Back to Audit Roster"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Forensic Investigation Timeline</h1>
            <p className="mt-0.5 text-xs text-slate-500">
              Transaction Correlation ID: <span className="font-mono font-bold text-indigo-600">{correlationId}</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBackToRoster}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          Return to Roster
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center animate-pulse space-y-4">
          <div className="h-6 w-1/3 bg-slate-200 mx-auto rounded" />
          <div className="h-20 w-full bg-slate-100 rounded" />
        </div>
      ) : records.length === 0 ? (
        <div className="p-12 text-center text-slate-500">
          <Shield className="mx-auto h-8 w-8 text-slate-400 mb-2" />
          <p className="text-sm font-semibold">No correlated events found for this ID.</p>
        </div>
      ) : (
        <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-100">
          {records.map((record, index) => (
            <div key={record._id} className="relative group">
              {/* Timeline Dot */}
              <div className="absolute -left-6 top-1 h-5 w-5 rounded-full border-2 border-white bg-indigo-600 ring-4 ring-indigo-50 flex items-center justify-center text-[9px] font-bold text-white">
                {index + 1}
              </div>

              {/* Event Card */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-600">{record.auditNumber}</span>
                    <AuditSeverityBadge severity={record.severity} showIcon={false} />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{new Date(record.eventTimestamp).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{record.action}</h3>
                    <p className="text-xs text-slate-500">
                      Module: <span className="font-semibold text-slate-700">{record.module}</span> | Entity:{' '}
                      <span className="font-mono text-slate-700">{record.entityType} ({record.entityId})</span>
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onInspectRecord(record._id)}
                    className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
                  >
                    Inspect Event
                  </button>
                </div>

                <div className="flex items-center gap-2 border-t border-slate-100 pt-2 text-xs text-slate-600">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  <span>Executed by <strong>{record.userDisplayName}</strong> ({record.userRole})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
