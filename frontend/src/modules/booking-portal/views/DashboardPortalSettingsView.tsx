import React from 'react'
import { Settings } from 'lucide-react'
import { useBookingPortal } from '../hooks/useBookingPortal'
import { BookingSettingsForm } from '../components/BookingSettingsForm'

export const DashboardPortalSettingsView: React.FC = () => {
  const { profile, updateBookingSettings, isLoading } = useBookingPortal()

  if (isLoading || !profile) {
    return <div className="p-8 text-center text-xs text-slate-400">Loading booking constraints...</div>
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center">
          <Settings className="w-6 h-6 text-emerald-600 mr-2 rtl:ml-2" />
          Booking Rules & Constraints Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">Configure appointment slot durations, sanitation buffer times, and max daily bookings limit.</p>
      </div>

      <BookingSettingsForm settings={profile.bookingSettings} onSave={updateBookingSettings} />
    </div>
  )
}
