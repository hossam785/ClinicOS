import type { HTMLAttributes } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean
  elevation?: 'flat' | 'low' | 'high'
}

export default function Card({
  interactive = false,
  elevation = 'flat',
  children,
  ...props
}: CardProps) {
  return (
    <div data-interactive={interactive} data-elevation={elevation} {...props}>
      {children}
    </div>
  )
}
