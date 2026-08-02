// Custom React Hook for Desktop Offline Synchronization Engine — Module-018

import { useState, useEffect, useCallback } from 'react'
import type {
  ISyncStatusSummary,
  ISyncQueueItem,
  ISyncConflict,
  IFileSyncProgress,
  IDeviceStatus,
  ISyncLogEntry,
  ISyncDiagnostics,
  ISyncConfig,
} from '../types/syncEngine.types'
import { syncEngineApi } from '../services/syncEngineApi'

export function useSyncEngine() {
  const [status, setStatus] = useState<ISyncStatusSummary | null>(null)
  const [queue, setQueue] = useState<ISyncQueueItem[]>([])
  const [conflicts, setConflicts] = useState<ISyncConflict[]>([])
  const [fileTransfers, setFileTransfers] = useState<IFileSyncProgress[]>([])
  const [deviceStatus, setDeviceStatus] = useState<IDeviceStatus | null>(null)
  const [logs, setLogs] = useState<ISyncLogEntry[]>([])
  const [diagnostics, setDiagnostics] = useState<ISyncDiagnostics | null>(null)
  const [config, setConfig] = useState<ISyncConfig | null>(null)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSyncingNow, setIsSyncingNow] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<
    'QUEUE' | 'CONFLICTS' | 'FILES' | 'DEVICE' | 'HISTORY' | 'DIAGNOSTICS' | 'CONFIG'
  >('QUEUE')
  const [isCenterOpen, setIsCenterOpen] = useState<boolean>(false)

  const refreshAllData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [s, q, c, f, d, l, diag, cfg] = await Promise.all([
        syncEngineApi.getStatus(),
        syncEngineApi.getQueue(),
        syncEngineApi.getConflicts(),
        syncEngineApi.getFileTransfers(),
        syncEngineApi.getDeviceStatus(),
        syncEngineApi.getSyncLogs(),
        syncEngineApi.getDiagnostics(),
        syncEngineApi.getConfig(),
      ])

      setStatus(s)
      setQueue(q)
      setConflicts(c)
      setFileTransfers(f)
      setDeviceStatus(d)
      setLogs(l)
      setDiagnostics(diag)
      setConfig(cfg)
    } catch (err) {
      console.error('Failed to load sync engine data:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshAllData()
  }, [refreshAllData])

  // Global Ctrl + Shift + S keypress listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault()
        setIsCenterOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const triggerManualSync = async () => {
    setIsSyncingNow(true)
    try {
      await syncEngineApi.triggerManualSync()
      await refreshAllData()
    } finally {
      setIsSyncingNow(false)
    }
  }

  const resolveConflict = async (conflictId: string, choice: 'KEEP_LOCAL' | 'USE_REMOTE') => {
    await syncEngineApi.resolveConflict(conflictId, choice)
    await refreshAllData()
  }

  const retryQueueItem = async (queueId: string) => {
    await syncEngineApi.retryQueueItem(queueId)
    await refreshAllData()
  }

  const updateConfig = async (newConfig: Partial<ISyncConfig>) => {
    const updated = await syncEngineApi.updateConfig(newConfig)
    setConfig(updated)
  }

  return {
    status,
    queue,
    conflicts,
    fileTransfers,
    deviceStatus,
    logs,
    diagnostics,
    config,
    isLoading,
    isSyncingNow,
    activeTab,
    setActiveTab,
    isCenterOpen,
    setIsCenterOpen,
    triggerManualSync,
    resolveConflict,
    retryQueueItem,
    updateConfig,
    refreshAllData,
  }
}
