// AI Source Reference Pills Component — Module-017

import type { AISourceReference } from '../types/aiAssistant.types'
import { ExternalLink, FileText, UserCheck, Calendar, Pill, Paperclip, BarChart } from 'lucide-react'

interface AISourceReferencePillsProps {
  sources: AISourceReference[]
  onSourceClick?: (source: AISourceReference) => void
}

export function AISourceReferencePills({ sources, onSourceClick }: AISourceReferencePillsProps) {
  if (!sources || sources.length === 0) return null

  const getSourceIcon = (type: AISourceReference['entityType']) => {
    switch (type) {
      case 'PATIENT':
        return UserCheck
      case 'MEDICAL_RECORD':
        return FileText
      case 'APPOINTMENT':
        return Calendar
      case 'PRESCRIPTION':
        return Pill
      case 'ATTACHMENT':
        return Paperclip
      case 'REPORT':
        return BarChart
      default:
        return FileText
    }
  }

  return (
    <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
      <div className="text-slate-500 font-medium mb-1.5 flex items-center gap-1 text-[11px] uppercase tracking-wider">
        <span>Verified Evidence Sources ({sources.length}):</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {sources.map((src, idx) => {
          const IconComponent = getSourceIcon(src.entityType)
          return (
            <button
              key={`${src.entityId}_${idx}`}
              onClick={() => onSourceClick && onSourceClick(src)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:hover:bg-blue-900/80 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-medium transition-colors group"
              title={`Click to view source: ${src.title}`}
            >
              <IconComponent className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{src.title}</span>
              <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity ml-0.5" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
