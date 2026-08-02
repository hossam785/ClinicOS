import { useState, useCallback, useEffect } from 'react'
import type {
  Expense,
  ExpenseCategory,
  ExpenseQueryParams,
  PayExpenseDto,
  RejectExpenseDto,
  ArchiveExpenseDto,
} from '../types/expense'
import { expenseApi } from '../services/expenseApi'

export function useExpenses(initialParams?: ExpenseQueryParams) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categories, setCategories] = useState<ExpenseCategory[]>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(initialParams?.page || 1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const [queryParams, setQueryParams] = useState<ExpenseQueryParams>({
    page: 1,
    limit: 10,
    ...initialParams,
  })

  const fetchExpenses = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await expenseApi.getExpenses(queryParams)
      if (res.success && Array.isArray(res.data)) {
        setExpenses(res.data)
        setTotalCount(res.meta?.total || res.data.length)
        setTotalPages(res.meta?.totalPages || 1)
        if (res.meta?.page) setCurrentPage(res.meta.page)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch expenses directory'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [queryParams])

  const fetchCategories = useCallback(async () => {
    try {
      const res = await expenseApi.getCategories()
      if (res.success && Array.isArray(res.data)) {
        setCategories(res.data)
      }
    } catch {
      // Ignore background category load errors
    }
  }, [])

  useEffect(() => {
    fetchExpenses()
  }, [fetchExpenses])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const updateFilters = useCallback((newParams: Partial<ExpenseQueryParams>) => {
    setQueryParams((prev) => ({
      ...prev,
      ...newParams,
      page: newParams.page !== undefined ? newParams.page : 1, // Reset to page 1 on filter change
    }))
  }, [])

  const submitExpense = useCallback(
    async (id: string) => {
      setIsLoading(true)
      try {
        const res = await expenseApi.submitExpense(id)
        if (res.success) {
          await fetchExpenses()
          return res.data
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to submit expense for approval'
        setError(msg)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [fetchExpenses]
  )

  const approveExpense = useCallback(
    async (id: string) => {
      setIsLoading(true)
      try {
        const res = await expenseApi.approveExpense(id)
        if (res.success) {
          await fetchExpenses()
          return res.data
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to approve expense'
        setError(msg)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [fetchExpenses]
  )

  const rejectExpense = useCallback(
    async (id: string, payload: RejectExpenseDto) => {
      setIsLoading(true)
      try {
        const res = await expenseApi.rejectExpense(id, payload)
        if (res.success) {
          await fetchExpenses()
          return res.data
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to reject expense'
        setError(msg)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [fetchExpenses]
  )

  const payExpense = useCallback(
    async (id: string, payload: PayExpenseDto) => {
      setIsLoading(true)
      try {
        const res = await expenseApi.payExpense(id, payload)
        if (res.success) {
          await fetchExpenses()
          return res.data
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to mark expense as paid'
        setError(msg)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [fetchExpenses]
  )

  const archiveExpense = useCallback(
    async (id: string, payload: ArchiveExpenseDto) => {
      setIsLoading(true)
      try {
        const res = await expenseApi.archiveExpense(id, payload)
        if (res.success) {
          await fetchExpenses()
          return res.data
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to archive expense'
        setError(msg)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [fetchExpenses]
  )

  const restoreExpense = useCallback(
    async (id: string) => {
      setIsLoading(true)
      try {
        const res = await expenseApi.restoreExpense(id)
        if (res.success) {
          await fetchExpenses()
          return res.data
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to restore expense'
        setError(msg)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [fetchExpenses]
  )

  return {
    expenses,
    categories,
    totalCount,
    currentPage,
    totalPages,
    isLoading,
    error,
    queryParams,
    updateFilters,
    refetch: fetchExpenses,
    submitExpense,
    approveExpense,
    rejectExpense,
    payExpense,
    archiveExpense,
    restoreExpense,
  }
}
