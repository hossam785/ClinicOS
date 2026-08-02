import Badge from '@/design-system/components/Badge'
import type { ExpenseStatus } from '../types/expense'

interface ExpenseStatusBadgeProps {
  status: ExpenseStatus
}

export function ExpenseStatusBadge({ status }: ExpenseStatusBadgeProps) {
  switch (status) {
    case 'DRAFT':
      return <Badge variant="neutral">Draft</Badge>
    case 'PENDING_APPROVAL':
      return <Badge variant="warning">Pending Approval</Badge>
    case 'APPROVED':
      return <Badge variant="primary">Approved</Badge>
    case 'REJECTED':
      return <Badge variant="danger">Rejected</Badge>
    case 'PAID':
      return <Badge variant="success">Paid</Badge>
    case 'ARCHIVED':
      return <Badge variant="neutral">Archived</Badge>
    default:
      return <Badge variant="neutral">{status}</Badge>
  }
}
