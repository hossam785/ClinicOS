import type {
  Expense,
  ExpenseCategory,
  ExpenseAuditLog,
  QueryExpensesDto,
  ExpenseDashboardSummary,
  CategoryBreakdownItem,
} from '../types/expense.types'

export interface IExpenseRepository {
  create(expense: Expense): Promise<Expense>
  findById(tenantId: string, id: string): Promise<Expense | null>
  findByExpenseNumber(tenantId: string, expenseNumber: string): Promise<Expense | null>
  list(
    tenantId: string,
    params: QueryExpensesDto
  ): Promise<{ data: Expense[]; total: number; page: number; totalPages: number }>
  update(tenantId: string, id: string, updates: Partial<Expense>): Promise<Expense | null>
  getNextSequence(tenantId: string): Promise<number>
  createAuditLog(auditLog: ExpenseAuditLog): Promise<void>
  getAuditLogs(tenantId: string, expenseId: string): Promise<ExpenseAuditLog[]>

  // Category Management
  getCategories(tenantId: string, includeArchived?: boolean): Promise<ExpenseCategory[]>
  findCategoryById(tenantId: string, categoryId: string): Promise<ExpenseCategory | null>
  findCategoryByCode(tenantId: string, categoryCode: string): Promise<ExpenseCategory | null>
  createCategory(category: ExpenseCategory): Promise<ExpenseCategory>
  updateCategory(tenantId: string, categoryId: string, updates: Partial<ExpenseCategory>): Promise<ExpenseCategory | null>

  // Dashboard Aggregations
  getDashboardSummary(tenantId: string): Promise<ExpenseDashboardSummary>
}

export class InMemoryExpenseRepository implements IExpenseRepository {
  private expenses: Map<string, Expense> = new Map()
  private categories: Map<string, ExpenseCategory> = new Map()
  private auditLogs: ExpenseAuditLog[] = []
  private sequences: Map<string, number> = new Map()

  constructor() {
    this.seedInitialData()
  }

  private seedInitialData(): void {
    const now = new Date().toISOString()

    // 1. Seed System Preset Categories
    const seedCategories: ExpenseCategory[] = [
      {
        _id: 'cat-rent-01',
        tenantId: 'clinic-101',
        clinicId: 'clinic-branch-01',
        categoryName: 'Facility Rent & Lease',
        categoryCode: 'CAT-RENT',
        description: 'Monthly physical clinic premise rental and real estate lease payments.',
        color: '#2563EB',
        icon: 'Building',
        isSystem: true,
        isActive: true,
        sortOrder: 1,
        createdAt: now,
        updatedAt: now,
        archived: false,
        version: 1,
      },
      {
        _id: 'cat-salaries-01',
        tenantId: 'clinic-101',
        clinicId: 'clinic-branch-01',
        categoryName: 'Payroll & Staff Salaries',
        categoryCode: 'CAT-SALARIES',
        description: 'Physician stipends, nurse salaries, administrative staff wages, and bonuses.',
        color: '#059669',
        icon: 'Users',
        isSystem: true,
        isActive: true,
        sortOrder: 2,
        createdAt: now,
        updatedAt: now,
        archived: false,
        version: 1,
      },
      {
        _id: 'cat-medsup-01',
        tenantId: 'clinic-101',
        clinicId: 'clinic-branch-01',
        categoryName: 'Medical & Pharmaceutical Supplies',
        categoryCode: 'CAT-MEDSUP',
        description: 'Syringes, surgical gloves, PPE, pharmaceuticals, diagnostic kits, and medical consumables.',
        color: '#D97706',
        icon: 'Pill',
        isSystem: true,
        isActive: true,
        sortOrder: 3,
        createdAt: now,
        updatedAt: now,
        archived: false,
        version: 1,
      },
      {
        _id: 'cat-utilities-01',
        tenantId: 'clinic-101',
        clinicId: 'clinic-branch-01',
        categoryName: 'Utilities & Communication',
        categoryCode: 'CAT-UTILITIES',
        description: 'Electricity, water, high-speed fiber internet, telephony, and medical waste disposal.',
        color: '#7C3AED',
        icon: 'Zap',
        isSystem: true,
        isActive: true,
        sortOrder: 4,
        createdAt: now,
        updatedAt: now,
        archived: false,
        version: 1,
      },
      {
        _id: 'cat-maint-01',
        tenantId: 'clinic-101',
        clinicId: 'clinic-branch-01',
        categoryName: 'Equipment Repair & Maintenance',
        categoryCode: 'CAT-MAINT',
        description: 'Calibration, servicing, and emergency repairs of medical diagnostic devices.',
        color: '#DC2626',
        icon: 'Wrench',
        isSystem: true,
        isActive: true,
        sortOrder: 5,
        createdAt: now,
        updatedAt: now,
        archived: false,
        version: 1,
      },
    ]

    for (const cat of seedCategories) {
      this.categories.set(cat._id, cat)
    }

    // 2. Seed Initial Expenses
    const seedExpenses: Expense[] = [
      {
        _id: 'exp-101',
        expenseNumber: 'EXP-202607-00101',
        tenantId: 'clinic-101',
        clinicId: 'clinic-branch-01',
        categoryId: 'cat-medsup-01',
        categoryName: 'Medical & Pharmaceutical Supplies',
        title: 'Monthly Medical Supplies Order',
        description: 'Surgical gloves, sterile syringes, diagnostic reagents, and PPE kits.',
        amount: 1450.5,
        currency: 'USD',
        expenseDate: '2026-07-28',
        paymentDate: '2026-07-28',
        paymentMethod: 'BANK_TRANSFER',
        vendorName: 'Apex Medical Distributors Ltd.',
        vendorTaxId: 'TAX-998201-US',
        notes: 'Approved for quarterly volume discount.',
        status: 'PAID',
        auditInfo: {
          createdBy: 'usr-receptionist-1',
          createdAt: '2026-07-28T09:00:00.000Z',
          submittedAt: '2026-07-28T09:30:00.000Z',
          approvedBy: 'usr-manager-1',
          approvedAt: '2026-07-28T10:15:00.000Z',
          paidBy: 'usr-manager-1',
          paidAt: '2026-07-28T11:00:00.000Z',
        },
        createdAt: '2026-07-28T09:00:00.000Z',
        updatedAt: '2026-07-28T11:00:00.000Z',
        archived: false,
        version: 3,
      },
      {
        _id: 'exp-102',
        expenseNumber: 'EXP-202607-00102',
        tenantId: 'clinic-101',
        clinicId: 'clinic-branch-01',
        categoryId: 'cat-rent-01',
        categoryName: 'Facility Rent & Lease',
        title: 'July Building Premises Lease Payment',
        description: 'Monthly physical premises rent payment for Main Medical Center.',
        amount: 3200.0,
        currency: 'USD',
        expenseDate: '2026-07-29',
        paymentMethod: 'BANK_TRANSFER',
        vendorName: 'Horizon Commercial Real Estate',
        notes: 'Pending final review by clinic manager before bank transfer execution.',
        status: 'PENDING_APPROVAL',
        auditInfo: {
          createdBy: 'usr-receptionist-1',
          createdAt: '2026-07-29T14:00:00.000Z',
          submittedAt: '2026-07-29T14:30:00.000Z',
        },
        createdAt: '2026-07-29T14:00:00.000Z',
        updatedAt: '2026-07-29T14:30:00.000Z',
        archived: false,
        version: 2,
      },
      {
        _id: 'exp-103',
        expenseNumber: 'EXP-202607-00103',
        tenantId: 'clinic-101',
        clinicId: 'clinic-branch-01',
        categoryId: 'cat-utilities-01',
        categoryName: 'Utilities & Communication',
        title: 'High-Speed Fiber & Telephony Bill',
        description: 'Monthly dedicated fiber optic internet and VoIP phone service bill.',
        amount: 380.0,
        currency: 'USD',
        expenseDate: '2026-07-30',
        paymentMethod: 'CREDIT_CARD',
        vendorName: 'Global Telecom Corp',
        status: 'DRAFT',
        auditInfo: {
          createdBy: 'usr-receptionist-1',
          createdAt: '2026-07-30T08:00:00.000Z',
        },
        createdAt: '2026-07-30T08:00:00.000Z',
        updatedAt: '2026-07-30T08:00:00.000Z',
        archived: false,
        version: 1,
      },
    ]

    for (const exp of seedExpenses) {
      this.expenses.set(exp._id, exp)
    }

    this.sequences.set('clinic-101', 103)
  }

  async create(expense: Expense): Promise<Expense> {
    this.expenses.set(expense._id, expense)
    return { ...expense }
  }

  async findById(tenantId: string, id: string): Promise<Expense | null> {
    const expense = this.expenses.get(id)
    if (!expense || expense.tenantId !== tenantId) {
      return null
    }
    return { ...expense }
  }

  async findByExpenseNumber(tenantId: string, expenseNumber: string): Promise<Expense | null> {
    for (const exp of this.expenses.values()) {
      if (exp.tenantId === tenantId && exp.expenseNumber === expenseNumber) {
        return { ...exp }
      }
    }
    return null
  }

  async list(
    tenantId: string,
    params: QueryExpensesDto
  ): Promise<{ data: Expense[]; total: number; page: number; totalPages: number }> {
    let results = Array.from(this.expenses.values()).filter((exp) => exp.tenantId === tenantId)

    if (params.categoryId) {
      results = results.filter((exp) => exp.categoryId === params.categoryId)
    }

    if (params.status) {
      results = results.filter((exp) => exp.status === params.status)
    } else {
      // By default, exclude soft-deleted ARCHIVED expenses unless explicitly requested or status filter used
      results = results.filter((exp) => !exp.archived)
    }

    if (params.paymentMethod) {
      results = results.filter((exp) => exp.paymentMethod === params.paymentMethod)
    }

    if (params.vendorName) {
      const vName = params.vendorName.toLowerCase()
      results = results.filter((exp) => exp.vendorName?.toLowerCase().includes(vName))
    }

    if (params.startDate) {
      results = results.filter((exp) => exp.expenseDate >= params.startDate!)
    }

    if (params.endDate) {
      results = results.filter((exp) => exp.expenseDate <= params.endDate!)
    }

    if (params.minAmount !== undefined) {
      results = results.filter((exp) => exp.amount >= params.minAmount!)
    }

    if (params.maxAmount !== undefined) {
      results = results.filter((exp) => exp.amount <= params.maxAmount!)
    }

    if (params.search) {
      const query = params.search.toLowerCase()
      results = results.filter(
        (exp) =>
          exp.expenseNumber.toLowerCase().includes(query) ||
          exp.title.toLowerCase().includes(query) ||
          exp.categoryName.toLowerCase().includes(query) ||
          (exp.vendorName && exp.vendorName.toLowerCase().includes(query)) ||
          (exp.description && exp.description.toLowerCase().includes(query))
      )
    }

    // Sort newest expenseDate first
    results.sort((a, b) => b.expenseDate.localeCompare(a.expenseDate))

    const total = results.length
    const page = params.page || 1
    const limit = params.limit || 10
    const totalPages = Math.ceil(total / limit) || 1
    const startIndex = (page - 1) * limit
    const paginatedData = results.slice(startIndex, startIndex + limit)

    return {
      data: paginatedData,
      total,
      page,
      totalPages,
    }
  }

  async update(tenantId: string, id: string, updates: Partial<Expense>): Promise<Expense | null> {
    const existing = this.expenses.get(id)
    if (!existing || existing.tenantId !== tenantId) {
      return null
    }

    const updated: Expense = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      version: existing.version + 1,
    }

    this.expenses.set(id, updated)
    return { ...updated }
  }

  async getNextSequence(tenantId: string): Promise<number> {
    const current = this.sequences.get(tenantId) || 100
    const next = current + 1
    this.sequences.set(tenantId, next)
    return next
  }

  async createAuditLog(auditLog: ExpenseAuditLog): Promise<void> {
    this.auditLogs.push(auditLog)
  }

  async getAuditLogs(tenantId: string, expenseId: string): Promise<ExpenseAuditLog[]> {
    return this.auditLogs.filter((log) => log.tenantId === tenantId && log.expenseId === expenseId)
  }

  async getCategories(tenantId: string, includeArchived = false): Promise<ExpenseCategory[]> {
    const cats = Array.from(this.categories.values()).filter((c) => c.tenantId === tenantId)
    if (!includeArchived) {
      return cats.filter((c) => !c.archived)
    }
    return cats
  }

  async findCategoryById(tenantId: string, categoryId: string): Promise<ExpenseCategory | null> {
    const cat = this.categories.get(categoryId)
    if (!cat || cat.tenantId !== tenantId) {
      return null
    }
    return { ...cat }
  }

  async findCategoryByCode(tenantId: string, categoryCode: string): Promise<ExpenseCategory | null> {
    for (const cat of this.categories.values()) {
      if (cat.tenantId === tenantId && cat.categoryCode === categoryCode) {
        return { ...cat }
      }
    }
    return null
  }

  async createCategory(category: ExpenseCategory): Promise<ExpenseCategory> {
    this.categories.set(category._id, category)
    return { ...category }
  }

  async updateCategory(
    tenantId: string,
    categoryId: string,
    updates: Partial<ExpenseCategory>
  ): Promise<ExpenseCategory | null> {
    const existing = this.categories.get(categoryId)
    if (!existing || existing.tenantId !== tenantId) {
      return null
    }

    const updated: ExpenseCategory = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      version: existing.version + 1,
    }

    this.categories.set(categoryId, updated)
    return { ...updated }
  }

  async getDashboardSummary(tenantId: string): Promise<ExpenseDashboardSummary> {
    const tenantExpenses = Array.from(this.expenses.values()).filter(
      (e) => e.tenantId === tenantId && !e.archived
    )

    let totalExpenseAmountMonth = 0
    let paidExpenseAmountMonth = 0
    let pendingApprovalAmount = 0
    let pendingApprovalCount = 0
    let draftCount = 0
    let rejectedCount = 0

    const categoryMap: Map<string, { name: string; amount: number; color?: string }> = new Map()

    for (const exp of tenantExpenses) {
      if (exp.status === 'PAID') {
        paidExpenseAmountMonth += exp.amount
        totalExpenseAmountMonth += exp.amount

        const existingCat = categoryMap.get(exp.categoryId)
        const catObj = this.categories.get(exp.categoryId)
        if (existingCat) {
          existingCat.amount += exp.amount
        } else {
          categoryMap.set(exp.categoryId, {
            name: exp.categoryName,
            amount: exp.amount,
            color: catObj?.color || '#2563EB',
          })
        }
      } else if (exp.status === 'PENDING_APPROVAL') {
        pendingApprovalAmount += exp.amount
        pendingApprovalCount++
        totalExpenseAmountMonth += exp.amount
      } else if (exp.status === 'APPROVED') {
        totalExpenseAmountMonth += exp.amount
      } else if (exp.status === 'DRAFT') {
        draftCount++
      } else if (exp.status === 'REJECTED') {
        rejectedCount++
      }
    }

    const categoryBreakdown: CategoryBreakdownItem[] = Array.from(categoryMap.entries()).map(
      ([catId, val]) => ({
        categoryId: catId,
        categoryName: val.name,
        amount: val.amount,
        percentage: totalExpenseAmountMonth > 0 ? (val.amount / totalExpenseAmountMonth) * 100 : 0,
        color: val.color,
      })
    )

    const recentExpenses = tenantExpenses
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 5)

    return {
      totalExpenseAmountMonth,
      paidExpenseAmountMonth,
      pendingApprovalAmount,
      pendingApprovalCount,
      draftCount,
      rejectedCount,
      categoryBreakdown,
      recentExpenses,
    }
  }
}
