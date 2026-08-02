import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { BloodGroup } from '../types/patient.types'
import { patientApi } from '../services/patientApi'
import PatientHeader from '../components/PatientHeader'
import PatientCard from '../components/PatientCard'
import Input from '@/design-system/components/Input'
import Button from '@/design-system/components/Button'
import Alert from '@/design-system/components/Alert'
import { UserPlus, ArrowLeft } from 'lucide-react'

export default function CreatePatientView() {
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

  const [emergencyName, setEmergencyName] = useState('')
  const [emergencyRelationship, setEmergencyRelationship] = useState('')
  const [emergencyPhone, setEmergencyPhone] = useState('')

  const [errorMsg, setErrorMsg] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMsg('First Name and Last Name are required.')
      return
    }
    if (!dateOfBirth) {
      setErrorMsg('Date of Birth is required.')
      return
    }
    if (!primaryPhone.trim()) {
      setErrorMsg('Primary Phone Number is required.')
      return
    }

    try {
      setSaving(true)
      setErrorMsg('')

      const created = await patientApi.createPatient({
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
        emergencyContact: emergencyName.trim()
          ? {
              name: emergencyName.trim(),
              relationship: emergencyRelationship.trim(),
              phone: emergencyPhone.trim(),
            }
          : undefined,
      })

      navigate(`/dashboard/patients/${created.id}`)
    } catch (err: unknown) {
      const error = err as { message?: string }
      setErrorMsg(error.message || 'Failed to register patient.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem' }}>
      <PatientHeader
        title="Register New Patient"
        subtitle="Create a new Master Patient Index record in the clinic workspace"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Patients Directory', href: '/dashboard/patients' },
          { label: 'Register New Patient' },
        ]}
        actions={
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard/patients')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ArrowLeft size={16} />
            <span>Cancel</span>
          </Button>
        }
      />

      {errorMsg && (
        <Alert variant="danger" title="Validation Error" style={{ marginBottom: '1.5rem' }}>
          {errorMsg}
        </Alert>
      )}

      <form onSubmit={handleSave}>
        {/* Personal Demographics Card */}
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
              placeholder="e.g. 1098237465"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
            />
          </div>
        </PatientCard>

        {/* Contact Channels Card */}
        <PatientCard title="Contact Information">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <Input
              label="Primary Phone Number *"
              placeholder="e.g. +12025550142"
              value={primaryPhone}
              onChange={(e) => setPrimaryPhone(e.target.value)}
              required
            />
            <Input
              label="Primary Email Address"
              type="email"
              placeholder="e.g. john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </PatientCard>

        {/* Emergency Contact Card */}
        <PatientCard title="Emergency Contact Details">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <Input
              label="Emergency Contact Name"
              placeholder="e.g. Thomas Vance"
              value={emergencyName}
              onChange={(e) => setEmergencyName(e.target.value)}
            />
            <Input
              label="Relationship"
              placeholder="e.g. Spouse, Brother, Parent"
              value={emergencyRelationship}
              onChange={(e) => setEmergencyRelationship(e.target.value)}
            />
            <Input
              label="Emergency Phone"
              placeholder="e.g. +12025550199"
              value={emergencyPhone}
              onChange={(e) => setEmergencyPhone(e.target.value)}
            />
          </div>
        </PatientCard>

        {/* Medical Flags & Blood Group Card */}
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

        {/* Submit Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <Button variant="outline" onClick={() => navigate('/dashboard/patients')} type="button">
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={saving}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <UserPlus size={16} />
            <span>{saving ? 'Creating Profile...' : 'Save Patient Profile'}</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
