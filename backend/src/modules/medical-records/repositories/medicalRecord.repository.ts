import type { MedicalRecordProfile, MedicalRecordAuditLog } from '../types/medicalRecord.types'

export interface IMedicalRecordRepository {
  create(record: MedicalRecordProfile): Promise<MedicalRecordProfile>
  findById(tenantId: string, id: string): Promise<MedicalRecordProfile | null>
  findByAppointmentId(tenantId: string, appointmentId: string): Promise<MedicalRecordProfile | null>
  list(tenantId: string, status?: string, doctorId?: string, search?: string): Promise<MedicalRecordProfile[]>
  getPatientHistory(tenantId: string, patientId: string): Promise<MedicalRecordProfile[]>
  update(tenantId: string, id: string, updates: Partial<MedicalRecordProfile>): Promise<MedicalRecordProfile | null>
  getNextSequence(tenantId: string): Promise<number>
  createAuditLog(auditLog: MedicalRecordAuditLog): Promise<void>
}

export class InMemoryMedicalRecordRepository implements IMedicalRecordRepository {
  private records: Map<string, MedicalRecordProfile> = new Map()
  private auditLogs: MedicalRecordAuditLog[] = []
  private sequences: Map<string, number> = new Map()

  constructor() {
    this.seedInitialData()
  }

  private seedInitialData(): void {
    const seedEmr1: MedicalRecordProfile = {
      id: 'emr-101',
      recordNumber: 'EMR-202607-00101',
      tenantId: 'clinic-101',
      clinicId: 'clinic-branch-01',
      patientId: 'pat-101',
      patientName: 'Eleanor Vance',
      patientCode: 'PAT-202607-00101',
      patientAge: 38,
      patientGender: 'Female',
      doctorId: 'doc-101',
      doctorName: 'Dr. Sarah Jenkins',
      doctorSpecialty: 'Cardiology',
      appointmentId: 'apt-101',
      appointmentNumber: 'APT-202607-00101',
      visitDate: '2026-07-30',
      visitType: 'FOLLOW_UP',
      chiefComplaint: 'Routine cardiac check-up & BP review.',
      historyOfPresentIllness: 'Patient reports mild exertion fatigue and occasional dizziness.',
      primaryDiagnosis: 'Essential Primary Hypertension',
      secondaryDiagnoses: ['Hyperlipidemia'],
      treatmentPlan: 'Continue Amlodipine 5mg daily. Low sodium diet and 30m aerobic exercise.',
      followUpInstructions: 'Return in 4 weeks for follow-up BP monitoring.',
      vitalSigns: {
        bloodPressureSystolic: 125,
        bloodPressureDiastolic: 82,
        pulseRate: 74,
        bodyTemperature: 36.6,
        oxygenSaturation: 98,
        heightCm: 168,
        weightKg: 65,
        bodyMassIndex: 23.0,
      },
      status: 'LOCKED',
      isLocked: true,
      lockedAt: '2026-07-30T10:00:00.000Z',
      lockedBy: 'doc-101',
      lockedByName: 'Dr. Sarah Jenkins',
      addenda: [
        {
          id: 'add-1',
          text: 'Addendum: Lab results reviewed post-consultation. Lipid panel within target bounds.',
          createdAt: '2026-07-30T14:30:00.000Z',
          createdBy: 'doc-101',
          createdByName: 'Dr. Sarah Jenkins',
        },
      ],
      createdAt: '2026-07-30T09:00:00.000Z',
      updatedAt: '2026-07-30T10:00:00.000Z',
      createdBy: 'doc-101',
      updatedBy: 'doc-101',
      version: 2,
    }

    this.records.set(seedEmr1.id, seedEmr1)
    this.sequences.set('clinic-101', 101)
  }

  async create(record: MedicalRecordProfile): Promise<MedicalRecordProfile> {
    this.records.set(record.id, { ...record })
    return { ...record }
  }

  async findById(tenantId: string, id: string): Promise<MedicalRecordProfile | null> {
    const rec = this.records.get(id)
    if (!rec || rec.tenantId !== tenantId) {
      return null
    }
    return { ...rec }
  }

  async findByAppointmentId(tenantId: string, appointmentId: string): Promise<MedicalRecordProfile | null> {
    for (const rec of this.records.values()) {
      if (rec.tenantId === tenantId && rec.appointmentId === appointmentId) {
        return { ...rec }
      }
    }
    return null
  }

  async list(tenantId: string, status?: string, doctorId?: string, search?: string): Promise<MedicalRecordProfile[]> {
    const results: MedicalRecordProfile[] = []

    for (const rec of this.records.values()) {
      if (rec.tenantId !== tenantId) continue

      if (status && status !== 'ALL' && rec.status !== status) {
        continue
      }

      if (doctorId && rec.doctorId !== doctorId) {
        continue
      }

      if (search && search.trim() !== '') {
        const query = search.toLowerCase()
        const matchesPatient = rec.patientName.toLowerCase().includes(query)
        const matchesDoctor = rec.doctorName.toLowerCase().includes(query)
        const matchesCode = rec.recordNumber.toLowerCase().includes(query)
        const matchesDiagnosis = (rec.primaryDiagnosis || '').toLowerCase().includes(query)

        if (!matchesPatient && !matchesDoctor && !matchesCode && !matchesDiagnosis) {
          continue
        }
      }

      results.push({ ...rec })
    }

    return results
  }

  async getPatientHistory(tenantId: string, patientId: string): Promise<MedicalRecordProfile[]> {
    const results: MedicalRecordProfile[] = []

    for (const rec of this.records.values()) {
      if (rec.tenantId === tenantId && rec.patientId === patientId) {
        results.push({ ...rec })
      }
    }

    // Sort chronologically descending
    results.sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime())
    return results
  }

  async update(tenantId: string, id: string, updates: Partial<MedicalRecordProfile>): Promise<MedicalRecordProfile | null> {
    const rec = this.records.get(id)
    if (!rec || rec.tenantId !== tenantId) {
      return null
    }

    const updated: MedicalRecordProfile = {
      ...rec,
      ...updates,
      updatedAt: new Date().toISOString(),
      version: rec.version + 1,
    }

    this.records.set(id, updated)
    return { ...updated }
  }

  async getNextSequence(tenantId: string): Promise<number> {
    const current = this.sequences.get(tenantId) || 100
    const next = current + 1
    this.sequences.set(tenantId, next)
    return next
  }

  async createAuditLog(auditLog: MedicalRecordAuditLog): Promise<void> {
    this.auditLogs.push(auditLog)
  }
}
