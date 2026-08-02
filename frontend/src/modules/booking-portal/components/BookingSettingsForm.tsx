import React, { useState } from 'react'
import { Settings, Save, Check } from 'lucide-react'
import type { IBookingSettings } from '../types/bookingPortal'

interface BookingSettingsFormProps {
  settings: IBookingSettings
  onSave: (settings: IBookingSettings) => Promise<unknown>
}

export const BookingSettingsForm: React.FC<BookingSettingsFormProps> = ({ settings, onSave }) => {
  const [formData, setFormData] = useState<IBookingSettings>({ ...settings })
  const [isSaved, setIsSaved] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave(formData)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Settings className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-bold text-slate-900">Booking Rules & Constraints</h3>
        </div>
        {isSaved && (
          <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            <Check className="w-3.5 h-3.5 mr-1 rtl:ml-1 text-emerald-600" /> Settings Saved
          </span>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div>
            <span className="text-xs font-bold text-slate-900 block">Enable Public Online Booking</span>
            <span className="text-[11px] text-slate-500">Allow patients to book slots online via public URL</span>
          </div>
          <input
            type="checkbox"
            checked={formData.onlineBookingEnabled}
            onChange={(e) => setFormData({ ...formData, onlineBookingEnabled: e.target.checked })}
            className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Appointment Slot Duration (Mins)</label>
            <input
              type="number"
              min={5}
              max={120}
              value={formData.appointmentDuration}
              onChange={(e) => setFormData({ ...formData, appointmentDuration: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Sanitation Buffer Time (Mins)</label>
            <input
              type="number"
              min={0}
              max={30}
              value={formData.bookingBuffer}
              onChange={(e) => setFormData({ ...formData, bookingBuffer: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Max Daily Online Appointments Cap</label>
            <input
              type="number"
              min={1}
              max={100}
              value={formData.maxDailyAppointments}
              onChange={(e) => setFormData({ ...formData, maxDailyAppointments: Number(e.target.value) })}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs outline-none"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Accept New Patients</span>
              <span className="text-[11px] text-slate-500">Allow first-time patient registrations</span>
            </div>
            <input
              type="checkbox"
              checked={formData.acceptNewPatients}
              onChange={(e) => setFormData({ ...formData, acceptNewPatients: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors flex items-center justify-center"
      >
        <Save className="w-4 h-4 mr-2 rtl:ml-2" />
        Save Booking Rules
      </button>
    </form>
  )
}
