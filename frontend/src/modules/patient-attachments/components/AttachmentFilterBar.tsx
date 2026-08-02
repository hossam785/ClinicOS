// Attachment Filter Bar Component — Module-016

import React from 'react'
import { Search, Star, Trash2, LayoutGrid, List } from 'lucide-react'
import type { IAttachmentCategory, IAttachmentTag, IAttachmentFilterOptions } from '../types/attachment.types'

interface AttachmentFilterBarProps {
  filterOptions: IAttachmentFilterOptions
  categories: IAttachmentCategory[]
  tags: IAttachmentTag[]
  viewMode: 'grid' | 'list'
  onFilterChange: (newOptions: Partial<IAttachmentFilterOptions>) => void
  onViewModeChange: (mode: 'grid' | 'list') => void
}

export const AttachmentFilterBar: React.FC<AttachmentFilterBarProps> = ({
  filterOptions,
  categories,
  tags,
  viewMode,
  onFilterChange,
  onViewModeChange,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '1.25rem',
      }}
    >
      {/* Left Search and Dropdowns */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
        {/* Instant Search Input */}
        <div style={{ position: 'relative', minWidth: '240px', flex: '1 1 240px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--color-text-muted)',
            }}
          />
          <input
            type="text"
            placeholder="Search by file name, category, or tags..."
            value={filterOptions.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            style={{
              width: '100%',
              paddingLeft: '2.3rem',
              paddingRight: '0.75rem',
              paddingTop: '0.5rem',
              paddingBottom: '0.5rem',
              fontSize: '0.875rem',
              borderRadius: '0.375rem',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-main)',
            }}
          />
        </div>

        {/* Category Dropdown */}
        <select
          value={filterOptions.categoryId || ''}
          onChange={(e) => onFilterChange({ categoryId: e.target.value || undefined })}
          style={{
            padding: '0.5rem 0.75rem',
            fontSize: '0.875rem',
            borderRadius: '0.375rem',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text-main)',
          }}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Tags Dropdown */}
        {tags.length > 0 && (
          <select
            value={filterOptions.tag || ''}
            onChange={(e) => onFilterChange({ tag: e.target.value || undefined })}
            style={{
              padding: '0.5rem 0.75rem',
              fontSize: '0.875rem',
              borderRadius: '0.375rem',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text-main)',
            }}
          >
            <option value="">All Tags</option>
            {tags.map((t) => (
              <option key={t.id} value={t.name}>
                #{t.name}
              </option>
            ))}
          </select>
        )}

        {/* Sort Select */}
        <select
          value={`${filterOptions.sortBy || 'createdAt'}-${filterOptions.sortOrder || 'desc'}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-') as ['createdAt' | 'fileName' | 'fileSize', 'asc' | 'desc']
            onFilterChange({ sortBy, sortOrder })
          }}
          style={{
            padding: '0.5rem 0.75rem',
            fontSize: '0.875rem',
            borderRadius: '0.375rem',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text-main)',
          }}
        >
          <option value="createdAt-desc">Newest Uploads First</option>
          <option value="createdAt-asc">Oldest Uploads First</option>
          <option value="fileName-asc">File Name (A-Z)</option>
          <option value="fileSize-desc">File Size (Largest First)</option>
        </select>
      </div>

      {/* Right Controls: Favorites, Trash, and View Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          onClick={() => onFilterChange({ favoritesOnly: !filterOptions.favoritesOnly })}
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: '0.375rem',
            border: '1px solid var(--color-border)',
            backgroundColor: filterOptions.favoritesOnly ? 'var(--color-warning-light, #FEF3C7)' : 'var(--color-surface)',
            color: filterOptions.favoritesOnly ? '#B45309' : 'var(--color-text-muted)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          <Star size={15} fill={filterOptions.favoritesOnly ? '#F59E0B' : 'none'} />
          <span>Starred</span>
        </button>

        <button
          onClick={() =>
            onFilterChange({
              status: filterOptions.status === 'SOFT_DELETED' ? 'ACTIVE' : 'SOFT_DELETED',
            })
          }
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: '0.375rem',
            border: '1px solid var(--color-border)',
            backgroundColor: filterOptions.status === 'SOFT_DELETED' ? 'var(--color-danger-light, #FEE2E2)' : 'var(--color-surface)',
            color: filterOptions.status === 'SOFT_DELETED' ? 'var(--color-danger)' : 'var(--color-text-muted)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          <Trash2 size={15} />
          <span>{filterOptions.status === 'SOFT_DELETED' ? 'Viewing Trash' : 'Trash'}</span>
        </button>

        <div style={{ display: 'flex', border: '1px solid var(--color-border)', borderRadius: '0.375rem', overflow: 'hidden' }}>
          <button
            onClick={() => onViewModeChange('grid')}
            style={{
              padding: '0.45rem 0.6rem',
              border: 'none',
              backgroundColor: viewMode === 'grid' ? 'var(--color-primary)' : 'var(--color-surface)',
              color: viewMode === 'grid' ? '#FFFFFF' : 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Grid View"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            style={{
              padding: '0.45rem 0.6rem',
              border: 'none',
              backgroundColor: viewMode === 'list' ? 'var(--color-primary)' : 'var(--color-surface)',
              color: viewMode === 'list' ? '#FFFFFF' : 'var(--color-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Table List View"
          >
            <List size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
