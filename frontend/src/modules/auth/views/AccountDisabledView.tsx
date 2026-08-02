import AuthCard from '../components/AuthCard'
import AuthHeader from '../components/AuthHeader'
import AuthFooter from '../components/AuthFooter'
import Alert from '@/design-system/components/Alert'

export default function AccountDisabledView() {
  return (
    <AuthCard>
      <AuthHeader title="Workspace Suspended" subtitle="Access has been disabled" />

      <Alert variant="danger" title="Access Denied" style={{ marginBottom: '1.5rem' }}>
        This account or clinic workspace has been suspended due to unresolved subscription terms or
        system policy violations.
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
        <p>If you believe this is an error, please contact your clinic administrator.</p>
        <p style={{ marginTop: '0.75rem' }}>
          For platform subscription queries, contact ClinicOS billing support.
        </p>
      </div>

      <AuthFooter links={[{ label: 'Return to Sign In', to: '/auth/login' }]} />
    </AuthCard>
  )
}
