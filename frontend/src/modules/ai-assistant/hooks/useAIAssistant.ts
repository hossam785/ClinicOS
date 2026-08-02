// Custom React Hook for Offline AI Medical Assistant — Module-017

import { useState, useEffect, useCallback } from 'react'
import type {
  IAIMessage,
  IAISession,
  AIServerStatus,
  AIQuickCommand,
  IAIContextState,
} from '../types/aiAssistant.types'
import { aiAssistantApi } from '../services/aiAssistantApi'

export function useAIAssistant() {
  const [serverStatus, setServerStatus] = useState<AIServerStatus | null>(null)
  const [quickCommands, setQuickCommands] = useState<AIQuickCommand[]>([])
  const [sessions, setSessions] = useState<IAISession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string>('ais_101')
  const [messages, setMessages] = useState<IAIMessage[]>([
    {
      messageId: 'msg_welcome',
      sessionId: 'ais_101',
      sender: 'ASSISTANT',
      content:
        'Offline AI Medical Assistant is online and running 100% locally. Enter natural language queries, patient names, MRN numbers, or select a quick command shortcut.',
      timestamp: new Date().toISOString(),
      confidenceScore: 1.0,
      confidenceLevel: 'HIGH',
      dataSources: [],
    },
  ])

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isCommandBarOpen, setIsCommandBarOpen] = useState<boolean>(false)
  const [contextState, setContextState] = useState<IAIContextState>({
    activePatientId: 'pat_101',
    activePatientName: 'Ahmed Ali',
    activePatientMrn: 'MRN-2026-0042',
    activeModule: 'Medical Assistant Workspace',
    appliedRoleScope: 'DOCTOR',
    tenantId: 'tenant-default',
    clinicId: 'clinic-default',
  })

  // Fetch engine status & quick commands on mount
  useEffect(() => {
    let isMounted = true

    const loadInitialData = async () => {
      try {
        const [statusData, commandsData, sessionsData] = await Promise.all([
          aiAssistantApi.getServerStatus(),
          aiAssistantApi.getQuickCommands(),
          aiAssistantApi.getSessions(),
        ])

        if (isMounted) {
          setServerStatus(statusData)
          setQuickCommands(commandsData)
          setSessions(sessionsData)
        }
      } catch (err) {
        console.error('Failed to initialize AI Assistant frontend data:', err)
      }
    }

    loadInitialData()

    return () => {
      isMounted = false
    }
  }, [])

  // Listen for Ctrl+K or Cmd+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsCommandBarOpen((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const submitQuery = useCallback(
    async (queryText: string) => {
      if (!queryText.trim() || isLoading) return

      const userMsg: IAIMessage = {
        messageId: `msg_${Date.now()}_user`,
        sessionId: activeSessionId,
        sender: 'USER',
        content: queryText,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, userMsg])
      setIsLoading(true)

      try {
        const res = await aiAssistantApi.submitQuery({
          sessionId: activeSessionId,
          queryText,
          context: contextState,
        })

        const aiMsg: IAIMessage = {
          messageId: `msg_${Date.now()}_ai`,
          sessionId: activeSessionId,
          sender: 'ASSISTANT',
          content: res.answer,
          timestamp: res.generatedAt,
          confidenceScore: res.confidenceScore,
          confidenceLevel: res.confidenceLevel,
          dataSources: res.dataSources,
          suggestedActions: res.suggestedActions,
          navigationTarget: res.navigationTarget,
        }

        setMessages((prev) => [...prev, aiMsg])
      } catch (err: unknown) {
        const errorMsg: IAIMessage = {
          messageId: `msg_${Date.now()}_err`,
          sessionId: activeSessionId,
          sender: 'ASSISTANT',
          content: 'An error occurred while executing local AI query.',
          timestamp: new Date().toISOString(),
          isError: true,
          errorMessage: err instanceof Error ? err.message : 'Unknown AI engine error',
        }
        setMessages((prev) => [...prev, errorMsg])
      } finally {
        setIsLoading(false)
      }
    },
    [activeSessionId, contextState, isLoading]
  )

  const createNewSession = useCallback(() => {
    const newSessionId = `ais_${Date.now()}`
    const newSess: IAISession = {
      sessionId: newSessionId,
      title: 'New Clinical Session',
      startedAt: new Date().toISOString(),
      lastActivityAt: new Date().toISOString(),
      isPinned: false,
      turnCount: 0,
    }
    setSessions((prev) => [newSess, ...prev])
    setActiveSessionId(newSessionId)
    setMessages([
      {
        messageId: `msg_welcome_${newSessionId}`,
        sessionId: newSessionId,
        sender: 'ASSISTANT',
        content: 'New session started. How can I assist you with clinical workspace data?',
        timestamp: new Date().toISOString(),
        confidenceScore: 1.0,
        confidenceLevel: 'HIGH',
        dataSources: [],
      },
    ])
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return {
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
    setContextState,
    submitQuery,
    createNewSession,
    clearMessages,
  }
}
