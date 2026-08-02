import type { ReactNode } from 'react'

export interface TooltipProps {
  content: string
  children: ReactNode
}

export default function Tooltip({ content, children }: TooltipProps) {
  return (
    <div className="tooltip-wrapper">
      {children}
      <span className="tooltip-bubble" role="tooltip">
        {content}
      </span>
    </div>
  )
}
