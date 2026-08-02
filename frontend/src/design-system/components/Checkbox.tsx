import type { InputHTMLAttributes } from 'react'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
}

export default function Checkbox({ label, ...props }: CheckboxProps) {
  return (
    <label className="checkbox-container">
      <input type="checkbox" {...props} />
      <span>{label}</span>
    </label>
  )
}
