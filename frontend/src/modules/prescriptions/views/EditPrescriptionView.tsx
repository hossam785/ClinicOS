import React, { useState, useEffect, useCallback } from 'react'
import { CheckCircle2, Clock, AlertCircle, Lock } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { usePrescriptionForm } from '../hooks/usePrescriptionForm'
import { prescriptionApi } from '../services/prescriptionApi'
import type { Prescription } from '../types/prescription'
import PrescriptionHeader from '../components/PrescriptionHeader'
import MedicationBuilder from '../components/MedicationBuilder'
import Card from '@/design-system/components/Card'
import Input from '@/design-system/components/Input'
import Textarea from '@/design-system/components/Textarea'
import Button from '@/design-system/components/Button'
import Loader from '@/design-system/components/Loader'

export const EditPrescriptionView: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [prescription, setPrescription] = useState<Prescription | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const {
    formData,
    errors,
    setField,
    setFormData,
    addMedication,
    removeMedication,
    duplicateMedication,
    updateMedication,
    reorderMedication,
    validateForm,
  } = usePrescriptionForm()

  const fetchPrescription = useCallback(async () => {
    if (!id) return
    setIsLoading(true)
    setError(null)
    try {
      const response = await prescriptionApi.getPrescriptionById(id)
      const data = response.data
      setPrescription(data)

      setFormData({
        patientId: data.patientId,
        medicalRecordId: data.medicalRecordId,
        appointmentId: data.appointmentId || '',
        clinicId: data.clinicId,
        visitDate: data.visitDate,
        diagnosisSummary: data.diagnosisSummary || '',
        clinicalNotes: data.clinicalNotes || '',
        followUpAdvice: data.followUpAdvice || '',
        medications: data.medications.map((m, idx) => ({ ...m, id: m.id || `med_${idx}` })),
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load prescription.')
    } finally {
      setIsLoading(false)
    }
  }, [id, setFormData])

  useEffect(() => {
    fetchPrescription()
  }, [fetchPrescription])

  const handleUpdate = async () => {
    if (!id) return
    setError(null)

    setIsSubmitting(true)
    try {
      await prescriptionApi.updatePrescription(id, {
        diagnosisSummary: formData.diagnosisSummary,
        clinicalNotes: formData.clinicalNotes,
        followUpAdvice: formData.followUpAdvice,
        medications: formData.medications.map(({ id: _mId, ...rest }) => rest),
      })

      navigate(`/dashboard/prescriptions/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update prescription draft.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFinalize = async () => {
    if (!id || !validateForm()) return
    setError(null)

    setIsSubmitting(true)
    try {
      // 1. Update latest draft content
      await prescriptionApi.updatePrescription(id, {
        diagnosisSummary: formData.diagnosisSummary,
        clinicalNotes: formData.clinicalNotes,
        followUpAdvice: formData.followUpAdvice,
        medications: formData.medications.map(({ id: _mId, ...rest }) => rest),
      })

      // 2. Finalize & Sign
      const finalizeRes = await prescriptionApi.finalizePrescription(id)
      navigate(`/dashboard/prescriptions/${finalizeRes.data._id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to finalize prescription.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <Loader size="large" />
        <p style={{ marginTop: '1rem', color: '#64748B' }}>Loading prescription draft...</p>
      </div>
    )
  }

  if (!prescription) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Prescription Not Found</h2>
        <Button onClick={() => navigate('/dashboard/prescriptions')}>Back to Roster</Button>
      </div>
    )
  }

  const isLocked = prescription.status !== 'DRAFT'

  return (
    <div className="edit-prescription-workspace" style={{ padding: '1.5rem', maxWidth: '1200px', margin: '0 auto', paddingBottom: '5rem' }}>
      <PrescriptionHeader
        prescription={prescription}
        title={`Edit Prescription ${prescription.prescriptionNumber}`}
        subtitle={`Visit Date: ${prescription.visitDate}`}
      />

      {error && (
        <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          <AlertCircle size={20} /> <span>{error}</span>
        </div>
      )}

      {isLocked && (
        <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #FCD34D', color: '#92400E', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Lock size={20} />
          <span>
            <strong>Prescription is Locked ({prescription.status}):</strong> Finalized prescriptions are immutable and cannot be updated.
          </span>
        </div>
      )}

      {/* Patient Meta */}
      <Card style={{ padding: '1rem', marginBottom: '1.5rem', backgroundColor: '#F8FAFC' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.75rem 0' }}>Patient & Encounter Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <Input label="Patient ID" value={formData.patientId} disabled />
          <Input label="Medical Record ID" value={formData.medicalRecordId} disabled />
          <Input label="Visit Date" value={formData.visitDate} disabled />
        </div>
      </Card>

      {/* Diagnosis */}
      <Card style={{ padding: '1rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.75rem 0' }}>Diagnosis Summary</h3>
        <Textarea
          value={formData.diagnosisSummary}
          onChange={(e) => setField('diagnosisSummary', e.target.value)}
          disabled={isLocked}
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

      {/* Follow Up & Notes */}
      <Card style={{ padding: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
          <Textarea
            label="Follow-Up Advice"
            value={formData.followUpAdvice}
            onChange={(e) => setField('followUpAdvice', e.target.value)}
            disabled={isLocked}
            rows={3}
          />
          <Textarea
            label="Clinical Notes"
            value={formData.clinicalNotes}
            onChange={(e) => setField('clinicalNotes', e.target.value)}
            disabled={isLocked}
            rows={3}
          />
        </div>
      </Card>

      {/* Sticky Action Footer */}
      {!isLocked && (
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
            zIndex: 100,
          }}
        >
          <Button variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button variant="outline" onClick={handleUpdate} disabled={isSubmitting}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} /> Save Draft Changes
              </span>
            </Button>
            <Button variant="primary" onClick={handleFinalize} disabled={isSubmitting}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={18} /> Finalize & Sign
              </span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default EditPrescriptionView
