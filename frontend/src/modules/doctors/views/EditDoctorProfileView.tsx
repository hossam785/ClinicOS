import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { doctorApi } from '../services/doctorApi'
import DoctorHeader from '../components/DoctorHeader'
import DoctorCard from '../components/DoctorCard'
import Input from '@/design-system/components/Input'
import Button from '@/design-system/components/Button'
import Alert from '@/design-system/components/Alert'
import Loader from '@/design-system/components/Loader'
import { Save, ArrowLeft } from 'lucide-react'

export default function EditDoctorProfileView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [legalName, setLegalName] = useState('')
  const [medicalTitle, setMedicalTitle] = useState('Dr.')
  const [primarySpecialty, setPrimarySpecialty] = useState('')
  const [department, setDepartment] = useState('')
  const [primaryEmail, setPrimaryEmail] = useState('')
  const [primaryPhone, setPrimaryPhone] = useState('')
  const [biography, setBiography] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    let isMounted = true
    const loadDoctor = async () => {
      const docId = id || 'doc-101'
      try {
        setLoading(true)
        setErrorMsg('')
        const doc = await doctorApi.getDoctorById(docId)
        if (isMounted && doc) {
          setLegalName(doc.legalName)
          setMedicalTitle(doc.medicalTitle)
          setPrimarySpecialty(doc.primarySpecialty)
          setDepartment(doc.department)
          setPrimaryEmail(doc.primaryEmail)
          setPrimaryPhone(doc.primaryPhone)
          setBiography(doc.biography || '')
        }
      } catch (err: unknown) {
        if (isMounted) {
          const error = err as { message?: string }
          setErrorMsg(error.message || 'Failed to load doctor profile.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadDoctor()
    return () => {
      isMounted = false
    }
  }, [id])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!legalName.trim()) {
      setErrorMsg('Legal Name is required.')
      return
    }
    if (!primaryEmail.trim()) {
      setErrorMsg('Primary Email is required.')
      return
    }

    const docId = id || 'doc-101'
    try {
      setSaving(true)
      setErrorMsg('')
      setSavedSuccess(false)

      await doctorApi.updateDoctorProfile(docId, {
        legalName: legalName.trim(),
        medicalTitle,
        primarySpecialty: primarySpecialty.trim(),
        department: department.trim(),
        primaryEmail: primaryEmail.trim(),
        primaryPhone: primaryPhone.trim(),
        biography: biography.trim(),
      })

      setSavedSuccess(true)
    } catch (err: unknown) {
      const error = err as { message?: string }
      setErrorMsg(error.message || 'Failed to save doctor profile changes.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '350px' }}>
        <Loader size="large" />
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem' }}>
      <DoctorHeader
        title="Edit Doctor Profile"
        subtitle={`Updating professional details for ${legalName}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Doctors Directory', href: '/dashboard/doctors' },
          { label: legalName, href: `/dashboard/doctors/${id || 'doc-101'}` },
          { label: 'Edit Profile' },
        ]}
        actions={
          <Button
            variant="outline"
            onClick={() => navigate(`/dashboard/doctors/${id || 'doc-101'}`)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ArrowLeft size={16} />
            <span>Cancel</span>
          </Button>
        }
      />

      {savedSuccess && (
        <Alert variant="info" title="Profile Saved" style={{ marginBottom: '1.5rem' }}>
          Doctor professional profile details have been updated successfully.
        </Alert>
      )}

      {errorMsg && (
        <Alert variant="danger" title="Validation Error" style={{ marginBottom: '1.5rem' }}>
          {errorMsg}
        </Alert>
      )}

      <form onSubmit={handleSave}>
        <DoctorCard title="Professional Identification">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Medical Title *
              </label>
              <select
                value={medicalTitle}
                onChange={(e) => setMedicalTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.875rem',
                  backgroundColor: 'var(--color-bg-surface)',
                  color: 'var(--color-text-main)',
                }}
              >
                <option value="Dr.">Dr.</option>
                <option value="Prof.">Prof.</option>
                <option value="Consultant">Consultant</option>
              </select>
            </div>

            <div>
              <Input
                label="Full Legal Name *"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                required
              />
            </div>

            <div>
              <Input
                label="Primary Specialty *"
                value={primarySpecialty}
                onChange={(e) => setPrimarySpecialty(e.target.value)}
                required
              />
            </div>

            <div>
              <Input
                label="Assigned Department *"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              />
            </div>
          </div>
        </DoctorCard>

        <DoctorCard title="Contact Channels">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <Input
              label="Primary Email Address *"
              type="email"
              value={primaryEmail}
              onChange={(e) => setPrimaryEmail(e.target.value)}
              required
            />
            <Input
              label="Primary Phone Number *"
              value={primaryPhone}
              onChange={(e) => setPrimaryPhone(e.target.value)}
              required
            />
          </div>
        </DoctorCard>

        <DoctorCard title="Biography & Clinical Focus">
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}>
              Practitioner Biography
            </label>
            <textarea
              rows={4}
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                fontSize: '0.875rem',
                backgroundColor: 'var(--color-bg-surface)',
                color: 'var(--color-text-main)',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </DoctorCard>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <Button
            variant="outline"
            onClick={() => navigate(`/dashboard/doctors/${id || 'doc-101'}`)}
            type="button"
          >
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
