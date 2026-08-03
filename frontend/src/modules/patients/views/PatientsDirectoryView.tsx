import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { PatientProfile } from '../types/patient.types'
import { patientApi } from '../services/patientApi'
import { useAuth } from '@/modules/auth/hooks/useAuth'
import { useLanguage } from '@/i18n'
import PatientHeader from '../components/PatientHeader'
import PatientCard from '../components/PatientCard'
import PatientStatusBadge from '../components/PatientStatusBadge'
import PatientMedicalFlags from '../components/PatientMedicalFlags'
import Input from '@/design-system/components/Input'
import Button from '@/design-system/components/Button'
import Alert from '@/design-system/components/Alert'
import Loader from '@/design-system/components/Loader'
import { UserPlus, Eye, Users, ShieldCheck } from 'lucide-react'

export default function PatientsDirectoryView() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { language } = useLanguage()

  const [patients, setPatients] = useState<PatientProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [genderFilter, setGenderFilter] = useState<string>('ALL')

  const isSuperAdmin = user?.role === 'PlatformSuperAdmin'

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      try {
        setLoading(true)
        setErrorMsg('')
        const list = await patientApi.listPatients(statusFilter, searchTerm)
        if (isMounted) setPatients(list)
      } catch (err: unknown) {
        if (isMounted) {
          const error = err as { message?: string }
          setErrorMsg(error.message || 'Failed to load patients directory.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (!isSuperAdmin) {
      load()
    } else {
      setLoading(false)
    }

    return () => {
      isMounted = false
    }
  }, [statusFilter, searchTerm, isSuperAdmin])

  const filteredPatients = patients.filter((p) => {
    return genderFilter === 'ALL' || p.gender === genderFilter
  })

  // Render SuperAdmin redirection banner if logged in as PlatformSuperAdmin
  if (isSuperAdmin) {
    return (
      <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '1.5rem' }}>
        <PatientCard>
          <div style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60px',
                height: '60px',
                borderRadius: 'var(--radius-xl)',
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                color: 'var(--color-primary)',
                marginBottom: '1.25rem',
              }}
            >
              <ShieldCheck size={32} />
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--color-text-main)',
                marginBottom: '0.75rem',
              }}
            >
              {language === 'ar' ? 'وضع المشرف الرئيسي للمنصة' : 'Platform SuperAdmin Mode'}
            </h2>
            <p
              style={{
                fontSize: '0.95rem',
                color: 'var(--color-text-muted)',
                maxWidth: '600px',
                margin: '0 auto 1.75rem auto',
                lineHeight: 1.6,
              }}
            >
              {language === 'ar'
                ? 'أهلاً بك في ClinicOS. بصفتك مشرف المنصة الرئيسي (Platform SuperAdmin)، يرجى الانتقال إلى لوحة تحكم المنصة لإدارة العيادات، التراخيص، الاشتراكات ومحرك المزامنة.'
                : 'Welcome to ClinicOS. As a Platform SuperAdmin, please navigate to the Platform Control Panel to manage clinic tenants, subscriptions, device licenses, and synchronization telemetry.'}
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/platform-control')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                fontSize: '0.95rem',
              }}
            >
              <ShieldCheck size={18} />
              <span>{language === 'ar' ? 'الانتقال للوحة تحكم المنصة' : 'Go to Platform Control Panel'}</span>
            </Button>
          </div>
        </PatientCard>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>
      <PatientHeader
        title={language === 'ar' ? 'سجل المرضى الرئيسي' : 'Patients Master Index'}
        subtitle={language === 'ar' ? 'دليل المرضى المركزي والبيانات الشخصية والطبية' : 'Central Master Patient Directory & Demographics Registry'}
        breadcrumbs={[
          { label: language === 'ar' ? 'الرئيسية' : 'Dashboard', href: '/dashboard' },
          { label: language === 'ar' ? 'دليل المرضى' : 'Patients Directory' },
        ]}
        actions={
          <Button
            variant="primary"
            onClick={() => navigate('/dashboard/patients/new')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <UserPlus size={16} />
            <span>{language === 'ar' ? 'تسجيل مريض جديد' : 'Register New Patient'}</span>
          </Button>
        }
      />

      {errorMsg && (
        <Alert variant="danger" title={language === 'ar' ? 'خطأ في التحميل' : 'Error'} style={{ marginBottom: '1.5rem' }}>
          {errorMsg}
        </Alert>
      )}

      <PatientCard>
        {/* Search & Toolbar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ flex: '1 1 280px' }}>
            <Input
              placeholder={language === 'ar' ? 'البحث بالاسم، كود المريض، الهاتف...' : 'Search by name, patient code, phone, or national ID...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              {language === 'ar' ? 'الحالة:' : 'Status:'}
            </span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: '0.875rem',
                backgroundColor: 'var(--color-bg-surface)',
                color: 'var(--color-text-main)',
              }}
            >
              <option value="ALL">{language === 'ar' ? 'جميع الحالات' : 'All Statuses'}</option>
              <option value="ACTIVE">{language === 'ar' ? 'نشط' : 'Active'}</option>
              <option value="INACTIVE">{language === 'ar' ? 'غير نشط' : 'Inactive'}</option>
              <option value="ARCHIVED">{language === 'ar' ? 'مؤرشف' : 'Archived'}</option>
            </select>

            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              {language === 'ar' ? 'النوع:' : 'Gender:'}
            </span>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: '0.875rem',
                backgroundColor: 'var(--color-bg-surface)',
                color: 'var(--color-text-main)',
              }}
            >
              <option value="ALL">{language === 'ar' ? 'جميع الأنواع' : 'All Genders'}</option>
              <option value="female">{language === 'ar' ? 'أنثى' : 'Female'}</option>
              <option value="male">{language === 'ar' ? 'ذكر' : 'Male'}</option>
            </select>
          </div>
        </div>

        {/* Master Patient Table */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem 0' }}>
            <Loader size="medium" />
          </div>
        ) : filteredPatients.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
            <Users size={44} style={{ marginBottom: '0.75rem', strokeWidth: 1.5 }} />
            <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--color-text-main)' }}>
              {language === 'ar' ? 'لا يوجد سجلات مرضى' : 'No Patient Records Found'}
            </h4>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              {language === 'ar' ? 'لم يتم العثور على نتائج مطابقة لاستعلام البحث.' : 'No patients match your search query and selected filter options.'}
            </p>
          </div>
        ) : (
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'start' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>{language === 'ar' ? 'اسم المريض' : 'Patient Name'}</th>
                  <th style={{ padding: '0.75rem 1rem' }}>{language === 'ar' ? 'كود المريض' : 'Patient Code'}</th>
                  <th style={{ padding: '0.75rem 1rem' }}>{language === 'ar' ? 'رقم الهاتف' : 'Primary Phone'}</th>
                  <th style={{ padding: '0.75rem 1rem' }}>{language === 'ar' ? 'الحالة الطبية' : 'Medical Flags'}</th>
                  <th style={{ padding: '0.75rem 1rem' }}>{language === 'ar' ? 'الحالة' : 'Status'}</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'end' }}>{language === 'ar' ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((pat) => (
                  <tr key={pat.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                      {pat.fullName}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                      {pat.patientCode}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-main)' }}>
                      {pat.primaryPhone}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <PatientMedicalFlags
                        allergiesFlag={pat.allergiesFlag}
                        chronicDiseaseFlag={pat.chronicDiseaseFlag}
                        insuranceFlag={pat.insuranceFlag}
                      />
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <PatientStatusBadge status={pat.status} />
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'end' }}>
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/dashboard/patients/${pat.id}`)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.65rem' }}
                      >
                        <Eye size={14} />
                        <span>{language === 'ar' ? 'الملف الشخصي' : 'View Profile'}</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PatientCard>
    </div>
  )
}
