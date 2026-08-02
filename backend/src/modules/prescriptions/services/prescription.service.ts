import type { IPrescriptionRepository } from '../repositories/prescription.repository'
import type {
  Prescription,
  CreatePrescriptionDto,
  UpdatePrescriptionDto,
  QueryPrescriptionsDto,
  MedicationItem,
} from '../types/prescription.types'
import { PrescriptionValidator } from '../validators/prescription.validator'
import { AppError } from '@/shared/errors/AppError'

export class PrescriptionService {
  constructor(private prescriptionRepo: IPrescriptionRepository) {}

  private enforcePlatformAdminRestriction(actorRole?: string): void {
    if (actorRole === 'PLATFORM_ADMIN') {
      throw new AppError(
        'PLATFORM_ADMIN_PHI_RESTRICTED: Platform Administrators are strictly prohibited from viewing patient medical prescriptions.',
        403,
        'PLATFORM_ADMIN_PHI_RESTRICTED'
      )
    }
  }

  private async generatePrescriptionNumber(tenantId: string): Promise<string> {
    const sequence = await this.prescriptionRepo.getNextSequence(tenantId)
    const yearMonth = new Date().toISOString().slice(0, 7).replace('-', '')
    const paddedSeq = sequence.toString().padStart(5, '0')
    return `RX-${yearMonth}-${paddedSeq}`
  }

  async createPrescription(
    tenantId: string,
    actorId: string,
    actorRole: string | undefined,
    payload: CreatePrescriptionDto
  ): Promise<Prescription> {
    this.enforcePlatformAdminRestriction(actorRole)

    const validation = PrescriptionValidator.validateCreate(payload as unknown as Record<string, unknown>)
    if (!validation.isValid) {
      throw new AppError(validation.error || 'Validation error', 400, 'INVALID_INPUT')
    }

    const rxNumber = await this.generatePrescriptionNumber(tenantId)

    const medications: MedicationItem[] = (payload.medications || []).map((m, idx) => ({
      ...m,
      id: `med_${Date.now()}_${idx}`,
    }))

    const now = new Date().toISOString()

    const newRx: Prescription = {
      _id: `rx_${Date.now()}`,
      prescriptionNumber: rxNumber,
      tenantId,
      clinicId: payload.clinicId ? payload.clinicId.trim() : 'clinic-branch-01',
      patientId: payload.patientId.trim(),
      patientName: payload.patientName ? payload.patientName.trim() : undefined,
      patientCode: payload.patientCode ? payload.patientCode.trim() : undefined,
      patientAge: payload.patientAge,
      patientGender: payload.patientGender,
      doctorId: payload.doctorId ? payload.doctorId.trim() : actorId,
      doctorName: payload.doctorName ? payload.doctorName.trim() : undefined,
      appointmentId: payload.appointmentId ? payload.appointmentId.trim() : undefined,
      medicalRecordId: payload.medicalRecordId.trim(),
      status: 'DRAFT',
      visitDate: payload.visitDate.trim(),
      diagnosisSummary: payload.diagnosisSummary ? payload.diagnosisSummary.trim() : undefined,
      clinicalNotes: payload.clinicalNotes ? payload.clinicalNotes.trim() : undefined,
      followUpAdvice: payload.followUpAdvice ? payload.followUpAdvice.trim() : undefined,
      medications,
      printInfo: {
        printCount: 0,
        exportedPdfCount: 0,
        printHistory: [],
      },
      auditInfo: {
        createdBy: actorId,
        createdAt: now,
        updatedBy: actorId,
        updatedAt: now,
      },
      archived: false,
      version: 1,
    }

    const created = await this.prescriptionRepo.create(newRx)

    await this.prescriptionRepo.createAuditLog({
      id: `audit_${Date.now()}`,
      prescriptionId: created._id,
      tenantId,
      actorId,
      actorRole,
      action: 'PRESCRIPTION_CREATED',
      timestamp: now,
      details: { prescriptionNumber: created.prescriptionNumber, patientId: created.patientId },
    })

    return created
  }

  async getPrescriptionById(tenantId: string, id: string, actorRole?: string): Promise<Prescription> {
    this.enforcePlatformAdminRestriction(actorRole)

    const rx = await this.prescriptionRepo.findById(tenantId, id)
    if (!rx) {
      throw new AppError('PRESCRIPTION_NOT_FOUND: Prescription record does not exist in this workspace.', 404, 'PRESCRIPTION_NOT_FOUND')
    }
    return rx
  }

  async listPrescriptions(
    tenantId: string,
    actorRole: string | undefined,
    params: QueryPrescriptionsDto
  ): Promise<{ data: Prescription[]; total: number; page: number; totalPages: number }> {
    this.enforcePlatformAdminRestriction(actorRole)
    return this.prescriptionRepo.list(tenantId, params)
  }

  async getPatientHistory(tenantId: string, patientId: string, actorRole?: string, includeArchived = false): Promise<Prescription[]> {
    this.enforcePlatformAdminRestriction(actorRole)
    return this.prescriptionRepo.getPatientHistory(tenantId, patientId, includeArchived)
  }

  async getMedicalRecordPrescriptions(tenantId: string, recordId: string, actorRole?: string): Promise<Prescription[]> {
    this.enforcePlatformAdminRestriction(actorRole)
    return this.prescriptionRepo.getMedicalRecordPrescriptions(tenantId, recordId)
  }

  async updatePrescription(
    tenantId: string,
    id: string,
    actorId: string,
    actorRole: string | undefined,
    payload: UpdatePrescriptionDto
  ): Promise<Prescription> {
    this.enforcePlatformAdminRestriction(actorRole)

    const existing = await this.getPrescriptionById(tenantId, id, actorRole)

    if (existing.status !== 'DRAFT') {
      throw new AppError(
        `PRESCRIPTION_LOCKED: Cannot edit prescription in status '${existing.status}'. Finalized prescriptions are immutable.`,
        409,
        'PRESCRIPTION_LOCKED'
      )
    }

    const validation = PrescriptionValidator.validateUpdate(payload as unknown as Record<string, unknown>)
    if (!validation.isValid) {
      throw new AppError(validation.error || 'Validation error', 400, 'INVALID_INPUT')
    }

    const now = new Date().toISOString()

    const medications: MedicationItem[] | undefined = payload.medications
      ? payload.medications.map((m, idx) => ({
          ...m,
          id: `med_${Date.now()}_${idx}`,
        }))
      : undefined

    const updates: Partial<Prescription> = {
      diagnosisSummary: payload.diagnosisSummary !== undefined ? payload.diagnosisSummary.trim() : existing.diagnosisSummary,
      clinicalNotes: payload.clinicalNotes !== undefined ? payload.clinicalNotes.trim() : existing.clinicalNotes,
      followUpAdvice: payload.followUpAdvice !== undefined ? payload.followUpAdvice.trim() : existing.followUpAdvice,
      medications: medications !== undefined ? medications : existing.medications,
      auditInfo: {
        ...existing.auditInfo,
        updatedBy: actorId,
        updatedAt: now,
      },
    }

    const updated = await this.prescriptionRepo.update(tenantId, id, updates)
    if (!updated) {
      throw new AppError('Failed to update prescription record.', 500, 'DATABASE_ERROR')
    }

    await this.prescriptionRepo.createAuditLog({
      id: `audit_${Date.now()}`,
      prescriptionId: updated._id,
      tenantId,
      actorId,
      actorRole,
      action: 'PRESCRIPTION_UPDATED',
      timestamp: now,
    })

    return updated
  }

  async finalizePrescription(
    tenantId: string,
    id: string,
    actorId: string,
    actorRole?: string
  ): Promise<Prescription> {
    this.enforcePlatformAdminRestriction(actorRole)

    const existing = await this.getPrescriptionById(tenantId, id, actorRole)

    if (existing.status !== 'DRAFT') {
      throw new AppError(
        `INVALID_STATUS_TRANSITION: Prescription is already in '${existing.status}' status and cannot be re-finalized.`,
        400,
        'INVALID_STATUS_TRANSITION'
      )
    }

    const val = PrescriptionValidator.validateFinalize(existing.medications)
    if (!val.isValid) {
      throw new AppError(val.error || 'Cannot finalize prescription.', 422, 'EMPTY_MEDICATION_LIST')
    }

    const now = new Date().toISOString()

    const updates: Partial<Prescription> = {
      status: 'FINALIZED',
      auditInfo: {
        ...existing.auditInfo,
        finalizedBy: actorId,
        finalizedAt: now,
        updatedBy: actorId,
        updatedAt: now,
      },
    }

    const updated = await this.prescriptionRepo.update(tenantId, id, updates)
    if (!updated) {
      throw new AppError('Failed to finalize prescription record.', 500, 'DATABASE_ERROR')
    }

    await this.prescriptionRepo.createAuditLog({
      id: `audit_${Date.now()}`,
      prescriptionId: updated._id,
      tenantId,
      actorId,
      actorRole,
      action: 'PRESCRIPTION_FINALIZED',
      timestamp: now,
      details: { prescriptionNumber: updated.prescriptionNumber },
    })

    return updated
  }

  async archivePrescription(
    tenantId: string,
    id: string,
    actorId: string,
    actorRole: string | undefined,
    reason: string
  ): Promise<Prescription> {
    this.enforcePlatformAdminRestriction(actorRole)

    const val = PrescriptionValidator.validateArchive(reason)
    if (!val.isValid) {
      throw new AppError(val.error || 'Archive reason required.', 400, 'INVALID_INPUT')
    }

    const existing = await this.getPrescriptionById(tenantId, id, actorRole)
    const now = new Date().toISOString()

    const updates: Partial<Prescription> = {
      status: 'ARCHIVED',
      archived: true,
      auditInfo: {
        ...existing.auditInfo,
        archivedBy: actorId,
        archivedAt: now,
        archivedReason: reason.trim(),
        updatedBy: actorId,
        updatedAt: now,
      },
    }

    const updated = await this.prescriptionRepo.update(tenantId, id, updates)
    if (!updated) {
      throw new AppError('Failed to archive prescription.', 500, 'DATABASE_ERROR')
    }

    await this.prescriptionRepo.createAuditLog({
      id: `audit_${Date.now()}`,
      prescriptionId: updated._id,
      tenantId,
      actorId,
      actorRole,
      action: 'PRESCRIPTION_ARCHIVED',
      timestamp: now,
      details: { reason },
    })

    return updated
  }

  async restorePrescription(
    tenantId: string,
    id: string,
    actorId: string,
    actorRole?: string
  ): Promise<Prescription> {
    this.enforcePlatformAdminRestriction(actorRole)

    const existing = await this.getPrescriptionById(tenantId, id, actorRole)

    if (!existing.archived) {
      throw new AppError('Prescription is not archived and cannot be restored.', 400, 'INVALID_OPERATION')
    }

    const now = new Date().toISOString()
    const targetStatus = existing.auditInfo.finalizedBy ? 'FINALIZED' : 'DRAFT'

    const updates: Partial<Prescription> = {
      status: targetStatus,
      archived: false,
      auditInfo: {
        ...existing.auditInfo,
        updatedBy: actorId,
        updatedAt: now,
      },
    }

    const updated = await this.prescriptionRepo.update(tenantId, id, updates)
    if (!updated) {
      throw new AppError('Failed to restore prescription.', 500, 'DATABASE_ERROR')
    }

    await this.prescriptionRepo.createAuditLog({
      id: `audit_${Date.now()}`,
      prescriptionId: updated._id,
      tenantId,
      actorId,
      actorRole,
      action: 'PRESCRIPTION_RESTORED',
      timestamp: now,
    })

    return updated
  }

  async registerPrint(
    tenantId: string,
    id: string,
    actorId: string,
    actorRole?: string,
    actionType: 'PRINT_DIRECT' | 'PDF_EXPORT' | 'REPRINT' = 'PRINT_DIRECT'
  ): Promise<Prescription> {
    this.enforcePlatformAdminRestriction(actorRole)

    const existing = await this.getPrescriptionById(tenantId, id, actorRole)
    const now = new Date().toISOString()

    const newPrintHistory = [
      ...(existing.printInfo?.printHistory || []),
      {
        actionType,
        printedBy: actorId,
        printedAt: now,
      },
    ]

    const targetStatus = existing.status === 'FINALIZED' ? 'PRINTED' : existing.status

    const updates: Partial<Prescription> = {
      status: targetStatus,
      printInfo: {
        ...existing.printInfo,
        printCount: (existing.printInfo?.printCount || 0) + 1,
        lastPrintedAt: now,
        lastPrintedBy: actorId,
        printHistory: newPrintHistory,
      },
      auditInfo: {
        ...existing.auditInfo,
        updatedBy: actorId,
        updatedAt: now,
      },
    }

    const updated = await this.prescriptionRepo.update(tenantId, id, updates)
    if (!updated) {
      throw new AppError('Failed to register print event.', 500, 'DATABASE_ERROR')
    }

    await this.prescriptionRepo.createAuditLog({
      id: `audit_${Date.now()}`,
      prescriptionId: updated._id,
      tenantId,
      actorId,
      actorRole,
      action: 'PRESCRIPTION_PRINTED',
      timestamp: now,
      details: { actionType, printCount: updated.printInfo.printCount },
    })

    return updated
  }

  async registerPdfExport(
    tenantId: string,
    id: string,
    actorId: string,
    actorRole?: string
  ): Promise<Prescription> {
    this.enforcePlatformAdminRestriction(actorRole)

    const existing = await this.getPrescriptionById(tenantId, id, actorRole)
    const now = new Date().toISOString()

    const updates: Partial<Prescription> = {
      printInfo: {
        ...existing.printInfo,
        exportedPdfCount: (existing.printInfo?.exportedPdfCount || 0) + 1,
        exportedPdfAt: now,
      },
      auditInfo: {
        ...existing.auditInfo,
        updatedBy: actorId,
        updatedAt: now,
      },
    }

    const updated = await this.prescriptionRepo.update(tenantId, id, updates)
    if (!updated) {
      throw new AppError('Failed to register PDF export metadata.', 500, 'DATABASE_ERROR')
    }

    await this.prescriptionRepo.createAuditLog({
      id: `audit_${Date.now()}`,
      prescriptionId: updated._id,
      tenantId,
      actorId,
      actorRole,
      action: 'PRESCRIPTION_PDF_EXPORTED',
      timestamp: now,
    })

    return updated
  }
}
