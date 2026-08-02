import type { DayOperatingHours } from '../types/clinic.types'
import Badge from '@/design-system/components/Badge'

export interface OperatingHoursTableProps {
  schedule: DayOperatingHours[]
  editable?: boolean
  onScheduleChange?: (updatedSchedule: DayOperatingHours[]) => void
}

export default function OperatingHoursTable({
  schedule,
  editable = false,
  onScheduleChange,
}: OperatingHoursTableProps) {
  const handleToggleOpen = (index: number) => {
    if (!editable || !onScheduleChange) return
    const updated = [...schedule]
    updated[index] = { ...updated[index], isOpen: !updated[index].isOpen }
    onScheduleChange(updated)
  }

  const handleTimeChange = (
    index: number,
    field: 'shiftStart' | 'shiftEnd' | 'lunchStart' | 'lunchEnd',
    val: string
  ) => {
    if (!editable || !onScheduleChange) return
    const updated = [...schedule]
    updated[index] = { ...updated[index], [field]: val }
    onScheduleChange(updated)
  }

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.875rem',
          textAlign: 'left',
        }}
      >
        <thead>
          <tr
            style={{
              borderBottom: '2px solid var(--color-border)',
              color: 'var(--color-text-muted)',
            }}
          >
            <th style={{ padding: '0.75rem 1rem' }}>Day of Week</th>
            <th style={{ padding: '0.75rem 1rem' }}>Status</th>
            <th style={{ padding: '0.75rem 1rem' }}>Shift Start</th>
            <th style={{ padding: '0.75rem 1rem' }}>Shift End</th>
            <th style={{ padding: '0.75rem 1rem' }}>Lunch Break</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((day, idx) => (
            <tr
              key={day.dayOfWeek}
              style={{
                borderBottom: '1px solid var(--color-border)',
                backgroundColor: day.isOpen ? 'transparent' : 'rgba(0,0,0,0.02)',
              }}
            >
              <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                {day.dayOfWeek}
              </td>
              <td style={{ padding: '0.75rem 1rem' }}>
                {editable ? (
                  <button
                    type="button"
                    onClick={() => handleToggleOpen(idx)}
                    style={{
                      border: 'none',
                      background: 'none',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    <Badge variant={day.isOpen ? 'success' : 'neutral'}>
                      {day.isOpen ? 'Open' : 'Closed'}
                    </Badge>
                  </button>
                ) : (
                  <Badge variant={day.isOpen ? 'success' : 'neutral'}>
                    {day.isOpen ? 'Open' : 'Closed'}
                  </Badge>
                )}
              </td>
              <td style={{ padding: '0.75rem 1rem', color: day.isOpen ? 'var(--color-text-main)' : 'var(--color-text-muted)' }}>
                {day.isOpen ? (
                  editable ? (
                    <input
                      type="time"
                      value={day.shiftStart}
                      onChange={(e) => handleTimeChange(idx, 'shiftStart', e.target.value)}
                      style={{
                        padding: '0.35rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)',
                      }}
                    />
                  ) : (
                    day.shiftStart
                  )
                ) : (
                  '-'
                )}
              </td>
              <td style={{ padding: '0.75rem 1rem', color: day.isOpen ? 'var(--color-text-main)' : 'var(--color-text-muted)' }}>
                {day.isOpen ? (
                  editable ? (
                    <input
                      type="time"
                      value={day.shiftEnd}
                      onChange={(e) => handleTimeChange(idx, 'shiftEnd', e.target.value)}
                      style={{
                        padding: '0.35rem 0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-border)',
                      }}
                    />
                  ) : (
                    day.shiftEnd
                  )
                ) : (
                  '-'
                )}
              </td>
              <td style={{ padding: '0.75rem 1rem', color: day.isOpen ? 'var(--color-text-main)' : 'var(--color-text-muted)' }}>
                {day.isOpen && day.hasLunchBreak ? (
                  editable ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <input
                        type="time"
                        value={day.lunchStart || '12:00'}
                        onChange={(e) => handleTimeChange(idx, 'lunchStart', e.target.value)}
                        style={{
                          padding: '0.35rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--color-border)',
                        }}
                      />
                      <span>-</span>
                      <input
                        type="time"
                        value={day.lunchEnd || '13:00'}
                        onChange={(e) => handleTimeChange(idx, 'lunchEnd', e.target.value)}
                        style={{
                          padding: '0.35rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--color-border)',
                        }}
                      />
                    </div>
                  ) : (
                    `${day.lunchStart} - ${day.lunchEnd}`
                  )
                ) : (
                  'None'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
