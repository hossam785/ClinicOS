// Export Audit Log Document Modal Component — ClinicOS

import React, { useState } from 'react'
import type { ExportFormat, AuditFilterParams } from '../types/auditLogs'
import { X, Download, FileText, ShieldAlert, Loader } from 'lucide-react'

export interface ExportAuditModalProps {
  isOpen: boolean
  onClose: () => void
  onExport: (format: ExportFormat) => Promise<unknown>
  filterParams: AuditFilterParams
  isExporting?: boolean
}

export const ExportAuditModal: React.FC<ExportAuditModalProps> = ({
  isOpen,
  onClose,
  onExport,
  filterParams,
  isExporting = false,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('PDF')

  if (!isOpen) return null

  const handleDownload = async () => {
    await onExport(selectedFormat)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-indigo-50 p-2 border border-indigo-100">
              <Download className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Export Audit Log Document</h2>
              <p className="text-xs text-slate-500">Download signed audit log statement for compliance.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Format Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-900">Select Export Format</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'PDF', label: 'PDF Document', desc: 'Official signed PDF' },
              { id: 'EXCEL', label: 'Excel Spreadsheet', desc: '.xlsx data table' },
              { id: 'CSV', label: 'CSV File', desc: 'Raw CSV text' },
            ].map((fmt) => (
              <button
                key={fmt.id}
                type="button"
                onClick={() => setSelectedFormat(fmt.id as ExportFormat)}
                className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition ${
                  selectedFormat === fmt.id
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 ring-2 ring-indigo-600'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <FileText className={`h-6 w-6 mb-1 ${selectedFormat === fmt.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className="text-xs font-bold">{fmt.label}</span>
                <span className="text-[10px] text-slate-500 mt-0.5">{fmt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters Summary */}
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-1 text-xs">
          <p className="font-bold text-slate-800">Applied Filter Scope:</p>
          <p className="text-slate-600">Module: {filterParams.module || 'ALL'} | Severity: {filterParams.severity || 'ALL'}</p>
          <p className="text-slate-600">Date Range: {filterParams.startDate || 'Beginning'} to {filterParams.endDate || 'Present'}</p>
        </div>

        {/* Audit Warning Notice */}
        <div className="flex items-center gap-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
          <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600" />
          <p>
            <span className="font-bold">Security Notice:</span> Generating and downloading audit log statements will create an immutable audit record in system history.
          </p>
        </div>

        {/* Actions */}
        <div className="border-t border-slate-100 pt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download Export
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
