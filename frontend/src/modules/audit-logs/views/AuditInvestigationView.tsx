// Forensic Investigation Timeline Workspace View — ClinicOS

import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuditLogs } from '../hooks/useAuditLogs'
import { AuditCorrelationTimeline } from '../components/AuditCorrelationTimeline'
import { AuditDetailsModal } from '../components/AuditDetailsModal'
import { OfflineAuditBanner } from '../components/OfflineAuditBanner'

export const AuditInvestigationView: React.FC = () => {
  const { correlationId } = useParams<{ correlationId: string }>()
  const navigate = useNavigate()
  const activeCorrelationId = correlationId || ''

  const {
    logs,
    selectedRecord,
    isLoading,
    isOffline,
    fetchAuditLogs,
    inspectRecord,
    clearSelectedRecord,
  } = useAuditLogs({ page: 1, limit: 100 })

  useEffect(() => {
    fetchAuditLogs()
  }, [fetchAuditLogs])

  const handleBackToRoster = () => {
    navigate('/dashboard/audit-logs')
  }

  // Filter logs associated with the correlation ID
  const correlatedRecords = logs.filter(
    (r) => r.correlationId === activeCorrelationId || activeCorrelationId === ''
  )

  return (
    <div className="space-y-6 p-6">
      <OfflineAuditBanner isOffline={isOffline} />

      <AuditCorrelationTimeline
        correlationId={activeCorrelationId}
        records={correlatedRecords.length > 0 ? correlatedRecords : logs.slice(0, 3)}
        loading={isLoading}
        onBackToRoster={handleBackToRoster}
        onInspectRecord={inspectRecord}
      />

      <AuditDetailsModal
        record={selectedRecord}
        onClose={clearSelectedRecord}
      />
    </div>
  )
}
