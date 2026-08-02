import type { MedicalRecordProfile } from '../types/medicalRecord.types'

export class MedicalRecordValidator {
  static validateCreateRecord(payload: Record<string, unknown>): { isValid: boolean; error?: string } {
    if (!payload.patientId || typeof payload.patientId !== 'string' || !payload.patientId.trim()) {
      return { isValid: false, error: 'Patient ID is required.' }
    }
    if (!payload.patientName || typeof payload.patientName !== 'string' || !payload.patientName.trim()) {
      return { isValid: false, error: 'Patient Name is required.' }
    }
    if (!payload.doctorId || typeof payload.doctorId !== 'string' || !payload.doctorId.trim()) {
      return { isValid: false, error: 'Doctor ID is required.' }
    }
    if (!payload.doctorName || typeof payload.doctorName !== 'string' || !payload.doctorName.trim()) {
      return { isValid: false, error: 'Doctor Name is required.' }
    }
    if (!payload.appointmentId || typeof payload.appointmentId !== 'string' || !payload.appointmentId.trim()) {
      return { isValid: false, error: 'Appointment ID is required.' }
    }
    if (!payload.visitDate || typeof payload.visitDate !== 'string' || !payload.visitDate.trim()) {
      return { isValid: false, error: 'Visit Date is required (YYYY-MM-DD).' }
    }

    return { isValid: true }
  }

  static validateLockedUpdate(record: MedicalRecordProfile): { isValid: boolean; error?: string } {
    if (record.isLocked || record.status === 'LOCKED') {
      return {
        isValid: false,
        error: 'RECORD_LOCKED: This medical chart has been signed and locked. Direct modifications are prohibited. Submit an Addendum.',
      }
    }
    return { isValid: true }
  }

  static validateCompletion(payload: Partial<MedicalRecordProfile>): { isValid: boolean; error?: string } {
    if (!payload.primaryDiagnosis || !payload.primaryDiagnosis.trim()) {
      return { isValid: false, error: 'MISSING_PRIMARY_DIAGNOSIS: A primary clinical diagnosis is required before completing and locking the chart.' }
    }
    return { isValid: true }
  }
}
