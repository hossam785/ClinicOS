// Report Filter Header Toolbar Component — ClinicOS

import React from 'react'
import { Calendar, RefreshCw, Download, SlidersHorizontal } from 'lucide-react'
import type { ReportCategory, ReportFilterParams } from '../types/reports'

export interface ReportFilterHeaderProps {
  title: string
  subtitle?: string
  filters: ReportFilterParams
  onFilterChange: (updated: Partial<ReportFilterParams>) => void
  onRefresh?: () => void
  onOpenExport?: () => void
  categories?: Array<{ id: ReportCategory | 'ALL'; label: string }>
  activeCategory?: ReportCategory | 'ALL'
  onCategorySelect?: (cat: ReportCategory | 'ALL') => void
  isRefreshing?: boolean
}

export const ReportFilterHeader: React.FC<ReportFilterHeaderProps> = ({
  title,
  subtitle,
  filters,
  onFilterChange,
  onRefresh,
  onOpenExport,
  categories,
  activeCategory,
  onCategorySelect,
  isRefreshing = false,
}) => {
  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-1 disabled:opacity-50"
              aria-label="Refresh Reports Data"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          )}

          {onOpenExport && (
            <button
              type="button"
              onClick={onOpenExport}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-1"
              aria-label="Open Export Dialog"
            >
              <Download className="h-4 w-4" />
              Export Report
            </button>
          )}
        </div>
      </div>

      {categories && onCategorySelect && (
        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onCategorySelect(cat.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            )
          })}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600">Period:</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => onFilterChange({ startDate: e.target.value })}
            className="rounded-md border border-slate-300 px-2.5 py-1 text-xs text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            aria-label="Start Date Filter"
          />
          <span className="text-xs text-slate-400">to</span>
          <input
            type="date"
            value={filters.endDate || ''}
            onChange={(e) => onFilterChange({ endDate: e.target.value })}
            className="rounded-md border border-slate-300 px-2.5 py-1 text-xs text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            aria-label="End Date Filter"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-slate-400" />
          <select
            value={filters.doctorId || 'ALL'}
            onChange={(e) => onFilterChange({ doctorId: e.target.value })}
            className="rounded-md border border-slate-300 px-2.5 py-1 text-xs text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            aria-label="Filter By Doctor"
          >
            <option value="ALL">All Doctors</option>
            <option value="doc_101">Dr. Alexander Fleming</option>
            <option value="doc_102">Dr. Elizabeth Blackwell</option>
          </select>
        </div>
      </div>
    </div>
  )
}
