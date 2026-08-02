import type { InputHTMLAttributes } from 'react'

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
}

export default function Switch({ label, ...props }: SwitchProps) {
  return (
    <label className="switch-container">
      <input type="checkbox" role="switch" {...props} />
      <span>{label}</span>
    </label>
  )
}
