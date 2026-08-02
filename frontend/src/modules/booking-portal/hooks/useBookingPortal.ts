import { useState, useEffect, useCallback } from 'react'
import type {
  IDoctorPublicProfile,
  IDoctorService,
  IDoctorGalleryItem,
  IDoctorFaq,
  IDoctorReview,
  IPublicCalendarDay,
  IBookingRequest,
  IBookingConfirmation,
  IBookingAnalytics,
  IBrandingTokens,
  IBookingSettings,
  ISeoSettings,
} from '../types/bookingPortal'
import { bookingPortalApi } from '../services/bookingPortalApi'

export function useBookingPortal(slug: string = 'dr-ahmed-al-mansoor') {
  const [profile, setProfile] = useState<IDoctorPublicProfile | null>(null)
  const [services, setServices] = useState<IDoctorService[]>([])
  const [gallery, setGallery] = useState<IDoctorGalleryItem[]>([])
  const [faqs, setFaqs] = useState<IDoctorFaq[]>([])
  const [reviews, setReviews] = useState<IDoctorReview[]>([])
  const [calendarDay, setCalendarDay] = useState<IPublicCalendarDay | null>(null)
  const [analytics, setAnalytics] = useState<IBookingAnalytics | null>(null)

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isBookingSubmitting, setIsBookingSubmitting] = useState<boolean>(false)
  const [bookingConfirmation, setBookingConfirmation] = useState<IBookingConfirmation | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Booking Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
  const [selectedService, setSelectedService] = useState<IDoctorService | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('')

  // Load public portal profile & satellite collections
  const loadPortalData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [profData, servData, galData, faqData, revData] = await Promise.all([
        bookingPortalApi.getPublicDoctorProfile(slug),
        bookingPortalApi.getPublicServices(slug),
        bookingPortalApi.getPublicGallery(slug),
        bookingPortalApi.getPublicFaqs(slug),
        bookingPortalApi.getPublicReviews(slug),
      ])

      setProfile(profData)
      setServices(servData)
      setGallery(galData)
      setFaqs(faqData)
      setReviews(revData)
      if (servData.length > 0) {
        setSelectedService(servData[0])
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load public doctor portal')
    } finally {
      setIsLoading(false)
    }
  }, [slug])

  // Load public calendar for a selected date
  const loadCalendarForDate = useCallback(
    async (date: string) => {
      try {
        const calData = await bookingPortalApi.getPublicCalendar(slug, date)
        setCalendarDay(calData)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load time slots')
      }
    },
    [slug]
  )

  useEffect(() => {
    loadPortalData()
  }, [loadPortalData])

  useEffect(() => {
    if (selectedDate) {
      loadCalendarForDate(selectedDate)
    }
  }, [selectedDate, loadCalendarForDate])

  // Open booking drawer with an optional service pre-selection
  const openBookingDrawer = useCallback(
    (service?: IDoctorService) => {
      if (service) {
        setSelectedService(service)
      } else if (services.length > 0) {
        setSelectedService(services[0])
      }
      setIsDrawerOpen(true)
    },
    [services]
  )

  const closeBookingDrawer = useCallback(() => {
    setIsDrawerOpen(false)
  }, [])

  // Submit appointment booking
  const submitBooking = useCallback(
    async (request: IBookingRequest): Promise<IBookingConfirmation | null> => {
      setIsBookingSubmitting(true)
      setError(null)
      try {
        const result = await bookingPortalApi.submitPublicBooking(slug, request)
        setBookingConfirmation(result)
        return result
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : 'Booking submission failed'
        setError(errMsg)
        return null
      } finally {
        setIsBookingSubmitting(false)
      }
    },
    [slug]
  )

  // Dashboard mutation methods
  const updateBranding = useCallback(async (newBranding: IBrandingTokens) => {
    try {
      const updated = await bookingPortalApi.updateBrandingTokens(newBranding)
      setProfile((prev) => (prev ? { ...prev, branding: updated } : null))
      return updated
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Branding update failed')
      return null
    }
  }, [])

  const updateBookingSettings = useCallback(async (newSettings: IBookingSettings) => {
    try {
      const updated = await bookingPortalApi.updateBookingSettings(newSettings)
      setProfile((prev) => (prev ? { ...prev, bookingSettings: updated } : null))
      return updated
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Booking settings update failed')
      return null
    }
  }, [])

  const updateSeo = useCallback(async (newSeo: ISeoSettings) => {
    try {
      const updated = await bookingPortalApi.updateSeoSettings(newSeo)
      setProfile((prev) => (prev ? { ...prev, seo: updated } : null))
      return updated
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'SEO update failed')
      return null
    }
  }, [])

  const loadAnalytics = useCallback(async (period: string = '2026-08') => {
    try {
      const data = await bookingPortalApi.getAnalyticsMetrics(period)
      setAnalytics(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    }
  }, [])

  return {
    profile,
    services,
    gallery,
    faqs,
    reviews,
    calendarDay,
    analytics,
    isLoading,
    isBookingSubmitting,
    bookingConfirmation,
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
    updateBranding,
    updateBookingSettings,
    updateSeo,
    loadAnalytics,
    reload: loadPortalData,
  }
}
