import type { ButtonHTMLAttributes } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline'
  size?: 'small' | 'medium' | 'large'
}

export default function Button({
  variant = 'primary',
  size = 'medium',
  children,
  ...props
}: ButtonProps) {
  return (
    <button data-variant={variant} data-size={size} {...props}>
      {children}
    </button>
  )
}
