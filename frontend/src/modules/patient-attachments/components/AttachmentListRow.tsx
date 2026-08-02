// Attachment List Row Component — Module-016

import React from 'react'
import { FileText, Image, Star, Eye, Download, History, Trash2, RotateCcw } from 'lucide-react'
import type { IPatientAttachment } from '../types/attachment.types'

interface AttachmentListRowProps {
  attachment: IPatientAttachment
  onPreview: (attachment: IPatientAttachment) => void
  onDownload: (attachment: IPatientAttachment) => void
  onOpenVersions: (attachment: IPatientAttachment) => void
  onToggleFavorite: (attachment: IPatientAttachment) => void
  onDelete: (attachment: IPatientAttachment) => void
  onRestore?: (attachment: IPatientAttachment) => void
}

export const AttachmentListRow: React.FC<AttachmentListRowProps> = ({
  attachment,
  onPreview,
  onDownload,
  onOpenVersions,
  onToggleFavorite,
  onDelete,
  onRestore,
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const renderIcon = () => {
    if (attachment.mimeType.startsWith('image/')) {
      return <Image size={18} style={{ color: '#0284C7' }} />
    }
    return <FileText size={18} style={{ color: '#EF4444' }} />
  }

  return (
    <tr
      style={{
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-surface)',
        fontSize: '0.85rem',
      }}
    >
      {/* Favorite Star */}
      <td style={{ padding: '0.75rem 0.5rem', width: '32px', textAlign: 'center' }}>
        <button
          onClick={() => onToggleFavorite(attachment)}
          style={{ border: 'none', background: 'none', cursor: 'pointer', color: attachment.isFavorite ? '#F59E0B' : 'var(--color-text-muted)' }}
        >
          <Star size={15} fill={attachment.isFavorite ? '#F59E0B' : 'none'} />
        </button>
      </td>

      {/* File Info */}
      <td style={{ padding: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {renderIcon()}
          <div>
            <span style={{ fontWeight: 600, color: 'var(--color-text-main)', display: 'block' }}>
              {attachment.originalFileName}
            </span>
            {attachment.description && (
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                {attachment.description}
              </span>
            )}
          </div>
        </div>
      </td>

      {/* Category */}
      <td style={{ padding: '0.75rem' }}>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '0.15rem 0.45rem',
            borderRadius: '999px',
            backgroundColor: attachment.categoryColor ? `${attachment.categoryColor}15` : '#EFF6FF',
            color: attachment.categoryColor || '#0284C7',
          }}
        >
          {attachment.categoryName}
        </span>
      </td>

      {/* Version */}
      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
        <span style={{ fontWeight: 700, fontSize: '0.75rem', color: 'var(--color-text-main)' }}>
          v{attachment.version}
        </span>
      </td>

      {/* Size */}
      <td style={{ padding: '0.75rem', color: 'var(--color-text-muted)' }}>
        {formatFileSize(attachment.fileSize)}
      </td>

      {/* Uploader & Date */}
      <td style={{ padding: '0.75rem', color: 'var(--color-text-muted)' }}>
        <div>{attachment.uploadedBy.userName}</div>
        <div style={{ fontSize: '0.75rem' }}>{attachment.uploadedAt.substring(0, 10)}</div>
      </td>

      {/* Actions */}
      <td style={{ padding: '0.75rem', textAlign: 'right' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.35rem' }}>
          <button
            onClick={() => onPreview(attachment)}
            style={actionBtnStyle}
            title="Preview File"
          >
            <Eye size={15} />
          </button>
          <button
            onClick={() => onDownload(attachment)}
            style={actionBtnStyle}
            title="Download File"
          >
            <Download size={15} />
          </button>
          <button
            onClick={() => onOpenVersions(attachment)}
            style={actionBtnStyle}
            title="Version History"
          >
            <History size={15} />
          </button>

          {attachment.status === 'SOFT_DELETED' && onRestore ? (
            <button
              onClick={() => onRestore(attachment)}
              style={{ ...actionBtnStyle, color: 'var(--color-primary)' }}
              title="Restore File"
            >
              <RotateCcw size={15} />
            </button>
          ) : (
            <button
              onClick={() => onDelete(attachment)}
              style={{ ...actionBtnStyle, color: 'var(--color-danger)' }}
              title="Delete File"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}

const actionBtnStyle: React.CSSProperties = {
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  borderRadius: '0.25rem',
  padding: '0.3rem 0.45rem',
  cursor: 'pointer',
  color: 'var(--color-text-muted)',
}
