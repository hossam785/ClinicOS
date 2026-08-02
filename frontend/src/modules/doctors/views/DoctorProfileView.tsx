import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { DoctorProfile } from '../types/doctor.types'
import { doctorApi } from '../services/doctorApi'
import DoctorHeader from '../components/DoctorHeader'
import DoctorCard from '../components/DoctorCard'
import DoctorShiftTable from '../components/DoctorShiftTable'
import Button from '@/design-system/components/Button'
import Alert from '@/design-system/components/Alert'
import Loader from '@/design-system/components/Loader'
import { Edit3, Clock, DollarSign, Award, Calendar, FileText, ArrowLeft, ShieldCheck } from 'lucide-react'

export default function DoctorProfileView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [doctor, setDoctor] = useState<DoctorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    let isMounted = true
    const loadDoctor = async () => {
      const docId = id || 'doc-101'
      try {
        setLoading(true)
        setErrorMsg('')
        const data = await doctorApi.getDoctorById(docId)
        if (isMounted) setDoctor(data)
      } catch (err: unknown) {
        if (isMounted) {
          const error = err as { message?: string }
          setErrorMsg(error.message || 'Failed to retrieve doctor record.')
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
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem' }}>
      <DoctorHeader
        title={`${doctor.medicalTitle} ${doctor.legalName}`}
        subtitle={`${doctor.primarySpecialty} Practitioner • ${doctor.department}`}
        status={doctor.status}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Doctors Directory', href: '/dashboard/doctors' },
          { label: doctor.legalName },
        ]}
        actions={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard/doctors')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <ArrowLeft size={16} />
              <span>Back to Directory</span>
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate(`/dashboard/doctors/${doctor.id}/edit`)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Edit3 size={16} />
              <span>Edit Profile</span>
            </Button>
          </div>
        }
      />

      {/* Grid Layout: Left Column (Metadata), Right Column (Fee & Shift Details) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Professional Qualifications & Bio */}
        <div>
          <DoctorCard title="Professional Qualifications">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Award size={18} style={{ color: 'var(--color-primary)' }} />
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Primary Specialty</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{doctor.primarySpecialty}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FileText size={18} style={{ color: 'var(--color-primary)' }} />
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Medical Board License</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{doctor.medicalLicenseNumber}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>
                    {doctor.licenseIssuingAuthority} (Exp: {doctor.licenseExpirationDate})
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShieldCheck size={18} style={{ color: 'var(--color-primary)' }} />
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>National ID</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{doctor.nationalId}</span>
                </div>
              </div>
            </div>
          </DoctorCard>

          <DoctorCard title="Biography & Experience">
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-main)', lineHeight: '1.6', margin: 0 }}>
              {doctor.biography || 'No practitioner biography provided.'}
            </p>
          </DoctorCard>
        </div>

        {/* Consultation Fee & Shift Schedule */}
        <div>
          <DoctorCard
            title="Consultation Fees & Slot Duration"
            action={
              <Button
                variant="outline"
                onClick={() => navigate(`/dashboard/doctors/${doctor.id}/fees`)}
                style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
              >
                Configure Fees
              </Button>
            }
          >
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <DollarSign size={20} style={{ color: 'var(--color-success)' }} />
                <div>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', display: 'block' }}>Consultation Fee</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                    ${doctor.consultationFee} <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>{doctor.currency}</span>
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Clock size={20} style={{ color: 'var(--color-primary)' }} />
                <div>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', display: 'block' }}>Default Duration</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                    {doctor.defaultConsultationDuration} <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>mins</span>
                  </span>
                </div>
              </div>
            </div>
          </DoctorCard>

          <DoctorCard
            title="Weekly Shift Roster"
            action={
              <Button
                variant="outline"
                onClick={() => navigate(`/dashboard/doctors/${doctor.id}/schedule`)}
                style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
              >
                <Calendar size={14} />
                <span>Edit Roster</span>
              </Button>
            }
          >
            <DoctorShiftTable shifts={doctor.shifts || []} />
          </DoctorCard>
        </div>
      </div>
    </div>
  )
}
