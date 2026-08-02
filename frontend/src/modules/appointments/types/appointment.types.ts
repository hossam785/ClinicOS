export type AppointmentStatus =
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'IN_CONSULTATION'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW'
  | 'RESCHEDULED'

export type AppointmentType = 'FIRST_VISIT' | 'FOLLOW_UP' | 'ROUTINE_CHECKUP' | 'EMERGENCY'

export type AppointmentPriority = 'NORMAL' | 'URGENT' | 'EMERGENCY'

export interface AppointmentProfile {
  id: string
  appointmentNumber: string
  tenantId: string
  clinicId: string
  clinicName?: string
  patientId: string
  patientName: string
  patientCode: string
  patientPhone: string
  doctorId: string
  doctorName: string
  doctorSpecialty?: string
  appointmentDate: string
  startTime: string
  endTime: string
  durationMinutes: number
  appointmentType: AppointmentType
  priority: AppointmentPriority
  status: AppointmentStatus
  chiefComplaint?: string
  internalNotes?: string
  checkedInAt?: string
  consultationStartedAt?: string
  consultationEndedAt?: string
  completedAt?: string
  cancelledAt?: string
  cancelledBy?: string
  cancellationReason?: string
  rescheduledFromId?: string
  rescheduledToId?: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
  version: number
}

export interface TimeSlot {
  startTime: string
  endTime: string
  isAvailable: boolean
  conflictingAppointmentNumber?: string
}
