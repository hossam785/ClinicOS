import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import Loader from '@/design-system/components/Loader'
import { LanguageSwitcher } from '@/i18n'
import Sidebar from './Sidebar'

export default function DashboardLayout() {
  const { isAuthenticated, isInitialized } = useAuth()

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
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 'var(--z-sticky)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.875rem 1.5rem',
            backgroundColor: 'var(--color-bg-surface)',
            borderBottom: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--color-text-main)',
                margin: 0,
              }}
            >
              ClinicOS Workspace
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <LanguageSwitcher />
          </div>
        </header>

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
