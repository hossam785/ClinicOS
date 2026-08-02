export type PatientStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED' | 'DECEASED'

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'UNKNOWN'

export interface PatientAddress {
  addressLine1?: string
  addressLine2?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string
}

export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
}

export interface PatientProfile {
  id: string
  patientCode: string
  tenantId: string
  clinicId?: string
  firstName: string
  middleName?: string
  lastName: string
  fullName: string
  gender: 'male' | 'female' | 'other'
  dateOfBirth: string
  nationalId?: string
  passportNumber?: string
  primaryPhone: string
  secondaryPhone?: string
  email?: string
  address?: PatientAddress
  bloodGroup: BloodGroup
  allergiesFlag: boolean
  chronicDiseaseFlag: boolean
  insuranceFlag: boolean
  administrativeNotes?: string
  emergencyContact?: EmergencyContact
  status: PatientStatus
  archivedAt?: string
  archivedBy?: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}
