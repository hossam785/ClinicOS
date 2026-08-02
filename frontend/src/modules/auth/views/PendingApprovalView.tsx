import AuthCard from '../components/AuthCard'
import AuthHeader from '../components/AuthHeader'
import AuthFooter from '../components/AuthFooter'
import Alert from '@/design-system/components/Alert'

export default function PendingApprovalView() {
  return (
    <AuthCard>
      <AuthHeader title="Application Under Review" subtitle="Pending administrative workspace activation" />

      <Alert variant="info" title="Verification Process" style={{ marginBottom: '1.5rem' }}>
        Your clinic registration application has been submitted and is currently being verified by
        our Super Administrators.
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
        <p>
          We verify clinic details to maintain strict medical security and prevent unauthorized access.
        </p>
        <p style={{ marginTop: '0.75rem' }}>
          You will receive a confirmation email with activation instructions once approved.
        </p>
      </div>

      <AuthFooter
        links={[
          { label: 'Return to Sign In', to: '/auth/login' },
          { label: 'Contact System Support', to: '/auth/unauthorized' },
        ]}
      />
    </AuthCard>
  )
}
