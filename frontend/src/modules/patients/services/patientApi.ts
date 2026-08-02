import { apiClient } from '@/services/apiClient'
import type { PatientProfile, PatientStatus, BloodGroup } from '../types/patient.types'

export interface CreatePatientPayload {
  firstName: string
  middleName?: string
  lastName: string
  gender: 'male' | 'female' | 'other'
  dateOfBirth: string
  nationalId?: string
  passportNumber?: string
  primaryPhone: string
  secondaryPhone?: string
  email?: string
  bloodGroup?: BloodGroup
  allergiesFlag?: boolean
  chronicDiseaseFlag?: boolean
  insuranceFlag?: boolean
  administrativeNotes?: string
  emergencyContact?: {
    name: string
    relationship: string
    phone: string
  }
}

export interface UpdatePatientPayload {
  firstName?: string
  middleName?: string
  lastName?: string
  gender?: 'male' | 'female' | 'other'
  dateOfBirth?: string
  nationalId?: string
  passportNumber?: string
  primaryPhone?: string
  secondaryPhone?: string
  email?: string
  bloodGroup?: BloodGroup
  allergiesFlag?: boolean
  chronicDiseaseFlag?: boolean
  insuranceFlag?: boolean
  administrativeNotes?: string
  emergencyContact?: {
    name: string
    relationship: string
    phone: string
  }
}

interface ApiResponse<T> {
  success: boolean
  data: T
}

export const patientApi = {
  async listPatients(status?: string, search?: string): Promise<PatientProfile[]> {
    const queryParams = new URLSearchParams()
    if (status && status !== 'ALL') queryParams.append('status', status)
    if (search && search.trim()) queryParams.append('search', search.trim())

    const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : ''
    const response = await apiClient.get<ApiResponse<{ patients: PatientProfile[]; total: number }>>(`/patients${queryStr}`)
    return response.data.patients
  },

  async getPatientById(id: string): Promise<PatientProfile> {
    const response = await apiClient.get<ApiResponse<PatientProfile>>(`/patients/${id}`)
    return response.data
  },

  async createPatient(payload: CreatePatientPayload): Promise<PatientProfile> {
    const response = await apiClient.post<ApiResponse<PatientProfile>>('/patients', payload)
    return response.data
  },

  async updatePatient(id: string, payload: UpdatePatientPayload): Promise<PatientProfile> {
    const response = await apiClient.put<ApiResponse<PatientProfile>>(`/patients/${id}`, payload)
    return response.data
  },

  async archivePatient(id: string, reason?: string): Promise<PatientProfile> {
    const response = await apiClient.post<ApiResponse<PatientProfile>>(`/patients/${id}/archive`, { reason })
    return response.data
  },

  async restorePatient(id: string): Promise<PatientProfile> {
    const response = await apiClient.post<ApiResponse<PatientProfile>>(`/patients/${id}/restore`, {})
    return response.data
  },

  async updateStatus(id: string, status: PatientStatus, reason?: string): Promise<PatientProfile> {
    const response = await apiClient.post<ApiResponse<PatientProfile>>(`/patients/${id}/status`, { status, reason })
    return response.data
  },
}
