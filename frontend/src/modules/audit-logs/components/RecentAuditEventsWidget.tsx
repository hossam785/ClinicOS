// Recent Audit Events Stream Widget — ClinicOS

import React from 'react'
import { useNavigate } from 'react-router-dom'
import type { AuditLogRecord } from '../types/auditLogs'
import { AuditSeverityBadge } from './AuditSeverityBadge'
import { Shield, Clock, ArrowRight } from 'lucide-react'

export interface RecentAuditEventsWidgetProps {
  events: AuditLogRecord[]
  loading?: boolean
}

export const RecentAuditEventsWidget: React.FC<RecentAuditEventsWidgetProps> = ({
  events,
  loading = false,
}) => {
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3 animate-pulse">
        <div className="h-5 w-1/3 rounded bg-slate-200" />
        <div className="h-10 w-full rounded bg-slate-100" />
      </div>
    )
  }

  const displayEvents = events.slice(0, 5)

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">Recent Security Activity Stream</h3>
        </div>
        <button
          type="button"
          onClick={() => navigate('/dashboard/audit-logs')}
          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
        >
          View Roster
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {displayEvents.length === 0 ? (
        <p className="text-xs text-slate-500 text-center py-4">No recent security events.</p>
      ) : (
        <div className="space-y-3 divide-y divide-slate-100">
          {displayEvents.map((evt) => (
            <div key={evt._id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{evt.action}</span>
                  <AuditSeverityBadge severity={evt.severity} showIcon={false} />
                </div>
                <p className="text-[10px] text-slate-500">
                  {evt.userDisplayName} | {evt.module}
                </p>
              </div>

              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                <Clock className="h-3 w-3" />
                <span>{new Date(evt.eventTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
