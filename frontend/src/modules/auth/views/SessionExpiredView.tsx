import AuthCard from '../components/AuthCard'
import AuthHeader from '../components/AuthHeader'
import AuthFooter from '../components/AuthFooter'
import Alert from '@/design-system/components/Alert'
import Button from '@/design-system/components/Button'
import { useNavigate } from 'react-router-dom'

export default function SessionExpiredView() {
  const navigate = useNavigate()

  return (
    <AuthCard>
      <AuthHeader title="Session Expired" subtitle="Security timeout due to inactivity" />

      <Alert variant="warning" title="Timeout Warning" style={{ marginBottom: '1.5rem' }}>
        For security compliance with healthcare standards, your active session has automatically
        expired after inactivity.
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
        <p>Any unsaved changes have been locked. Please sign in again to restore access.</p>
      </div>

      <Button
        type="button"
        variant="primary"
        onClick={() => navigate('/auth/login')}
        style={{ width: '100%', padding: '0.75rem' }}
      >
        Return to Login
      </Button>

      <AuthFooter links={[{ label: 'Go to Home', to: '/' }]} />
    </AuthCard>
  )
}
