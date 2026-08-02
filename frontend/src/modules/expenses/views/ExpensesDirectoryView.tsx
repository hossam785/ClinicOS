import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '@/design-system/components/Card'
import Button from '@/design-system/components/Button'
import Input from '@/design-system/components/Input'
import { ExpenseHeader } from '../components/ExpenseHeader'
import { ExpenseStatusBadge } from '../components/ExpenseStatusBadge'
import { ExpenseCategoryBadge } from '../components/ExpenseCategoryBadge'
import { ExpenseReviewModal } from '../components/ExpenseReviewModal'
import { useExpenses } from '../hooks/useExpenses'
import type { Expense, ExpenseStatus, PaymentMethod } from '../types/expense'
import { Plus, Filter, RefreshCw, Eye, Edit, CheckCircle, Archive, ShieldAlert } from 'lucide-react'
import { useAuth } from '@/modules/auth/hooks/useAuth'

export function ExpensesDirectoryView() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    expenses,
    categories,
    totalCount,
    currentPage,
    totalPages,
    isLoading,
    updateFilters,
    refetch,
    approveExpense,
    rejectExpense,
    archiveExpense,
  } = useExpenses()

  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('')
  const [reviewingExpense, setReviewingExpense] = useState<Expense | null>(null)

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ search: searchQuery.trim() || undefined })
  }

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status)
    updateFilters({ status: (status as ExpenseStatus) || undefined })
  }

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId)
    updateFilters({ categoryId: catId || undefined })
  }

  const handlePaymentMethodChange = (method: string) => {
    setSelectedPaymentMethod(method)
    updateFilters({ paymentMethod: (method as PaymentMethod) || undefined })
  }

  const handleArchive = async (id: string) => {
    const reason = window.prompt('Enter reason for archiving this expense:')
    if (reason && reason.trim()) {
      try {
        await archiveExpense(id, { reason: reason.trim() })
      } catch {
        // Handled by hook
      }
    }
  }

  const formatCurrency = (amt: number, curr: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: curr }).format(amt)
  }

  const handleModalApprove = async (id: string) => {
    await approveExpense(id)
  }

  const handleModalReject = async (id: string, reason: string) => {
    await rejectExpense(id, { reason })
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <ExpenseHeader
        title="Expenses Roster Directory"
        subtitle="Manage, filter, review, and track all clinic operating expense records"
        actions={
          <>
            <Button variant="outline" onClick={() => refetch()}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <RefreshCw size={15} />
                <span>Refresh</span>
              </span>
            </Button>
            <Button variant="primary" onClick={() => navigate('/dashboard/expenses/new')}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={15} />
                <span>New Expense</span>
              </span>
            </Button>
          </>
        }
      />

      {/* Filter & Search Toolbar */}
      <Card style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 240px' }}>
            <Input
              label="Search Roster"
              placeholder="Search EXP#, Title, Vendor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-neutral-700, #334155)' }}>Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              style={{
                padding: '0.625rem 0.875rem',
                borderRadius: '6px',
                border: '1px solid var(--color-border, #CBD5E1)',
                backgroundColor: '#FFF',
                fontSize: '0.875rem',
              }}
            >
              <option value="">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="APPROVED">Approved</option>
              <option value="PAID">Paid</option>
              <option value="REJECTED">Rejected</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-neutral-700, #334155)' }}>Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              style={{
                padding: '0.625rem 0.875rem',
                borderRadius: '6px',
                border: '1px solid var(--color-border, #CBD5E1)',
                backgroundColor: '#FFF',
                fontSize: '0.875rem',
              }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-neutral-700, #334155)' }}>
              Payment Method
            </label>
            <select
              value={selectedPaymentMethod}
              onChange={(e) => handlePaymentMethodChange(e.target.value)}
              style={{
                padding: '0.625rem 0.875rem',
                borderRadius: '6px',
                border: '1px solid var(--color-border, #CBD5E1)',
                backgroundColor: '#FFF',
                fontSize: '0.875rem',
              }}
            >
              <option value="">All Methods</option>
              <option value="CASH">Cash</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="CHEQUE">Cheque</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <Button variant="outline" type="submit">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={15} />
              <span>Apply Filters</span>
            </span>
          </Button>
        </form>
      </Card>

      {/* Directory Data Grid Table */}
      <Card style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-neutral-50, #F8FAFC)', borderBottom: '1px solid var(--color-border, #E2E8F0)' }}>
                <th style={{ padding: '0.875rem 1rem', fontWeight: 600, color: 'var(--color-neutral-700, #334155)' }}>EXP #</th>
                <th style={{ padding: '0.875rem 1rem', fontWeight: 600, color: 'var(--color-neutral-700, #334155)' }}>Category</th>
                <th style={{ padding: '0.875rem 1rem', fontWeight: 600, color: 'var(--color-neutral-700, #334155)' }}>Title</th>
                <th style={{ padding: '0.875rem 1rem', fontWeight: 600, color: 'var(--color-neutral-700, #334155)' }}>Vendor</th>
                <th style={{ padding: '0.875rem 1rem', fontWeight: 600, color: 'var(--color-neutral-700, #334155)' }}>Amount</th>
                <th style={{ padding: '0.875rem 1rem', fontWeight: 600, color: 'var(--color-neutral-700, #334155)' }}>Date</th>
                <th style={{ padding: '0.875rem 1rem', fontWeight: 600, color: 'var(--color-neutral-700, #334155)' }}>Status</th>
                <th style={{ padding: '0.875rem 1rem', fontWeight: 600, color: 'var(--color-neutral-700, #334155)', textAlign: 'right' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                    Loading expenses directory...
                  </td>
                </tr>
              ) : expenses.length > 0 ? (
                expenses.map((exp) => (
                  <tr
                    key={exp._id}
                    style={{ borderBottom: '1px solid var(--color-border, #E2E8F0)', transition: 'background-color 0.15s' }}
                  >
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: 'var(--color-neutral-900, #0F172A)' }}>
                      {exp.expenseNumber}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <ExpenseCategoryBadge categoryName={exp.categoryName} />
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 500, color: 'var(--color-neutral-800, #1E293B)' }}>
                      {exp.title}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: 'var(--color-neutral-600, #475569)' }}>
                      {exp.vendorName || '-'}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 700, color: 'var(--color-neutral-900, #0F172A)' }}>
                      {formatCurrency(exp.amount, exp.currency)}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: 'var(--color-neutral-600, #475569)' }}>{exp.expenseDate}</td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <ExpenseStatusBadge status={exp.status} />
                    </td>
                    <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                        <Button variant="outline" size="small" onClick={() => navigate(`/dashboard/expenses/${exp._id}`)}>
                          <Eye size={14} />
                        </Button>

                        {(exp.status === 'DRAFT' || exp.status === 'REJECTED') && (
                          <Button variant="outline" size="small" onClick={() => navigate(`/dashboard/expenses/${exp._id}/edit`)}>
                            <Edit size={14} />
                          </Button>
                        )}

                        {exp.status === 'PENDING_APPROVAL' && user?.role === 'CLINIC_MANAGER' && (
                          <Button variant="primary" size="small" onClick={() => setReviewingExpense(exp)}>
                            <CheckCircle size={14} />
                          </Button>
                        )}

                        {exp.status !== 'ARCHIVED' && user?.role === 'CLINIC_MANAGER' && (
                          <Button variant="danger" size="small" onClick={() => handleArchive(exp._id)}>
                            <Archive size={14} />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                    No expenses found matching the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div
          style={{
            padding: '1rem 1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--color-neutral-50, #F8FAFC)',
            borderTop: '1px solid var(--color-border, #E2E8F0)',
          }}
        >
          <div style={{ fontSize: '0.875rem', color: 'var(--color-neutral-600, #475569)' }}>
            Showing <strong>{expenses.length}</strong> of <strong>{totalCount}</strong> expenses
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button
              variant="outline"
              size="small"
              disabled={currentPage <= 1}
              onClick={() => updateFilters({ page: currentPage - 1 })}
            >
              Previous
            </Button>
            <span style={{ padding: '0.35rem 0.75rem', fontSize: '0.875rem', fontWeight: 600 }}>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="small"
              disabled={currentPage >= totalPages}
              onClick={() => updateFilters({ page: currentPage + 1 })}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* Review Modal */}
      <ExpenseReviewModal
        isOpen={Boolean(reviewingExpense)}
        expense={reviewingExpense}
        onClose={() => setReviewingExpense(null)}
        onApprove={handleModalApprove}
        onReject={handleModalReject}
      />
    </div>
  )
}
