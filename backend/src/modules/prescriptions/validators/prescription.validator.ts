import type { DosageForm } from '../types/prescription.types'

const VALID_DOSAGE_FORMS: DosageForm[] = [
  'Tablet',
  'Capsule',
  'Syrup',
  'Injection',
  'Cream',
  'Drops',
  'Inhaler',
  'Patch',
  'Suppository',
  'Solution',
  'Other',
]

export class PrescriptionValidator {
  static validateCreate(payload: Record<string, unknown>): { isValid: boolean; error?: string } {
    if (!payload || typeof payload !== 'object') {
      return { isValid: false, error: 'Invalid JSON request payload object.' }
    }

    const patientId = payload.patientId
    if (!patientId || typeof patientId !== 'string' || !patientId.trim()) {
      return { isValid: false, error: 'patientId is required and must be a non-empty string.' }
    }

    const medicalRecordId = payload.medicalRecordId
    if (!medicalRecordId || typeof medicalRecordId !== 'string' || !medicalRecordId.trim()) {
      return { isValid: false, error: 'medicalRecordId is required and must be a non-empty string.' }
    }

    const visitDate = payload.visitDate
    if (!visitDate || typeof visitDate !== 'string' || !visitDate.trim()) {
      return { isValid: false, error: 'visitDate is required and must be a valid YYYY-MM-DD date string.' }
    }

    if (payload.medications && !Array.isArray(payload.medications)) {
      return { isValid: false, error: 'medications must be an array of medication line items.' }
    }

    if (Array.isArray(payload.medications)) {
      for (let i = 0; i < payload.medications.length; i++) {
        const med = payload.medications[i] as Record<string, unknown>
        const itemError = PrescriptionValidator.validateMedicationItem(med, i)
        if (itemError) return { isValid: false, error: itemError }
      }
    }

    return { isValid: true }
  }

  static validateUpdate(payload: Record<string, unknown>): { isValid: boolean; error?: string } {
    if (!payload || typeof payload !== 'object') {
      return { isValid: false, error: 'Invalid JSON request payload object.' }
    }

    if (payload.medications && !Array.isArray(payload.medications)) {
      return { isValid: false, error: 'medications must be an array of medication line items.' }
    }

    if (Array.isArray(payload.medications)) {
      for (let i = 0; i < payload.medications.length; i++) {
        const med = payload.medications[i] as Record<string, unknown>
        const itemError = PrescriptionValidator.validateMedicationItem(med, i)
        if (itemError) return { isValid: false, error: itemError }
      }
    }

    return { isValid: true }
  }

  static validateFinalize(medications: unknown[]): { isValid: boolean; error?: string } {
    if (!Array.isArray(medications) || medications.length === 0) {
      return { isValid: false, error: 'EMPTY_MEDICATION_LIST: Cannot finalize a prescription with zero medication line items.' }
    }
    return { isValid: true }
  }

  static validateArchive(reason: unknown): { isValid: boolean; error?: string } {
    if (!reason || typeof reason !== 'string' || !reason.trim()) {
      return { isValid: false, error: 'Mandatory non-empty archival reason string must be provided.' }
    }
    return { isValid: true }
  }

  private static validateMedicationItem(med: Record<string, unknown>, index: number): string | null {
    if (!med || typeof med !== 'object') {
      return `Medication item at index ${index} is invalid.`
    }

    if (!med.medicineName || typeof med.medicineName !== 'string' || !(med.medicineName as string).trim()) {
      return `Medication item at index ${index} requires a non-empty medicineName.`
    }

    if (!med.dosageForm || !VALID_DOSAGE_FORMS.includes(med.dosageForm as DosageForm)) {
      return `Medication item at index ${index} has invalid dosageForm '${String(med.dosageForm)}'. Allowed: ${VALID_DOSAGE_FORMS.join(', ')}.`
    }

    if (!med.dosage || typeof med.dosage !== 'string' || !(med.dosage as string).trim()) {
      return `Medication item at index ${index} requires a non-empty dosage field.`
    }

    if (!med.frequency || typeof med.frequency !== 'string' || !(med.frequency as string).trim()) {
      return `Medication item at index ${index} requires a non-empty frequency field.`
    }

    return null
  }
}
