import { apiClient } from '@/services/apiClient'
import type { DoctorProfile, DoctorShift, DoctorLeave, DoctorStatus } from '../types/doctor.types'

export interface InviteDoctorPayload {
  legalName: string
  medicalTitle?: string
  gender?: 'male' | 'female' | 'other'
  nationalId?: string
  medicalLicenseNumber: string
  licenseIssuingAuthority?: string
  licenseExpirationDate?: string
  primarySpecialty: string
  department: string
  primaryEmail: string
  primaryPhone: string
  consultationFee?: number
  defaultConsultationDuration?: number
  biography?: string
}

export interface UpdateDoctorPayload {
  legalName?: string
  medicalTitle?: string
  primarySpecialty?: string
  department?: string
  primaryEmail?: string
  primaryPhone?: string
  biography?: string
}

interface ApiResponse<T> {
  success: boolean
  data: T
}

export const doctorApi = {
  async listDoctors(status?: string, search?: string): Promise<DoctorProfile[]> {
    const queryParams = new URLSearchParams()
    if (status && status !== 'ALL') queryParams.append('status', status)
    if (search && search.trim()) queryParams.append('search', search.trim())

    const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : ''
    const response = await apiClient.get<ApiResponse<{ doctors: DoctorProfile[]; total: number }>>(`/doctors${queryStr}`)
    return response.data.doctors
  },

  async getDoctorById(id: string): Promise<DoctorProfile> {
    const response = await apiClient.get<ApiResponse<DoctorProfile>>(`/doctors/${id}`)
    return response.data
  },

  async inviteDoctor(payload: InviteDoctorPayload): Promise<DoctorProfile> {
    const response = await apiClient.post<ApiResponse<DoctorProfile>>('/doctors/invite', payload)
    return response.data
  },

  async updateDoctorProfile(id: string, payload: UpdateDoctorPayload): Promise<DoctorProfile> {
    const response = await apiClient.put<ApiResponse<DoctorProfile>>(`/doctors/${id}`, payload)
    return response.data
  },

  async updateFees(id: string, consultationFee: number, defaultConsultationDuration: number): Promise<DoctorProfile> {
    const response = await apiClient.put<ApiResponse<DoctorProfile>>(`/doctors/${id}/fees`, {
      consultationFee,
      defaultConsultationDuration,
    })
    return response.data
  },

  async updateSchedule(id: string, shifts: DoctorShift[]): Promise<DoctorProfile> {
    const response = await apiClient.put<ApiResponse<DoctorProfile>>(`/doctors/${id}/schedule`, { shifts })
    return response.data
  },

  async getLeaves(id: string): Promise<DoctorLeave[]> {
    const response = await apiClient.get<ApiResponse<{ leaves: DoctorLeave[] }>>(`/doctors/${id}/leaves`)
    return response.data.leaves
  },

  async addLeave(id: string, payload: { date: string; name: string; reason?: string }): Promise<DoctorLeave> {
    const response = await apiClient.post<ApiResponse<DoctorLeave>>(`/doctors/${id}/leaves`, payload)
    return response.data
  },

  async deleteLeave(id: string, leaveId: string): Promise<void> {
    await apiClient.delete(`/doctors/${id}/leaves/${leaveId}`)
  },

  async verifyLicense(id: string): Promise<DoctorProfile> {
    const response = await apiClient.post<ApiResponse<DoctorProfile>>(`/doctors/${id}/verify-license`, {})
    return response.data
  },

  async updateStatus(id: string, status: DoctorStatus, reason: string): Promise<DoctorProfile> {
    const response = await apiClient.post<ApiResponse<DoctorProfile>>(`/doctors/${id}/status`, { status, reason })
    return response.data
  },
}
