import type { DoctorStatus, DoctorShift } from '../types/doctor.types'

export interface InviteDoctorPayload {
  legalName: string
  medicalTitle?: string
  gender?: 'male' | 'female' | 'other'
  nationalId?: string
  medicalLicenseNumber: string
  licenseIssuingAuthority?: string
  licenseExpirationDate?: string
  primarySpecialty: string
  department: string
  primaryEmail: string
  primaryPhone: string
  consultationFee?: number
  defaultConsultationDuration?: number
  biography?: string
}

export interface UpdateDoctorPayload {
  legalName?: string
  medicalTitle?: string
  primarySpecialty?: string
  department?: string
  primaryEmail?: string
  primaryPhone?: string
  biography?: string
}

export class DoctorValidator {
  static validateInvite(payload: InviteDoctorPayload): void {
    if (!payload.legalName || !payload.legalName.trim()) {
      throw new Error('Full Legal Name is required.')
    }
    if (!payload.medicalLicenseNumber || !payload.medicalLicenseNumber.trim()) {
      throw new Error('Medical License Number is required.')
    }
    if (!payload.primarySpecialty || !payload.primarySpecialty.trim()) {
      throw new Error('Primary Specialty is required.')
    }
    if (!payload.department || !payload.department.trim()) {
      throw new Error('Assigned Department is required.')
    }
    if (!payload.primaryEmail || !payload.primaryEmail.trim() || !payload.primaryEmail.includes('@')) {
      throw new Error('A valid Primary Email Address is required.')
    }
    if (!payload.primaryPhone || !payload.primaryPhone.trim()) {
      throw new Error('Primary Phone Number is required.')
    }
  }

  static validateFees(fee: number, duration: number): void {
    if (typeof fee !== 'number' || fee < 0) {
      throw new Error('Consultation Fee must be a non-negative number.')
    }
    if (typeof duration !== 'number' || duration < 10 || duration > 120) {
      throw new Error('Default slot duration must be between 10 and 120 minutes.')
    }
  }

  static validateShifts(shifts: DoctorShift[]): void {
    if (!Array.isArray(shifts) || shifts.length === 0) {
      throw new Error('Shifts payload must be a non-empty array.')
    }
    for (const shift of shifts) {
      if (shift.isOpen) {
        if (!shift.shiftStart || !shift.shiftEnd) {
          throw new Error(`Open shift for ${shift.dayOfWeek} must specify shiftStart and shiftEnd.`)
        }
        if (shift.shiftStart >= shift.shiftEnd) {
          throw new Error(`Shift start time (${shift.shiftStart}) must be before end time (${shift.shiftEnd}) on ${shift.dayOfWeek}.`)
        }
      }
    }
  }

  static validateStatusTransition(currentStatus: DoctorStatus, newStatus: DoctorStatus): void {
    const validTransitions: Record<DoctorStatus, DoctorStatus[]> = {
      PENDING_VERIFICATION: ['ACTIVE', 'ARCHIVED'],
      ACTIVE: ['SUSPENDED', 'ARCHIVED'],
      SUSPENDED: ['ACTIVE', 'ARCHIVED'],
      ARCHIVED: [], // Terminal
    }

    const allowed = validTransitions[currentStatus] || []
    if (!allowed.includes(newStatus)) {
      throw new Error(`Illegal doctor status transition from ${currentStatus} to ${newStatus}.`)
    }
  }
}
