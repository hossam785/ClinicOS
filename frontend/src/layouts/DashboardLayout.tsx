import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import Loader from '@/design-system/components/Loader'
import Sidebar from './Sidebar'
import TopNavigation from './TopNavigation'

export default function DashboardLayout() {
  const { user, isAuthenticated, isInitialized } = useAuth()

  if (!isInitialized) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: 'var(--color-bg-base)',
        }}
      >
        <Loader size="large" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  if (user?.role === 'PlatformSuperAdmin' || user?.email === 'clinicos@gmail.com') {
    return <Navigate to="/platform-control" replace />
  }

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: 'var(--color-bg-base)',
        color: 'var(--color-text-main)',
        overflowX: 'hidden',
      }}
    >
      <Sidebar />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minWidth: 0,
        }}
      >
        <TopNavigation />
        <main
          style={{
            flex: 1,
            width: '100%',
            maxWidth: '1600px',
            margin: '0 auto',
            padding: 'var(--spacing-lg)',
            boxSizing: 'border-box',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
