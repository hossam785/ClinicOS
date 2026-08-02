import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clinicApi } from '../services/clinicApi'
import ClinicHeader from '../components/ClinicHeader'
import ClinicCard from '../components/ClinicCard'
import Input from '@/design-system/components/Input'
import Button from '@/design-system/components/Button'
import Alert from '@/design-system/components/Alert'
import Loader from '@/design-system/components/Loader'
import { Save, ArrowLeft } from 'lucide-react'

export default function EditClinicProfileView() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    legalName: '',
    registrationNumber: '',
    taxId: '',
    primaryEmail: '',
    primaryPhone: '',
    timezone: 'America/New_York',
    currency: 'USD',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
  })

  const [initialLoading, setInitialLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    let isMounted = true
    const loadProfile = async () => {
      try {
        setInitialLoading(true)
        const profile = await clinicApi.getProfile()
        if (isMounted) {
          setFormData({
            name: profile.name,
            legalName: profile.legalName,
            registrationNumber: profile.registrationNumber,
            taxId: profile.taxId,
            primaryEmail: profile.primaryEmail,
            primaryPhone: profile.primaryPhone,
            timezone: profile.timezone,
            currency: profile.currency,
            addressLine1: profile.location.addressLine1 || '',
            addressLine2: profile.location.addressLine2 || '',
            city: profile.location.city || '',
            state: profile.location.state || '',
            postalCode: profile.location.postalCode || '',
            country: profile.location.country || 'United States',
          })
        }
      } catch (err: unknown) {
        if (isMounted) {
          const error = err as { message?: string }
          setErrorMsg(error.message || 'Failed to fetch current profile details.')
        }
      } finally {
        if (isMounted) setInitialLoading(false)
      }
    }
    loadProfile()
    return () => {
      isMounted = false
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Clinic name is required.'
    if (!formData.legalName.trim()) newErrors.legalName = 'Legal name is required.'
    if (!formData.registrationNumber.trim()) newErrors.registrationNumber = 'Registration number is required.'
    if (!formData.taxId.trim()) newErrors.taxId = 'Tax ID is required.'
    if (!formData.primaryEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.primaryEmail)) {
      newErrors.primaryEmail = 'Please enter a valid email address.'
    }
    if (!formData.primaryPhone.trim()) newErrors.primaryPhone = 'Primary phone is required.'
    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address Line 1 is required.'
    if (!formData.city.trim()) newErrors.city = 'City is required.'
    if (!formData.state.trim()) newErrors.state = 'State is required.'
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required.'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    try {
      setSaving(true)
      setErrorMsg('')
      setSuccessMsg('')

      await clinicApi.updateProfile({
        name: formData.name,
        legalName: formData.legalName,
        registrationNumber: formData.registrationNumber,
        taxId: formData.taxId,
        primaryEmail: formData.primaryEmail,
        primaryPhone: formData.primaryPhone,
        timezone: formData.timezone,
        currency: formData.currency,
        location: {
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
      })

      setSuccessMsg('Clinic profile and physical location updated successfully.')
    } catch (err: unknown) {
      const error = err as { message?: string }
      setErrorMsg(error.message || 'Failed to update clinic profile.')
    } finally {
      setSaving(false)
    }
  }

  if (initialLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '350px' }}>
        <Loader size="large" />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1.5rem' }}>
      <ClinicHeader
        title="Edit Clinic Profile"
        subtitle="Update registration, physical location, and contact parameters"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Clinic Settings', href: '/dashboard/clinic/profile' },
          { label: 'Edit Profile' },
        ]}
        actions={
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard/clinic/profile')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ArrowLeft size={16} />
            <span>Cancel & Return</span>
          </Button>
        }
      />

      {errorMsg && (
        <Alert variant="danger" title="Operation Failed" style={{ marginBottom: '1.5rem' }}>
          {errorMsg}
        </Alert>
      )}
      {successMsg && (
        <Alert variant="success" title="Success" style={{ marginBottom: '1.5rem' }}>
          {successMsg}
        </Alert>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* General Metadata */}
        <ClinicCard title="Official Identity & Metadata">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <Input
              name="name"
              label="Clinic Operating Name"
              value={formData.name}
              error={errors.name}
              onChange={handleChange}
              disabled={saving}
              requiredIndicator
            />
            <Input
              name="legalName"
              label="Legal Corporate Name"
              value={formData.legalName}
              error={errors.legalName}
              onChange={handleChange}
              disabled={saving}
              requiredIndicator
            />
            <Input
              name="registrationNumber"
              label="Medical Registration Code"
              value={formData.registrationNumber}
              error={errors.registrationNumber}
              onChange={handleChange}
              disabled={saving}
              requiredIndicator
            />
            <Input
              name="taxId"
              label="Tax Identifier"
              value={formData.taxId}
              error={errors.taxId}
              onChange={handleChange}
              disabled={saving}
              requiredIndicator
            />
          </div>
        </ClinicCard>

        {/* Contact Information */}
        <ClinicCard title="Communication Channels">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <Input
              name="primaryEmail"
              type="email"
              label="Primary Contact Email"
              value={formData.primaryEmail}
              error={errors.primaryEmail}
              onChange={handleChange}
              disabled={saving}
              requiredIndicator
            />
            <Input
              name="primaryPhone"
              label="Primary Contact Phone"
              value={formData.primaryPhone}
              error={errors.primaryPhone}
              onChange={handleChange}
              disabled={saving}
              requiredIndicator
            />
          </div>
        </ClinicCard>

        {/* Physical Address */}
        <ClinicCard title="Physical Facility Location">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <Input
              name="addressLine1"
              label="Street Address Line 1"
              value={formData.addressLine1}
              error={errors.addressLine1}
              onChange={handleChange}
              disabled={saving}
              requiredIndicator
            />
            <Input
              name="addressLine2"
              label="Suite / Unit / Floor"
              value={formData.addressLine2}
              onChange={handleChange}
              disabled={saving}
            />
            <Input
              name="city"
              label="City"
              value={formData.city}
              error={errors.city}
              onChange={handleChange}
              disabled={saving}
              requiredIndicator
            />
            <Input
              name="state"
              label="State / Province"
              value={formData.state}
              error={errors.state}
              onChange={handleChange}
              disabled={saving}
              requiredIndicator
            />
            <Input
              name="postalCode"
              label="Postal Code"
              value={formData.postalCode}
              error={errors.postalCode}
              onChange={handleChange}
              disabled={saving}
              requiredIndicator
            />
            <Input
              name="country"
              label="Country"
              value={formData.country}
              onChange={handleChange}
              disabled={saving}
            />
          </div>
        </ClinicCard>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
          <Button variant="outline" type="button" onClick={() => navigate('/dashboard/clinic/profile')}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={saving}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Save size={16} />
            <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
