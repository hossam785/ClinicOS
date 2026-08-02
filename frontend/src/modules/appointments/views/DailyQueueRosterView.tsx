import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { AppointmentProfile } from '../types/appointment.types'
import { appointmentApi } from '../services/appointmentApi'
import AppointmentHeader from '../components/AppointmentHeader'
import AppointmentCard from '../components/AppointmentCard'
import AppointmentStatusBadge from '../components/AppointmentStatusBadge'
import Button from '@/design-system/components/Button'
import Alert from '@/design-system/components/Alert'
import Loader from '@/design-system/components/Loader'
import { UserCheck, Activity, ArrowLeft, Clock, Stethoscope } from 'lucide-react'

export default function DailyQueueRosterView() {
  const navigate = useNavigate()
  const [queue, setQueue] = useState<AppointmentProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    let isMounted = true
    const loadQueue = async () => {
      try {
        setLoading(true)
        setErrorMsg('')
        const list = await appointmentApi.getDailyQueue()
        if (isMounted) setQueue(list)
      } catch (err: unknown) {
        if (isMounted) {
          const error = err as { message?: string }
          setErrorMsg(error.message || 'Failed to load waiting room queue.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadQueue()
    return () => {
      isMounted = false
    }
  }, [])

  const checkedInQueue = queue.filter((a) => a.status === 'CHECKED_IN')
  const inConsultationQueue = queue.filter((a) => a.status === 'IN_CONSULTATION')

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem' }}>
      <AppointmentHeader
        title="Real-Time Waiting Room Queue"
        subtitle="Active Patient Queue Roster & Consultation Progression Console"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Appointments Directory', href: '/dashboard/appointments' },
          { label: 'Waiting Room Queue' },
        ]}
        actions={
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard/appointments')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Directory</span>
          </Button>
        }
      />

      {errorMsg && (
        <Alert variant="danger" title="Error" style={{ marginBottom: '1.5rem' }}>
          {errorMsg}
        </Alert>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <Loader size="large" />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {/* Waiting Room Queue Cards */}
          <AppointmentCard title="Checked-In Patients (Waiting Room)">
            {checkedInQueue.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--color-text-muted)' }}>
                <UserCheck size={40} style={{ marginBottom: '0.5rem', strokeWidth: 1.5 }} />
                <p style={{ margin: 0 }}>Waiting room is currently empty.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {checkedInQueue.map((apt) => (
                  <div
                    key={apt.id}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-bg-surface)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text-main)' }}>{apt.patientName}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                          {apt.patientCode}
                        </span>
                      </div>
                      <AppointmentStatusBadge status={apt.status} />
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                      <div>Attending: <strong>{apt.doctorName}</strong></div>
                      <div>Scheduled Slot: {apt.startTime} - {apt.endTime}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-warning)', marginTop: '0.25rem' }}>
                        <Clock size={13} /> Checked In Recently
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <Button
                        variant="primary"
                        onClick={() => navigate(`/dashboard/appointments/${apt.id}/audit`)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                      >
                        <Activity size={14} />
                        <span>Start Consultation</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AppointmentCard>

          {/* Doctor Live Status Summary */}
          <AppointmentCard title="Active Doctor Consultations">
            {inConsultationQueue.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--color-text-muted)' }}>
                <Stethoscope size={40} style={{ marginBottom: '0.5rem', strokeWidth: 1.5 }} />
                <p style={{ margin: 0 }}>No consultation in progress at this moment.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {inConsultationQueue.map((apt) => (
                  <div
                    key={apt.id}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-bg-surface)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text-main)' }}>{apt.patientName}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                          {apt.patientCode}
                        </span>
                      </div>
                      <AppointmentStatusBadge status={apt.status} />
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                      <div>Attending Doctor: <strong>{apt.doctorName}</strong></div>
                      <div>Slot: {apt.startTime} - {apt.endTime}</div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <Button
                        variant="primary"
                        onClick={() => navigate(`/dashboard/appointments/${apt.id}/audit`)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                      >
                        <Stethoscope size={14} />
                        <span>Manage Consultation</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AppointmentCard>
        </div>
      )}
    </div>
  )
}
