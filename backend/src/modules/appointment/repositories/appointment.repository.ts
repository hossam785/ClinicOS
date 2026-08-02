import type { AppointmentProfile, AppointmentAuditLog } from '../types/appointment.types'

export interface IAppointmentRepository {
  create(appointment: AppointmentProfile): Promise<AppointmentProfile>
  findById(tenantId: string, id: string): Promise<AppointmentProfile | null>
  list(tenantId: string, status?: string, doctorId?: string, search?: string): Promise<AppointmentProfile[]>
  findOverlapping(tenantId: string, doctorId: string, date: string, startTime: string, endTime: string, excludeId?: string): Promise<AppointmentProfile | null>
  getDailyQueue(tenantId: string, date: string): Promise<AppointmentProfile[]>
  update(tenantId: string, id: string, updates: Partial<AppointmentProfile>): Promise<AppointmentProfile | null>
  getNextSequence(tenantId: string): Promise<number>
  createAuditLog(auditLog: AppointmentAuditLog): Promise<void>
}

export class InMemoryAppointmentRepository implements IAppointmentRepository {
  private appointments: Map<string, AppointmentProfile> = new Map()
  private auditLogs: AppointmentAuditLog[] = []
  private sequences: Map<string, number> = new Map()

  constructor() {
    this.seedInitialData()
  }

  private seedInitialData(): void {
    const seedApt1: AppointmentProfile = {
      id: 'apt-101',
      appointmentNumber: 'APT-202607-00101',
      tenantId: 'clinic-101',
      clinicId: 'clinic-branch-01',
      patientId: 'pat-101',
      patientName: 'Eleanor Vance',
      patientCode: 'PAT-202607-00101',
      patientPhone: '+12025550142',
      doctorId: 'doc-101',
      doctorName: 'Dr. Sarah Jenkins',
      doctorSpecialty: 'Cardiology',
      appointmentDate: '2026-07-30',
      startTime: '09:00',
      endTime: '09:30',
      durationMinutes: 30,
      appointmentType: 'FOLLOW_UP',
      priority: 'NORMAL',
      status: 'SCHEDULED',
      chiefComplaint: 'Routine cardiac check-up & BP review.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'sys-admin',
      updatedBy: 'sys-admin',
      version: 1,
    }

    const seedApt2: AppointmentProfile = {
      id: 'apt-102',
      appointmentNumber: 'APT-202607-00102',
      tenantId: 'clinic-101',
      clinicId: 'clinic-branch-01',
      patientId: 'pat-102',
      patientName: 'Marcus Aurelius',
      patientCode: 'PAT-202607-00102',
      patientPhone: '+12025550199',
      doctorId: 'doc-102',
      doctorName: 'Dr. Michael Chang',
      doctorSpecialty: 'Pediatrics',
      appointmentDate: '2026-07-30',
      startTime: '10:00',
      endTime: '10:30',
      durationMinutes: 30,
      appointmentType: 'FIRST_VISIT',
      priority: 'URGENT',
      status: 'CHECKED_IN',
      chiefComplaint: 'High fever and persistent cough.',
      checkedInAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'sys-admin',
      updatedBy: 'sys-admin',
      version: 1,
    }

    this.appointments.set(seedApt1.id, seedApt1)
    this.appointments.set(seedApt2.id, seedApt2)
    this.sequences.set('clinic-101', 102)
  }

  async create(appointment: AppointmentProfile): Promise<AppointmentProfile> {
    this.appointments.set(appointment.id, { ...appointment })
    return { ...appointment }
  }

  async findById(tenantId: string, id: string): Promise<AppointmentProfile | null> {
    const apt = this.appointments.get(id)
    if (!apt || apt.tenantId !== tenantId) {
      return null
    }
    return { ...apt }
  }

  async list(tenantId: string, status?: string, doctorId?: string, search?: string): Promise<AppointmentProfile[]> {
    const results: AppointmentProfile[] = []

    for (const apt of this.appointments.values()) {
      if (apt.tenantId !== tenantId) continue

      if (status && status !== 'ALL' && apt.status !== status) {
        continue
      }

      if (doctorId && apt.doctorId !== doctorId) {
        continue
      }

      if (search && search.trim() !== '') {
        const query = search.toLowerCase()
        const matchesPatient = apt.patientName.toLowerCase().includes(query)
        const matchesDoctor = apt.doctorName.toLowerCase().includes(query)
        const matchesCode = apt.appointmentNumber.toLowerCase().includes(query)

        if (!matchesPatient && !matchesDoctor && !matchesCode) {
          continue
        }
      }

      results.push({ ...apt })
    }

    return results
  }

  async findOverlapping(
    tenantId: string,
    doctorId: string,
    date: string,
    startTime: string,
    endTime: string,
    excludeId?: string
  ): Promise<AppointmentProfile | null> {
    for (const apt of this.appointments.values()) {
      if (apt.tenantId !== tenantId || apt.doctorId !== doctorId || apt.appointmentDate !== date) {
        continue
      }

      if (excludeId && apt.id === excludeId) {
        continue
      }

      if (['CANCELLED', 'RESCHEDULED', 'NO_SHOW'].includes(apt.status)) {
        continue
      }

      // Check non-overlapping time interval condition: startTime < apt.endTime AND endTime > apt.startTime
      if (startTime < apt.endTime && endTime > apt.startTime) {
        return { ...apt }
      }
    }

    return null
  }

  async getDailyQueue(tenantId: string, date: string): Promise<AppointmentProfile[]> {
    const results: AppointmentProfile[] = []

    for (const apt of this.appointments.values()) {
      if (apt.tenantId === tenantId && apt.appointmentDate === date) {
        if (['CHECKED_IN', 'IN_CONSULTATION'].includes(apt.status)) {
          results.push({ ...apt })
        }
      }
    }

    return results
  }

  async update(tenantId: string, id: string, updates: Partial<AppointmentProfile>): Promise<AppointmentProfile | null> {
    const apt = this.appointments.get(id)
    if (!apt || apt.tenantId !== tenantId) {
      return null
    }

    const updated: AppointmentProfile = {
      ...apt,
      ...updates,
      updatedAt: new Date().toISOString(),
      version: apt.version + 1,
    }

    this.appointments.set(id, updated)
    return { ...updated }
  }

  async getNextSequence(tenantId: string): Promise<number> {
    const current = this.sequences.get(tenantId) || 100
    const next = current + 1
    this.sequences.set(tenantId, next)
    return next
  }

  async createAuditLog(auditLog: AppointmentAuditLog): Promise<void> {
    this.auditLogs.push(auditLog)
  }
}
