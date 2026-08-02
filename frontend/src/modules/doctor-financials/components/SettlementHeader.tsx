import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Plus, Download, RefreshCw } from 'lucide-react'

interface SettlementHeaderProps {
  title: string
  subtitle?: string
  onCreateNew?: () => void
  onRefresh?: () => void
  onExport?: () => void
}

export const SettlementHeader: React.FC<SettlementHeaderProps> = ({
  title,
  subtitle,
  onCreateNew,
  onRefresh,
  onExport,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
      <div>
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
          <Link to="/dashboard" className="hover:text-slate-700 transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-900 font-medium">Doctor Financial Accounts</span>
        </nav>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2">
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        )}
        {onExport && (
          <button
            type="button"
            onClick={onExport}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <Download className="w-3.5 h-3.5" />
            Export Summary
          </button>
        )}
        {onCreateNew && (
          <button
            type="button"
            onClick={onCreateNew}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Create Settlement
          </button>
        )}
      </div>
    </div>
  )
}
