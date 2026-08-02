export type DoctorStatus = 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED'

export interface DoctorShift {
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
  isOpen: boolean
  shiftStart: string // "HH:MM"
  shiftEnd: string // "HH:MM"
  hasLunchBreak: boolean
  lunchStart?: string // "HH:MM"
  lunchEnd?: string // "HH:MM"
}

export interface DoctorLeave {
  id: string
  date: string // "YYYY-MM-DD"
  name: string
  reason?: string
}

export interface DoctorProfile {
  id: string
  tenantId: string
  userId?: string
  legalName: string
  medicalTitle: string
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
  defaultConsultationDuration: number // minutes
  biography?: string
  avatarUrl?: string
  status: DoctorStatus
  shifts: DoctorShift[]
  createdAt: string
  updatedAt: string
}

export interface DoctorAuditLog {
  id: string
  tenantId: string
  doctorId: string
  actorId: string
  action: string
  reason?: string
  timestamp: string
}
