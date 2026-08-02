import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { AppointmentPriority } from '../types/appointment.types'
import { appointmentApi } from '../services/appointmentApi'
import AppointmentHeader from '../components/AppointmentHeader'
import AppointmentCard from '../components/AppointmentCard'
import Input from '@/design-system/components/Input'
import Button from '@/design-system/components/Button'
import Alert from '@/design-system/components/Alert'
import Loader from '@/design-system/components/Loader'
import { Save, ArrowLeft } from 'lucide-react'

export default function EditAppointmentView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [chiefComplaint, setChiefComplaint] = useState('')
  const [priority, setPriority] = useState<AppointmentPriority>('NORMAL')
  const [internalNotes, setInternalNotes] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    let isMounted = true
    const loadApt = async () => {
      const aptId = id || 'apt-101'
      try {
        setLoading(true)
        setErrorMsg('')
        const apt = await appointmentApi.getAppointmentById(aptId)
        if (isMounted && apt) {
          setChiefComplaint(apt.chiefComplaint || '')
          setPriority(apt.priority)
          setInternalNotes(apt.internalNotes || '')
        }
      } catch (err: unknown) {
        if (isMounted) {
          const error = err as { message?: string }
          setErrorMsg(error.message || 'Failed to load appointment details.')
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const aptId = id || 'apt-101'
    try {
      setSaving(true)
      setErrorMsg('')
      setSavedSuccess(false)

      await appointmentApi.updateAppointment(aptId, {
        priority,
        chiefComplaint: chiefComplaint.trim() || undefined,
        internalNotes: internalNotes.trim() || undefined,
      })

      setSavedSuccess(true)
    } catch (err: unknown) {
      const error = err as { message?: string }
      setErrorMsg(error.message || 'Failed to update appointment details.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '350px' }}>
        <Loader size="large" />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', padding: '1.5rem' }}>
      <AppointmentHeader
        title={`Edit Appointment: ${id || 'apt-101'}`}
        subtitle="Update visit priority, chief complaint, and administrative notes"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Appointments Directory', href: '/dashboard/appointments' },
          { label: `${id || 'apt-101'}`, href: `/dashboard/appointments/${id || 'apt-101'}` },
          { label: 'Edit Appointment' },
        ]}
        actions={
          <Button
            variant="outline"
            onClick={() => navigate(`/dashboard/appointments/${id || 'apt-101'}`)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ArrowLeft size={16} />
            <span>Cancel</span>
          </Button>
        }
      />

      {savedSuccess && (
        <Alert variant="info" title="Updates Saved" style={{ marginBottom: '1.5rem' }}>
          Appointment details updated successfully.
        </Alert>
      )}

      {errorMsg && (
        <Alert variant="danger" title="Error" style={{ marginBottom: '1.5rem' }}>
          {errorMsg}
        </Alert>
      )}

      <form onSubmit={handleSave}>
        <AppointmentCard title="Administrative Details & Chief Complaint">
          <div style={{ marginBottom: '1rem' }}>
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

          <div style={{ marginBottom: '1rem' }}>
            <Input
              label="Chief Complaint / Reason for Visit"
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
            />
          </div>

          <Input
            label="Internal Administrative Notes"
            placeholder="Additional reception or clinic staff notes..."
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
          />
        </AppointmentCard>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <Button variant="outline" onClick={() => navigate(`/dashboard/appointments/${id || 'apt-101'}`)} type="button">
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={saving}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Save size={16} />
            <span>{saving ? 'Saving Changes...' : 'Save Appointment Changes'}</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
