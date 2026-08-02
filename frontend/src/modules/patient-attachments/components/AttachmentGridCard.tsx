// Attachment Grid Card Component — Module-016

import React, { useState } from 'react'
import { FileText, Image, Star, Eye, Download, MoreVertical, RotateCcw, Trash2, History, Tag } from 'lucide-react'
import type { IPatientAttachment } from '../types/attachment.types'

interface AttachmentGridCardProps {
  attachment: IPatientAttachment
  onPreview: (attachment: IPatientAttachment) => void
  onDownload: (attachment: IPatientAttachment) => void
  onOpenVersions: (attachment: IPatientAttachment) => void
  onToggleFavorite: (attachment: IPatientAttachment) => void
  onDelete: (attachment: IPatientAttachment) => void
  onRestore?: (attachment: IPatientAttachment) => void
}

export const AttachmentGridCard: React.FC<AttachmentGridCardProps> = ({
  attachment,
  onPreview,
  onDownload,
  onOpenVersions,
  onToggleFavorite,
  onDelete,
  onRestore,
}) => {
  const [menuOpen, setMenuOpen] = useState(false)

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const renderIcon = () => {
    if (attachment.mimeType.startsWith('image/')) {
      return <Image size={24} style={{ color: '#0284C7' }} />
    }
    if (attachment.mimeType === 'application/pdf') {
      return <FileText size={24} style={{ color: '#EF4444' }} />
    }
    return <FileText size={24} style={{ color: '#6B7280' }} />
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        borderRadius: 'var(--radius-md, 0.5rem)',
        border: '1px solid var(--color-border)',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
      }}
      className="hover:border-primary-500 hover:shadow-md"
    >
      {/* Top Header Box */}
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '0.375rem',
                backgroundColor: 'var(--color-surface-hover, #F8FAFC)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--color-border)',
              }}
            >
              {renderIcon()}
            </div>
            <div>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  padding: '0.15rem 0.45rem',
                  borderRadius: '999px',
                  backgroundColor: attachment.categoryColor ? `${attachment.categoryColor}15` : '#EFF6FF',
                  color: attachment.categoryColor || '#0284C7',
                }}
              >
                {attachment.categoryName}
              </span>
              <span
                style={{
                  marginLeft: '0.35rem',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.4rem',
                  borderRadius: '999px',
                  backgroundColor: 'var(--color-surface-hover, #E2E8F0)',
                  color: 'var(--color-text-main)',
                }}
              >
                v{attachment.version}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <button
              onClick={() => onToggleFavorite(attachment)}
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                color: attachment.isFavorite ? '#F59E0B' : 'var(--color-text-muted)',
                padding: '0.2rem',
              }}
              title="Toggle Favorite"
            >
              <Star size={16} fill={attachment.isFavorite ? '#F59E0B' : 'none'} />
            </button>

            {/* Menu Trigger */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-muted)',
                  padding: '0.2rem',
                }}
              >
                <MoreVertical size={16} />
              </button>

              {menuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '100%',
                    zIndex: 20,
                    width: '160px',
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '0.375rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    padding: '0.35rem 0',
                  }}
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      onPreview(attachment)
                    }}
                    style={menuItemStyle}
                  >
                    <Eye size={14} /> Preview
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      onDownload(attachment)
                    }}
                    style={menuItemStyle}
                  >
                    <Download size={14} /> Download
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      onOpenVersions(attachment)
                    }}
                    style={menuItemStyle}
                  >
                    <History size={14} /> Versions
                  </button>

                  {attachment.status === 'SOFT_DELETED' && onRestore ? (
                    <button
                      onClick={() => {
                        setMenuOpen(false)
                        onRestore(attachment)
                      }}
                      style={{ ...menuItemStyle, color: 'var(--color-primary)' }}
                    >
                      <RotateCcw size={14} /> Restore File
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setMenuOpen(false)
                        onDelete(attachment)
                      }}
                      style={{ ...menuItemStyle, color: 'var(--color-danger)' }}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* File Title */}
        <h4
          style={{
            margin: '0 0 0.4rem 0',
            fontSize: '0.9rem',
            fontWeight: 600,
            color: 'var(--color-text-main)',
            wordBreak: 'break-word',
            lineHeight: 1.3,
          }}
          title={attachment.originalFileName}
        >
          {attachment.originalFileName}
        </h4>

        {/* Description */}
        {attachment.description && (
          <p
            style={{
              margin: '0 0 0.5rem 0',
              fontSize: '0.8rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1.35,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {attachment.description}
          </p>
        )}

        {/* Tags */}
        {attachment.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.75rem' }}>
            {attachment.tags.map((t) => (
              <span
                key={t}
                style={{
                  fontSize: '0.7rem',
                  backgroundColor: 'var(--color-surface-hover, #F1F5F9)',
                  color: 'var(--color-text-muted)',
                  padding: '0.1rem 0.35rem',
                  borderRadius: '0.25rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                }}
              >
                <Tag size={10} /> #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div
        style={{
          borderTop: '1px solid var(--color-border-light, #F1F5F9)',
          paddingTop: '0.6rem',
          marginTop: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)',
        }}
      >
        <span>{formatFileSize(attachment.fileSize)}</span>
        <span>{attachment.uploadedAt.substring(0, 10)}</span>
      </div>
    </div>
  )
}

const menuItemStyle: React.CSSProperties = {
  width: '100%',
  textAlign: 'left',
  padding: '0.4rem 0.75rem',
  fontSize: '0.8rem',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  color: 'var(--color-text-main)',
}
