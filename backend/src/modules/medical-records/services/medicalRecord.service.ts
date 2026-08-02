import type { IMedicalRecordRepository } from '../repositories/medicalRecord.repository'
import type { MedicalRecordProfile, EncounterType, VitalSigns, AddendumItem } from '../types/medicalRecord.types'
import { MedicalRecordValidator } from '../validators/medicalRecord.validator'

export class MedicalRecordService {
  constructor(private recordRepo: IMedicalRecordRepository) {}

  private async generateRecordNumber(tenantId: string): Promise<string> {
    const sequence = await this.recordRepo.getNextSequence(tenantId)
    const yearMonth = new Date().toISOString().slice(0, 7).replace('-', '')
    const paddedSeq = sequence.toString().padStart(5, '0')
    return `EMR-${yearMonth}-${paddedSeq}`
  }

  async createRecord(
    tenantId: string,
    actorId: string,
    payload: Record<string, unknown>
  ): Promise<MedicalRecordProfile> {
    const validation = MedicalRecordValidator.validateCreateRecord(payload)
    if (!validation.isValid) {
      throw new Error(`Validation Error: ${validation.error}`)
    }

    const appointmentId = (payload.appointmentId as string).trim()

    // Prevent duplicate chart for same appointment
    const existing = await this.recordRepo.findByAppointmentId(tenantId, appointmentId)
    if (existing) {
      throw new Error(`RECORD_ALREADY_EXISTS: A medical record chart (${existing.recordNumber}) already exists for this appointment.`)
    }

    const recordNumber = await this.generateRecordNumber(tenantId)

    const newRecord: MedicalRecordProfile = {
      id: `emr-${Date.now()}`,
      recordNumber,
      tenantId,
      clinicId: payload.clinicId ? (payload.clinicId as string).trim() : 'clinic-branch-01',
      patientId: (payload.patientId as string).trim(),
      patientName: (payload.patientName as string).trim(),
      patientCode: payload.patientCode ? (payload.patientCode as string).trim() : 'PAT-202607-00101',
      patientAge: Number(payload.patientAge) || 38,
      patientGender: payload.patientGender ? (payload.patientGender as string).trim() : 'Female',
      doctorId: (payload.doctorId as string).trim(),
      doctorName: (payload.doctorName as string).trim(),
      doctorSpecialty: payload.doctorSpecialty ? (payload.doctorSpecialty as string).trim() : undefined,
      appointmentId,
      appointmentNumber: payload.appointmentNumber ? (payload.appointmentNumber as string).trim() : undefined,
      visitDate: (payload.visitDate as string).trim(),
      visitType: (payload.visitType as EncounterType) || 'FOLLOW_UP',
      chiefComplaint: payload.chiefComplaint ? (payload.chiefComplaint as string).trim() : undefined,
      historyOfPresentIllness: payload.historyOfPresentIllness ? (payload.historyOfPresentIllness as string).trim() : undefined,
      vitalSigns: (payload.vitalSigns as VitalSigns) || undefined,
      primaryDiagnosis: payload.primaryDiagnosis ? (payload.primaryDiagnosis as string).trim() : undefined,
      treatmentPlan: payload.treatmentPlan ? (payload.treatmentPlan as string).trim() : undefined,
      status: 'DRAFT',
      isLocked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: actorId,
      updatedBy: actorId,
      version: 1,
    }

    const created = await this.recordRepo.create(newRecord)

    await this.recordRepo.createAuditLog({
      id: `audit-${Date.now()}`,
      recordId: created.id,
      tenantId,
      actorId,
      action: 'EMR_RECORD_CREATED',
      timestamp: new Date().toISOString(),
      details: { recordNumber: created.recordNumber, patientName: created.patientName },
    })

    return created
  }

  async getRecordById(tenantId: string, id: string): Promise<MedicalRecordProfile> {
    const rec = await this.recordRepo.findById(tenantId, id)
    if (!rec) {
      throw new Error('RECORD_NOT_FOUND: Medical record does not exist in this workspace.')
    }
    return rec
  }

  async listRecords(tenantId: string, status?: string, doctorId?: string, search?: string): Promise<MedicalRecordProfile[]> {
    return this.recordRepo.list(tenantId, status, doctorId, search)
  }

  async getPatientHistory(tenantId: string, patientId: string): Promise<MedicalRecordProfile[]> {
    return this.recordRepo.getPatientHistory(tenantId, patientId)
  }

  async updateRecord(
    tenantId: string,
    id: string,
    actorId: string,
    updates: Partial<MedicalRecordProfile>
  ): Promise<MedicalRecordProfile> {
    const existing = await this.getRecordById(tenantId, id)

    const lockCheck = MedicalRecordValidator.validateLockedUpdate(existing)
    if (!lockCheck.isValid) {
      throw new Error(lockCheck.error)
    }

    delete updates.id
    delete updates.recordNumber
    delete updates.tenantId
    delete updates.createdAt
    delete updates.createdBy

    const updated = await this.recordRepo.update(tenantId, id, {
      ...updates,
      status: 'IN_PROGRESS',
      updatedBy: actorId,
    })

    if (!updated) {
      throw new Error('RECORD_NOT_FOUND: Failed to update medical record.')
    }

    await this.recordRepo.createAuditLog({
      id: `audit-${Date.now()}`,
      recordId: id,
      tenantId,
      actorId,
      action: 'EMR_RECORD_UPDATED',
      timestamp: new Date().toISOString(),
    })

    return updated
  }

  async completeRecord(tenantId: string, id: string, actorId: string): Promise<MedicalRecordProfile> {
    const existing = await this.getRecordById(tenantId, id)

    const completionCheck = MedicalRecordValidator.validateCompletion(existing)
    if (!completionCheck.isValid) {
      throw new Error(completionCheck.error)
    }

    const now = new Date().toISOString()
    const updated = await this.recordRepo.update(tenantId, id, {
      status: 'LOCKED',
      isLocked: true,
      lockedAt: now,
      lockedBy: actorId,
      updatedBy: actorId,
    })

    if (!updated) {
      throw new Error('RECORD_NOT_FOUND: Failed to complete and lock chart.')
    }

    await this.recordRepo.createAuditLog({
      id: `audit-${Date.now()}`,
      recordId: id,
      tenantId,
      actorId,
      action: 'EMR_RECORD_COMPLETED_AND_LOCKED',
      timestamp: now,
    })

    return updated
  }

  async addAddendum(tenantId: string, id: string, actorId: string, text: string): Promise<MedicalRecordProfile> {
    if (!text || !text.trim()) {
      throw new Error('Addendum text is required.')
    }

    const existing = await this.getRecordById(tenantId, id)

    const newAddendum: AddendumItem = {
      id: `add-${Date.now()}`,
      text: text.trim(),
      createdAt: new Date().toISOString(),
      createdBy: actorId,
      createdByName: 'Attending Physician',
    }

    const currentAddenda = existing.addenda || []
    const updated = await this.recordRepo.update(tenantId, id, {
      addenda: [...currentAddenda, newAddendum],
      updatedBy: actorId,
    })

    if (!updated) {
      throw new Error('RECORD_NOT_FOUND: Failed to append addendum.')
    }

    await this.recordRepo.createAuditLog({
      id: `audit-${Date.now()}`,
      recordId: id,
      tenantId,
      actorId,
      action: 'EMR_ADDENDUM_SUBMITTED',
      timestamp: new Date().toISOString(),
      details: { text: text.trim() },
    })

    return updated
  }

  async archiveRecord(tenantId: string, id: string, actorId: string): Promise<MedicalRecordProfile> {
    const updated = await this.recordRepo.update(tenantId, id, {
      status: 'ARCHIVED',
      updatedBy: actorId,
    })

    if (!updated) {
      throw new Error('RECORD_NOT_FOUND: Failed to archive medical record.')
    }

    await this.recordRepo.createAuditLog({
      id: `audit-${Date.now()}`,
      recordId: id,
      tenantId,
      actorId,
      action: 'EMR_RECORD_ARCHIVED',
      timestamp: new Date().toISOString(),
    })

    return updated
  }
}
