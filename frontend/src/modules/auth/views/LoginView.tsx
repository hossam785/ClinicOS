import { useAuthForm } from '../hooks/useAuthForm'
import { useAuth } from '../hooks/useAuth'
import AuthCard from '../components/AuthCard'
import AuthHeader from '../components/AuthHeader'
import AuthFooter from '../components/AuthFooter'
import PasswordInput from '../components/PasswordInput'
import Input from '@/design-system/components/Input'
import Button from '@/design-system/components/Button'
import Alert from '@/design-system/components/Alert'
import { LanguageSwitcher, useLanguage } from '@/i18n'

const content = {
  ar: {
    title: 'تسجيل الدخول إلى ClinicOS',
    subtitle: 'الوصول إلى لوحة التحكم بمساحة العمل',
    emailLabel: 'البريد الإلكتروني',
    passwordLabel: 'كلمة المرور',
    signIn: 'تسجيل الدخول',
    signingIn: 'جاري تسجيل الدخول...',
    forgotPassword: 'نسيت كلمة المرور؟',
    registerStaff: 'تسجيل عضو فريق جديد',
    checkStatus: 'متابعة حالة الطلب',
    accessDenied: 'تم رفض الوصول',
    success: 'تم بنجاح',
  },
  en: {
    title: 'Sign in to ClinicOS',
    subtitle: 'Access your workspace dashboard',
    emailLabel: 'Email Address',
    passwordLabel: 'Password',
    signIn: 'Sign In',
    signingIn: 'Sign In...',
    forgotPassword: 'Forgot Password?',
    registerStaff: 'Register New Staff Member',
    checkStatus: 'Check Review Status',
    accessDenied: 'Access Denied',
    success: 'Success',
  },
}

export default function LoginView() {
  const { login } = useAuth()
  const { language } = useLanguage()
  const t = content[language === 'ar' ? 'ar' : 'en']

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
      email: '',
      password: '',
    },
    validationRules: {
      email: { required: true, isEmail: true },
      password: { required: true, minLength: 10 },
    },
    onSubmit: async (formValues) => {
      await login(formValues.email, formValues.password)
    },
  })

  return (
    <AuthCard>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
        <LanguageSwitcher />
      </div>

      <AuthHeader title={t.title} subtitle={t.subtitle} />

      {errorMsg && (
        <Alert variant="danger" title={t.accessDenied} style={{ marginBottom: '1.5rem' }}>
          {errorMsg}
        </Alert>
      )}
      {successMsg && (
        <Alert variant="success" title={t.success} style={{ marginBottom: '1.5rem' }}>
          {successMsg}
        </Alert>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: '1rem' }}>
          <Input
            name="email"
            type="email"
            label={t.emailLabel}
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

        <div style={{ marginBottom: '1rem' }}>
          <PasswordInput
            name="password"
            label={t.passwordLabel}
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
          {loading ? t.signingIn : t.signIn}
        </Button>
      </form>

      <AuthFooter
        links={[
          { label: t.forgotPassword, to: '/auth/forgot-password' },
          { label: t.registerStaff, to: '/auth/onboard' },
          { label: t.checkStatus, to: '/auth/pending-approval' },
        ]}
      />
    </AuthCard>
  )
}
