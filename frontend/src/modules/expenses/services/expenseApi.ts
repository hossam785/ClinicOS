import { apiClient } from '@/services/apiClient'
import type {
  Expense,
  ExpenseCategory,
  CreateExpenseDto,
  UpdateExpenseDto,
  RejectExpenseDto,
  PayExpenseDto,
  ArchiveExpenseDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  ExpenseQueryParams,
  ExpenseDashboardSummary,
} from '../types/expense'

export interface ExpenseSingleResponse {
  success: boolean
  data: Expense
  meta?: { timestamp: string }
}

export interface ExpenseListResponse {
  success: boolean
  data: Expense[]
  meta?: {
    total: number
    page: number
    limit: number
    totalPages: number
    timestamp?: string
  }
}

export interface CategoryListResponse {
  success: boolean
  data: ExpenseCategory[]
  meta?: { timestamp: string }
}

export interface CategorySingleResponse {
  success: boolean
  data: ExpenseCategory
  meta?: { timestamp: string }
}

export interface DashboardSummaryResponse {
  success: boolean
  data: ExpenseDashboardSummary
  meta?: { timestamp: string }
}

export const expenseApi = {
  // Expense operations
  getExpenses: async (params?: ExpenseQueryParams): Promise<ExpenseListResponse> => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.categoryId) searchParams.append('categoryId', params.categoryId)
    if (params?.status) searchParams.append('status', params.status)
    if (params?.paymentMethod) searchParams.append('paymentMethod', params.paymentMethod)
    if (params?.vendorName) searchParams.append('vendorName', params.vendorName)
    if (params?.startDate) searchParams.append('startDate', params.startDate)
    if (params?.endDate) searchParams.append('endDate', params.endDate)
    if (params?.minAmount !== undefined) searchParams.append('minAmount', params.minAmount.toString())
    if (params?.maxAmount !== undefined) searchParams.append('maxAmount', params.maxAmount.toString())
    if (params?.search) searchParams.append('search', params.search)
    if (params?.sortBy) searchParams.append('sortBy', params.sortBy)
    if (params?.sortOrder) searchParams.append('sortOrder', params.sortOrder)

    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : ''
    return apiClient.get<ExpenseListResponse>(`/expenses${queryString}`)
  },

  getExpenseById: async (id: string): Promise<ExpenseSingleResponse> => {
    return apiClient.get<ExpenseSingleResponse>(`/expenses/${id}`)
  },

  createExpense: async (payload: CreateExpenseDto): Promise<ExpenseSingleResponse> => {
    return apiClient.post<ExpenseSingleResponse>('/expenses', payload)
  },

  updateExpense: async (id: string, payload: UpdateExpenseDto): Promise<ExpenseSingleResponse> => {
    return apiClient.put<ExpenseSingleResponse>(`/expenses/${id}`, payload)
  },

  submitExpense: async (id: string): Promise<ExpenseSingleResponse> => {
    return apiClient.patch<ExpenseSingleResponse>(`/expenses/${id}/submit`, {})
  },

  approveExpense: async (id: string): Promise<ExpenseSingleResponse> => {
    return apiClient.patch<ExpenseSingleResponse>(`/expenses/${id}/approve`, {})
  },

  rejectExpense: async (id: string, payload: RejectExpenseDto): Promise<ExpenseSingleResponse> => {
    return apiClient.patch<ExpenseSingleResponse>(`/expenses/${id}/reject`, payload)
  },

  payExpense: async (id: string, payload: PayExpenseDto): Promise<ExpenseSingleResponse> => {
    return apiClient.patch<ExpenseSingleResponse>(`/expenses/${id}/pay`, payload)
  },

  archiveExpense: async (id: string, payload: ArchiveExpenseDto): Promise<ExpenseSingleResponse> => {
    return apiClient.patch<ExpenseSingleResponse>(`/expenses/${id}/archive`, payload)
  },

  restoreExpense: async (id: string): Promise<ExpenseSingleResponse> => {
    return apiClient.patch<ExpenseSingleResponse>(`/expenses/${id}/restore`, {})
  },

  getDashboardSummary: async (): Promise<DashboardSummaryResponse> => {
    return apiClient.get<DashboardSummaryResponse>('/expenses/dashboard-summary')
  },

  // Expense Categories operations
  getCategories: async (): Promise<CategoryListResponse> => {
    return apiClient.get<CategoryListResponse>('/expense-categories')
  },

  createCategory: async (payload: CreateCategoryDto): Promise<CategorySingleResponse> => {
    return apiClient.post<CategorySingleResponse>('/expense-categories', payload)
  },

  updateCategory: async (id: string, payload: UpdateCategoryDto): Promise<CategorySingleResponse> => {
    return apiClient.put<CategorySingleResponse>(`/expense-categories/${id}`, payload)
  },

  archiveCategory: async (id: string): Promise<CategorySingleResponse> => {
    return apiClient.patch<CategorySingleResponse>(`/expense-categories/${id}/archive`, {})
  },

  restoreCategory: async (id: string): Promise<CategorySingleResponse> => {
    return apiClient.patch<CategorySingleResponse>(`/expense-categories/${id}/restore`, {})
  },
}
