import React from 'react'
import { Pill, User, Calendar, Stethoscope, Eye, Printer } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Prescription } from '../types/prescription'
import PrescriptionStatusBadge from './PrescriptionStatusBadge'
import Card from '@/design-system/components/Card'
import Button from '@/design-system/components/Button'

interface PrescriptionCardProps {
  prescription: Prescription
  onPrint?: (id: string) => void
}

export const PrescriptionCard: React.FC<PrescriptionCardProps> = ({ prescription, onPrint }) => {
  const navigate = useNavigate()

  return (
    <Card className="prescription-card" style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Pill size={18} style={{ color: 'var(--color-primary, #2563EB)' }} />
          <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-neutral-dark, #0F172A)' }}>
            {prescription.prescriptionNumber}
          </span>
        </div>
        <PrescriptionStatusBadge status={prescription.status} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-neutral-dark, #334155)' }}>
          <User size={15} style={{ color: 'var(--color-neutral-muted, #64748B)' }} />
          <span>
            <strong>Patient:</strong> {prescription.patientName || prescription.patientId}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-neutral-dark, #334155)' }}>
          <Stethoscope size={15} style={{ color: 'var(--color-neutral-muted, #64748B)' }} />
          <span>
            <strong>Doctor:</strong> {prescription.doctorName || prescription.doctorId}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-neutral-dark, #334155)' }}>
          <Calendar size={15} style={{ color: 'var(--color-neutral-muted, #64748B)' }} />
          <span>
            <strong>Visit Date:</strong> {prescription.visitDate}
          </span>
        </div>
      </div>

      {prescription.diagnosisSummary && (
        <div
          style={{
            backgroundColor: 'var(--color-neutral-light, #F8FAFC)',
            padding: '0.5rem 0.75rem',
            borderRadius: '6px',
            fontSize: '0.875rem',
            marginBottom: '1rem',
            borderLeft: '3px solid var(--color-primary, #2563EB)',
          }}
        >
          <strong>Diagnosis:</strong> {prescription.diagnosisSummary}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid var(--color-neutral-border, #E2E8F0)' }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-muted, #64748B)' }}>
          {prescription.medications?.length || 0} medication item(s) prescribed
        </span>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button
            variant="outline"
            size="small"
            onClick={() => navigate(`/dashboard/prescriptions/${prescription._id}`)}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Eye size={14} /> View Details
            </span>
          </Button>

          {(prescription.status === 'FINALIZED' || prescription.status === 'PRINTED') && onPrint && (
            <Button
              variant="secondary"
              size="small"
              onClick={() => onPrint(prescription._id)}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Printer size={14} /> Print
              </span>
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

export default PrescriptionCard
