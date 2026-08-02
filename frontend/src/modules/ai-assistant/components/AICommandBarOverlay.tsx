// AI Command Bar Overlay Component (Ctrl+K Launcher) — Module-017

import { useState, useEffect } from 'react'
import type { AIQuickCommand } from '../types/aiAssistant.types'
import { Sparkles, Command, X, ArrowRight, UserSearch, FileText, Calendar, BarChart3 } from 'lucide-react'

interface AICommandBarOverlayProps {
  isOpen: boolean
  onClose: () => void
  commands: AIQuickCommand[]
  onSubmitQuery: (queryText: string) => void
}

export function AICommandBarOverlay({
  isOpen,
  onClose,
  commands,
  onSubmitQuery,
}: AICommandBarOverlayProps) {
  const [query, setQuery] = useState<string>('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSelectCommand = (cmd: AIQuickCommand) => {
    onSubmitQuery(cmd.prompt)
    setQuery('')
    onClose()
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    onSubmitQuery(query)
    setQuery('')
    onClose()
  }

  const filteredCommands = query.trim()
    ? commands.filter(
        (c) =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.description.toLowerCase().includes(query.toLowerCase()) ||
          c.prompt.toLowerCase().includes(query.toLowerCase())
      )
    : commands

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-950/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        {/* Header Input Bar */}
        <form onSubmit={handleFormSubmit} className="flex items-center gap-3 p-4 border-b border-slate-200 dark:border-slate-800">
          <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 animate-pulse" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type natural language command or patient name (e.g. 'Open Ahmed Ali', 'Today's revenue')..."
            className="flex-1 bg-transparent border-0 focus:ring-0 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm font-medium"
          />
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              <Command className="w-3 h-3" /> K
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Command Completion List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
            Suggested Quick Commands ({filteredCommands.length})
          </div>

          {filteredCommands.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              No matching AI commands found. Press Enter to submit raw text query.
            </div>
          ) : (
            filteredCommands.map((cmd) => (
              <button
                key={cmd.id}
                onClick={() => handleSelectCommand(cmd)}
                className="w-full flex items-center justify-between p-3 rounded-xl text-left hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-primary-600 dark:text-primary-400 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    {cmd.category === 'PATIENT' ? (
                      <UserSearch className="w-4 h-4" />
                    ) : cmd.category === 'CLINICAL' ? (
                      <FileText className="w-4 h-4" />
                    ) : cmd.category === 'NAVIGATION' ? (
                      <Calendar className="w-4 h-4" />
                    ) : (
                      <BarChart3 className="w-4 h-4" />
                    )}
                  </div>
                  <div className="truncate">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {cmd.title}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">{cmd.description}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-slate-400 text-xs font-mono group-hover:text-primary-600 transition-colors">
                  <span>Run</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer Shortcut Guide */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>100% Offline AI Command Launcher</span>
          <span>Press <b>ESC</b> to exit</span>
        </div>
      </div>
    </div>
  )
}
