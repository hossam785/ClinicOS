// Export Report Modal Component — ClinicOS

import React, { useState } from 'react'
import { Download, FileText, X, Check } from 'lucide-react'
import type { ExportFormat, ReportType, ReportFilterParams } from '../types/reports'

export interface ExportReportModalProps {
  isOpen: boolean
  onClose: () => void
  onExport: (format: ExportFormat) => Promise<boolean>
  reportTitle: string
  reportType: ReportType
  filterParams: ReportFilterParams
  isExporting?: boolean
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  reportTitle,

  filterParams,
  isExporting = false,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('PDF')
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false)

  if (!isOpen) return null

  const handleDownload = async () => {
    const success = await onExport(selectedFormat)
    if (success) {
      setDownloadSuccess(true)
      setTimeout(() => {
        setDownloadSuccess(false)
        onClose()
      }, 1500)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2 text-indigo-600">
            <FileText className="h-5 w-5" />
            <h2 className="text-lg font-bold text-slate-900">Export Report Document</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close Export Modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Target Report</span>
            <p className="text-sm font-semibold text-slate-800">{reportTitle}</p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
            <span className="font-semibold text-slate-700">Applied Filter Summary:</span>
            <ul className="mt-1 list-disc space-y-0.5 pl-4 text-slate-500">
              <li>Period: {filterParams.startDate || 'Beginning'} to {filterParams.endDate || 'Present'}</li>
              <li>Doctor Filter: {filterParams.doctorId || 'All Doctors'}</li>
            </ul>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Select Output Document Format
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['PDF', 'EXCEL', 'CSV'] as ExportFormat[]).map((fmt) => {
                const isSelected = selectedFormat === fmt
                return (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setSelectedFormat(fmt)}
                    className={`flex flex-col items-center justify-center rounded-xl border p-3 text-xs font-bold transition ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Download className={`h-5 w-5 mb-1 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                    {fmt === 'PDF' && 'PDF (.pdf)'}
                    {fmt === 'EXCEL' && 'Excel (.xlsx)'}
                    {fmt === 'CSV' && 'CSV (.csv)'}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isExporting}
            className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50"
          >
            {downloadSuccess ? (
              <>
                <Check className="h-4 w-4" />
                Export Generated!
              </>
            ) : isExporting ? (
              'Generating...'
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download {selectedFormat}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
