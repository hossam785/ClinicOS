import { useState } from 'react'
import Modal from '@/design-system/components/Modal'
import Button from '@/design-system/components/Button'
import Input from '@/design-system/components/Input'
import type { Expense } from '../types/expense'
import { CheckCircle, XCircle, X } from 'lucide-react'

interface ExpenseReviewModalProps {
  isOpen: boolean
  expense: Expense | null
  onClose: () => void
  onApprove: (id: string) => Promise<void>
  onReject: (id: string, reason: string) => Promise<void>
}

export function ExpenseReviewModal({ isOpen, expense, onClose, onApprove, onReject }: ExpenseReviewModalProps) {
  const [rejectionReason, setRejectionReason] = useState<string>('')
  const [rejectionError, setRejectionError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  if (!expense) return null

  const handleApprove = async () => {
    setIsSubmitting(true)
    try {
      await onApprove(expense._id)
      onClose()
    } catch {
      // Handled by hook
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setRejectionError('Rejection reason is required')
      return
    }
    setIsSubmitting(true)
    try {
      await onReject(expense._id, rejectionReason.trim())
      setRejectionReason('')
      setRejectionError(null)
      onClose()
    } catch {
      // Handled by hook
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div style={{ padding: '1.5rem', width: '100%', maxWidth: '540px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-neutral-900, #0F172A)' }}>
            Review Expense Submission
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-neutral-400, #94A3B8)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Expense Detail Summary */}
        <div
          style={{
            backgroundColor: 'var(--color-neutral-50, #F8FAFC)',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid var(--color-border, #E2E8F0)',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-500, #64748B)', fontWeight: 600 }}>
            {expense.expenseNumber} &bull; {expense.categoryName}
          </div>
          <div style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0.25rem 0', color: 'var(--color-neutral-900, #0F172A)' }}>
            {expense.title}
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary-600, #2563EB)', margin: '0.5rem 0' }}>
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: expense.currency }).format(expense.amount)}
          </div>
          {expense.vendorName && (
            <div style={{ fontSize: '0.875rem', color: 'var(--color-neutral-700, #334155)' }}>
              Vendor: <strong>{expense.vendorName}</strong>
            </div>
          )}
          {expense.description && (
            <div style={{ fontSize: '0.875rem', color: 'var(--color-neutral-600, #475569)', marginTop: '0.5rem' }}>
              {expense.description}
            </div>
          )}
        </div>

        {/* Rejection input */}
        <div style={{ marginBottom: '1.5rem' }}>
          <Input
            label="Rejection Reason (Mandatory if rejecting)"
            placeholder="Specify reason for rejection..."
            value={rejectionReason}
            onChange={(e) => {
              setRejectionReason(e.target.value)
              setRejectionError(null)
            }}
            error={rejectionError || undefined}
          />
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleReject} disabled={isSubmitting}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <XCircle size={15} />
              <span>Reject Expense</span>
            </span>
          </Button>
          <Button variant="primary" onClick={handleApprove} disabled={isSubmitting}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={15} />
              <span>Approve Expense</span>
            </span>
          </Button>
        </div>
      </div>
    </Modal>
  )
}
