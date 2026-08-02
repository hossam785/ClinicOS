import type { VitalSigns } from '../types/medicalRecord.types'
import Input from '@/design-system/components/Input'
import { Activity, Heart, Thermometer, Wind, Scale } from 'lucide-react'

interface VitalSignsGridProps {
  vitals?: VitalSigns
  isEditing?: boolean
  onChange?: (updatedVitals: VitalSigns) => void
}

export default function VitalSignsGrid({ vitals = {}, isEditing = false, onChange }: VitalSignsGridProps) {
  const handleChange = (field: keyof VitalSigns, value: string) => {
    if (!onChange) return
    const numValue = value === '' ? undefined : Number(value)
    const updated = { ...vitals, [field]: numValue }

    // Auto-calculate BMI if height and weight exist
    if (field === 'heightCm' || field === 'weightKg') {
      const hMeters = (updated.heightCm || 0) / 100
      const wKg = updated.weightKg || 0
      if (hMeters > 0 && wKg > 0) {
        updated.bodyMassIndex = Number((wKg / (hMeters * hMeters)).toFixed(1))
      }
    }

    onChange(updated)
  }

  if (isEditing) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <Input
          label="BP Systolic (mmHg)"
          type="number"
          placeholder="120"
          value={vitals.bloodPressureSystolic !== undefined ? String(vitals.bloodPressureSystolic) : ''}
          onChange={(e) => handleChange('bloodPressureSystolic', e.target.value)}
        />
        <Input
          label="BP Diastolic (mmHg)"
          type="number"
          placeholder="80"
          value={vitals.bloodPressureDiastolic !== undefined ? String(vitals.bloodPressureDiastolic) : ''}
          onChange={(e) => handleChange('bloodPressureDiastolic', e.target.value)}
        />
        <Input
          label="Pulse Rate (bpm)"
          type="number"
          placeholder="72"
          value={vitals.pulseRate !== undefined ? String(vitals.pulseRate) : ''}
          onChange={(e) => handleChange('pulseRate', e.target.value)}
        />
        <Input
          label="Temperature (°C)"
          type="number"
          step="0.1"
          placeholder="36.6"
          value={vitals.bodyTemperature !== undefined ? String(vitals.bodyTemperature) : ''}
          onChange={(e) => handleChange('bodyTemperature', e.target.value)}
        />
        <Input
          label="Oxygen Saturation SpO2 (%)"
          type="number"
          placeholder="98"
          value={vitals.oxygenSaturation !== undefined ? String(vitals.oxygenSaturation) : ''}
          onChange={(e) => handleChange('oxygenSaturation', e.target.value)}
        />
        <Input
          label="Height (cm)"
          type="number"
          placeholder="175"
          value={vitals.heightCm !== undefined ? String(vitals.heightCm) : ''}
          onChange={(e) => handleChange('heightCm', e.target.value)}
        />
        <Input
          label="Weight (kg)"
          type="number"
          step="0.5"
          placeholder="70"
          value={vitals.weightKg !== undefined ? String(vitals.weightKg) : ''}
          onChange={(e) => handleChange('weightKg', e.target.value)}
        />
        <Input
          label="BMI (kg/m²)"
          type="number"
          readOnly
          value={vitals.bodyMassIndex !== undefined ? String(vitals.bodyMassIndex) : ''}
        />
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
      <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
          <Heart size={14} style={{ color: 'var(--color-danger)' }} />
          <span>Blood Pressure</span>
        </div>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
          {vitals.bloodPressureSystolic && vitals.bloodPressureDiastolic
            ? `${vitals.bloodPressureSystolic}/${vitals.bloodPressureDiastolic} mmHg`
            : 'Not Recorded'}
        </div>
      </div>

      <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
          <Activity size={14} style={{ color: 'var(--color-primary)' }} />
          <span>Pulse Rate</span>
        </div>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
          {vitals.pulseRate ? `${vitals.pulseRate} bpm` : 'Not Recorded'}
        </div>
      </div>

      <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
          <Thermometer size={14} style={{ color: 'var(--color-warning)' }} />
          <span>Temperature</span>
        </div>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
          {vitals.bodyTemperature ? `${vitals.bodyTemperature} °C` : 'Not Recorded'}
        </div>
      </div>

      <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
          <Wind size={14} style={{ color: 'var(--color-primary)' }} />
          <span>SpO2 Oxygen</span>
        </div>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
          {vitals.oxygenSaturation ? `${vitals.oxygenSaturation} %` : 'Not Recorded'}
        </div>
      </div>

      <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
          <Scale size={14} style={{ color: 'var(--color-text-muted)' }} />
          <span>Height & Weight</span>
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
          {vitals.heightCm || vitals.weightKg
            ? `${vitals.heightCm || '--'} cm / ${vitals.weightKg || '--'} kg`
            : 'Not Recorded'}
        </div>
      </div>

      <div style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-text-muted)', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
          <Activity size={14} style={{ color: 'var(--color-primary)' }} />
          <span>Body Mass Index (BMI)</span>
        </div>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
          {vitals.bodyMassIndex ? `${vitals.bodyMassIndex} kg/m²` : 'Not Recorded'}
        </div>
      </div>
    </div>
  )
}
