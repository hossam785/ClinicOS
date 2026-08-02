import { Activity } from 'lucide-react'

export interface AuthHeaderProps {
  title: string
  subtitle?: string
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '48px',
          height: '48px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(16, 102, 204, 0.1)',
          color: 'var(--color-primary)',
          marginBottom: '1rem',
        }}
      >
        <Activity size={24} />
      </div>
      <h2 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
