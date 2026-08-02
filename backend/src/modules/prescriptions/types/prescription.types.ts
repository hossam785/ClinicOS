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
  strength?: string
  dosageForm: DosageForm
  dosage: string
  frequency: string
  duration?: string
  quantity?: string
  instructions?: string
  notes?: string
}

export interface PrintLog {
  actionType: 'PRINT_DIRECT' | 'PDF_EXPORT' | 'REPRINT'
  printedBy: string
  printedAt: string
}

export interface PrintInfo {
  printCount: number
  lastPrintedAt?: string
  lastPrintedBy?: string
  exportedPdfAt?: string
  exportedPdfCount: number
  printHistory: PrintLog[]
}

export interface AuditInfo {
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
  finalizedBy?: string
  finalizedAt?: string
  archivedBy?: string
  archivedAt?: string
  archivedReason?: string
}

export interface Prescription {
  _id: string
  prescriptionNumber: string
  tenantId: string
  clinicId: string
  patientId: string
  patientName?: string
  patientCode?: string
  patientAge?: number
  patientGender?: string
  doctorId: string
  doctorName?: string
  doctorSpecialty?: string
  doctorLicenseNumber?: string
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
  version: number
}

export interface CreatePrescriptionDto {
  patientId: string
  patientName?: string
  patientCode?: string
  patientAge?: number
  patientGender?: string
  medicalRecordId: string
  appointmentId?: string
  clinicId?: string
  doctorId?: string
  doctorName?: string
  visitDate: string
  diagnosisSummary?: string
  clinicalNotes?: string
  followUpAdvice?: string
  medications?: Omit<MedicationItem, 'id'>[]
}

export interface UpdatePrescriptionDto {
  diagnosisSummary?: string
  clinicalNotes?: string
  followUpAdvice?: string
  medications?: Omit<MedicationItem, 'id'>[]
}

export interface QueryPrescriptionsDto {
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

export interface PrescriptionAuditLog {
  id: string
  prescriptionId: string
  tenantId: string
  actorId: string
  actorRole?: string
  action:
    | 'PRESCRIPTION_CREATED'
    | 'PRESCRIPTION_UPDATED'
    | 'PRESCRIPTION_FINALIZED'
    | 'PRESCRIPTION_PRINTED'
    | 'PRESCRIPTION_PDF_EXPORTED'
    | 'PRESCRIPTION_ARCHIVED'
    | 'PRESCRIPTION_RESTORED'
  timestamp: string
  details?: Record<string, unknown>
}
