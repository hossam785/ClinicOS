import Badge from '@/design-system/components/Badge'
import type { AppointmentStatus } from '../types/appointment.types'
import { Calendar, CheckCircle2, UserCheck, Activity, XCircle, AlertCircle, RotateCcw } from 'lucide-react'

interface AppointmentStatusBadgeProps {
  status: AppointmentStatus
}

export default function AppointmentStatusBadge({ status }: AppointmentStatusBadgeProps) {
  switch (status) {
    case 'SCHEDULED':
      return (
        <Badge variant="neutral" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <Calendar size={13} />
          <span>Scheduled</span>
        </Badge>
      )
    case 'CONFIRMED':
      return (
        <Badge variant="primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <CheckCircle2 size={13} />
          <span>Confirmed</span>
        </Badge>
      )
    case 'CHECKED_IN':
      return (
        <Badge variant="warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <UserCheck size={13} />
          <span>Checked In</span>
        </Badge>
      )
    case 'IN_CONSULTATION':
      return (
        <Badge variant="primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: 'var(--color-primary-dark)' }}>
          <Activity size={13} />
          <span>In Consultation</span>
        </Badge>
      )
    case 'COMPLETED':
      return (
        <Badge variant="success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <CheckCircle2 size={13} />
          <span>Completed</span>
        </Badge>
      )
    case 'CANCELLED':
      return (
        <Badge variant="danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <XCircle size={13} />
          <span>Cancelled</span>
        </Badge>
      )
    case 'NO_SHOW':
      return (
        <Badge variant="danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#7f1d1d', color: '#ffffff' }}>
          <AlertCircle size={13} />
          <span>No Show</span>
        </Badge>
      )
    case 'RESCHEDULED':
      return (
        <Badge variant="neutral" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#6b21a8', color: '#ffffff' }}>
          <RotateCcw size={13} />
          <span>Rescheduled</span>
        </Badge>
      )
    default:
      return <Badge variant="neutral">{status}</Badge>
  }
}
