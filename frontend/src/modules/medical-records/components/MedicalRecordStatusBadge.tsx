import Badge from '@/design-system/components/Badge'
import type { MedicalRecordStatus } from '../types/medicalRecord.types'
import { FileText, Activity, CheckCircle2, Lock, Archive } from 'lucide-react'

interface MedicalRecordStatusBadgeProps {
  status: MedicalRecordStatus
}

export default function MedicalRecordStatusBadge({ status }: MedicalRecordStatusBadgeProps) {
  switch (status) {
    case 'DRAFT':
      return (
        <Badge variant="neutral" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <FileText size={13} />
          <span>Draft</span>
        </Badge>
      )
    case 'IN_PROGRESS':
      return (
        <Badge variant="primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <Activity size={13} />
          <span>In Progress</span>
        </Badge>
      )
    case 'COMPLETED':
      return (
        <Badge variant="success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <CheckCircle2 size={13} />
          <span>Completed</span>
        </Badge>
      )
    case 'LOCKED':
      return (
        <Badge variant="warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#9a3412', color: '#ffffff' }}>
          <Lock size={13} />
          <span>Signed & Locked</span>
        </Badge>
      )
    case 'ARCHIVED':
      return (
        <Badge variant="danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <Archive size={13} />
          <span>Archived</span>
        </Badge>
      )
    default:
      return <Badge variant="neutral">{status}</Badge>
  }
}
