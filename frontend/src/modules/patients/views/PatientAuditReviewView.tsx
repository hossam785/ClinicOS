import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { PatientProfile, PatientStatus } from '../types/patient.types'
import { patientApi } from '../services/patientApi'
import PatientHeader from '../components/PatientHeader'
import PatientCard from '../components/PatientCard'
import Button from '@/design-system/components/Button'
import Alert from '@/design-system/components/Alert'
import Loader from '@/design-system/components/Loader'
import { Archive, ArrowLeft, CheckCircle2, UserX } from 'lucide-react'

export default function PatientAuditReviewView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [patient, setPatient] = useState<PatientProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [feedbackMsg, setFeedbackMsg] = useState('')

  useEffect(() => {
    let isMounted = true
    const loadPatient = async () => {
      const patId = id || 'pat-101'
      try {
        setLoading(true)
        setErrorMsg('')
        const data = await patientApi.getPatientById(patId)
        if (isMounted) setPatient(data)
      } catch (err: unknown) {
        if (isMounted) {
          const error = err as { message?: string }
          setErrorMsg(error.message || 'Failed to retrieve patient record for audit.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadPatient()
    return () => {
      isMounted = false
    }
  }, [id])

  const handleArchive = async () => {
    if (!patient) return
    try {
      setUpdating(true)
      setErrorMsg('')
      setFeedbackMsg('')

      const updated = await patientApi.archivePatient(patient.id, 'Archived via administrative audit console.')
      setPatient(updated)
      setFeedbackMsg('Patient profile archived successfully.')
    } catch (err: unknown) {
      const error = err as { message?: string }
      setErrorMsg(error.message || 'Failed to archive patient profile.')
    } finally {
      setUpdating(false)
    }
  }

  const handleRestore = async () => {
    if (!patient) return
    try {
      setUpdating(true)
      setErrorMsg('')
      setFeedbackMsg('')

      const updated = await patientApi.restorePatient(patient.id)
      setPatient(updated)
      setFeedbackMsg('Patient profile restored to Active status successfully.')
    } catch (err: unknown) {
      const error = err as { message?: string }
      setErrorMsg(error.message || 'Failed to restore patient profile.')
    } finally {
      setUpdating(false)
    }
  }

  const handleStatusChange = async (newStatus: PatientStatus, reason: string) => {
    if (!patient) return
    try {
      setUpdating(true)
      setErrorMsg('')
      setFeedbackMsg('')

      const updated = await patientApi.updateStatus(patient.id, newStatus, reason)
      setPatient(updated)
      setFeedbackMsg(`Patient status updated to ${newStatus} successfully.`)
    } catch (err: unknown) {
      const error = err as { message?: string }
      setErrorMsg(error.message || 'Failed to update patient status.')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '350px' }}>
        <Loader size="large" />
      </div>
    )
  }

  if (errorMsg && !patient) {
    return (
      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1.5rem' }}>
        <Alert variant="danger" title="Error">
          {errorMsg}
        </Alert>
      </div>
    )
  }

  if (!patient) return null

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem' }}>
      <PatientHeader
        title={`Audit: ${patient.fullName}`}
        subtitle={`Administrative Lifecycle Console • Code: ${patient.patientCode}`}
        status={patient.status}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Patients Directory', href: '/dashboard/patients' },
          { label: 'Patient Profile', href: `/dashboard/patients/${patient.id}` },
          { label: 'Lifecycle Controls' },
        ]}
        actions={
          <Button
            variant="outline"
            onClick={() => navigate(`/dashboard/patients/${patient.id}`)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ArrowLeft size={16} />
            <span>Return to Profile</span>
          </Button>
        }
      />

      {errorMsg && (
        <Alert variant="danger" title="Status Action Error" style={{ marginBottom: '1.5rem' }}>
          {errorMsg}
        </Alert>
      )}

      {feedbackMsg && (
        <Alert variant="info" title="Status Transition Executed" style={{ marginBottom: '1.5rem' }}>
          {feedbackMsg}
        </Alert>
      )}

      <PatientCard title="Administrative Status Actions" subtitle="Execute patient lifecycle state transitions according to clinic policy">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {patient.status === 'ARCHIVED' && (
            <Button
              variant="primary"
              disabled={updating}
              onClick={handleRestore}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <CheckCircle2 size={16} />
              <span>Restore Patient Profile</span>
            </Button>
          )}

          {patient.status !== 'ARCHIVED' && patient.status !== 'DECEASED' && (
            <Button
              variant="outline"
              disabled={updating}
              onClick={handleArchive}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-warning)' }}
            >
              <Archive size={16} />
              <span>Archive Patient Record</span>
            </Button>
          )}

          {patient.status !== 'DECEASED' && (
            <Button
              variant="danger"
              disabled={updating}
              onClick={() => handleStatusChange('DECEASED', 'Patient profile marked as Deceased.')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <UserX size={16} />
              <span>Mark Patient as Deceased</span>
            </Button>
          )}
        </div>
      </PatientCard>

      <PatientCard title="Compliance & Archival Rules">
        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
          <p style={{ margin: '0 0 0.5rem 0' }}>
            • <strong>Archived Records</strong> are soft-deleted and preserved for HIPAA/GDPR medical audit history compliance.
          </p>
          <p style={{ margin: 0 }}>
            • <strong>Deceased Status</strong> permanently locks the record against new appointment scheduling while preserving clinical encounters.
          </p>
        </div>
      </PatientCard>
    </div>
  )
}
