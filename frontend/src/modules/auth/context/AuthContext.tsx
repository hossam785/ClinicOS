import { createContext } from 'react'

export interface UserProfile {
  id: string
  email: string
  role: string
  fullName: string
  tenantId: string
}

export interface AuthContextType {
  user: UserProfile | null
  tenantId: string | null
  token: string | null
  isAuthenticated: boolean
  isInitialized: boolean
  login: (email: string, passwordPlain: string, tenantId?: string) => Promise<void>
  logout: () => Promise<void>
  registerClinic: (
    clinicName: string,
    ownerEmail: string,
    ownerPasswordPlain: string,
    ownerFullName: string
  ) => Promise<void>
  onboardStaff: (token: string, fullName: string, passwordPlain: string) => Promise<void>
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (token: string, passwordPlain: string) => Promise<void>
  changePassword: (passwordPlain: string, newPasswordPlain: string) => Promise<void>
  checkSession: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
