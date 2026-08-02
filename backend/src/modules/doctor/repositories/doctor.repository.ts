import type { DoctorProfile, DoctorLeave, DoctorAuditLog } from '../types/doctor.types'

export interface IDoctorRepository {
  findByTenant(tenantId: string, status?: string, search?: string): Promise<DoctorProfile[]>
  findById(tenantId: string, doctorId: string): Promise<DoctorProfile | null>
  findByLicenseNumber(licenseNumber: string): Promise<DoctorProfile | null>
  findByEmail(email: string): Promise<DoctorProfile | null>
  save(doctor: DoctorProfile): Promise<DoctorProfile>
  saveLeave(tenantId: string, doctorId: string, leave: DoctorLeave): Promise<DoctorLeave>
  deleteLeave(tenantId: string, doctorId: string, leaveId: string): Promise<boolean>
  getLeaves(tenantId: string, doctorId: string): Promise<DoctorLeave[]>
  addAuditLog(audit: DoctorAuditLog): Promise<void>
}

export class InMemoryDoctorRepository implements IDoctorRepository {
  private doctors: Map<string, DoctorProfile> = new Map()
  private leaves: Map<string, DoctorLeave[]> = new Map() // Key: tenantId:doctorId
  private auditLogs: DoctorAuditLog[] = []

  constructor() {
    this.seedInitialData()
  }

  private seedInitialData() {
    const defaultShifts = [
      { dayOfWeek: 'Monday', isOpen: true, shiftStart: '09:00', shiftEnd: '17:00', hasLunchBreak: true, lunchStart: '13:00', lunchEnd: '14:00' },
      { dayOfWeek: 'Tuesday', isOpen: true, shiftStart: '09:00', shiftEnd: '17:00', hasLunchBreak: true, lunchStart: '13:00', lunchEnd: '14:00' },
      { dayOfWeek: 'Wednesday', isOpen: true, shiftStart: '09:00', shiftEnd: '17:00', hasLunchBreak: true, lunchStart: '13:00', lunchEnd: '14:00' },
      { dayOfWeek: 'Thursday', isOpen: true, shiftStart: '09:00', shiftEnd: '17:00', hasLunchBreak: true, lunchStart: '13:00', lunchEnd: '14:00' },
      { dayOfWeek: 'Friday', isOpen: true, shiftStart: '09:00', shiftEnd: '13:00', hasLunchBreak: false },
      { dayOfWeek: 'Saturday', isOpen: false, shiftStart: '09:00', shiftEnd: '17:00', hasLunchBreak: false },
      { dayOfWeek: 'Sunday', isOpen: false, shiftStart: '09:00', shiftEnd: '17:00', hasLunchBreak: false },
    ] as const

    const doc1: DoctorProfile = {
      id: 'doc-101',
      tenantId: 'clinic-101',
      legalName: 'Sarah Elizabeth Jenkins',
      medicalTitle: 'Dr.',
      gender: 'female',
      nationalId: 'NAT-9901827',
      medicalLicenseNumber: 'LIC-NY-88902',
      licenseIssuingAuthority: 'New York State Medical Board',
      licenseExpirationDate: '2027-12-31',
      primarySpecialty: 'Cardiology',
      subSpecialties: ['Echocardiography', 'Interventional Cardiology'],
      department: 'Cardiovascular Health',
      primaryEmail: 's.jenkins@hopewellness.com',
      primaryPhone: '+1 (555) 345-6789',
      consultationFee: 150,
      currency: 'USD',
      defaultConsultationDuration: 30,
      biography: 'Board-certified cardiologist with over 12 years of clinical experience.',
      status: 'ACTIVE',
      shifts: [...defaultShifts],
      createdAt: '2026-02-01T09:00:00Z',
      updatedAt: '2026-07-15T11:00:00Z',
    }

    const doc2: DoctorProfile = {
      id: 'doc-102',
      tenantId: 'clinic-101',
      legalName: 'Marcus Aurelius Vance',
      medicalTitle: 'Prof.',
      gender: 'male',
      nationalId: 'NAT-4401928',
      medicalLicenseNumber: 'LIC-NY-44109',
      licenseIssuingAuthority: 'New York State Medical Board',
      licenseExpirationDate: '2026-11-30',
      primarySpecialty: 'Pediatrics',
      subSpecialties: ['Pediatric Pulmonology'],
      department: 'Pediatrics',
      primaryEmail: 'm.vance@hopewellness.com',
      primaryPhone: '+1 (555) 987-1234',
      consultationFee: 120,
      currency: 'USD',
      defaultConsultationDuration: 20,
      biography: 'Senior pediatrician specializing in respiratory disorders.',
      status: 'PENDING_VERIFICATION',
      shifts: [...defaultShifts],
      createdAt: '2026-07-25T14:20:00Z',
      updatedAt: '2026-07-25T14:20:00Z',
    }

    this.doctors.set(doc1.id, doc1)
    this.doctors.set(doc2.id, doc2)

    this.leaves.set('clinic-101:doc-101', [
      { id: 'leave-1', date: '2026-11-26', name: 'Annual Medical Conference', reason: 'Attending Cardiology Summit' },
    ])
  }

  async findByTenant(tenantId: string, status?: string, search?: string): Promise<DoctorProfile[]> {
    let result = Array.from(this.doctors.values()).filter((d) => d.tenantId === tenantId)

    if (status && status !== 'ALL') {
      result = result.filter((d) => d.status === status)
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(
        (d) =>
          d.legalName.toLowerCase().includes(q) ||
          d.medicalLicenseNumber.toLowerCase().includes(q) ||
          d.primaryEmail.toLowerCase().includes(q)
      )
    }

    return result
  }

  async findById(tenantId: string, doctorId: string): Promise<DoctorProfile | null> {
    const doctor = this.doctors.get(doctorId)
    if (!doctor || doctor.tenantId !== tenantId) return null
    return { ...doctor }
  }

  async findByLicenseNumber(licenseNumber: string): Promise<DoctorProfile | null> {
    for (const doc of this.doctors.values()) {
      if (doc.medicalLicenseNumber.toLowerCase() === licenseNumber.toLowerCase()) {
        return { ...doc }
      }
    }
    return null
  }

  async findByEmail(email: string): Promise<DoctorProfile | null> {
    for (const doc of this.doctors.values()) {
      if (doc.primaryEmail.toLowerCase() === email.toLowerCase()) {
        return { ...doc }
      }
    }
    return null
  }

  async save(doctor: DoctorProfile): Promise<DoctorProfile> {
    this.doctors.set(doctor.id, { ...doctor, updatedAt: new Date().toISOString() })
    return { ...this.doctors.get(doctor.id)! }
  }

  async saveLeave(tenantId: string, doctorId: string, leave: DoctorLeave): Promise<DoctorLeave> {
    const key = `${tenantId}:${doctorId}`
    const existing = this.leaves.get(key) || []
    const updated = [...existing, leave]
    this.leaves.set(key, updated)
    return leave
  }

  async deleteLeave(tenantId: string, doctorId: string, leaveId: string): Promise<boolean> {
    const key = `${tenantId}:${doctorId}`
    const existing = this.leaves.get(key) || []
    const filtered = existing.filter((l) => l.id !== leaveId)
    if (filtered.length === existing.length) return false
    this.leaves.set(key, filtered)
    return true
  }

  async getLeaves(tenantId: string, doctorId: string): Promise<DoctorLeave[]> {
    const key = `${tenantId}:${doctorId}`
    return this.leaves.get(key) || []
  }

  async addAuditLog(audit: DoctorAuditLog): Promise<void> {
    this.auditLogs.push(audit)
  }
}
