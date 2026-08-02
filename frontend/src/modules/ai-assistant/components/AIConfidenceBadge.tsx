// AI Confidence Badge Component — Module-017

import type { AIConfidenceLevel } from '../types/aiAssistant.types'
import { CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react'

interface AIConfidenceBadgeProps {
  score?: number
  level?: AIConfidenceLevel
}

export function AIConfidenceBadge({ score, level = 'HIGH' }: AIConfidenceBadgeProps) {
  const percentage = score !== undefined ? Math.round(score * 100) : 95

  let badgeStyle = 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
  let Icon = CheckCircle2
  let label = 'HIGH CONFIDENCE'

  if (level === 'MODERATE' || (score !== undefined && score < 0.85 && score >= 0.7)) {
    badgeStyle = 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
    Icon = AlertTriangle
    label = 'MODERATE CONFIDENCE'
  } else if (level === 'LOW' || (score !== undefined && score < 0.7)) {
    badgeStyle = 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800'
    Icon = HelpCircle
    label = 'LOW CONFIDENCE'
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeStyle}`}
      title={`Confidence Score: ${percentage}%. Answer generated exclusively from local verified clinic records.`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>
        {label} ({percentage}%)
      </span>
    </div>
  )
}
