// AIAssistantWorkspaceView.tsx — Module-017

import { useNavigate } from 'react-router-dom'
import { useAIAssistant } from '../hooks/useAIAssistant'
import { AIStatusBar } from '../components/AIStatusBar'
import { AISafetyDisclaimerBanner } from '../components/AISafetyDisclaimerBanner'
import { AISessionHistorySidebar } from '../components/AISessionHistorySidebar'
import { AIConversationFeed } from '../components/AIConversationFeed'
import { AIQuickCommandsGrid } from '../components/AIQuickCommandsGrid'
import { AIContextPanel } from '../components/AIContextPanel'
import { AIMessageInput } from '../components/AIMessageInput'
import { AICommandBarOverlay } from '../components/AICommandBarOverlay'
import type { AISourceReference, AISuggestedAction, AIQuickCommand } from '../types/aiAssistant.types'

export default function AIAssistantWorkspaceView() {
  const navigate = useNavigate()
  const {
    serverStatus,
    quickCommands,
    sessions,
    activeSessionId,
    setActiveSessionId,
    messages,
    isLoading,
    isCommandBarOpen,
    setIsCommandBarOpen,
    contextState,
    submitQuery,
    createNewSession,
    clearMessages,
  } = useAIAssistant()

  const handleSourceClick = (source: AISourceReference) => {
    if (source.route) {
      navigate(source.route)
    }
  }

  const handleActionClick = (action: AISuggestedAction) => {
    if (action.actionType === 'NAVIGATE' && action.targetRoute) {
      navigate(action.targetRoute)
    } else if (action.actionType === 'PREFILL_PROMPT' && action.promptText) {
      submitQuery(action.promptText)
    }
  }

  const handleSelectQuickCommand = (cmd: AIQuickCommand) => {
    submitQuery(cmd.prompt)
  }

  return (
    <div className="flex flex-col h-[calc(100vh border-box)] max-h-screen bg-slate-100 dark:bg-slate-950 overflow-hidden font-sans">
      {/* Top AI Engine Health Bar */}
      <div className="p-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <AIStatusBar status={serverStatus} />
      </div>

      {/* Physician Safety Disclaimer Banner */}
      <AISafetyDisclaimerBanner />

      {/* Main 3-Column AI Assistant Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Local Sessions History Sidebar */}
        <div className="w-64 flex-shrink-0 hidden md:block">
          <AISessionHistorySidebar
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={setActiveSessionId}
            onNewSession={createNewSession}
            onClearSession={clearMessages}
          />
        </div>

        {/* Center Column: Conversation Feed & Input Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-900/40">
          {/* Main Feed Stream */}
          <AIConversationFeed
            messages={messages}
            isLoading={isLoading}
            onSourceClick={handleSourceClick}
            onActionClick={handleActionClick}
          />

          {/* Quick Commands Grid (Visible if short conversation) */}
          {messages.length <= 2 && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/30">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Quick Command Shortcuts
              </div>
              <AIQuickCommandsGrid commands={quickCommands} onSelectCommand={handleSelectQuickCommand} />
            </div>
          )}

          {/* Input Textarea Bar */}
          <AIMessageInput onSubmit={submitQuery} isLoading={isLoading} />
        </div>

        {/* Right Column: Context & Metadata Panel */}
        <div className="w-72 flex-shrink-0 hidden lg:block p-4 bg-slate-50 dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 overflow-y-auto">
          <AIContextPanel context={contextState} />
        </div>
      </div>

      {/* Ctrl+K Floating Command Launcher Modal */}
      <AICommandBarOverlay
        isOpen={isCommandBarOpen}
        onClose={() => setIsCommandBarOpen(false)}
        commands={quickCommands}
        onSubmitQuery={submitQuery}
      />
    </div>
  )
}
