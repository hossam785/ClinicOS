import type { HTMLAttributes } from 'react'

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info'
  title?: string
}

export default function Alert({ variant = 'info', title, children, ...props }: AlertProps) {
  return (
    <div className="alert" data-variant={variant} role="alert" {...props}>
      {title && <h4 className="alert-title">{title}</h4>}
      <div className="alert-content">{children}</div>
    </div>
  )
}
