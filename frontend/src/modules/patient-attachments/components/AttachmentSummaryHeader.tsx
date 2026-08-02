// Attachment Summary Header Component — Module-016

import React from 'react'
import Button from '@/design-system/components/Button'
import { FileText, Plus, Folder, RefreshCw, HardDrive } from 'lucide-react'
import type { IAttachmentAnalytics } from '../types/attachment.types'

interface AttachmentSummaryHeaderProps {
  analytics: IAttachmentAnalytics | null
  totalCount: number
  onOpenUpload: () => void
  onOpenCategories: () => void
  onRefresh: () => void
}

export const AttachmentSummaryHeader: React.FC<AttachmentSummaryHeaderProps> = ({
  analytics,
  totalCount,
  onOpenUpload,
  onOpenCategories,
  onRefresh,
}) => {
  const usagePct = analytics ? analytics.storageUsagePercentage : 5
  const totalMB = analytics ? (analytics.totalStorageBytes / (1024 * 1024)).toFixed(1) : '9.4'

  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-lg, 0.75rem)',
        border: '1px solid var(--color-border)',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.5rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        {/* Left Stats Block */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '0.5rem',
                backgroundColor: 'var(--color-primary-light, #EFF6FF)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileText size={22} />
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block' }}>
                Total Patient Files
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                {totalCount} Documents
              </span>
            </div>
          </div>

          <div
            style={{
              width: '1px',
              height: '36px',
              backgroundColor: 'var(--color-border)',
            }}
          />

          {/* Storage Quota Progress */}
          <div style={{ minWidth: '180px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.35rem' }}>
              <span style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <HardDrive size={14} /> Storage Usage
              </span>
              <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{totalMB} MB ({usagePct}%)</span>
            </div>
            <div
              style={{
                height: '6px',
                width: '100%',
                backgroundColor: 'var(--color-border-light, #E2E8F0)',
                borderRadius: '999px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(usagePct, 100)}%`,
                  backgroundColor: usagePct > 85 ? 'var(--color-danger, #EF4444)' : 'var(--color-primary)',
                  borderRadius: '999px',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Button
            variant="outline"
            onClick={onRefresh}
            title="Refresh File List"
            style={{ display: 'inline-flex', alignItems: 'center', padding: '0.5rem 0.75rem' }}
          >
            <RefreshCw size={16} />
          </Button>

          <Button
            variant="outline"
            onClick={onOpenCategories}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Folder size={16} />
            <span>Manage Categories</span>
          </Button>

          <Button
            variant="primary"
            onClick={onOpenUpload}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={18} />
            <span>Upload New Attachment</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
