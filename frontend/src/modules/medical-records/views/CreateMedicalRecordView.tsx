import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { EncounterType, VitalSigns } from '../types/medicalRecord.types'
import { medicalRecordApi } from '../services/medicalRecordApi'
import MedicalRecordHeader from '../components/MedicalRecordHeader'
import MedicalRecordCard from '../components/MedicalRecordCard'
import VitalSignsGrid from '../components/VitalSignsGrid'
import Input from '@/design-system/components/Input'
import Button from '@/design-system/components/Button'
import Alert from '@/design-system/components/Alert'
import { Plus, ArrowLeft } from 'lucide-react'

export default function CreateMedicalRecordView() {
  const navigate = useNavigate()

  const [patientName, setPatientName] = useState('Eleanor Vance')
  const [patientCode, setPatientCode] = useState('PAT-202607-00101')
  const [patientId] = useState('pat-101')
  const [doctorId] = useState('doc-101')
  const [appointmentId] = useState('apt-101')
  const [doctorName, setDoctorName] = useState('Dr. Sarah Jenkins')
  const [visitDate, setVisitDate] = useState('2026-07-30')
  const [visitType, setVisitType] = useState<EncounterType>('FOLLOW_UP')

  const [chiefComplaint, setChiefComplaint] = useState('')
  const [hpi, setHpi] = useState('')
  const [vitals, setVitals] = useState<VitalSigns>({})
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState('')
  const [treatmentPlan, setTreatmentPlan] = useState('')

  const [errorMsg, setErrorMsg] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!patientName.trim() || !patientCode.trim()) {
      setErrorMsg('Patient identification is required.')
      return
    }

    try {
      setSaving(true)
      setErrorMsg('')

      const created = await medicalRecordApi.createRecord({
        appointmentId,
        patientId,
        patientName: patientName.trim(),
        patientCode: patientCode.trim(),
        doctorId,
        doctorName: doctorName.trim(),
        visitDate,
        visitType,
        chiefComplaint: chiefComplaint.trim() || undefined,
        historyOfPresentIllness: hpi.trim() || undefined,
        vitalSigns: vitals,
        primaryDiagnosis: primaryDiagnosis.trim() || undefined,
        treatmentPlan: treatmentPlan.trim() || undefined,
      })

      navigate(`/dashboard/medical-records/${created.id}`)
    } catch (err: unknown) {
      const error = err as { message?: string }
      setErrorMsg(error.message || 'Failed to create medical record.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1.5rem' }}>
      <MedicalRecordHeader
        title="Create New EMR Chart"
        subtitle="Initialize clinical documentation for an active consultation"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Medical Records Directory', href: '/dashboard/medical-records' },
          { label: 'New EMR Chart' },
        ]}
        actions={
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard/medical-records')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ArrowLeft size={16} />
            <span>Cancel</span>
          </Button>
        }
      />

      {errorMsg && (
        <Alert variant="danger" title="Validation Error" style={{ marginBottom: '1.5rem' }}>
          {errorMsg}
        </Alert>
      )}

      <form onSubmit={handleSave}>
        {/* Patient & Practitioner Header */}
        <MedicalRecordCard title="Encounter Context & Identity">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <Input
              label="Patient Name *"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              required
            />
            <Input
              label="Patient Code *"
              value={patientCode}
              onChange={(e) => setPatientCode(e.target.value)}
              required
            />
            <Input
              label="Attending Doctor *"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              required
            />
            <Input
              label="Visit Date *"
              type="date"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              required
            />
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Encounter Type
              </label>
              <select
                value={visitType}
                onChange={(e) => setVisitType(e.target.value as EncounterType)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.875rem',
                  backgroundColor: 'var(--color-bg-surface)',
                  color: 'var(--color-text-main)',
                }}
              >
                <option value="FOLLOW_UP">Follow Up</option>
                <option value="FIRST_VISIT">First Visit</option>
                <option value="ROUTINE_CHECKUP">Routine Checkup</option>
                <option value="EMERGENCY">Emergency</option>
              </select>
            </div>
          </div>
        </MedicalRecordCard>

        {/* Vital Signs Panel */}
        <MedicalRecordCard title="Patient Vital Signs Log">
          <VitalSignsGrid vitals={vitals} isEditing={true} onChange={(updated) => setVitals(updated)} />
        </MedicalRecordCard>

        {/* Subjective SOAP Notes */}
        <MedicalRecordCard title="Subjective Notes (Chief Complaint & HPI)">
          <div style={{ marginBottom: '1rem' }}>
            <Input
              label="Chief Complaint *"
              placeholder="Primary reason for visit..."
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              required
            />
          </div>
          <Input
            label="History of Present Illness (HPI)"
            placeholder="Detailed symptom progression, duration, and clinical onset..."
            value={hpi}
            onChange={(e) => setHpi(e.target.value)}
          />
        </MedicalRecordCard>

        {/* Assessment & Plan */}
        <MedicalRecordCard title="Assessment & Treatment Plan">
          <div style={{ marginBottom: '1rem' }}>
            <Input
              label="Primary Clinical Diagnosis"
              placeholder="e.g. Essential Primary Hypertension"
              value={primaryDiagnosis}
              onChange={(e) => setPrimaryDiagnosis(e.target.value)}
            />
          </div>
          <Input
            label="Therapeutic Treatment Plan"
            placeholder="Prescribed drugs, lifestyle modifications, and return visit instructions..."
            value={treatmentPlan}
            onChange={(e) => setTreatmentPlan(e.target.value)}
          />
        </MedicalRecordCard>

        {/* Actions Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <Button variant="outline" onClick={() => navigate('/dashboard/medical-records')} type="button">
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={saving}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={16} />
            <span>{saving ? 'Initializing Chart...' : 'Create EMR Draft Record'}</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
