import { useAuthForm } from '../hooks/useAuthForm'
import { useAuth } from '../hooks/useAuth'
import AuthCard from '../components/AuthCard'
import AuthHeader from '../components/AuthHeader'
import AuthFooter from '../components/AuthFooter'
import PasswordInput from '../components/PasswordInput'
import Input from '@/design-system/components/Input'
import Button from '@/design-system/components/Button'
import Alert from '@/design-system/components/Alert'

export default function LoginView() {
  const { login } = useAuth()

  const {
    values,
    errors,
    loading,
    errorMsg,
    successMsg,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useAuthForm({
    initialValues: {
      tenantId: '',
      email: '',
      password: '',
    },
    validationRules: {
      tenantId: { required: true },
      email: { required: true, isEmail: true },
      password: { required: true, minLength: 10 },
    },
    onSubmit: async (formValues) => {
      await login(formValues.tenantId, formValues.email, formValues.password)
    },
  })

  return (
    <AuthCard>
      <AuthHeader title="Sign in to ClinicOS" subtitle="Access your workspace dashboard" />

      {errorMsg && (
        <Alert variant="danger" title="Access Denied" style={{ marginBottom: '1.5rem' }}>
          {errorMsg}
        </Alert>
      )}
      {successMsg && (
        <Alert variant="success" title="Success" style={{ marginBottom: '1.5rem' }}>
          {successMsg}
        </Alert>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: '1rem' }}>
          <Input
            name="tenantId"
            label="Tenant ID / Clinic Code"
            value={values.tenantId}
            error={errors.tenantId}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={loading}
            requiredIndicator
            autoFocus
            placeholder="e.g. clinic-101"
          />
        </div>

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
            placeholder="name@clinic.com"
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <PasswordInput
            name="password"
            label="Password"
            value={values.password}
            error={errors.password}
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
          {loading ? 'Sign In...' : 'Sign In'}
        </Button>
      </form>

      <AuthFooter
        links={[
          { label: 'Forgot Password?', to: '/auth/forgot-password' },
          { label: 'Register New Staff Member', to: '/auth/onboard' },
          { label: 'Check Review Status', to: '/auth/pending-approval' },
        ]}
      />
    </AuthCard>
  )
}
