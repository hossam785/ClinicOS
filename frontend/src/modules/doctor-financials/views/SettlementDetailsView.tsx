import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Calendar, CreditCard, Send, Check, Archive, History, FileText } from 'lucide-react'
import { useDoctorFinancialDetails, useSettlementActions } from '../hooks/useDoctorFinancials'
import { SettlementStatusBadge } from '../components/SettlementStatusBadge'
import { CompensationBadge } from '../components/CompensationBadge'
import { PaymentModal } from '../components/PaymentModal'

export const SettlementDetailsView: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { settlement, loading, error, refresh } = useDoctorFinancialDetails(id)
  const { submitSettlement, approveSettlement, recordPayment, archiveSettlement, submitting } = useSettlementActions()

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [archiveReason, setArchiveReason] = useState('')
  const [showArchiveInput, setShowArchiveInput] = useState(false)

  if (loading) {
    return <div className="p-8 text-center text-sm text-slate-500">Loading settlement details...</div>
  }

  if (error || !settlement) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <button
          type="button"
          onClick={() => navigate('/dashboard/doctor-financials')}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        <div className="p-4 text-sm font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
          {error || 'Settlement record not found.'}
        </div>
      </div>
    )
  }

  const handleSubmitForReview = async () => {
    try {
      await submitSettlement(settlement._id)
      refresh()
    } catch {
      // Error handled in hook
    }
  }

  const handleApprove = async () => {
    try {
      await approveSettlement(settlement._id)
      refresh()
    } catch {
      // Error handled in hook
    }
  }

  const handleArchive = async () => {
    if (!archiveReason.trim()) return
    try {
      await archiveSettlement(settlement._id, archiveReason.trim())
      setShowArchiveInput(false)
      refresh()
    } catch {
      // Error handled in hook
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/dashboard/doctor-financials')}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </button>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2">
          {settlement.status === 'DRAFT' && (
            <button
              type="button"
              onClick={handleSubmitForReview}
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              Submit For Review
            </button>
          )}

          {settlement.status === 'PENDING_REVIEW' && (
            <button
              type="button"
              onClick={handleApprove}
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              Approve Settlement
            </button>
          )}

          {(settlement.status === 'APPROVED' || settlement.status === 'PAID') && settlement.outstandingBalance > 0 && (
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <CreditCard className="w-3.5 h-3.5" />
              Record Payment
            </button>
          )}

          {!settlement.archived && (
            <button
              type="button"
              onClick={() => setShowArchiveInput(!showArchiveInput)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
            >
              <Archive className="w-3.5 h-3.5" />
              Archive
            </button>
          )}
        </div>
      </div>

      {/* Archive Reason Input */}
      {showArchiveInput && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-3">
          <label htmlFor="archiveReason" className="block text-xs font-semibold text-rose-900">
            Mandatory Archival Reason *
          </label>
          <div className="flex gap-2">
            <input
              id="archiveReason"
              type="text"
              placeholder="Specify reason for archiving this statement..."
              value={archiveReason}
              onChange={(e) => setArchiveReason(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border border-rose-300 rounded-lg focus:ring-2 focus:ring-rose-500 bg-white"
            />
            <button
              type="button"
              onClick={handleArchive}
              disabled={!archiveReason.trim() || submitting}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 disabled:opacity-50"
            >
              Confirm Archive
            </button>
          </div>
        </div>
      )}

      {/* Header Banner Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-base font-bold text-slate-900">{settlement.settlementNumber}</span>
            <SettlementStatusBadge status={settlement.status} />
            <CompensationBadge model="PERCENTAGE" percentage={60} />
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span className="font-semibold text-slate-900">{settlement.doctorName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>
                Period: {settlement.settlementPeriod.startDate} to {settlement.settlementPeriod.endDate}
              </span>
            </div>
          </div>
        </div>

        <div className="text-right bg-slate-50 border border-slate-100 rounded-lg p-3 w-full md:w-auto">
          <span className="text-xs text-slate-500 block">Outstanding Balance</span>
          <span className={`text-xl font-bold ${settlement.outstandingBalance > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {settlement.outstandingBalance.toLocaleString()} EGP
          </span>
        </div>
      </div>

      {/* Financial Calculation Breakdown Grid (4 Columns) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Completed Visits</span>
          <span className="text-xl font-bold text-slate-900">{settlement.completedVisitsCount} Visits</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Gross Revenue</span>
          <span className="text-xl font-bold text-slate-900">{settlement.grossRevenue.toLocaleString()} EGP</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider block mb-1">Doctor Share (60%)</span>
          <span className="text-xl font-bold text-indigo-700">{settlement.doctorShare.toLocaleString()} EGP</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Disbursed Paid</span>
          <span className="text-xl font-bold text-emerald-600">{settlement.amountPaid.toLocaleString()} EGP</span>
        </div>
      </div>

      {/* Visit Line Items Table */}
      {settlement.lineItems && settlement.lineItems.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900">Completed Consultation Line Items</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase">
                  <th className="py-2.5 px-3">Visit Date</th>
                  <th className="py-2.5 px-3">Patient Name</th>
                  <th className="py-2.5 px-3">Treatment</th>
                  <th className="py-2.5 px-3 text-right">Gross Fee</th>
                  <th className="py-2.5 px-3 text-right">Doctor Share (60%)</th>
                  <th className="py-2.5 px-3 text-right">Clinic Share (40%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {settlement.lineItems.map((item) => (
                  <tr key={item.visitId} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3">{item.visitDate}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">{item.patientName}</td>
                    <td className="py-2.5 px-3">{item.treatmentName}</td>
                    <td className="py-2.5 px-3 text-right font-medium">{item.grossAmount.toLocaleString()} EGP</td>
                    <td className="py-2.5 px-3 text-right font-semibold text-indigo-700">{item.doctorShare.toLocaleString()} EGP</td>
                    <td className="py-2.5 px-3 text-right text-slate-500">{item.clinicShare.toLocaleString()} EGP</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Disbursement Payment Records Log */}
      {settlement.paymentRecords && settlement.paymentRecords.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">Disbursement Payment History</h2>
          </div>
          <div className="space-y-3">
            {settlement.paymentRecords.map((rec) => (
              <div key={rec.paymentId} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-900">
                    {rec.amountPaid.toLocaleString()} EGP ({rec.paymentMethod.replace('_', ' ')})
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    Date: {rec.paymentDate} | Ref: {rec.referenceNumber || 'N/A'}
                  </div>
                  {rec.notes && <div className="text-slate-600 mt-1 italic">&ldquo;{rec.notes}&rdquo;</div>}
                </div>
                <span className="px-2 py-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-100 rounded">
                  Paid
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Info Footer */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2 text-xs text-slate-500">
        <div className="flex items-center gap-1.5 font-semibold text-slate-700 mb-1">
          <History className="w-4 h-4 text-slate-400" />
          <span>Governance Audit Trail</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px]">
          <div>Created By: {settlement.auditInfo.createdBy} ({new Date(settlement.auditInfo.createdAt).toLocaleDateString()})</div>
          {settlement.auditInfo.approvedBy && <div>Approved By: {settlement.auditInfo.approvedBy}</div>}
          {settlement.auditInfo.closedBy && <div>Closed By: {settlement.auditInfo.closedBy}</div>}
          {settlement.auditInfo.archivedBy && <div>Archived By: {settlement.auditInfo.archivedBy}</div>}
        </div>
        {settlement.notes && (
          <div className="pt-2 border-t border-slate-100 flex items-start gap-1 text-slate-600">
            <FileText className="w-3.5 h-3.5 text-slate-400 mt-0.5" />
            <span>Notes: {settlement.notes}</span>
          </div>
        )}
      </div>

      {/* Payment Modal Component */}
      <PaymentModal
        settlement={settlement}
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSubmit={async (dto) => {
          await recordPayment(settlement._id, dto)
          refresh()
        }}
      />
    </div>
  )
}
