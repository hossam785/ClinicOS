import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { BloodGroup } from '../types/patient.types'
import { patientApi } from '../services/patientApi'
import PatientHeader from '../components/PatientHeader'
import PatientCard from '../components/PatientCard'
import Input from '@/design-system/components/Input'
import Button from '@/design-system/components/Button'
import Alert from '@/design-system/components/Alert'
import Loader from '@/design-system/components/Loader'
import { Save, ArrowLeft } from 'lucide-react'

export default function EditPatientProfileView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [firstName, setFirstName] = useState('')
  const [middleName, setMiddleName] = useState('')
  const [lastName, setLastName] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('female')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [nationalId, setNationalId] = useState('')
  const [primaryPhone, setPrimaryPhone] = useState('')
  const [email, setEmail] = useState('')

  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('UNKNOWN')
  const [allergiesFlag, setAllergiesFlag] = useState(false)
  const [chronicDiseaseFlag, setChronicDiseaseFlag] = useState(false)
  const [insuranceFlag, setInsuranceFlag] = useState(false)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    let isMounted = true
    const loadPatient = async () => {
      const patId = id || 'pat-101'
      try {
        setLoading(true)
        setErrorMsg('')
        const pat = await patientApi.getPatientById(patId)
        if (isMounted && pat) {
          setFirstName(pat.firstName)
          setMiddleName(pat.middleName || '')
          setLastName(pat.lastName)
          setGender(pat.gender)
          setDateOfBirth(pat.dateOfBirth)
          setNationalId(pat.nationalId || '')
          setPrimaryPhone(pat.primaryPhone)
          setEmail(pat.email || '')
          setBloodGroup(pat.bloodGroup)
          setAllergiesFlag(pat.allergiesFlag)
          setChronicDiseaseFlag(pat.chronicDiseaseFlag)
          setInsuranceFlag(pat.insuranceFlag)
        }
      } catch (err: unknown) {
        if (isMounted) {
          const error = err as { message?: string }
          setErrorMsg(error.message || 'Failed to load patient details.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadPatient()
    return () => {
      isMounted = false
    }
  }, [id])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMsg('First Name and Last Name are required.')
      return
    }

    const patId = id || 'pat-101'
    try {
      setSaving(true)
      setErrorMsg('')
      setSavedSuccess(false)

      await patientApi.updatePatient(patId, {
        firstName: firstName.trim(),
        middleName: middleName.trim() || undefined,
        lastName: lastName.trim(),
        gender,
        dateOfBirth,
        nationalId: nationalId.trim() || undefined,
        primaryPhone: primaryPhone.trim(),
        email: email.trim() || undefined,
        bloodGroup,
        allergiesFlag,
        chronicDiseaseFlag,
        insuranceFlag,
      })

      setSavedSuccess(true)
    } catch (err: unknown) {
      const error = err as { message?: string }
      setErrorMsg(error.message || 'Failed to save patient profile updates.')
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
      <PatientHeader
        title={`Edit Patient: ${firstName} ${lastName}`}
        subtitle={`Updating demographic details for Patient ID: ${id || 'pat-101'}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Patients Directory', href: '/dashboard/patients' },
          { label: `${firstName} ${lastName}`, href: `/dashboard/patients/${id || 'pat-101'}` },
          { label: 'Edit Profile' },
        ]}
        actions={
          <Button
            variant="outline"
            onClick={() => navigate(`/dashboard/patients/${id || 'pat-101'}`)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ArrowLeft size={16} />
            <span>Cancel</span>
          </Button>
        }
      />

      {savedSuccess && (
        <Alert variant="info" title="Profile Saved" style={{ marginBottom: '1.5rem' }}>
          Patient profile demographic details updated successfully.
        </Alert>
      )}

      {errorMsg && (
        <Alert variant="danger" title="Validation Error" style={{ marginBottom: '1.5rem' }}>
          {errorMsg}
        </Alert>
      )}

      <form onSubmit={handleSave}>
        <PatientCard title="Personal Information">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <Input
              label="First Name *"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Input
              label="Middle Name"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
            />
            <Input
              label="Last Name *"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                Biological Sex / Gender *
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
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
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>

            <Input
              label="Date of Birth *"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
            />

            <Input
              label="National ID / Passport"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
            />
          </div>
        </PatientCard>

        <PatientCard title="Contact Information">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <Input
              label="Primary Phone Number *"
              value={primaryPhone}
              onChange={(e) => setPrimaryPhone(e.target.value)}
              required
            />
            <Input
              label="Primary Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </PatientCard>

        <PatientCard title="Medical Indicators & Clinical Flags">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                ABO Blood Group
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
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
                <option value="UNKNOWN">Unknown</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', justifyContent: 'center' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={allergiesFlag}
                  onChange={(e) => setAllergiesFlag(e.target.checked)}
                />
                <span style={{ fontWeight: 600 }}>Known Drug / Food Allergies Declared</span>
              </label>

              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={chronicDiseaseFlag}
                  onChange={(e) => setChronicDiseaseFlag(e.target.checked)}
                />
                <span>Underlying Chronic Condition</span>
              </label>

              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={insuranceFlag}
                  onChange={(e) => setInsuranceFlag(e.target.checked)}
                />
                <span>Active Medical Insurance Coverage</span>
              </label>
            </div>
          </div>
        </PatientCard>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <Button variant="outline" onClick={() => navigate(`/dashboard/patients/${id || 'pat-101'}`)} type="button">
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={saving}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Save size={16} />
            <span>{saving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
