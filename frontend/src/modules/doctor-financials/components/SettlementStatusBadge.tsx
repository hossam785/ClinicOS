import React from 'react'
import { FileText, Clock, CheckCircle, CreditCard, CheckCircle2, Archive } from 'lucide-react'
import type { SettlementStatus } from '../types/doctorFinancials'

interface SettlementStatusBadgeProps {
  status: SettlementStatus
}

export const SettlementStatusBadge: React.FC<SettlementStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'DRAFT':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-300">
          <FileText className="w-3.5 h-3.5 text-slate-500" />
          Draft
        </span>
      )
    case 'PENDING_REVIEW':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          Pending Review
        </span>
      )
    case 'APPROVED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
          Approved
        </span>
      )
    case 'PAID':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
          Paid (Partial)
        </span>
      )
    case 'CLOSED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-800 border border-slate-400">
          <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
          Closed & Reconciled
        </span>
      )
    case 'ARCHIVED':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-rose-50 text-rose-700 border border-rose-200">
          <Archive className="w-3.5 h-3.5 text-rose-500" />
          Archived
        </span>
      )
    default:
      return null
  }
}
