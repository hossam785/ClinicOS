import type { ReactNode } from 'react'

export interface DialogProps {
  isOpen: boolean
  title: string
  description?: string
  onConfirm: () => void
  onCancel: () => void
  children?: ReactNode
}

export default function Dialog({
  isOpen,
  title,
  description,
  onConfirm,
  onCancel,
  children,
}: DialogProps) {
  if (!isOpen) return null

  return (
    <div className="dialog-overlay" role="alertdialog" aria-modal="true">
      <div className="dialog-content">
        <h3>{title}</h3>
        {description && <p>{description}</p>}
        {children}
        <div className="dialog-actions">
          <button onClick={onCancel}>Cancel</button>
          <button onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  )
}
