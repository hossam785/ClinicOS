import type { PatientStatus } from '../types/patient.types'

export class PatientValidator {
  static validateCreatePatient(payload: Record<string, unknown>): { isValid: boolean; error?: string } {
    if (!payload.firstName || typeof payload.firstName !== 'string' || !payload.firstName.trim()) {
      return { isValid: false, error: 'First Name is required and must be a non-empty string.' }
    }
    if (!payload.lastName || typeof payload.lastName !== 'string' || !payload.lastName.trim()) {
      return { isValid: false, error: 'Last Name is required and must be a non-empty string.' }
    }
    if (!payload.gender || !['male', 'female', 'other'].includes(payload.gender as string)) {
      return { isValid: false, error: 'Biological Sex / Gender must be male, female, or other.' }
    }
    if (!payload.dateOfBirth || typeof payload.dateOfBirth !== 'string' || !payload.dateOfBirth.trim()) {
      return { isValid: false, error: 'Date of Birth is required (YYYY-MM-DD).' }
    }
    if (!payload.primaryPhone || typeof payload.primaryPhone !== 'string' || !payload.primaryPhone.trim()) {
      return { isValid: false, error: 'Primary Phone Number is required.' }
    }

    return { isValid: true }
  }

  static validateStatusTransition(currentStatus: PatientStatus, targetStatus: PatientStatus): { isValid: boolean; error?: string } {
    if (currentStatus === targetStatus) {
      return { isValid: false, error: `Patient is already in ${currentStatus} status.` }
    }

    if (currentStatus === 'DECEASED') {
      return { isValid: false, error: 'Cannot transition status out of DECEASED terminal state.' }
    }

    const allowedTransitions: Record<PatientStatus, PatientStatus[]> = {
      ACTIVE: ['INACTIVE', 'ARCHIVED', 'DECEASED'],
      INACTIVE: ['ACTIVE', 'ARCHIVED', 'DECEASED'],
      ARCHIVED: ['ACTIVE', 'DECEASED'],
      DECEASED: [],
    }

    if (!allowedTransitions[currentStatus]?.includes(targetStatus)) {
      return { isValid: false, error: `Transition from ${currentStatus} to ${targetStatus} is prohibited.` }
    }

    return { isValid: true }
  }
}
