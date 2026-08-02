// Attachment Tag Input Component — Module-016

import React, { useState } from 'react'
import { Tag, X, Plus } from 'lucide-react'
import type { IAttachmentTag } from '../types/attachment.types'

interface AttachmentTagInputProps {
  tags: string[]
  availableTags?: IAttachmentTag[]
  onChange: (tags: string[]) => void
}

export const AttachmentTagInput: React.FC<AttachmentTagInputProps> = ({
  tags,
  availableTags = [],
  onChange,
}) => {
  const [inputVal, setInputVal] = useState('')

  const handleAddTag = (tagToAdd: string) => {
    const sanitized = tagToAdd.trim().replace(/^#/, '')
    if (sanitized && !tags.includes(sanitized)) {
      onChange([...tags, sanitized])
      setInputVal('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(tags.filter((t) => t !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      handleAddTag(inputVal)
    }
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.4rem 0.6rem',
          borderRadius: '0.375rem',
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-surface)',
          minHeight: '42px',
        }}
      >
        {tags.map((t) => (
          <span
            key={t}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.75rem',
              fontWeight: 600,
              padding: '0.15rem 0.45rem',
              borderRadius: '0.25rem',
              backgroundColor: 'var(--color-primary-light, #EFF6FF)',
              color: 'var(--color-primary)',
            }}
          >
            <Tag size={12} /> #{t}
            <button
              type="button"
              onClick={() => handleRemoveTag(t)}
              style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, color: 'var(--color-primary)' }}
            >
              <X size={12} />
            </button>
          </span>
        ))}

        <input
          type="text"
          placeholder={tags.length === 0 ? 'Type tag name and press Enter...' : 'Add tag...'}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            border: 'none',
            outline: 'none',
            fontSize: '0.85rem',
            flex: 1,
            minWidth: '120px',
            backgroundColor: 'transparent',
            color: 'var(--color-text-main)',
          }}
        />
      </div>

      {/* Suggested Tags Pills */}
      {availableTags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.4rem' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', alignSelf: 'center' }}>Suggested:</span>
          {availableTags
            .filter((at) => !tags.includes(at.name))
            .slice(0, 5)
            .map((at) => (
              <button
                key={at.id}
                type="button"
                onClick={() => handleAddTag(at.name)}
                style={{
                  border: '1px dashed var(--color-border)',
                  borderRadius: '0.25rem',
                  padding: '0.1rem 0.35rem',
                  fontSize: '0.7rem',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                }}
              >
                <Plus size={10} /> #{at.name}
              </button>
            ))}
        </div>
      )}
    </div>
  )
}
