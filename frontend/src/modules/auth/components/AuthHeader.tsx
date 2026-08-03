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
          width: '52px',
          height: '52px',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'rgba(59, 130, 246, 0.12)',
          color: 'var(--color-primary)',
          marginBottom: '1rem',
          boxShadow: '0 0 16px rgba(59, 130, 246, 0.15)',
        }}
      >
        <Activity size={26} />
      </div>
      <h2
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.75rem',
          fontWeight: 700,
          color: 'var(--color-text-main)',
          letterSpacing: '-0.02em',
          margin: 0,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            color: 'var(--color-text-muted)',
            fontSize: '0.875rem',
            marginTop: '0.5rem',
            lineHeight: 1.5,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
