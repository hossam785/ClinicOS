import React from 'react'
import { Calendar, Clock, CheckCircle2, XCircle } from 'lucide-react'

interface ScheduleDay {
  dayName: string
  hours: string
  isOpen: boolean
  isToday: boolean
}

interface PublicScheduleGridProps {
  schedule?: ScheduleDay[]
}

const DEFAULT_SCHEDULE: ScheduleDay[] = [
  { dayName: 'Sunday', hours: '16:00 - 21:00', isOpen: true, isToday: true },
  { dayName: 'Monday', hours: 'Closed', isOpen: false, isToday: false },
  { dayName: 'Tuesday', hours: '16:00 - 21:00', isOpen: true, isToday: false },
  { dayName: 'Wednesday', hours: 'Closed', isOpen: false, isToday: false },
  { dayName: 'Thursday', hours: '16:00 - 21:00', isOpen: true, isToday: false },
  { dayName: 'Friday', hours: 'Closed', isOpen: false, isToday: false },
  { dayName: 'Saturday', hours: 'Closed', isOpen: false, isToday: false },
]

export const PublicScheduleGrid: React.FC<PublicScheduleGridProps> = ({ schedule = DEFAULT_SCHEDULE }) => {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Clock className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-bold text-slate-900">Working Hours & Clinic Schedule</h2>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
          <Calendar className="w-3 h-3 mr-1 rtl:ml-1 text-emerald-600" />
          Active Calendar
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5">
        {schedule.map((day, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg border text-center transition-all ${
              day.isToday
                ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20'
                : day.isOpen
                ? 'bg-slate-50 border-slate-200'
                : 'bg-slate-100/60 border-slate-200 opacity-60'
            }`}
          >
            <div className="flex items-center justify-center space-x-1 rtl:space-x-reverse">
              <span className={`text-xs font-bold ${day.isToday ? 'text-emerald-900' : 'text-slate-700'}`}>{day.dayName}</span>
              {day.isToday && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Today" />}
            </div>

            <div className="mt-1.5 flex items-center justify-center text-xs">
              {day.isOpen ? (
                <span className="flex items-center font-medium text-slate-800">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 mr-1 rtl:ml-1 shrink-0" />
                  {day.hours}
                </span>
              ) : (
                <span className="flex items-center text-slate-400">
                  <XCircle className="w-3 h-3 text-slate-400 mr-1 rtl:ml-1 shrink-0" />
                  Closed
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
