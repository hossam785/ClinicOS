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
    <Card style={{ marginBottom: '1.5rem', ...style }}>
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
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                {title}
              </h3>
              {subtitle && (
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
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
