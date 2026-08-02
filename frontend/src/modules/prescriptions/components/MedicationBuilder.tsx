import React, { useEffect } from 'react'
import { Plus, Pill } from 'lucide-react'
import type { MedicationItem } from '../types/prescription'
import MedicationCard from './MedicationCard'
import Button from '@/design-system/components/Button'

interface MedicationBuilderProps {
  medications: MedicationItem[]
  onAdd: () => void
  onRemove: (id: string) => void
  onDuplicate: (id: string) => void
  onUpdate: (id: string, field: keyof MedicationItem, value: unknown) => void
  onReorder: (id: string, direction: 'UP' | 'DOWN') => void
  errors?: Record<string, string>
}

export const MedicationBuilder: React.FC<MedicationBuilderProps> = ({
  medications,
  onAdd,
  onRemove,
  onDuplicate,
  onUpdate,
  onReorder,
  errors = {},
}) => {
  // Listen for Alt+N keyboard shortcut to add medication line item
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault()
        onAdd()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onAdd])

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          paddingBottom: '0.5rem',
          borderBottom: '2px solid var(--color-primary-light, #EFF6FF)',
        }}
      >
        <div>
          <h2
            style={{
              fontSize: '1.125rem',
              fontWeight: 700,
              margin: 0,
              color: 'var(--color-neutral-dark, #0F172A)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Pill size={20} style={{ color: 'var(--color-primary, #2563EB)' }} />
            Prescribed Medications ({medications.length})
          </h2>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8125rem', color: 'var(--color-neutral-muted, #64748B)' }}>
            Add unlimited medication line items. Keyboard shortcut: <strong>Alt + N</strong>
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={onAdd}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={16} /> Add Medication
          </span>
        </Button>
      </div>

      {errors.medications && (
        <div
          style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#991B1B',
            padding: '0.75rem',
            borderRadius: '6px',
            fontSize: '0.875rem',
            marginBottom: '1rem',
          }}
        >
          {errors.medications}
        </div>
      )}

      {medications.map((med, index) => (
        <MedicationCard
          key={med.id}
          index={index}
          totalItems={medications.length}
          medication={med}
          onUpdate={onUpdate}
          onRemove={onRemove}
          onDuplicate={onDuplicate}
          onReorder={onReorder}
          errorName={errors[`medication_${index}_name`]}
          errorDosage={errors[`medication_${index}_dosage`]}
          errorFrequency={errors[`medication_${index}_frequency`]}
        />
      ))}
    </div>
  )
}

export default MedicationBuilder
