import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { MedicalRecordProfile } from '../types/medicalRecord.types'
import { medicalRecordApi } from '../services/medicalRecordApi'
import MedicalRecordHeader from '../components/MedicalRecordHeader'
import MedicalRecordCard from '../components/MedicalRecordCard'
import VitalSignsGrid from '../components/VitalSignsGrid'
import Button from '@/design-system/components/Button'
import Alert from '@/design-system/components/Alert'
import Loader from '@/design-system/components/Loader'
import { Edit3, ArrowLeft, User, Stethoscope, FileText, CheckCircle2, History, PlusCircle } from 'lucide-react'

export default function MedicalRecordDetailsView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [record, setRecord] = useState<MedicalRecordProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'prescriptions' | 'billing'>('overview')

  useEffect(() => {
    let isMounted = true
    const loadRec = async () => {
      const recordId = id || 'emr-101'
      try {
        setLoading(true)
        setErrorMsg('')
        const data = await medicalRecordApi.getRecordById(recordId)
        if (isMounted) setRecord(data)
      } catch (err: unknown) {
        if (isMounted) {
          const error = err as { message?: string }
          setErrorMsg(error.message || 'Failed to retrieve medical record details.')
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

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '350px' }}>
        <Loader size="large" />
      </div>
    )
  }

  if (errorMsg && !record) {
    return (
      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1.5rem' }}>
        <Alert variant="danger" title="Error">
          {errorMsg}
        </Alert>
      </div>
    )
  }

  if (!record) return null

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem' }}>
      <MedicalRecordHeader
        title={`Medical Record: ${record.recordNumber}`}
        subtitle={`Patient: ${record.patientName} (${record.patientCode}) • Doctor: ${record.doctorName}`}
        status={record.status}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Medical Records Directory', href: '/dashboard/medical-records' },
          { label: record.recordNumber },
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
              variant="outline"
              onClick={() => navigate(`/dashboard/medical-records/patient/${record.patientId}/history`)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <History size={16} />
              <span>Patient History</span>
            </Button>
            {!record.isLocked ? (
              <Button
                variant="primary"
                onClick={() => navigate(`/dashboard/medical-records/${record.id}/edit`)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <Edit3 size={16} />
                <span>Edit Chart</span>
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={() => navigate(`/dashboard/medical-records/${record.id}/lock`)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <PlusCircle size={16} />
                <span>Submit Addendum</span>
              </Button>
            )}
          </div>
        }
      />

      {record.isLocked && (
        <Alert variant="warning" title="Signed & Locked Medical Chart" style={{ marginBottom: '1.5rem' }}>
          This medical record was finalized and locked on {record.lockedAt ? new Date(record.lockedAt).toLocaleDateString() : 'today'}. Core chart contents are read-only.
        </Alert>
      )}

      {/* Tabs Bar */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          borderBottom: '2px solid var(--color-border)',
          marginBottom: '1.5rem',
        }}
      >
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '0.6rem 1rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'overview' ? '3px solid var(--color-primary)' : '3px solid transparent',
            color: activeTab === 'overview' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            marginBottom: '-2px',
          }}
        >
          Clinical Chart & SOAP
        </button>
        <button
          onClick={() => setActiveTab('prescriptions')}
          style={{
            padding: '0.6rem 1rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'prescriptions' ? '3px solid var(--color-primary)' : '3px solid transparent',
            color: activeTab === 'prescriptions' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            marginBottom: '-2px',
          }}
        >
          Prescriptions & Pharmacy
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          style={{
            padding: '0.6rem 1rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'billing' ? '3px solid var(--color-primary)' : '3px solid transparent',
            color: activeTab === 'billing' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            marginBottom: '-2px',
          }}
        >
          Invoicing & Claims
        </button>
      </div>

      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Patient & Doctor Identifiers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <MedicalRecordCard title="Patient Summary">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                <User size={18} style={{ color: 'var(--color-primary)' }} />
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Patient Name & Gender</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>
                    {record.patientName} ({record.patientGender || 'N/A'}, {record.patientAge || '--'} yrs)
                  </span>
                </div>
              </div>
            </MedicalRecordCard>

            <MedicalRecordCard title="Attending Physician">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                <Stethoscope size={18} style={{ color: 'var(--color-primary)' }} />
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Doctor & Specialty</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>
                    {record.doctorName} ({record.doctorSpecialty || 'General'})
                  </span>
                </div>
              </div>
            </MedicalRecordCard>
          </div>

          {/* Patient Vital Signs */}
          <MedicalRecordCard title="Patient Vital Signs Log">
            <VitalSignsGrid vitals={record.vitalSigns} isEditing={false} />
          </MedicalRecordCard>

          {/* SOAP Clinical Encounter Details */}
          <MedicalRecordCard title="Subjective Notes & HPI">
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>CHIEF COMPLAINT</span>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.95rem', color: 'var(--color-text-main)' }}>
                {record.chiefComplaint || 'No complaint specified.'}
              </p>
            </div>

            {record.historyOfPresentIllness && (
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>HISTORY OF PRESENT ILLNESS (HPI)</span>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.95rem', color: 'var(--color-text-main)' }}>
                  {record.historyOfPresentIllness}
                </p>
              </div>
            )}
          </MedicalRecordCard>

          <MedicalRecordCard title="Assessment & Diagnosis">
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>PRIMARY DIAGNOSIS</span>
              <h4 style={{ margin: '0.25rem 0 0 0', fontSize: '1.1rem', color: 'var(--color-primary)' }}>
                {record.primaryDiagnosis || 'Pending Diagnosis'}
              </h4>
            </div>

            {record.secondaryDiagnoses && record.secondaryDiagnoses.length > 0 && (
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>SECONDARY DIAGNOSES</span>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                  {record.secondaryDiagnoses.map((diag, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--color-bg-surface)',
                        border: '1px solid var(--color-border)',
                        fontSize: '0.85rem',
                      }}
                    >
                      {diag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </MedicalRecordCard>

          <MedicalRecordCard title="Therapeutic Treatment Plan">
            <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--color-text-main)', lineHeight: 1.6 }}>
              {record.treatmentPlan || 'No treatment plan specified.'}
            </p>
          </MedicalRecordCard>

          {/* Addenda Section */}
          {record.addenda && record.addenda.length > 0 && (
            <MedicalRecordCard title="Post-Lock Addenda Submissions">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {record.addenda.map((add) => (
                  <div
                    key={add.id}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-bg-surface)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '0.35rem' }}>
                      <span>Submitted by <strong>{add.createdByName || add.createdBy}</strong></span>
                      <span>{new Date(add.createdAt).toLocaleString()}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
                      {add.text}
                    </p>
                  </div>
                ))}
              </div>
            </MedicalRecordCard>
          )}
        </div>
      )}

      {activeTab === 'prescriptions' && (
        <MedicalRecordCard title="Prescriptions & Pharmacy Dispatches">
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
            <CheckCircle2 size={44} style={{ marginBottom: '0.75rem', strokeWidth: 1.5 }} />
            <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--color-text-main)' }}>Pharmacy Integration Placeholder</h4>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              e-Prescription medication dispatches and dosage instructions will render here upon Pharmacy Module integration.
            </p>
          </div>
        </MedicalRecordCard>
      )}

      {activeTab === 'billing' && (
        <MedicalRecordCard title="Billing Statements & Consultation Invoices">
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
            <FileText size={44} style={{ marginBottom: '0.75rem', strokeWidth: 1.5 }} />
            <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--color-text-main)' }}>Billing Integration Placeholder</h4>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              Consultation fee invoices, procedure claims, and payment receipts will render here upon Billing Module integration.
            </p>
          </div>
        </MedicalRecordCard>
      )}
    </div>
  )
}
