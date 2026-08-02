import { AppError } from '@/shared/errors/AppError'
import type { IBookingRequest, IBrandingTokens, IBookingSettings, ISeoSettings } from './bookingPortal.types'

export class BookingPortalValidator {
  /**
   * Validate custom URL slug format (lowercase alphanumeric and hyphens only)
   */
  public static validateSlug(slug: string): string {
    const trimmed = (slug || '').trim().toLowerCase()
    if (!trimmed) {
      throw new AppError('Public URL slug is required', 400, 'INVALID_SLUG')
    }
    const slugRegex = /^[a-z0-9-]+$/
    if (!slugRegex.test(trimmed)) {
      throw new AppError('Public URL slug can only contain lowercase letters, numbers, and hyphens', 400, 'INVALID_SLUG_FORMAT')
    }
    return trimmed
  }

  /**
   * Validate public booking submission request
   */
  public static validateBookingRequest(payload: Record<string, unknown>): IBookingRequest {
    if (!payload || typeof payload !== 'object') {
      throw new AppError('Invalid booking request body', 400, 'INVALID_PAYLOAD')
    }

    const honeypot = (payload.honeypot as string) || ''
    if (honeypot.trim().length > 0) {
      throw new AppError('Spam submission detected', 400, 'SPAM_DETECTED')
    }

    const serviceId = (payload.serviceId as string || '').trim()
    const appointmentDate = (payload.appointmentDate as string || '').trim()
    const appointmentTime = (payload.appointmentTime as string || '').trim()
    const patientName = (payload.patientName as string || '').trim()
    const patientPhone = (payload.patientPhone as string || '').trim()
    const patientEmail = (payload.patientEmail as string || '').trim()
    const notes = (payload.notes as string || '').trim()

    if (!serviceId) {
      throw new AppError('Service ID is required for booking', 400, 'MISSING_SERVICE_ID')
    }
    if (!appointmentDate || !/^\d{4}-\d{2}-\d{2}$/.test(appointmentDate)) {
      throw new AppError('Valid appointment date (YYYY-MM-DD) is required', 400, 'INVALID_DATE')
    }
    if (!appointmentTime || !/^\d{2}:\d{2}$/.test(appointmentTime)) {
      throw new AppError('Valid time slot (HH:MM) is required', 400, 'INVALID_TIME_SLOT')
    }
    if (!patientName || patientName.length < 2) {
      throw new AppError('Patient full name is required', 400, 'INVALID_PATIENT_NAME')
    }
    // E.164 or local Egypt phone format check
    const phoneRegex = /^\+?[0-9]{8,15}$/
    if (!patientPhone || !phoneRegex.test(patientPhone.replace(/\s+/g, ''))) {
      throw new AppError('Valid mobile phone number is required', 400, 'INVALID_PATIENT_PHONE')
    }

    return {
      serviceId,
      appointmentDate,
      appointmentTime,
      patientName,
      patientPhone,
      patientEmail: patientEmail || undefined,
      notes: notes || undefined,
      honeypot,
    }
  }

  /**
   * Validate visual branding color tokens and image URLs
   */
  public static validateBranding(payload: Record<string, unknown>): IBrandingTokens {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
    const primaryColor = (payload.primaryColor as string || '#047857').trim()
    const secondaryColor = (payload.secondaryColor as string || '#0F172A').trim()
    const accentColor = (payload.accentColor as string || '#F59E0B').trim()

    if (!hexRegex.test(primaryColor)) {
      throw new AppError('Invalid primary color hex format', 400, 'INVALID_COLOR_HEX')
    }
    if (!hexRegex.test(secondaryColor)) {
      throw new AppError('Invalid secondary color hex format', 400, 'INVALID_COLOR_HEX')
    }
    if (!hexRegex.test(accentColor)) {
      throw new AppError('Invalid accent color hex format', 400, 'INVALID_COLOR_HEX')
    }

    return {
      coverImage: (payload.coverImage as string || '').trim(),
      profileImage: (payload.profileImage as string || '').trim(),
      clinicLogo: (payload.clinicLogo as string || '').trim(),
      primaryColor,
      secondaryColor,
      accentColor,
    }
  }

  /**
   * Validate booking rules and constraints
   */
  public static validateBookingSettings(payload: Record<string, unknown>): IBookingSettings {
    const appointmentDuration = Number(payload.appointmentDuration) || 30
    const bookingInterval = Number(payload.bookingInterval) || 30
    const bookingBuffer = Number(payload.bookingBuffer) || 5
    const maxDailyAppointments = Number(payload.maxDailyAppointments) || 20

    if (appointmentDuration < 5 || appointmentDuration > 240) {
      throw new AppError('Appointment duration must be between 5 and 240 minutes', 400, 'INVALID_DURATION')
    }
    if (bookingBuffer < 0 || bookingBuffer > 60) {
      throw new AppError('Booking buffer must be between 0 and 60 minutes', 400, 'INVALID_BUFFER')
    }
    if (maxDailyAppointments < 1 || maxDailyAppointments > 200) {
      throw new AppError('Max daily appointments cap must be between 1 and 200', 400, 'INVALID_DAILY_CAP')
    }

    return {
      onlineBookingEnabled: payload.onlineBookingEnabled !== false,
      appointmentDuration,
      bookingInterval,
      bookingBuffer,
      maxDailyAppointments,
      acceptNewPatients: payload.acceptNewPatients !== false,
    }
  }

  /**
   * Validate SEO metadata settings
   */
  public static validateSeoSettings(payload: Record<string, unknown>): ISeoSettings {
    const seoTitle = (payload.seoTitle as string || '').trim()
    const seoDescription = (payload.seoDescription as string || '').trim()

    if (!seoTitle || seoTitle.length > 150) {
      throw new AppError('SEO Title is required and must be under 150 characters', 400, 'INVALID_SEO_TITLE')
    }
    if (!seoDescription || seoDescription.length > 300) {
      throw new AppError('SEO Description is required and must be under 300 characters', 400, 'INVALID_SEO_DESCRIPTION')
    }

    return {
      seoTitle,
      seoDescription,
      seoKeywords: Array.isArray(payload.seoKeywords) ? payload.seoKeywords.map((k) => String(k).trim()) : [],
      canonicalUrl: (payload.canonicalUrl as string || '').trim(),
      openGraphImage: (payload.openGraphImage as string || '').trim(),
    }
  }
}
