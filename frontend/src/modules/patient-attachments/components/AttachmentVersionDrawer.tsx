// Attachment Historic Version Drawer Component — Module-016

import React, { useState } from 'react'
import Button from '@/design-system/components/Button'
import { X, History, Download, UploadCloud } from 'lucide-react'
import type { IPatientAttachment, IAttachmentVersion } from '../types/attachment.types'

interface AttachmentVersionDrawerProps {
  attachment: IPatientAttachment
  versions: IAttachmentVersion[]
  uploading: boolean
  onClose: () => void
  onDownloadVersion: (version: IAttachmentVersion) => void
  onReplaceVersion: (attachmentId: string, file: File, reason?: string) => Promise<boolean>
}

export const AttachmentVersionDrawer: React.FC<AttachmentVersionDrawerProps> = ({
  attachment,
  versions,
  uploading,
  onClose,
  onDownloadVersion,
  onReplaceVersion,
}) => {
  const [newFile, setNewFile] = useState<File | null>(null)
  const [changeReason, setChangeReason] = useState<string>('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewFile(e.target.files[0])
    }
  }

  const handleUploadNewVersion = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFile) return
    const success = await onReplaceVersion(attachment.id, newFile, changeReason)
    if (success) {
      setNewFile(null)
      setChangeReason('')
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(3px)',
        zIndex: 105,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--color-surface-hover, #F8FAFC)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <History size={20} style={{ color: 'var(--color-primary)' }} />
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                Version History & Replace
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                {attachment.originalFileName}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Upload New Version Section */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
          <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
            Upload Version {attachment.version + 1}
          </h4>

          <form onSubmit={handleUploadNewVersion}>
            <div style={{ marginBottom: '0.75rem' }}>
              <input
                type="file"
                id="replace-file-input"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <label
                htmlFor="replace-file-input"
                style={{
                  display: 'block',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px dashed var(--color-border)',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  color: 'var(--color-text-main)',
                  backgroundColor: newFile ? 'var(--color-primary-light, #EFF6FF)' : 'var(--color-surface-hover, #F8FAFC)',
                }}
              >
                {newFile ? (
                  <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                    {newFile.name} ({(newFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </span>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)' }}>
                    <UploadCloud size={16} /> Select replacement file
                  </span>
                )}
              </label>
            </div>

            {newFile && (
              <div style={{ marginBottom: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="Reason for replacing version (e.g. Corrected scan)..."
                  value={changeReason}
                  onChange={(e) => setChangeReason(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.85rem',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--color-border)',
                  }}
                />
              </div>
            )}

            {newFile && (
              <Button variant="primary" type="submit" disabled={uploading} style={{ width: '100%' }}>
                {uploading ? 'Ingesting New Version...' : `Save Version ${attachment.version + 1}`}
              </Button>
            )}
          </form>
        </div>

        {/* Version List Timeline */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
            Historic Versions Chain
          </h4>

          {versions.length === 0 ? (
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>No historical versions recorded.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
              {versions.map((ver, idx) => (
                <div
                  key={ver.id}
                  style={{
                    position: 'relative',
                    paddingLeft: '1.5rem',
                    borderLeft: '2px solid var(--color-border)',
                  }}
                >
                  {/* Timeline Dot */}
                  <div
                    style={{
                      position: 'absolute',
                      left: '-7px',
                      top: '0',
                      width: '12px',
                      height: '12px',
                      borderRadius: '999px',
                      backgroundColor: idx === 0 ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    }}
                  />

                  <div
                    style={{
                      backgroundColor: idx === 0 ? 'var(--color-primary-light, #EFF6FF)' : 'var(--color-surface-hover, #F8FAFC)',
                      borderRadius: '0.5rem',
                      border: '1px solid var(--color-border)',
                      padding: '0.85rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text-main)' }}>
                        Version {ver.versionNumber} {idx === 0 && <span style={{ color: 'var(--color-primary)', fontSize: '0.75rem' }}>(Active Latest)</span>}
                      </span>
                      <button
                        onClick={() => onDownloadVersion(ver)}
                        style={{
                          border: '1px solid var(--color-border)',
                          backgroundColor: 'var(--color-surface)',
                          borderRadius: '0.25rem',
                          padding: '0.2rem 0.4rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.75rem',
                        }}
                        title="Download Historic Version"
                      >
                        <Download size={12} /> Download
                      </button>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>
                      {(ver.fileSize / (1024 * 1024)).toFixed(2)} MB • Uploaded {ver.uploadedAt.substring(0, 10)}
                    </div>

                    {ver.changeReason && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-main)', fontStyle: 'italic' }}>
                        "{ver.changeReason}"
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
