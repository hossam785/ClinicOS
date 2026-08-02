import React from 'react'
import { Pill, ArrowLeft, Printer, Download, CheckCircle2, Lock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Prescription } from '../types/prescription'
import PrescriptionStatusBadge from './PrescriptionStatusBadge'
import Button from '@/design-system/components/Button'

interface PrescriptionHeaderProps {
  prescription?: Prescription
  title?: string
  subtitle?: string
  onPrint?: () => void
  onExportPdf?: () => void
  onFinalize?: () => void
  isSubmitting?: boolean
}

export const PrescriptionHeader: React.FC<PrescriptionHeaderProps> = ({
  prescription,
  title,
  subtitle,
  onPrint,
  onExportPdf,
  onFinalize,
  isSubmitting = false,
}) => {
  const navigate = useNavigate()

  const displayTitle = title || (prescription ? `Prescription ${prescription.prescriptionNumber}` : 'Electronic Prescription')
  const displaySubtitle = subtitle || (prescription ? `Visit Date: ${prescription.visitDate}` : 'Prescription Workspace')

  return (
    <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-neutral-border, #E2E8F0)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Button
            variant="outline"
            size="small"
            onClick={() => navigate(-1)}
            aria-label="Back to previous page"
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ArrowLeft size={16} /> Back
            </span>
          </Button>

          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-primary-light, #EFF6FF)',
              color: 'var(--color-primary, #2563EB)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Pill size={22} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-neutral-dark, #0F172A)' }}>
                {displayTitle}
              </h1>
              {prescription && <PrescriptionStatusBadge status={prescription.status} />}
            </div>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: 'var(--color-neutral-muted, #64748B)' }}>
              {displaySubtitle}
            </p>
          </div>
        </div>

        {prescription && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {prescription.status === 'DRAFT' && onFinalize && (
              <Button
                variant="primary"
                onClick={onFinalize}
                disabled={isSubmitting}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} /> Finalize & Sign
                </span>
              </Button>
            )}

            {(prescription.status === 'FINALIZED' || prescription.status === 'PRINTED') && (
              <>
                {onPrint && (
                  <Button
                    variant="outline"
                    onClick={onPrint}
                    disabled={isSubmitting}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Printer size={16} /> Print Direct
                    </span>
                  </Button>
                )}
                {onExportPdf && (
                  <Button
                    variant="primary"
                    onClick={onExportPdf}
                    disabled={isSubmitting}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Download size={16} /> Export PDF
                    </span>
                  </Button>
                )}
              </>
            )}

            {prescription.status === 'ARCHIVED' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-neutral-muted, #64748B)', fontSize: '0.875rem' }}>
                <Lock size={16} />
                <span>Archived Prescription</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PrescriptionHeader
