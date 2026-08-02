import type { DoctorStatus } from '../types/doctor.types'
import { Clock, CheckCircle2, ShieldAlert, Archive } from 'lucide-react'
import Badge from '@/design-system/components/Badge'

export interface DoctorStatusBadgeProps {
  status: DoctorStatus
}

export default function DoctorStatusBadge({ status }: DoctorStatusBadgeProps) {
  switch (status) {
    case 'PENDING_VERIFICATION':
      return (
        <Badge variant="warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <Clock size={14} />
          <span>Pending Verification</span>
        </Badge>
      )
    case 'ACTIVE':
      return (
        <Badge variant="success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <CheckCircle2 size={14} />
          <span>Active</span>
        </Badge>
      )
    case 'SUSPENDED':
      return (
        <Badge variant="danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <ShieldAlert size={14} />
          <span>Suspended</span>
        </Badge>
      )
    case 'ARCHIVED':
      return (
        <Badge variant="neutral" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <Archive size={14} />
          <span>Archived</span>
        </Badge>
      )
    default:
      return null
  }
}
