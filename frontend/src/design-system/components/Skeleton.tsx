import type { HTMLAttributes } from 'react'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rect' | 'circle'
  width?: string | number
  height?: string | number
}

export default function Skeleton({ variant = 'text', width, height, ...props }: SkeletonProps) {
  const style = {
    width,
    height,
    ...props.style,
  }

  return <div className="skeleton" data-variant={variant} style={style} {...props} />
}
