import { apiClient } from '@/services/apiClient'
import type { MedicalRecordProfile, EncounterType, VitalSigns } from '../types/medicalRecord.types'

export interface CreateMedicalRecordPayload {
  appointmentId: string
  patientId: string
  patientName: string
  patientCode?: string
  patientAge?: number
  patientGender?: string
  doctorId: string
  doctorName: string
  doctorSpecialty?: string
  clinicId?: string
  visitDate: string
  visitType?: EncounterType
  chiefComplaint?: string
  historyOfPresentIllness?: string
  vitalSigns?: VitalSigns
  primaryDiagnosis?: string
  treatmentPlan?: string
}

export interface UpdateMedicalRecordPayload {
  chiefComplaint?: string
  historyOfPresentIllness?: string
  vitalSigns?: VitalSigns
  primaryDiagnosis?: string
  secondaryDiagnoses?: string[]
  assessmentNotes?: string
  treatmentPlan?: string
  followUpInstructions?: string
}

interface ApiResponse<T> {
  success: boolean
  data: T
}

export const medicalRecordApi = {
  async listRecords(status?: string, doctorId?: string, search?: string): Promise<MedicalRecordProfile[]> {
    const queryParams = new URLSearchParams()
    if (status && status !== 'ALL') queryParams.append('status', status)
    if (doctorId) queryParams.append('doctorId', doctorId)
    if (search && search.trim()) queryParams.append('search', search.trim())

    const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : ''
    const response = await apiClient.get<ApiResponse<{ records: MedicalRecordProfile[]; total: number }>>(`/medical-records${queryStr}`)
    return response.data.records
  },

  async getRecordById(id: string): Promise<MedicalRecordProfile> {
    const response = await apiClient.get<ApiResponse<MedicalRecordProfile>>(`/medical-records/${id}`)
    return response.data
  },

  async getPatientHistory(patientId: string): Promise<MedicalRecordProfile[]> {
    const response = await apiClient.get<ApiResponse<{ history: MedicalRecordProfile[]; total: number }>>(`/medical-records/patient/${patientId}/history`)
    return response.data.history
  },

  async createRecord(payload: CreateMedicalRecordPayload): Promise<MedicalRecordProfile> {
    const response = await apiClient.post<ApiResponse<MedicalRecordProfile>>('/medical-records', payload)
    return response.data
  },

  async updateRecord(id: string, payload: UpdateMedicalRecordPayload): Promise<MedicalRecordProfile> {
    const response = await apiClient.put<ApiResponse<MedicalRecordProfile>>(`/medical-records/${id}`, payload)
    return response.data
  },

  async completeRecord(id: string): Promise<MedicalRecordProfile> {
    const response = await apiClient.post<ApiResponse<MedicalRecordProfile>>(`/medical-records/${id}/complete`, {})
    return response.data
  },

  async addAddendum(id: string, text: string): Promise<MedicalRecordProfile> {
    const response = await apiClient.post<ApiResponse<MedicalRecordProfile>>(`/medical-records/${id}/addendum`, { text })
    return response.data
  },

  async archiveRecord(id: string): Promise<MedicalRecordProfile> {
    const response = await apiClient.delete<ApiResponse<MedicalRecordProfile>>(`/medical-records/${id}`)
    return response.data
  },
}
