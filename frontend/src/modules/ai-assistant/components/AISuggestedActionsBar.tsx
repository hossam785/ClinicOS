// AI Suggested Actions Bar Component — Module-017

import type { AISuggestedAction } from '../types/aiAssistant.types'
import { ArrowRight, UserCheck, Pill, Clock, FileText } from 'lucide-react'

interface AISuggestedActionsBarProps {
  actions: AISuggestedAction[]
  onActionClick: (action: AISuggestedAction) => void
}

export function AISuggestedActionsBar({ actions, onActionClick }: AISuggestedActionsBarProps) {
  if (!actions || actions.length === 0) return null

  const getActionIcon = (iconName?: string) => {
    switch (iconName) {
      case 'UserCheck':
        return UserCheck
      case 'Pill':
        return Pill
      case 'Clock':
        return Clock
      default:
        return FileText
    }
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
      <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">Suggested Actions:</span>
      {actions.map((act) => {
        const IconComponent = getActionIcon(act.iconName)
        return (
          <button
            key={act.id}
            onClick={() => onActionClick(act)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-medium transition-all shadow-xs group text-xs"
          >
            <IconComponent className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
            <span>{act.label}</span>
            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )
      })}
    </div>
  )
}
