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
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--color-border)',
        padding: '1.5rem',
        marginBottom: '1.25rem',
        boxShadow: 'var(--shadow-sm)',
        transition: 'box-shadow var(--transition-fast), border-color var(--transition-fast)',
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
            <h3
              style={{
                margin: 0,
                fontFamily: 'var(--font-heading)',
                fontSize: '1.125rem',
                fontWeight: 700,
                color: 'var(--color-text-main)',
                letterSpacing: '-0.015em',
              }}
            >
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
            fontSize: '0.875rem',
            color: 'var(--color-text-muted)',
            paddingBottom: '0.75rem',
            borderBottom: '1px solid var(--color-border)',
            lineHeight: 1.4,
          }}
        >
          {subtitle}
        </p>
      )}
      <div>{children}</div>
    </div>
  )
}
