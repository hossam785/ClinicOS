export type ProfileVisibility = 'PUBLIC' | 'UNLISTED' | 'PRIVATE'
export type GalleryImageType = 'Clinic' | 'Reception' | 'Equipment' | 'Certificate' | 'Other'
export type AppointmentStatus = 'APPOINTMENT_SCHEDULED' | 'CONFIRMED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'

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
  appointmentDuration: number
  bookingInterval: number
  bookingBuffer: number
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
  publicSlug: string
  publicProfileEnabled: boolean
  profileVisibility: ProfileVisibility
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
}

export interface IDoctorService {
  serviceId: string
  doctorId: string
  title: string
  description: string
  duration: number
  consultationFee: number
  currency: string
  displayOrder: number
  icon: string
  active: boolean
}

export interface IDoctorGalleryItem {
  imageId: string
  doctorId: string
  title: string
  imageUrl: string
  imageType: GalleryImageType
  displayOrder: number
  createdAt: string
}

export interface IDoctorFaq {
  faqId: string
  doctorId: string
  question: string
  answer: string
  displayOrder: number
  active: boolean
}

export interface IDoctorReview {
  reviewId: string
  doctorId: string
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
  reason?: 'SLOT_BOOKED' | 'PAST_TIME' | 'DOCTOR_BREAK'
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
  status: AppointmentStatus
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
