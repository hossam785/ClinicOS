import React, { useState } from 'react'
import { X, CreditCard, DollarSign, Calendar, FileText, Check } from 'lucide-react'
import type { Settlement, PaymentMethod } from '../types/doctorFinancials'

interface PaymentModalProps {
  settlement: Settlement
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { amountPaid: number; paymentDate: string; paymentMethod: PaymentMethod; referenceNumber?: string; notes?: string }) => Promise<void>
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ settlement, isOpen, onClose, onSubmit }) => {
  const [amountPaid, setAmountPaid] = useState<number>(settlement.outstandingBalance)
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BANK_TRANSFER')
  const [referenceNumber, setReferenceNumber] = useState<string>('')
  const [notes, setNotes] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleFullPayment = () => {
    setAmountPaid(settlement.outstandingBalance)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (amountPaid <= 0) {
      setError('Payment amount must be greater than zero')
      return
    }
    if (amountPaid > settlement.outstandingBalance) {
      setError(`Payment amount cannot exceed remaining outstanding balance of ${settlement.outstandingBalance.toLocaleString()} EGP`)
      return
    }

    setError(null)
    setIsSubmitting(true)
    try {
      await onSubmit({
        amountPaid,
        paymentDate,
        paymentMethod,
        referenceNumber: referenceNumber.trim() || undefined,
        notes: notes.trim() || undefined,
      })
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to record payment disbursement')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">Record Settlement Payment</h2>
              <p className="text-xs text-slate-500">{settlement.settlementNumber} ({settlement.doctorName})</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Balance Overview Summary */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-indigo-50/50 border border-indigo-100 rounded-lg text-xs">
            <div>
              <span className="text-slate-500 block">Total Doctor Share</span>
              <span className="font-bold text-slate-900 text-sm">{settlement.doctorShare.toLocaleString()} EGP</span>
            </div>
            <div>
              <span className="text-slate-500 block">Remaining Outstanding</span>
              <span className="font-bold text-amber-600 text-sm">{settlement.outstandingBalance.toLocaleString()} EGP</span>
            </div>
          </div>

          {/* Payment Amount Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="amountPaid" className="block text-xs font-semibold text-slate-700">
                Disbursement Amount (EGP) *
              </label>
              <button
                type="button"
                onClick={handleFullPayment}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Pay Full Balance
              </button>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <DollarSign className="w-4 h-4" />
              </span>
              <input
                id="amountPaid"
                type="number"
                step="0.01"
                min="0.01"
                max={settlement.outstandingBalance}
                value={amountPaid || ''}
                onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                required
                className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Payment Date & Method Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="paymentDate" className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Date *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-4 h-4" />
                </span>
                <input
                  id="paymentDate"
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  required
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="paymentMethod" className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Method *
              </label>
              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="block w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="BANK_TRANSFER">Bank Wire Transfer</option>
                <option value="CASH">Cash Disbursement</option>
                <option value="CHEQUE">Bank Cheque</option>
                <option value="CREDIT_CARD">Corporate Card</option>
              </select>
            </div>
          </div>

          {/* Reference Code */}
          <div>
            <label htmlFor="referenceNumber" className="block text-xs font-semibold text-slate-700 mb-1">
              Reference / Transaction ID
            </label>
            <input
              id="referenceNumber"
              type="text"
              placeholder="e.g. TRX-998201 or Cheque #10029"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="block w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-xs font-semibold text-slate-700 mb-1">
              Reconciliation Notes
            </label>
            <div className="relative">
              <span className="absolute top-2.5 left-3 pointer-events-none text-slate-400">
                <FileText className="w-4 h-4" />
              </span>
              <textarea
                id="notes"
                rows={2}
                placeholder="Add optional payment disbursement details or bank notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              <Check className="w-4 h-4" />
              {isSubmitting ? 'Recording Payment...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
