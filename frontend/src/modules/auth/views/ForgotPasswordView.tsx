import { useAuthForm } from '../hooks/useAuthForm'
import { useAuth } from '../hooks/useAuth'
import AuthCard from '../components/AuthCard'
import AuthHeader from '../components/AuthHeader'
import AuthFooter from '../components/AuthFooter'
import Input from '@/design-system/components/Input'
import Button from '@/design-system/components/Button'
import Alert from '@/design-system/components/Alert'

export default function ForgotPasswordView() {
  const { forgotPassword } = useAuth()

  const {
    values,
    errors,
    loading,
    errorMsg,
    successMsg,
    setSuccessMsg,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useAuthForm({
    initialValues: {
      email: '',
    },
    validationRules: {
      email: { required: true, isEmail: true },
    },
    onSubmit: async (formValues) => {
      await forgotPassword(formValues.email)
      setSuccessMsg('If the email exists, a password reset link has been dispatched to it.')
    },
  })

  return (
    <AuthCard>
      <AuthHeader title="Reset Password" subtitle="Request a secure password recovery link" />

      {errorMsg && (
        <Alert variant="danger" title="Error" style={{ marginBottom: '1.5rem' }}>
          {errorMsg}
        </Alert>
      )}
      {successMsg && (
        <Alert variant="success" title="Email Sent" style={{ marginBottom: '1.5rem' }}>
          {successMsg}
        </Alert>
      )}

      {!successMsg && (
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: '1rem' }}>
            <Input
              name="email"
              type="email"
              label="Email Address"
              value={values.email}
              error={errors.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              requiredIndicator
              autoFocus
              placeholder="name@clinic.com"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '1.5rem', padding: '0.75rem' }}
          >
            {loading ? 'Sending Recovery Link...' : 'Send Recovery Link'}
          </Button>
        </form>
      )}

      <AuthFooter links={[{ label: 'Return to Sign In', to: '/auth/login' }]} />
    </AuthCard>
  )
}
