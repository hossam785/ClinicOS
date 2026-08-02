import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { AppointmentProfile } from '../types/appointment.types'
import { appointmentApi } from '../services/appointmentApi'
import AppointmentHeader from '../components/AppointmentHeader'
import AppointmentCard from '../components/AppointmentCard'
import AppointmentStatusBadge from '../components/AppointmentStatusBadge'
import Input from '@/design-system/components/Input'
import Button from '@/design-system/components/Button'
import Alert from '@/design-system/components/Alert'
import Loader from '@/design-system/components/Loader'
import { Calendar, Plus, Eye, ListFilter, Users } from 'lucide-react'

export default function AppointmentsDirectoryView() {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState<AppointmentProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      try {
        setLoading(true)
        setErrorMsg('')
        const list = await appointmentApi.listAppointments(statusFilter, undefined, searchTerm)
        if (isMounted) setAppointments(list)
      } catch (err: unknown) {
        if (isMounted) {
          const error = err as { message?: string }
          setErrorMsg(error.message || 'Failed to load appointments directory.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [statusFilter, searchTerm])

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>
      <AppointmentHeader
        title="Appointments Master Directory"
        subtitle="Central Consultation Scheduling Roster & Waiting Room Manager"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Appointments Directory' },
        ]}
        actions={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard/appointments/queue')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Users size={16} />
              <span>Waiting Room Queue</span>
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/dashboard/appointments/new')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Plus size={16} />
              <span>Book New Appointment</span>
            </Button>
          </div>
        }
      />

      {errorMsg && (
        <Alert variant="danger" title="Error" style={{ marginBottom: '1.5rem' }}>
          {errorMsg}
        </Alert>
      )}

      <AppointmentCard>
        {/* Search & Filter Toolbar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ flex: '1 1 300px' }}>
            <Input
              placeholder="Search by patient name, doctor, appointment code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <ListFilter size={14} /> Filter Status:
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: '0.875rem',
                backgroundColor: 'var(--color-bg-surface)',
                color: 'var(--color-text-main)',
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CHECKED_IN">Checked In</option>
              <option value="IN_CONSULTATION">In Consultation</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="NO_SHOW">No Show</option>
              <option value="RESCHEDULED">Rescheduled</option>
            </select>
          </div>
        </div>

        {/* Master Appointment Table */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem 0' }}>
            <Loader size="medium" />
          </div>
        ) : appointments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
            <Calendar size={44} style={{ marginBottom: '0.75rem', strokeWidth: 1.5 }} />
            <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--color-text-main)' }}>No Appointments Found</h4>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              No appointment records match your current search query and filter criteria.
            </p>
          </div>
        ) : (
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Code</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Patient Name</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Attending Doctor</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Date & Slot Time</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Visit Type</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt) => (
                  <tr key={apt.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>
                      {apt.appointmentNumber}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                      {apt.patientName}
                      <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>
                        {apt.patientPhone}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-main)' }}>
                      {apt.doctorName}
                      <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        {apt.doctorSpecialty}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-main)' }}>
                      {apt.appointmentDate}
                      <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                        {apt.startTime} - {apt.endTime} ({apt.durationMinutes}m)
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-muted)' }}>
                      {apt.appointmentType}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <AppointmentStatusBadge status={apt.status} />
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/dashboard/appointments/${apt.id}`)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.65rem' }}
                      >
                        <Eye size={14} />
                        <span>View Details</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AppointmentCard>
    </div>
  )
}
