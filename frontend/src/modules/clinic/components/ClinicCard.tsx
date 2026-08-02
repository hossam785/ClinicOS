import type { ReactNode } from 'react'
import Card from '@/design-system/components/Card'

export interface ClinicCardProps {
  title?: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  style?: React.CSSProperties
}

export default function ClinicCard({ title, subtitle, action, children, style }: ClinicCardProps) {
  return (
    <Card
      elevation="low"
      style={{
        padding: '1.5rem',
        backgroundColor: 'var(--color-bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        boxSizing: 'border-box',
        marginBottom: '1.5rem',
        ...style,
      }}
    >
      {(title || action) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            paddingBottom: title ? '0.75rem' : 0,
            borderBottom: title ? '1px solid var(--color-border)' : 'none',
          }}
        >
          <div>
            {title && (
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-text-main)', margin: 0 }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0' }}>
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </Card>
  )
}
