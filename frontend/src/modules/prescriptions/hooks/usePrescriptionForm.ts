/**
 * Custom hook for managing state and client-side validation in the Create/Edit Prescription Workspace
 */
import { useState, useCallback, useEffect } from 'react'
import type { MedicationItem, DosageForm } from '../types/prescription'

export interface PrescriptionFormState {
  patientId: string
  medicalRecordId: string
  appointmentId: string
  clinicId: string
  visitDate: string
  diagnosisSummary: string
  clinicalNotes: string
  followUpAdvice: string
  medications: MedicationItem[]
}

export interface ValidationErrorMap {
  [key: string]: string
}

const createEmptyMedication = (): MedicationItem => ({
  id: `med_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
  medicineName: '',
  strength: '',
  dosageForm: 'Tablet' as DosageForm,
  dosage: '1 Tablet',
  frequency: 'Three times daily (TID)',
  duration: '7 Days',
  quantity: '21 Tablets',
  instructions: 'Take after meals with water.',
  notes: '',
})

export function usePrescriptionForm(initialState?: Partial<PrescriptionFormState>) {
  const [formData, setFormData] = useState<PrescriptionFormState>({
    patientId: initialState?.patientId || '',
    medicalRecordId: initialState?.medicalRecordId || '',
    appointmentId: initialState?.appointmentId || '',
    clinicId: initialState?.clinicId || '',
    visitDate: initialState?.visitDate || new Date().toISOString().split('T')[0],
    diagnosisSummary: initialState?.diagnosisSummary || '',
    clinicalNotes: initialState?.clinicalNotes || '',
    followUpAdvice: initialState?.followUpAdvice || '',
    medications: initialState?.medications?.length ? initialState.medications : [createEmptyMedication()],
  })

  const [errors, setErrors] = useState<ValidationErrorMap>({})
  const [isDirty, setIsDirty] = useState<boolean>(false)

  // Synchronize initial state updates (when loaded asynchronously)
  useEffect(() => {
    if (initialState) {
      setFormData((prev) => ({
        ...prev,
        ...initialState,
        medications: initialState.medications?.length ? initialState.medications : prev.medications,
      }))
    }
  }, [initialState])

  const setField = useCallback((field: keyof PrescriptionFormState, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setIsDirty(true)
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }, [])

  const addMedication = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      medications: [...prev.medications, createEmptyMedication()],
    }))
    setIsDirty(true)
  }, [])

  const removeMedication = useCallback((id: string) => {
    setFormData((prev) => {
      if (prev.medications.length <= 1) {
        // Clear item instead of leaving empty array
        return {
          ...prev,
          medications: [createEmptyMedication()],
        }
      }
      return {
        ...prev,
        medications: prev.medications.filter((m) => m.id !== id),
      }
    })
    setIsDirty(true)
  }, [])

  const duplicateMedication = useCallback((id: string) => {
    setFormData((prev) => {
      const index = prev.medications.findIndex((m) => m.id === id)
      if (index === -1) return prev
      const target = prev.medications[index]
      const duplicated: MedicationItem = {
        ...target,
        id: `med_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      }
      const updated = [...prev.medications]
      updated.splice(index + 1, 0, duplicated)
      return { ...prev, medications: updated }
    })
    setIsDirty(true)
  }, [])

  const updateMedication = useCallback((id: string, field: keyof MedicationItem, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }))
    setIsDirty(true)
  }, [])

  const reorderMedication = useCallback((id: string, direction: 'UP' | 'DOWN') => {
    setFormData((prev) => {
      const index = prev.medications.findIndex((m) => m.id === id)
      if (index === -1) return prev
      const targetIndex = direction === 'UP' ? index - 1 : index + 1
      if (targetIndex < 0 || targetIndex >= prev.medications.length) return prev

      const updated = [...prev.medications]
      const [moved] = updated.splice(index, 1)
      updated.splice(targetIndex, 0, moved)
      return { ...prev, medications: updated }
    })
    setIsDirty(true)
  }, [])

  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrorMap = {}

    if (!formData.patientId) {
      newErrors.patientId = 'Patient selection is required.'
    }

    if (!formData.medicalRecordId) {
      newErrors.medicalRecordId = 'Associated Medical Record encounter is required.'
    }

    if (!formData.medications.length) {
      newErrors.medications = 'At least 1 medication line item is required.'
    } else {
      formData.medications.forEach((med, idx) => {
        if (!med.medicineName.trim()) {
          newErrors[`medication_${idx}_name`] = `Medication #${idx + 1}: Medicine name is required.`
        }
        if (!med.dosage.trim()) {
          newErrors[`medication_${idx}_dosage`] = `Medication #${idx + 1}: Dosage is required.`
        }
        if (!med.frequency.trim()) {
          newErrors[`medication_${idx}_frequency`] = `Medication #${idx + 1}: Frequency is required.`
        }
      })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  return {
    formData,
    setFormData,
    errors,
    isDirty,
    setIsDirty,
    setField,
    addMedication,
    removeMedication,
    duplicateMedication,
    updateMedication,
    reorderMedication,
    validateForm,
  }
}
