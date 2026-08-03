import { Bell } from 'lucide-react'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { LanguageSwitcher } from '@/i18n'
import Avatar from '@/design-system/components/Avatar'
import Badge from '@/design-system/components/Badge'

export default function TopNavigation() {
  const { user } = useAuth()

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'U'
  const userRole = user?.role || 'User'

  return (
    <header
      role="banner"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 'var(--z-sticky)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        padding: '0 1.5rem',
        backgroundColor: 'var(--color-bg-surface)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
        backdropFilter: 'blur(8px)',
        boxSizing: 'border-box',
      }}
    >
      {/* Workspace Brand / Breadcrumb Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.125rem',
            fontWeight: 700,
            color: 'var(--color-text-main)',
            margin: 0,
            letterSpacing: '-0.015em',
          }}
        >
          ClinicOS Workspace
        </h1>
        <Badge variant="info">{userRole}</Badge>
      </div>

      {/* Action Controls & Profile Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Notifications Icon Button */}
        <button
          type="button"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg-base)',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
            position: 'relative',
          }}
          aria-label="View notifications"
        >
          <Bell size={18} />
          <span
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '8px',
              height: '8px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-primary)',
            }}
          />
        </button>

        {/* Internationalization Language Switcher */}
        <LanguageSwitcher />

        {/* User Profile Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <Avatar fallbackText={userInitial} size="small" />
          <span
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--color-text-main)',
              maxWidth: '160px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {user?.email || 'User'}
          </span>
        </div>
      </div>
    </header>
  )
}
