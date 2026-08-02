import type { ClinicProfile, HolidayException, ClinicAuditLog } from './clinic.types'

export interface IClinicRepository {
  findById(id: string): Promise<ClinicProfile | null>
  findByTenantId(tenantId: string): Promise<ClinicProfile | null>
  findByTaxId(taxId: string): Promise<ClinicProfile | null>
  findByRegistrationNumber(registrationNumber: string): Promise<ClinicProfile | null>
  findAll(): Promise<ClinicProfile[]>
  create(clinic: ClinicProfile): Promise<ClinicProfile>
  update(clinic: ClinicProfile): Promise<ClinicProfile>
}

export interface IHolidayRepository {
  findAllByTenantId(tenantId: string): Promise<HolidayException[]>
  findById(id: string): Promise<HolidayException | null>
  findByDate(tenantId: string, date: string): Promise<HolidayException | null>
  create(holiday: HolidayException): Promise<HolidayException>
  delete(id: string): Promise<void>
}

export interface IClinicAuditRepository {
  create(log: ClinicAuditLog): Promise<ClinicAuditLog>
  findAllByTenantId(tenantId: string): Promise<ClinicAuditLog[]>
}

// In-Memory Data Store representing Database Storage conceptually
const clinicsStore: Map<string, ClinicProfile> = new Map()
const holidaysStore: Map<string, HolidayException> = new Map()
const auditLogsStore: Map<string, ClinicAuditLog> = new Map()

// Seed default initial clinic workspace record
const defaultClinic: ClinicProfile = {
  id: 'cln-101',
  tenantId: 'clinic-101',
  name: 'Hope Wellness Clinic',
  legalName: 'Hope Wellness Medical LLC',
  registrationNumber: 'MED-REG-88902',
  taxId: 'TAX-9920182',
  primaryEmail: 'contact@hopewellness.com',
  primaryPhone: '+1 (555) 234-5678',
  timezone: 'America/New_York',
  currency: 'USD',
  status: 'ACTIVE',
  location: {
    addressLine1: '124 Medical Plaza Blvd',
    addressLine2: 'Suite 400',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'United States',
  },
  operatingHours: [
    { dayOfWeek: 'Monday', isOpen: true, shiftStart: '08:00', shiftEnd: '17:00', hasLunchBreak: true, lunchStart: '12:00', lunchEnd: '13:00' },
    { dayOfWeek: 'Tuesday', isOpen: true, shiftStart: '08:00', shiftEnd: '17:00', hasLunchBreak: true, lunchStart: '12:00', lunchEnd: '13:00' },
    { dayOfWeek: 'Wednesday', isOpen: true, shiftStart: '08:00', shiftEnd: '17:00', hasLunchBreak: true, lunchStart: '12:00', lunchEnd: '13:00' },
    { dayOfWeek: 'Thursday', isOpen: true, shiftStart: '08:00', shiftEnd: '17:00', hasLunchBreak: true, lunchStart: '12:00', lunchEnd: '13:00' },
    { dayOfWeek: 'Friday', isOpen: true, shiftStart: '08:00', shiftEnd: '16:00', hasLunchBreak: true, lunchStart: '12:00', lunchEnd: '13:00' },
    { dayOfWeek: 'Saturday', isOpen: false, shiftStart: '09:00', shiftEnd: '13:00', hasLunchBreak: false },
    { dayOfWeek: 'Sunday', isOpen: false, shiftStart: '09:00', shiftEnd: '13:00', hasLunchBreak: false },
  ],
  createdAt: new Date('2026-01-15T08:00:00Z'),
  updatedAt: new Date('2026-07-20T14:30:00Z'),
}
clinicsStore.set(defaultClinic.id, defaultClinic)

export const ClinicRepository: IClinicRepository = {
  async findById(id: string) {
    return clinicsStore.get(id) || null
  },
  async findByTenantId(tenantId: string) {
    return Array.from(clinicsStore.values()).find((c) => c.tenantId === tenantId) || null
  },
  async findByTaxId(taxId: string) {
    return Array.from(clinicsStore.values()).find((c) => c.taxId === taxId) || null
  },
  async findByRegistrationNumber(registrationNumber: string) {
    return Array.from(clinicsStore.values()).find((c) => c.registrationNumber === registrationNumber) || null
  },
  async findAll() {
    return Array.from(clinicsStore.values())
  },
  async create(clinic: ClinicProfile) {
    clinicsStore.set(clinic.id, clinic)
    return clinic
  },
  async update(clinic: ClinicProfile) {
    clinicsStore.set(clinic.id, clinic)
    return clinic
  },
}

export const HolidayRepository: IHolidayRepository = {
  async findAllByTenantId(tenantId: string) {
    return Array.from(holidaysStore.values()).filter((h) => h.tenantId === tenantId)
  },
  async findById(id: string) {
    return holidaysStore.get(id) || null
  },
  async findByDate(tenantId: string, date: string) {
    return Array.from(holidaysStore.values()).find((h) => h.tenantId === tenantId && h.date === date) || null
  },
  async create(holiday: HolidayException) {
    holidaysStore.set(holiday.id, holiday)
    return holiday
  },
  async delete(id: string) {
    holidaysStore.delete(id)
  },
}

export const ClinicAuditRepository: IClinicAuditRepository = {
  async create(log: ClinicAuditLog) {
    auditLogsStore.set(log.id, log)
    return log
  },
  async findAllByTenantId(tenantId: string) {
    return Array.from(auditLogsStore.values()).filter((l) => l.tenantId === tenantId)
  },
}
