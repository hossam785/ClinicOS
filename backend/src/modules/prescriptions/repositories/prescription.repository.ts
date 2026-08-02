import type {
  Prescription,
  PrescriptionAuditLog,
  QueryPrescriptionsDto,
} from '../types/prescription.types'

export interface IPrescriptionRepository {
  create(prescription: Prescription): Promise<Prescription>
  findById(tenantId: string, id: string): Promise<Prescription | null>
  findByPrescriptionNumber(tenantId: string, rxNumber: string): Promise<Prescription | null>
  list(tenantId: string, params: QueryPrescriptionsDto): Promise<{ data: Prescription[]; total: number; page: number; totalPages: number }>
  getPatientHistory(tenantId: string, patientId: string, includeArchived?: boolean): Promise<Prescription[]>
  getMedicalRecordPrescriptions(tenantId: string, recordId: string): Promise<Prescription[]>
  update(tenantId: string, id: string, updates: Partial<Prescription>): Promise<Prescription | null>
  getNextSequence(tenantId: string): Promise<number>
  createAuditLog(auditLog: PrescriptionAuditLog): Promise<void>
}

export class InMemoryPrescriptionRepository implements IPrescriptionRepository {
  private prescriptions: Map<string, Prescription> = new Map()
  private auditLogs: PrescriptionAuditLog[] = []
  private sequences: Map<string, number> = new Map()

  constructor() {
    this.seedInitialData()
  }

  private seedInitialData(): void {
    const seedRx1: Prescription = {
      _id: 'rx-101',
      prescriptionNumber: 'RX-202607-00101',
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
      doctorLicenseNumber: 'MD-LIC-88210',
      appointmentId: 'apt-101',
      medicalRecordId: 'emr-101',
      status: 'FINALIZED',
      visitDate: '2026-07-30',
      diagnosisSummary: 'Essential Primary Hypertension & Hyperlipidemia',
      clinicalNotes: 'Avoid alcohol and take medications regularly with meals.',
      followUpAdvice: 'Return to clinic in 4 weeks for follow-up blood pressure check.',
      medications: [
        {
          id: 'med-101',
          medicineName: 'Amlodipine Besylate',
          strength: '5 mg',
          dosageForm: 'Tablet',
          dosage: '1 Tablet',
          frequency: 'Once daily (QD)',
          duration: '30 Days',
          quantity: '30 Tablets',
          instructions: 'Take in the morning with a glass of water.',
        },
        {
          id: 'med-102',
          medicineName: 'Atorvastatin Calcium',
          strength: '20 mg',
          dosageForm: 'Tablet',
          dosage: '1 Tablet',
          frequency: 'Once daily before bedtime (QHS)',
          duration: '30 Days',
          quantity: '30 Tablets',
          instructions: 'Take at night.',
        },
      ],
      printInfo: {
        printCount: 1,
        lastPrintedAt: '2026-07-30T10:15:00.000Z',
        lastPrintedBy: 'doc-101',
        exportedPdfCount: 0,
        printHistory: [
          {
            actionType: 'PRINT_DIRECT',
            printedBy: 'doc-101',
            printedAt: '2026-07-30T10:15:00.000Z',
          },
        ],
      },
      auditInfo: {
        createdBy: 'doc-101',
        createdAt: '2026-07-30T09:30:00.000Z',
        updatedBy: 'doc-101',
        updatedAt: '2026-07-30T10:00:00.000Z',
        finalizedBy: 'doc-101',
        finalizedAt: '2026-07-30T10:00:00.000Z',
      },
      archived: false,
      version: 2,
    }

    const seedRx2: Prescription = {
      _id: 'rx-102',
      prescriptionNumber: 'RX-202607-00102',
      tenantId: 'clinic-101',
      clinicId: 'clinic-branch-01',
      patientId: 'pat-102',
      patientName: 'Marcus Aurelius',
      patientCode: 'PAT-202607-00102',
      patientAge: 45,
      patientGender: 'Male',
      doctorId: 'doc-101',
      doctorName: 'Dr. Sarah Jenkins',
      doctorSpecialty: 'Cardiology',
      doctorLicenseNumber: 'MD-LIC-88210',
      appointmentId: 'apt-102',
      medicalRecordId: 'emr-102',
      status: 'DRAFT',
      visitDate: '2026-07-30',
      diagnosisSummary: 'Acute Bronchitis',
      clinicalNotes: 'Rest and remain hydrated.',
      followUpAdvice: 'Return if fever persists over 38.5 C.',
      medications: [
        {
          id: 'med-201',
          medicineName: 'Amoxicillin / Clavulanic Acid',
          strength: '500 mg / 125 mg',
          dosageForm: 'Tablet',
          dosage: '1 Tablet',
          frequency: 'Three times daily (TID)',
          duration: '7 Days',
          quantity: '21 Tablets',
          instructions: 'Take after meals.',
        },
      ],
      printInfo: {
        printCount: 0,
        exportedPdfCount: 0,
        printHistory: [],
      },
      auditInfo: {
        createdBy: 'doc-101',
        createdAt: '2026-07-30T11:00:00.000Z',
        updatedBy: 'doc-101',
        updatedAt: '2026-07-30T11:00:00.000Z',
      },
      archived: false,
      version: 1,
    }

    this.prescriptions.set(seedRx1._id, seedRx1)
    this.prescriptions.set(seedRx2._id, seedRx2)
    this.sequences.set('clinic-101', 102)
  }

  async create(prescription: Prescription): Promise<Prescription> {
    this.prescriptions.set(prescription._id, { ...prescription })
    return { ...prescription }
  }

  async findById(tenantId: string, id: string): Promise<Prescription | null> {
    const rx = this.prescriptions.get(id)
    if (!rx || rx.tenantId !== tenantId) {
      return null
    }
    return { ...rx }
  }

  async findByPrescriptionNumber(tenantId: string, rxNumber: string): Promise<Prescription | null> {
    for (const rx of this.prescriptions.values()) {
      if (rx.tenantId === tenantId && rx.prescriptionNumber === rxNumber) {
        return { ...rx }
      }
    }
    return null
  }

  async list(tenantId: string, params: QueryPrescriptionsDto): Promise<{ data: Prescription[]; total: number; page: number; totalPages: number }> {
    const page = params.page && params.page > 0 ? Number(params.page) : 1
    const limit = params.limit && params.limit > 0 ? Number(params.limit) : 20

    let list = Array.from(this.prescriptions.values()).filter((rx) => rx.tenantId === tenantId)

    if (params.patientId) {
      list = list.filter((rx) => rx.patientId === params.patientId)
    }

    if (params.doctorId) {
      list = list.filter((rx) => rx.doctorId === params.doctorId)
    }

    if (params.status) {
      list = list.filter((rx) => rx.status === params.status)
    }

    if (params.startDate) {
      list = list.filter((rx) => rx.visitDate >= params.startDate!)
    }

    if (params.endDate) {
      list = list.filter((rx) => rx.visitDate <= params.endDate!)
    }

    if (params.prescriptionNumber) {
      list = list.filter((rx) => rx.prescriptionNumber === params.prescriptionNumber)
    }

    if (params.medicineName) {
      const medQuery = params.medicineName.toLowerCase()
      list = list.filter((rx) => rx.medications.some((m) => m.medicineName.toLowerCase().includes(medQuery)))
    }

    if (params.search) {
      const q = params.search.toLowerCase()
      list = list.filter(
        (rx) =>
          rx.prescriptionNumber.toLowerCase().includes(q) ||
          (rx.patientName && rx.patientName.toLowerCase().includes(q)) ||
          (rx.patientCode && rx.patientCode.toLowerCase().includes(q)) ||
          (rx.diagnosisSummary && rx.diagnosisSummary.toLowerCase().includes(q))
      )
    }

    // Sort descending by creation / visit date
    list.sort((a, b) => b.auditInfo.createdAt.localeCompare(a.auditInfo.createdAt))

    const total = list.length
    const totalPages = Math.ceil(total / limit) || 1
    const startIndex = (page - 1) * limit
    const paginatedData = list.slice(startIndex, startIndex + limit)

    return {
      data: paginatedData,
      total,
      page,
      totalPages,
    }
  }

  async getPatientHistory(tenantId: string, patientId: string, includeArchived = false): Promise<Prescription[]> {
    const list = Array.from(this.prescriptions.values()).filter((rx) => {
      if (rx.tenantId !== tenantId || rx.patientId !== patientId) return false
      if (!includeArchived && rx.archived) return false
      return true
    })

    list.sort((a, b) => b.visitDate.localeCompare(a.visitDate))
    return list
  }

  async getMedicalRecordPrescriptions(tenantId: string, recordId: string): Promise<Prescription[]> {
    const list = Array.from(this.prescriptions.values()).filter(
      (rx) => rx.tenantId === tenantId && rx.medicalRecordId === recordId
    )
    list.sort((a, b) => b.auditInfo.createdAt.localeCompare(a.auditInfo.createdAt))
    return list
  }

  async update(tenantId: string, id: string, updates: Partial<Prescription>): Promise<Prescription | null> {
    const existing = this.prescriptions.get(id)
    if (!existing || existing.tenantId !== tenantId) {
      return null
    }

    const updated: Prescription = {
      ...existing,
      ...updates,
      version: existing.version + 1,
    }

    this.prescriptions.set(id, updated)
    return { ...updated }
  }

  async getNextSequence(tenantId: string): Promise<number> {
    const current = this.sequences.get(tenantId) || 100
    const next = current + 1
    this.sequences.set(tenantId, next)
    return next
  }

  async createAuditLog(auditLog: PrescriptionAuditLog): Promise<void> {
    this.auditLogs.push(auditLog)
  }
}
