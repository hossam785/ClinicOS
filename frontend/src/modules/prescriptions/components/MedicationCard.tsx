import React from 'react'
import { Trash2, Copy, ArrowUp, ArrowDown } from 'lucide-react'
import type { MedicationItem, DosageForm } from '../types/prescription'
import Input from '@/design-system/components/Input'
import Textarea from '@/design-system/components/Textarea'
import Button from '@/design-system/components/Button'

interface MedicationCardProps {
  index: number
  totalItems: number
  medication: MedicationItem
  onUpdate: (id: string, field: keyof MedicationItem, value: unknown) => void
  onRemove: (id: string) => void
  onDuplicate: (id: string) => void
  onReorder: (id: string, direction: 'UP' | 'DOWN') => void
  errorName?: string
  errorDosage?: string
  errorFrequency?: string
}

const DOSAGE_FORM_OPTIONS: { label: string; value: DosageForm }[] = [
  { label: 'Tablet', value: 'Tablet' },
  { label: 'Capsule', value: 'Capsule' },
  { label: 'Syrup / Oral Suspension', value: 'Syrup' },
  { label: 'Injection / IV / IM', value: 'Injection' },
  { label: 'Cream / Ointment / Gel', value: 'Cream' },
  { label: 'Drops (Eye / Ear / Nasal)', value: 'Drops' },
  { label: 'Inhaler / Respule', value: 'Inhaler' },
  { label: 'Patch (Transdermal)', value: 'Patch' },
  { label: 'Suppository', value: 'Suppository' },
  { label: 'Solution / Elixir', value: 'Solution' },
  { label: 'Other', value: 'Other' },
]

const FREQUENCY_PRESETS = [
  'Once daily (QD)',
  'Twice daily (BID)',
  'Three times daily (TID)',
  'Four times daily (QID)',
  'Every 8 hours',
  'As needed (PRN)',
  'Before bedtime (QHS)',
]

export const MedicationCard: React.FC<MedicationCardProps> = ({
  index,
  totalItems,
  medication,
  onUpdate,
  onRemove,
  onDuplicate,
  onReorder,
  errorName,
  errorDosage,
  errorFrequency,
}) => {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--color-neutral-border, #CBD5E1)',
        borderRadius: '8px',
        padding: '1.25rem',
        marginBottom: '1rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          paddingBottom: '0.5rem',
          borderBottom: '1px solid var(--color-neutral-light, #F1F5F9)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary, #2563EB)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.75rem',
            }}
          >
            {index + 1}
          </div>
          <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--color-neutral-dark, #0F172A)' }}>
            Medication Line Item #{index + 1}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Button
            type="button"
            variant="outline"
            size="small"
            disabled={index === 0}
            onClick={() => onReorder(medication.id, 'UP')}
            aria-label="Move item up"
          >
            <ArrowUp size={14} />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="small"
            disabled={index === totalItems - 1}
            onClick={() => onReorder(medication.id, 'DOWN')}
            aria-label="Move item down"
          >
            <ArrowDown size={14} />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="small"
            onClick={() => onDuplicate(medication.id)}
            aria-label="Duplicate medication item"
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Copy size={14} /> Duplicate
            </span>
          </Button>
          <Button
            type="button"
            variant="danger"
            size="small"
            onClick={() => onRemove(medication.id)}
            aria-label="Remove medication item"
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Trash2 size={14} /> Remove
            </span>
          </Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <Input
            label="Medicine Name *"
            placeholder="e.g. Amoxicillin / Clavulanic Acid"
            value={medication.medicineName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate(medication.id, 'medicineName', e.target.value)}
            error={errorName}
            autoFocus={index === 0}
          />
        </div>

        <div>
          <Input
            label="Strength"
            placeholder="e.g. 500 mg / 125 mg"
            value={medication.strength}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate(medication.id, 'strength', e.target.value)}
          />
        </div>

        <div className="form-field-group">
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem', color: 'var(--color-neutral-dark, #0F172A)' }}>
            Dosage Form *
          </label>
          <select
            value={medication.dosageForm}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onUpdate(medication.id, 'dosageForm', e.target.value as DosageForm)}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid var(--color-neutral-border, #CBD5E1)',
              backgroundColor: '#FFFFFF',
              fontSize: '0.875rem',
              color: 'var(--color-neutral-dark, #0F172A)',
            }}
          >
            {DOSAGE_FORM_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Input
            label="Dosage *"
            placeholder="e.g. 1 Tablet"
            value={medication.dosage}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate(medication.id, 'dosage', e.target.value)}
            error={errorDosage}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <Input
            label="Frequency *"
            placeholder="e.g. Three times daily (TID)"
            value={medication.frequency}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate(medication.id, 'frequency', e.target.value)}
            error={errorFrequency}
          />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.375rem' }}>
            {FREQUENCY_PRESETS.slice(0, 4).map((preset) => (
              <button
                type="button"
                key={preset}
                onClick={() => onUpdate(medication.id, 'frequency', preset)}
                style={{
                  padding: '2px 6px',
                  fontSize: '0.6875rem',
                  borderRadius: '4px',
                  border: '1px solid var(--color-neutral-border, #CBD5E1)',
                  backgroundColor: 'var(--color-neutral-light, #F8FAFC)',
                  cursor: 'pointer',
                  color: 'var(--color-neutral-dark, #334155)',
                }}
              >
                {preset.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Input
            label="Duration"
            placeholder="e.g. 7 Days"
            value={medication.duration}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate(medication.id, 'duration', e.target.value)}
          />
        </div>

        <div>
          <Input
            label="Total Quantity"
            placeholder="e.g. 21 Tablets"
            value={medication.quantity}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onUpdate(medication.id, 'quantity', e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        <div>
          <Textarea
            label="Patient Instructions"
            placeholder="e.g. Take after meals with a full glass of water. Complete full course."
            value={medication.instructions}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onUpdate(medication.id, 'instructions', e.target.value)}
            rows={2}
          />
        </div>

        <div>
          <Textarea
            label="Special Line Item Notes (Optional)"
            placeholder="e.g. Store in a cool dry place."
            value={medication.notes || ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onUpdate(medication.id, 'notes', e.target.value)}
            rows={2}
          />
        </div>
      </div>
    </div>
  )
}

export default MedicationCard
