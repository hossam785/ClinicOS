import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { HolidayException } from '../types/clinic.types'
import { clinicApi } from '../services/clinicApi'
import ClinicHeader from '../components/ClinicHeader'
import ClinicCard from '../components/ClinicCard'
import Input from '@/design-system/components/Input'
import Button from '@/design-system/components/Button'
import Alert from '@/design-system/components/Alert'
import Badge from '@/design-system/components/Badge'
import Loader from '@/design-system/components/Loader'
import { Plus, Trash2, CalendarOff, ArrowLeft } from 'lucide-react'

export default function HolidaysView() {
  const navigate = useNavigate()
  const [holidays, setHolidays] = useState<HolidayException[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [newDate, setNewDate] = useState('')
  const [newName, setNewName] = useState('')
  const [newReason, setNewReason] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    let isMounted = true
    const loadHolidays = async () => {
      try {
        setInitialLoading(true)
        const data = await clinicApi.getHolidays()
        if (isMounted) setHolidays(data)
      } catch (err: unknown) {
        if (isMounted) {
          const error = err as { message?: string }
          setErrorMsg(error.message || 'Failed to fetch holiday exceptions.')
        }
      } finally {
        if (isMounted) setInitialLoading(false)
      }
    }
    loadHolidays()
    return () => {
      isMounted = false
    }
  }, [])

  const handleAddHoliday = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDate.trim() || !newName.trim()) {
      setErrorMsg('Please enter both holiday date and holiday name.')
      return
    }

    try {
      setAdding(true)
      setErrorMsg('')
      setSuccessMsg('')

      const created = await clinicApi.addHoliday({
        date: newDate,
        name: newName,
        reason: newReason || 'Custom Clinic Closure',
      })

      setHolidays((prev) => [...prev, created])
      setNewDate('')
      setNewName('')
      setNewReason('')
      setSuccessMsg(`Declared holiday closure for ${created.name} (${created.date}).`)
    } catch (err: unknown) {
      const error = err as { message?: string }
      setErrorMsg(error.message || 'Failed to add holiday exception.')
    } finally {
      setAdding(false)
    }
  }

  const handleDeleteHoliday = async (id: string) => {
    try {
      setErrorMsg('')
      setSuccessMsg('')
      await clinicApi.deleteHoliday(id)
      setHolidays((prev) => prev.filter((h) => h.id !== id))
      setSuccessMsg('Holiday exception removed. Standard weekly schedule restored for date.')
    } catch (err: unknown) {
      const error = err as { message?: string }
      setErrorMsg(error.message || 'Failed to remove holiday exception.')
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
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1.5rem' }}>
      <ClinicHeader
        title="Holiday & Closure Exceptions"
        subtitle="Declare date-specific clinic closures overriding regular shift hours"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Clinic Settings', href: '/dashboard/clinic/profile' },
          { label: 'Holidays' },
        ]}
        actions={
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard/clinic/profile')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ArrowLeft size={16} />
            <span>Return to Profile</span>
          </Button>
        }
      />

      {errorMsg && (
        <Alert variant="danger" title="Error" style={{ marginBottom: '1.5rem' }}>
          {errorMsg}
        </Alert>
      )}
      {successMsg && (
        <Alert variant="success" title="Success" style={{ marginBottom: '1.5rem' }}>
          {successMsg}
        </Alert>
      )}

      {/* Add Holiday Form Card */}
      <ClinicCard title="Declare New Holiday Exception">
        <form onSubmit={handleAddHoliday}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <Input
              type="date"
              label="Holiday Date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              disabled={adding}
              requiredIndicator
            />
            <Input
              label="Holiday / Occasion Name"
              placeholder="e.g. New Year Holiday"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              disabled={adding}
              requiredIndicator
            />
            <Input
              label="Description / Reason"
              placeholder="e.g. Annual Staff Event"
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              disabled={adding}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <Button
              type="submit"
              variant="primary"
              disabled={adding}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Plus size={16} />
              <span>{adding ? 'Adding...' : 'Add Holiday Exception'}</span>
            </Button>
          </div>
        </form>
      </ClinicCard>

      {/* Declared Holidays List */}
      <ClinicCard title="Declared Calendar Exceptions" subtitle="Active closures blocking patient appointments">
        {holidays.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
            <CalendarOff size={44} style={{ marginBottom: '0.75rem', strokeWidth: 1.5 }} />
            <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--color-text-main)' }}>No Holiday Exceptions Declared</h4>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              Clinic operates strictly following standard weekly shift schedules.
            </p>
          </div>
        ) : (
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Date</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Occasion</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Reason</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {holidays.map((h) => (
                  <tr key={h.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>{h.date}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-main)' }}>{h.name}</td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-muted)' }}>{h.reason}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <Badge variant="warning">Closed</Badge>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <Button
                        variant="outline"
                        onClick={() => handleDeleteHoliday(h.id)}
                        style={{ padding: '0.35rem 0.6rem', color: 'var(--color-danger)' }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ClinicCard>
    </div>
  )
}
