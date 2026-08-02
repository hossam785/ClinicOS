import type { ReactNode } from 'react'

interface PatientCardProps {
  title?: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  style?: React.CSSProperties
}

export default function PatientCard({ title, subtitle, action, children, style }: PatientCardProps) {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
        padding: '1.25rem',
        marginBottom: '1.25rem',
        boxShadow: 'var(--shadow-sm)',
        ...style,
      }}
    >
      {(title || action) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: subtitle ? '0.25rem' : '1rem',
            paddingBottom: title && !subtitle ? '0.75rem' : 0,
            borderBottom: title && !subtitle ? '1px solid var(--color-border)' : 'none',
          }}
        >
          {title && (
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
              {title}
            </h3>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      {subtitle && (
        <p
          style={{
            margin: '0 0 1rem 0',
            fontSize: '0.85rem',
            color: 'var(--color-text-muted)',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          {subtitle}
        </p>
      )}
      <div>{children}</div>
    </div>
  )
}
