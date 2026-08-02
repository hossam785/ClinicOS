import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { doctorApi } from '../services/doctorApi'
import DoctorHeader from '../components/DoctorHeader'
import DoctorCard from '../components/DoctorCard'
import Input from '@/design-system/components/Input'
import Button from '@/design-system/components/Button'
import Alert from '@/design-system/components/Alert'
import Loader from '@/design-system/components/Loader'
import { Save, ArrowLeft, DollarSign, Clock } from 'lucide-react'

export default function DoctorFeesView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [consultationFee, setConsultationFee] = useState<number>(150)
  const [durationMinutes, setDurationMinutes] = useState<number>(30)
  const [currency, setCurrency] = useState<string>('USD')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    let isMounted = true
    const loadDoctor = async () => {
      const docId = id || 'doc-101'
      try {
        setLoading(true)
        setErrorMsg('')
        const doc = await doctorApi.getDoctorById(docId)
        if (isMounted && doc) {
          setConsultationFee(doc.consultationFee)
          setDurationMinutes(doc.defaultConsultationDuration)
          setCurrency(doc.currency || 'USD')
        }
      } catch (err: unknown) {
        if (isMounted) {
          const error = err as { message?: string }
          setErrorMsg(error.message || 'Failed to load fee settings.')
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (consultationFee < 0) {
      setErrorMsg('Consultation Fee cannot be negative.')
      return
    }
    if (durationMinutes < 10 || durationMinutes > 120) {
      setErrorMsg('Default duration must be between 10 and 120 minutes.')
      return
    }

    const docId = id || 'doc-101'
    try {
      setSaving(true)
      setErrorMsg('')
      setSavedSuccess(false)

      await doctorApi.updateFees(docId, consultationFee, durationMinutes)
      setSavedSuccess(true)
    } catch (err: unknown) {
      const error = err as { message?: string }
      setErrorMsg(error.message || 'Failed to save fee settings.')
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
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem' }}>
      <DoctorHeader
        title="Consultation Fees & Duration"
        subtitle="Configure consultation rate structures and appointment slot durations"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Doctors Directory', href: '/dashboard/doctors' },
          { label: 'Doctor Profile', href: `/dashboard/doctors/${id || 'doc-101'}` },
          { label: 'Fees & Duration' },
        ]}
        actions={
          <Button
            variant="outline"
            onClick={() => navigate(`/dashboard/doctors/${id || 'doc-101'}`)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Profile</span>
          </Button>
        }
      />

      {savedSuccess && (
        <Alert variant="info" title="Fee Structure Saved" style={{ marginBottom: '1.5rem' }}>
          Consultation fees and default duration parameters updated successfully.
        </Alert>
      )}

      {errorMsg && (
        <Alert variant="danger" title="Validation Error" style={{ marginBottom: '1.5rem' }}>
          {errorMsg}
        </Alert>
      )}

      <form onSubmit={handleSave}>
        <DoctorCard title="Fee & Duration Settings">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <DollarSign size={18} style={{ color: 'var(--color-success)' }} />
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                  Consultation Fee ({currency}) *
                </label>
              </div>
              <Input
                type="number"
                min={0}
                value={consultationFee}
                onChange={(e) => setConsultationFee(Number(e.target.value))}
                required
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '0.35rem' }}>
                Standard fee charged per patient consultation session.
              </span>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Clock size={18} style={{ color: 'var(--color-primary)' }} />
                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                  Default Slot Duration (Minutes) *
                </label>
              </div>
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
                <option value={20}>20 Minutes</option>
                <option value={30}>30 Minutes</option>
                <option value={45}>45 Minutes</option>
                <option value={60}>60 Minutes</option>
              </select>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '0.35rem' }}>
                Standard calendar slot interval reserved for appointments.
              </span>
            </div>
          </div>
        </DoctorCard>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <Button
            variant="outline"
            onClick={() => navigate(`/dashboard/doctors/${id || 'doc-101'}`)}
            type="button"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={saving}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save Fee Settings'}</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
