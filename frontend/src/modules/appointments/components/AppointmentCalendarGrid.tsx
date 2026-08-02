import { Clock, CheckCircle, XCircle } from 'lucide-react'

interface AppointmentCalendarGridProps {
  date: string
  doctorId?: string
  doctorName?: string
  selectedTime?: string
  onSelectSlot?: (time: string) => void
}

const DEFAULT_TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
]

// Mock booked slots for demonstration of conflict indicators
const BOOKED_SLOTS = ['09:30', '11:00', '14:30']

export default function AppointmentCalendarGrid({
  date,
  doctorName = 'Selected Doctor',
  selectedTime,
  onSelectSlot,
}: AppointmentCalendarGridProps) {
  return (
    <div
      style={{
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg-surface)',
        padding: '1.25rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
          <Clock size={18} style={{ color: 'var(--color-primary)' }} />
          <span>Available Time Slots ({date})</span>
        </div>
        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
          Attending: <strong>{doctorName}</strong>
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
          gap: '0.75rem',
        }}
      >
        {DEFAULT_TIME_SLOTS.map((slotTime) => {
          const isBooked = BOOKED_SLOTS.includes(slotTime)
          const isSelected = selectedTime === slotTime

          let bgColor = 'var(--color-bg-surface)'
          let borderColor = 'var(--color-border)'
          let textColor = 'var(--color-text-main)'
          let cursor = 'pointer'

          if (isBooked) {
            bgColor = 'var(--color-bg-muted, #f3f4f6)'
            borderColor = 'var(--color-border)'
            textColor = 'var(--color-text-muted)'
            cursor = 'not-allowed'
          } else if (isSelected) {
            bgColor = 'var(--color-primary)'
            borderColor = 'var(--color-primary)'
            textColor = '#ffffff'
          }

          return (
            <button
              key={slotTime}
              type="button"
              disabled={isBooked}
              onClick={() => onSelectSlot && onSelectSlot(slotTime)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                padding: '0.6rem 0.5rem',
                borderRadius: 'var(--radius-md)',
                border: `1px solid ${borderColor}`,
                backgroundColor: bgColor,
                color: textColor,
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor,
                transition: 'all 0.15s ease',
              }}
            >
              {isBooked ? (
                <XCircle size={14} style={{ opacity: 0.6 }} />
              ) : isSelected ? (
                <CheckCircle size={14} />
              ) : (
                <Clock size={14} style={{ color: 'var(--color-primary)' }} />
              )}
              <span>{slotTime}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
