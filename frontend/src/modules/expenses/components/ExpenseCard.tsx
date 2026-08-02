import Card from '@/design-system/components/Card'
import { ExpenseStatusBadge } from './ExpenseStatusBadge'
import { ExpenseCategoryBadge } from './ExpenseCategoryBadge'
import type { Expense } from '../types/expense'
import { Calendar, DollarSign, Building } from 'lucide-react'

interface ExpenseCardProps {
  expense: Expense
  onClick?: () => void
}

export function ExpenseCard({ expense, onClick }: ExpenseCardProps) {
  const formatCurrency = (amt: number, curr: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: curr }).format(amt)
  }

  return (
    <Card
      interactive={Boolean(onClick)}
      onClick={onClick}
      style={{ padding: '1.25rem', marginBottom: '1rem', cursor: onClick ? 'pointer' : 'default' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-neutral-400, #94A3B8)' }}>
              {expense.expenseNumber}
            </span>
            <ExpenseCategoryBadge categoryName={expense.categoryName} />
          </div>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-neutral-900, #0F172A)' }}>
            {expense.title}
          </h3>
        </div>
        <ExpenseStatusBadge status={expense.status} />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1rem',
          marginTop: '1rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--color-border, #E2E8F0)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <DollarSign size={15} style={{ color: 'var(--color-primary-600, #2563EB)' }} />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-neutral-500, #64748B)' }}>Amount</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-neutral-900, #0F172A)' }}>
              {formatCurrency(expense.amount, expense.currency)}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={15} style={{ color: 'var(--color-neutral-400, #94A3B8)' }} />
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-neutral-500, #64748B)' }}>Expense Date</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-neutral-700, #334155)' }}>
              {expense.expenseDate}
            </div>
          </div>
        </div>

        {expense.vendorName && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Building size={15} style={{ color: 'var(--color-neutral-400, #94A3B8)' }} />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-neutral-500, #64748B)' }}>Vendor</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-neutral-700, #334155)' }}>
                {expense.vendorName}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
