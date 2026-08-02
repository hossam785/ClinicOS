import type {
  Settlement,
  SettlementAuditLog,
  DoctorFinancialAccount,
  DoctorFinancialsDashboardSummary,
  QuerySettlementsDto,
} from '../types/doctorFinancials.types'

export interface IDoctorFinancialsRepository {
  create(settlement: Settlement): Promise<Settlement>
  findById(tenantId: string, id: string): Promise<Settlement | null>
  findByNumber(tenantId: string, settlementNumber: string): Promise<Settlement | null>
  update(tenantId: string, id: string, updates: Partial<Settlement>): Promise<Settlement | null>
  list(tenantId: string, params: QuerySettlementsDto): Promise<{ data: Settlement[]; total: number; page: number; totalPages: number }>
  getAccountSummary(tenantId: string, doctorId: string): Promise<DoctorFinancialAccount>
  getDashboardSummary(tenantId: string): Promise<DoctorFinancialsDashboardSummary>
  createAuditLog(log: SettlementAuditLog): Promise<SettlementAuditLog>
  getAuditLogs(tenantId: string, settlementId: string): Promise<SettlementAuditLog[]>
  getNextSequence(tenantId: string): Promise<number>
}

const SEED_SETTLEMENTS: Settlement[] = [
  {
    _id: 'stl-101',
    settlementNumber: 'STL-202607-00001',
    tenantId: 'clinic-101',
    clinicId: 'branch_main',
    doctorId: 'doc-101',
    doctorName: 'Dr. Sarah Jenkins',
    settlementPeriod: {
      startDate: '2026-07-01',
      endDate: '2026-07-15',
    },
    completedVisitsCount: 35,
    grossRevenue: 28000,
    doctorShare: 16800,
    clinicShare: 11200,
    amountPaid: 16800,
    outstandingBalance: 0,
    paymentMethod: 'BANK_TRANSFER',
    status: 'CLOSED',
    auditInfo: {
      createdBy: 'usr-manager-1',
      createdAt: '2026-07-16T09:00:00Z',
      approvedBy: 'usr-manager-1',
      approvedAt: '2026-07-16T10:30:00Z',
      closedBy: 'usr-manager-1',
      closedAt: '2026-07-16T14:00:00Z',
    },
    lineItems: [
      {
        visitId: 'v-1',
        visitDate: '2026-07-02',
        patientName: 'John Doe',
        treatmentName: 'General Consultation',
        grossAmount: 800,
        doctorShare: 480,
        clinicShare: 320,
      },
    ],
    paymentRecords: [
      {
        paymentId: 'pmt-1',
        amountPaid: 16800,
        paymentDate: '2026-07-16',
        paymentMethod: 'BANK_TRANSFER',
        referenceNumber: 'TRX-998201',
        notes: 'Full payment disbursed via wire transfer',
        recordedBy: 'usr-manager-1',
        recordedAt: '2026-07-16T14:00:00Z',
      },
    ],
    createdAt: '2026-07-16T09:00:00Z',
    updatedAt: '2026-07-16T14:00:00Z',
    archived: false,
    version: 1,
  },
  {
    _id: 'stl-102',
    settlementNumber: 'STL-202607-00002',
    tenantId: 'clinic-101',
    clinicId: 'branch_main',
    doctorId: 'doc-102',
    doctorName: 'Dr. Michael Chen',
    settlementPeriod: {
      startDate: '2026-07-01',
      endDate: '2026-07-15',
    },
    completedVisitsCount: 22,
    grossRevenue: 19800,
    doctorShare: 11880,
    clinicShare: 7920,
    amountPaid: 5000,
    outstandingBalance: 6880,
    paymentMethod: 'CASH',
    status: 'PAID',
    auditInfo: {
      createdBy: 'usr-manager-1',
      createdAt: '2026-07-16T09:15:00Z',
      approvedBy: 'usr-manager-1',
      approvedAt: '2026-07-16T11:00:00Z',
    },
    paymentRecords: [
      {
        paymentId: 'pmt-2',
        amountPaid: 5000,
        paymentDate: '2026-07-18',
        paymentMethod: 'CASH',
        notes: 'First cash installment paid',
        recordedBy: 'usr-manager-1',
        recordedAt: '2026-07-18T16:00:00Z',
      },
    ],
    createdAt: '2026-07-16T09:15:00Z',
    updatedAt: '2026-07-18T16:00:00Z',
    archived: false,
    version: 1,
  },
  {
    _id: 'stl-103',
    settlementNumber: 'STL-202607-00003',
    tenantId: 'clinic-101',
    clinicId: 'branch_main',
    doctorId: 'doc-101',
    doctorName: 'Dr. Sarah Jenkins',
    settlementPeriod: {
      startDate: '2026-07-16',
      endDate: '2026-07-30',
    },
    completedVisitsCount: 28,
    grossRevenue: 24500,
    doctorShare: 14700,
    clinicShare: 9800,
    amountPaid: 0,
    outstandingBalance: 14700,
    paymentMethod: 'BANK_TRANSFER',
    status: 'PENDING_REVIEW',
    auditInfo: {
      createdBy: 'usr-manager-1',
      createdAt: '2026-07-30T10:00:00Z',
      submittedBy: 'usr-manager-1',
      submittedAt: '2026-07-30T10:05:00Z',
    },
    createdAt: '2026-07-30T10:00:00Z',
    updatedAt: '2026-07-30T10:05:00Z',
    archived: false,
    version: 1,
  },
]

export class InMemoryDoctorFinancialsRepository implements IDoctorFinancialsRepository {
  private settlementsMap = new Map<string, Settlement>()
  private auditLogs: SettlementAuditLog[] = []
  private sequenceCounters = new Map<string, number>()

  constructor() {
    SEED_SETTLEMENTS.forEach((s) => this.settlementsMap.set(s._id, { ...s }))
    this.sequenceCounters.set('clinic-101', 3)
  }

  async create(settlement: Settlement): Promise<Settlement> {
    this.settlementsMap.set(settlement._id, { ...settlement })
    return { ...settlement }
  }

  async findById(tenantId: string, id: string): Promise<Settlement | null> {
    const item = this.settlementsMap.get(id)
    if (!item || item.tenantId !== tenantId) return null
    return { ...item }
  }

  async findByNumber(tenantId: string, settlementNumber: string): Promise<Settlement | null> {
    for (const item of this.settlementsMap.values()) {
      if (item.tenantId === tenantId && item.settlementNumber === settlementNumber) {
        return { ...item }
      }
    }
    return null
  }

  async update(tenantId: string, id: string, updates: Partial<Settlement>): Promise<Settlement | null> {
    const existing = this.settlementsMap.get(id)
    if (!existing || existing.tenantId !== tenantId) return null

    const updated: Settlement = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      version: existing.version + 1,
    }

    this.settlementsMap.set(id, updated)
    return { ...updated }
  }

  async list(tenantId: string, params: QuerySettlementsDto): Promise<{ data: Settlement[]; total: number; page: number; totalPages: number }> {
    let result = Array.from(this.settlementsMap.values()).filter((s) => s.tenantId === tenantId)

    if (params.doctorId) {
      result = result.filter((s) => s.doctorId === params.doctorId)
    }

    if (params.status) {
      result = result.filter((s) => s.status === params.status)
    }

    if (params.paymentMethod) {
      result = result.filter((s) => s.paymentMethod === params.paymentMethod)
    }

    if (params.search) {
      const q = params.search.toLowerCase()
      result = result.filter(
        (s) => s.settlementNumber.toLowerCase().includes(q) || s.doctorName.toLowerCase().includes(q) || (s.notes && s.notes.toLowerCase().includes(q))
      )
    }

    // Sort by createdAt desc
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const page = params.page || 1
    const limit = params.limit || 10
    const total = result.length
    const totalPages = Math.ceil(total / limit) || 1
    const start = (page - 1) * limit
    const data = result.slice(start, start + limit)

    return { data, total, page, totalPages }
  }

  async getAccountSummary(tenantId: string, doctorId: string): Promise<DoctorFinancialAccount> {
    const doctorSettlements = Array.from(this.settlementsMap.values()).filter((s) => s.tenantId === tenantId && s.doctorId === doctorId && !s.archived)

    const totalRealizedEarnings = doctorSettlements.reduce((acc, s) => acc + s.doctorShare, 0)
    const totalDisbursedPaid = doctorSettlements.reduce((acc, s) => acc + s.amountPaid, 0)
    const unsettledBalance = doctorSettlements.reduce((acc, s) => acc + s.outstandingBalance, 0)

    return {
      doctorId,
      doctorName: doctorId === 'doc-101' ? 'Dr. Sarah Jenkins' : 'Dr. Michael Chen',
      tenantId,
      compensationModel: 'PERCENTAGE',
      compensationPercentage: 60,
      currency: 'EGP',
      totalRealizedEarnings,
      totalDisbursedPaid,
      unsettledBalance,
      lastSettlementDate: doctorSettlements[0]?.settlementPeriod.endDate || '2026-07-30',
    }
  }

  async getDashboardSummary(tenantId: string): Promise<DoctorFinancialsDashboardSummary> {
    const tenantSettlements = Array.from(this.settlementsMap.values()).filter((s) => s.tenantId === tenantId && !s.archived)

    const totalEarningsYtd = tenantSettlements.reduce((acc, s) => acc + s.doctorShare, 0)
    const totalClinicShareYtd = tenantSettlements.reduce((acc, s) => acc + s.clinicShare, 0)
    const pendingDisbursalBalance = tenantSettlements.reduce((acc, s) => acc + s.outstandingBalance, 0)
    const completedVisitsMonth = tenantSettlements.reduce((acc, s) => acc + s.completedVisitsCount, 0)
    const recentPaymentsCount = tenantSettlements.filter((s) => s.status === 'PAID' || s.status === 'CLOSED').length

    return {
      totalEarningsYtd,
      totalClinicShareYtd,
      pendingDisbursalBalance,
      completedVisitsMonth,
      recentPaymentsCount,
      recentSettlements: tenantSettlements.slice(0, 5),
    }
  }

  async createAuditLog(log: SettlementAuditLog): Promise<SettlementAuditLog> {
    this.auditLogs.push(log)
    return log
  }

  async getAuditLogs(tenantId: string, settlementId: string): Promise<SettlementAuditLog[]> {
    return this.auditLogs.filter((l) => l.tenantId === tenantId && l.settlementId === settlementId)
  }

  async getNextSequence(tenantId: string): Promise<number> {
    const current = this.sequenceCounters.get(tenantId) || 0
    const next = current + 1
    this.sequenceCounters.set(tenantId, next)
    return next
  }
}
