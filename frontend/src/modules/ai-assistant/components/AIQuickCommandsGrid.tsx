// AI Quick Commands Grid Component — Module-017

import type { AIQuickCommand } from '../types/aiAssistant.types'
import { UserSearch, FileText, Calendar, Paperclip, BarChart3, Clock, Pill, AlertTriangle } from 'lucide-react'

interface AIQuickCommandsGridProps {
  commands: AIQuickCommand[]
  onSelectCommand: (command: AIQuickCommand) => void
}

export function AIQuickCommandsGrid({ commands, onSelectCommand }: AIQuickCommandsGridProps) {
  const getIcon = (name: string) => {
    switch (name) {
      case 'UserSearch':
        return UserSearch
      case 'FileText':
        return FileText
      case 'Calendar':
        return Calendar
      case 'Paperclip':
        return Paperclip
      case 'BarChart3':
        return BarChart3
      case 'Clock':
        return Clock
      case 'Pill':
        return Pill
      case 'AlertTriangle':
        return AlertTriangle
      default:
        return FileText
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
      {commands.map((cmd) => {
        const IconComp = getIcon(cmd.iconName)
        return (
          <button
            key={cmd.id}
            onClick={() => onSelectCommand(cmd)}
            className="flex flex-col text-left p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary-500 dark:hover:border-primary-500 rounded-xl shadow-xs hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                <IconComp className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                {cmd.category}
              </span>
            </div>
            <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {cmd.title}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
              {cmd.description}
            </span>
          </button>
        )
      })}
    </div>
  )
}
