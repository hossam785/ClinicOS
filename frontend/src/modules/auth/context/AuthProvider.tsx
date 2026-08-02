import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import { apiClient } from '@/services/apiClient'
import { AuthContext } from './AuthContext'
import type { UserProfile } from './AuthContext'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [tenantId, setTenantId] = useState<string | null>(localStorage.getItem('clinicos_tenant_id'))
  const [token, setToken] = useState<string | null>(localStorage.getItem('clinicos_token'))
  const [isInitialized, setIsInitialized] = useState(false)

  const checkSession = async () => {
    const savedToken = localStorage.getItem('clinicos_token')
    if (!savedToken) {
      setUser(null)
      setToken(null)
      setIsInitialized(true)
      return
    }

    try {
      const response = await apiClient.get<{ success: boolean; data: { user: UserProfile } }>(
        '/auth/me'
      )
      if (response.success && response.data.user) {
        setUser(response.data.user)
        setToken(savedToken)
      } else {
        throw new Error('Invalid session response')
      }
    } catch {
      localStorage.removeItem('clinicos_token')
      localStorage.removeItem('clinicos_tenant_id')
      setUser(null)
      setToken(null)
      setTenantId(null)
    } finally {
      setIsInitialized(true)
    }
  }

  useEffect(() => {
    checkSession()

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'clinicos_token') {
        if (!e.newValue) {
          setUser(null)
          setToken(null)
          setTenantId(null)
        } else {
          checkSession()
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const login = async (email: string, passwordPlain: string, tId?: string) => {
    const response = await apiClient.post<{
      success: boolean
      data: { token: string; user: UserProfile }
    }>('/auth/login', { tenantId: tId, email, password: passwordPlain })

    if (response.success && response.data) {
      const { token: nextToken, user: nextUser } = response.data
      const activeTenantId = nextUser.tenantId || tId || ''
      localStorage.setItem('clinicos_token', nextToken)
      localStorage.setItem('clinicos_tenant_id', activeTenantId)
      setToken(nextToken)
      setTenantId(activeTenantId)
      setUser(nextUser)
    }
  }

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout', {})
    } catch {
      // Fallback local cleanup on disconnection
    } finally {
      localStorage.removeItem('clinicos_token')
      localStorage.removeItem('clinicos_tenant_id')
      setToken(null)
      setTenantId(null)
      setUser(null)
    }
  }

  const registerClinic = async (
    clinicName: string,
    ownerEmail: string,
    ownerPasswordPlain: string,
    ownerFullName: string
  ) => {
    await apiClient.post('/auth/register-clinic', {
      clinicName,
      ownerEmail,
      ownerPassword: ownerPasswordPlain,
      ownerFullName,
    })
  }

  const onboardStaff = async (invToken: string, fullName: string, passwordPlain: string) => {
    await apiClient.post('/auth/onboard-staff', {
      token: invToken,
      fullName,
      password: passwordPlain,
    })
  }

  const forgotPassword = async (email: string) => {
    await apiClient.post('/auth/forgot-password', { email })
  }

  const resetPassword = async (rtToken: string, passwordPlain: string) => {
    await apiClient.post('/auth/reset-password', { token: rtToken, password: passwordPlain })
  }

  const changePassword = async (passwordPlain: string, newPasswordPlain: string) => {
    await apiClient.post('/auth/change-password', {
      password: passwordPlain,
      newPassword: newPasswordPlain,
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        tenantId,
        token,
        isAuthenticated: !!user,
        isInitialized,
        login,
        logout,
        registerClinic,
        onboardStaff,
        forgotPassword,
        resetPassword,
        changePassword,
        checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
