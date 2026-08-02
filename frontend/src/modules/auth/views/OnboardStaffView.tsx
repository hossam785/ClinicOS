import { useSearchParams } from 'react-router-dom'
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
    title: 'تسجيل عيادة / دكتور جديد',
    subtitle: 'أنشئ حسابك للبدء في استخدام نظام إدارة العيادة ClinicOS',
    titleInvite: 'تفعيل حساب العضو المدعو',
    subtitleInvite: 'أكمل بيانات التسجيل للانضمام إلى فريق العيادة',
    clinicNameLabel: 'اسم العيادة',
    clinicNamePlaceholder: 'مثال: عيادة النور التخصصية',
    doctorNameLabel: 'اسم الدكتور / المسؤول',
    doctorNamePlaceholder: 'مثال: د. حسام حمادة',
    emailLabel: 'البريد الإلكتروني',
    emailPlaceholder: 'doctor@clinic.com',
    passwordLabel: 'كلمة المرور',
    confirmPasswordLabel: 'تأكيد كلمة المرور',
    submitBtn: 'إنشاء الحساب والتسجيل',
    submitting: 'جاري إنشاء الحساب...',
    returnToLogin: 'العودة لتسجيل الدخول',
    errorTitle: 'خطأ في البيانات',
    successTitle: 'تم التسجيل بنجاح',
    passwordMismatch: 'كلمتا المرور غير متطابقتين. يرجى التأكد.',
    successMsg: 'تم تسجيل الحساب بنجاح! يمكنك الآن تسجيل الدخول إلى عيادتك.',
  },
  en: {
    title: 'Register New Clinic / Doctor',
    subtitle: 'Create your account to start managing your practice with ClinicOS',
    titleInvite: 'Activate Staff Account',
    subtitleInvite: 'Complete registration details to join your clinic team',
    clinicNameLabel: 'Clinic Name',
    clinicNamePlaceholder: 'e.g. Al-Noor Speciality Clinic',
    doctorNameLabel: 'Doctor / Owner Full Name',
    doctorNamePlaceholder: 'e.g. Dr. John Doe',
    emailLabel: 'Email Address',
    emailPlaceholder: 'doctor@clinic.com',
    passwordLabel: 'Password',
    confirmPasswordLabel: 'Confirm Password',
    submitBtn: 'Register Clinic Account',
    submitting: 'Creating Account...',
    returnToLogin: 'Return to Sign In',
    errorTitle: 'Registration Error',
    successTitle: 'Registration Successful',
    passwordMismatch: 'Passwords do not match. Please verify.',
    successMsg: 'Account created successfully! You can now sign in.',
  },
}

export default function OnboardStaffView() {
  const { registerClinic, onboardStaff } = useAuth()
  const { language } = useLanguage()
  const t = content[language === 'ar' ? 'ar' : 'en']
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
      clinicName: '',
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationRules: {
      clinicName: token ? {} : { required: true },
      fullName: { required: true },
      email: token ? {} : { required: true, isEmail: true },
      password: { required: true, minLength: 10 },
      confirmPassword: { required: true, minLength: 10 },
    },
    onSubmit: async (formValues) => {
      if (formValues.password !== formValues.confirmPassword) {
        setErrorMsg(t.passwordMismatch)
        return
      }

      if (token) {
        await onboardStaff(token, formValues.fullName, formValues.password)
      } else {
        await registerClinic(
          formValues.clinicName,
          formValues.email,
          formValues.password,
          formValues.fullName
        )
      }

      setSuccessMsg(t.successMsg)
    },
  })

  return (
    <AuthCard>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
        <LanguageSwitcher />
      </div>

      <AuthHeader
        title={token ? t.titleInvite : t.title}
        subtitle={token ? t.subtitleInvite : t.subtitle}
      />

      {errorMsg && (
        <Alert variant="danger" title={t.errorTitle} style={{ marginBottom: '1.5rem' }}>
          {errorMsg}
        </Alert>
      )}
      {successMsg && (
        <Alert variant="success" title={t.successTitle} style={{ marginBottom: '1.5rem' }}>
          {successMsg}
        </Alert>
      )}

      {!successMsg && (
        <form onSubmit={handleSubmit} noValidate>
          {!token && (
            <div style={{ marginBottom: '1rem' }}>
              <Input
                name="clinicName"
                label={t.clinicNameLabel}
                value={values.clinicName}
                error={errors.clinicName}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                requiredIndicator
                autoFocus
                placeholder={t.clinicNamePlaceholder}
              />
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <Input
              name="fullName"
              label={t.doctorNameLabel}
              value={values.fullName}
              error={errors.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              requiredIndicator
              autoFocus={!!token}
              placeholder={t.doctorNamePlaceholder}
            />
          </div>

          {!token && (
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
                placeholder={t.emailPlaceholder}
              />
            </div>
          )}

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

          <div style={{ marginBottom: '1rem' }}>
            <PasswordInput
              name="confirmPassword"
              label={t.confirmPasswordLabel}
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
            {loading ? t.submitting : t.submitBtn}
          </Button>
        </form>
      )}

      <AuthFooter links={[{ label: t.returnToLogin, to: '/auth/login' }]} />
    </AuthCard>
  )
}
