import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ClinicProfile } from '../types/clinic.types'
import { clinicApi } from '../services/clinicApi'
import ClinicHeader from '../components/ClinicHeader'
import ClinicCard from '../components/ClinicCard'
import OperatingHoursTable from '../components/OperatingHoursTable'
import Button from '@/design-system/components/Button'
import Alert from '@/design-system/components/Alert'
import Loader from '@/design-system/components/Loader'
import { Building2, MapPin, Phone, Mail, Clock, Calendar, Edit3, FileText, Globe } from 'lucide-react'

export default function ClinicProfileView() {
  const [profile, setProfile] = useState<ClinicProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true
    const fetchProfile = async () => {
      try {
        setLoading(true)
        setErrorMsg('')
        const data = await clinicApi.getProfile()
        if (isMounted) setProfile(data)
      } catch (err: unknown) {
        if (isMounted) {
          const error = err as { message?: string }
          setErrorMsg(error.message || 'Failed to fetch clinic profile data.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchProfile()
    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '350px' }}>
        <Loader size="large" />
      </div>
    )
  }

  if (errorMsg || !profile) {
    return (
      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1.5rem' }}>
        <Alert variant="danger" title="Error Loading Profile">
          {errorMsg || 'Unable to retrieve workspace profile.'}
        </Alert>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>
      <ClinicHeader
        title={profile.name}
        subtitle={`Tenant ID: ${profile.tenantId}`}
        status={profile.status}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Clinic Settings' },
        ]}
        actions={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard/clinic/hours')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Clock size={16} />
              <span>Shift Hours</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard/clinic/holidays')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Calendar size={16} />
              <span>Holidays</span>
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/dashboard/clinic/profile/edit')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Edit3 size={16} />
              <span>Edit Profile</span>
            </Button>
          </div>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* General Information Card */}
        <ClinicCard title="General Information" subtitle="Official registration credentials and identity">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Building2 size={18} style={{ color: 'var(--color-primary)' }} />
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Legal Name</span>
                <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{profile.legalName}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FileText size={18} style={{ color: 'var(--color-primary)' }} />
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Medical Registration</span>
                <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{profile.registrationNumber}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FileText size={18} style={{ color: 'var(--color-primary)' }} />
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Tax Identifier</span>
                <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{profile.taxId}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Globe size={18} style={{ color: 'var(--color-primary)' }} />
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Timezone & Currency</span>
                <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>
                  {profile.timezone} ({profile.currency})
                </span>
              </div>
            </div>
          </div>
        </ClinicCard>

        {/* Contact & Location Card */}
        <ClinicCard title="Contact & Location" subtitle="Physical address and communication channels">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Mail size={18} style={{ color: 'var(--color-primary)' }} />
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Primary Email</span>
                <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{profile.primaryEmail}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Phone size={18} style={{ color: 'var(--color-primary)' }} />
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Primary Phone</span>
                <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{profile.primaryPhone}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <MapPin size={18} style={{ color: 'var(--color-primary)', marginTop: '0.2rem' }} />
              <div>
                <span style={{ color: 'var(--color-text-muted)', display: 'block' }}>Physical Address</span>
                <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>
                  {profile.location.addressLine1}
                  {profile.location.addressLine2 && `, ${profile.location.addressLine2}`}
                  <br />
                  {profile.location.city}, {profile.location.state} {profile.location.postalCode}
                  <br />
                  {profile.location.country}
                </span>
              </div>
            </div>
          </div>
        </ClinicCard>
      </div>

      {/* Operating Hours Summary Card */}
      <ClinicCard
        title="Weekly Operating Hours"
        subtitle="Current shift schedules enforced for appointment bookings"
        action={
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard/clinic/hours')}
            style={{ fontSize: '0.875rem' }}
          >
            Manage Hours
          </Button>
        }
      >
        <OperatingHoursTable schedule={profile.operatingHours} editable={false} />
      </ClinicCard>
    </div>
  )
}
