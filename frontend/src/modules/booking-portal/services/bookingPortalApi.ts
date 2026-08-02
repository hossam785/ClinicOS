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

// Default mock baseline for initial load & fallback
const DEFAULT_PROFILE: IDoctorPublicProfile = {
  doctorId: 'doc_ahmed_01',
  publicSlug: 'dr-ahmed-al-mansoor',
  publicProfileEnabled: true,
  profileVisibility: 'PUBLIC',
  doctorName: 'Dr. Ahmed Al-Mansoor',
  doctorTitle: 'Consultant Cardiologist',
  clinicName: 'CardioCare Medical Center',
  consultationFee: 350,
  currency: 'EGP',
  rating: 4.9,
  reviewCount: 124,
  branding: {
    coverImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    profileImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    clinicLogo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=200&q=80',
    primaryColor: '#047857',
    secondaryColor: '#0F172A',
    accentColor: '#F59E0B',
  },
  publicContent: {
    welcomeMessage: 'Welcome to specialized cardiovascular medical care.',
    aboutDoctor:
      'Dr. Ahmed Al-Mansoor is a Consultant Cardiologist with over 15 years of clinical experience in interventional cardiology and cardiac diagnostics. Trained at top international medical centers.',
    aboutClinic:
      'CardioCare Center is equipped with state-of-the-art diagnostic ECG, Echocardiogram, and 24-hour Holter monitoring systems to ensure accurate patient diagnosis and personalized care.',
  },
  contact: {
    clinicPhone: '+201000000000',
    clinicAddress: '123 Medical Tower, Building B, 4th Floor, Cairo, Egypt',
    googleMapsLink: 'https://maps.google.com/?q=30.0444,31.2357',
  },
  professionalInfo: {
    specialty: 'Cardiology',
    subSpecialties: ['Interventional Cardiology', 'Electrophysiology'],
    degrees: ['MD Cardiology (Cairo Univ)', 'Fellow of European Society of Cardiology (FESC)'],
    yearsOfExperience: 15,
    languages: ['Arabic', 'English', 'French'],
  },
  bookingSettings: {
    onlineBookingEnabled: true,
    appointmentDuration: 30,
    bookingInterval: 30,
    bookingBuffer: 5,
    maxDailyAppointments: 20,
    acceptNewPatients: true,
  },
  seo: {
    seoTitle: 'Dr. Ahmed Al-Mansoor — Consultant Cardiologist in Cairo | Book Online',
    seoDescription:
      'Book an appointment online with Dr. Ahmed Al-Mansoor, Cardiology specialist. View fees, verified patient reviews, and clinic working hours.',
    seoKeywords: ['Cardiologist Cairo', 'Heart Doctor', 'Dr Ahmed Al Mansoor', 'CardioCare'],
    canonicalUrl: 'https://clinic.com/book/dr-ahmed-al-mansoor',
    openGraphImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
  },
}

const DEFAULT_SERVICES: IDoctorService[] = [
  {
    serviceId: 'srv_01',
    doctorId: 'doc_ahmed_01',
    title: 'Initial Cardiology Consultation',
    description: 'Comprehensive cardiac checkup including medical history review, physical exam, and initial ECG analysis.',
    duration: 30,
    consultationFee: 350,
    currency: 'EGP',
    displayOrder: 1,
    icon: 'Stethoscope',
    active: true,
  },
  {
    serviceId: 'srv_02',
    doctorId: 'doc_ahmed_01',
    title: 'Echocardiogram Exam',
    description: 'High-resolution cardiac ultrasound mapping valve movement and ejection fraction.',
    duration: 45,
    consultationFee: 600,
    currency: 'EGP',
    displayOrder: 2,
    icon: 'Activity',
    active: true,
  },
  {
    serviceId: 'srv_03',
    doctorId: 'doc_ahmed_01',
    title: '24-Hour Holter Monitoring',
    description: 'Continuous ambulatory ECG recording for arrhythmia detection.',
    duration: 30,
    consultationFee: 800,
    currency: 'EGP',
    displayOrder: 3,
    icon: 'Clock',
    active: true,
  },
]

const DEFAULT_GALLERY: IDoctorGalleryItem[] = [
  {
    imageId: 'img_01',
    doctorId: 'doc_ahmed_01',
    title: 'Main Reception & Waiting Lounge',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    imageType: 'Reception',
    displayOrder: 1,
    createdAt: new Date().toISOString(),
  },
  {
    imageId: 'img_02',
    doctorId: 'doc_ahmed_01',
    title: 'Cardiac Examination Room',
    imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
    imageType: 'Clinic',
    displayOrder: 2,
    createdAt: new Date().toISOString(),
  },
  {
    imageId: 'img_03',
    doctorId: 'doc_ahmed_01',
    title: 'Echocardiogram & Ultrasound System',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    imageType: 'Equipment',
    displayOrder: 3,
    createdAt: new Date().toISOString(),
  },
]

const DEFAULT_FAQS: IDoctorFaq[] = [
  {
    faqId: 'faq_01',
    doctorId: 'doc_ahmed_01',
    question: 'What documents should I bring to my first consultation?',
    answer: 'Please bring any previous ECG reports, recent blood lab tests, cardiac echo scans, and a complete list of current medications.',
    displayOrder: 1,
    active: true,
  },
  {
    faqId: 'faq_02',
    doctorId: 'doc_ahmed_01',
    question: 'What is the follow-up visit policy?',
    answer: 'Follow-up visits within 14 days of the initial consultation are provided at a 50% reduced fee.',
    displayOrder: 2,
    active: true,
  },
  {
    faqId: 'faq_03',
    doctorId: 'doc_ahmed_01',
    question: 'Is parking available at the medical center?',
    answer: 'Yes, secure underground parking is available directly underneath the Medical Tower.',
    displayOrder: 3,
    active: true,
  },
]

const DEFAULT_REVIEWS: IDoctorReview[] = [
  {
    reviewId: 'rev_01',
    doctorId: 'doc_ahmed_01',
    patientName: 'Khaled M.',
    rating: 5,
    reviewText: 'Dr. Ahmed is exceptionally thorough and patient. He explained my ECG and echo results clearly and set a manageable treatment plan.',
    featured: true,
    approved: true,
    createdAt: '2026-07-20T10:00:00.000Z',
  },
  {
    reviewId: 'rev_02',
    doctorId: 'doc_ahmed_01',
    patientName: 'Sarah K.',
    rating: 5,
    reviewText: 'Punctual appointment times, clean modern clinic, and wonderful staff. Highly recommended cardiologist!',
    featured: true,
    approved: true,
    createdAt: '2026-07-15T14:30:00.000Z',
  },
]

class BookingPortalApiService {
  // Public API methods
  public async getPublicDoctorProfile(_slug: string): Promise<IDoctorPublicProfile> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...DEFAULT_PROFILE }), 200)
    })
  }

  public async getPublicServices(_slug: string): Promise<IDoctorService[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...DEFAULT_SERVICES]), 150)
    })
  }

  public async getPublicGallery(_slug: string): Promise<IDoctorGalleryItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...DEFAULT_GALLERY]), 150)
    })
  }

  public async getPublicFaqs(_slug: string): Promise<IDoctorFaq[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...DEFAULT_FAQS]), 150)
    })
  }

  public async getPublicReviews(_slug: string): Promise<IDoctorReview[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...DEFAULT_REVIEWS]), 150)
    })
  }

  public async getPublicCalendar(_slug: string, date: string): Promise<IPublicCalendarDay> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          date,
          isShiftDay: true,
          maxDailyLimitReached: false,
          availableSlots: [
            { time: '16:00', available: true },
            { time: '16:30', available: true },
            { time: '17:00', available: false, reason: 'SLOT_BOOKED' },
            { time: '17:30', available: true },
            { time: '18:00', available: true },
            { time: '18:30', available: true },
            { time: '19:00', available: false, reason: 'SLOT_BOOKED' },
            { time: '19:30', available: true },
            { time: '20:00', available: true },
          ],
          workingHours: { opens: '16:00', closes: '21:00' },
        })
      }, 250)
    })
  }

  public async submitPublicBooking(_slug: string, request: IBookingRequest): Promise<IBookingConfirmation> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (request.honeypot && request.honeypot.trim() !== '') {
          return reject(new Error('SPAM_DETECTED: Invalid submission detected.'))
        }
        if (!request.patientName || !request.patientPhone) {
          return reject(new Error('VALIDATION_ERROR: Patient name and valid mobile phone are required.'))
        }

        resolve({
          bookingReference: `APT-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(
            10000 + Math.random() * 90000
          )}`,
          status: 'APPOINTMENT_SCHEDULED',
          appointmentDetails: {
            doctorName: DEFAULT_PROFILE.doctorName,
            serviceTitle: 'Initial Cardiology Consultation',
            appointmentDate: request.appointmentDate,
            appointmentTime: request.appointmentTime,
            durationMins: 30,
            consultationFee: 350,
            currency: 'EGP',
            clinicAddress: DEFAULT_PROFILE.contact.clinicAddress,
          },
          patientDetails: {
            patientName: request.patientName,
            patientPhone: request.patientPhone,
          },
          confirmationMessage: 'Your appointment has been successfully scheduled. An SMS confirmation has been sent to your mobile.',
        })
      }, 500)
    })
  }

  // Dashboard API methods
  public async updateProfileBio(
    updates: Partial<IDoctorPublicProfile>
  ): Promise<IDoctorPublicProfile> {
    return new Promise((resolve) => {
      setTimeout(() => {
        Object.assign(DEFAULT_PROFILE, updates)
        resolve({ ...DEFAULT_PROFILE })
      }, 300)
    })
  }

  public async updateBrandingTokens(branding: IBrandingTokens): Promise<IBrandingTokens> {
    return new Promise((resolve) => {
      setTimeout(() => {
        DEFAULT_PROFILE.branding = { ...branding }
        resolve({ ...DEFAULT_PROFILE.branding })
      }, 300)
    })
  }

  public async updateBookingSettings(settings: IBookingSettings): Promise<IBookingSettings> {
    return new Promise((resolve) => {
      setTimeout(() => {
        DEFAULT_PROFILE.bookingSettings = { ...settings }
        resolve({ ...DEFAULT_PROFILE.bookingSettings })
      }, 300)
    })
  }

  public async updateSeoSettings(seo: ISeoSettings): Promise<ISeoSettings> {
    return new Promise((resolve) => {
      setTimeout(() => {
        DEFAULT_PROFILE.seo = { ...seo }
        resolve({ ...DEFAULT_PROFILE.seo })
      }, 300)
    })
  }

  public async getAnalyticsMetrics(_period: string): Promise<IBookingAnalytics> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          period: '2026-08',
          summary: {
            pageViews: 1420,
            uniqueVisitors: 980,
            bookingRequests: 185,
            conversionRate: 18.87,
          },
          topServices: [
            { serviceTitle: 'Initial Cardiology Consultation', bookings: 120 },
            { serviceTitle: 'Echocardiogram Exam', bookings: 45 },
            { serviceTitle: '24-Hour Holter Monitoring', bookings: 20 },
          ],
          dailyTraffic: [
            { date: '2026-08-01', views: 45, bookings: 8 },
            { date: '2026-08-02', views: 52, bookings: 11 },
          ],
        })
      }, 300)
    })
  }
}

export const bookingPortalApi = new BookingPortalApiService()
