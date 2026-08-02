import type { ReactNode } from 'react'
import Card from '@/design-system/components/Card'

export interface AuthCardProps {
  children: ReactNode
}

export default function AuthCard({ children }: AuthCardProps) {
  return (
    <Card
      elevation="high"
      style={{
        width: '100%',
        maxWidth: '440px',
        padding: '2.5rem',
        backgroundColor: 'var(--color-bg-surface)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--color-border)',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </Card>
  )
}
