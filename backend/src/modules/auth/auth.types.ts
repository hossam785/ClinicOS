import type { Request } from 'express'

export interface Tenant {
  id: string
  name: string
  status: 'PENDING_APPROVAL' | 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED'
  createdAt: Date
}

export interface User {
  id: string
  tenantId: string
  email: string
  passwordHash: string
  fullName: string
  role: 'PlatformSuperAdmin' | 'ClinicOwner' | 'ClinicAdmin' | 'Doctor' | 'Nurse' | 'Patient'
  status: 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED'
  failedLoginAttempts: number
  lockoutUntil: Date | null
  createdAt: Date
}

export interface UserInvitation {
  id: string
  tenantId: string
  email: string
  role: 'ClinicAdmin' | 'Doctor' | 'Nurse' | 'Patient'
  token: string
  status: 'INVITED' | 'ACCEPTED' | 'EXPIRED'
  expiresAt: Date
  createdAt: Date
}

export interface PasswordResetToken {
  id: string
  userId: string
  token: string
  status: 'UNUSED' | 'USED' | 'EXPIRED'
  expiresAt: Date
  createdAt: Date
}

export interface UserSession {
  id: string
  userId: string
  tenantId: string
  token: string
  expiresAt: Date
  createdAt: Date
}

export interface AuthTokenPayload {
  userId: string
  email: string
  role: string
  tenantId: string
}

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload
}
