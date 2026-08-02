import type { PatientStatus } from '../types/patient.types'
import Badge from '@/design-system/components/Badge'
import { CheckCircle2, Clock, Archive, UserX } from 'lucide-react'

interface PatientStatusBadgeProps {
  status: PatientStatus
  style?: React.CSSProperties
}

export default function PatientStatusBadge({ status, style }: PatientStatusBadgeProps) {
  switch (status) {
    case 'ACTIVE':
      return (
        <Badge variant="success" style={style}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckCircle2 size={13} />
            <span>Active</span>
          </span>
        </Badge>
      )
    case 'INACTIVE':
      return (
        <Badge variant="neutral" style={style}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Clock size={13} />
            <span>Inactive</span>
          </span>
        </Badge>
      )
    case 'ARCHIVED':
      return (
        <Badge variant="warning" style={style}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Archive size={13} />
            <span>Archived</span>
          </span>
        </Badge>
      )
    case 'DECEASED':
      return (
        <Badge variant="danger" style={style}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <UserX size={13} />
            <span>Deceased</span>
          </span>
        </Badge>
      )
    default:
      return (
        <Badge variant="neutral" style={style}>
          <span>{status}</span>
        </Badge>
      )
  }
}
