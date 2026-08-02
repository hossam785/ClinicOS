/**
 * Prescription Management API Service
 */
import { apiClient } from '@/services/apiClient'
import type {
  PrescriptionSingleResponse,
  PrescriptionListResponse,
  CreatePrescriptionPayload,
  UpdatePrescriptionPayload,
  PrescriptionQueryParams,
} from '../types/prescription'

export const prescriptionApi = {
  getPrescriptions: async (params?: PrescriptionQueryParams): Promise<PrescriptionListResponse> => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.patientId) searchParams.append('patientId', params.patientId)
    if (params?.doctorId) searchParams.append('doctorId', params.doctorId)
    if (params?.status) searchParams.append('status', params.status)
    if (params?.startDate) searchParams.append('startDate', params.startDate)
    if (params?.endDate) searchParams.append('endDate', params.endDate)
    if (params?.medicineName) searchParams.append('medicineName', params.medicineName)
    if (params?.prescriptionNumber) searchParams.append('prescriptionNumber', params.prescriptionNumber)
    if (params?.search) searchParams.append('search', params.search)

    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : ''
    return apiClient.get<PrescriptionListResponse>(`/prescriptions${queryString}`)
  },

  getPrescriptionById: async (id: string): Promise<PrescriptionSingleResponse> => {
    return apiClient.get<PrescriptionSingleResponse>(`/prescriptions/${id}`)
  },

  getPatientPrescriptions: async (patientId: string, params?: { page?: number; limit?: number }): Promise<PrescriptionListResponse> => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : ''
    return apiClient.get<PrescriptionListResponse>(`/patients/${patientId}/prescriptions${queryString}`)
  },

  getMedicalRecordPrescriptions: async (recordId: string): Promise<PrescriptionListResponse> => {
    return apiClient.get<PrescriptionListResponse>(`/medical-records/${recordId}/prescriptions`)
  },

  createPrescription: async (payload: CreatePrescriptionPayload): Promise<PrescriptionSingleResponse> => {
    return apiClient.post<PrescriptionSingleResponse>('/prescriptions', payload)
  },

  updatePrescription: async (id: string, payload: UpdatePrescriptionPayload): Promise<PrescriptionSingleResponse> => {
    return apiClient.put<PrescriptionSingleResponse>(`/prescriptions/${id}`, payload)
  },

  finalizePrescription: async (id: string): Promise<PrescriptionSingleResponse> => {
    return apiClient.patch<PrescriptionSingleResponse>(`/prescriptions/${id}/finalize`)
  },

  archivePrescription: async (id: string, reason: string): Promise<PrescriptionSingleResponse> => {
    return apiClient.patch<PrescriptionSingleResponse>(`/prescriptions/${id}/archive`, { reason })
  },

  restorePrescription: async (id: string): Promise<PrescriptionSingleResponse> => {
    return apiClient.patch<PrescriptionSingleResponse>(`/prescriptions/${id}/restore`)
  },

  printPrescription: async (id: string): Promise<PrescriptionSingleResponse> => {
    return apiClient.post<PrescriptionSingleResponse>(`/prescriptions/${id}/print`, { actionType: 'PRINT_DIRECT' })
  },

  exportPrescriptionPdf: async (id: string): Promise<Blob> => {
    const token = localStorage.getItem('clinicos_token')
    const savedTenantId = localStorage.getItem('clinicos_tenant_id')
    const baseUrl = import.meta.env.VITE_API_URL || '/api/v1'

    const headers = new Headers()
    headers.set('Accept', 'application/pdf')
    if (token) headers.set('Authorization', `Bearer ${token}`)
    if (savedTenantId) headers.set('X-Tenant-ID', savedTenantId)

    const response = await fetch(`${baseUrl}/prescriptions/${id}/pdf`, {
      method: 'POST',
      headers,
    })

    if (!response.ok) {
      throw new Error('Failed to generate PDF document.')
    }

    return response.blob()
  },
}
