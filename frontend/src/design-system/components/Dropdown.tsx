import type { SelectHTMLAttributes } from 'react'

export interface DropdownOption {
  value: string
  label: string
}

export interface DropdownProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: DropdownOption[]
  error?: string
}

export default function Dropdown({ label, options, error, ...props }: DropdownProps) {
  return (
    <div className="dropdown-group">
      {label && <label>{label}</label>}
      <select {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="error-message">{error}</span>}
    </div>
  )
}
