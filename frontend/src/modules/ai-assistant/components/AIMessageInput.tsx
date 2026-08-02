// AI Message Input Component — Module-017

import React, { useState, useRef } from 'react'
import { Send, CornerDownLeft, MicOff, ImageOff } from 'lucide-react'

interface AIMessageInputProps {
  onSubmit: (queryText: string) => void
  isLoading: boolean
}

export function AIMessageInput({ onSubmit, isLoading }: AIMessageInputProps) {
  const [text, setText] = useState<string>('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || isLoading) return
    onSubmit(text)
    setText('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="relative flex items-end gap-2 bg-slate-50 dark:bg-slate-800/80 p-2 rounded-xl border border-slate-300 dark:border-slate-700 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 transition-all">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask AI Medical Assistant or enter query (e.g. 'Summarize Ahmed Ali', 'Today's revenue'). Press Enter to submit..."
          rows={2}
          disabled={isLoading}
          className="flex-1 bg-transparent border-0 focus:ring-0 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-xs resize-none p-1"
        />

        <div className="flex items-center gap-1.5 pb-1">
          {/* Reserved disabled voice dictation & OCR image buttons */}
          <button
            type="button"
            disabled
            title="Voice Dictation (V2 Reserved Extension)"
            className="p-1.5 rounded-lg text-slate-300 dark:text-slate-600 cursor-not-allowed"
          >
            <MicOff className="w-4 h-4" />
          </button>

          <button
            type="button"
            disabled
            title="OCR Attachment Upload (V2 Reserved Extension)"
            className="p-1.5 rounded-lg text-slate-300 dark:text-slate-600 cursor-not-allowed"
          >
            <ImageOff className="w-4 h-4" />
          </button>

          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className="flex items-center gap-1 px-3 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-semibold rounded-lg shadow-xs transition-all text-xs"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 px-1">
        <span className="flex items-center gap-1">
          <CornerDownLeft className="w-3 h-3" /> Press <b>Enter</b> to submit, <b>Shift+Enter</b> for new line
        </span>
        <span>Keyboard Shortcut: <b>Ctrl + K</b></span>
      </div>
    </form>
  )
}
