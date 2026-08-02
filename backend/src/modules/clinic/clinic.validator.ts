import { AppError } from '@/shared/errors/AppError'

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const ClinicValidator = {
  updateProfile(body: Record<string, unknown>) {
    const { primaryEmail, name, legalName } = body

    if (name !== undefined && (typeof name !== 'string' || !name.trim())) {
      throw new AppError('Clinic operating name cannot be empty.', 400, 'VALIDATION_FAILED')
    }

    if (legalName !== undefined && (typeof legalName !== 'string' || !legalName.trim())) {
      throw new AppError('Legal corporate name cannot be empty.', 400, 'VALIDATION_FAILED')
    }

    if (primaryEmail !== undefined) {
      if (typeof primaryEmail !== 'string' || !primaryEmail.trim() || !validateEmail(primaryEmail)) {
        throw new AppError('Please provide a valid primary email address.', 400, 'VALIDATION_FAILED')
      }
    }
  },

  updateOperatingHours(body: Record<string, unknown>) {
    const { schedule } = body

    if (!Array.isArray(schedule)) {
      throw new AppError('Operating schedule payload must be an array of day shift configurations.', 400, 'VALIDATION_FAILED')
    }

    if (schedule.length === 0) {
      throw new AppError('Operating schedule array cannot be empty.', 400, 'VALIDATION_FAILED')
    }
  },

  addHoliday(body: Record<string, unknown>) {
    const { date, name } = body

    if (!date || typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new AppError('Holiday date must be in valid YYYY-MM-DD format.', 400, 'VALIDATION_FAILED')
    }

    if (!name || typeof name !== 'string' || !name.trim()) {
      throw new AppError('Holiday occasion name is required.', 400, 'VALIDATION_FAILED')
    }
  },

  updateStatus(body: Record<string, unknown>) {
    const { status, reason } = body

    const validStatuses = ['APPROVED', 'ACTIVE', 'SUSPENDED', 'ARCHIVED']
    if (!status || typeof status !== 'string' || !validStatuses.includes(status)) {
      throw new AppError(`Target status must be one of: ${validStatuses.join(', ')}.`, 400, 'VALIDATION_FAILED')
    }

    if (!reason || typeof reason !== 'string' || !reason.trim()) {
      throw new AppError('Reason for status transition is required for audit logs.', 400, 'VALIDATION_FAILED')
    }
  },
}
