import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '@/design-system/components/Card'
import Button from '@/design-system/components/Button'
import { ExpenseHeader } from '../components/ExpenseHeader'
import { ExpenseCard } from '../components/ExpenseCard'
import { expenseApi } from '../services/expenseApi'
import type { ExpenseDashboardSummary } from '../types/expense'
import {
  Plus,
  List,
  Tags,
  DollarSign,
  CheckCircle,
  Clock,
  FileText,
  AlertCircle,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react'
import { useAuth } from '@/modules/auth/hooks/useAuth'

export function ExpensesDashboardView() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [summary, setSummary] = useState<ExpenseDashboardSummary | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const loadDashboard = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await expenseApi.getDashboardSummary()
        if (isMounted && res.success) {
          setSummary(res.data)
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : 'Failed to load expenses dashboard'
          setError(msg)
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    loadDashboard()
    return () => {
      isMounted = false
    }
  }, [])

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

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amt)
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <ExpenseHeader
        title="Expenses Dashboard"
        subtitle="Overview of operational expenditures, category breakdowns, and approval queues"
        actions={
          <>
            <Button variant="outline" onClick={() => navigate('/dashboard/expenses/categories')}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Tags size={15} />
                <span>Categories</span>
              </span>
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard/expenses/directory')}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <List size={15} />
                <span>Directory</span>
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

      {error && (
        <Card style={{ padding: '1rem', marginBottom: '1.5rem', backgroundColor: '#FEF2F2', borderColor: '#FCA5A5' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#991B1B' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        </Card>
      )}

      {/* KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.75rem',
        }}
      >
        <Card style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-neutral-500, #64748B)' }}>
              Total Month Expenses
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', backgroundColor: '#DBEAFE', color: '#2563EB' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-neutral-900, #0F172A)' }}>
            {isLoading ? '...' : formatCurrency(summary?.totalExpenseAmountMonth || 0)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-neutral-500, #64748B)', marginTop: '0.25rem' }}>
            Current month expenditures
          </div>
        </Card>

        <Card style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-neutral-500, #64748B)' }}>
              Paid Expenses
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', backgroundColor: '#D1FAE5', color: '#059669' }}>
              <CheckCircle size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669' }}>
            {isLoading ? '...' : formatCurrency(summary?.paidExpenseAmountMonth || 0)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-neutral-500, #64748B)', marginTop: '0.25rem' }}>
            Recognized realized P&amp;L impact
          </div>
        </Card>

        <Card style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-neutral-500, #64748B)' }}>
              Pending Approval
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', backgroundColor: '#FEF3C7', color: '#D97706' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#D97706' }}>
            {isLoading ? '...' : formatCurrency(summary?.pendingApprovalAmount || 0)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-neutral-500, #64748B)', marginTop: '0.25rem' }}>
            {summary?.pendingApprovalCount || 0} items awaiting review
          </div>
        </Card>

        <Card style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-neutral-500, #64748B)' }}>
              Drafts &amp; Rejected
            </span>
            <div style={{ padding: '6px', borderRadius: '8px', backgroundColor: '#F1F5F9', color: '#64748B' }}>
              <FileText size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-neutral-900, #0F172A)' }}>
            {isLoading ? '...' : `${(summary?.draftCount || 0) + (summary?.rejectedCount || 0)} items`}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-neutral-500, #64748B)', marginTop: '0.25rem' }}>
            {summary?.draftCount || 0} Drafts &bull; {summary?.rejectedCount || 0} Rejected
          </div>
        </Card>
      </div>

      {/* Main Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Category Distribution Breakdown */}
        <Card style={{ padding: '1.5rem' }}>
          <h3
            style={{
              margin: '0 0 1rem 0',
              fontSize: '1.125rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <TrendingUp size={18} style={{ color: 'var(--color-primary-600, #2563EB)' }} />
            <span>Category Expenditure Breakdown</span>
          </h3>

          {isLoading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>Loading categories...</div>
          ) : summary?.categoryBreakdown && summary.categoryBreakdown.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {summary.categoryBreakdown.map((cat) => (
                <div key={cat.categoryId}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600, color: 'var(--color-neutral-800, #1E293B)' }}>{cat.categoryName}</span>
                    <span style={{ color: 'var(--color-neutral-600, #475569)' }}>
                      {formatCurrency(cat.amount)} ({cat.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div style={{ height: '8px', width: '100%', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min(100, Math.max(0, cat.percentage))}%`,
                        backgroundColor: cat.color || '#2563EB',
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>No category data available</div>
          )}
        </Card>

        {/* Recent Expenditure Feed */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-neutral-900, #0F172A)' }}>
              Recent Expenditures
            </h3>
            <Button variant="outline" size="small" onClick={() => navigate('/dashboard/expenses/directory')}>
              View All
            </Button>
          </div>

          {isLoading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>Loading recent expenses...</div>
          ) : summary?.recentExpenses && summary.recentExpenses.length > 0 ? (
            summary.recentExpenses.map((exp) => (
              <ExpenseCard key={exp._id} expense={exp} onClick={() => navigate(`/dashboard/expenses/${exp._id}`)} />
            ))
          ) : (
            <Card style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>No recent expenses recorded</Card>
          )}
        </div>
      </div>
    </div>
  )
}
