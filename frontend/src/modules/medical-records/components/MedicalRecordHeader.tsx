import React from 'react'
import { Link } from 'react-router-dom'
import MedicalRecordStatusBadge from './MedicalRecordStatusBadge'
import type { MedicalRecordStatus } from '../types/medicalRecord.types'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface MedicalRecordHeaderProps {
  title: string
  subtitle?: string
  status?: MedicalRecordStatus
  breadcrumbs?: BreadcrumbItem[]
  actions?: React.ReactNode
}

export default function MedicalRecordHeader({
  title,
  subtitle,
  status,
  breadcrumbs,
  actions,
}: MedicalRecordHeaderProps) {
  return (
    <div
      style={{
        marginBottom: '1.5rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {crumb.href ? (
                <Link to={crumb.href} style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
                  {crumb.label}
                </Link>
              ) : (
                <span>{crumb.label}</span>
              )}
              {idx < breadcrumbs.length - 1 && <span style={{ margin: '0 0.5rem' }}>/</span>}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
              {title}
            </h1>
            {status && <MedicalRecordStatusBadge status={status} />}
          </div>
          {subtitle && (
            <p style={{ margin: '0.35rem 0 0 0', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>{actions}</div>}
      </div>
    </div>
  )
}
