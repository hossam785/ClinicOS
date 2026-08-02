import React from 'react'
import { useParams } from 'react-router-dom'
import { Calendar } from 'lucide-react'
import { useBookingPortal } from '../hooks/useBookingPortal'
import { PublicHeroBanner } from '../components/PublicHeroBanner'
import { DoctorIdentityCard } from '../components/DoctorIdentityCard'
import { AboutDoctorSection } from '../components/AboutDoctorSection'
import { PublicServiceCard } from '../components/PublicServiceCard'
import { PublicScheduleGrid } from '../components/PublicScheduleGrid'
import { BookingDrawerModal } from '../components/BookingDrawerModal'
import { PublicGalleryGrid } from '../components/PublicGalleryGrid'
import { PublicReviewCard } from '../components/PublicReviewCard'
import { PublicFaqAccordion } from '../components/PublicFaqAccordion'
import { ContactLocationSection } from '../components/ContactLocationSection'
import { PublicPortalFooter } from '../components/PublicPortalFooter'

export const PublicDoctorPortalView: React.FC = () => {
  const { slug = 'dr-ahmed-al-mansoor' } = useParams<{ slug: string }>()
  const {
    profile,
    services,
    gallery,
    faqs,
    reviews,
    calendarDay,
    isLoading,
    isBookingSubmitting,
    error,
    isDrawerOpen,
    selectedService,
    selectedDate,
    selectedTimeSlot,
    setSelectedService,
    setSelectedDate,
    setSelectedTimeSlot,
    openBookingDrawer,
    closeBookingDrawer,
    submitBooking,
  } = useBookingPortal(slug)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-600">Loading Doctor Profile & Services...</p>
        </div>
      </div>
    )
  }

  if (!profile || !profile.publicProfileEnabled) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Doctor Profile Unavailable</h2>
          <p className="text-xs text-slate-600">
            The requested public doctor booking profile is currently inactive or undergoing updates. Please contact clinic reception.
          </p>
        </div>
      </div>
    )
  }

  const primaryColor = profile.branding.primaryColor || '#047857'

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased pb-20 md:pb-0">
      {/* 1. Hero Cover Banner */}
      <PublicHeroBanner profile={profile} onBookClick={() => openBookingDrawer()} />

      {/* Main Content Layout Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 2. Medical Background & Identity Card */}
        <DoctorIdentityCard info={profile.professionalInfo} primaryColor={primaryColor} />

        {/* 3. About Doctor & Facility */}
        <AboutDoctorSection content={profile.publicContent} />

        {/* 4. Services Catalog */}
        {services.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Medical Services & Consultations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((srv) => (
                <PublicServiceCard
                  key={srv.serviceId}
                  service={srv}
                  primaryColor={primaryColor}
                  onBookService={(selectedSrv) => openBookingDrawer(selectedSrv)}
                />
              ))}
            </div>
          </section>
        )}

        {/* 5. Working Hours Schedule Grid */}
        <PublicScheduleGrid />

        {/* 6. Clinic Gallery */}
        <PublicGalleryGrid gallery={gallery} />

        {/* 7. Patient Reviews */}
        {reviews.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Verified Patient Reviews</h2>
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                {profile.rating} / 5.0 Star Rating
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((rev) => (
                <PublicReviewCard key={rev.reviewId} review={rev} />
              ))}
            </div>
          </section>
        )}

        {/* 8. FAQs */}
        <PublicFaqAccordion faqs={faqs} />

        {/* 9. Location & Directions */}
        <ContactLocationSection contact={profile.contact} clinicName={profile.clinicName} />
      </main>

      {/* 10. Sticky Mobile Action Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-lg z-40 flex items-center justify-between">
        <div>
          <span className="text-[10px] text-slate-400 block uppercase font-bold">Consultation Fee</span>
          <span className="text-sm font-bold text-slate-900">
            {profile.consultationFee} {profile.currency}
          </span>
        </div>

        <button
          onClick={() => openBookingDrawer()}
          style={{ backgroundColor: primaryColor }}
          className="inline-flex items-center px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md hover:opacity-95 transition-opacity"
        >
          <Calendar className="w-4 h-4 mr-1.5 rtl:ml-1.5" />
          Book Appointment
        </button>
      </div>

      {/* 11. Multi-Step Booking Drawer Modal */}
      <BookingDrawerModal
        isOpen={isDrawerOpen}
        onClose={closeBookingDrawer}
        profile={profile}
        services={services}
        calendarDay={calendarDay}
        selectedService={selectedService}
        selectedDate={selectedDate}
        selectedTimeSlot={selectedTimeSlot}
        onSelectService={setSelectedService}
        onSelectDate={setSelectedDate}
        onSelectTimeSlot={setSelectedTimeSlot}
        onSubmitBooking={submitBooking}
        isSubmitting={isBookingSubmitting}
        error={error}
      />

      {/* 12. Footer */}
      <PublicPortalFooter clinicName={profile.clinicName} />
    </div>
  )
}
