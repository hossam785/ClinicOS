import React, { useState } from 'react'
import { Calendar, User, Phone, FileText, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react'
import type {
  IDoctorPublicProfile,
  IDoctorService,
  IPublicCalendarDay,
  IBookingRequest,
  IBookingConfirmation,
} from '../types/bookingPortal'

interface BookingDrawerModalProps {
  isOpen: boolean
  onClose: () => void
  profile: IDoctorPublicProfile
  services: IDoctorService[]
  calendarDay: IPublicCalendarDay | null
  selectedService: IDoctorService | null
  selectedDate: string
  selectedTimeSlot: string
  onSelectService: (service: IDoctorService) => void
  onSelectDate: (date: string) => void
  onSelectTimeSlot: (slot: string) => void
  onSubmitBooking: (request: IBookingRequest) => Promise<IBookingConfirmation | null>
  isSubmitting: boolean
  error: string | null
}

export const BookingDrawerModal: React.FC<BookingDrawerModalProps> = ({
  isOpen,
  onClose,
  profile,
  services,
  calendarDay,
  selectedService,
  selectedDate,
  selectedTimeSlot,
  onSelectService,
  onSelectDate,
  onSelectTimeSlot,
  onSubmitBooking,
  isSubmitting,
  error,
}) => {
  const [patientName, setPatientName] = useState('')
  const [patientPhone, setPatientPhone] = useState('')
  const [patientEmail, setPatientEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [confirmation, setConfirmation] = useState<IBookingConfirmation | null>(null)

  if (!isOpen) return null

  const primaryColor = profile.branding.primaryColor || '#047857'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedService || !selectedTimeSlot) return

    const result = await onSubmitBooking({
      serviceId: selectedService.serviceId,
      appointmentDate: selectedDate,
      appointmentTime: selectedTimeSlot,
      patientName,
      patientPhone,
      patientEmail,
      notes,
      honeypot,
    })

    if (result) {
      setConfirmation(result)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-center items-end sm:items-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-xl rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200 animate-in slide-in-from-bottom duration-300">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold">Book Appointment</h2>
            <p className="text-xs text-slate-300">{profile.doctorName} — {profile.clinicName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close Booking Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {confirmation ? (
            /* Confirmation Success Screen */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Appointment Scheduled!</h3>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">{confirmation.confirmationMessage}</p>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left rtl:text-right space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Booking Reference</span>
                  <span className="font-bold text-slate-900">{confirmation.bookingReference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Service</span>
                  <span className="font-semibold text-slate-800">{confirmation.appointmentDetails.serviceTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date & Time</span>
                  <span className="font-semibold text-slate-800">
                    {confirmation.appointmentDetails.appointmentDate} at {confirmation.appointmentDetails.appointmentTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Consultation Fee</span>
                  <span className="font-bold text-emerald-700">
                    {confirmation.appointmentDetails.consultationFee} {confirmation.appointmentDetails.currency}
                  </span>
                </div>
              </div>

              <button
                onClick={onClose}
                style={{ backgroundColor: primaryColor }}
                className="w-full py-3 rounded-lg text-sm font-semibold text-white shadow-md hover:opacity-95 transition-opacity"
              >
                Close & Return to Doctor Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-medium text-rose-800 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 rtl:ml-2 text-rose-600 shrink-0" />
                  {error}
                </div>
              )}

              {/* Step 1: Select Service */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Step 1: Select Service
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {services.map((srv) => (
                    <button
                      key={srv.serviceId}
                      type="button"
                      onClick={() => onSelectService(srv)}
                      className={`p-3 rounded-xl border text-left rtl:text-right flex items-center justify-between transition-all ${
                        selectedService?.serviceId === srv.serviceId
                          ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <span className="text-sm font-bold text-slate-900 block">{srv.title}</span>
                        <span className="text-xs text-slate-500">{srv.duration} mins</span>
                      </div>
                      <span className="text-sm font-bold text-emerald-800">
                        {srv.consultationFee} {srv.currency}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Select Date */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>Step 2: Select Date</span>
                  <span className="text-slate-400 font-normal lowercase">{selectedDate}</span>
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => onSelectDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                />
              </div>

              {/* Step 3: Select Time Slot */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Step 3: Select Time Slot
                </label>

                {calendarDay ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1">
                    {calendarDay.availableSlots.map((slot, idx) => (
                      <button
                        key={idx}
                        type="button"
                        disabled={!slot.available}
                        onClick={() => onSelectTimeSlot(slot.time)}
                        className={`py-2 px-1 rounded-lg text-xs font-semibold border transition-all ${
                          selectedTimeSlot === slot.time
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : slot.available
                            ? 'bg-white border-slate-200 text-slate-800 hover:border-slate-400'
                            : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Loading open slots...</p>
                )}
              </div>

              {/* Step 4: Patient Details */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Step 4: Patient Details
                </label>

                {/* Invisible Honeypot Field for Spam Trap */}
                <input
                  type="text"
                  name="website_hp"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 rtl:right-3 rtl:left-auto" />
                  <input
                    type="text"
                    required
                    placeholder="Full Name *"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full pl-9 rtl:pr-9 rtl:pl-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                  />
                </div>

                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 rtl:right-3 rtl:left-auto" />
                  <input
                    type="tel"
                    required
                    placeholder="Mobile Phone (+20...) *"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full pl-9 rtl:pr-9 rtl:pl-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                  />
                </div>

                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 rtl:right-3 rtl:left-auto" />
                  <input
                    type="email"
                    placeholder="Email Address (Optional)"
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                    className="w-full pl-9 rtl:pr-9 rtl:pl-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                  />
                </div>

                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 rtl:right-3 rtl:left-auto" />
                  <input
                    type="text"
                    placeholder="Symptoms or Visit Notes (Optional)"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full pl-9 rtl:pr-9 rtl:pl-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !selectedTimeSlot || !patientName || !patientPhone}
                style={{ backgroundColor: primaryColor }}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white shadow-md hover:opacity-95 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 rtl:ml-2 animate-spin" />
                    Scheduling Appointment...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2 rtl:ml-2" />
                    Confirm Booking ({selectedService?.consultationFee || profile.consultationFee} {profile.currency})
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
