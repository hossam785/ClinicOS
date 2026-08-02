import React from 'react'
import { Clock, CheckCircle2, Printer, Lock } from 'lucide-react'
import type { PrescriptionStatus } from '../types/prescription'
import Badge from '@/design-system/components/Badge'

interface PrescriptionStatusBadgeProps {
  status: PrescriptionStatus
}

export const PrescriptionStatusBadge: React.FC<PrescriptionStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'DRAFT':
      return (
        <Badge variant="warning">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={12} /> Draft
          </span>
        </Badge>
      )
    case 'FINALIZED':
      return (
        <Badge variant="success">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={12} /> Finalized
          </span>
        </Badge>
      )
    case 'PRINTED':
      return (
        <Badge variant="info">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Printer size={12} /> Printed
          </span>
        </Badge>
      )
    case 'ARCHIVED':
      return (
        <Badge variant="neutral">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Lock size={12} /> Archived
          </span>
        </Badge>
      )
    default:
      return <Badge variant="neutral">{status}</Badge>
  }
}

export default PrescriptionStatusBadge
