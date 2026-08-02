import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { VitalSigns } from '../types/medicalRecord.types'
import { medicalRecordApi } from '../services/medicalRecordApi'
import MedicalRecordHeader from '../components/MedicalRecordHeader'
import MedicalRecordCard from '../components/MedicalRecordCard'
import VitalSignsGrid from '../components/VitalSignsGrid'
import Input from '@/design-system/components/Input'
import Button from '@/design-system/components/Button'
import Alert from '@/design-system/components/Alert'
import Loader from '@/design-system/components/Loader'
import { Save, ArrowLeft } from 'lucide-react'

export default function EditMedicalRecordView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [chiefComplaint, setChiefComplaint] = useState('')
  const [hpi, setHpi] = useState('')
  const [vitals, setVitals] = useState<VitalSigns>({})
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState('')
  const [treatmentPlan, setTreatmentPlan] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    let isMounted = true
    const loadRec = async () => {
      const recordId = id || 'emr-101'
      try {
        setLoading(true)
        setErrorMsg('')
        const rec = await medicalRecordApi.getRecordById(recordId)
        if (isMounted && rec) {
          setChiefComplaint(rec.chiefComplaint || '')
          setHpi(rec.historyOfPresentIllness || '')
          setVitals(rec.vitalSigns || {})
          setPrimaryDiagnosis(rec.primaryDiagnosis || '')
          setTreatmentPlan(rec.treatmentPlan || '')
        }
      } catch (err: unknown) {
        if (isMounted) {
          const error = err as { message?: string }
          setErrorMsg(error.message || 'Failed to load medical record details.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadRec()
    return () => {
      isMounted = false
    }
  }, [id])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const recordId = id || 'emr-101'
    try {
      setSaving(true)
      setErrorMsg('')
      setSavedSuccess(false)

      await medicalRecordApi.updateRecord(recordId, {
        chiefComplaint: chiefComplaint.trim() || undefined,
        historyOfPresentIllness: hpi.trim() || undefined,
        vitalSigns: vitals,
        primaryDiagnosis: primaryDiagnosis.trim() || undefined,
        treatmentPlan: treatmentPlan.trim() || undefined,
      })

      setSavedSuccess(true)
    } catch (err: unknown) {
      const error = err as { message?: string }
      setErrorMsg(error.message || 'Failed to update medical record.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '350px' }}>
        <Loader size="large" />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1.5rem' }}>
      <MedicalRecordHeader
        title={`Edit EMR Chart: ${id || 'emr-101'}`}
        subtitle="Update SOAP clinical notes and patient vital signs"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Medical Records Directory', href: '/dashboard/medical-records' },
          { label: `${id || 'emr-101'}`, href: `/dashboard/medical-records/${id || 'emr-101'}` },
          { label: 'Edit Chart' },
        ]}
        actions={
          <Button
            variant="outline"
            onClick={() => navigate(`/dashboard/medical-records/${id || 'emr-101'}`)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ArrowLeft size={16} />
            <span>Cancel</span>
          </Button>
        }
      />

      {savedSuccess && (
        <Alert variant="info" title="Chart Saved" style={{ marginBottom: '1.5rem' }}>
          Medical record updated successfully.
        </Alert>
      )}

      {errorMsg && (
        <Alert variant="danger" title="Error" style={{ marginBottom: '1.5rem' }}>
          {errorMsg}
        </Alert>
      )}

      <form onSubmit={handleSave}>
        <MedicalRecordCard title="Vital Signs Update Panel">
          <VitalSignsGrid vitals={vitals} isEditing={true} onChange={(updated) => setVitals(updated)} />
        </MedicalRecordCard>

        <MedicalRecordCard title="Subjective Clinical Notes">
          <div style={{ marginBottom: '1rem' }}>
            <Input
              label="Chief Complaint *"
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              required
            />
          </div>
          <Input
            label="History of Present Illness (HPI)"
            value={hpi}
            onChange={(e) => setHpi(e.target.value)}
          />
        </MedicalRecordCard>

        <MedicalRecordCard title="Assessment & Treatment Plan">
          <div style={{ marginBottom: '1rem' }}>
            <Input
              label="Primary Clinical Diagnosis"
              value={primaryDiagnosis}
              onChange={(e) => setPrimaryDiagnosis(e.target.value)}
            />
          </div>
          <Input
            label="Therapeutic Treatment Plan"
            value={treatmentPlan}
            onChange={(e) => setTreatmentPlan(e.target.value)}
          />
        </MedicalRecordCard>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <Button variant="outline" onClick={() => navigate(`/dashboard/medical-records/${id || 'emr-101'}`)} type="button">
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={saving}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Save size={16} />
            <span>{saving ? 'Saving Updates...' : 'Save EMR Changes'}</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
