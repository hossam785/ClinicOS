import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { MedicalRecordProfile } from '../types/medicalRecord.types'
import { medicalRecordApi } from '../services/medicalRecordApi'
import MedicalRecordHeader from '../components/MedicalRecordHeader'
import MedicalRecordCard from '../components/MedicalRecordCard'
import MedicalRecordStatusBadge from '../components/MedicalRecordStatusBadge'
import Input from '@/design-system/components/Input'
import Button from '@/design-system/components/Button'
import Alert from '@/design-system/components/Alert'
import Loader from '@/design-system/components/Loader'
import { FileText, Plus, Eye, ListFilter } from 'lucide-react'

export default function MedicalRecordsDirectoryView() {
  const navigate = useNavigate()
  const [records, setRecords] = useState<MedicalRecordProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      try {
        setLoading(true)
        setErrorMsg('')
        const list = await medicalRecordApi.listRecords(statusFilter, undefined, searchTerm)
        if (isMounted) setRecords(list)
      } catch (err: unknown) {
        if (isMounted) {
          const error = err as { message?: string }
          setErrorMsg(error.message || 'Failed to load medical records directory.')
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

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>
      <MedicalRecordHeader
        title="Electronic Medical Records (EMR) Directory"
        subtitle="Central Clinical Chart Repository & Patient History Index"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Medical Records Directory' },
        ]}
        actions={
          <Button
            variant="primary"
            onClick={() => navigate('/dashboard/medical-records/new')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={16} />
            <span>Create New EMR Chart</span>
          </Button>
        }
      />

      {errorMsg && (
        <Alert variant="danger" title="Error" style={{ marginBottom: '1.5rem' }}>
          {errorMsg}
        </Alert>
      )}

      <MedicalRecordCard>
        {/* Search & Filter Toolbar */}
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
          <div style={{ flex: '1 1 300px' }}>
            <Input
              placeholder="Search by record number, patient name, doctor, diagnosis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <ListFilter size={14} /> Filter Status:
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
              <option value="DRAFT">Draft</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="LOCKED">Signed & Locked</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
        </div>

        {/* Master EMR Table */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem 0' }}>
            <Loader size="medium" />
          </div>
        ) : records.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
            <FileText size={44} style={{ marginBottom: '0.75rem', strokeWidth: 1.5 }} />
            <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--color-text-main)' }}>No Medical Records Found</h4>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              No clinical chart records match your search query and status filter criteria.
            </p>
          </div>
        ) : (
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Record Code</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Patient Name</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Attending Doctor</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Visit Date</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Primary Diagnosis</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec) => (
                  <tr key={rec.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>
                      {rec.recordNumber}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                      {rec.patientName}
                      <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 400 }}>
                        {rec.patientCode}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-main)' }}>
                      {rec.doctorName}
                      <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        {rec.doctorSpecialty}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-main)' }}>
                      {rec.visitDate}
                      <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        {rec.visitType}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-main)', fontWeight: 500 }}>
                      {rec.primaryDiagnosis || 'Pending Assessment'}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <MedicalRecordStatusBadge status={rec.status} />
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/dashboard/medical-records/${rec.id}`)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.35rem 0.65rem' }}
                      >
                        <Eye size={14} />
                        <span>View Chart</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </MedicalRecordCard>
    </div>
  )
}
