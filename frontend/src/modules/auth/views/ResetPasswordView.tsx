import { useSearchParams } from 'react-router-dom'
import { useAuthForm } from '../hooks/useAuthForm'
import { useAuth } from '../hooks/useAuth'
import AuthCard from '../components/AuthCard'
import AuthHeader from '../components/AuthHeader'
import AuthFooter from '../components/AuthFooter'
import PasswordInput from '../components/PasswordInput'
import Button from '@/design-system/components/Button'
import Alert from '@/design-system/components/Alert'

export default function ResetPasswordView() {
  const { resetPassword } = useAuth()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''

  const {
    values,
    errors,
    loading,
    errorMsg,
    successMsg,
    setSuccessMsg,
    setErrorMsg,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useAuthForm({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationRules: {
      password: { required: true, minLength: 10 },
      confirmPassword: { required: true, minLength: 10 },
    },
    onSubmit: async (formValues) => {
      if (formValues.password !== formValues.confirmPassword) {
        setErrorMsg('Passwords do not match. Please verify.')
        return
      }

      if (!token) {
        setErrorMsg('Password reset token is missing from the url parameters.')
        return
      }

      await resetPassword(token, formValues.password)
      setSuccessMsg('Your password has been reset successfully. You can now log in.')
    },
  })

  return (
    <AuthCard>
      <AuthHeader title="Choose New Password" subtitle="Enter your new secure account password" />

      {errorMsg && (
        <Alert variant="danger" title="Error" style={{ marginBottom: '1.5rem' }}>
          {errorMsg}
        </Alert>
      )}
      {successMsg && (
        <Alert variant="success" title="Success" style={{ marginBottom: '1.5rem' }}>
          {successMsg}
        </Alert>
      )}

      {!successMsg && (
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: '1rem' }}>
            <PasswordInput
              name="password"
              label="New Password"
              value={values.password}
              error={errors.password}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              requiredIndicator
              autoFocus
              placeholder="••••••••••••"
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <PasswordInput
              name="confirmPassword"
              label="Confirm New Password"
              value={values.confirmPassword}
              error={errors.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              requiredIndicator
              placeholder="••••••••••••"
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '1.5rem', padding: '0.75rem' }}
          >
            {loading ? 'Saving Password...' : 'Save & Update Password'}
          </Button>
        </form>
      )}

      <AuthFooter links={[{ label: 'Return to Sign In', to: '/auth/login' }]} />
    </AuthCard>
  )
}
