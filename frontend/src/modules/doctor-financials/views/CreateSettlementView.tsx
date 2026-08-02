import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, User, FileText, Check, ArrowLeft } from 'lucide-react'
import { useSettlementActions } from '../hooks/useDoctorFinancials'

export const CreateSettlementView: React.FC = () => {
  const navigate = useNavigate()
  const { createSettlement, submitting, error: submitError } = useSettlementActions()

  const [doctorId, setDoctorId] = useState('doc-101')
  const [startDate, setStartDate] = useState('2026-07-01')
  const [endDate, setEndDate] = useState('2026-07-31')
  const [notes, setNotes] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!doctorId) {
      setFormError('Please select a doctor')
      return
    }
    if (new Date(startDate) > new Date(endDate)) {
      setFormError('Start date cannot be after end date')
      return
    }

    setFormError(null)
    try {
      const created = await createSettlement({
        doctorId,
        startDate,
        endDate,
        notes: notes.trim() || undefined,
      })
      navigate(`/dashboard/doctor-financials/settlements/${created._id}`)
    } catch {
      // Error handled in hook
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <button
          type="button"
          onClick={() => navigate('/dashboard/doctor-financials')}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="border-b border-slate-200 pb-4 mb-6">
          <h1 className="text-xl font-bold text-slate-900">Create Doctor Settlement Statement</h1>
          <p className="text-xs text-slate-500 mt-1">
            Aggregate completed consultation visits for a doctor and calculate commission shares.
          </p>
        </div>

        {(formError || submitError) && (
          <div className="p-3 mb-6 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
            {formError || submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Doctor Selector */}
          <div>
            <label htmlFor="doctorId" className="block text-xs font-semibold text-slate-700 mb-1">
              Select Doctor *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </span>
              <select
                id="doctorId"
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                required
                className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="doc-101">Dr. Sarah Jenkins (Cardiology — 60% Split)</option>
                <option value="doc-102">Dr. Michael Chen (Pediatrics — 60% Split)</option>
              </select>
            </div>
          </div>

          {/* Period Date Range Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-xs font-semibold text-slate-700 mb-1">
                Period Start Date *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-4 h-4" />
                </span>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="endDate" className="block text-xs font-semibold text-slate-700 mb-1">
                Period End Date *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-4 h-4" />
                </span>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-xs font-semibold text-slate-700 mb-1">
              Statement Notes & Audit Reference
            </label>
            <div className="relative">
              <span className="absolute top-2.5 left-3 pointer-events-none text-slate-400">
                <FileText className="w-4 h-4" />
              </span>
              <textarea
                id="notes"
                rows={3}
                placeholder="Optional notes or accounting reconciliation comments..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate('/dashboard/doctor-financials')}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              <Check className="w-4 h-4" />
              {submitting ? 'Generating Statement...' : 'Generate Settlement Statement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
