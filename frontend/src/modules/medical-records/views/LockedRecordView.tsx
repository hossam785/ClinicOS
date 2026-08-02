import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { medicalRecordApi } from '../services/medicalRecordApi'
import MedicalRecordHeader from '../components/MedicalRecordHeader'
import MedicalRecordCard from '../components/MedicalRecordCard'
import Input from '@/design-system/components/Input'
import Button from '@/design-system/components/Button'
import Alert from '@/design-system/components/Alert'
import { ArrowLeft, PlusCircle } from 'lucide-react'

export default function LockedRecordView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [addendumText, setAddendumText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submittedSuccess, setSubmittedSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmitAddendum = async (e: React.FormEvent) => {
    e.preventDefault()
    const recordId = id || 'emr-101'
    if (!addendumText.trim()) {
      setErrorMsg('Addendum text is required before submission.')
      return
    }

    try {
      setSubmitting(true)
      setErrorMsg('')
      setSubmittedSuccess(false)

      await medicalRecordApi.addAddendum(recordId, addendumText.trim())

      setSubmittedSuccess(true)
      setAddendumText('')
    } catch (err: unknown) {
      const error = err as { message?: string }
      setErrorMsg(error.message || 'Failed to submit addendum.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', padding: '1.5rem' }}>
      <MedicalRecordHeader
        title={`Locked Chart Addendum: ${id || 'emr-101'}`}
        subtitle="Submit post-lock clinical addenda for legal health record compliance"
        status="LOCKED"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Medical Records Directory', href: '/dashboard/medical-records' },
          { label: `${id || 'emr-101'}`, href: `/dashboard/medical-records/${id || 'emr-101'}` },
          { label: 'Submit Addendum' },
        ]}
        actions={
          <Button
            variant="outline"
            onClick={() => navigate(`/dashboard/medical-records/${id || 'emr-101'}`)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ArrowLeft size={16} />
            <span>Return to Details</span>
          </Button>
        }
      />

      <Alert variant="warning" title="Immutable Medical Record" style={{ marginBottom: '1.5rem' }}>
        This chart is signed and locked. Direct modifications are prohibited. Corrections or new diagnostic updates must be appended below.
      </Alert>

      {submittedSuccess && (
        <Alert variant="info" title="Addendum Appended" style={{ marginBottom: '1.5rem' }}>
          Post-lock addendum has been logged and appended to the medical record.
        </Alert>
      )}

      {errorMsg && (
        <Alert variant="danger" title="Error" style={{ marginBottom: '1.5rem' }}>
          {errorMsg}
        </Alert>
      )}

      <form onSubmit={handleSubmitAddendum}>
        <MedicalRecordCard title="Post-Lock Clinical Addendum Submission">
          <Input
            label="Addendum Clinical Note *"
            placeholder="e.g. Addendum: Lab results reviewed post-consultation. Lipid panel within target bounds."
            value={addendumText}
            onChange={(e) => setAddendumText(e.target.value)}
            required
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Button variant="outline" onClick={() => navigate(`/dashboard/medical-records/${id || 'emr-101'}`)} type="button">
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={submitting}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <PlusCircle size={16} />
              <span>{submitting ? 'Appending Addendum...' : 'Submit Post-Lock Addendum'}</span>
            </Button>
          </div>
        </MedicalRecordCard>
      </form>

      <MedicalRecordCard title="Legal & Compliance Policy Rules">
        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
          <p style={{ margin: '0 0 0.5rem 0' }}>
            • <strong>Immutable Chart Lock</strong>: Under HIPAA/GDPR health record policies, finalized medical charts cannot be overwritten.
          </p>
          <p style={{ margin: 0 }}>
            • <strong>Audit Log Emission</strong>: Every addendum submission is logged with the attending physician&apos;s ID, timestamp, and workspace tenant context.
          </p>
        </div>
      </MedicalRecordCard>
    </div>
  )
}
