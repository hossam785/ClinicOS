import type { IPatientRepository } from '../repositories/patient.repository'
import type { PatientProfile, PatientStatus, BloodGroup } from '../types/patient.types'
import { PatientValidator } from '../validators/patient.validator'

export class PatientService {
  constructor(private patientRepo: IPatientRepository) {}

  private async generatePatientCode(tenantId: string): Promise<string> {
    const sequence = await this.patientRepo.getNextPatientSequence(tenantId)
    const yearMonth = new Date().toISOString().slice(0, 7).replace('-', '')
    const paddedSeq = sequence.toString().padStart(5, '0')
    return `PAT-${yearMonth}-${paddedSeq}`
  }

  async createPatient(
    tenantId: string,
    actorId: string,
    payload: Record<string, unknown>
  ): Promise<PatientProfile> {
    const validation = PatientValidator.validateCreatePatient(payload)
    if (!validation.isValid) {
      throw new Error(`Validation Error: ${validation.error}`)
    }

    if (payload.nationalId && typeof payload.nationalId === 'string' && payload.nationalId.trim()) {
      const existingNational = await this.patientRepo.findByNationalId(tenantId, payload.nationalId.trim())
      if (existingNational) {
        throw new Error('DUPLICATE_NATIONAL_ID: A patient profile with this National ID already exists.')
      }
    }

    const patientCode = await this.generatePatientCode(tenantId)
    const firstName = (payload.firstName as string).trim()
    const middleName = payload.middleName ? (payload.middleName as string).trim() : undefined
    const lastName = (payload.lastName as string).trim()
    const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ')

    const newPatient: PatientProfile = {
      id: `pat-${Date.now()}`,
      patientCode,
      tenantId,
      firstName,
      middleName,
      lastName,
      fullName,
      gender: payload.gender as 'male' | 'female' | 'other',
      dateOfBirth: (payload.dateOfBirth as string).trim(),
      nationalId: payload.nationalId ? (payload.nationalId as string).trim() : undefined,
      passportNumber: payload.passportNumber ? (payload.passportNumber as string).trim() : undefined,
      primaryPhone: (payload.primaryPhone as string).trim(),
      secondaryPhone: payload.secondaryPhone ? (payload.secondaryPhone as string).trim() : undefined,
      email: payload.email ? (payload.email as string).trim().toLowerCase() : undefined,
      bloodGroup: (payload.bloodGroup as BloodGroup) || 'UNKNOWN',
      allergiesFlag: Boolean(payload.allergiesFlag),
      chronicDiseaseFlag: Boolean(payload.chronicDiseaseFlag),
      insuranceFlag: Boolean(payload.insuranceFlag),
      administrativeNotes: payload.administrativeNotes ? (payload.administrativeNotes as string).trim() : undefined,
      emergencyContact: payload.emergencyContact ? (payload.emergencyContact as PatientProfile['emergencyContact']) : undefined,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: actorId,
      updatedBy: actorId,
      version: 1,
    }

    const created = await this.patientRepo.create(newPatient)

    await this.patientRepo.createAuditLog({
      id: `audit-${Date.now()}`,
      patientId: created.id,
      tenantId,
      actorId,
      action: 'PATIENT_CREATED',
      timestamp: new Date().toISOString(),
      details: { patientCode: created.patientCode, fullName: created.fullName },
    })

    return created
  }

  async getPatientById(tenantId: string, id: string): Promise<PatientProfile> {
    const patient = await this.patientRepo.findById(tenantId, id)
    if (!patient) {
      throw new Error('PATIENT_NOT_FOUND: Patient record does not exist in this workspace.')
    }
    return patient
  }

  async listPatients(tenantId: string, status?: string, search?: string): Promise<PatientProfile[]> {
    return this.patientRepo.list(tenantId, status, search)
  }

  async updatePatient(
    tenantId: string,
    id: string,
    actorId: string,
    updates: Partial<PatientProfile>
  ): Promise<PatientProfile> {
    const existing = await this.getPatientById(tenantId, id)

    if (existing.status === 'ARCHIVED' || existing.status === 'DECEASED') {
      throw new Error(`Cannot update patient in ${existing.status} status.`)
    }

    delete updates.id
    delete updates.patientCode
    delete updates.tenantId
    delete updates.createdAt
    delete updates.createdBy

    if (updates.firstName || updates.lastName || updates.middleName) {
      const firstName = updates.firstName !== undefined ? updates.firstName.trim() : existing.firstName
      const middleName = updates.middleName !== undefined ? updates.middleName?.trim() : existing.middleName
      const lastName = updates.lastName !== undefined ? updates.lastName.trim() : existing.lastName
      updates.fullName = [firstName, middleName, lastName].filter(Boolean).join(' ')
    }

    const updated = await this.patientRepo.update(tenantId, id, {
      ...updates,
      updatedBy: actorId,
    })

    if (!updated) {
      throw new Error('PATIENT_NOT_FOUND: Failed to update patient profile.')
    }

    await this.patientRepo.createAuditLog({
      id: `audit-${Date.now()}`,
      patientId: id,
      tenantId,
      actorId,
      action: 'PATIENT_UPDATED',
      timestamp: new Date().toISOString(),
      details: { modifiedFields: Object.keys(updates) },
    })

    return updated
  }

  async archivePatient(tenantId: string, id: string, actorId: string, reason?: string): Promise<PatientProfile> {
    const patient = await this.getPatientById(tenantId, id)

    const statusCheck = PatientValidator.validateStatusTransition(patient.status, 'ARCHIVED')
    if (!statusCheck.isValid) {
      throw new Error(statusCheck.error)
    }

    const updated = await this.patientRepo.update(tenantId, id, {
      status: 'ARCHIVED',
      archivedAt: new Date().toISOString(),
      archivedBy: actorId,
      updatedBy: actorId,
    })

    if (!updated) {
      throw new Error('PATIENT_NOT_FOUND: Failed to archive patient.')
    }

    await this.patientRepo.createAuditLog({
      id: `audit-${Date.now()}`,
      patientId: id,
      tenantId,
      actorId,
      action: 'PATIENT_ARCHIVED',
      timestamp: new Date().toISOString(),
      details: { reason },
    })

    return updated
  }

  async restorePatient(tenantId: string, id: string, actorId: string): Promise<PatientProfile> {
    const patient = await this.getPatientById(tenantId, id)

    const statusCheck = PatientValidator.validateStatusTransition(patient.status, 'ACTIVE')
    if (!statusCheck.isValid) {
      throw new Error(statusCheck.error)
    }

    const updated = await this.patientRepo.update(tenantId, id, {
      status: 'ACTIVE',
      archivedAt: undefined,
      archivedBy: undefined,
      updatedBy: actorId,
    })

    if (!updated) {
      throw new Error('PATIENT_NOT_FOUND: Failed to restore patient.')
    }

    await this.patientRepo.createAuditLog({
      id: `audit-${Date.now()}`,
      patientId: id,
      tenantId,
      actorId,
      action: 'PATIENT_RESTORED',
      timestamp: new Date().toISOString(),
    })

    return updated
  }

  async updateStatus(
    tenantId: string,
    id: string,
    actorId: string,
    status: PatientStatus,
    reason?: string
  ): Promise<PatientProfile> {
    const patient = await this.getPatientById(tenantId, id)

    const statusCheck = PatientValidator.validateStatusTransition(patient.status, status)
    if (!statusCheck.isValid) {
      throw new Error(statusCheck.error)
    }

    const updated = await this.patientRepo.update(tenantId, id, {
      status,
      updatedBy: actorId,
    })

    if (!updated) {
      throw new Error('PATIENT_NOT_FOUND: Failed to update patient status.')
    }

    await this.patientRepo.createAuditLog({
      id: `audit-${Date.now()}`,
      patientId: id,
      tenantId,
      actorId,
      action: `PATIENT_STATUS_CHANGED_TO_${status}`,
      timestamp: new Date().toISOString(),
      details: { previousStatus: patient.status, newStatus: status, reason },
    })

    return updated
  }
}
