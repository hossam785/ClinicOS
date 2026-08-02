import type { IDoctorRepository } from '../repositories/doctor.repository'
import type { DoctorProfile, DoctorStatus, DoctorShift, DoctorLeave } from '../types/doctor.types'
import { DoctorValidator, type InviteDoctorPayload, type UpdateDoctorPayload } from '../validators/doctor.validator'

export class DoctorService {
  constructor(private doctorRepo: IDoctorRepository) {}

  async inviteDoctor(tenantId: string, actorId: string, payload: InviteDoctorPayload): Promise<DoctorProfile> {
    DoctorValidator.validateInvite(payload)

    const existingLicense = await this.doctorRepo.findByLicenseNumber(payload.medicalLicenseNumber)
    if (existingLicense) {
      throw new Error(`A doctor with medical license code "${payload.medicalLicenseNumber}" is already registered.`)
    }

    const existingEmail = await this.doctorRepo.findByEmail(payload.primaryEmail)
    if (existingEmail) {
      throw new Error(`A doctor with email address "${payload.primaryEmail}" is already registered.`)
    }

    const defaultShifts: DoctorShift[] = [
      { dayOfWeek: 'Monday', isOpen: true, shiftStart: '09:00', shiftEnd: '17:00', hasLunchBreak: true, lunchStart: '13:00', lunchEnd: '14:00' },
      { dayOfWeek: 'Tuesday', isOpen: true, shiftStart: '09:00', shiftEnd: '17:00', hasLunchBreak: true, lunchStart: '13:00', lunchEnd: '14:00' },
      { dayOfWeek: 'Wednesday', isOpen: true, shiftStart: '09:00', shiftEnd: '17:00', hasLunchBreak: true, lunchStart: '13:00', lunchEnd: '14:00' },
      { dayOfWeek: 'Thursday', isOpen: true, shiftStart: '09:00', shiftEnd: '17:00', hasLunchBreak: true, lunchStart: '13:00', lunchEnd: '14:00' },
      { dayOfWeek: 'Friday', isOpen: true, shiftStart: '09:00', shiftEnd: '13:00', hasLunchBreak: false },
      { dayOfWeek: 'Saturday', isOpen: false, shiftStart: '09:00', shiftEnd: '17:00', hasLunchBreak: false },
      { dayOfWeek: 'Sunday', isOpen: false, shiftStart: '09:00', shiftEnd: '17:00', hasLunchBreak: false },
    ]

    const newDoctor: DoctorProfile = {
      id: `doc-${Date.now()}`,
      tenantId,
      legalName: payload.legalName.trim(),
      medicalTitle: payload.medicalTitle || 'Dr.',
      gender: payload.gender || 'other',
      nationalId: payload.nationalId || `NAT-${Date.now()}`,
      medicalLicenseNumber: payload.medicalLicenseNumber.trim(),
      licenseIssuingAuthority: payload.licenseIssuingAuthority || 'State Medical Board',
      licenseExpirationDate: payload.licenseExpirationDate || '2027-12-31',
      primarySpecialty: payload.primarySpecialty.trim(),
      department: payload.department.trim(),
      primaryEmail: payload.primaryEmail.trim(),
      primaryPhone: payload.primaryPhone.trim(),
      consultationFee: payload.consultationFee ?? 100,
      currency: 'USD',
      defaultConsultationDuration: payload.defaultConsultationDuration ?? 30,
      biography: payload.biography || '',
      status: 'PENDING_VERIFICATION',
      shifts: defaultShifts,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const saved = await this.doctorRepo.save(newDoctor)

    await this.doctorRepo.addAuditLog({
      id: `audit-${Date.now()}`,
      tenantId,
      doctorId: saved.id,
      actorId,
      action: 'DOCTOR_INVITED',
      timestamp: new Date().toISOString(),
    })

    return saved
  }

  async getDoctorById(tenantId: string, doctorId: string): Promise<DoctorProfile> {
    const doctor = await this.doctorRepo.findById(tenantId, doctorId)
    if (!doctor) {
      throw new Error(`Doctor record with ID "${doctorId}" was not found.`)
    }
    return doctor
  }

  async listDoctors(tenantId: string, status?: string, search?: string): Promise<DoctorProfile[]> {
    return this.doctorRepo.findByTenant(tenantId, status, search)
  }

  async updateDoctorProfile(tenantId: string, doctorId: string, actorId: string, payload: UpdateDoctorPayload): Promise<DoctorProfile> {
    const doctor = await this.getDoctorById(tenantId, doctorId)

    if (payload.legalName) doctor.legalName = payload.legalName.trim()
    if (payload.medicalTitle) doctor.medicalTitle = payload.medicalTitle.trim()
    if (payload.primarySpecialty) doctor.primarySpecialty = payload.primarySpecialty.trim()
    if (payload.department) doctor.department = payload.department.trim()
    if (payload.primaryEmail) doctor.primaryEmail = payload.primaryEmail.trim()
    if (payload.primaryPhone) doctor.primaryPhone = payload.primaryPhone.trim()
    if (payload.biography !== undefined) doctor.biography = payload.biography.trim()

    const saved = await this.doctorRepo.save(doctor)

    await this.doctorRepo.addAuditLog({
      id: `audit-${Date.now()}`,
      tenantId,
      doctorId: saved.id,
      actorId,
      action: 'PROFILE_UPDATED',
      timestamp: new Date().toISOString(),
    })

    return saved
  }

  async updateFees(tenantId: string, doctorId: string, actorId: string, fee: number, duration: number): Promise<DoctorProfile> {
    DoctorValidator.validateFees(fee, duration)
    const doctor = await this.getDoctorById(tenantId, doctorId)

    doctor.consultationFee = fee
    doctor.defaultConsultationDuration = duration

    const saved = await this.doctorRepo.save(doctor)

    await this.doctorRepo.addAuditLog({
      id: `audit-${Date.now()}`,
      tenantId,
      doctorId: saved.id,
      actorId,
      action: 'FEES_UPDATED',
      timestamp: new Date().toISOString(),
    })

    return saved
  }

  async updateSchedule(tenantId: string, doctorId: string, actorId: string, shifts: DoctorShift[]): Promise<DoctorProfile> {
    DoctorValidator.validateShifts(shifts)
    const doctor = await this.getDoctorById(tenantId, doctorId)

    doctor.shifts = shifts

    const saved = await this.doctorRepo.save(doctor)

    await this.doctorRepo.addAuditLog({
      id: `audit-${Date.now()}`,
      tenantId,
      doctorId: saved.id,
      actorId,
      action: 'SCHEDULE_UPDATED',
      timestamp: new Date().toISOString(),
    })

    return saved
  }

  async addLeave(tenantId: string, doctorId: string, actorId: string, payload: { date: string; name: string; reason?: string }): Promise<DoctorLeave> {
    await this.getDoctorById(tenantId, doctorId) // ensure exists
    if (!payload.date || !payload.name) {
      throw new Error('Leave Date and Title are required.')
    }

    const existingLeaves = await this.doctorRepo.getLeaves(tenantId, doctorId)
    if (existingLeaves.some((l) => l.date === payload.date)) {
      throw new Error(`A leave exception is already declared for ${payload.date}.`)
    }

    const leave: DoctorLeave = {
      id: `leave-${Date.now()}`,
      date: payload.date,
      name: payload.name.trim(),
      reason: payload.reason?.trim(),
    }

    const saved = await this.doctorRepo.saveLeave(tenantId, doctorId, leave)

    await this.doctorRepo.addAuditLog({
      id: `audit-${Date.now()}`,
      tenantId,
      doctorId,
      actorId,
      action: 'LEAVE_DECLARED',
      timestamp: new Date().toISOString(),
    })

    return saved
  }

  async deleteLeave(tenantId: string, doctorId: string, actorId: string, leaveId: string): Promise<void> {
    await this.getDoctorById(tenantId, doctorId)
    const deleted = await this.doctorRepo.deleteLeave(tenantId, doctorId, leaveId)
    if (!deleted) {
      throw new Error(`Leave exception record with ID "${leaveId}" was not found.`)
    }

    await this.doctorRepo.addAuditLog({
      id: `audit-${Date.now()}`,
      tenantId,
      doctorId,
      actorId,
      action: 'LEAVE_REMOVED',
      timestamp: new Date().toISOString(),
    })
  }

  async getLeaves(tenantId: string, doctorId: string): Promise<DoctorLeave[]> {
    await this.getDoctorById(tenantId, doctorId)
    return this.doctorRepo.getLeaves(tenantId, doctorId)
  }

  async verifyLicense(tenantId: string, doctorId: string, actorId: string): Promise<DoctorProfile> {
    const doctor = await this.getDoctorById(tenantId, doctorId)
    DoctorValidator.validateStatusTransition(doctor.status, 'ACTIVE')

    doctor.status = 'ACTIVE'
    const saved = await this.doctorRepo.save(doctor)

    await this.doctorRepo.addAuditLog({
      id: `audit-${Date.now()}`,
      tenantId,
      doctorId: saved.id,
      actorId,
      action: 'LICENSE_VERIFIED_AND_ACTIVATED',
      timestamp: new Date().toISOString(),
    })

    return saved
  }

  async updateStatus(tenantId: string, doctorId: string, actorId: string, newStatus: DoctorStatus, reason: string): Promise<DoctorProfile> {
    const doctor = await this.getDoctorById(tenantId, doctorId)
    DoctorValidator.validateStatusTransition(doctor.status, newStatus)

    doctor.status = newStatus
    const saved = await this.doctorRepo.save(doctor)

    await this.doctorRepo.addAuditLog({
      id: `audit-${Date.now()}`,
      tenantId,
      doctorId: saved.id,
      actorId,
      action: `STATUS_CHANGED_TO_${newStatus}`,
      reason: reason || 'Administrative Status Update',
      timestamp: new Date().toISOString(),
    })

    return saved
  }
}
