import crypto from 'crypto'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { env } from '@/config/environment'
import { AppError } from '@/shared/errors/AppError'
import { logger } from '@/shared/logging/logger'
import {
  TenantRepository,
  UserRepository,
  InvitationRepository,
  PasswordResetRepository,
  SessionRepository,
} from './auth.repository'
import type { Tenant, User, UserSession, AuthTokenPayload, PasswordResetToken } from './auth.types'

const JWT_SECRET = process.env.JWT_SECRET || 'clinicos-master-secret-key-101'
const BCRYPT_SALT_ROUNDS = 12

export class AuthService {
  public static async bootstrapSuperAdmin(): Promise<User | null> {
    const adminEmail = env.PLATFORM_SUPER_ADMIN_EMAIL
    const adminPassword = env.PLATFORM_SUPER_ADMIN_PASSWORD

    if (!adminEmail || !adminPassword) {
      return null
    }

    const existingAdmin = await UserRepository.findByEmail(adminEmail)
    if (existingAdmin) {
      return existingAdmin
    }

    const platformTenantId = 'system-platform'
    let platformTenant = await TenantRepository.findById(platformTenantId)
    if (!platformTenant) {
      platformTenant = {
        id: platformTenantId,
        name: 'ClinicOS Platform Administration',
        status: 'ACTIVE',
        createdAt: new Date(),
      }
      await TenantRepository.create(platformTenant)
    }

    const passwordHash = await bcrypt.hash(adminPassword, BCRYPT_SALT_ROUNDS)
    const superAdminUser: User = {
      id: 'usr-platform-super-admin',
      tenantId: platformTenantId,
      email: adminEmail.toLowerCase(),
      passwordHash,
      fullName: 'Platform Super Admin',
      role: 'PlatformSuperAdmin',
      status: 'ACTIVE',
      failedLoginAttempts: 0,
      lockoutUntil: null,
      createdAt: new Date(),
    }

    await UserRepository.create(superAdminUser)
    logger.info({
      message: 'Platform Super Admin account bootstrapped successfully',
      context: { email: adminEmail, tenantId: platformTenantId },
    })

    return superAdminUser
  }

  public static async registerClinic(payload: {
    clinicName: string
    ownerEmail: string
    ownerPasswordHash: string
    ownerFullName: string
  }): Promise<{ tenant: Tenant; owner: Omit<User, 'passwordHash'> }> {
    const existingUser = await UserRepository.findByEmail(payload.ownerEmail)
    if (existingUser) {
      throw new AppError('An account with this email address already exists.', 409, 'IDENTITY_CONFLICT')
    }

    const tenantId = `clinic-${crypto.randomBytes(4).toString('hex')}`
    const tenant: Tenant = {
      id: tenantId,
      name: payload.clinicName,
      status: 'PENDING_APPROVAL',
      createdAt: new Date(),
    }

    const ownerId = `usr-${crypto.randomBytes(6).toString('hex')}`
    const passwordHash = await bcrypt.hash(payload.ownerPasswordHash, BCRYPT_SALT_ROUNDS)

    const owner: User = {
      id: ownerId,
      tenantId,
      email: payload.ownerEmail.toLowerCase(),
      passwordHash,
      fullName: payload.ownerFullName,
      role: 'ClinicOwner',
      status: 'ACTIVE',
      failedLoginAttempts: 0,
      lockoutUntil: null,
      createdAt: new Date(),
    }

    await TenantRepository.create(tenant)
    const createdOwner = await UserRepository.create(owner)

    logger.info({
      message: 'New clinic tenant registered in pending mode',
      tenantId,
      context: { ownerId, clinicName: payload.clinicName },
    })

    const ownerProfile = { ...createdOwner } as Partial<User> & Omit<User, 'passwordHash'>
    delete ownerProfile.passwordHash
    return { tenant, owner: ownerProfile }
  }

  public static async login(payload: {
    tenantId?: string
    email: string
    passwordPlain: string
  }): Promise<{ token: string; user: Omit<User, 'passwordHash'> }> {
    const user = await UserRepository.findByEmail(payload.email)
    if (!user || user.tenantId !== payload.tenantId) {
      throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS')
    }

    // Check brute-force lockout
    if (user.lockoutUntil && user.lockoutUntil.getTime() > Date.now()) {
      const remainingSeconds = Math.ceil((user.lockoutUntil.getTime() - Date.now()) / 1000)
      throw new AppError(
        `Account is locked out due to multiple failed login attempts. Try again in ${remainingSeconds} seconds.`,
        423,
        'ACCOUNT_LOCKED'
      )
    }

    const isMatch = await bcrypt.compare(payload.passwordPlain, user.passwordHash)
    if (!isMatch) {
      user.failedLoginAttempts += 1
      if (user.failedLoginAttempts >= 5) {
        user.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes lockout
        logger.warn({
          message: 'Brute-force protection locked user account',
          tenantId: user.tenantId,
          context: { userId: user.id, email: user.email },
        })
      }
      await UserRepository.update(user)
      throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS')
    }

    // Reset attempts on successful login
    user.failedLoginAttempts = 0
    user.lockoutUntil = null
    await UserRepository.update(user)

    // Check account status
    if (user.status !== 'ACTIVE') {
      throw new AppError('Your account access has been suspended.', 403, 'ACCOUNT_SUSPENDED')
    }

    const tenant = await TenantRepository.findById(user.tenantId)
    if (!tenant || tenant.status !== 'ACTIVE') {
      throw new AppError(
        'Clinic workspace has been suspended or is pending activation.',
        403,
        'WORKSPACE_SUSPENDED'
      )
    }

    // Generate JWT token
    const tokenPayload: AuthTokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    }

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '8h' })

    const session: UserSession = {
      id: `ses-${crypto.randomBytes(8).toString('hex')}`,
      userId: user.id,
      tenantId: user.tenantId,
      token,
      expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
      createdAt: new Date(),
    }
    await SessionRepository.create(session)

    logger.info({
      message: 'User logged in successfully and session created',
      tenantId: user.tenantId,
      context: { userId: user.id, role: user.role },
    })

    const userProfile = { ...user } as Partial<User> & Omit<User, 'passwordHash'>
    delete userProfile.passwordHash
    return { token, user: userProfile }
  }

  public static async onboardStaff(payload: {
    token: string
    fullName: string
    passwordPlain: string
  }): Promise<Omit<User, 'passwordHash'>> {
    const invitation = await InvitationRepository.findByToken(payload.token)
    if (!invitation || invitation.status !== 'INVITED') {
      throw new AppError('Invalid or expired invitation token.', 400, 'INVALID_INVITATION')
    }

    if (invitation.expiresAt.getTime() < Date.now()) {
      invitation.status = 'EXPIRED'
      await InvitationRepository.update(invitation)
      throw new AppError('Invitation token has expired.', 400, 'EXPIRED_INVITATION')
    }

    const existingUser = await UserRepository.findByEmail(invitation.email)
    if (existingUser) {
      throw new AppError('A user profile already exists with this email address.', 409, 'IDENTITY_CONFLICT')
    }

    const userId = `usr-${crypto.randomBytes(6).toString('hex')}`
    const passwordHash = await bcrypt.hash(payload.passwordPlain, BCRYPT_SALT_ROUNDS)

    const user: User = {
      id: userId,
      tenantId: invitation.tenantId,
      email: invitation.email.toLowerCase(),
      passwordHash,
      fullName: payload.fullName,
      role: invitation.role,
      status: 'ACTIVE',
      failedLoginAttempts: 0,
      lockoutUntil: null,
      createdAt: new Date(),
    }

    const createdUser = await UserRepository.create(user)
    
    invitation.status = 'ACCEPTED'
    await InvitationRepository.update(invitation)

    logger.info({
      message: 'New staff member onboarded and activated profile',
      tenantId: invitation.tenantId,
      context: { userId, role: invitation.role },
    })

    const userProfile = { ...createdUser } as Partial<User> & Omit<User, 'passwordHash'>
    delete userProfile.passwordHash
    return userProfile
  }

  public static async forgotPassword(email: string): Promise<boolean> {
    const user = await UserRepository.findByEmail(email)
    if (!user) {
      // Prevent email verification enumeration, return true anyway
      return true
    }

    const resetTokenPayload = crypto.randomBytes(32).toString('hex')
    const resetToken: PasswordResetToken = {
      id: `rst-${crypto.randomBytes(8).toString('hex')}`,
      userId: user.id,
      token: resetTokenPayload,
      status: 'UNUSED',
      expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      createdAt: new Date(),
    }

    await PasswordResetRepository.invalidateAllForUser(user.id)
    await PasswordResetRepository.create(resetToken)

    logger.info({
      message: 'Password reset link requested and generated',
      tenantId: user.tenantId,
      context: { userId: user.id },
    })

    return true
  }

  public static async resetPassword(payload: {
    token: string
    passwordPlain: string
  }): Promise<void> {
    const resetToken = await PasswordResetRepository.findByToken(payload.token)
    if (!resetToken || resetToken.status !== 'UNUSED') {
      throw new AppError('Invalid or expired password reset token.', 400, 'INVALID_RESET_TOKEN')
    }

    if (resetToken.expiresAt.getTime() < Date.now()) {
      resetToken.status = 'EXPIRED'
      await PasswordResetRepository.update(resetToken)
      throw new AppError('Password reset token has expired.', 400, 'EXPIRED_RESET_TOKEN')
    }

    const user = await UserRepository.findById(resetToken.userId)
    if (!user) {
      throw new AppError('User profile associated with this token not found.', 404, 'USER_NOT_FOUND')
    }

    const passwordHash = await bcrypt.hash(payload.passwordPlain, BCRYPT_SALT_ROUNDS)
    user.passwordHash = passwordHash
    user.failedLoginAttempts = 0
    user.lockoutUntil = null
    
    await UserRepository.update(user)
    
    resetToken.status = 'USED'
    await PasswordResetRepository.update(resetToken)
    await PasswordResetRepository.invalidateAllForUser(user.id)

    logger.info({
      message: 'Password reset completed successfully',
      tenantId: user.tenantId,
      context: { userId: user.id },
    })
  }

  public static async changePassword(
    userId: string,
    payload: {
      passwordPlain: string
      newPasswordPlain: string
    }
  ): Promise<void> {
    const user = await UserRepository.findById(userId)
    if (!user) {
      throw new AppError('User profile not found.', 404, 'USER_NOT_FOUND')
    }

    const isMatch = await bcrypt.compare(payload.passwordPlain, user.passwordHash)
    if (!isMatch) {
      throw new AppError('Incorrect current password.', 401, 'INVALID_CREDENTIALS')
    }

    const passwordHash = await bcrypt.hash(payload.newPasswordPlain, BCRYPT_SALT_ROUNDS)
    user.passwordHash = passwordHash
    await UserRepository.update(user)

    logger.info({
      message: 'Password changed from profile settings',
      tenantId: user.tenantId,
      context: { userId: user.id },
    })
  }

  public static async validateToken(token: string): Promise<AuthTokenPayload> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthTokenPayload
      
      const user = await UserRepository.findById(decoded.userId)
      if (!user || user.status !== 'ACTIVE') {
        throw new AppError('User account associated with session is suspended.', 403, 'ACCOUNT_SUSPENDED')
      }

      const tenant = await TenantRepository.findById(decoded.tenantId)
      if (!tenant || tenant.status !== 'ACTIVE') {
        throw new AppError('Tenant associated with session is suspended.', 403, 'WORKSPACE_SUSPENDED')
      }

      return decoded
    } catch (err) {
      if (err instanceof AppError) throw err
      throw new AppError('Session expired or invalid.', 401, 'INVALID_SESSION')
    }
  }

  public static async logout(token: string): Promise<void> {
    await SessionRepository.deleteByToken(token)
  }
}
