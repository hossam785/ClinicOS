import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '@/design-system/components/Card'
import Button from '@/design-system/components/Button'
import Input from '@/design-system/components/Input'
import Modal from '@/design-system/components/Modal'
import { ExpenseHeader } from '../components/ExpenseHeader'
import { ExpenseStatusBadge } from '../components/ExpenseStatusBadge'
import { ExpenseCategoryBadge } from '../components/ExpenseCategoryBadge'
import { ExpenseReviewModal } from '../components/ExpenseReviewModal'
import { expenseApi } from '../services/expenseApi'
import type { Expense, PaymentMethod } from '../types/expense'
import {
  ArrowLeft,
  Edit,
  Send,
  CheckCircle,
  XCircle,
  CreditCard,
  Archive,
  RefreshCw,
  Clock,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react'
import { useAuth } from '@/modules/auth/hooks/useAuth'

export function ExpenseDetailsView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [expense, setExpense] = useState<Expense | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Payment Execution Modal State
  const [isPayModalOpen, setIsPayModalOpen] = useState<boolean>(false)
  const [payDate, setPayDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [payMethod, setPayMethod] = useState<PaymentMethod>('BANK_TRANSFER')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // Manager Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false)

  const loadExpense = useCallback(async () => {
    if (!id) return
    setIsLoading(true)
    setError(null)
    try {
      const res = await expenseApi.getExpenseById(id)
      if (res.success && res.data) {
        setExpense(res.data)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load expense details'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadExpense()
  }, [loadExpense])

  // Platform Admin Financial Privacy Block
  if (user?.role === 'PLATFORM_ADMIN') {
    return (
      <div style={{ padding: '2rem' }}>
        <Card style={{ padding: '2.5rem', textAlign: 'center', backgroundColor: '#FEF2F2', borderColor: '#FCA5A5' }}>
          <ShieldAlert size={48} style={{ color: '#DC2626', marginBottom: '1rem' }} />
          <h2 style={{ color: '#991B1B', margin: '0 0 0.5rem 0' }}>Financial Access Restricted</h2>
          <p style={{ color: '#7F1D1D', maxWidth: '500px', margin: '0 auto' }}>
            In accordance with ClinicOS SaaS privacy and security rules, Platform Administrators are strictly barred from viewing
            clinic financial records (PLATFORM_ADMIN_FINANCIAL_RESTRICTED).
          </p>
        </Card>
      </div>
    )
  }

  const handleApprove = async (expenseId: string) => {
    setIsSubmitting(true)
    try {
      const res = await expenseApi.approveExpense(expenseId)
      if (res.success) {
        setExpense(res.data)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to approve expense'
      setError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async (expenseId: string, reason: string) => {
    setIsSubmitting(true)
    try {
      const res = await expenseApi.rejectExpense(expenseId, { reason })
      if (res.success) {
        setExpense(res.data)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reject expense'
      setError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePayConfirm = async () => {
    if (!id) return
    setIsSubmitting(true)
    try {
      const res = await expenseApi.payExpense(id, { paymentDate: payDate, paymentMethod: payMethod })
      if (res.success) {
        setExpense(res.data)
        setIsPayModalOpen(false)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to mark expense as paid'
      setError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleArchive = async () => {
    if (!id) return
    const reason = window.prompt('Enter reason for archiving this expense:')
    if (reason && reason.trim()) {
      setIsSubmitting(true)
      try {
        const res = await expenseApi.archiveExpense(id, { reason: reason.trim() })
        if (res.success) {
          setExpense(res.data)
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to archive expense'
        setError(msg)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleRestore = async () => {
    if (!id) return
    setIsSubmitting(true)
    try {
      const res = await expenseApi.restoreExpense(id)
      if (res.success) {
        setExpense(res.data)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to restore expense'
      setError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (amt: number, curr: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: curr }).format(amt)
  }

  if (isLoading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>Loading expense details...</div>
  }

  if (!expense) {
    return (
      <div style={{ padding: '2rem' }}>
        <Card style={{ padding: '2rem', textAlign: 'center', color: '#64748B' }}>
          <AlertCircle size={40} style={{ color: '#EF4444', marginBottom: '0.75rem' }} />
          <h3>Expense Not Found</h3>
          <p>The requested expense record does not exist or has been removed.</p>
          <Button variant="outline" onClick={() => navigate('/dashboard/expenses/directory')}>
            Back to Directory
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      <ExpenseHeader
        title={`Expense ${expense.expenseNumber}`}
        subtitle={expense.title}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Expenses', href: '/dashboard/expenses' },
          { label: expense.expenseNumber },
        ]}
        actions={
          <>
            <Button variant="outline" onClick={() => navigate('/dashboard/expenses/directory')}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <ArrowLeft size={15} />
                <span>Back to Roster</span>
              </span>
            </Button>

            {(expense.status === 'DRAFT' || expense.status === 'REJECTED') && (
              <Button variant="outline" onClick={() => navigate(`/dashboard/expenses/${expense._id}/edit`)}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Edit size={15} />
                  <span>Edit Draft</span>
                </span>
              </Button>
            )}

            {expense.status === 'PENDING_APPROVAL' && user?.role === 'CLINIC_MANAGER' && (
              <Button variant="primary" onClick={() => setIsReviewModalOpen(true)}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={15} />
                  <span>Review Submission</span>
                </span>
              </Button>
            )}

            {expense.status === 'APPROVED' && user?.role === 'CLINIC_MANAGER' && (
              <Button variant="primary" onClick={() => setIsPayModalOpen(true)}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <CreditCard size={15} />
                  <span>Mark as Paid</span>
                </span>
              </Button>
            )}

            {expense.status !== 'ARCHIVED' && user?.role === 'CLINIC_MANAGER' && (
              <Button variant="danger" onClick={handleArchive}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Archive size={15} />
                  <span>Archive</span>
                </span>
              </Button>
            )}

            {expense.status === 'ARCHIVED' && user?.role === 'CLINIC_MANAGER' && (
              <Button variant="outline" onClick={handleRestore}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <RefreshCw size={15} />
                  <span>Restore Expense</span>
                </span>
              </Button>
            )}
          </>
        }
      />

      {error && (
        <Card style={{ padding: '1rem', marginBottom: '1.5rem', backgroundColor: '#FEF2F2', borderColor: '#FCA5A5' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#991B1B' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        </Card>
      )}

      {/* Hero Overview Card */}
      <Card style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <ExpenseCategoryBadge categoryName={expense.categoryName} />
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-500, #64748B)' }}>
                Created on {new Date(expense.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-neutral-900, #0F172A)' }}>
              {expense.title}
            </h2>
            {expense.description && (
              <p style={{ margin: '0 0 1rem 0', color: 'var(--color-neutral-600, #475569)', fontSize: '0.9375rem' }}>
                {expense.description}
              </p>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <ExpenseStatusBadge status={expense.status} />
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary-600, #2563EB)', marginTop: '0.5rem' }}>
              {formatCurrency(expense.amount, expense.currency)}
            </div>
          </div>
        </div>
      </Card>

      {/* Grid of Details Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Financial & Payment Details */}
        <Card style={{ padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-neutral-900, #0F172A)' }}>
            Financial &amp; Disbursement Info
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-neutral-500, #64748B)' }}>Expense Amount:</span>
              <strong style={{ color: 'var(--color-neutral-900, #0F172A)' }}>
                {formatCurrency(expense.amount, expense.currency)}
              </strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-neutral-500, #64748B)' }}>Expense Date:</span>
              <strong style={{ color: 'var(--color-neutral-900, #0F172A)' }}>{expense.expenseDate}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-neutral-500, #64748B)' }}>Payment Method:</span>
              <strong style={{ color: 'var(--color-neutral-900, #0F172A)' }}>{expense.paymentMethod}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-neutral-500, #64748B)' }}>Payment Date:</span>
              <strong style={{ color: 'var(--color-neutral-900, #0F172A)' }}>{expense.paymentDate || 'Not Paid Yet'}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-neutral-500, #64748B)' }}>Vendor / Supplier:</span>
              <strong style={{ color: 'var(--color-neutral-900, #0F172A)' }}>{expense.vendorName || 'N/A'}</strong>
            </div>
            {expense.vendorTaxId && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-neutral-500, #64748B)' }}>Vendor Tax ID:</span>
                <strong style={{ color: 'var(--color-neutral-900, #0F172A)' }}>{expense.vendorTaxId}</strong>
              </div>
            )}
          </div>
        </Card>

        {/* Audit & Governance History Timeline */}
        <Card style={{ padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-neutral-900, #0F172A)' }}>
            Audit &amp; Governance Timeline
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.8125rem' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <Clock size={16} style={{ color: '#2563EB', marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 600, color: 'var(--color-neutral-900, #0F172A)' }}>Record Created</div>
                <div style={{ color: 'var(--color-neutral-500, #64748B)' }}>
                  By {expense.auditInfo.createdBy} on {new Date(expense.createdAt).toLocaleString()}
                </div>
              </div>
            </div>

            {expense.auditInfo.submittedAt && (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <Send size={16} style={{ color: '#D97706', marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-neutral-900, #0F172A)' }}>Submitted For Review</div>
                  <div style={{ color: 'var(--color-neutral-500, #64748B)' }}>
                    {new Date(expense.auditInfo.submittedAt).toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            {expense.auditInfo.approvedBy && (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <CheckCircle size={16} style={{ color: '#2563EB', marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-neutral-900, #0F172A)' }}>Approved By Manager</div>
                  <div style={{ color: 'var(--color-neutral-500, #64748B)' }}>
                    By {expense.auditInfo.approvedBy} on{' '}
                    {expense.auditInfo.approvedAt ? new Date(expense.auditInfo.approvedAt).toLocaleString() : 'N/A'}
                  </div>
                </div>
              </div>
            )}

            {expense.auditInfo.rejectedBy && (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <XCircle size={16} style={{ color: '#DC2626', marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 600, color: '#DC2626' }}>Submission Rejected</div>
                  <div style={{ color: 'var(--color-neutral-500, #64748B)' }}>
                    By {expense.auditInfo.rejectedBy} on{' '}
                    {expense.auditInfo.rejectedAt ? new Date(expense.auditInfo.rejectedAt).toLocaleString() : 'N/A'}
                  </div>
                  {expense.auditInfo.rejectionReason && (
                    <div style={{ marginTop: '0.25rem', color: '#991B1B', fontStyle: 'italic' }}>
                      &quot;{expense.auditInfo.rejectionReason}&quot;
                    </div>
                  )}
                </div>
              </div>
            )}

            {expense.auditInfo.paidBy && (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <CreditCard size={16} style={{ color: '#059669', marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 600, color: '#059669' }}>Payment Executed (PAID)</div>
                  <div style={{ color: 'var(--color-neutral-500, #64748B)' }}>
                    By {expense.auditInfo.paidBy} on{' '}
                    {expense.auditInfo.paidAt ? new Date(expense.auditInfo.paidAt).toLocaleString() : 'N/A'}
                  </div>
                </div>
              </div>
            )}

            {expense.auditInfo.archivedBy && (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <Archive size={16} style={{ color: '#94A3B8', marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-neutral-900, #0F172A)' }}>Record Soft-Deleted</div>
                  <div style={{ color: 'var(--color-neutral-500, #64748B)' }}>
                    By {expense.auditInfo.archivedBy} on{' '}
                    {expense.auditInfo.archivedAt ? new Date(expense.auditInfo.archivedAt).toLocaleString() : 'N/A'}
                  </div>
                  {expense.auditInfo.archivedReason && (
                    <div style={{ marginTop: '0.25rem', color: 'var(--color-neutral-600, #475569)', fontStyle: 'italic' }}>
                      Reason: &quot;{expense.auditInfo.archivedReason}&quot;
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Internal Accounting Notes Card */}
      {expense.notes && (
        <Card style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 700, color: 'var(--color-neutral-900, #0F172A)' }}>
            Internal Accounting Notes
          </h3>
          <p style={{ margin: 0, color: 'var(--color-neutral-700, #334155)', fontSize: '0.875rem', lineHeight: '1.5' }}>
            {expense.notes}
          </p>
        </Card>
      )}

      {/* Payment Execution Modal */}
      <Modal isOpen={isPayModalOpen} onClose={() => setIsPayModalOpen(false)}>
        <div style={{ padding: '1.5rem', width: '100%', maxWidth: '480px' }}>
          <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-neutral-900, #0F172A)' }}>
            Confirm Payment Disbursement
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-neutral-600, #475569)', marginBottom: '1.25rem' }}>
            Marking expense <strong>{expense.expenseNumber}</strong> ({formatCurrency(expense.amount, expense.currency)}) as PAID will
            update realized net profit metrics in financial reports.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            <Input label="Disbursement Date *" type="date" value={payDate} onChange={(e) => setPayDate(e.target.value)} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-neutral-700, #334155)' }}>
                Payment Method *
              </label>
              <select
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value as PaymentMethod)}
                style={{
                  padding: '0.625rem 0.875rem',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border, #CBD5E1)',
                  backgroundColor: '#FFF',
                  fontSize: '0.875rem',
                }}
              >
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="CASH">Cash</option>
                <option value="CREDIT_CARD">Credit Card</option>
                <option value="CHEQUE">Cheque</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button variant="outline" onClick={() => setIsPayModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handlePayConfirm} disabled={isSubmitting}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <CreditCard size={15} />
                <span>Confirm Payment</span>
              </span>
            </Button>
          </div>
        </div>
      </Modal>

      {/* Manager Review Modal */}
      <ExpenseReviewModal
        isOpen={isReviewModalOpen}
        expense={expense}
        onClose={() => setIsReviewModalOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  )
}
