import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '@/design-system/components/Card'
import Button from '@/design-system/components/Button'
import Input from '@/design-system/components/Input'
import Modal from '@/design-system/components/Modal'
import { ExpenseHeader } from '../components/ExpenseHeader'
import { expenseApi } from '../services/expenseApi'
import type { ExpenseCategory } from '../types/expense'
import { Plus, Edit, Archive, RefreshCw, Lock, ShieldAlert, AlertCircle, ArrowLeft, Tag } from 'lucide-react'
import { useAuth } from '@/modules/auth/hooks/useAuth'

export function ExpenseCategoriesView() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [categories, setCategories] = useState<ExpenseCategory[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Category Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [editingCat, setEditingCat] = useState<ExpenseCategory | null>(null)
  const [catName, setCatName] = useState<string>('')
  const [catCode, setCatCode] = useState<string>('')
  const [catDesc, setCatDesc] = useState<string>('')
  const [catColor, setCatColor] = useState<string>('#2563EB')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const loadCategories = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await expenseApi.getCategories()
      if (res.success && Array.isArray(res.data)) {
        setCategories(res.data)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load expense categories'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  // Platform Admin Financial Privacy Block
  if (user?.role === 'PLATFORM_ADMIN') {
    return (
      <div style={{ padding: '2rem' }}>
        <Card style={{ padding: '2.5rem', textAlign: 'center', backgroundColor: '#FEF2F2', borderColor: '#FCA5A5' }}>
          <ShieldAlert size={48} style={{ color: '#DC2626', marginBottom: '1rem' }} />
          <h2 style={{ color: '#991B1B', margin: '0 0 0.5rem 0' }}>Financial Access Restricted</h2>
          <p style={{ color: '#7F1D1D', maxWidth: '500px', margin: '0 auto' }}>
            In accordance with ClinicOS SaaS privacy and security rules, Platform Administrators are strictly barred from viewing
            or modifying clinic financial expense categories (PLATFORM_ADMIN_FINANCIAL_RESTRICTED).
          </p>
        </Card>
      </div>
    )
  }

  const handleOpenCreate = () => {
    setEditingCat(null)
    setCatName('')
    setCatCode('')
    setCatDesc('')
    setCatColor('#2563EB')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (cat: ExpenseCategory) => {
    setEditingCat(cat)
    setCatName(cat.categoryName)
    setCatCode(cat.categoryCode)
    setCatDesc(cat.description || '')
    setCatColor(cat.color || '#2563EB')
    setIsModalOpen(true)
  }

  const handleSaveCategory = async () => {
    if (!catName.trim() || !catCode.trim()) {
      setError('Category Name and Code are required.')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      if (editingCat) {
        await expenseApi.updateCategory(editingCat._id, {
          categoryName: catName.trim(),
          categoryCode: catCode.trim(),
          description: catDesc.trim() || undefined,
          color: catColor,
        })
      } else {
        await expenseApi.createCategory({
          categoryName: catName.trim(),
          categoryCode: catCode.trim(),
          description: catDesc.trim() || undefined,
          color: catColor,
        })
      }
      setIsModalOpen(false)
      await loadCategories()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save category'
      setError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleArchive = async (cat: ExpenseCategory) => {
    if (cat.isSystem) {
      alert('System preset categories are protected and cannot be archived.')
      return
    }

    if (window.confirm(`Are you sure you want to archive custom category "${cat.categoryName}"?`)) {
      try {
        await expenseApi.archiveCategory(cat._id)
        await loadCategories()
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to archive category'
        setError(msg)
      }
    }
  }

  const handleRestore = async (cat: ExpenseCategory) => {
    try {
      await expenseApi.restoreCategory(cat._id)
      await loadCategories()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to restore category'
      setError(msg)
    }
  }

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      <ExpenseHeader
        title="Expense Categories Management"
        subtitle="Configure operating expense classification categories (System protected categories vs Custom tenant categories)"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Expenses', href: '/dashboard/expenses' },
          { label: 'Categories' },
        ]}
        actions={
          <>
            <Button variant="outline" onClick={() => navigate('/dashboard/expenses')}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <ArrowLeft size={15} />
                <span>Back to Dashboard</span>
              </span>
            </Button>
            {user?.role === 'CLINIC_MANAGER' && (
              <Button variant="primary" onClick={handleOpenCreate}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Plus size={15} />
                  <span>Custom Category</span>
                </span>
              </Button>
            )}
          </>
        }
      />

      {error && (
        <Card style={{ padding: '1rem', marginBottom: '1.5rem', backgroundColor: '#FEF2F2', borderColor: '#FCA5A5' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#991B1B' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        </Card>
      )}

      {/* Categories Data Grid */}
      <Card style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-neutral-50, #F8FAFC)', borderBottom: '1px solid var(--color-border, #E2E8F0)' }}>
                <th style={{ padding: '0.875rem 1rem', fontWeight: 600, color: 'var(--color-neutral-700, #334155)' }}>Code</th>
                <th style={{ padding: '0.875rem 1rem', fontWeight: 600, color: 'var(--color-neutral-700, #334155)' }}>Name</th>
                <th style={{ padding: '0.875rem 1rem', fontWeight: 600, color: 'var(--color-neutral-700, #334155)' }}>Type</th>
                <th style={{ padding: '0.875rem 1rem', fontWeight: 600, color: 'var(--color-neutral-700, #334155)' }}>Description</th>
                <th style={{ padding: '0.875rem 1rem', fontWeight: 600, color: 'var(--color-neutral-700, #334155)' }}>Status</th>
                <th style={{ padding: '0.875rem 1rem', fontWeight: 600, color: 'var(--color-neutral-700, #334155)', textAlign: 'right' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length > 0 ? (
                categories.map((cat) => (
                  <tr key={cat._id} style={{ borderBottom: '1px solid var(--color-border, #E2E8F0)' }}>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: 'var(--color-neutral-900, #0F172A)' }}>
                      {cat.categoryCode}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: cat.color || '#2563EB',
                            display: 'inline-block',
                          }}
                        />
                        <span style={{ fontWeight: 600, color: 'var(--color-neutral-900, #0F172A)' }}>{cat.categoryName}</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      {cat.isSystem ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: '#F1F5F9',
                            color: '#475569',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        >
                          <Lock size={12} /> System
                        </span>
                      ) : (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            backgroundColor: '#DBEAFE',
                            color: '#1E40AF',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        >
                          <Tag size={12} /> Custom
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: 'var(--color-neutral-600, #475569)' }}>{cat.description || '-'}</td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: cat.archived ? '#94A3B8' : '#059669',
                        }}
                      >
                        {cat.archived ? 'Archived' : 'Active'}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                        {!cat.isSystem && user?.role === 'CLINIC_MANAGER' && !cat.archived && (
                          <>
                            <Button variant="outline" size="small" onClick={() => handleOpenEdit(cat)}>
                              <Edit size={14} />
                            </Button>
                            <Button variant="danger" size="small" onClick={() => handleArchive(cat)}>
                              <Archive size={14} />
                            </Button>
                          </>
                        )}
                        {!cat.isSystem && user?.role === 'CLINIC_MANAGER' && cat.archived && (
                          <Button variant="outline" size="small" onClick={() => handleRestore(cat)}>
                            <RefreshCw size={14} />
                          </Button>
                        )}
                        {cat.isSystem && (
                          <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontStyle: 'italic' }}>Protected</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8' }}>
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Category Creation / Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div style={{ padding: '1.5rem', width: '100%', maxWidth: '480px' }}>
          <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-neutral-900, #0F172A)' }}>
            {editingCat ? 'Edit Custom Category' : 'Create Custom Category'}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            <Input label="Category Name *" placeholder="e.g. Lab Consumables" value={catName} onChange={(e) => setCatName(e.target.value)} />

            <Input
              label="Category Code *"
              placeholder="e.g. CAT-LABCONS"
              value={catCode}
              onChange={(e) => setCatCode(e.target.value.toUpperCase())}
              disabled={Boolean(editingCat)}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-neutral-700, #334155)' }}>
                Description (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Description of included expenditures..."
                value={catDesc}
                onChange={(e) => setCatDesc(e.target.value)}
                style={{
                  padding: '0.625rem 0.875rem',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border, #CBD5E1)',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-neutral-700, #334155)' }}>Badge Accent Color</label>
              <input
                type="color"
                value={catColor}
                onChange={(e) => setCatColor(e.target.value)}
                style={{ width: '60px', height: '36px', padding: '0', border: 'none', cursor: 'pointer' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveCategory} disabled={isSubmitting}>
              Save Category
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
