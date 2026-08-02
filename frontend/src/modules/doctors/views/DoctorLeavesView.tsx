import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { DoctorLeave } from '../types/doctor.types'
import { doctorApi } from '../services/doctorApi'
import DoctorHeader from '../components/DoctorHeader'
import DoctorCard from '../components/DoctorCard'
import Input from '@/design-system/components/Input'
import Button from '@/design-system/components/Button'
import Alert from '@/design-system/components/Alert'
import Loader from '@/design-system/components/Loader'
import { CalendarOff, Trash2, Plus, ArrowLeft } from 'lucide-react'

export default function DoctorLeavesView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [leaves, setLeaves] = useState<DoctorLeave[]>([])
  const [loading, setLoading] = useState(true)
  const [newDate, setNewDate] = useState('')
  const [newName, setNewName] = useState('')
  const [newReason, setNewReason] = useState('')

  const [errorMsg, setErrorMsg] = useState('')
  const [feedbackMsg, setFeedbackMsg] = useState('')

  useEffect(() => {
    let isMounted = true
    const loadLeaves = async () => {
      const docId = id || 'doc-101'
      try {
        setLoading(true)
        setErrorMsg('')
        const list = await doctorApi.getLeaves(docId)
        if (isMounted) setLeaves(list)
      } catch (err: unknown) {
        if (isMounted) {
          const error = err as { message?: string }
          setErrorMsg(error.message || 'Failed to load leave exceptions.')
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadLeaves()
    return () => {
      isMounted = false
    }
  }, [id])

  const handleAddLeave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDate || !newName.trim()) {
      setErrorMsg('Leave Date and Title are required.')
      return
    }

    const docId = id || 'doc-101'
    try {
      setErrorMsg('')
      setFeedbackMsg('')

      const created = await doctorApi.addLeave(docId, {
        date: newDate,
        name: newName.trim(),
        reason: newReason.trim() || undefined,
      })

      setLeaves([...leaves, created])
      setNewDate('')
      setNewName('')
      setNewReason('')
      setFeedbackMsg(`Leave exception declared for ${created.date}.`)
    } catch (err: unknown) {
      const error = err as { message?: string }
      setErrorMsg(error.message || 'Failed to declare leave exception.')
    }
  }

  const handleDeleteLeave = async (leaveId: string) => {
    const docId = id || 'doc-101'
    try {
      setErrorMsg('')
      setFeedbackMsg('')

      await doctorApi.deleteLeave(docId, leaveId)
      setLeaves(leaves.filter((l) => l.id !== leaveId))
      setFeedbackMsg('Leave exception removed successfully.')
    } catch (err: unknown) {
      const error = err as { message?: string }
      setErrorMsg(error.message || 'Failed to delete leave exception.')
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
        title="Practitioner Vacation & Leave Exceptions"
        subtitle="Declare date-specific calendar closures overriding regular weekly shift hours"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Doctors Directory', href: '/dashboard/doctors' },
          { label: 'Doctor Profile', href: `/dashboard/doctors/${id || 'doc-101'}` },
          { label: 'Leave Exceptions' },
        ]}
        actions={
          <Button
            variant="outline"
            onClick={() => navigate(`/dashboard/doctors/${id || 'doc-101'}`)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Profile</span>
          </Button>
        }
      />

      {feedbackMsg && (
        <Alert variant="info" title="Leave Schedule Updated" style={{ marginBottom: '1.5rem' }}>
          {feedbackMsg}
        </Alert>
      )}

      {errorMsg && (
        <Alert variant="danger" title="Validation Error" style={{ marginBottom: '1.5rem' }}>
          {errorMsg}
        </Alert>
      )}

      {/* Add New Leave Exception Form */}
      <form onSubmit={handleAddLeave}>
        <DoctorCard title="Declare New Vacation / Leave Date">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <Input
              label="Leave Date *"
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              required
            />
            <Input
              label="Leave Title *"
              placeholder="e.g. Annual Leave, Medical Conference"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
            <Input
              label="Optional Reason Note"
              placeholder="e.g. Personal Leave"
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
            <Button
              variant="primary"
              type="submit"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Plus size={16} />
              <span>Add Leave Exception</span>
            </Button>
          </div>
        </DoctorCard>
      </form>

      {/* Declared Leave Exceptions Roster */}
      <DoctorCard title="Declared Vacation Exceptions Queue">
        {leaves.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--color-text-muted)' }}>
            <CalendarOff size={40} style={{ marginBottom: '0.75rem', strokeWidth: 1.5 }} />
            <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--color-text-main)' }}>No Custom Leaves Declared</h4>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              No custom vacation or leave closures declared for this practitioner.
            </p>
          </div>
        ) : (
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Leave Date</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Title</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Reason Note</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaves.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                      {item.date}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-main)' }}>
                      {item.name}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', color: 'var(--color-text-muted)' }}>
                      {item.reason || '-'}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                      <Button
                        variant="outline"
                        onClick={() => handleDeleteLeave(item.id)}
                        style={{ color: 'var(--color-danger)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.6rem' }}
                      >
                        <Trash2 size={14} />
                        <span>Remove</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DoctorCard>
    </div>
  )
}
