import type { ReactNode } from 'react'
import type { DoctorStatus } from '../types/doctor.types'
import DoctorStatusBadge from './DoctorStatusBadge'

export interface DoctorHeaderProps {
  title: string
  subtitle?: string
  status?: DoctorStatus
  breadcrumbs?: Array<{ label: string; href?: string }>
  actions?: ReactNode
}

export default function DoctorHeader({
  title,
  subtitle,
  status,
  breadcrumbs,
  actions,
}: DoctorHeaderProps) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}
        >
          {breadcrumbs.map((crumb, idx) => (
            <span key={idx} style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
              {crumb.href ? (
                <a
                  href={crumb.href}
                  style={{ color: 'var(--color-primary)', textDecoration: 'none' }}
                >
                  {crumb.label}
                </a>
              ) : (
                <span>{crumb.label}</span>
              )}
              {idx < breadcrumbs.length - 1 && <span style={{ marginLeft: '0.5rem' }}>/</span>}
            </span>
          ))}
        </nav>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-main)', margin: 0 }}>
              {title}
            </h1>
            {status && <DoctorStatusBadge status={status} />}
          </div>
          {subtitle && (
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginTop: '0.35rem' }}>
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>{actions}</div>}
      </div>
    </div>
  )
}
