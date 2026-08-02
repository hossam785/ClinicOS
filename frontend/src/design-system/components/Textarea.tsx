import type { TextareaHTMLAttributes } from 'react'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  requiredIndicator?: boolean
}

export default function Textarea({
  label,
  error,
  helperText,
  requiredIndicator = false,
  ...props
}: TextareaProps) {
  return (
    <div className="form-field-group">
      {label && (
        <label>
          {label}
          {requiredIndicator && <span className="required-star">*</span>}
        </label>
      )}
      <textarea {...props} />
      {helperText && <p className="helper-text">{helperText}</p>}
      {error && <span className="error-message">{error}</span>}
    </div>
  )
}
