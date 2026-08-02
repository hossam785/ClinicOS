import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { ClinicProfile, ClinicStatus } from '../types/clinic.types'
import { clinicApi } from '../services/clinicApi'
import ClinicHeader from '../components/ClinicHeader'
import ClinicCard from '../components/ClinicCard'
import Button from '@/design-system/components/Button'
import Alert from '@/design-system/components/Alert'
import Loader from '@/design-system/components/Loader'
import { CheckCircle2, ShieldAlert, Archive, ArrowLeft, Building2, MapPin, Mail, Phone, FileText } from 'lucide-react'

export default function AdminClinicReviewView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [clinic, setClinic] = useState<ClinicProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [feedbackMsg, setFeedbackMsg] = useState('')

  useEffect(() => {
    let isMounted = true
    const loadClinic = async () => {
      if (!id) return
      try {
        setLoading(true)
        setErrorMsg('')
        const data = await clinicApi.getClinicById(id)
        if (isMounted) setClinic(data)
      } catch (err: unknown) {
        if (isMounted) {
          const error = err as { message?: string }
          setErrorMsg(error.message || 'Failed to retrieve clinic tenant record.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadClinic()
    return () => {
      isMounted = false
    }
  }, [id])

  const handleStatusChange = async (newStatus: ClinicStatus, reason: string) => {
    if (!id || !clinic) return
    try {
      setUpdating(true)
      setErrorMsg('')
      setFeedbackMsg('')

      const updated = await clinicApi.updateStatus(id, newStatus, reason)
      setClinic(updated)
      setFeedbackMsg(`Clinic status successfully updated to ${newStatus}.`)
    } catch (err: unknown) {
      const error = err as { message?: string }
      setErrorMsg(error.message || 'Failed to update clinic status.')
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

  if (errorMsg && !clinic) {
    return (
      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1.5rem' }}>
        <Alert variant="danger" title="Error">
          {errorMsg}
        </Alert>
      </div>
    )
  }

  if (!clinic) return null

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1.5rem' }}>
      <ClinicHeader
        title={`Audit: ${clinic.name}`}
        subtitle={`Tenant ID: ${clinic.tenantId}`}
        status={clinic.status}
        breadcrumbs={[
          { label: 'Platform Admin', href: '/admin' },
          { label: 'Tenants Registry', href: '/admin/clinics' },
          { label: 'Clinic Audit Review' },
        ]}
        actions={
          <Button
            variant="outline"
            onClick={() => navigate('/admin/clinics')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ArrowLeft size={16} />
            <span>Return to Registry</span>
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

      {/* Action Controls Banner */}
      <ClinicCard title="Super Admin Status Actions" subtitle="Execute tenant state transitions">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {clinic.status === 'PENDING_REVIEW' && (
            <Button
              variant="primary"
              disabled={updating}
              onClick={() => handleStatusChange('APPROVED', 'Super Admin verified credentials and approved registration.')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <CheckCircle2 size={16} />
              <span>Approve Application</span>
            </Button>
          )}

          {clinic.status === 'APPROVED' && (
            <Button
              variant="primary"
              disabled={updating}
              onClick={() => handleStatusChange('ACTIVE', 'Super Admin activated workspace.')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <CheckCircle2 size={16} />
              <span>Activate Tenant</span>
            </Button>
          )}

          {(clinic.status === 'ACTIVE' || clinic.status === 'APPROVED') && (
            <Button
              variant="danger"
              disabled={updating}
              onClick={() => handleStatusChange('SUSPENDED', 'Super Admin suspended tenant workspace.')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <ShieldAlert size={16} />
              <span>Suspend Workspace</span>
            </Button>
          )}

          {clinic.status === 'SUSPENDED' && (
            <Button
              variant="primary"
              disabled={updating}
              onClick={() => handleStatusChange('ACTIVE', 'Super Admin reactivated tenant workspace.')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <CheckCircle2 size={16} />
              <span>Reactivate Workspace</span>
            </Button>
          )}

          {clinic.status !== 'ARCHIVED' && (
            <Button
              variant="outline"
              disabled={updating}
              onClick={() => handleStatusChange('ARCHIVED', 'Super Admin archived clinic workspace.')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-danger)' }}
            >
              <Archive size={16} />
              <span>Archive Workspace</span>
            </Button>
          )}
        </div>
      </ClinicCard>

      {/* Profile Verification Audit Details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <ClinicCard title="Registration Credentials">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Building2 size={18} style={{ color: 'var(--color-primary)' }} />
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Legal Name</span>
                <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{clinic.legalName}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FileText size={18} style={{ color: 'var(--color-primary)' }} />
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Medical Registration</span>
                <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{clinic.registrationNumber}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FileText size={18} style={{ color: 'var(--color-primary)' }} />
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Tax ID</span>
                <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{clinic.taxId}</span>
              </div>
            </div>
          </div>
        </ClinicCard>

        <ClinicCard title="Contact & Facility Info">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Mail size={18} style={{ color: 'var(--color-primary)' }} />
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Email</span>
                <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{clinic.primaryEmail}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Phone size={18} style={{ color: 'var(--color-primary)' }} />
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Phone</span>
                <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{clinic.primaryPhone}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <MapPin size={18} style={{ color: 'var(--color-primary)', marginTop: '0.2rem' }} />
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Address</span>
                <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>
                  {clinic.location.addressLine1}, {clinic.location.city}, {clinic.location.state}
                </span>
              </div>
            </div>
          </div>
        </ClinicCard>
      </div>
    </div>
  )
}
