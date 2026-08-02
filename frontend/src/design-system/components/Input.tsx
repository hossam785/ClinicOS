import type { InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  requiredIndicator?: boolean
}

export default function Input({
  label,
  error,
  helperText,
  requiredIndicator = false,
  ...props
}: InputProps) {
  return (
    <div className="form-field-group">
      {label && (
        <label>
          {label}
          {requiredIndicator && <span className="required-star">*</span>}
        </label>
      )}
      <input {...props} />
      {helperText && <p className="helper-text">{helperText}</p>}
      {error && <span className="error-message">{error}</span>}
    </div>
  )
}
