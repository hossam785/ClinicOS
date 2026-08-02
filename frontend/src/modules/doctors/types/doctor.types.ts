export type DoctorStatus = 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED'

export interface DoctorShift {
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
  isOpen: boolean
  shiftStart: string // e.g. "09:00"
  shiftEnd: string // e.g. "17:00"
  hasLunchBreak: boolean
  lunchStart?: string // e.g. "13:00"
  lunchEnd?: string // e.g. "14:00"
}

export interface DoctorLeave {
  id: string
  date: string // e.g. "2026-11-15"
  name: string
  reason?: string
}

export interface DoctorProfile {
  id: string
  tenantId: string
  userId?: string
  legalName: string
  medicalTitle: string // e.g. "Dr.", "Prof."
  gender: 'male' | 'female' | 'other'
  nationalId: string
  medicalLicenseNumber: string
  licenseIssuingAuthority: string
  licenseExpirationDate: string
  primarySpecialty: string
  subSpecialties?: string[]
  department: string
  primaryEmail: string
  primaryPhone: string
  consultationFee: number
  currency: string
  defaultConsultationDuration: number // in minutes
  biography?: string
  avatarUrl?: string
  status: DoctorStatus
  shifts: DoctorShift[]
  createdAt: string
  updatedAt: string
}
