import type { HTMLAttributes } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
}

export default function Badge({ variant = 'neutral', children, ...props }: BadgeProps) {
  return (
    <span className="badge" data-variant={variant} {...props}>
      {children}
    </span>
  )
}
