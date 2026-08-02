import {
  Building,
  Users,
  Zap,
  PhoneCall,
  Pill,
  FileText,
  Wrench,
  Megaphone,
  Sparkles,
  Shield,
  Landmark,
  Tag,
  type LucideIcon,
} from 'lucide-react'

interface ExpenseCategoryBadgeProps {
  categoryName: string
  color?: string
  icon?: string
}

const ICON_MAP: Record<string, LucideIcon> = {
  Building,
  Users,
  Zap,
  PhoneCall,
  Pill,
  FileText,
  Wrench,
  Megaphone,
  Sparkles,
  Shield,
  Landmark,
  Tag,
}

export function ExpenseCategoryBadge({ categoryName, color = '#2563EB', icon }: ExpenseCategoryBadgeProps) {
  const IconComponent = (icon && ICON_MAP[icon]) || Tag

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 10px',
        borderRadius: '12px',
        fontSize: '0.8125rem',
        fontWeight: 500,
        backgroundColor: `${color}15`,
        color: color,
        border: `1px solid ${color}30`,
      }}
    >
      <IconComponent size={13} style={{ flexShrink: 0 }} />
      <span>{categoryName}</span>
    </span>
  )
}
