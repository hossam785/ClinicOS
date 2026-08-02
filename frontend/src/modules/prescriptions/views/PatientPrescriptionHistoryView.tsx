import React, { useState, useEffect, useCallback } from 'react'
import { Pill, RefreshCw, AlertCircle } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import type { Prescription } from '../types/prescription'
import { prescriptionApi } from '../services/prescriptionApi'
import PrescriptionCard from '../components/PrescriptionCard'
import Card from '@/design-system/components/Card'
import Button from '@/design-system/components/Button'
import Input from '@/design-system/components/Input'
import Loader from '@/design-system/components/Loader'

export const PatientPrescriptionHistoryView: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>()
  const navigate = useNavigate()

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState<string>('')

  const fetchPatientHistory = useCallback(async () => {
    if (!patientId) return
    setIsLoading(true)
    setError(null)
    try {
      const response = await prescriptionApi.getPatientPrescriptions(patientId)
      setPrescriptions(response.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load patient prescription timeline.')
    } finally {
      setIsLoading(false)
    }
  }, [patientId])

  useEffect(() => {
    fetchPatientHistory()
  }, [fetchPatientHistory])

  const filteredPrescriptions = prescriptions.filter((rx) => {
    if (!search.trim()) return true
    const query = search.toLowerCase()
    return (
      rx.prescriptionNumber.toLowerCase().includes(query) ||
      rx.diagnosisSummary?.toLowerCase().includes(query) ||
      rx.medications.some((m) => m.medicineName.toLowerCase().includes(query))
    )
  })

  return (
    <div className="patient-prescription-history-container" style={{ padding: '1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Pill size={24} style={{ color: '#2563EB' }} />
            Patient Prescription Timeline
          </h1>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#64748B' }}>
            Chronological ePrescription history for Patient ID: <strong>{patientId}</strong>
          </p>
        </div>

        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      {/* Filter */}
      <Card style={{ padding: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <Input
              placeholder="Search history by medicine name, diagnosis, or RX code..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={fetchPatientHistory}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <RefreshCw size={16} /> Refresh
            </span>
          </Button>
        </div>
      </Card>

      {error && (
        <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <AlertCircle size={20} /> <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <Card style={{ padding: '3rem', textAlign: 'center' }}>
          <Loader size="large" />
          <p style={{ marginTop: '1rem', color: '#64748B' }}>Loading prescription timeline...</p>
        </Card>
      ) : filteredPrescriptions.length === 0 ? (
        <Card style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
          <Pill size={32} style={{ color: '#94A3B8', marginBottom: '0.5rem' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>No Prescriptions Found</h3>
          <p style={{ color: '#64748B', fontSize: '0.875rem' }}>No prescriptions recorded in this patient's medical history chart.</p>
        </Card>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {filteredPrescriptions.map((rx) => (
            <PrescriptionCard key={rx._id} prescription={rx} />
          ))}
        </div>
      )}
    </div>
  )
}

export default PatientPrescriptionHistoryView
