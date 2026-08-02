import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { MedicalRecordProfile } from '../types/medicalRecord.types'
import { medicalRecordApi } from '../services/medicalRecordApi'
import MedicalRecordHeader from '../components/MedicalRecordHeader'
import MedicalRecordCard from '../components/MedicalRecordCard'
import PatientHistoryTimeline from '../components/PatientHistoryTimeline'
import Button from '@/design-system/components/Button'
import Alert from '@/design-system/components/Alert'
import Loader from '@/design-system/components/Loader'
import { ArrowLeft, User, Plus } from 'lucide-react'

export default function PatientHistoryView() {
  const { patientId } = useParams<{ patientId: string }>()
  const navigate = useNavigate()
  const [historyRecords, setHistoryRecords] = useState<MedicalRecordProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    let isMounted = true
    const loadHistory = async () => {
      const pId = patientId || 'pat-101'
      try {
        setLoading(true)
        setErrorMsg('')
        const history = await medicalRecordApi.getPatientHistory(pId)
        if (isMounted) setHistoryRecords(history)
      } catch (err: unknown) {
        if (isMounted) {
          const error = err as { message?: string }
          setErrorMsg(error.message || 'Failed to load patient history timeline.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadHistory()
    return () => {
      isMounted = false
    }
  }, [patientId])

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1.5rem' }}>
      <MedicalRecordHeader
        title="Patient Clinical History Timeline"
        subtitle={`Chronological chart repository for Patient ${patientId || 'pat-101'}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Medical Records Directory', href: '/dashboard/medical-records' },
          { label: 'Patient Clinical History' },
        ]}
        actions={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard/medical-records')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <ArrowLeft size={16} />
              <span>Back to Directory</span>
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/dashboard/medical-records/new')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Plus size={16} />
              <span>New EMR Encounter</span>
            </Button>
          </div>
        }
      />

      {errorMsg && (
        <Alert variant="danger" title="Error" style={{ marginBottom: '1.5rem' }}>
          {errorMsg}
        </Alert>
      )}

      <MedicalRecordCard title="Patient Profile Context">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
          <User size={20} style={{ color: 'var(--color-primary)' }} />
          <div>
            <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>
              {historyRecords.length > 0 ? historyRecords[0].patientName : 'Eleanor Vance'} ({historyRecords.length > 0 ? historyRecords[0].patientCode : 'PAT-202607-00101'})
            </span>
            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Female • 38 Years Old • Master Patient Index File
            </span>
          </div>
        </div>
      </MedicalRecordCard>

      <MedicalRecordCard title="Chronological Clinical Consultations Timeline">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem 0' }}>
            <Loader size="medium" />
          </div>
        ) : (
          <PatientHistoryTimeline records={historyRecords} />
        )}
      </MedicalRecordCard>
    </div>
  )
}
