import crypto from 'crypto'
import { AppError } from '@/shared/errors/AppError'
import { logger } from '@/shared/logging/logger'
import { ClinicRepository, HolidayRepository, ClinicAuditRepository } from './clinic.repository'
import type { ClinicProfile, ClinicStatus, DayOperatingHours, HolidayException, ClinicLocation, ClinicAuditLog } from './clinic.types'

export class ClinicService {
  public static async getClinicProfile(tenantId: string): Promise<ClinicProfile> {
    const clinic = await ClinicRepository.findByTenantId(tenantId)
    if (!clinic) {
      throw new AppError('Clinic workspace profile not found.', 404, 'CLINIC_NOT_FOUND')
    }
    return clinic
  }

  public static async getClinicById(id: string): Promise<ClinicProfile> {
    const clinic = await ClinicRepository.findById(id)
    if (!clinic) {
      throw new AppError('Clinic tenant record not found.', 404, 'CLINIC_NOT_FOUND')
    }
    return clinic
  }

  public static async listClinics(statusFilter?: string, searchTerm?: string): Promise<ClinicProfile[]> {
    let clinics = await ClinicRepository.findAll()

    if (statusFilter && statusFilter !== 'ALL') {
      clinics = clinics.filter((c) => c.status === statusFilter)
    }

    if (searchTerm && searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      clinics = clinics.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.tenantId.toLowerCase().includes(term) ||
          c.primaryEmail.toLowerCase().includes(term)
      )
    }

    return clinics
  }

  public static async updateClinicProfile(
    tenantId: string,
    payload: {
      name?: string
      legalName?: string
      registrationNumber?: string
      taxId?: string
      primaryEmail?: string
      primaryPhone?: string
      logoUrl?: string
      timezone?: string
      currency?: string
      location?: Partial<ClinicLocation>
    },
    actorId: string
  ): Promise<ClinicProfile> {
    const clinic = await ClinicRepository.findByTenantId(tenantId)
    if (!clinic) {
      throw new AppError('Clinic workspace profile not found.', 404, 'CLINIC_NOT_FOUND')
    }

    if (clinic.status !== 'ACTIVE' && clinic.status !== 'APPROVED') {
      throw new AppError('Cannot update profile for a non-active clinic workspace.', 403, 'WORKSPACE_INACTIVE')
    }

    const changesDelta: Record<string, unknown> = {}

    if (payload.name && payload.name !== clinic.name) {
      changesDelta.name = { old: clinic.name, new: payload.name }
      clinic.name = payload.name
    }

    if (payload.legalName && payload.legalName !== clinic.legalName) {
      changesDelta.legalName = { old: clinic.legalName, new: payload.legalName }
      clinic.legalName = payload.legalName
    }

    if (payload.registrationNumber && payload.registrationNumber !== clinic.registrationNumber) {
      const existing = await ClinicRepository.findByRegistrationNumber(payload.registrationNumber)
      if (existing && existing.id !== clinic.id) {
        throw new AppError('Medical registration code is already registered to another clinic.', 409, 'REGISTRATION_EXISTS')
      }
      changesDelta.registrationNumber = { old: clinic.registrationNumber, new: payload.registrationNumber }
      clinic.registrationNumber = payload.registrationNumber
    }

    if (payload.taxId && payload.taxId !== clinic.taxId) {
      const existingTax = await ClinicRepository.findByTaxId(payload.taxId)
      if (existingTax && existingTax.id !== clinic.id) {
        throw new AppError('Tax identifier is already registered to another clinic.', 409, 'TAX_ID_EXISTS')
      }
      changesDelta.taxId = { old: clinic.taxId, new: payload.taxId }
      clinic.taxId = payload.taxId
    }

    if (payload.primaryEmail && payload.primaryEmail !== clinic.primaryEmail) {
      changesDelta.primaryEmail = { old: clinic.primaryEmail, new: payload.primaryEmail }
      clinic.primaryEmail = payload.primaryEmail.toLowerCase()
    }

    if (payload.primaryPhone) clinic.primaryPhone = payload.primaryPhone
    if (payload.logoUrl) clinic.logoUrl = payload.logoUrl
    if (payload.timezone) clinic.timezone = payload.timezone
    if (payload.currency) clinic.currency = payload.currency

    if (payload.location) {
      clinic.location = { ...clinic.location, ...payload.location }
      changesDelta.location = clinic.location
    }

    clinic.updatedAt = new Date()
    const updated = await ClinicRepository.update(clinic)

    // Write audit log
    const auditLog: ClinicAuditLog = {
      id: `aud-${crypto.randomBytes(6).toString('hex')}`,
      tenantId,
      actorId,
      action: 'PROFILE_UPDATED',
      changesDelta,
      createdAt: new Date(),
    }
    await ClinicAuditRepository.create(auditLog)

    logger.info({
      message: 'Clinic workspace profile updated',
      tenantId,
      context: { actorId },
    })

    return updated
  }

  public static async updateOperatingHours(
    tenantId: string,
    schedule: DayOperatingHours[],
    actorId: string
  ): Promise<DayOperatingHours[]> {
    const clinic = await ClinicRepository.findByTenantId(tenantId)
    if (!clinic) {
      throw new AppError('Clinic workspace profile not found.', 404, 'CLINIC_NOT_FOUND')
    }

    if (clinic.status !== 'ACTIVE') {
      throw new AppError('Cannot update operating hours for a non-active clinic workspace.', 403, 'WORKSPACE_INACTIVE')
    }

    // Validate shift bounds
    for (const day of schedule) {
      if (day.isOpen) {
        if (day.shiftStart >= day.shiftEnd) {
          throw new AppError(`Invalid shift bounds for ${day.dayOfWeek}. Shift start time must be before end time.`, 400, 'INVALID_SHIFT_BOUNDS')
        }
        if (day.hasLunchBreak && day.lunchStart && day.lunchEnd) {
          if (day.lunchStart >= day.lunchEnd) {
            throw new AppError(`Invalid lunch break bounds for ${day.dayOfWeek}. Lunch start must be before lunch end.`, 400, 'INVALID_LUNCH_BOUNDS')
          }
          if (day.lunchStart < day.shiftStart || day.lunchEnd > day.shiftEnd) {
            throw new AppError(`Lunch break for ${day.dayOfWeek} must be inside shift operating hours.`, 400, 'INVALID_LUNCH_RANGE')
          }
        }
      }
    }

    clinic.operatingHours = schedule
    clinic.updatedAt = new Date()
    await ClinicRepository.update(clinic)

    // Audit log
    await ClinicAuditRepository.create({
      id: `aud-${crypto.randomBytes(6).toString('hex')}`,
      tenantId,
      actorId,
      action: 'OPERATING_HOURS_UPDATED',
      createdAt: new Date(),
    })

    logger.info({
      message: 'Clinic shift operating hours updated',
      tenantId,
      context: { actorId },
    })

    return clinic.operatingHours
  }

  public static async getHolidays(tenantId: string): Promise<HolidayException[]> {
    return HolidayRepository.findAllByTenantId(tenantId)
  }

  public static async addHoliday(
    tenantId: string,
    payload: { date: string; name: string; reason?: string },
    actorId: string
  ): Promise<HolidayException> {
    const existing = await HolidayRepository.findByDate(tenantId, payload.date)
    if (existing) {
      throw new AppError('A holiday exception for this date has already been declared.', 409, 'HOLIDAY_EXISTS')
    }

    const holiday: HolidayException = {
      id: `hol-${crypto.randomBytes(6).toString('hex')}`,
      tenantId,
      date: payload.date,
      name: payload.name,
      reason: payload.reason || 'Custom Clinic Closure',
      createdAt: new Date(),
    }

    const created = await HolidayRepository.create(holiday)

    await ClinicAuditRepository.create({
      id: `aud-${crypto.randomBytes(6).toString('hex')}`,
      tenantId,
      actorId,
      action: 'HOLIDAY_DECLARED',
      changesDelta: { date: payload.date, name: payload.name },
      createdAt: new Date(),
    })

    logger.info({
      message: 'Date-specific holiday exception declared',
      tenantId,
      context: { actorId, holidayId: created.id, date: payload.date },
    })

    return created
  }

  public static async deleteHoliday(tenantId: string, holidayId: string, actorId: string): Promise<void> {
    const holiday = await HolidayRepository.findById(holidayId)
    if (!holiday || holiday.tenantId !== tenantId) {
      throw new AppError('Holiday exception record not found.', 404, 'HOLIDAY_NOT_FOUND')
    }

    await HolidayRepository.delete(holidayId)

    await ClinicAuditRepository.create({
      id: `aud-${crypto.randomBytes(6).toString('hex')}`,
      tenantId,
      actorId,
      action: 'HOLIDAY_DELETED',
      changesDelta: { holidayId, date: holiday.date },
      createdAt: new Date(),
    })

    logger.info({
      message: 'Holiday exception removed',
      tenantId,
      context: { actorId, holidayId },
    })
  }

  public static async updateStatus(
    clinicId: string,
    newStatus: ClinicStatus,
    reason: string,
    actorId: string
  ): Promise<ClinicProfile> {
    const clinic = await ClinicRepository.findById(clinicId)
    if (!clinic) {
      throw new AppError('Clinic tenant record not found.', 404, 'CLINIC_NOT_FOUND')
    }

    const oldStatus = clinic.status

    // Validate state machine transitions
    if (oldStatus === 'ARCHIVED') {
      throw new AppError('Cannot update status of an archived clinic workspace.', 400, 'TERMINAL_STATE')
    }

    if (newStatus === 'APPROVED' && oldStatus !== 'PENDING_REVIEW') {
      throw new AppError('Only pending review clinics can be approved.', 400, 'INVALID_TRANSITION')
    }

    if (newStatus === 'ACTIVE' && oldStatus !== 'APPROVED' && oldStatus !== 'SUSPENDED') {
      throw new AppError('Only approved or suspended clinics can be activated.', 400, 'INVALID_TRANSITION')
    }

    clinic.status = newStatus
    clinic.updatedAt = new Date()
    const updated = await ClinicRepository.update(clinic)

    // Record audit log
    await ClinicAuditRepository.create({
      id: `aud-${crypto.randomBytes(6).toString('hex')}`,
      tenantId: clinic.tenantId,
      actorId,
      action: `STATUS_CHANGED_TO_${newStatus}`,
      oldStatus,
      newStatus,
      changesDelta: { reason },
      createdAt: new Date(),
    })

    logger.warn({
      message: `Super Admin executed tenant status transition to ${newStatus}`,
      tenantId: clinic.tenantId,
      context: { actorId, oldStatus, newStatus, reason },
    })

    return updated
  }
}
