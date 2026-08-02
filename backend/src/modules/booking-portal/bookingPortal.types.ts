// Online Booking Portal Types & Contracts — Module-015

export type PortalVisibility = 'PUBLIC' | 'PRIVATE' | 'UNLISTED'
export type GalleryImageType = 'Clinic' | 'Reception' | 'Equipment' | 'Doctor' | 'Certificate' | 'Other'

export interface IBrandingTokens {
  coverImage: string
  profileImage: string
  clinicLogo: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
}

export interface IPublicContent {
  welcomeMessage: string
  aboutDoctor: string
  aboutClinic: string
}

export interface IClinicContact {
  clinicPhone: string
  clinicAddress: string
  googleMapsLink: string
}

export interface IProfessionalInfo {
  specialty: string
  subSpecialties: string[]
  degrees: string[]
  yearsOfExperience: number
  languages: string[]
}

export interface IBookingSettings {
  onlineBookingEnabled: boolean
  appointmentDuration: number // mins
  bookingInterval: number // mins
  bookingBuffer: number // mins
  maxDailyAppointments: number
  acceptNewPatients: boolean
}

export interface ISeoSettings {
  seoTitle: string
  seoDescription: string
  seoKeywords: string[]
  canonicalUrl: string
  openGraphImage: string
}

export interface IDoctorPublicProfile {
  doctorId: string
  tenantId: string
  clinicId: string
  publicSlug: string
  publicProfileEnabled: boolean
  profileVisibility: PortalVisibility
  doctorName: string
  doctorTitle: string
  clinicName: string
  consultationFee: number
  currency: string
  rating: number
  reviewCount: number
  branding: IBrandingTokens
  publicContent: IPublicContent
  contact: IClinicContact
  professionalInfo: IProfessionalInfo
  bookingSettings: IBookingSettings
  seo: ISeoSettings
  createdAt: string
  updatedAt: string
}

export interface IDoctorService {
  serviceId: string
  doctorId: string
  tenantId: string
  clinicId: string
  title: string
  description: string
  duration: number
  consultationFee: number
  currency: string
  displayOrder: number
  icon: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface IDoctorGalleryItem {
  imageId: string
  doctorId: string
  tenantId: string
  clinicId: string
  title: string
  imageUrl: string
  imageType: GalleryImageType
  displayOrder: number
  createdAt: string
}

export interface IDoctorFaq {
  faqId: string
  doctorId: string
  tenantId: string
  clinicId: string
  question: string
  answer: string
  displayOrder: number
  active: boolean
  createdAt: string
}

export interface IDoctorReview {
  reviewId: string
  doctorId: string
  tenantId: string
  clinicId: string
  patientName: string
  rating: number
  reviewText: string
  featured: boolean
  approved: boolean
  createdAt: string
}

export interface IPublicCalendarSlot {
  time: string
  available: boolean
  reason?: string
}

export interface IPublicCalendarDay {
  date: string
  isShiftDay: boolean
  maxDailyLimitReached: boolean
  availableSlots: IPublicCalendarSlot[]
  workingHours?: {
    opens: string
    closes: string
  }
}

export interface IBookingRequest {
  serviceId: string
  appointmentDate: string
  appointmentTime: string
  patientName: string
  patientPhone: string
  patientEmail?: string
  notes?: string
  honeypot?: string
}

export interface IBookingConfirmation {
  bookingReference: string
  status: string
  appointmentDetails: {
    doctorName: string
    serviceTitle: string
    appointmentDate: string
    appointmentTime: string
    durationMins: number
    consultationFee: number
    currency: string
    clinicAddress: string
  }
  patientDetails: {
    patientName: string
    patientPhone: string
  }
  confirmationMessage: string
}

export interface IBookingAnalytics {
  period: string
  summary: {
    pageViews: number
    uniqueVisitors: number
    bookingRequests: number
    conversionRate: number
  }
  topServices: Array<{
    serviceTitle: string
    bookings: number
  }>
  dailyTraffic: Array<{
    date: string
    views: number
    bookings: number
  }>
}
