import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { PatientProfile } from '../types/patient.types'
import { patientApi } from '../services/patientApi'
import PatientHeader from '../components/PatientHeader'
import PatientCard from '../components/PatientCard'
import PatientStatusBadge from '../components/PatientStatusBadge'
import PatientMedicalFlags from '../components/PatientMedicalFlags'
import Input from '@/design-system/components/Input'
import Button from '@/design-system/components/Button'
import Alert from '@/design-system/components/Alert'
import Loader from '@/design-system/components/Loader'
import { UserPlus, Eye, Users } from 'lucide-react'

export default function PatientsDirectoryView() {
  const navigate = useNavigate()
  const [patients, setPatients] = useState<PatientProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [genderFilter, setGenderFilter] = useState<string>('ALL')

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
    load()
    return () => {
      isMounted = false
    }
  }, [statusFilter, searchTerm])

  const filteredPatients = patients.filter((p) => {
    return genderFilter === 'ALL' || p.gender === genderFilter
  })

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>
      <PatientHeader
        title="Patients Master Index"
        subtitle="Central Master Patient Directory & Demographics Registry"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Patients Directory' },
        ]}
        actions={
          <Button
            variant="primary"
            onClick={() => navigate('/dashboard/patients/new')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <UserPlus size={16} />
            <span>Register New Patient</span>
          </Button>
        }
      />

      {errorMsg && (
        <Alert variant="danger" title="Error" style={{ marginBottom: '1.5rem' }}>
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
              placeholder="Search by name, patient code, phone, or national ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Status:
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
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="ARCHIVED">Archived</option>
              <option value="DECEASED">Deceased</option>
            </select>

            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Gender:
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
              <option value="ALL">All Genders</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
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
            <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--color-text-main)' }}>No Patient Records Found</h4>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              No patients match your search query and selected filter options.
            </p>
          </div>
        ) : (
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Patient Name</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Patient Code</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Primary Phone</th>
                  <th style={{ padding: '0.75rem 1rem' }}>DOB / Gender</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Medical Flags</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
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
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-muted)' }}>
                      {pat.dateOfBirth} ({pat.gender})
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
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/dashboard/patients/${pat.id}`)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.65rem' }}
                      >
                        <Eye size={14} />
                        <span>View Profile</span>
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
