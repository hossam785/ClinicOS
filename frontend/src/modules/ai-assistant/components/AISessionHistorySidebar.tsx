// AI Session History Sidebar Component — Module-017

import type { IAISession } from '../types/aiAssistant.types'
import { Plus, MessageSquare, Pin, Trash2 } from 'lucide-react'

interface AISessionHistorySidebarProps {
  sessions: IAISession[]
  activeSessionId: string
  onSelectSession: (sessionId: string) => void
  onNewSession: () => void
  onClearSession?: () => void
}

export function AISessionHistorySidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onClearSession,
}: AISessionHistorySidebarProps) {
  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900/80 border-r border-slate-200 dark:border-slate-800 p-3 text-xs">
      {/* New Session Action Button */}
      <button
        onClick={onNewSession}
        className="w-full flex items-center justify-center gap-2 p-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-sm transition-all mb-4"
      >
        <Plus className="w-4 h-4" />
        <span>New Clinical Session</span>
      </button>

      {/* Sessions History List */}
      <div className="flex-1 overflow-y-auto space-y-1">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
          Local Sessions ({sessions.length})
        </div>

        {sessions.map((sess) => {
          const isActive = sess.sessionId === activeSessionId
          return (
            <button
              key={sess.sessionId}
              onClick={() => onSelectSession(sess.sessionId)}
              className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left transition-all ${
                isActive
                  ? 'bg-white dark:bg-slate-800 text-primary-700 dark:text-primary-300 font-semibold shadow-xs border border-slate-200 dark:border-slate-700'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center gap-2 truncate pr-2">
                <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-primary-600' : 'text-slate-400'}`} />
                <span className="truncate">{sess.title}</span>
              </div>
              {sess.isPinned && <Pin className="w-3 h-3 text-amber-500 flex-shrink-0" />}
            </button>
          )
        })}
      </div>

      {/* Clear Sessions Button */}
      {onClearSession && (
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClearSession}
            className="w-full flex items-center justify-center gap-1.5 p-2 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Ephemeral Memory</span>
          </button>
        </div>
      )}
    </div>
  )
}
