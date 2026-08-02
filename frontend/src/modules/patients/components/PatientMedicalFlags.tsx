import Badge from '@/design-system/components/Badge'
import { ShieldAlert, Activity, CreditCard } from 'lucide-react'

interface PatientMedicalFlagsProps {
  allergiesFlag: boolean
  chronicDiseaseFlag: boolean
  insuranceFlag: boolean
  style?: React.CSSProperties
}

export default function PatientMedicalFlags({
  allergiesFlag,
  chronicDiseaseFlag,
  insuranceFlag,
  style,
}: PatientMedicalFlagsProps) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', ...style }}>
      {allergiesFlag && (
        <Badge variant="danger">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <ShieldAlert size={12} />
            <span>Allergies</span>
          </span>
        </Badge>
      )}

      {chronicDiseaseFlag && (
        <Badge variant="warning">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <Activity size={12} />
            <span>Chronic Condition</span>
          </span>
        </Badge>
      )}

      {insuranceFlag && (
        <Badge variant="info">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <CreditCard size={12} />
            <span>Insured</span>
          </span>
        </Badge>
      )}

      {!allergiesFlag && !chronicDiseaseFlag && !insuranceFlag && (
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>None Declared</span>
      )}
    </div>
  )
}
