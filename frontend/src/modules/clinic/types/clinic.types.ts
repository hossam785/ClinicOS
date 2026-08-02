export type ClinicStatus = 'PENDING_REVIEW' | 'APPROVED' | 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED'

export interface ClinicLocation {
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  latitude?: number
  longitude?: number
}

export interface DayOperatingHours {
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
  isOpen: boolean
  shiftStart: string // e.g. "08:00"
  shiftEnd: string // e.g. "17:00"
  hasLunchBreak: boolean
  lunchStart?: string // e.g. "12:00"
  lunchEnd?: string // e.g. "13:00"
}

export interface HolidayException {
  id: string
  date: string // e.g. "2026-12-25"
  name: string
  reason?: string
}

export interface ClinicProfile {
  id: string
  tenantId: string
  name: string
  legalName: string
  registrationNumber: string
  taxId: string
  primaryEmail: string
  primaryPhone: string
  logoUrl?: string
  timezone: string
  currency: string
  status: ClinicStatus
  location: ClinicLocation
  operatingHours: DayOperatingHours[]
  createdAt: string
  updatedAt: string
}
