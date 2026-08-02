import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { AppointmentProfile } from '../types/appointment.types'
import { appointmentApi } from '../services/appointmentApi'
import AppointmentHeader from '../components/AppointmentHeader'
import AppointmentCard from '../components/AppointmentCard'
import Button from '@/design-system/components/Button'
import Alert from '@/design-system/components/Alert'
import Input from '@/design-system/components/Input'
import Loader from '@/design-system/components/Loader'
import { UserCheck, Activity, CheckCircle2, RotateCcw, XCircle, ArrowLeft } from 'lucide-react'

export default function AppointmentAuditReviewView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [appointment, setAppointment] = useState<AppointmentProfile | null>(null)
  const [cancellationReason, setCancellationReason] = useState('')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [feedbackMsg, setFeedbackMsg] = useState('')

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
          setErrorMsg(error.message || 'Failed to retrieve appointment lifecycle details.')
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

  const handleCheckIn = async () => {
    if (!appointment) return
    try {
      setUpdating(true)
      setErrorMsg('')
      setFeedbackMsg('')
      const updated = await appointmentApi.checkInPatient(appointment.id)
      setAppointment(updated)
      setFeedbackMsg('Patient checked-in successfully into Waiting Room Queue.')
    } catch (err: unknown) {
      const error = err as { message?: string }
      setErrorMsg(error.message || 'Failed to check-in patient.')
    } finally {
      setUpdating(false)
    }
  }

  const handleStartConsultation = async () => {
    if (!appointment) return
    try {
      setUpdating(true)
      setErrorMsg('')
      setFeedbackMsg('')
      const updated = await appointmentApi.startConsultation(appointment.id)
      setAppointment(updated)
      setFeedbackMsg('Doctor consultation started successfully.')
    } catch (err: unknown) {
      const error = err as { message?: string }
      setErrorMsg(error.message || 'Failed to start doctor consultation.')
    } finally {
      setUpdating(false)
    }
  }

  const handleCompleteConsultation = async () => {
    if (!appointment) return
    try {
      setUpdating(true)
      setErrorMsg('')
      setFeedbackMsg('')
      const updated = await appointmentApi.completeConsultation(appointment.id)
      setAppointment(updated)
      setFeedbackMsg('Consultation completed successfully. Billable event emitted.')
    } catch (err: unknown) {
      const error = err as { message?: string }
      setErrorMsg(error.message || 'Failed to complete consultation.')
    } finally {
      setUpdating(false)
    }
  }

  const handleCancel = async () => {
    if (!appointment) return
    if (!cancellationReason.trim()) {
      setErrorMsg('A cancellation reason is required before cancelling an appointment.')
      return
    }

    try {
      setUpdating(true)
      setErrorMsg('')
      setFeedbackMsg('')
      const updated = await appointmentApi.cancelAppointment(appointment.id, cancellationReason)
      setAppointment(updated)
      setFeedbackMsg('Appointment cancelled successfully.')
    } catch (err: unknown) {
      const error = err as { message?: string }
      setErrorMsg(error.message || 'Failed to cancel appointment.')
    } finally {
      setUpdating(false)
    }
  }

  const handleReschedule = async () => {
    if (!appointment) return
    try {
      setUpdating(true)
      setErrorMsg('')
      setFeedbackMsg('')
      const updated = await appointmentApi.updateStatus(appointment.id, 'RESCHEDULED', 'Rescheduled to new date/time slot.')
      setAppointment(updated)
      setFeedbackMsg('Appointment marked as Rescheduled.')
    } catch (err: unknown) {
      const error = err as { message?: string }
      setErrorMsg(error.message || 'Failed to reschedule appointment.')
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
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem' }}>
      <AppointmentHeader
        title={`Lifecycle Console: ${appointment.appointmentNumber}`}
        subtitle={`Patient: ${appointment.patientName} • Doctor: ${appointment.doctorName}`}
        status={appointment.status}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Appointments Directory', href: '/dashboard/appointments' },
          { label: 'Appointment Details', href: `/dashboard/appointments/${appointment.id}` },
          { label: 'Lifecycle Controls' },
        ]}
        actions={
          <Button
            variant="outline"
            onClick={() => navigate(`/dashboard/appointments/${appointment.id}`)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ArrowLeft size={16} />
            <span>Return to Details</span>
          </Button>
        }
      />

      {errorMsg && (
        <Alert variant="danger" title="Action Error" style={{ marginBottom: '1.5rem' }}>
          {errorMsg}
        </Alert>
      )}

      {feedbackMsg && (
        <Alert variant="info" title="Status Transition Executed" style={{ marginBottom: '1.5rem' }}>
          {feedbackMsg}
        </Alert>
      )}

      <AppointmentCard title="Reception & Doctor Operational Actions">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {(appointment.status === 'SCHEDULED' || appointment.status === 'CONFIRMED') && (
            <Button
              variant="primary"
              disabled={updating}
              onClick={handleCheckIn}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <UserCheck size={16} />
              <span>Check-In Patient (Waiting Room)</span>
            </Button>
          )}

          {appointment.status === 'CHECKED_IN' && (
            <Button
              variant="primary"
              disabled={updating}
              onClick={handleStartConsultation}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Activity size={16} />
              <span>Start Doctor Consultation</span>
            </Button>
          )}

          {appointment.status === 'IN_CONSULTATION' && (
            <Button
              variant="primary"
              disabled={updating}
              onClick={handleCompleteConsultation}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <CheckCircle2 size={16} />
              <span>Complete Consultation Visit</span>
            </Button>
          )}

          {appointment.status !== 'COMPLETED' && appointment.status !== 'CANCELLED' && (
            <Button
              variant="outline"
              disabled={updating}
              onClick={handleReschedule}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <RotateCcw size={16} />
              <span>Reschedule Slot</span>
            </Button>
          )}
        </div>

        {appointment.status !== 'COMPLETED' && appointment.status !== 'CANCELLED' && (
          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', color: 'var(--color-danger)' }}>
              Cancel Appointment Reservation
            </h4>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 280px' }}>
                <Input
                  label="Mandatory Cancellation Reason *"
                  placeholder="e.g. Patient called to cancel due to fever."
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                />
              </div>
              <Button
                variant="danger"
                disabled={updating}
                onClick={handleCancel}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}
              >
                <XCircle size={16} />
                <span>Cancel Reservation</span>
              </Button>
            </div>
          </div>
        )}
      </AppointmentCard>

      <AppointmentCard title="Audit & Operational Policy Rules">
        <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
          <p style={{ margin: '0 0 0.5rem 0' }}>
            • <strong>Check-In</strong> logs patient arrival timestamp and moves appointment into the active Doctor Waiting Room Queue.
          </p>
          <p style={{ margin: '0 0 0.5rem 0' }}>
            • <strong>Start Consultation</strong> initializes the clinical encounter chart in EMR.
          </p>
          <p style={{ margin: 0 }}>
            • <strong>Complete Visit</strong> marks the consultation finished and emits a billable fee item to Billing.
          </p>
        </div>
      </AppointmentCard>
    </div>
  )
}
