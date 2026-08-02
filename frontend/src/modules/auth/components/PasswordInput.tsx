import type { InputHTMLAttributes } from 'react'
import { useState } from 'react'
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
    <div className="form-field-group">
      {label && (
        <label>
          {label}
          {requiredIndicator && <span className="required-star">*</span>}
        </label>
      )}
      <div style={{ position: 'relative', width: '100%' }}>
        <input
          type={showPassword ? 'text' : 'password'}
          style={{ paddingRight: '2.5rem' }}
          {...props}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
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
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {helperText && <p className="helper-text">{helperText}</p>}
      {error && <span className="error-message">{error}</span>}
    </div>
  )
}
