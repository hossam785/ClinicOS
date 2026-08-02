import type { ReactNode } from 'react'
import type { PatientStatus } from '../types/patient.types'
import PatientStatusBadge from './PatientStatusBadge'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface PatientHeaderProps {
  title: string
  subtitle?: string
  status?: PatientStatus
  breadcrumbs?: BreadcrumbItem[]
  actions?: ReactNode
}

export default function PatientHeader({ title, subtitle, status, breadcrumbs, actions }: PatientHeaderProps) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb navigation"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.85rem',
            color: 'var(--color-text-muted)',
            marginBottom: '0.5rem',
          }}
        >
          {breadcrumbs.map((item, index) => (
            <span key={index} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              {index > 0 && <ChevronRight size={14} style={{ opacity: 0.6 }} />}
              {item.href ? (
                <a
                  href={item.href}
                  style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}
                >
                  {item.label}
                </a>
              ) : (
                <span style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      {/* Main Title & Action Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
            {title}
          </h1>
          {status && <PatientStatusBadge status={status} />}
        </div>
        {actions && <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>{actions}</div>}
      </div>

      {subtitle && (
        <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
