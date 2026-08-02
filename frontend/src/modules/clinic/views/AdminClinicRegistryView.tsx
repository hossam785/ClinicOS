import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ClinicProfile } from '../types/clinic.types'
import { clinicApi } from '../services/clinicApi'
import ClinicHeader from '../components/ClinicHeader'
import ClinicCard from '../components/ClinicCard'
import ClinicStatusBadge from '../components/ClinicStatusBadge'
import Input from '@/design-system/components/Input'
import Button from '@/design-system/components/Button'
import Alert from '@/design-system/components/Alert'
import Loader from '@/design-system/components/Loader'
import { Eye, Building2 } from 'lucide-react'

export default function AdminClinicRegistryView() {
  const navigate = useNavigate()
  const [clinics, setClinics] = useState<ClinicProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  useEffect(() => {
    let isMounted = true
    const loadClinics = async () => {
      try {
        setLoading(true)
        setErrorMsg('')
        const data = await clinicApi.listClinics(statusFilter, searchTerm)
        if (isMounted) setClinics(data)
      } catch (err: unknown) {
        if (isMounted) {
          const error = err as { message?: string }
          setErrorMsg(error.message || 'Failed to fetch clinic registry records.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    const timer = setTimeout(() => {
      loadClinics()
    }, 250)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [statusFilter, searchTerm])

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>
      <ClinicHeader
        title="Clinic Tenants Registry"
        subtitle="Platform Super Admin Overview & Verification Console"
        breadcrumbs={[
          { label: 'Platform Admin', href: '/admin' },
          { label: 'Tenants Registry' },
        ]}
      />

      {errorMsg && (
        <Alert variant="danger" title="Error" style={{ marginBottom: '1.5rem' }}>
          {errorMsg}
        </Alert>
      )}

      <ClinicCard>
        {/* Filters & Search Toolbar */}
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
          <div style={{ flex: '1 1 300px', position: 'relative' }}>
            <Input
              placeholder="Search by clinic name, tenant ID, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
              Status Filter:
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
              <option value="PENDING_REVIEW">Pending Review</option>
              <option value="APPROVED">Approved</option>
              <option value="ACTIVE">Active</option>
              <option value="SUSPENDED">Suspended</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        {/* Registry Table */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '250px' }}>
            <Loader size="medium" />
          </div>
        ) : clinics.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
            <Building2 size={44} style={{ marginBottom: '0.75rem', strokeWidth: 1.5 }} />
            <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--color-text-main)' }}>No Clinics Found</h4>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              No tenant records match your query filters.
            </p>
          </div>
        ) : (
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Clinic Name</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Tenant ID</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Registration Code</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Contact Email</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {clinics.map((clinic) => (
                  <tr key={clinic.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                      {clinic.name}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-muted)' }}>
                      {clinic.tenantId}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-muted)' }}>
                      {clinic.registrationNumber}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>{clinic.primaryEmail}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <ClinicStatusBadge status={clinic.status} />
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/admin/clinics/${clinic.id}`)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.65rem' }}
                      >
                        <Eye size={14} />
                        <span>Audit</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ClinicCard>
    </div>
  )
}
