// AI Conversation Feed Component — Module-017

import { useRef, useEffect } from 'react'
import type { IAIMessage, AISourceReference, AISuggestedAction } from '../types/aiAssistant.types'
import { AIConfidenceBadge } from './AIConfidenceBadge'
import { AISourceReferencePills } from './AISourceReferencePills'
import { AISuggestedActionsBar } from './AISuggestedActionsBar'
import { Sparkles, User, AlertCircle, Bot } from 'lucide-react'

interface AIConversationFeedProps {
  messages: IAIMessage[]
  isLoading: boolean
  onSourceClick?: (source: AISourceReference) => void
  onActionClick?: (action: AISuggestedAction) => void
}

export function AIConversationFeed({
  messages,
  isLoading,
  onSourceClick,
  onActionClick,
}: AIConversationFeedProps) {
  const feedEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  if (!messages || messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <Sparkles className="w-12 h-12 text-primary-500/40 mb-3" />
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">
          Offline AI Medical Assistant Workspace
        </h3>
        <p className="text-xs max-w-sm text-slate-500 mt-1">
          Enter natural language queries, patient names, MRN numbers, or select a quick command.
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg) => {
        const isUser = msg.sender === 'USER'

        return (
          <div
            key={msg.messageId}
            className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar Icon */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-xs shadow-xs ${
                isUser
                  ? 'bg-slate-700 dark:bg-slate-600'
                  : msg.isError
                  ? 'bg-rose-600'
                  : 'bg-primary-600'
              }`}
            >
              {isUser ? <User className="w-4 h-4" /> : msg.isError ? <AlertCircle className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Message Bubble Card */}
            <div
              className={`max-w-[85%] rounded-xl p-4 shadow-xs border text-xs leading-relaxed ${
                isUser
                  ? 'bg-primary-600 text-white border-primary-500'
                  : msg.isError
                  ? 'bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-800'
                  : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Header metadata for AI responses */}
              {!isUser && !msg.isError && (
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                    Clinical Assistant
                  </span>
                  <AIConfidenceBadge score={msg.confidenceScore} level={msg.confidenceLevel} />
                </div>
              )}

              {/* Message Content */}
              <div className="whitespace-pre-wrap">{msg.content}</div>

              {/* Data Sources Pills */}
              {!isUser && msg.dataSources && msg.dataSources.length > 0 && (
                <AISourceReferencePills sources={msg.dataSources} onSourceClick={onSourceClick} />
              )}

              {/* Suggested Actions Bar */}
              {!isUser && msg.suggestedActions && msg.suggestedActions.length > 0 && onActionClick && (
                <AISuggestedActionsBar actions={msg.suggestedActions} onActionClick={onActionClick} />
              )}
            </div>
          </div>
        )
      })}

      {/* Loading Skeleton Indicator */}
      {isLoading && (
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 animate-spin" />
          </div>
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs text-xs text-slate-500 animate-pulse flex items-center gap-2">
            <span>Querying local FTS5 EMR index & processing inference...</span>
          </div>
        </div>
      )}

      <div ref={feedEndRef} />
    </div>
  )
}
