// Attachment Category Manager Modal Component — Module-016

import React, { useState } from 'react'
import Button from '@/design-system/components/Button'
import { X, Folder, Plus, Check } from 'lucide-react'
import type { IAttachmentCategory } from '../types/attachment.types'

interface AttachmentCategoryManagerModalProps {
  categories: IAttachmentCategory[]
  onClose: () => void
  onAddCategory: (name: string, color: string, icon: string) => Promise<boolean>
}

const PRESET_COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#06B6D4', '#EC4899', '#6366F1', '#14B8A6', '#F43F5E', '#64748B']

export const AttachmentCategoryManagerModal: React.FC<AttachmentCategoryManagerModalProps> = ({
  categories,
  onClose,
  onAddCategory,
}) => {
  const [name, setName] = useState('')
  const [color, setColor] = useState('#3B82F6')
  const [adding, setAdding] = useState(false)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setAdding(true)
    const success = await onAddCategory(name.trim(), color, 'Folder')
    setAdding(false)
    if (success) {
      setName('')
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
          maxWidth: '520px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
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
            <Folder size={20} style={{ color: 'var(--color-primary)' }} />
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
              Clinic Attachment Categories
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form to Add Category */}
        <form onSubmit={handleAdd} style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>
          <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
            Create Custom Category
          </h4>

          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <input
              type="text"
              placeholder="Category Name (e.g. Operative Report)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                flex: 1,
                padding: '0.55rem 0.75rem',
                fontSize: '0.875rem',
                borderRadius: '0.375rem',
                border: '1px solid var(--color-border)',
                backgroundColor: 'var(--color-surface)',
              }}
            />
            <Button variant="primary" type="submit" disabled={adding || !name.trim()}>
              <Plus size={16} /> Add
            </Button>
          </div>

          {/* Color Picker Presets */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginRight: '0.4rem' }}>Color Token:</span>
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '999px',
                  backgroundColor: c,
                  border: color === c ? '2px solid #000' : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {color === c && <Check size={12} style={{ color: '#FFF' }} />}
              </button>
            ))}
          </div>
        </form>

        {/* Existing Categories List */}
        <div style={{ padding: '1.25rem 1.5rem', maxHeight: '280px', overflowY: 'auto' }}>
          <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
            Active Categories Catalog ({categories.length})
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {categories.map((cat) => (
              <div
                key={cat.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-surface)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '999px', backgroundColor: cat.color }} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                    {cat.name}
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Order #{cat.displayOrder}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
