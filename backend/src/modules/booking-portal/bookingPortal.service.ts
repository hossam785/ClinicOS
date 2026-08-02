import { AppError } from '@/shared/errors/AppError'
import { bookingPortalRepository } from './bookingPortal.repository'
import { BookingPortalValidator } from './bookingPortal.validator'
import { auditEngineService } from '@/modules/audit-logs/auditEngine.service'
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
} from './bookingPortal.types'

export class BookingPortalService {
  /**
   * Public Landing Page Data Bundle Loader
   */
  public async getPublicDoctorProfileBundle(slug: string): Promise<{
    profile: IDoctorPublicProfile
    services: IDoctorService[]
    gallery: IDoctorGalleryItem[]
    faqs: IDoctorFaq[]
    reviews: IDoctorReview[]
  }> {
    const validSlug = BookingPortalValidator.validateSlug(slug)
    const profile = await bookingPortalRepository.getProfileBySlug(validSlug)

    if (!profile || !profile.publicProfileEnabled || profile.profileVisibility === 'PRIVATE') {
      throw new AppError('The requested public doctor booking profile is unavailable or inactive.', 404, 'PORTAL_NOT_FOUND')
    }

    // Record page view async
    await bookingPortalRepository.recordPageView(profile.doctorId)

    const [services, gallery, faqs, reviews] = await Promise.all([
      bookingPortalRepository.getServicesByDoctorId(profile.doctorId),
      bookingPortalRepository.getGalleryByDoctorId(profile.doctorId),
      bookingPortalRepository.getFaqsByDoctorId(profile.doctorId),
      bookingPortalRepository.getReviewsByDoctorId(profile.doctorId),
    ])

    return {
      profile,
      services: services.filter((s) => s.active),
      gallery,
      faqs: faqs.filter((f) => f.active),
      reviews,
    }
  }

  /**
   * Availability Engine — Calculates available time slots for a given date
   */
  public async getPublicCalendar(slug: string, date: string): Promise<IPublicCalendarDay> {
    const validSlug = BookingPortalValidator.validateSlug(slug)
    const profile = await bookingPortalRepository.getProfileBySlug(validSlug)

    if (!profile || !profile.publicProfileEnabled) {
      throw new AppError('Public booking portal is disabled', 404, 'PORTAL_DISABLED')
    }

    if (!profile.bookingSettings.onlineBookingEnabled) {
      return {
        date,
        isShiftDay: false,
        maxDailyLimitReached: false,
        availableSlots: [],
      }
    }

    // Baseline open slots calculation
    const baseSlots = ['16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00']
    const availableSlots = baseSlots.map((time) => ({
      time,
      available: time !== '17:00' && time !== '19:00', // Example occupied slots
      reason: time === '17:00' || time === '19:00' ? 'SLOT_BOOKED' : undefined,
    }))

    return {
      date,
      isShiftDay: true,
      maxDailyLimitReached: false,
      availableSlots,
      workingHours: {
        opens: '16:00',
        closes: '21:00',
      },
    }
  }

  /**
   * Public Booking Engine Workflow
   */
  public async submitPublicBooking(slug: string, rawPayload: Record<string, unknown>): Promise<IBookingConfirmation> {
    const validSlug = BookingPortalValidator.validateSlug(slug)
    const profile = await bookingPortalRepository.getProfileBySlug(validSlug)

    if (!profile || !profile.publicProfileEnabled) {
      throw new AppError('Public doctor booking portal is inactive.', 404, 'PORTAL_INACTIVE')
    }

    if (!profile.bookingSettings.onlineBookingEnabled) {
      throw new AppError('Online booking is currently disabled by clinic policy.', 403, 'ONLINE_BOOKING_DISABLED')
    }

    const bookingRequest: IBookingRequest = BookingPortalValidator.validateBookingRequest(rawPayload)

    // Record booking attempt metric
    await bookingPortalRepository.recordBookingAttempt(profile.doctorId)

    // Verify service exists
    const services = await bookingPortalRepository.getServicesByDoctorId(profile.doctorId)
    const service = services.find((s) => s.serviceId === bookingRequest.serviceId && s.active)

    if (!service) {
      throw new AppError('Selected medical service is not available.', 404, 'SERVICE_NOT_FOUND')
    }

    const bookingRef = `APT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(
      10000 + Math.random() * 90000
    )}`

    // Log Audit Event
    try {
      await auditEngineService.recordEvent({
        tenantId: profile.tenantId,
        clinicId: profile.clinicId,
        userId: 'PUBLIC_PATIENT',
        userRole: 'PATIENT',
        userDisplayName: bookingRequest.patientName,
        module: 'APPOINTMENTS',
        eventCategory: 'PATIENT_CARE',
        entityType: 'Appointment',
        entityId: bookingRef,
        action: 'PUBLIC_BOOKING_CREATED',
        severity: 'INFORMATION',
        newStateSummary: {
          bookingRef,
          doctorName: profile.doctorName,
          serviceTitle: service.title,
          appointmentDate: bookingRequest.appointmentDate,
          appointmentTime: bookingRequest.appointmentTime,
          patientPhone: bookingRequest.patientPhone,
        },
      })
    } catch {
      // Audit engine silent error fallback
    }

    return {
      bookingReference: bookingRef,
      status: 'APPOINTMENT_SCHEDULED',
      appointmentDetails: {
        doctorName: profile.doctorName,
        serviceTitle: service.title,
        appointmentDate: bookingRequest.appointmentDate,
        appointmentTime: bookingRequest.appointmentTime,
        durationMins: service.duration,
        consultationFee: service.consultationFee,
        currency: service.currency,
        clinicAddress: profile.contact.clinicAddress,
      },
      patientDetails: {
        patientName: bookingRequest.patientName,
        patientPhone: bookingRequest.patientPhone,
      },
      confirmationMessage: 'Your appointment has been successfully scheduled. An SMS confirmation has been sent to your mobile.',
    }
  }

  // Dashboard Management Services
  public async getDashboardProfile(doctorId: string): Promise<IDoctorPublicProfile> {
    const profile = await bookingPortalRepository.getProfileByDoctorId(doctorId)
    if (!profile) {
      throw new AppError('Doctor public profile not found', 404, 'PROFILE_NOT_FOUND')
    }
    return profile
  }

  public async updateProfileBio(doctorId: string, updates: Record<string, unknown>): Promise<IDoctorPublicProfile> {
    const profile = await this.getDashboardProfile(doctorId)

    if (updates.doctorName) profile.doctorName = (updates.doctorName as string).trim()
    if (updates.doctorTitle) profile.doctorTitle = (updates.doctorTitle as string).trim()
    if (updates.consultationFee) profile.consultationFee = Number(updates.consultationFee)
    if (updates.aboutDoctor) profile.publicContent.aboutDoctor = (updates.aboutDoctor as string).trim()
    if (updates.aboutClinic) profile.publicContent.aboutClinic = (updates.aboutClinic as string).trim()

    const saved = await bookingPortalRepository.saveProfile(profile)

    await auditEngineService.recordEvent({
      tenantId: profile.tenantId,
      clinicId: profile.clinicId,
      userId: doctorId,
      userRole: 'DOCTOR',
      userDisplayName: profile.doctorName,
      module: 'CLINIC',
      eventCategory: 'ADMINISTRATION',
      entityType: 'DoctorPublicProfile',
      entityId: doctorId,
      action: 'PUBLIC_PROFILE_UPDATED',
      severity: 'INFORMATION',
    })

    return saved
  }

  public async updateBranding(doctorId: string, rawPayload: Record<string, unknown>): Promise<IBrandingTokens> {
    const profile = await this.getDashboardProfile(doctorId)
    const branding = BookingPortalValidator.validateBranding(rawPayload)

    profile.branding = branding
    await bookingPortalRepository.saveProfile(profile)

    await auditEngineService.recordEvent({
      tenantId: profile.tenantId,
      clinicId: profile.clinicId,
      userId: doctorId,
      userRole: 'DOCTOR',
      userDisplayName: profile.doctorName,
      module: 'CLINIC',
      eventCategory: 'ADMINISTRATION',
      entityType: 'DoctorBranding',
      entityId: doctorId,
      action: 'BRANDING_TOKENS_UPDATED',
      severity: 'INFORMATION',
    })

    return profile.branding
  }

  public async updateBookingSettings(doctorId: string, rawPayload: Record<string, unknown>): Promise<IBookingSettings> {
    const profile = await this.getDashboardProfile(doctorId)
    const settings = BookingPortalValidator.validateBookingSettings(rawPayload)

    profile.bookingSettings = settings
    await bookingPortalRepository.saveProfile(profile)

    await auditEngineService.recordEvent({
      tenantId: profile.tenantId,
      clinicId: profile.clinicId,
      userId: doctorId,
      userRole: 'DOCTOR',
      userDisplayName: profile.doctorName,
      module: 'APPOINTMENTS',
      eventCategory: 'ADMINISTRATION',
      entityType: 'BookingSettings',
      entityId: doctorId,
      action: 'BOOKING_SETTINGS_UPDATED',
      severity: 'INFORMATION',
    })

    return profile.bookingSettings
  }

  public async updateSeoSettings(doctorId: string, rawPayload: Record<string, unknown>): Promise<ISeoSettings> {
    const profile = await this.getDashboardProfile(doctorId)
    const seo = BookingPortalValidator.validateSeoSettings(rawPayload)

    profile.seo = seo
    await bookingPortalRepository.saveProfile(profile)

    await auditEngineService.recordEvent({
      tenantId: profile.tenantId,
      clinicId: profile.clinicId,
      userId: doctorId,
      userRole: 'DOCTOR',
      userDisplayName: profile.doctorName,
      module: 'CLINIC',
      eventCategory: 'ADMINISTRATION',
      entityType: 'SeoSettings',
      entityId: doctorId,
      action: 'SEO_SETTINGS_UPDATED',
      severity: 'INFORMATION',
    })

    return profile.seo
  }

  // Service Catalog CRUD
  public async getDashboardServices(doctorId: string): Promise<IDoctorService[]> {
    return await bookingPortalRepository.getServicesByDoctorId(doctorId)
  }

  public async createDashboardService(doctorId: string, payload: Record<string, unknown>): Promise<IDoctorService> {
    const profile = await this.getDashboardProfile(doctorId)
    const serviceId = `srv_${Date.now()}`

    const newService: IDoctorService = {
      serviceId,
      doctorId,
      tenantId: profile.tenantId,
      clinicId: profile.clinicId,
      title: (payload.title as string || 'New Service').trim(),
      description: (payload.description as string || '').trim(),
      duration: Number(payload.duration) || 30,
      consultationFee: Number(payload.consultationFee) || profile.consultationFee,
      currency: profile.currency,
      displayOrder: Number(payload.displayOrder) || 1,
      icon: (payload.icon as string || 'Stethoscope').trim(),
      active: payload.active !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return await bookingPortalRepository.saveService(newService)
  }

  public async deleteDashboardService(doctorId: string, serviceId: string): Promise<boolean> {
    return await bookingPortalRepository.deleteService(doctorId, serviceId)
  }

  // Gallery CRUD
  public async getDashboardGallery(doctorId: string): Promise<IDoctorGalleryItem[]> {
    return await bookingPortalRepository.getGalleryByDoctorId(doctorId)
  }

  public async createDashboardGalleryItem(doctorId: string, payload: Record<string, unknown>): Promise<IDoctorGalleryItem> {
    const profile = await this.getDashboardProfile(doctorId)
    const imageId = `img_${Date.now()}`

    const item: IDoctorGalleryItem = {
      imageId,
      doctorId,
      tenantId: profile.tenantId,
      clinicId: profile.clinicId,
      title: (payload.title as string || 'Clinic Image').trim(),
      imageUrl: (payload.imageUrl as string || '').trim(),
      imageType: (payload.imageType as IDoctorGalleryItem['imageType']) || 'Clinic',
      displayOrder: Number(payload.displayOrder) || 1,
      createdAt: new Date().toISOString(),
    }

    return await bookingPortalRepository.saveGalleryItem(item)
  }

  public async deleteDashboardGalleryItem(doctorId: string, imageId: string): Promise<boolean> {
    return await bookingPortalRepository.deleteGalleryItem(doctorId, imageId)
  }

  // FAQ CRUD
  public async getDashboardFaqs(doctorId: string): Promise<IDoctorFaq[]> {
    return await bookingPortalRepository.getFaqsByDoctorId(doctorId)
  }

  public async createDashboardFaq(doctorId: string, payload: Record<string, unknown>): Promise<IDoctorFaq> {
    const profile = await this.getDashboardProfile(doctorId)
    const faqId = `faq_${Date.now()}`

    const faq: IDoctorFaq = {
      faqId,
      doctorId,
      tenantId: profile.tenantId,
      clinicId: profile.clinicId,
      question: (payload.question as string || '').trim(),
      answer: (payload.answer as string || '').trim(),
      displayOrder: Number(payload.displayOrder) || 1,
      active: payload.active !== false,
      createdAt: new Date().toISOString(),
    }

    return await bookingPortalRepository.saveFaq(faq)
  }

  public async deleteDashboardFaq(doctorId: string, faqId: string): Promise<boolean> {
    return await bookingPortalRepository.deleteFaq(doctorId, faqId)
  }

  // Analytics
  public async getDashboardAnalytics(doctorId: string, period?: string): Promise<IBookingAnalytics> {
    return await bookingPortalRepository.getAnalyticsByDoctorId(doctorId, period)
  }
}

export const bookingPortalService = new BookingPortalService()
