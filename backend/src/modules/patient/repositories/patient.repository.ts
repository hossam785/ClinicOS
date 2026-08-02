import type { PatientProfile, PatientAuditLog } from '../types/patient.types'

export interface IPatientRepository {
  create(patient: PatientProfile): Promise<PatientProfile>
  findById(tenantId: string, id: string): Promise<PatientProfile | null>
  findByNationalId(tenantId: string, nationalId: string): Promise<PatientProfile | null>
  findByPhone(tenantId: string, phone: string): Promise<PatientProfile | null>
  list(tenantId: string, status?: string, search?: string): Promise<PatientProfile[]>
  update(tenantId: string, id: string, updates: Partial<PatientProfile>): Promise<PatientProfile | null>
  getNextPatientSequence(tenantId: string): Promise<number>
  createAuditLog(auditLog: PatientAuditLog): Promise<void>
}

export class InMemoryPatientRepository implements IPatientRepository {
  private patients: Map<string, PatientProfile> = new Map()
  private auditLogs: PatientAuditLog[] = []
  private sequences: Map<string, number> = new Map()

  constructor() {
    this.seedInitialData()
  }

  private seedInitialData(): void {
    const seedPatient: PatientProfile = {
      id: 'pat-101',
      patientCode: 'PAT-202607-00101',
      tenantId: 'clinic-101',
      firstName: 'Eleanor',
      lastName: 'Vance',
      fullName: 'Eleanor Vance',
      gender: 'female',
      dateOfBirth: '1992-05-14',
      nationalId: '1098237465',
      primaryPhone: '+12025550142',
      email: 'eleanor.vance@example.com',
      bloodGroup: 'O+',
      allergiesFlag: true,
      chronicDiseaseFlag: false,
      insuranceFlag: true,
      emergencyContact: {
        name: 'Thomas Vance',
        relationship: 'Brother',
        phone: '+12025550199',
      },
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'sys-admin',
      updatedBy: 'sys-admin',
      version: 1,
    }
    this.patients.set(seedPatient.id, seedPatient)
    this.sequences.set('clinic-101', 101)
  }

  async create(patient: PatientProfile): Promise<PatientProfile> {
    this.patients.set(patient.id, { ...patient })
    return { ...patient }
  }

  async findById(tenantId: string, id: string): Promise<PatientProfile | null> {
    const patient = this.patients.get(id)
    if (!patient || patient.tenantId !== tenantId) {
      return null
    }
    return { ...patient }
  }

  async findByNationalId(tenantId: string, nationalId: string): Promise<PatientProfile | null> {
    for (const patient of this.patients.values()) {
      if (patient.tenantId === tenantId && patient.nationalId === nationalId) {
        return { ...patient }
      }
    }
    return null
  }

  async findByPhone(tenantId: string, phone: string): Promise<PatientProfile | null> {
    for (const patient of this.patients.values()) {
      if (patient.tenantId === tenantId && patient.primaryPhone === phone) {
        return { ...patient }
      }
    }
    return null
  }

  async list(tenantId: string, status?: string, search?: string): Promise<PatientProfile[]> {
    const results: PatientProfile[] = []

    for (const patient of this.patients.values()) {
      if (patient.tenantId !== tenantId) continue

      if (status && status !== 'ALL' && patient.status !== status) {
        continue
      }

      if (search && search.trim() !== '') {
        const query = search.toLowerCase()
        const matchesName = patient.fullName.toLowerCase().includes(query)
        const matchesCode = patient.patientCode.toLowerCase().includes(query)
        const matchesPhone = patient.primaryPhone.includes(query)
        const matchesNational = patient.nationalId ? patient.nationalId.includes(query) : false

        if (!matchesName && !matchesCode && !matchesPhone && !matchesNational) {
          continue
        }
      }

      results.push({ ...patient })
    }

    return results
  }

  async update(tenantId: string, id: string, updates: Partial<PatientProfile>): Promise<PatientProfile | null> {
    const patient = this.patients.get(id)
    if (!patient || patient.tenantId !== tenantId) {
      return null
    }

    const updated: PatientProfile = {
      ...patient,
      ...updates,
      updatedAt: new Date().toISOString(),
      version: patient.version + 1,
    }

    this.patients.set(id, updated)
    return { ...updated }
  }

  async getNextPatientSequence(tenantId: string): Promise<number> {
    const current = this.sequences.get(tenantId) || 100
    const next = current + 1
    this.sequences.set(tenantId, next)
    return next
  }

  async createAuditLog(auditLog: PatientAuditLog): Promise<void> {
    this.auditLogs.push(auditLog)
  }
}
