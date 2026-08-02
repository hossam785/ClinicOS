import { apiClient } from '@/services/apiClient'
import type { ClinicProfile, DayOperatingHours, HolidayException, ClinicStatus } from '../types/clinic.types'

export interface UpdateProfilePayload {
  name?: string
  legalName?: string
  registrationNumber?: string
  taxId?: string
  primaryEmail?: string
  primaryPhone?: string
  logoUrl?: string
  timezone?: string
  currency?: string
  location?: {
    addressLine1?: string
    addressLine2?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
  }
}

interface ApiResponse<T> {
  success: boolean
  data: T
}

export const clinicApi = {
  async getProfile(): Promise<ClinicProfile> {
    const response = await apiClient.get<ApiResponse<ClinicProfile>>('/clinic/profile')
    return response.data
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<ClinicProfile> {
    const response = await apiClient.put<ApiResponse<ClinicProfile>>('/clinic/profile', payload)
    return response.data
  },

  async getOperatingHours(): Promise<DayOperatingHours[]> {
    const response = await apiClient.get<ApiResponse<{ operatingHours: DayOperatingHours[] }>>('/clinic/operating-hours')
    return response.data.operatingHours
  },

  async updateOperatingHours(schedule: DayOperatingHours[]): Promise<DayOperatingHours[]> {
    const response = await apiClient.put<ApiResponse<{ operatingHours: DayOperatingHours[] }>>('/clinic/operating-hours', { schedule })
    return response.data.operatingHours
  },

  async getHolidays(): Promise<HolidayException[]> {
    const response = await apiClient.get<ApiResponse<{ holidays: HolidayException[] }>>('/clinic/holidays')
    return response.data.holidays
  },

  async addHoliday(payload: { date: string; name: string; reason?: string }): Promise<HolidayException> {
    const response = await apiClient.post<ApiResponse<HolidayException>>('/clinic/holidays', payload)
    return response.data
  },

  async deleteHoliday(holidayId: string): Promise<void> {
    await apiClient.delete(`/clinic/holidays/${holidayId}`)
  },

  async listClinics(status?: string, search?: string): Promise<ClinicProfile[]> {
    const queryParams = new URLSearchParams()
    if (status && status !== 'ALL') queryParams.append('status', status)
    if (search && search.trim()) queryParams.append('search', search.trim())

    const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : ''
    const response = await apiClient.get<ApiResponse<{ clinics: ClinicProfile[] }>>(`/clinics${queryStr}`)
    return response.data.clinics
  },

  async getClinicById(id: string): Promise<ClinicProfile> {
    const response = await apiClient.get<ApiResponse<ClinicProfile>>(`/clinics/${id}`)
    return response.data
  },

  async updateStatus(id: string, status: ClinicStatus, reason: string): Promise<ClinicProfile> {
    const response = await apiClient.post<ApiResponse<ClinicProfile>>(`/clinics/${id}/status`, { status, reason })
    return response.data
  },
}
