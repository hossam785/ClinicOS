import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { AppointmentType, AppointmentPriority } from '../types/appointment.types'
import { appointmentApi } from '../services/appointmentApi'
import AppointmentHeader from '../components/AppointmentHeader'
import AppointmentCard from '../components/AppointmentCard'
import AppointmentCalendarGrid from '../components/AppointmentCalendarGrid'
import Input from '@/design-system/components/Input'
import Button from '@/design-system/components/Button'
import Alert from '@/design-system/components/Alert'
import { Plus, ArrowLeft } from 'lucide-react'

export default function CreateAppointmentView() {
  const navigate = useNavigate()

  const [patientName, setPatientName] = useState('Eleanor Vance')
  const [patientCode, setPatientCode] = useState('PAT-202607-00101')
  const [patientId] = useState('pat-101')
  const [doctorId] = useState('doc-101')
  const [doctorName, setDoctorName] = useState('Dr. Sarah Jenkins')
  const [appointmentDate, setAppointmentDate] = useState('2026-07-30')
  const [startTime, setStartTime] = useState('09:00')
  const [durationMinutes, setDurationMinutes] = useState<number>(30)
  const [appointmentType, setAppointmentType] = useState<AppointmentType>('FOLLOW_UP')
  const [priority, setPriority] = useState<AppointmentPriority>('NORMAL')
  const [chiefComplaint, setChiefComplaint] = useState('')

  const [errorMsg, setErrorMsg] = useState('')
  const [saving, setSaving] = useState(false)

  const computeEndTime = (start: string, duration: number): string => {
    const [h, m] = start.split(':').map(Number)
    const totalMins = h * 60 + m + duration
    const endH = Math.floor(totalMins / 60)
    const endM = totalMins % 60
    return `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!patientName.trim() || !patientCode.trim()) {
      setErrorMsg('Patient identity is required.')
      return
    }
    if (!appointmentDate || !startTime) {
      setErrorMsg('Appointment Date and Time Slot must be selected.')
      return
    }

    const endTime = computeEndTime(startTime, durationMinutes)

    try {
      setSaving(true)
      setErrorMsg('')

      const created = await appointmentApi.createAppointment({
        patientId,
        patientName: patientName.trim(),
        patientCode: patientCode.trim(),
        doctorId,
        doctorName: doctorName.trim(),
        appointmentDate,
        startTime,
        endTime,
        durationMinutes,
        appointmentType,
        priority,
        chiefComplaint: chiefComplaint.trim() || undefined,
      })

      navigate(`/dashboard/appointments/${created.id}`)
    } catch (err: unknown) {
      const error = err as { message?: string }
      setErrorMsg(error.message || 'Failed to book appointment.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto', padding: '1.5rem' }}>
      <AppointmentHeader
        title="Book New Appointment"
        subtitle="Schedule a conflict-free consultation slot in the clinic workspace"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Appointments Directory', href: '/dashboard/appointments' },
          { label: 'Book New Appointment' },
        ]}
        actions={
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard/appointments')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ArrowLeft size={16} />
            <span>Cancel</span>
          </Button>
        }
      />

      {errorMsg && (
        <Alert variant="danger" title="Validation Error" style={{ marginBottom: '1.5rem' }}>
          {errorMsg}
        </Alert>
      )}

      <form onSubmit={handleSave}>
        {/* Patient & Practitioner Assignment */}
        <AppointmentCard title="Patient & Attending Doctor Assignment">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <Input
              label="Patient Full Name *"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              required
            />
            <Input
              label="Patient Code *"
              value={patientCode}
              onChange={(e) => setPatientCode(e.target.value)}
              required
            />
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Attending Doctor *
              </label>
              <select
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.875rem',
                  backgroundColor: 'var(--color-bg-surface)',
                  color: 'var(--color-text-main)',
                }}
              >
                <option value="Dr. Sarah Jenkins">Dr. Sarah Jenkins (Cardiology)</option>
                <option value="Dr. Michael Chang">Dr. Michael Chang (Pediatrics)</option>
                <option value="Dr. Robert Vance">Dr. Robert Vance (General Medicine)</option>
              </select>
            </div>
          </div>
        </AppointmentCard>

        {/* Date & Time Slot Grid */}
        <AppointmentCard title="Date & Available Time Slot Selection">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <Input
              label="Appointment Date *"
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              required
            />

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Slot Duration (Minutes)
              </label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.875rem',
                  backgroundColor: 'var(--color-bg-surface)',
                  color: 'var(--color-text-main)',
                }}
              >
                <option value={15}>15 Minutes</option>
                <option value={30}>30 Minutes</option>
                <option value={45}>45 Minutes</option>
                <option value={60}>60 Minutes</option>
              </select>
            </div>
          </div>

          <AppointmentCalendarGrid
            date={appointmentDate}
            doctorName={doctorName}
            selectedTime={startTime}
            onSelectSlot={(time) => setStartTime(time)}
          />
        </AppointmentCard>

        {/* Clinical Classification */}
        <AppointmentCard title="Visit Classification & Chief Complaint">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Visit Type
              </label>
              <select
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value as AppointmentType)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.875rem',
                  backgroundColor: 'var(--color-bg-surface)',
                  color: 'var(--color-text-main)',
                }}
              >
                <option value="FOLLOW_UP">Follow Up</option>
                <option value="FIRST_VISIT">First Visit</option>
                <option value="ROUTINE_CHECKUP">Routine Checkup</option>
                <option value="EMERGENCY">Emergency</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as AppointmentPriority)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.875rem',
                  backgroundColor: 'var(--color-bg-surface)',
                  color: 'var(--color-text-main)',
                }}
              >
                <option value="NORMAL">Normal</option>
                <option value="URGENT">Urgent</option>
                <option value="EMERGENCY">Emergency</option>
              </select>
            </div>
          </div>

          <Input
            label="Chief Complaint / Reason for Visit"
            placeholder="e.g. Patient reports routine cardiac BP review."
            value={chiefComplaint}
            onChange={(e) => setChiefComplaint(e.target.value)}
          />
        </AppointmentCard>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <Button variant="outline" onClick={() => navigate('/dashboard/appointments')} type="button">
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={saving}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={16} />
            <span>{saving ? 'Booking Slot...' : 'Confirm Appointment Reservation'}</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
