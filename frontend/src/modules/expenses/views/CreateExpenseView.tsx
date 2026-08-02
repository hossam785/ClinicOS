import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '@/design-system/components/Card'
import Button from '@/design-system/components/Button'
import Input from '@/design-system/components/Input'
import { ExpenseHeader } from '../components/ExpenseHeader'
import { useExpenseForm } from '../hooks/useExpenseForm'
import { expenseApi } from '../services/expenseApi'
import type { ExpenseCategory, PaymentMethod } from '../types/expense'
import { Save, Send, ArrowLeft, AlertCircle, ShieldAlert } from 'lucide-react'
import { useAuth } from '@/modules/auth/hooks/useAuth'

export function CreateExpenseView() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { values, errors, isSubmitting, setIsSubmitting, handleChange, validate, toCreatePayload } = useExpenseForm()

  const [categories, setCategories] = useState<ExpenseCategory[]>([])
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await expenseApi.getCategories()
        if (res.success && Array.isArray(res.data)) {
          setCategories(res.data)
          if (res.data.length > 0 && !values.categoryId) {
            handleChange('categoryId', res.data[0]._id)
          }
        }
      } catch {
        setFormError('Failed to load expense categories')
      }
    }
    loadCategories()
  }, [handleChange, values.categoryId])

  const handleSave = useCallback(
    async (submitForApproval: boolean) => {
      if (!validate()) return
      setIsSubmitting(true)
      setFormError(null)

      try {
        const payload = toCreatePayload(submitForApproval)
        const res = await expenseApi.createExpense(payload)
        if (res.success) {
          navigate('/dashboard/expenses/directory')
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to save expense'
        setFormError(msg)
      } finally {
        setIsSubmitting(false)
      }
    },
    [navigate, setIsSubmitting, toCreatePayload, validate]
  )

  // Keyboard shortcut Ctrl+Enter to submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        handleSave(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSave])

  // Platform Admin Financial Privacy Block
  if (user?.role === 'PLATFORM_ADMIN') {
    return (
      <div style={{ padding: '2rem' }}>
        <Card style={{ padding: '2.5rem', textAlign: 'center', backgroundColor: '#FEF2F2', borderColor: '#FCA5A5' }}>
          <ShieldAlert size={48} style={{ color: '#DC2626', marginBottom: '1rem' }} />
          <h2 style={{ color: '#991B1B', margin: '0 0 0.5rem 0' }}>Financial Access Restricted</h2>
          <p style={{ color: '#7F1D1D', maxWidth: '500px', margin: '0 auto' }}>
            In accordance with ClinicOS SaaS privacy and security rules, Platform Administrators are strictly barred from creating or modifying
            clinic financial records (PLATFORM_ADMIN_FINANCIAL_RESTRICTED).
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div style={{ padding: '1.5rem', maxWidth: '900px', margin: '0 auto' }}>
      <ExpenseHeader
        title="Create New Expense Workspace"
        subtitle="Record a new clinic operating expenditure (Keyboard shortcut: Ctrl+Enter to submit)"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Expenses', href: '/dashboard/expenses' },
          { label: 'New Expense' },
        ]}
        actions={
          <Button variant="outline" onClick={() => navigate('/dashboard/expenses/directory')}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft size={15} />
              <span>Cancel</span>
            </span>
          </Button>
        }
      />

      {formError && (
        <Card style={{ padding: '1rem', marginBottom: '1.5rem', backgroundColor: '#FEF2F2', borderColor: '#FCA5A5' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#991B1B' }}>
            <AlertCircle size={18} />
            <span>{formError}</span>
          </div>
        </Card>
      )}

      <Card style={{ padding: '2rem' }}>
        <form onSubmit={(e) => e.preventDefault()}>
          {/* General Information Section */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 1rem 0', color: 'var(--color-neutral-900, #0F172A)' }}>
              General Information
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-neutral-700, #334155)' }}>
                  Category *
                </label>
                <select
                  value={values.categoryId}
                  onChange={(e) => handleChange('categoryId', e.target.value)}
                  style={{
                    padding: '0.625rem 0.875rem',
                    borderRadius: '6px',
                    border: `1px solid ${errors.categoryId ? '#EF4444' : 'var(--color-border, #CBD5E1)'}`,
                    backgroundColor: '#FFF',
                    fontSize: '0.875rem',
                  }}
                >
                  <option value="">Select Category...</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.categoryName} ({cat.categoryCode})
                    </option>
                  ))}
                </select>
                {errors.categoryId && <span style={{ color: '#EF4444', fontSize: '0.75rem' }}>{errors.categoryId}</span>}
              </div>

              <Input
                label="Expense Title *"
                placeholder="e.g. Monthly Medical Supplies Order"
                value={values.title}
                onChange={(e) => handleChange('title', e.target.value)}
                error={errors.title}
              />
            </div>

            <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-neutral-700, #334155)' }}>
                Description / Invoice Item Breakdown
              </label>
              <textarea
                rows={3}
                placeholder="Detailed itemized breakdown or invoice description..."
                value={values.description}
                onChange={(e) => handleChange('description', e.target.value)}
                style={{
                  padding: '0.625rem 0.875rem',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border, #CBD5E1)',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          {/* Financial Information Section */}
          <div style={{ marginBottom: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border, #E2E8F0)' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 1rem 0', color: 'var(--color-neutral-900, #0F172A)' }}>
              Financial Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
              <Input
                label="Amount *"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={values.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                error={errors.amount}
              />

              <Input
                label="Currency *"
                placeholder="USD"
                value={values.currency}
                onChange={(e) => handleChange('currency', e.target.value)}
                error={errors.currency}
              />

              <Input
                label="Expense Date *"
                type="date"
                value={values.expenseDate}
                onChange={(e) => handleChange('expenseDate', e.target.value)}
                error={errors.expenseDate}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-neutral-700, #334155)' }}>
                  Payment Method *
                </label>
                <select
                  value={values.paymentMethod}
                  onChange={(e) => handleChange('paymentMethod', e.target.value as PaymentMethod)}
                  style={{
                    padding: '0.625rem 0.875rem',
                    borderRadius: '6px',
                    border: '1px solid var(--color-border, #CBD5E1)',
                    backgroundColor: '#FFF',
                    fontSize: '0.875rem',
                  }}
                >
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="CASH">Cash</option>
                  <option value="CREDIT_CARD">Credit Card</option>
                  <option value="CHEQUE">Cheque</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Vendor & Accounting Notes Section */}
          <div style={{ marginBottom: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border, #E2E8F0)' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 1rem 0', color: 'var(--color-neutral-900, #0F172A)' }}>
              Vendor &amp; Accounting Notes
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <Input
                label="Vendor / Supplier Name"
                placeholder="e.g. Apex Medical Distributors Ltd."
                value={values.vendorName}
                onChange={(e) => handleChange('vendorName', e.target.value)}
              />

              <Input
                label="Vendor Tax Registration ID (Optional)"
                placeholder="e.g. TAX-998201-US"
                value={values.vendorTaxId}
                onChange={(e) => handleChange('vendorTaxId', e.target.value)}
              />
            </div>

            <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-neutral-700, #334155)' }}>
                Internal Accounting Notes
              </label>
              <textarea
                rows={2}
                placeholder="Notes for approving manager or accounting audit..."
                value={values.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                style={{
                  padding: '0.625rem 0.875rem',
                  borderRadius: '6px',
                  border: '1px solid var(--color-border, #CBD5E1)',
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          {/* Action Buttons Toolbar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '1rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--color-border, #E2E8F0)',
            }}
          >
            <Button variant="outline" onClick={() => handleSave(false)} disabled={isSubmitting}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Save size={16} />
                <span>Save Draft</span>
              </span>
            </Button>

            <Button variant="primary" onClick={() => handleSave(true)} disabled={isSubmitting}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Send size={16} />
                <span>Submit For Approval (Ctrl+Enter)</span>
              </span>
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
