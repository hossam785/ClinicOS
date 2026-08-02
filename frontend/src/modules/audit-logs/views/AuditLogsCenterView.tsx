// Audit Logs Center Roster Main View — ClinicOS

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuditLogs } from '../hooks/useAuditLogs'
import { AuditFilterHeader } from '../components/AuditFilterHeader'
import { AuditLogTable } from '../components/AuditLogTable'
import { AuditDetailsModal } from '../components/AuditDetailsModal'
import { ExportAuditModal } from '../components/ExportAuditModal'
import { OfflineAuditBanner } from '../components/OfflineAuditBanner'
import { BarChart3, ShieldAlert } from 'lucide-react'
import type { ExportFormat } from '../types/auditLogs'

export const AuditLogsCenterView: React.FC = () => {
  const navigate = useNavigate()
  const {
    logs,
    selectedRecord,
    pagination,
    filters,
    isLoading,
    isOffline,
    isExporting,
    error,
    setFilters,
    fetchAuditLogs,
    inspectRecord,
    triggerExport,
    clearSelectedRecord,
  } = useAuditLogs()

  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

  useEffect(() => {
    fetchAuditLogs()
  }, [fetchAuditLogs])

  const handleRefresh = async () => {
    await fetchAuditLogs()
  }

  const handleExport = async (format: ExportFormat) => {
    return await triggerExport({
      exportFormat: format,
      filterParams: filters,
    })
  }

  const handleInvestigateCorrelation = (correlationId: string) => {
    navigate(`/dashboard/audit-logs/investigate/${correlationId}`)
  }

  return (
    <div className="space-y-6 p-6">
      <OfflineAuditBanner isOffline={isOffline} />

      {/* Top Header Controls Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Audit Logs & Compliance Roster</h1>
          <p className="mt-1 text-xs text-slate-500">
            Immutable, read-only security and operational audit trail for active clinic tenant.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/dashboard/audit-logs/stats')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <BarChart3 className="h-4 w-4 text-slate-500" />
            Security Statistics
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
          <ShieldAlert className="h-5 w-5 shrink-0 text-rose-600" />
          <p className="font-semibold">{error}</p>
        </div>
      )}

      {/* Filter Toolbar */}
      <AuditFilterHeader
        filters={filters}
        onFilterChange={(updated) => setFilters((prev) => ({ ...prev, ...updated }))}
        onRefresh={handleRefresh}
        onOpenExport={() => setIsExportModalOpen(true)}
        isRefreshing={isLoading}
      />

      {/* Data Roster Table */}
      <AuditLogTable
        records={logs}
        loading={isLoading}
        onInspectRecord={inspectRecord}
        onInvestigateCorrelation={handleInvestigateCorrelation}
      />

      {/* Pagination Footer */}
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-xs shadow-sm">
        <span className="text-slate-500">
          Showing {logs.length} of {pagination.totalItems || logs.length} audit records
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!pagination.hasPrevPage}
            onClick={() => setFilters((prev) => ({ ...prev, page: Math.max((prev.page || 1) - 1, 1) }))}
            className="rounded-lg border border-slate-300 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="font-semibold text-slate-700">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            type="button"
            disabled={!pagination.hasNextPage}
            onClick={() => setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))}
            className="rounded-lg border border-slate-300 px-3 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Details Inspector Modal */}
      <AuditDetailsModal
        record={selectedRecord}
        onClose={clearSelectedRecord}
        onInvestigateCorrelation={handleInvestigateCorrelation}
      />

      {/* Export Modal */}
      <ExportAuditModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        filterParams={filters}
        isExporting={isExporting}
      />
    </div>
  )
}
