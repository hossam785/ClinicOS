import { useState, useEffect, useCallback } from 'react'
import { doctorFinancialsApi } from '../services/doctorFinancialsApi'
import type {
  Settlement,
  DoctorFinancialAccount,
  DoctorFinancialsDashboardSummary,
  CreateSettlementDto,
  RecordPaymentDto,
  QuerySettlementsParams,
} from '../types/doctorFinancials'

export function useDoctorFinancialsDashboard() {
  const [summary, setSummary] = useState<DoctorFinancialsDashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSummary = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await doctorFinancialsApi.getDashboardSummary()
      setSummary(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch financial dashboard summary')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSummary()
  }, [fetchSummary])

  return { summary, loading, error, refresh: fetchSummary }
}

export function useDoctorFinancialsList(params: QuerySettlementsParams = {}) {
  const [settlements, setSettlements] = useState<Settlement[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(params.page || 1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchList = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await doctorFinancialsApi.listSettlements({ ...params, page })
      setSettlements(res.data)
      setTotal(res.total)
      setTotalPages(res.totalPages)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to list doctor settlements')
    } finally {
      setLoading(false)
    }
  }, [params, page])

  useEffect(() => {
    fetchList()
  }, [fetchList])

  return { settlements, total, page, totalPages, setPage, loading, error, refresh: fetchList }
}

export function useDoctorFinancialDetails(id?: string) {
  const [settlement, setSettlement] = useState<Settlement | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDetails = useCallback(async () => {
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const data = await doctorFinancialsApi.getSettlementById(id)
      setSettlement(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch settlement details')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchDetails()
  }, [fetchDetails])

  return { settlement, loading, error, refresh: fetchDetails }
}

export function useDoctorFinancialAccountSummary(doctorId: string) {
  const [account, setAccount] = useState<DoctorFinancialAccount | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAccount = useCallback(async () => {
    if (!doctorId) return
    setLoading(true)
    setError(null)
    try {
      const data = await doctorFinancialsApi.getAccountSummary(doctorId)
      setAccount(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch doctor account summary')
    } finally {
      setLoading(false)
    }
  }, [doctorId])

  useEffect(() => {
    fetchAccount()
  }, [fetchAccount])

  return { account, loading, error, refresh: fetchAccount }
}

export function useSettlementActions() {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createSettlement = async (dto: CreateSettlementDto) => {
    setSubmitting(true)
    setError(null)
    try {
      return await doctorFinancialsApi.createSettlement(dto)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create settlement'
      setError(msg)
      throw new Error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const submitSettlement = async (id: string) => {
    setSubmitting(true)
    setError(null)
    try {
      return await doctorFinancialsApi.submitSettlement(id)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit settlement'
      setError(msg)
      throw new Error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const approveSettlement = async (id: string) => {
    setSubmitting(true)
    setError(null)
    try {
      return await doctorFinancialsApi.approveSettlement(id)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to approve settlement'
      setError(msg)
      throw new Error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const recordPayment = async (id: string, dto: RecordPaymentDto) => {
    setSubmitting(true)
    setError(null)
    try {
      return await doctorFinancialsApi.recordPayment(id, dto)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to record payment'
      setError(msg)
      throw new Error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const archiveSettlement = async (id: string, reason: string) => {
    setSubmitting(true)
    setError(null)
    try {
      return await doctorFinancialsApi.archiveSettlement(id, reason)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to archive settlement'
      setError(msg)
      throw new Error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return {
    createSettlement,
    submitSettlement,
    approveSettlement,
    recordPayment,
    archiveSettlement,
    submitting,
    error,
  }
}
