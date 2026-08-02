import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import Loader from '@/design-system/components/Loader'

export default function AuthLayout() {
  const { isAuthenticated, isInitialized } = useAuth()

  if (!isInitialized) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Loader size="large" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div
      className="auth-layout"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-base)',
        padding: '1.5rem',
        boxSizing: 'border-box',
      }}
    >
      <main style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Outlet />
      </main>
    </div>
  )
}
