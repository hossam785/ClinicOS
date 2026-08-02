import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { PatientProfile } from '../types/patient.types'
import { patientApi } from '../services/patientApi'
import PatientHeader from '../components/PatientHeader'
import PatientCard from '../components/PatientCard'
import PatientMedicalFlags from '../components/PatientMedicalFlags'
import Button from '@/design-system/components/Button'
import Alert from '@/design-system/components/Alert'
import Loader from '@/design-system/components/Loader'
import { Edit3, ArrowLeft, ShieldAlert, Phone, Mail, User, Calendar, ShieldCheck, Heart, FileText, Stethoscope } from 'lucide-react'

import { PatientAttachmentsWorkspace } from '@/modules/patient-attachments/components/PatientAttachmentsWorkspace'

export default function PatientProfileView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [patient, setPatient] = useState<PatientProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'encounters' | 'attachments' | 'billing'>('overview')

  useEffect(() => {
    let isMounted = true
    const loadPatient = async () => {
      const patId = id || 'pat-101'
      try {
        setLoading(true)
        setErrorMsg('')
        const data = await patientApi.getPatientById(patId)
        if (isMounted) setPatient(data)
      } catch (err: unknown) {
        if (isMounted) {
          const error = err as { message?: string }
          setErrorMsg(error.message || 'Failed to retrieve patient profile.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadPatient()
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

  if (errorMsg && !patient) {
    return (
      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1.5rem' }}>
        <Alert variant="danger" title="Error">
          {errorMsg}
        </Alert>
      </div>
    )
  }

  if (!patient) return null

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem' }}>
      <PatientHeader
        title={patient.fullName}
        subtitle={`Patient Code: ${patient.patientCode} • Registered: ${patient.createdAt.substring(0, 10)}`}
        status={patient.status}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Patients Directory', href: '/dashboard/patients' },
          { label: patient.fullName },
        ]}
        actions={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard/patients')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <ArrowLeft size={16} />
              <span>Back to Directory</span>
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate(`/dashboard/patients/${patient.id}/edit`)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Edit3 size={16} />
              <span>Edit Profile</span>
            </Button>
          </div>
        }
      />

      {/* Prominent Allergy Alert Banner */}
      {patient.allergiesFlag && (
        <Alert variant="danger" title="PATIENT ALLERGY ALERT" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert size={18} />
            <span>
              Known drug or food allergies declared for this patient. Review clinical chart before prescribing medication.
            </span>
          </div>
        </Alert>
      )}

      {/* Reserved Section Navigation Tabs */}
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
          Master Profile Overview
        </button>
        <button
          onClick={() => setActiveTab('encounters')}
          style={{
            padding: '0.6rem 1rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'encounters' ? '3px solid var(--color-primary)' : '3px solid transparent',
            color: activeTab === 'encounters' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            marginBottom: '-2px',
          }}
        >
          Clinical Encounters (EMR)
        </button>
        <button
          onClick={() => setActiveTab('attachments')}
          style={{
            padding: '0.6rem 1rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === 'attachments' ? '3px solid var(--color-primary)' : '3px solid transparent',
            color: activeTab === 'attachments' ? 'var(--color-primary)' : 'var(--color-text-muted)',
            marginBottom: '-2px',
          }}
        >
          Attachments & Files
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
          Billing & Invoices
        </button>
      </div>

      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {/* Left Column: Demographics & Contacts */}
          <div>
            <PatientCard title="Demographic Identity">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <User size={18} style={{ color: 'var(--color-primary)' }} />
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Full Name</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{patient.fullName}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Calendar size={18} style={{ color: 'var(--color-primary)' }} />
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Date of Birth & Gender</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>
                      {patient.dateOfBirth} ({patient.gender})
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <ShieldCheck size={18} style={{ color: 'var(--color-primary)' }} />
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>National ID Code</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>
                      {patient.nationalId || 'Not Specified'}
                    </span>
                  </div>
                </div>
              </div>
            </PatientCard>

            <PatientCard title="Contact Channels & Address">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Phone size={18} style={{ color: 'var(--color-primary)' }} />
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Primary Phone</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{patient.primaryPhone}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Mail size={18} style={{ color: 'var(--color-primary)' }} />
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Email Address</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{patient.email || 'None'}</span>
                  </div>
                </div>
              </div>
            </PatientCard>
          </div>

          {/* Right Column: Emergency & Medical Indicators */}
          <div>
            <PatientCard title="Medical Indicators & Blood Type">
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                  Active Flags
                </span>
                <PatientMedicalFlags
                  allergiesFlag={patient.allergiesFlag}
                  chronicDiseaseFlag={patient.chronicDiseaseFlag}
                  insuranceFlag={patient.insuranceFlag}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', marginTop: '1rem' }}>
                <Heart size={18} style={{ color: 'var(--color-danger)' }} />
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>ABO Blood Group</span>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--color-text-main)' }}>
                    {patient.bloodGroup}
                  </span>
                </div>
              </div>
            </PatientCard>

            <PatientCard title="Emergency Contact Details">
              {patient.emergencyContact ? (
                <div style={{ fontSize: '0.875rem' }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-text-main)', marginBottom: '0.25rem' }}>
                    {patient.emergencyContact.name} ({patient.emergencyContact.relationship})
                  </div>
                  <div style={{ color: 'var(--color-text-muted)' }}>
                    Phone: {patient.emergencyContact.phone}
                  </div>
                </div>
              ) : (
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>No emergency contact registered.</span>
              )}
            </PatientCard>
          </div>
        </div>
      )}

      {activeTab === 'encounters' && (
        <PatientCard title="Clinical Encounters & EMR Timeline">
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
            <Stethoscope size={44} style={{ marginBottom: '0.75rem', strokeWidth: 1.5 }} />
            <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--color-text-main)' }}>EMR Integration Placeholder</h4>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              Clinical progress notes, lab orders, and prescriptions will be attached here upon EMR Module activation.
            </p>
          </div>
        </PatientCard>
      )}

      {activeTab === 'attachments' && (
        <PatientAttachmentsWorkspace patientId={patient.id || 'pat-101'} />
      )}

      {activeTab === 'billing' && (
        <PatientCard title="Billing Receipts & Insurance Claims">
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
            <FileText size={44} style={{ marginBottom: '0.75rem', strokeWidth: 1.5 }} />
            <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--color-text-main)' }}>Billing Module Placeholder</h4>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              Patient invoice statements, payment receipts, and insurance claims will be rendered here upon Billing Module integration.
            </p>
          </div>
        </PatientCard>
      )}
    </div>
  )
}
