// Attachment 5-Step Upload Modal Component — Module-016

import React, { useState } from 'react'
import Button from '@/design-system/components/Button'
import Alert from '@/design-system/components/Alert'
import { X, UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react'
import type { IAttachmentCategory, IUploadAttachmentDto } from '../types/attachment.types'

interface AttachmentUploadModalProps {
  patientId: string
  categories: IAttachmentCategory[]
  uploading: boolean
  onClose: () => void
  onUploadSubmit: (dto: IUploadAttachmentDto) => Promise<boolean>
}

export const AttachmentUploadModal: React.FC<AttachmentUploadModalProps> = ({
  patientId,
  categories,
  uploading,
  onClose,
  onUploadSubmit,
}) => {
  const [file, setFile] = useState<File | null>(null)
  const [categoryId, setCategoryId] = useState<string>(categories[0]?.id || 'cat_01')
  const [description, setDescription] = useState<string>('')
  const [tagsInput, setTagsInput] = useState<string>('')
  const [validationError, setValidationError] = useState<string>('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationError('')
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0]
      if (selected.size > 50 * 1024 * 1024) {
        setValidationError('File size exceeds maximum allowed limit of 50 MB.')
        return
      }
      setFile(selected)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setValidationError('')
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0]
      if (selected.size > 50 * 1024 * 1024) {
        setValidationError('File size exceeds maximum allowed limit of 50 MB.')
        return
      }
      setFile(selected)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setValidationError('Please select a valid document or image to upload.')
      return
    }

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0)

    const success = await onUploadSubmit({
      patientId,
      file,
      categoryId,
      description,
      tags: tagsArray,
    })

    if (success) {
      onClose()
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--color-surface)',
          borderRadius: '0.75rem',
          border: '1px solid var(--color-border)',
          width: '100%',
          maxWidth: '560px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface-hover, #F8FAFC)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <UploadCloud size={22} style={{ color: 'var(--color-primary)' }} />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
              Upload Patient Attachment
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {validationError && (
            <Alert variant="danger" title="Validation Failed" style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <AlertCircle size={16} />
                <span>{validationError}</span>
              </div>
            </Alert>
          )}

          {/* Drag & Drop Area */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            style={{
              border: file ? '2px solid var(--color-primary)' : '2px dashed var(--color-border)',
              borderRadius: '0.5rem',
              padding: '1.5rem',
              textAlign: 'center',
              backgroundColor: file ? 'var(--color-primary-light, #EFF6FF)' : 'var(--color-surface)',
              marginBottom: '1.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <input
              type="file"
              id="file-upload-input"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg,.webp,.docx"
            />
            <label htmlFor="file-upload-input" style={{ cursor: 'pointer', display: 'block' }}>
              {file ? (
                <div>
                  <CheckCircle2 size={36} style={{ color: 'var(--color-primary)', margin: '0 auto 0.5rem auto' }} />
                  <div style={{ fontWeight: 600, color: 'var(--color-text-main)', fontSize: '0.95rem' }}>
                    {file.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • Click or drag another file to replace
                  </div>
                </div>
              ) : (
                <div>
                  <UploadCloud size={40} style={{ color: 'var(--color-text-muted)', margin: '0 auto 0.5rem auto' }} />
                  <div style={{ fontWeight: 600, color: 'var(--color-text-main)', fontSize: '0.95rem' }}>
                    Click to browse or drag file here
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                    Supports PDF, JPG, PNG, WEBP, and DOCX (Max 50 MB)
                  </div>
                </div>
              )}
            </label>
          </div>

          {/* Category Dropdown */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '0.35rem' }}>
              Attachment Category *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem',
                fontSize: '0.875rem',
                borderRadius: '0.375rem',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-main)',
              }}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '0.35rem' }}>
              Description & Clinical Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Pre-operative lab results for scheduled surgery..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                fontSize: '0.875rem',
                borderRadius: '0.375rem',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-main)',
                resize: 'vertical',
              }}
            />
          </div>

          {/* Tags */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '0.35rem' }}>
              Tags (Comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Urgent, Cardiology, Lab_2026"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                fontSize: '0.875rem',
                borderRadius: '0.375rem',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-main)',
              }}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
            <Button variant="outline" onClick={onClose} type="button" disabled={uploading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={uploading || !file}>
              {uploading ? 'Ingesting File...' : 'Upload Attachment'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
