import type { ReactNode } from 'react'
import Breadcrumbs from '@/design-system/components/Breadcrumbs'

interface ExpenseHeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  breadcrumbs?: Array<{ label: string; href?: string }>
}

export function ExpenseHeader({ title, subtitle, actions, breadcrumbs }: ExpenseHeaderProps) {
  const defaultBreadcrumbs = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Expenses', href: '/dashboard/expenses' },
  ]

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <Breadcrumbs items={breadcrumbs || defaultBreadcrumbs} />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '0.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, color: 'var(--color-neutral-900, #0F172A)' }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ margin: '0.25rem 0 0 0', color: 'var(--color-neutral-500, #64748B)', fontSize: '0.875rem' }}>
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>{actions}</div>}
      </div>
    </div>
  )
}
