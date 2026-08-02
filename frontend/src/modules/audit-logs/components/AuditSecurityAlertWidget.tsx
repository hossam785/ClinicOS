// Audit Security Critical Alert Widget — ClinicOS

import React from 'react'
import { useNavigate } from 'react-router-dom'
import type { AuditLogRecord } from '../types/auditLogs'
import { ShieldAlert, ArrowRight } from 'lucide-react'

export interface AuditSecurityAlertWidgetProps {
  criticalEvents: AuditLogRecord[]
  loading?: boolean
}

export const AuditSecurityAlertWidget: React.FC<AuditSecurityAlertWidgetProps> = ({
  criticalEvents,
  loading = false,
}) => {
  const navigate = useNavigate()

  if (loading || criticalEvents.length === 0) return null

  const latestEvent = criticalEvents[0]

  return (
    <div className="flex items-center justify-between rounded-xl border border-purple-200 bg-purple-50 p-4 shadow-sm text-xs text-purple-900 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-purple-100 p-2 text-purple-700 border border-purple-200">
          <ShieldAlert className="h-5 w-5" />
        </div>
        <div>
          <div className="font-bold text-sm text-purple-950">
            Security Critical Alert: {latestEvent.action}
          </div>
          <p className="mt-0.5 text-purple-700">
            {latestEvent.userDisplayName} ({latestEvent.userRole}) executed a critical event at{' '}
            {new Date(latestEvent.eventTimestamp).toLocaleTimeString()}.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate('/dashboard/audit-logs?severity=CRITICAL')}
        className="inline-flex items-center gap-1 rounded-lg bg-purple-700 px-3 py-1.5 font-bold text-white shadow-sm hover:bg-purple-800"
      >
        Inspect Alerts
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
