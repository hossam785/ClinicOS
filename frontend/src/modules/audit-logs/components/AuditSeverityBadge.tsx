// Audit Severity Badge Component — ClinicOS

import React from 'react'
import type { AuditSeverity } from '../types/auditLogs'
import { CheckCircle2, AlertTriangle, XCircle, ShieldAlert } from 'lucide-react'

export interface AuditSeverityBadgeProps {
  severity: AuditSeverity
  showIcon?: boolean
}

export const AuditSeverityBadge: React.FC<AuditSeverityBadgeProps> = ({
  severity,
  showIcon = true,
}) => {
  switch (severity) {
    case 'INFORMATION':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
          {showIcon && <CheckCircle2 className="h-3 w-3 text-emerald-600" />}
          INFO
        </span>
      )
    case 'WARNING':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
          {showIcon && <AlertTriangle className="h-3 w-3 text-amber-600" />}
          WARNING
        </span>
      )
    case 'ERROR':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
          {showIcon && <XCircle className="h-3 w-3 text-rose-600" />}
          ERROR
        </span>
      )
    case 'CRITICAL':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-[10px] font-bold text-purple-700 border border-purple-200 animate-pulse">
          {showIcon && <ShieldAlert className="h-3 w-3 text-purple-600" />}
          CRITICAL
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600">
          {severity}
        </span>
      )
  }
}
