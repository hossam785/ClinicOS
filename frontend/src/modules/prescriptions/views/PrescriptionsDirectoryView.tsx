import React, { useState, useEffect, useCallback } from 'react'
import { Pill, Clock, CheckCircle2, Printer, Plus, RefreshCw, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Prescription, PrescriptionStatus } from '../types/prescription'
import { prescriptionApi } from '../services/prescriptionApi'
import PrescriptionStatusBadge from '../components/PrescriptionStatusBadge'
import Card from '@/design-system/components/Card'
import Button from '@/design-system/components/Button'
import Input from '@/design-system/components/Input'
import Loader from '@/design-system/components/Loader'
import Pagination from '@/design-system/components/Pagination'

export const PrescriptionsDirectoryView: React.FC = () => {
  const navigate = useNavigate()

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Filters & Pagination
  const [search, setSearch] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [totalItems, setTotalItems] = useState<number>(0)

  const fetchPrescriptions = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await prescriptionApi.getPrescriptions({
        page: currentPage,
        limit: 10,
        search: search.trim() || undefined,
        status: statusFilter !== 'ALL' ? (statusFilter as PrescriptionStatus) : undefined,
      })

      setPrescriptions(response.data || [])
      setTotalPages(response.meta?.totalPages || 1)
      setTotalItems(response.meta?.total || 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load prescriptions roster.')
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, search, statusFilter])

  useEffect(() => {
    fetchPrescriptions()
  }, [fetchPrescriptions])

  // Count stats
  const draftCount = prescriptions.filter((p) => p.status === 'DRAFT').length
  const finalizedCount = prescriptions.filter((p) => p.status === 'FINALIZED').length
  const printedCount = prescriptions.filter((p) => p.status === 'PRINTED').length

  return (
    <div className="prescriptions-directory-container" style={{ padding: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: 'var(--color-neutral-dark, #0F172A)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Pill size={28} style={{ color: 'var(--color-primary, #2563EB)' }} />
            Prescription Management
          </h1>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: 'var(--color-neutral-muted, #64748B)' }}>
            Manage clinic ePrescriptions, review drafts, and export print-ready medical records.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => navigate('/dashboard/prescriptions/new')}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={18} /> Create Prescription
          </span>
        </Button>
      </div>

      {/* Stats Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <Card style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-muted, #64748B)', fontWeight: 600 }}>Total Loaded</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-neutral-dark, #0F172A)', marginTop: '0.25rem' }}>
                {totalItems}
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Pill size={20} />
            </div>
          </div>
        </Card>

        <Card style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-muted, #64748B)', fontWeight: 600 }}>Draft Pending</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-warning, #D97706)', marginTop: '0.25rem' }}>
                {draftCount}
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={20} />
            </div>
          </div>
        </Card>

        <Card style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-muted, #64748B)', fontWeight: 600 }}>Finalized</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-success, #16A34A)', marginTop: '0.25rem' }}>
                {finalizedCount}
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={20} />
            </div>
          </div>
        </Card>

        <Card style={{ padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-neutral-muted, #64748B)', fontWeight: 600 }}>Printed</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-info, #4F46E5)', marginTop: '0.25rem' }}>
                {printedCount}
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Printer size={20} />
            </div>
          </div>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <Card style={{ padding: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 300px' }}>
            <Input
              placeholder="Search by patient name, code, or RX number..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>

          <div style={{ width: '180px' }}>
            <select
              value={statusFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setStatusFilter(e.target.value)
                setCurrentPage(1)
              }}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid var(--color-neutral-border, #CBD5E1)',
                backgroundColor: '#FFFFFF',
                fontSize: '0.875rem',
                color: 'var(--color-neutral-dark, #0F172A)',
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="FINALIZED">Finalized</option>
              <option value="PRINTED">Printed</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <Button
            variant="outline"
            onClick={fetchPrescriptions}
            aria-label="Refresh prescription roster"
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <RefreshCw size={16} /> Refresh
            </span>
          </Button>
        </div>
      </Card>

      {/* Error Alert */}
      {error && (
        <div
          style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#991B1B',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Roster List / Table */}
      {isLoading ? (
        <Card style={{ padding: '3rem', textAlign: 'center' }}>
          <Loader size="large" />
          <p style={{ marginTop: '1rem', color: 'var(--color-neutral-muted, #64748B)' }}>Loading prescriptions...</p>
        </Card>
      ) : prescriptions.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#F1F5F9', color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
            <Pill size={32} />
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>No Prescriptions Found</h3>
          <p style={{ color: 'var(--color-neutral-muted, #64748B)', maxWidth: '400px', margin: '0 auto 1.5rem auto', fontSize: '0.875rem' }}>
            {search || statusFilter !== 'ALL'
              ? 'No prescriptions match your active filter criteria. Try resetting your search query.'
              : 'No electronic prescriptions have been recorded yet. Click below to create your first prescription.'}
          </p>
          <Button variant="primary" onClick={() => navigate('/dashboard/prescriptions/new')}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={16} /> Create Prescription
            </span>
          </Button>
        </Card>
      ) : (
        <>
          <div style={{ overflowX: 'auto', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid var(--color-neutral-border, #CBD5E1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-neutral-light, #F8FAFC)', borderBottom: '1px solid #CBD5E1' }}>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Code</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Patient</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Doctor</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Visit Date</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Medications</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map((rx) => (
                  <tr key={rx._id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: 'var(--color-primary, #2563EB)' }}>
                      {rx.prescriptionNumber}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ fontWeight: 600 }}>{rx.patientName || rx.patientId}</div>
                      {rx.patientCode && <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{rx.patientCode}</div>}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>{rx.doctorName || rx.doctorId}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{rx.visitDate}</td>
                    <td style={{ padding: '0.75rem 1rem' }}>{rx.medications?.length || 0} item(s)</td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <PrescriptionStatusBadge status={rx.status} />
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <Button
                        variant="outline"
                        size="small"
                        onClick={() => navigate(`/dashboard/prescriptions/${rx._id}`)}
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default PrescriptionsDirectoryView
