import type { InputHTMLAttributes } from 'react'
import { useState } from 'react'
import Input from '@/design-system/components/Input'
import { Eye, EyeOff } from 'lucide-react'

export interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
  helperText?: string
  requiredIndicator?: boolean
}

export default function PasswordInput({
  label,
  error,
  helperText,
  requiredIndicator,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div style={{ position: 'relative' }}>
      <Input
        type={showPassword ? 'text' : 'password'}
        label={label}
        error={error}
        helperText={helperText}
        requiredIndicator={requiredIndicator}
        {...props}
      />
      <button
        type="button"
        onClick={toggleVisibility}
        style={{
          position: 'absolute',
          right: '12px',
          bottom: error ? '28px' : '10px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--color-text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
        }}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )
}
