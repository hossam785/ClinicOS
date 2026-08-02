// Attachment Dashboard Storage Widget Component — Module-016

import React from 'react'
import { HardDrive, FileText, Activity, ArrowUpRight } from 'lucide-react'
import type { IAttachmentAnalytics } from '../types/attachment.types'

interface AttachmentStorageWidgetProps {
  analytics: IAttachmentAnalytics | null
  onNavigateToWorkspace?: () => void
}

export const AttachmentStorageWidget: React.FC<AttachmentStorageWidgetProps> = ({
  analytics,
  onNavigateToWorkspace,
}) => {
  if (!analytics) return null

  const usedMB = (analytics.totalStorageBytes / (1024 * 1024)).toFixed(1)
  const limitGB = (analytics.storageLimitBytes / (1024 * 1024 * 1024)).toFixed(0)

  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg, 0.75rem)',
        border: '1px solid var(--color-border)',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <HardDrive size={20} style={{ color: 'var(--color-primary)' }} />
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
            Patient Attachment Telemetry
          </h3>
        </div>

        {onNavigateToWorkspace && (
          <button
            onClick={onNavigateToWorkspace}
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: 'var(--color-primary)',
              fontSize: '0.8rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.2rem',
            }}
          >
            Open Vault <ArrowUpRight size={14} />
          </button>
        )}
      </div>

      {/* Storage Progress */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
          <span style={{ color: 'var(--color-text-muted)' }}>Storage Quota Used</span>
          <span style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>
            {usedMB} MB of {limitGB} GB ({analytics.storageUsagePercentage}%)
          </span>
        </div>

        <div
          style={{
            height: '8px',
            width: '100%',
            backgroundColor: 'var(--color-surface-hover, #E2E8F0)',
            borderRadius: '999px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${Math.min(analytics.storageUsagePercentage, 100)}%`,
              backgroundColor: 'var(--color-primary)',
              borderRadius: '999px',
            }}
          />
        </div>
      </div>

      {/* Grid Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
        <div
          style={{
            backgroundColor: 'var(--color-surface-hover, #F8FAFC)',
            borderRadius: '0.5rem',
            padding: '0.75rem',
            border: '1px solid var(--color-border-light, #F1F5F9)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
            <FileText size={14} /> Index Files
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-main)', marginTop: '0.2rem' }}>
            {analytics.totalFiles} Documents
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--color-surface-hover, #F8FAFC)',
            borderRadius: '0.5rem',
            padding: '0.75rem',
            border: '1px solid var(--color-border-light, #F1F5F9)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
            <Activity size={14} /> Recent Activities
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-main)', marginTop: '0.2rem' }}>
            {analytics.recentActivity.length} Audit Events
          </div>
        </div>
      </div>
    </div>
  )
}
