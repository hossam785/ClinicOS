import React, { useState, useEffect, useCallback } from 'react'
import { Printer, Download, Clock, Archive, AlertCircle } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import type { Prescription } from '../types/prescription'
import { prescriptionApi } from '../services/prescriptionApi'
import PrescriptionHeader from '../components/PrescriptionHeader'
import PrintPrescriptionTemplate from '../components/PrintPrescriptionTemplate'
import Card from '@/design-system/components/Card'
import Button from '@/design-system/components/Button'
import Loader from '@/design-system/components/Loader'
import Modal from '@/design-system/components/Modal'
import Textarea from '@/design-system/components/Textarea'

export const PrescriptionDetailsView: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [prescription, setPrescription] = useState<Prescription | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Archive modal state
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState<boolean>(false)
  const [archiveReason, setArchiveReason] = useState<string>('')

  const fetchPrescription = useCallback(async () => {
    if (!id) return
    setIsLoading(true)
    setError(null)
    try {
      const response = await prescriptionApi.getPrescriptionById(id)
      setPrescription(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load prescription details.')
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchPrescription()
  }, [fetchPrescription])

  // Handle Direct Print Execution
  const handlePrint = async () => {
    if (!id || !prescription) return
    setIsSubmitting(true)
    try {
      await prescriptionApi.printPrescription(id)
      setTimeout(() => {
        window.print()
        fetchPrescription()
      }, 300)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register print event.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Vector PDF Export
  const handleExportPdf = async () => {
    if (!id || !prescription) return
    setIsSubmitting(true)
    try {
      const blob = await prescriptionApi.exportPrescriptionPdf(id)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Prescription_${prescription.prescriptionNumber}_${prescription.patientName || 'Patient'}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      fetchPrescription()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download PDF document.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle Archive Submission
  const handleArchiveSubmit = async () => {
    if (!id || !archiveReason.trim()) return
    setIsSubmitting(true)
    try {
      await prescriptionApi.archivePrescription(id, archiveReason)
      setIsArchiveModalOpen(false)
      fetchPrescription()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to archive prescription.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <Loader size="large" />
        <p style={{ marginTop: '1rem', color: '#64748B' }}>Loading prescription document...</p>
      </div>
    )
  }

  if (!prescription) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <h2>Prescription Document Not Found</h2>
        <Button onClick={() => navigate('/dashboard/prescriptions')}>Return to Prescription Roster</Button>
      </div>
    )
  }

  return (
    <div className="prescription-details-container" style={{ padding: '1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
      <PrescriptionHeader
        prescription={prescription}
        onPrint={handlePrint}
        onExportPdf={handleExportPdf}
        onFinalize={() => navigate(`/dashboard/prescriptions/${prescription._id}/edit`)}
        isSubmitting={isSubmitting}
      />

      {error && (
        <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertCircle size={20} /> <span>{error}</span>
        </div>
      )}

      {/* Action Buttons Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {prescription.status === 'DRAFT' && (
            <Button variant="outline" onClick={() => navigate(`/dashboard/prescriptions/${prescription._id}/edit`)}>
              Edit Draft
            </Button>
          )}

          {(prescription.status === 'FINALIZED' || prescription.status === 'PRINTED') && (
            <>
              <Button variant="primary" onClick={handlePrint} disabled={isSubmitting}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Printer size={16} /> Print Direct
                </span>
              </Button>

              <Button variant="secondary" onClick={handleExportPdf} disabled={isSubmitting}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Download size={16} /> Download Vector PDF
                </span>
              </Button>
            </>
          )}
        </div>

        {prescription.status !== 'ARCHIVED' && (
          <Button
            variant="outline"
            onClick={() => setIsArchiveModalOpen(true)}
            style={{ color: '#DC2626', borderColor: '#FCA5A5' }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Archive size={16} /> Archive Prescription
            </span>
          </Button>
        )}
      </div>

      {/* Main Document Display */}
      <Card style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <PrintPrescriptionTemplate prescription={prescription} />
      </Card>

      {/* Audit Trail & Print Logs */}
      <Card style={{ padding: '1rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 1rem 0', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={18} style={{ color: '#2563EB' }} />
          Governance Audit Trail & Print History
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          <div>
            <strong>Created By:</strong> {prescription.auditInfo?.createdBy || 'System'}
            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{prescription.auditInfo?.createdAt}</div>
          </div>
          <div>
            <strong>Finalized By:</strong> {prescription.auditInfo?.finalizedBy || 'Not Finalized'}
            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{prescription.auditInfo?.finalizedAt || 'N/A'}</div>
          </div>
          <div>
            <strong>Print Count:</strong> {prescription.printInfo?.printCount || 0} time(s)
            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Last: {prescription.printInfo?.lastPrintedAt || 'Never'}</div>
          </div>
          <div>
            <strong>Optimistic Lock Version:</strong> v{prescription.version}
          </div>
        </div>

        {/* Print History Array Table */}
        {prescription.printInfo?.printHistory?.length > 0 && (
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem', color: '#334155' }}>Print Action Log</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #CBD5E1' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Action</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Executed By</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {prescription.printInfo.printHistory.map((log, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '0.5rem' }}>{log.actionType}</td>
                    <td style={{ padding: '0.5rem' }}>{log.printedBy}</td>
                    <td style={{ padding: '0.5rem' }}>{log.printedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Archive Modal */}
      {isArchiveModalOpen && (
        <Modal
          isOpen={isArchiveModalOpen}
          onClose={() => setIsArchiveModalOpen(false)}
        >
          <div style={{ padding: '1rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.125rem', fontWeight: 700 }}>Archive Prescription</h3>
            <p style={{ fontSize: '0.875rem', color: '#334155', marginBottom: '1rem' }}>
              Archiving this prescription removes it from active pharmacy views. Physical deletion is prohibited for compliance audit purposes.
            </p>
            <Textarea
              label="Mandatory Archival Reason *"
              placeholder="Provide clinical or administrative justification (e.g. Dosage error, re-issued new prescription)..."
              value={archiveReason}
              onChange={(e) => setArchiveReason(e.target.value)}
              rows={3}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <Button variant="outline" onClick={() => setIsArchiveModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleArchiveSubmit} disabled={isSubmitting || !archiveReason.trim()}>
                Confirm Archive
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default PrescriptionDetailsView
