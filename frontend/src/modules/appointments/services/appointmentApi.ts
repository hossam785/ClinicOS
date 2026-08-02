import { apiClient } from '@/services/apiClient'
import type { AppointmentProfile, AppointmentStatus, AppointmentType, AppointmentPriority } from '../types/appointment.types'

export interface CreateAppointmentPayload {
  patientId: string
  patientName: string
  patientCode?: string
  patientPhone?: string
  doctorId: string
  doctorName: string
  doctorSpecialty?: string
  clinicId?: string
  appointmentDate: string
  startTime: string
  endTime: string
  durationMinutes?: number
  appointmentType?: AppointmentType
  priority?: AppointmentPriority
  chiefComplaint?: string
  internalNotes?: string
}

export interface UpdateAppointmentPayload {
  priority?: AppointmentPriority
  chiefComplaint?: string
  internalNotes?: string
}

interface ApiResponse<T> {
  success: boolean
  data: T
}

export const appointmentApi = {
  async listAppointments(status?: string, doctorId?: string, search?: string): Promise<AppointmentProfile[]> {
    const queryParams = new URLSearchParams()
    if (status && status !== 'ALL') queryParams.append('status', status)
    if (doctorId) queryParams.append('doctorId', doctorId)
    if (search && search.trim()) queryParams.append('search', search.trim())

    const queryStr = queryParams.toString() ? `?${queryParams.toString()}` : ''
    const response = await apiClient.get<ApiResponse<{ appointments: AppointmentProfile[]; total: number }>>(`/appointments${queryStr}`)
    return response.data.appointments
  },

  async getAppointmentById(id: string): Promise<AppointmentProfile> {
    const response = await apiClient.get<ApiResponse<AppointmentProfile>>(`/appointments/${id}`)
    return response.data
  },

  async checkAvailability(doctorId: string, date: string, startTime: string, endTime: string): Promise<{ available: boolean; conflict?: AppointmentProfile }> {
    const response = await apiClient.get<ApiResponse<{ available: boolean; conflict?: AppointmentProfile }>>(
      `/appointments/availability?doctorId=${doctorId}&date=${date}&startTime=${startTime}&endTime=${endTime}`
    )
    return response.data
  },

  async getDailyQueue(date?: string): Promise<AppointmentProfile[]> {
    const queryStr = date ? `?date=${date}` : ''
    const response = await apiClient.get<ApiResponse<{ queue: AppointmentProfile[]; total: number }>>(`/appointments/queue/daily${queryStr}`)
    return response.data.queue
  },

  async createAppointment(payload: CreateAppointmentPayload): Promise<AppointmentProfile> {
    const response = await apiClient.post<ApiResponse<AppointmentProfile>>('/appointments', payload)
    return response.data
  },

  async updateAppointment(id: string, payload: UpdateAppointmentPayload): Promise<AppointmentProfile> {
    const response = await apiClient.put<ApiResponse<AppointmentProfile>>(`/appointments/${id}`, payload)
    return response.data
  },

  async checkInPatient(id: string): Promise<AppointmentProfile> {
    const response = await apiClient.post<ApiResponse<AppointmentProfile>>(`/appointments/${id}/check-in`, {})
    return response.data
  },

  async startConsultation(id: string): Promise<AppointmentProfile> {
    const response = await apiClient.post<ApiResponse<AppointmentProfile>>(`/appointments/${id}/start-consultation`, {})
    return response.data
  },

  async completeConsultation(id: string): Promise<AppointmentProfile> {
    const response = await apiClient.post<ApiResponse<AppointmentProfile>>(`/appointments/${id}/complete`, {})
    return response.data
  },

  async cancelAppointment(id: string, reason: string): Promise<AppointmentProfile> {
    const response = await apiClient.post<ApiResponse<AppointmentProfile>>(`/appointments/${id}/cancel`, { reason })
    return response.data
  },

  async updateStatus(id: string, status: AppointmentStatus, reason?: string): Promise<AppointmentProfile> {
    const response = await apiClient.post<ApiResponse<AppointmentProfile>>(`/appointments/${id}/status`, { status, reason })
    return response.data
  },
}
