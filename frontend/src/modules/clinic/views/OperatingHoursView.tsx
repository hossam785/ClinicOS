import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { DayOperatingHours } from '../types/clinic.types'
import { clinicApi } from '../services/clinicApi'
import ClinicHeader from '../components/ClinicHeader'
import ClinicCard from '../components/ClinicCard'
import OperatingHoursTable from '../components/OperatingHoursTable'
import Button from '@/design-system/components/Button'
import Alert from '@/design-system/components/Alert'
import Loader from '@/design-system/components/Loader'
import { Save, ArrowLeft, RotateCcw } from 'lucide-react'

const defaultSchedule: DayOperatingHours[] = [
  { dayOfWeek: 'Monday', isOpen: true, shiftStart: '08:00', shiftEnd: '17:00', hasLunchBreak: true, lunchStart: '12:00', lunchEnd: '13:00' },
  { dayOfWeek: 'Tuesday', isOpen: true, shiftStart: '08:00', shiftEnd: '17:00', hasLunchBreak: true, lunchStart: '12:00', lunchEnd: '13:00' },
  { dayOfWeek: 'Wednesday', isOpen: true, shiftStart: '08:00', shiftEnd: '17:00', hasLunchBreak: true, lunchStart: '12:00', lunchEnd: '13:00' },
  { dayOfWeek: 'Thursday', isOpen: true, shiftStart: '08:00', shiftEnd: '17:00', hasLunchBreak: true, lunchStart: '12:00', lunchEnd: '13:00' },
  { dayOfWeek: 'Friday', isOpen: true, shiftStart: '08:00', shiftEnd: '16:00', hasLunchBreak: true, lunchStart: '12:00', lunchEnd: '13:00' },
  { dayOfWeek: 'Saturday', isOpen: false, shiftStart: '09:00', shiftEnd: '13:00', hasLunchBreak: false },
  { dayOfWeek: 'Sunday', isOpen: false, shiftStart: '09:00', shiftEnd: '13:00', hasLunchBreak: false },
]

export default function OperatingHoursView() {
  const navigate = useNavigate()
  const [schedule, setSchedule] = useState<DayOperatingHours[]>(defaultSchedule)
  const [initialLoading, setInitialLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    let isMounted = true
    const loadSchedule = async () => {
      try {
        setInitialLoading(true)
        const data = await clinicApi.getOperatingHours()
        if (isMounted && data && data.length > 0) {
          setSchedule(data)
        }
      } catch (err: unknown) {
        if (isMounted) {
          const error = err as { message?: string }
          setErrorMsg(error.message || 'Failed to fetch operating hours.')
        }
      } finally {
        if (isMounted) setInitialLoading(false)
      }
    }
    loadSchedule()
    return () => {
      isMounted = false
    }
  }, [])

  const handleReset = () => {
    setSchedule(defaultSchedule)
    setErrorMsg('')
    setSuccessMsg('Reset schedule to standard shift hours.')
  }

  const validateSchedule = (): boolean => {
    for (const day of schedule) {
      if (day.isOpen) {
        if (day.shiftStart >= day.shiftEnd) {
          setErrorMsg(`Invalid shift times for ${day.dayOfWeek}. Shift start time must be before end time.`)
          return false
        }
        if (day.hasLunchBreak && day.lunchStart && day.lunchEnd) {
          if (day.lunchStart >= day.lunchEnd) {
            setErrorMsg(`Invalid lunch break times for ${day.dayOfWeek}. Lunch start must be before lunch end.`)
            return false
          }
          if (day.lunchStart < day.shiftStart || day.lunchEnd > day.shiftEnd) {
            setErrorMsg(`Lunch break for ${day.dayOfWeek} must be entirely within shift hours.`)
            return false
          }
        }
      }
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateSchedule()) return

    try {
      setSaving(true)
      setErrorMsg('')
      setSuccessMsg('')

      const updated = await clinicApi.updateOperatingHours(schedule)
      setSchedule(updated)
      setSuccessMsg('Weekly operating hours updated and enforced across booking channels.')
    } catch (err: unknown) {
      const error = err as { message?: string }
      setErrorMsg(error.message || 'Failed to update operating hours.')
    } finally {
      setSaving(false)
    }
  }

  if (initialLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '350px' }}>
        <Loader size="large" />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem' }}>
      <ClinicHeader
        title="Weekly Operating Hours"
        subtitle="Configure active shift times and lunch breaks enforced for appointments"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Clinic Settings', href: '/dashboard/clinic/profile' },
          { label: 'Operating Hours' },
        ]}
        actions={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button
              variant="outline"
              onClick={handleReset}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <RotateCcw size={16} />
              <span>Reset Defaults</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard/clinic/profile')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <ArrowLeft size={16} />
              <span>Return to Profile</span>
            </Button>
          </div>
        }
      />

      {errorMsg && (
        <Alert variant="danger" title="Constraint Failure" style={{ marginBottom: '1.5rem' }}>
          {errorMsg}
        </Alert>
      )}
      {successMsg && (
        <Alert variant="success" title="Success" style={{ marginBottom: '1.5rem' }}>
          {successMsg}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <ClinicCard
          title="Daily Shift Schedule Table"
          subtitle="Toggle days open/closed and edit shift bounds"
        >
          <OperatingHoursTable schedule={schedule} editable={true} onScheduleChange={setSchedule} />
        </ClinicCard>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
          <Button variant="outline" type="button" onClick={() => navigate('/dashboard/clinic/profile')}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={saving}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Save size={16} />
            <span>{saving ? 'Enforcing Schedule...' : 'Save Shift Schedule'}</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
