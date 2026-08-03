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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 90px)',
        maxHeight: 'calc(100vh - 90px)',
        backgroundColor: 'var(--color-bg-base)',
        color: 'var(--color-text-main)',
        borderRadius: 'var(--radius-xl, 16px)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Top AI Engine Health Bar */}
      <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--color-bg-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <AIStatusBar status={serverStatus} />
      </div>

      {/* Physician Safety Disclaimer Banner */}
      <AISafetyDisclaimerBanner />

      {/* Main 3-Column AI Assistant Workspace */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }}>
        {/* Left Column: Local Sessions History Sidebar */}
        <div style={{ width: '260px', flexShrink: 0, borderRight: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-surface)', display: 'flex', flexDirection: 'column' }}>
          <AISessionHistorySidebar
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={setActiveSessionId}
            onNewSession={createNewSession}
            onClearSession={clearMessages}
          />
        </div>

        {/* Center Column: Conversation Feed & Input Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, backgroundColor: 'var(--color-bg-base)' }}>
          {/* Main Feed Stream */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
            <AIConversationFeed
              messages={messages}
              isLoading={isLoading}
              onSourceClick={handleSourceClick}
              onActionClick={handleActionClick}
            />
          </div>

          {/* Quick Commands Grid (Visible if short conversation) */}
          {messages.length <= 2 && (
            <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-surface)' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Quick Command Shortcuts
              </div>
              <AIQuickCommandsGrid commands={quickCommands} onSelectCommand={handleSelectQuickCommand} />
            </div>
          )}

          {/* Input Textarea Bar */}
          <AIMessageInput onSubmit={submitQuery} isLoading={isLoading} />
        </div>

        {/* Right Column: Context & Metadata Panel */}
        <div style={{ width: '280px', flexShrink: 0, borderLeft: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-surface)', padding: '1rem', overflowY: 'auto' }}>
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
