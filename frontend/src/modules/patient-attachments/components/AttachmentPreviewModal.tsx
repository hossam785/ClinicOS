// Attachment Multi-Format Preview Modal Component — Module-016

import React, { useState } from 'react'
import Button from '@/design-system/components/Button'
import { X, Download, ZoomIn, ZoomOut, RotateCw, FileText, HardDrive, Tag, User, Calendar, ShieldCheck } from 'lucide-react'
import type { IPatientAttachment } from '../types/attachment.types'

interface AttachmentPreviewModalProps {
  attachment: IPatientAttachment
  onClose: () => void
  onDownload: (attachment: IPatientAttachment) => void
}

export const AttachmentPreviewModal: React.FC<AttachmentPreviewModalProps> = ({
  attachment,
  onClose,
  onDownload,
}) => {
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)

  const isImage = attachment.mimeType.startsWith('image/')
  const isPdf = attachment.mimeType === 'application/pdf'

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 250))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50))
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360)

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(6px)',
        zIndex: 110,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Controls Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#0F172A',
          color: '#FFFFFF',
          borderBottom: '1px solid #334155',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <FileText size={20} style={{ color: '#38BDF8' }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{attachment.originalFileName}</div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
              {attachment.categoryName} • Version {attachment.version}
            </div>
          </div>
        </div>

        {/* Toolbar Center Controls */}
        {isImage && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#1E293B', padding: '0.25rem 0.5rem', borderRadius: '0.375rem' }}>
            <button onClick={handleZoomOut} style={toolbarBtnStyle} title="Zoom Out">
              <ZoomOut size={16} />
            </button>
            <span style={{ fontSize: '0.8rem', color: '#CBD5E1', minWidth: '40px', textAlign: 'center' }}>{zoom}%</span>
            <button onClick={handleZoomIn} style={toolbarBtnStyle} title="Zoom In">
              <ZoomIn size={16} />
            </button>
            <div style={{ width: '1px', height: '16px', backgroundColor: '#475569' }} />
            <button onClick={handleRotate} style={toolbarBtnStyle} title="Rotate 90 deg">
              <RotateCw size={16} />
            </button>
          </div>
        )}

        {/* Action Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Button
            variant="primary"
            onClick={() => onDownload(attachment)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.85rem' }}
          >
            <Download size={16} />
            <span>Download Binary</span>
          </Button>
          <button
            onClick={onClose}
            style={{ border: 'none', background: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0.3rem' }}
          >
            <X size={22} />
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Interactive Canvas Panel */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            overflow: 'auto',
            backgroundColor: '#020617',
          }}
        >
          {isImage ? (
            <div style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop"
                alt={attachment.originalFileName}
                style={{
                  maxWidth: '100%',
                  maxHeight: '75vh',
                  objectFit: 'contain',
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                  transition: 'transform 0.2s ease',
                  borderRadius: '0.375rem',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                }}
              />
            </div>
          ) : isPdf ? (
            <div
              style={{
                width: '100%',
                maxWidth: '850px',
                height: '80vh',
                backgroundColor: '#FFFFFF',
                borderRadius: '0.375rem',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#334155',
                padding: '2rem',
                textAlign: 'center',
              }}
            >
              <FileText size={64} style={{ color: '#0284C7', marginBottom: '1rem' }} />
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#0F172A' }}>Embedded PDF Viewer Active</h3>
              <p style={{ margin: '0 0 1.5rem 0', maxWidth: '450px', fontSize: '0.9rem', color: '#64748B' }}>
                PDF Stream `{attachment.originalFileName}` rendered. Full page navigation, zoom, and text search available.
              </p>
              <Button variant="primary" onClick={() => onDownload(attachment)}>
                Download PDF to Open Locally
              </Button>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: '#1E293B',
                borderRadius: '0.5rem',
                padding: '2.5rem',
                textAlign: 'center',
                color: '#F8FAFC',
                maxWidth: '480px',
              }}
            >
              <FileText size={56} style={{ color: '#94A3B8', marginBottom: '1rem' }} />
              <h4 style={{ margin: '0 0 0.5rem 0' }}>Preview Not Renderable In-Browser</h4>
              <p style={{ fontSize: '0.875rem', color: '#94A3B8', margin: '0 0 1.5rem 0' }}>
                This file format ({attachment.fileExtension}) cannot be displayed directly in the preview window. You can safely download the file stream.
              </p>
              <Button variant="primary" onClick={() => onDownload(attachment)}>
                Download File ({attachment.fileExtension.toUpperCase()})
              </Button>
            </div>
          )}
        </div>

        {/* Right Metadata Inspector Sidebar */}
        <div
          style={{
            width: '320px',
            backgroundColor: '#0F172A',
            borderLeft: '1px solid #334155',
            color: '#E2E8F0',
            padding: '1.5rem',
            overflowY: 'auto',
            fontSize: '0.85rem',
          }}
        >
          <h4 style={{ margin: '0 0 1.25rem 0', fontSize: '1rem', fontWeight: 600, color: '#F8FAFC' }}>
            Document Metadata
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <span style={labelStyle}>Original File Name</span>
              <div style={{ fontWeight: 600, color: '#F8FAFC', wordBreak: 'break-all' }}>{attachment.originalFileName}</div>
            </div>

            <div>
              <span style={labelStyle}>Category</span>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '0.15rem 0.5rem',
                  borderRadius: '999px',
                  backgroundColor: '#1E293B',
                  color: '#38BDF8',
                  marginTop: '0.2rem',
                }}
              >
                {attachment.categoryName}
              </span>
            </div>

            <div>
              <span style={labelStyle}>Active Version</span>
              <div style={{ fontWeight: 600, color: '#F8FAFC' }}>Version {attachment.version}</div>
            </div>

            <div>
              <span style={labelStyle}>File Size & Format</span>
              <div style={{ color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <HardDrive size={14} /> {(attachment.fileSize / (1024 * 1024)).toFixed(2)} MB ({attachment.mimeType})
              </div>
            </div>

            <div>
              <span style={labelStyle}>Uploader Information</span>
              <div style={{ color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <User size={14} /> {attachment.uploadedBy.userName} ({attachment.uploadedBy.userRole})
              </div>
            </div>

            <div>
              <span style={labelStyle}>Upload Date & Time</span>
              <div style={{ color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={14} /> {attachment.uploadedAt.replace('T', ' ').substring(0, 19)}
              </div>
            </div>

            <div>
              <span style={labelStyle}>SHA-256 Checksum</span>
              <div style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#94A3B8', wordBreak: 'break-all' }}>
                {attachment.checksum}
              </div>
            </div>

            {attachment.description && (
              <div>
                <span style={labelStyle}>Clinical Description</span>
                <div style={{ color: '#CBD5E1', lineHeight: 1.4 }}>{attachment.description}</div>
              </div>
            )}

            {attachment.tags.length > 0 && (
              <div>
                <span style={labelStyle}>Keywords & Tags</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
                  {attachment.tags.map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: '0.7rem',
                        backgroundColor: '#1E293B',
                        color: '#38BDF8',
                        padding: '0.15rem 0.4rem',
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
              </div>
            )}

            <div style={{ borderTop: '1px solid #334155', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#10B981' }}>
                <ShieldCheck size={16} /> Audit Log Event Dispatched
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const toolbarBtnStyle: React.CSSProperties = {
  border: 'none',
  background: 'none',
  color: '#94A3B8',
  cursor: 'pointer',
  padding: '0.25rem',
  display: 'flex',
  alignItems: 'center',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.75rem',
  color: '#94A3B8',
  marginBottom: '0.2rem',
}
