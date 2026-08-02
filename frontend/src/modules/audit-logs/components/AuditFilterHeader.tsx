// Audit Logs Filter Toolbar Header — ClinicOS

import React from 'react'
import { Search, SlidersHorizontal, RefreshCw, Download } from 'lucide-react'
import type { AuditFilterParams, AuditModule, AuditSeverity } from '../types/auditLogs'

export interface AuditFilterHeaderProps {
  title?: string
  subtitle?: string
  filters: AuditFilterParams
  onFilterChange: (updated: Partial<AuditFilterParams>) => void
  onRefresh: () => void
  onOpenExport?: () => void
  isRefreshing?: boolean
}

export const AuditFilterHeader: React.FC<AuditFilterHeaderProps> = ({
  title = 'Audit Logs Roster Center',
  subtitle = 'Immutable, tamper-evident security, operational, and compliance audit trail registry.',
  filters,
  onFilterChange,
  onRefresh,
  onOpenExport,
  isRefreshing = false,
}) => {
  const modules: Array<{ id: AuditModule | 'ALL'; label: string }> = [
    { id: 'ALL', label: 'All Modules' },
    { id: 'AUTH', label: 'Authentication' },
    { id: 'USERS', label: 'User Management' },
    { id: 'PATIENTS', label: 'Patients' },
    { id: 'APPOINTMENTS', label: 'Appointments' },
    { id: 'MEDICAL_RECORDS', label: 'Medical Records' },
    { id: 'PRESCRIPTIONS', label: 'Prescriptions' },
    { id: 'EXPENSES', label: 'Expenses' },
    { id: 'DOCTOR_FINANCIALS', label: 'Doctor Financials' },
    { id: 'SYSTEM', label: 'System Operations' },
    { id: 'CLINIC', label: 'Clinic Settings' },
  ]

  const severities: Array<{ id: AuditSeverity | 'ALL'; label: string }> = [
    { id: 'ALL', label: 'All Severities' },
    { id: 'INFORMATION', label: 'Information' },
    { id: 'WARNING', label: 'Warning' },
    { id: 'ERROR', label: 'Error' },
    { id: 'CRITICAL', label: 'Critical' },
  ]

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          {onOpenExport && (
            <button
              type="button"
              onClick={onOpenExport}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              <Download className="h-4 w-4" />
              Export Log
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 border-t border-slate-100 pt-4">
        {/* Search Input */}
        <div className="relative sm:col-span-2 lg:col-span-2">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search audit number, action, or user..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Module Filter */}
        <div>
          <select
            value={filters.module || 'ALL'}
            onChange={(e) => onFilterChange({ module: e.target.value as AuditModule | 'ALL', page: 1 })}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {modules.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Severity Filter */}
        <div>
          <select
            value={filters.severity || 'ALL'}
            onChange={(e) => onFilterChange({ severity: e.target.value as AuditSeverity | 'ALL', page: 1 })}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            {severities.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter Start */}
        <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-1">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => onFilterChange({ startDate: e.target.value, page: 1 })}
            className="w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-xs text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  )
}
