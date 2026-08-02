import React from 'react'
import type { AppointmentStatus } from '../types/appointment.types'
import AppointmentStatusBadge from './AppointmentStatusBadge'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface AppointmentHeaderProps {
  title: string
  subtitle?: string
  status?: AppointmentStatus
  breadcrumbs?: BreadcrumbItem[]
  actions?: React.ReactNode
}

export default function AppointmentHeader({
  title,
  subtitle,
  status,
  breadcrumbs,
  actions,
}: AppointmentHeaderProps) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            color: 'var(--color-text-muted)',
            marginBottom: '0.5rem',
          }}
        >
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span>/</span>}
              {item.href ? (
                <a
                  href={item.href}
                  style={{ color: 'var(--color-primary)', textDecoration: 'none' }}
                >
                  {item.label}
                </a>
              ) : (
                <span style={{ color: 'var(--color-text-main)', fontWeight: 500 }}>{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
              {title}
            </h1>
            {status && <AppointmentStatusBadge status={status} />}
          </div>
          {subtitle && (
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>
              {subtitle}
            </p>
          )}
        </div>

        {actions && <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>{actions}</div>}
      </div>
    </div>
  )
}
