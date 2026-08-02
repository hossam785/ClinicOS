import type { IAppointmentRepository } from '../repositories/appointment.repository'
import type { AppointmentProfile, AppointmentStatus, AppointmentType, AppointmentPriority } from '../types/appointment.types'
import { AppointmentValidator } from '../validators/appointment.validator'

export class AppointmentService {
  constructor(private appointmentRepo: IAppointmentRepository) {}

  private async generateAppointmentNumber(tenantId: string): Promise<string> {
    const sequence = await this.appointmentRepo.getNextSequence(tenantId)
    const yearMonth = new Date().toISOString().slice(0, 7).replace('-', '')
    const paddedSeq = sequence.toString().padStart(5, '0')
    return `APT-${yearMonth}-${paddedSeq}`
  }

  async createAppointment(
    tenantId: string,
    actorId: string,
    payload: Record<string, unknown>
  ): Promise<AppointmentProfile> {
    const validation = AppointmentValidator.validateCreateAppointment(payload)
    if (!validation.isValid) {
      throw new Error(`Validation Error: ${validation.error}`)
    }

    const doctorId = (payload.doctorId as string).trim()
    const appointmentDate = (payload.appointmentDate as string).trim()
    const startTime = (payload.startTime as string).trim()
    const endTime = (payload.endTime as string).trim()

    // Conflict detection check
    const conflict = await this.appointmentRepo.findOverlapping(tenantId, doctorId, appointmentDate, startTime, endTime)
    if (conflict) {
      throw new Error(`APPOINTMENT_CONFLICT: Dr. ${payload.doctorName} has an overlapping active appointment (${conflict.appointmentNumber}) from ${conflict.startTime} to ${conflict.endTime}.`)
    }

    const appointmentNumber = await this.generateAppointmentNumber(tenantId)

    const newAppointment: AppointmentProfile = {
      id: `apt-${Date.now()}`,
      appointmentNumber,
      tenantId,
      clinicId: payload.clinicId ? (payload.clinicId as string).trim() : 'clinic-branch-01',
      patientId: (payload.patientId as string).trim(),
      patientName: (payload.patientName as string).trim(),
      patientCode: payload.patientCode ? (payload.patientCode as string).trim() : 'PAT-202607-00101',
      patientPhone: payload.patientPhone ? (payload.patientPhone as string).trim() : '+12025550142',
      doctorId,
      doctorName: (payload.doctorName as string).trim(),
      doctorSpecialty: payload.doctorSpecialty ? (payload.doctorSpecialty as string).trim() : undefined,
      appointmentDate,
      startTime,
      endTime,
      durationMinutes: Number(payload.durationMinutes) || 30,
      appointmentType: (payload.appointmentType as AppointmentType) || 'FOLLOW_UP',
      priority: (payload.priority as AppointmentPriority) || 'NORMAL',
      status: 'SCHEDULED',
      chiefComplaint: payload.chiefComplaint ? (payload.chiefComplaint as string).trim() : undefined,
      internalNotes: payload.internalNotes ? (payload.internalNotes as string).trim() : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: actorId,
      updatedBy: actorId,
      version: 1,
    }

    const created = await this.appointmentRepo.create(newAppointment)

    await this.appointmentRepo.createAuditLog({
      id: `audit-${Date.now()}`,
      appointmentId: created.id,
      tenantId,
      actorId,
      action: 'APPOINTMENT_CREATED',
      timestamp: new Date().toISOString(),
      details: { appointmentNumber: created.appointmentNumber, patientName: created.patientName },
    })

    return created
  }

  async getAppointmentById(tenantId: string, id: string): Promise<AppointmentProfile> {
    const apt = await this.appointmentRepo.findById(tenantId, id)
    if (!apt) {
      throw new Error('APPOINTMENT_NOT_FOUND: Appointment record does not exist in this workspace.')
    }
    return apt
  }

  async listAppointments(tenantId: string, status?: string, doctorId?: string, search?: string): Promise<AppointmentProfile[]> {
    return this.appointmentRepo.list(tenantId, status, doctorId, search)
  }

  async checkAvailability(
    tenantId: string,
    doctorId: string,
    date: string,
    startTime: string,
    endTime: string
  ): Promise<{ available: boolean; conflict?: AppointmentProfile }> {
    const conflict = await this.appointmentRepo.findOverlapping(tenantId, doctorId, date, startTime, endTime)
    return {
      available: !conflict,
      conflict: conflict || undefined,
    }
  }

  async getDailyQueue(tenantId: string, date?: string): Promise<AppointmentProfile[]> {
    const targetDate = date || new Date().toISOString().slice(0, 10)
    return this.appointmentRepo.getDailyQueue(tenantId, targetDate)
  }

  async updateAppointment(
    tenantId: string,
    id: string,
    actorId: string,
    updates: Partial<AppointmentProfile>
  ): Promise<AppointmentProfile> {
    const existing = await this.getAppointmentById(tenantId, id)

    if (['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(existing.status)) {
      throw new Error(`Cannot update appointment in terminal status ${existing.status}.`)
    }

    delete updates.id
    delete updates.appointmentNumber
    delete updates.tenantId
    delete updates.createdAt
    delete updates.createdBy

    const updated = await this.appointmentRepo.update(tenantId, id, {
      ...updates,
      updatedBy: actorId,
    })

    if (!updated) {
      throw new Error('APPOINTMENT_NOT_FOUND: Failed to update appointment.')
    }

    await this.appointmentRepo.createAuditLog({
      id: `audit-${Date.now()}`,
      appointmentId: id,
      tenantId,
      actorId,
      action: 'APPOINTMENT_UPDATED',
      timestamp: new Date().toISOString(),
    })

    return updated
  }

  async checkInPatient(tenantId: string, id: string, actorId: string): Promise<AppointmentProfile> {
    const apt = await this.getAppointmentById(tenantId, id)
    const statusCheck = AppointmentValidator.validateStatusTransition(apt.status, 'CHECKED_IN')
    if (!statusCheck.isValid) {
      throw new Error(statusCheck.error)
    }

    const updated = await this.appointmentRepo.update(tenantId, id, {
      status: 'CHECKED_IN',
      checkedInAt: new Date().toISOString(),
      updatedBy: actorId,
    })

    if (!updated) throw new Error('APPOINTMENT_NOT_FOUND: Failed to check-in patient.')

    await this.appointmentRepo.createAuditLog({
      id: `audit-${Date.now()}`,
      appointmentId: id,
      tenantId,
      actorId,
      action: 'APPOINTMENT_CHECKED_IN',
      timestamp: new Date().toISOString(),
    })

    return updated
  }

  async startConsultation(tenantId: string, id: string, actorId: string): Promise<AppointmentProfile> {
    const apt = await this.getAppointmentById(tenantId, id)
    const statusCheck = AppointmentValidator.validateStatusTransition(apt.status, 'IN_CONSULTATION')
    if (!statusCheck.isValid) {
      throw new Error(statusCheck.error)
    }

    const updated = await this.appointmentRepo.update(tenantId, id, {
      status: 'IN_CONSULTATION',
      consultationStartedAt: new Date().toISOString(),
      updatedBy: actorId,
    })

    if (!updated) throw new Error('APPOINTMENT_NOT_FOUND: Failed to start consultation.')

    await this.appointmentRepo.createAuditLog({
      id: `audit-${Date.now()}`,
      appointmentId: id,
      tenantId,
      actorId,
      action: 'APPOINTMENT_CONSULTATION_STARTED',
      timestamp: new Date().toISOString(),
    })

    return updated
  }

  async completeConsultation(tenantId: string, id: string, actorId: string): Promise<AppointmentProfile> {
    const apt = await this.getAppointmentById(tenantId, id)
    const statusCheck = AppointmentValidator.validateStatusTransition(apt.status, 'COMPLETED')
    if (!statusCheck.isValid) {
      throw new Error(statusCheck.error)
    }

    const now = new Date().toISOString()
    const updated = await this.appointmentRepo.update(tenantId, id, {
      status: 'COMPLETED',
      consultationEndedAt: now,
      completedAt: now,
      updatedBy: actorId,
    })

    if (!updated) throw new Error('APPOINTMENT_NOT_FOUND: Failed to complete consultation.')

    await this.appointmentRepo.createAuditLog({
      id: `audit-${Date.now()}`,
      appointmentId: id,
      tenantId,
      actorId,
      action: 'APPOINTMENT_COMPLETED',
      timestamp: now,
    })

    return updated
  }

  async cancelAppointment(tenantId: string, id: string, actorId: string, reason?: string): Promise<AppointmentProfile> {
    if (!reason || !reason.trim()) {
      throw new Error('A cancellation reason is required before cancelling an appointment.')
    }

    const apt = await this.getAppointmentById(tenantId, id)
    const statusCheck = AppointmentValidator.validateStatusTransition(apt.status, 'CANCELLED')
    if (!statusCheck.isValid) {
      throw new Error(statusCheck.error)
    }

    const updated = await this.appointmentRepo.update(tenantId, id, {
      status: 'CANCELLED',
      cancelledAt: new Date().toISOString(),
      cancelledBy: actorId,
      cancellationReason: reason.trim(),
      updatedBy: actorId,
    })

    if (!updated) throw new Error('APPOINTMENT_NOT_FOUND: Failed to cancel appointment.')

    await this.appointmentRepo.createAuditLog({
      id: `audit-${Date.now()}`,
      appointmentId: id,
      tenantId,
      actorId,
      action: 'APPOINTMENT_CANCELLED',
      timestamp: new Date().toISOString(),
      details: { reason: reason.trim() },
    })

    return updated
  }

  async updateStatus(
    tenantId: string,
    id: string,
    actorId: string,
    status: AppointmentStatus,
    reason?: string
  ): Promise<AppointmentProfile> {
    const apt = await this.getAppointmentById(tenantId, id)

    const statusCheck = AppointmentValidator.validateStatusTransition(apt.status, status)
    if (!statusCheck.isValid) {
      throw new Error(statusCheck.error)
    }

    const updated = await this.appointmentRepo.update(tenantId, id, {
      status,
      updatedBy: actorId,
    })

    if (!updated) {
      throw new Error('APPOINTMENT_NOT_FOUND: Failed to update appointment status.')
    }

    await this.appointmentRepo.createAuditLog({
      id: `audit-${Date.now()}`,
      appointmentId: id,
      tenantId,
      actorId,
      action: `APPOINTMENT_STATUS_CHANGED_TO_${status}`,
      timestamp: new Date().toISOString(),
      details: { previousStatus: apt.status, newStatus: status, reason },
    })

    return updated
  }
}
