import { useNavigate } from 'react-router-dom'
import type { MedicalRecordProfile } from '../types/medicalRecord.types'
import MedicalRecordStatusBadge from './MedicalRecordStatusBadge'
import Button from '@/design-system/components/Button'
import { Calendar, Eye, Stethoscope, FileText } from 'lucide-react'

interface PatientHistoryTimelineProps {
  records: MedicalRecordProfile[]
}

export default function PatientHistoryTimeline({ records }: PatientHistoryTimelineProps) {
  const navigate = useNavigate()

  if (!records || records.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
        <FileText size={44} style={{ marginBottom: '0.75rem', strokeWidth: 1.5 }} />
        <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--color-text-main)' }}>No Prior Medical Records</h4>
        <p style={{ margin: 0, fontSize: '0.875rem' }}>
          No historical medical records have been documented for this patient yet.
        </p>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', paddingLeft: '1.5rem', borderLeft: '2px solid var(--color-border)' }}>
      {records.map((rec) => (
        <div key={rec.id} style={{ position: 'relative', marginBottom: '1.5rem' }}>
          {/* Timeline Dot */}
          <div
            style={{
              position: 'absolute',
              left: '-2.05rem',
              top: '0.2rem',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: rec.isLocked ? 'var(--color-primary)' : 'var(--color-warning)',
              border: '2px solid var(--color-bg-surface)',
            }}
          />

          <div
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-bg-surface)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                  {rec.recordNumber}
                </span>
                <h4 style={{ margin: '0.15rem 0 0 0', fontSize: '1.05rem', color: 'var(--color-text-main)' }}>
                  {rec.primaryDiagnosis || 'Clinical Encounter (No Primary Diagnosis Recorded)'}
                </h4>
              </div>
              <MedicalRecordStatusBadge status={rec.status} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={14} style={{ color: 'var(--color-primary)' }} />
                <span>Visit Date: <strong>{rec.visitDate}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Stethoscope size={14} style={{ color: 'var(--color-primary)' }} />
                <span>Attending: <strong>{rec.doctorName}</strong></span>
              </div>
            </div>

            {rec.chiefComplaint && (
              <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.875rem', color: 'var(--color-text-main)', fontStyle: 'italic' }}>
                &quot;{rec.chiefComplaint}&quot;
              </p>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outline"
                onClick={() => navigate(`/dashboard/medical-records/${rec.id}`)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.65rem', fontSize: '0.85rem' }}
              >
                <Eye size={14} />
                <span>View Full EMR Chart</span>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
