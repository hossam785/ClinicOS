import type { HTMLAttributes } from 'react'

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallbackText: string
  size?: 'small' | 'medium' | 'large'
}

export default function Avatar({
  src,
  alt = '',
  fallbackText,
  size = 'medium',
  ...props
}: AvatarProps) {
  return (
    <div className="avatar" data-size={size} {...props}>
      {src ? <img src={src} alt={alt} /> : <span className="avatar-fallback">{fallbackText}</span>}
    </div>
  )
}
