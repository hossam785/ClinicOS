import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import Loader from '@/design-system/components/Loader'
import { LanguageSwitcher } from '@/i18n'

export default function DashboardLayout() {
  const { isAuthenticated, isInitialized } = useAuth()

  if (!isInitialized) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Loader size="large" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">{/* Navigation placeholder */}</aside>
      <div className="main-content">
        <header className="topbar flex items-center justify-end p-4 border-b border-slate-800 bg-slate-950">
          <LanguageSwitcher />
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
