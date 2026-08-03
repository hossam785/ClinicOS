import type { ReactNode } from 'react'
import Card from '@/design-system/components/Card'

export interface DoctorCardProps {
  title?: string
  subtitle?: string
  action?: ReactNode
  children: ReactNode
  style?: React.CSSProperties
}

export default function DoctorCard({ title, subtitle, action, children, style }: DoctorCardProps) {
  return (
    <Card
      elevation="low"
      style={{
        padding: '1.5rem',
        backgroundColor: 'var(--color-bg-surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
        boxSizing: 'border-box',
        marginBottom: '1.5rem',
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
            marginBottom: '1.25rem',
            paddingBottom: title ? '0.875rem' : 0,
            borderBottom: title ? '1px solid var(--color-border)' : 'none',
          }}
        >
          <div>
            {title && (
              <h3
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: 'var(--color-text-main)',
                  margin: 0,
                  letterSpacing: '-0.015em',
                }}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-text-muted)',
                  margin: '0.25rem 0 0 0',
                  lineHeight: 1.4,
                }}
              >
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
