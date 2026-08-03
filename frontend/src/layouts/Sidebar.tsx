import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Users,
  Calendar,
  Clock,
  FileText,
  Bot,
  RefreshCw,
  BarChart3,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Activity,
} from 'lucide-react'
import { useAuth } from '@/modules/auth/hooks/useAuth'

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { user } = useAuth()

  const isSuperAdmin = user?.role === 'PlatformSuperAdmin'

  const navItems = [
    { label: 'Patients', to: '/dashboard/patients', icon: Users },
    { label: 'Appointments', to: '/dashboard/appointments', icon: Calendar },
    { label: 'Daily Queue', to: '/dashboard/queue', icon: Clock },
    { label: 'Medical Records', to: '/dashboard/records', icon: FileText },
    { label: 'AI Assistant', to: '/dashboard/ai-assistant', icon: Bot },
    { label: 'Sync Engine', to: '/dashboard/sync-engine', icon: RefreshCw },
    { label: 'Reports', to: '/dashboard/reports', icon: BarChart3 },
    ...(isSuperAdmin
      ? [{ label: 'Platform Admin', to: '/platform-control', icon: ShieldCheck }]
      : []),
  ]

  return (
    <aside
      aria-label="Main Workspace Navigation"
      style={{
        width: collapsed ? '72px' : '260px',
        minWidth: collapsed ? '72px' : '260px',
        backgroundColor: 'var(--color-bg-surface)',
        borderRight: '1px solid var(--color-border)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-fixed)',
        transition: 'width var(--transition-normal), min-width var(--transition-normal)',
        boxSizing: 'border-box',
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          padding: '1.25rem 1rem',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(59, 130, 246, 0.12)',
              color: 'var(--color-primary)',
              flexShrink: 0,
            }}
          >
            <Activity size={20} />
          </div>
          {!collapsed && (
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.125rem',
                fontWeight: 700,
                color: 'var(--color-text-main)',
                whiteSpace: 'nowrap',
              }}
            >
              ClinicOS
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg-base)',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            flexShrink: 0,
          }}
          aria-label={collapsed ? 'Expand sidebar navigation' : 'Collapse sidebar navigation'}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation Roster */}
      <nav
        style={{
          flex: 1,
          padding: '1rem 0.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.375rem',
          overflowY: 'auto',
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
                padding: '0.625rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                backgroundColor: isActive ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                transition: 'background-color var(--transition-fast), color var(--transition-fast)',
                justifyContent: collapsed ? 'center' : 'flex-start',
              })}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={20} style={{ flexShrink: 0 }} />
              {!collapsed && (
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.label}
                </span>
              )}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
