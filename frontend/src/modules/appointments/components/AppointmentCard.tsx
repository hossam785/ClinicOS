import React from 'react'
import Card from '@/design-system/components/Card'

interface AppointmentCardProps {
  title?: string
  subtitle?: string
  children: React.ReactNode
  actions?: React.ReactNode
  style?: React.CSSProperties
}

export default function AppointmentCard({ title, subtitle, children, actions, style }: AppointmentCardProps) {
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
      {(title || actions) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            paddingBottom: title ? '0.75rem' : '0',
            borderBottom: title ? '1px solid var(--color-border)' : 'none',
          }}
        >
          {title && (
            <div>
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
              {subtitle && (
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                  {subtitle}
                </p>
              )}
            </div>
          )}
          {actions && <div>{actions}</div>}
        </div>
      )}
      {children}
    </Card>
  )
}
