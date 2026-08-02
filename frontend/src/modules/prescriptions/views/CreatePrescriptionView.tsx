import React, { useState, useEffect, useCallback } from 'react'
import { Pill, CheckCircle2, Clock, AlertTriangle, AlertCircle } from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { usePrescriptionForm } from '../hooks/usePrescriptionForm'
import { prescriptionApi } from '../services/prescriptionApi'
import PrescriptionHeader from '../components/PrescriptionHeader'
import MedicationBuilder from '../components/MedicationBuilder'
import Card from '@/design-system/components/Card'
import Input from '@/design-system/components/Input'
import Textarea from '@/design-system/components/Textarea'
import Button from '@/design-system/components/Button'

export const CreatePrescriptionView: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const initialPatientId = searchParams.get('patientId') || ''
  const initialMedicalRecordId = searchParams.get('medicalRecordId') || ''
  const initialAppointmentId = searchParams.get('appointmentId') || ''

  const {
    formData,
    errors,
    setField,
    addMedication,
    removeMedication,
    duplicateMedication,
    updateMedication,
    reorderMedication,
    validateForm,
  } = usePrescriptionForm({
    patientId: initialPatientId,
    medicalRecordId: initialMedicalRecordId,
    appointmentId: initialAppointmentId,
  })

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Handle Save Draft
  const handleSaveDraft = async () => {
    setSubmitError(null)
    if (!formData.patientId || !formData.medicalRecordId) {
      setSubmitError('Patient ID and Medical Record ID are required to save a draft.')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await prescriptionApi.createPrescription({
        patientId: formData.patientId,
        medicalRecordId: formData.medicalRecordId,
        appointmentId: formData.appointmentId || undefined,
        clinicId: formData.clinicId || 'clinic_main',
        visitDate: formData.visitDate,
        diagnosisSummary: formData.diagnosisSummary,
        clinicalNotes: formData.clinicalNotes,
        followUpAdvice: formData.followUpAdvice,
        medications: formData.medications.map(({ id: _id, ...rest }) => rest),
      })

      navigate(`/dashboard/prescriptions/${response.data._id}`)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to save prescription draft.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Finalize & Sign
  const handleFinalize = useCallback(async () => {
    setSubmitError(null)
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      // 1. Create prescription draft
      const createResponse = await prescriptionApi.createPrescription({
        patientId: formData.patientId,
        medicalRecordId: formData.medicalRecordId,
        appointmentId: formData.appointmentId || undefined,
        clinicId: formData.clinicId || 'clinic_main',
        visitDate: formData.visitDate,
        diagnosisSummary: formData.diagnosisSummary,
        clinicalNotes: formData.clinicalNotes,
        followUpAdvice: formData.followUpAdvice,
        medications: formData.medications.map(({ id: _id, ...rest }) => rest),
      })

      const rxId = createResponse.data._id

      // 2. Finalize & Sign
      const finalizeResponse = await prescriptionApi.finalizePrescription(rxId)
      navigate(`/dashboard/prescriptions/${finalizeResponse.data._id}`)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to finalize prescription.')
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, validateForm, navigate])

  // Listen for Ctrl+Enter shortcut to Finalize
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        handleFinalize()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleFinalize])

  return (
    <div className="create-prescription-workspace" style={{ padding: '1.5rem', maxWidth: '1200px', margin: '0 auto', paddingBottom: '5rem' }}>
      <PrescriptionHeader title="Create Electronic Prescription" subtitle="Clinical Prescribing Workspace (< 60s Target Speed)" />

      {submitError && (
        <div
          style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#991B1B',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <AlertCircle size={20} />
          <span>{submitError}</span>
        </div>
      )}

      {/* Patient & Encounter Scoping Banner */}
      <Card style={{ padding: '1rem', marginBottom: '1.5rem', backgroundColor: '#F8FAFC', borderLeft: '4px solid #2563EB' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.75rem 0', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Pill size={18} style={{ color: '#2563EB' }} />
          Clinical Encounter Metadata
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <Input
            label="Patient ID *"
            placeholder="Enter Patient ID or Code (e.g. PAT-202607-00412)"
            value={formData.patientId}
            onChange={(e) => setField('patientId', e.target.value)}
            error={errors.patientId}
          />

          <Input
            label="Medical Record Encounter ID *"
            placeholder="Enter EMR Record ID (e.g. EMR-202607-00803)"
            value={formData.medicalRecordId}
            onChange={(e) => setField('medicalRecordId', e.target.value)}
            error={errors.medicalRecordId}
          />

          <Input
            label="Appointment ID (Optional)"
            placeholder="Associated Appointment ID"
            value={formData.appointmentId}
            onChange={(e) => setField('appointmentId', e.target.value)}
          />

          <Input
            label="Encounter Visit Date *"
            type="date"
            value={formData.visitDate}
            onChange={(e) => setField('visitDate', e.target.value)}
          />
        </div>

        {/* High-Visibility Allergy Warning Banner Placeholder */}
        <div
          style={{
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#991B1B',
            fontSize: '0.875rem',
          }}
        >
          <AlertTriangle size={18} />
          <span>
            <strong>Recorded Patient Allergies Warning:</strong> Penicillin (Severe Anaphylaxis Risk), Sulfa Drugs. Verify medication safety prior to signing.
          </span>
        </div>
      </Card>

      {/* Diagnosis Summary Section */}
      <Card style={{ padding: '1rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.75rem 0', color: '#0F172A' }}>
          Clinical Diagnosis Summary
        </h3>
        <Textarea
          placeholder="Primary diagnosis details (e.g. Acute Bronchitis & Lower Respiratory Symptoms)..."
          value={formData.diagnosisSummary}
          onChange={(e) => setField('diagnosisSummary', e.target.value)}
          rows={3}
        />
      </Card>

      {/* Medication Builder */}
      <Card style={{ padding: '1rem', marginBottom: '1.5rem' }}>
        <MedicationBuilder
          medications={formData.medications}
          onAdd={addMedication}
          onRemove={removeMedication}
          onDuplicate={duplicateMedication}
          onUpdate={updateMedication}
          onReorder={reorderMedication}
          errors={errors}
        />
      </Card>

      {/* Follow-up & Clinical Notes */}
      <Card style={{ padding: '1rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 1rem 0', color: '#0F172A' }}>
          Patient Guidance & Special Advice
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <Textarea
            label="Follow-Up Advice"
            placeholder="e.g. Return to clinic in 7 days for chest auscultation review or sooner if symptoms worsen..."
            value={formData.followUpAdvice}
            onChange={(e) => setField('followUpAdvice', e.target.value)}
            rows={3}
          />

          <Textarea
            label="Clinical Notes / Dietary Warnings"
            placeholder="e.g. Avoid alcohol and direct sunlight exposure. Take with full glass of water..."
            value={formData.clinicalNotes}
            onChange={(e) => setField('clinicalNotes', e.target.value)}
            rows={3}
          />
        </div>
      </Card>

      {/* Sticky Bottom Action Bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #CBD5E1',
          padding: '0.875rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 -4px 12px rgba(0,0,0,0.08)',
          zIndex: 100,
        }}
      >
        <Button variant="outline" onClick={() => navigate(-1)} disabled={isSubmitting}>
          Cancel
        </Button>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Button
            type="button"
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} /> Save Draft
            </span>
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={handleFinalize}
            disabled={isSubmitting}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={18} /> Finalize & Sign (Ctrl + Enter)
            </span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CreatePrescriptionView
