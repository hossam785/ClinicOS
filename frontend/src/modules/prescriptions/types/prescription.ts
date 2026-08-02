/**
 * Prescription Management Module Type Definitions
 */

export type PrescriptionStatus = 'DRAFT' | 'FINALIZED' | 'PRINTED' | 'ARCHIVED'

export type DosageForm =
  | 'Tablet'
  | 'Capsule'
  | 'Syrup'
  | 'Injection'
  | 'Cream'
  | 'Drops'
  | 'Inhaler'
  | 'Patch'
  | 'Suppository'
  | 'Solution'
  | 'Other'

export interface MedicationItem {
  id: string
  medicineName: string
  strength: string
  dosageForm: DosageForm
  dosage: string
  frequency: string
  duration: string
  quantity: string
  instructions: string
  notes?: string
  catalogId?: string
  rxNormCode?: string
}

export interface PrintHistoryLog {
  printedBy: string
  printedAt: string
  actionType: 'PRINT_DIRECT' | 'EXPORT_PDF'
}

export interface PrintInfo {
  printCount: number
  lastPrintedAt?: string
  lastPrintedBy?: string
  exportedPdfAt?: string
  printHistory: PrintHistoryLog[]
  qrVerificationHash?: string
}

export interface AuditInfo {
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
  finalizedBy?: string
  finalizedAt?: string
}

export interface Prescription {
  _id: string
  prescriptionNumber: string
  tenantId: string
  clinicId: string
  doctorId: string
  patientId: string
  appointmentId?: string
  medicalRecordId: string
  status: PrescriptionStatus
  visitDate: string
  diagnosisSummary?: string
  clinicalNotes?: string
  followUpAdvice?: string
  medications: MedicationItem[]
  printInfo: PrintInfo
  auditInfo: AuditInfo
  archived: boolean
  archivedAt?: string
  archivedBy?: string
  archivedReason?: string
  version: number
  // Expanded relation fields for rendering UI cards/headers
  patientName?: string
  patientCode?: string
  patientAge?: number
  patientGender?: string
  doctorName?: string
  doctorLicenseNumber?: string
  doctorSpecialty?: string
  clinicName?: string
  clinicAddress?: string
  clinicPhone?: string
  clinicLogoUrl?: string
}

export interface CreatePrescriptionPayload {
  patientId: string
  medicalRecordId: string
  appointmentId?: string
  clinicId: string
  visitDate: string
  diagnosisSummary?: string
  clinicalNotes?: string
  followUpAdvice?: string
  medications: Omit<MedicationItem, 'id'>[]
}

export interface UpdatePrescriptionPayload {
  diagnosisSummary?: string
  clinicalNotes?: string
  followUpAdvice?: string
  medications: Omit<MedicationItem, 'id'>[]
}

export interface PrescriptionQueryParams {
  page?: number
  limit?: number
  patientId?: string
  doctorId?: string
  status?: PrescriptionStatus
  startDate?: string
  endDate?: string
  medicineName?: string
  prescriptionNumber?: string
  search?: string
}

export interface PrescriptionListResponse {
  success: boolean
  data: Prescription[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    timestamp: string
  }
}

export interface PrescriptionSingleResponse {
  success: boolean
  data: Prescription
  meta: {
    timestamp: string
  }
}
