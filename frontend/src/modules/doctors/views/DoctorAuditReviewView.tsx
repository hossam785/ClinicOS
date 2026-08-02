import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { DoctorProfile, DoctorStatus } from '../types/doctor.types'
import { doctorApi } from '../services/doctorApi'
import DoctorHeader from '../components/DoctorHeader'
import DoctorCard from '../components/DoctorCard'
import Button from '@/design-system/components/Button'
import Alert from '@/design-system/components/Alert'
import Loader from '@/design-system/components/Loader'
import { CheckCircle2, ShieldAlert, Archive, ArrowLeft, FileText, Award, ShieldCheck, Mail, Phone } from 'lucide-react'

export default function DoctorAuditReviewView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [doctor, setDoctor] = useState<DoctorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [feedbackMsg, setFeedbackMsg] = useState('')

  useEffect(() => {
    let isMounted = true
    const loadDoctor = async () => {
      const docId = id || 'doc-102'
      try {
        setLoading(true)
        setErrorMsg('')
        const data = await doctorApi.getDoctorById(docId)
        if (isMounted) setDoctor(data)
      } catch (err: unknown) {
        if (isMounted) {
          const error = err as { message?: string }
          setErrorMsg(error.message || 'Failed to retrieve doctor audit record.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadDoctor()
    return () => {
      isMounted = false
    }
  }, [id])

  const handleVerifyLicense = async () => {
    if (!doctor) return
    try {
      setUpdating(true)
      setErrorMsg('')
      setFeedbackMsg('')

      const updated = await doctorApi.verifyLicense(doctor.id)
      setDoctor(updated)
      setFeedbackMsg('Medical board license verified and doctor activated successfully.')
    } catch (err: unknown) {
      const error = err as { message?: string }
      setErrorMsg(error.message || 'Failed to verify medical license.')
    } finally {
      setUpdating(false)
    }
  }

  const handleStatusChange = async (newStatus: DoctorStatus, reason: string) => {
    if (!doctor) return
    try {
      setUpdating(true)
      setErrorMsg('')
      setFeedbackMsg('')

      const updated = await doctorApi.updateStatus(doctor.id, newStatus, reason)
      setDoctor(updated)
      setFeedbackMsg(`Doctor status successfully updated to ${newStatus}.`)
    } catch (err: unknown) {
      const error = err as { message?: string }
      setErrorMsg(error.message || 'Failed to update doctor status.')
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

  if (errorMsg && !doctor) {
    return (
      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1.5rem' }}>
        <Alert variant="danger" title="Error">
          {errorMsg}
        </Alert>
      </div>
    )
  }

  if (!doctor) return null

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1.5rem' }}>
      <DoctorHeader
        title={`Audit: ${doctor.medicalTitle} ${doctor.legalName}`}
        subtitle={`Medical License Audit & Status Control Console • ID: ${doctor.id}`}
        status={doctor.status}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Doctors Directory', href: '/dashboard/doctors' },
          { label: 'License Audit Review' },
        ]}
        actions={
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard/doctors')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ArrowLeft size={16} />
            <span>Return to Directory</span>
          </Button>
        }
      />

      {errorMsg && (
        <Alert variant="danger" title="Status Update Error" style={{ marginBottom: '1.5rem' }}>
          {errorMsg}
        </Alert>
      )}

      {feedbackMsg && (
        <Alert variant="info" title="Status Updated" style={{ marginBottom: '1.5rem' }}>
          {feedbackMsg}
        </Alert>
      )}

      {/* Administrative Action Controls */}
      <DoctorCard title="Administrative Status Actions" subtitle="Execute practitioner state transitions">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {doctor.status === 'PENDING_VERIFICATION' && (
            <Button
              variant="primary"
              disabled={updating}
              onClick={handleVerifyLicense}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <CheckCircle2 size={16} />
              <span>Approve License & Activate</span>
            </Button>
          )}

          {doctor.status === 'ACTIVE' && (
            <Button
              variant="danger"
              disabled={updating}
              onClick={() => handleStatusChange('SUSPENDED', 'Practitioner access suspended by Clinic Owner.')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <ShieldAlert size={16} />
              <span>Suspend Access</span>
            </Button>
          )}

          {doctor.status === 'SUSPENDED' && (
            <Button
              variant="primary"
              disabled={updating}
              onClick={() => handleStatusChange('ACTIVE', 'Practitioner access reactivated by Clinic Owner.')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <CheckCircle2 size={16} />
              <span>Reactivate Access</span>
            </Button>
          )}

          {doctor.status !== 'ARCHIVED' && (
            <Button
              variant="outline"
              disabled={updating}
              onClick={() => handleStatusChange('ARCHIVED', 'Practitioner record archived upon employment termination.')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-danger)' }}
            >
              <Archive size={16} />
              <span>Archive Practitioner</span>
            </Button>
          )}
        </div>
      </DoctorCard>

      {/* Credential Verification Audit Details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <DoctorCard title="Medical Board Credentials">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FileText size={18} style={{ color: 'var(--color-primary)' }} />
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Medical License Number</span>
                <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{doctor.medicalLicenseNumber}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Award size={18} style={{ color: 'var(--color-primary)' }} />
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Issuing Authority</span>
                <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{doctor.licenseIssuingAuthority}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <ShieldCheck size={18} style={{ color: 'var(--color-primary)' }} />
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>National Identity Code</span>
                <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{doctor.nationalId}</span>
              </div>
            </div>
          </div>
        </DoctorCard>

        <DoctorCard title="Contact Channels & Specialty">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Mail size={18} style={{ color: 'var(--color-primary)' }} />
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Email</span>
                <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{doctor.primaryEmail}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Phone size={18} style={{ color: 'var(--color-primary)' }} />
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Phone</span>
                <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{doctor.primaryPhone}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Award size={18} style={{ color: 'var(--color-primary)' }} />
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Specialty & Department</span>
                <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>
                  {doctor.primarySpecialty} ({doctor.department})
                </span>
              </div>
            </div>
          </div>
        </DoctorCard>
      </div>
    </div>
  )
}
