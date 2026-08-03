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
        borderRadius: 'var(--radius-xl)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: '1px solid var(--color-border)',
        boxSizing: 'border-box',
        backdropFilter: 'blur(8px)',
        transition: 'transform var(--transition-normal), box-shadow var(--transition-normal)',
      }}
    >
      {children}
    </Card>
  )
}
