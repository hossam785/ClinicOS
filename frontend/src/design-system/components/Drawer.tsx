import type { ReactNode } from 'react'

export interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  position?: 'left' | 'right'
  children: ReactNode
}

export default function Drawer({ isOpen, onClose, position = 'right', children }: DrawerProps) {
  if (!isOpen) return null

  return (
    <div className="drawer-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="drawer-content" data-position={position} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}
