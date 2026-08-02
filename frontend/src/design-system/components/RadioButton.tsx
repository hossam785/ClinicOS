import type { InputHTMLAttributes } from 'react'

export interface RadioButtonProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
}

export default function RadioButton({ label, ...props }: RadioButtonProps) {
  return (
    <label className="radio-container">
      <input type="radio" {...props} />
      <span>{label}</span>
    </label>
  )
}
