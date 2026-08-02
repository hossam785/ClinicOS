import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { AppointmentProfile } from '../types/appointment.types'
import { appointmentApi } from '../services/appointmentApi'
import AppointmentHeader from '../components/AppointmentHeader'
import AppointmentCard from '../components/AppointmentCard'
import Button from '@/design-system/components/Button'
import Alert from '@/design-system/components/Alert'
import Loader from '@/design-system/components/Loader'
import { Edit3, ArrowLeft, User, Stethoscope, Calendar, Clock, FileText, CheckCircle2 } from 'lucide-react'

export default function AppointmentDetailsView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [appointment, setAppointment] = useState<AppointmentProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'emr' | 'billing'>('overview')

  useEffect(() => {
    let isMounted = true
    const loadApt = async () => {
      const aptId = id || 'apt-101'
      try {
        setLoading(true)
        setErrorMsg('')
        const data = await appointmentApi.getAppointmentById(aptId)
        if (isMounted) setAppointment(data)
      } catch (err: unknown) {
        if (isMounted) {
          const error = err as { message?: string }
          setErrorMsg(error.message || 'Failed to retrieve appointment details.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadApt()
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

  if (errorMsg && !appointment) {
    return (
      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1.5rem' }}>
        <Alert variant="danger" title="Error">
          {errorMsg}
        </Alert>
      </div>
    )
  }

  if (!appointment) return null

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem' }}>
      <AppointmentHeader
        title={`Appointment: ${appointment.appointmentNumber}`}
        subtitle={`Patient: ${appointment.patientName} (${appointment.patientCode}) • Date: ${appointment.appointmentDate}`}
        status={appointment.status}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Appointments Directory', href: '/dashboard/appointments' },
          { label: appointment.appointmentNumber },
        ]}
        actions={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard/appointments')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <ArrowLeft size={16} />
              <span>Back to Directory</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(`/dashboard/appointments/${appointment.id}/audit`)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <CheckCircle2 size={16} />
              <span>Lifecycle Actions</span>
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate(`/dashboard/appointments/${appointment.id}/edit`)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Edit3 size={16} />
              <span>Edit Appointment</span>
            </Button>
          </div>
        }
      />

      {/* Reserved Section Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          borderBottom: '2px solid var(--color-border)',
          marginBottom: '1.5rem',
        }}
      >
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '0.6rem 1rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'overview' ? '3px solid var(--color-primary)' : '3px solid transparent',
            color: activeTab === 'overview' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            marginBottom: '-2px',
          }}
        >
          Reservation Overview
        </button>
        <button
          onClick={() => setActiveTab('emr')}
          style={{
            padding: '0.6rem 1rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'emr' ? '3px solid var(--color-primary)' : '3px solid transparent',
            color: activeTab === 'emr' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            marginBottom: '-2px',
          }}
        >
          Clinical Encounters (EMR)
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          style={{
            padding: '0.6rem 1rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'billing' ? '3px solid var(--color-primary)' : '3px solid transparent',
            color: activeTab === 'billing' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            marginBottom: '-2px',
          }}
        >
          Billing & Invoices
        </button>
      </div>

      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Left Column: Patient & Doctor Summaries */}
          <div>
            <AppointmentCard title="Patient Summary">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                <User size={18} style={{ color: 'var(--color-primary)' }} />
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Patient Name & Code</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>
                    {appointment.patientName} ({appointment.patientCode})
                  </span>
                </div>
              </div>
            </AppointmentCard>

            <AppointmentCard title="Attending Doctor Summary">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                <Stethoscope size={18} style={{ color: 'var(--color-primary)' }} />
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Doctor & Specialty</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>
                    {appointment.doctorName} ({appointment.doctorSpecialty || 'General'})
                  </span>
                </div>
              </div>
            </AppointmentCard>
          </div>

          {/* Right Column: Time Slot & Chief Complaint */}
          <div>
            <AppointmentCard title="Slot Timing & Classification">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Calendar size={18} style={{ color: 'var(--color-primary)' }} />
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Appointment Date</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{appointment.appointmentDate}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Clock size={18} style={{ color: 'var(--color-primary)' }} />
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Time Slot Range</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>
                      {appointment.startTime} - {appointment.endTime} ({appointment.durationMinutes} mins)
                    </span>
                  </div>
                </div>
              </div>
            </AppointmentCard>

            <AppointmentCard title="Chief Complaint">
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-main)' }}>
                {appointment.chiefComplaint || 'No chief complaint specified.'}
              </p>
            </AppointmentCard>
          </div>
        </div>
      )}

      {activeTab === 'emr' && (
        <AppointmentCard title="Clinical Encounters & EMR Progress Notes">
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
            <Stethoscope size={44} style={{ marginBottom: '0.75rem', strokeWidth: 1.5 }} />
            <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--color-text-main)' }}>EMR Integration Placeholder</h4>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              Clinical progress notes, diagnosis codes, and prescriptions will be attached here upon EMR Module integration.
            </p>
          </div>
        </AppointmentCard>
      )}

      {activeTab === 'billing' && (
        <AppointmentCard title="Billing Statements & Consultation Invoices">
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
            <FileText size={44} style={{ marginBottom: '0.75rem', strokeWidth: 1.5 }} />
            <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--color-text-main)' }}>Billing Module Placeholder</h4>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              Consultation fee invoices, payment receipts, and insurance claims will be rendered here upon Billing Module integration.
            </p>
          </div>
        </AppointmentCard>
      )}
    </div>
  )
}
