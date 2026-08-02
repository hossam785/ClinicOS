import { AppError } from '@/shared/errors/AppError'

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const AuthValidator = {
  login(body: Record<string, unknown>) {
    const { email, password } = body

    if (!email || typeof email !== 'string' || !email.trim()) {
      throw new AppError('Email address is required.', 400, 'VALIDATION_FAILED')
    }

    if (!validateEmail(email)) {
      throw new AppError('Please enter a valid email address.', 400, 'VALIDATION_FAILED')
    }

    if (!password || typeof password !== 'string' || !password.trim()) {
      throw new AppError('Password is required.', 400, 'VALIDATION_FAILED')
    }
  },

  registerClinic(body: Record<string, unknown>) {
    const { clinicName, ownerEmail, ownerPassword, ownerFullName } = body

    if (!clinicName || typeof clinicName !== 'string' || !clinicName.trim()) {
      throw new AppError('Clinic name is required.', 400, 'VALIDATION_FAILED')
    }

    if (!ownerEmail || typeof ownerEmail !== 'string' || !ownerEmail.trim()) {
      throw new AppError('Owner email address is required.', 400, 'VALIDATION_FAILED')
    }

    if (!validateEmail(ownerEmail)) {
      throw new AppError('Please enter a valid email address.', 400, 'VALIDATION_FAILED')
    }

    if (!ownerPassword || typeof ownerPassword !== 'string' || ownerPassword.length < 10) {
      throw new AppError('Password must be at least 10 characters long.', 400, 'VALIDATION_FAILED')
    }

    if (!ownerFullName || typeof ownerFullName !== 'string' || !ownerFullName.trim()) {
      throw new AppError('Owner full name is required.', 400, 'VALIDATION_FAILED')
    }
  },

  onboardStaff(body: Record<string, unknown>) {
    const { token, fullName, password } = body

    if (!token || typeof token !== 'string' || !token.trim()) {
      throw new AppError('Invitation token is required.', 400, 'VALIDATION_FAILED')
    }

    if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
      throw new AppError('Full name is required.', 400, 'VALIDATION_FAILED')
    }

    if (!password || typeof password !== 'string' || password.length < 10) {
      throw new AppError('Password must be at least 10 characters long.', 400, 'VALIDATION_FAILED')
    }
  },

  forgotPassword(body: Record<string, unknown>) {
    const { email } = body

    if (!email || typeof email !== 'string' || !email.trim()) {
      throw new AppError('Email address is required.', 400, 'VALIDATION_FAILED')
    }

    if (!validateEmail(email)) {
      throw new AppError('Please enter a valid email address.', 400, 'VALIDATION_FAILED')
    }
  },

  resetPassword(body: Record<string, unknown>) {
    const { token, password } = body

    if (!token || typeof token !== 'string' || !token.trim()) {
      throw new AppError('Reset token is required.', 400, 'VALIDATION_FAILED')
    }

    if (!password || typeof password !== 'string' || password.length < 10) {
      throw new AppError('Password must be at least 10 characters long.', 400, 'VALIDATION_FAILED')
    }
  },

  changePassword(body: Record<string, unknown>) {
    const { password, newPassword } = body

    if (!password || typeof password !== 'string' || !password.trim()) {
      throw new AppError('Current password is required.', 400, 'VALIDATION_FAILED')
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 10) {
      throw new AppError('New password must be at least 10 characters long.', 400, 'VALIDATION_FAILED')
    }
  },
}
