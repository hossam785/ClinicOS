import type { ClinicStatus } from '../types/clinic.types'
import { Clock, CheckCircle, CheckCircle2, ShieldAlert, Archive } from 'lucide-react'
import Badge from '@/design-system/components/Badge'

export interface ClinicStatusBadgeProps {
  status: ClinicStatus
}

export default function ClinicStatusBadge({ status }: ClinicStatusBadgeProps) {
  switch (status) {
    case 'PENDING_REVIEW':
      return (
        <Badge variant="warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <Clock size={14} />
          <span>Pending Review</span>
        </Badge>
      )
    case 'APPROVED':
      return (
        <Badge variant="info" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <CheckCircle size={14} />
          <span>Approved</span>
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
