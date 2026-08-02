export type MedicalRecordStatus = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'LOCKED' | 'ARCHIVED'

export type EncounterType = 'FIRST_VISIT' | 'FOLLOW_UP' | 'ROUTINE_CHECKUP' | 'EMERGENCY'

export interface VitalSigns {
  bloodPressureSystolic?: number
  bloodPressureDiastolic?: number
  pulseRate?: number
  bodyTemperature?: number
  respiratoryRate?: number
  oxygenSaturation?: number
  heightCm?: number
  weightKg?: number
  bodyMassIndex?: number
}

export interface AllergyItem {
  allergen: string
  reaction?: string
  severity?: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'
}

export interface MedicationItem {
  drugName: string
  dosage: string
  frequency: string
}

export interface AddendumItem {
  id: string
  text: string
  createdAt: string
  createdBy: string
  createdByName?: string
}

export interface MedicalRecordProfile {
  id: string
  recordNumber: string
  tenantId: string
  clinicId: string
  patientId: string
  patientName: string
  patientCode: string
  patientAge?: number
  patientGender?: string
  doctorId: string
  doctorName: string
  doctorSpecialty?: string
  appointmentId: string
  appointmentNumber?: string
  visitDate: string
  visitType: EncounterType
  chiefComplaint?: string
  historyOfPresentIllness?: string
  pastMedicalHistory?: string
  surgicalHistory?: string
  familyHistory?: string
  allergies?: AllergyItem[]
  currentMedications?: MedicationItem[]
  vitalSigns?: VitalSigns
  physicalExamination?: string
  primaryDiagnosis?: string
  secondaryDiagnoses?: string[]
  icdCodePlaceholders?: string[]
  assessmentNotes?: string
  treatmentPlan?: string
  followUpInstructions?: string
  internalNotes?: string
  status: MedicalRecordStatus
  isLocked: boolean
  lockedAt?: string
  lockedBy?: string
  lockedByName?: string
  addenda?: AddendumItem[]
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
  version: number
}
