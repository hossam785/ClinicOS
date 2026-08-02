import type { AppointmentStatus } from '../types/appointment.types'

export class AppointmentValidator {
  static validateCreateAppointment(payload: Record<string, unknown>): { isValid: boolean; error?: string } {
    if (!payload.patientId || typeof payload.patientId !== 'string' || !payload.patientId.trim()) {
      return { isValid: false, error: 'Patient ID is required.' }
    }
    if (!payload.patientName || typeof payload.patientName !== 'string' || !payload.patientName.trim()) {
      return { isValid: false, error: 'Patient Name is required.' }
    }
    if (!payload.doctorId || typeof payload.doctorId !== 'string' || !payload.doctorId.trim()) {
      return { isValid: false, error: 'Doctor ID is required.' }
    }
    if (!payload.doctorName || typeof payload.doctorName !== 'string' || !payload.doctorName.trim()) {
      return { isValid: false, error: 'Doctor Name is required.' }
    }
    if (!payload.appointmentDate || typeof payload.appointmentDate !== 'string' || !payload.appointmentDate.trim()) {
      return { isValid: false, error: 'Appointment Date is required (YYYY-MM-DD).' }
    }
    if (!payload.startTime || typeof payload.startTime !== 'string' || !payload.startTime.trim()) {
      return { isValid: false, error: 'Start Time is required (HH:MM).' }
    }
    if (!payload.endTime || typeof payload.endTime !== 'string' || !payload.endTime.trim()) {
      return { isValid: false, error: 'End Time is required (HH:MM).' }
    }
    if (payload.startTime >= payload.endTime) {
      return { isValid: false, error: 'Start Time must be strictly earlier than End Time.' }
    }

    return { isValid: true }
  }

  static validateStatusTransition(currentStatus: AppointmentStatus, targetStatus: AppointmentStatus): { isValid: boolean; error?: string } {
    if (currentStatus === targetStatus) {
      return { isValid: false, error: `Appointment is already in ${currentStatus} status.` }
    }

    if (['COMPLETED', 'CANCELLED', 'NO_SHOW'].includes(currentStatus)) {
      return { isValid: false, error: `Cannot transition status out of terminal state ${currentStatus}.` }
    }

    const allowedTransitions: Record<AppointmentStatus, AppointmentStatus[]> = {
      SCHEDULED: ['CONFIRMED', 'CHECKED_IN', 'CANCELLED', 'RESCHEDULED'],
      CONFIRMED: ['CHECKED_IN', 'CANCELLED', 'RESCHEDULED', 'NO_SHOW'],
      CHECKED_IN: ['IN_CONSULTATION', 'CANCELLED'],
      IN_CONSULTATION: ['COMPLETED'],
      COMPLETED: [],
      CANCELLED: [],
      NO_SHOW: [],
      RESCHEDULED: [],
    }

    if (!allowedTransitions[currentStatus]?.includes(targetStatus)) {
      return { isValid: false, error: `Transition from ${currentStatus} to ${targetStatus} is prohibited.` }
    }

    return { isValid: true }
  }
}
