// Audit Event Details & State Diff Inspector Modal — ClinicOS

import React, { useState } from 'react'
import type { AuditLogRecord } from '../types/auditLogs'
import { AuditSeverityBadge } from './AuditSeverityBadge'
import { X, Shield, Copy, Check, Clock, User, Monitor } from 'lucide-react'

export interface AuditDetailsModalProps {
  record: AuditLogRecord | null
  onClose: () => void
  onInvestigateCorrelation?: (correlationId: string) => void
}

export const AuditDetailsModal: React.FC<AuditDetailsModalProps> = ({
  record,
  onClose,
  onInvestigateCorrelation,
}) => {
  const [copiedCorrelation, setCopiedCorrelation] = useState(false)

  if (!record) return null

  const handleCopyCorrelation = () => {
    if (record.correlationId) {
      navigator.clipboard.writeText(record.correlationId)
      setCopiedCorrelation(true)
      setTimeout(() => setCopiedCorrelation(false), 2000)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-50 p-2 border border-indigo-100">
              <Shield className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{record.action}</h2>
                <AuditSeverityBadge severity={record.severity} />
              </div>
              <span className="font-mono text-xs font-semibold text-indigo-600">{record.auditNumber}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Metadata Summary Grid */}
        <div className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs sm:grid-cols-2">
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Module:</span>
              <span className="font-bold text-slate-800">{record.module}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Event Category:</span>
              <span className="font-semibold text-slate-700">{record.eventCategory}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Target Entity:</span>
              <span className="font-mono text-slate-800">{record.entityType} ({record.entityId})</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Execution Timestamp:</span>
              <span className="font-semibold text-slate-800">{new Date(record.eventTimestamp).toUTCString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Operating Mode:</span>
              <span className="font-bold text-slate-800">{record.operatingMode} ({record.syncStatus})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Correlation ID:</span>
              <span className="font-mono text-indigo-600">{record.correlationId}</span>
            </div>
          </div>
        </div>

        {/* Actor Context & Device Context */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
          <div className="rounded-lg border border-slate-200 bg-white p-3 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
              <User className="h-4 w-4 text-slate-500" />
              <span>Actor Context</span>
            </div>
            <p className="text-slate-700 font-semibold">{record.userDisplayName}</p>
            <p className="text-slate-500">ID: {record.userId} | Role: {record.userRole}</p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-3 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
              <Monitor className="h-4 w-4 text-slate-500" />
              <span>Device Context</span>
            </div>
            <p className="text-slate-700 font-semibold">IP: {record.deviceInformation?.ipAddress || '192.168.1.1'}</p>
            <p className="text-slate-500">{record.deviceInformation?.operatingSystem || 'Desktop OS'} | Client v{record.deviceInformation?.clientVersion || '2.4.0'}</p>
          </div>
        </div>

        {/* Side-by-Side State Diff Inspector */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Sanitization State Diff Summary</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-900 p-3 text-[11px] font-mono text-slate-200 overflow-x-auto">
              <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-1">Previous State Summary</div>
              <pre>{JSON.stringify(record.previousStateSummary || { status: 'INITIAL' }, null, 2)}</pre>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-900 p-3 text-[11px] font-mono text-slate-200 overflow-x-auto">
              <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">New State Summary</div>
              <pre>{JSON.stringify(record.newStateSummary || { status: 'SAVED' }, null, 2)}</pre>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-100 pt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleCopyCorrelation}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            {copiedCorrelation ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-slate-500" />}
            {copiedCorrelation ? 'Copied ID' : 'Copy Correlation ID'}
          </button>

          <div className="flex items-center gap-2">
            {onInvestigateCorrelation && record.correlationId && (
              <button
                type="button"
                onClick={() => {
                  onClose()
                  onInvestigateCorrelation(record.correlationId)
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100"
              >
                <Clock className="h-4 w-4" />
                Investigate Timeline
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
