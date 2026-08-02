import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { DoctorShift } from '../types/doctor.types'
import { doctorApi } from '../services/doctorApi'
import DoctorHeader from '../components/DoctorHeader'
import DoctorCard from '../components/DoctorCard'
import DoctorShiftTable from '../components/DoctorShiftTable'
import Button from '@/design-system/components/Button'
import Alert from '@/design-system/components/Alert'
import Loader from '@/design-system/components/Loader'
import { Save, ArrowLeft } from 'lucide-react'

export default function DoctorScheduleView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [shifts, setShifts] = useState<DoctorShift[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    let isMounted = true
    const loadShifts = async () => {
      const docId = id || 'doc-101'
      try {
        setLoading(true)
        setErrorMsg('')
        const doc = await doctorApi.getDoctorById(docId)
        if (isMounted && doc) {
          setShifts(doc.shifts || [])
        }
      } catch (err: unknown) {
        if (isMounted) {
          const error = err as { message?: string }
          setErrorMsg(error.message || 'Failed to load shift schedule.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadShifts()
    return () => {
      isMounted = false
    }
  }, [id])

  const handleSave = async () => {
    const docId = id || 'doc-101'
    try {
      setSaving(true)
      setErrorMsg('')
      setSavedSuccess(false)

      await doctorApi.updateSchedule(docId, shifts)
      setSavedSuccess(true)
    } catch (err: unknown) {
      const error = err as { message?: string }
      setErrorMsg(error.message || 'Failed to save shift schedule.')
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
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1.5rem' }}>
      <DoctorHeader
        title="Practitioner Shift Schedule"
        subtitle="Manage weekly consultation working hours and lunch break intervals"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Doctors Directory', href: '/dashboard/doctors' },
          { label: 'Doctor Profile', href: `/dashboard/doctors/${id || 'doc-101'}` },
          { label: 'Shift Roster' },
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
        <Alert variant="info" title="Schedule Updated" style={{ marginBottom: '1.5rem' }}>
          Weekly shift roster updated successfully.
        </Alert>
      )}

      {errorMsg && (
        <Alert variant="danger" title="Validation Error" style={{ marginBottom: '1.5rem' }}>
          {errorMsg}
        </Alert>
      )}

      <DoctorCard title="Weekly Shift Roster Editor" subtitle="Toggle active shift days and configure shift start and end times">
        <DoctorShiftTable shifts={shifts} editable onShiftsChange={setShifts} />
      </DoctorCard>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
        <Button
          variant="outline"
          onClick={() => navigate(`/dashboard/doctors/${id || 'doc-101'}`)}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={saving}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Save size={16} />
          <span>{saving ? 'Saving Roster...' : 'Save Shift Schedule'}</span>
        </Button>
      </div>
    </div>
  )
}
