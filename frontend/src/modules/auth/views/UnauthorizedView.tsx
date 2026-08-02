import AuthCard from '../components/AuthCard'
import AuthHeader from '../components/AuthHeader'
import AuthFooter from '../components/AuthFooter'
import Alert from '@/design-system/components/Alert'

export default function UnauthorizedView() {
  return (
    <AuthCard>
      <AuthHeader title="Access Denied" subtitle="Unauthorized workspace transaction" />

      <Alert variant="danger" title="Permissions Required" style={{ marginBottom: '1.5rem' }}>
        You do not possess the required clinical or administrative role permissions to access this
        resource path.
      </Alert>

      <div
        style={{
          color: 'var(--color-text-muted)',
          fontSize: '0.875rem',
          lineHeight: '1.5',
          textAlign: 'center',
          marginBottom: '2rem',
        }}
      >
        <p>If you require access, please contact your Clinic Owner to review your role scopes.</p>
      </div>

      <AuthFooter
        links={[
          { label: 'Return to Sign In', to: '/auth/login' },
          { label: 'Go to Home', to: '/' },
        ]}
      />
    </AuthCard>
  )
}
