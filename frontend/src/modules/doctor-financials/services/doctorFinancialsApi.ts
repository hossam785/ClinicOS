import type {
  Settlement,
  DoctorFinancialAccount,
  DoctorFinancialsDashboardSummary,
  CreateSettlementDto,
  UpdateSettlementDto,
  RecordPaymentDto,
  QuerySettlementsParams,
} from '../types/doctorFinancials'

// Seed Mock Data for UI/Integration Testing
const INITIAL_SETTLEMENTS: Settlement[] = [
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
      {
        visitId: 'v-2',
        visitDate: '2026-07-05',
        patientName: 'Alice Smith',
        treatmentName: 'Dental Checkup & Cleaning',
        grossAmount: 1200,
        doctorShare: 720,
        clinicShare: 480,
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

const settlementsStore: Settlement[] = [...INITIAL_SETTLEMENTS]

export const doctorFinancialsApi = {
  async getDashboardSummary(): Promise<DoctorFinancialsDashboardSummary> {
    const totalEarningsYtd = settlementsStore.reduce((acc, s) => acc + (s.archived ? 0 : s.doctorShare), 0)
    const totalClinicShareYtd = settlementsStore.reduce((acc, s) => acc + (s.archived ? 0 : s.clinicShare), 0)
    const pendingDisbursalBalance = settlementsStore.reduce((acc, s) => acc + (s.archived ? 0 : s.outstandingBalance), 0)
    const completedVisitsMonth = settlementsStore.reduce((acc, s) => acc + (s.archived ? 0 : s.completedVisitsCount), 0)

    return {
      totalEarningsYtd,
      totalClinicShareYtd,
      pendingDisbursalBalance,
      completedVisitsMonth,
      recentPaymentsCount: settlementsStore.filter((s) => s.status === 'PAID' || s.status === 'CLOSED').length,
      recentSettlements: settlementsStore.slice(0, 5),
    }
  },

  async getAccountSummary(doctorId: string): Promise<DoctorFinancialAccount> {
    const doctorSettlements = settlementsStore.filter((s) => s.doctorId === doctorId && !s.archived)
    const totalRealizedEarnings = doctorSettlements.reduce((acc, s) => acc + s.doctorShare, 0)
    const totalDisbursedPaid = doctorSettlements.reduce((acc, s) => acc + s.amountPaid, 0)
    const unsettledBalance = doctorSettlements.reduce((acc, s) => acc + s.outstandingBalance, 0)

    return {
      doctorId,
      doctorName: doctorId === 'doc-101' ? 'Dr. Sarah Jenkins' : 'Dr. Michael Chen',
      tenantId: 'clinic-101',
      compensationModel: 'PERCENTAGE',
      compensationPercentage: 60,
      currency: 'EGP',
      totalRealizedEarnings,
      totalDisbursedPaid,
      unsettledBalance,
      lastSettlementDate: doctorSettlements[0]?.settlementPeriod.endDate || '2026-07-30',
    }
  },

  async listSettlements(params: QuerySettlementsParams = {}): Promise<{ data: Settlement[]; total: number; page: number; totalPages: number }> {
    let result = [...settlementsStore]

    if (params.doctorId) {
      result = result.filter((s) => s.doctorId === params.doctorId)
    }
    if (params.status) {
      result = result.filter((s) => s.status === params.status)
    }
    if (params.search) {
      const q = params.search.toLowerCase()
      result = result.filter((s) => s.settlementNumber.toLowerCase().includes(q) || s.doctorName.toLowerCase().includes(q))
    }

    const page = params.page || 1
    const limit = params.limit || 10
    const total = result.length
    const totalPages = Math.ceil(total / limit) || 1
    const start = (page - 1) * limit
    const data = result.slice(start, start + limit)

    return { data, total, page, totalPages }
  },

  async getSettlementById(id: string): Promise<Settlement> {
    const item = settlementsStore.find((s) => s._id === id)
    if (!item) throw new Error('Settlement record not found')
    return item
  },

  async createSettlement(dto: CreateSettlementDto): Promise<Settlement> {
    const today = new Date()
    const yearMonth = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}`
    const seq = String(settlementsStore.length + 1).padStart(5, '0')
    const settlementNumber = `STL-${yearMonth}-${seq}`

    const newDoc: Settlement = {
      _id: `stl-${Date.now()}`,
      settlementNumber,
      tenantId: 'clinic-101',
      clinicId: dto.clinicId || 'branch_main',
      doctorId: dto.doctorId,
      doctorName: dto.doctorId === 'doc-101' ? 'Dr. Sarah Jenkins' : 'Dr. Michael Chen',
      settlementPeriod: {
        startDate: dto.startDate,
        endDate: dto.endDate,
      },
      completedVisitsCount: 15,
      grossRevenue: 15000,
      doctorShare: 9000,
      clinicShare: 6000,
      amountPaid: 0,
      outstandingBalance: 9000,
      paymentMethod: 'BANK_TRANSFER',
      status: 'DRAFT',
      notes: dto.notes,
      auditInfo: {
        createdBy: 'usr-manager-1',
        createdAt: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      archived: false,
      version: 1,
    }

    settlementsStore.unshift(newDoc)
    return newDoc
  },

  async updateSettlement(id: string, dto: UpdateSettlementDto): Promise<Settlement> {
    const idx = settlementsStore.findIndex((s) => s._id === id)
    if (idx === -1) throw new Error('Settlement not found')

    const current = settlementsStore[idx]
    if (current.status !== 'DRAFT') throw new Error('Only DRAFT settlements can be updated')

    const updated: Settlement = {
      ...current,
      settlementPeriod: {
        startDate: dto.startDate || current.settlementPeriod.startDate,
        endDate: dto.endDate || current.settlementPeriod.endDate,
      },
      notes: dto.notes !== undefined ? dto.notes : current.notes,
      updatedAt: new Date().toISOString(),
      version: current.version + 1,
    }

    settlementsStore[idx] = updated
    return updated
  },

  async submitSettlement(id: string): Promise<Settlement> {
    const idx = settlementsStore.findIndex((s) => s._id === id)
    if (idx === -1) throw new Error('Settlement not found')

    const current = settlementsStore[idx]
    const updated: Settlement = {
      ...current,
      status: 'PENDING_REVIEW',
      auditInfo: {
        ...current.auditInfo,
        submittedBy: 'usr-manager-1',
        submittedAt: new Date().toISOString(),
      },
      updatedAt: new Date().toISOString(),
    }

    settlementsStore[idx] = updated
    return updated
  },

  async approveSettlement(id: string): Promise<Settlement> {
    const idx = settlementsStore.findIndex((s) => s._id === id)
    if (idx === -1) throw new Error('Settlement not found')

    const current = settlementsStore[idx]
    const updated: Settlement = {
      ...current,
      status: 'APPROVED',
      auditInfo: {
        ...current.auditInfo,
        approvedBy: 'usr-manager-1',
        approvedAt: new Date().toISOString(),
      },
      updatedAt: new Date().toISOString(),
    }

    settlementsStore[idx] = updated
    return updated
  },

  async recordPayment(id: string, dto: RecordPaymentDto): Promise<Settlement> {
    const idx = settlementsStore.findIndex((s) => s._id === id)
    if (idx === -1) throw new Error('Settlement not found')

    const current = settlementsStore[idx]
    if (dto.amountPaid > current.outstandingBalance) {
      throw new Error('Payment amount cannot exceed outstanding balance')
    }

    const newAmountPaid = current.amountPaid + dto.amountPaid
    const newOutstanding = current.doctorShare - newAmountPaid
    const isFullyPaid = newOutstanding === 0
    const newStatus = isFullyPaid ? 'CLOSED' : 'PAID'

    const paymentRec = {
      paymentId: `pmt-${Date.now()}`,
      amountPaid: dto.amountPaid,
      paymentDate: dto.paymentDate,
      paymentMethod: dto.paymentMethod,
      referenceNumber: dto.referenceNumber,
      notes: dto.notes,
      recordedBy: 'usr-manager-1',
      recordedAt: new Date().toISOString(),
    }

    const updated: Settlement = {
      ...current,
      amountPaid: newAmountPaid,
      outstandingBalance: newOutstanding,
      status: newStatus,
      paymentRecords: [...(current.paymentRecords || []), paymentRec],
      updatedAt: new Date().toISOString(),
    }

    settlementsStore[idx] = updated
    return updated
  },

  async archiveSettlement(id: string, reason: string): Promise<Settlement> {
    const idx = settlementsStore.findIndex((s) => s._id === id)
    if (idx === -1) throw new Error('Settlement not found')

    const current = settlementsStore[idx]
    const updated: Settlement = {
      ...current,
      archived: true,
      status: 'ARCHIVED',
      auditInfo: {
        ...current.auditInfo,
        archivedBy: 'usr-manager-1',
        archivedAt: new Date().toISOString(),
        archivedReason: reason,
      },
      updatedAt: new Date().toISOString(),
    }

    settlementsStore[idx] = updated
    return updated
  },

  async restoreSettlement(id: string): Promise<Settlement> {
    const idx = settlementsStore.findIndex((s) => s._id === id)
    if (idx === -1) throw new Error('Settlement not found')

    const current = settlementsStore[idx]
    const updated: Settlement = {
      ...current,
      archived: false,
      status: current.auditInfo.approvedBy ? 'APPROVED' : 'DRAFT',
      updatedAt: new Date().toISOString(),
    }

    settlementsStore[idx] = updated
    return updated
  },
}
