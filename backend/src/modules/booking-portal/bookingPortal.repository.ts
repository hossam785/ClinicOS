import type {
  IDoctorPublicProfile,
  IDoctorService,
  IDoctorGalleryItem,
  IDoctorFaq,
  IDoctorReview,
  IBookingAnalytics,
} from './bookingPortal.types'

export class BookingPortalRepository {
  // In-memory data store for satellite collections
  private profiles: Map<string, IDoctorPublicProfile> = new Map()
  private services: Map<string, IDoctorService[]> = new Map() // doctorId -> services
  private galleries: Map<string, IDoctorGalleryItem[]> = new Map() // doctorId -> items
  private faqs: Map<string, IDoctorFaq[]> = new Map() // doctorId -> faqs
  private reviews: Map<string, IDoctorReview[]> = new Map() // doctorId -> reviews
  private analytics: Map<string, IBookingAnalytics> = new Map() // doctorId -> analytics

  constructor() {
    this.seedDefaults()
  }

  private seedDefaults() {
    const defaultDoctorId = 'doc_ahmed_01'
    const defaultSlug = 'dr-ahmed-al-mansoor'

    const defaultProfile: IDoctorPublicProfile = {
      doctorId: defaultDoctorId,
      tenantId: 'tenant-default-001',
      clinicId: 'clinic-branch-01',
      publicSlug: defaultSlug,
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    this.profiles.set(defaultSlug, defaultProfile)

    this.services.set(defaultDoctorId, [
      {
        serviceId: 'srv_01',
        doctorId: defaultDoctorId,
        tenantId: 'tenant-default-001',
        clinicId: 'clinic-branch-01',
        title: 'Initial Cardiology Consultation',
        description: 'Comprehensive cardiac checkup including medical history review, physical exam, and initial ECG analysis.',
        duration: 30,
        consultationFee: 350,
        currency: 'EGP',
        displayOrder: 1,
        icon: 'Stethoscope',
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        serviceId: 'srv_02',
        doctorId: defaultDoctorId,
        tenantId: 'tenant-default-001',
        clinicId: 'clinic-branch-01',
        title: 'Echocardiogram Exam',
        description: 'High-resolution cardiac ultrasound mapping valve movement and ejection fraction.',
        duration: 45,
        consultationFee: 600,
        currency: 'EGP',
        displayOrder: 2,
        icon: 'Activity',
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        serviceId: 'srv_03',
        doctorId: defaultDoctorId,
        tenantId: 'tenant-default-001',
        clinicId: 'clinic-branch-01',
        title: '24-Hour Holter Monitoring',
        description: 'Continuous ambulatory ECG recording for arrhythmia detection.',
        duration: 30,
        consultationFee: 800,
        currency: 'EGP',
        displayOrder: 3,
        icon: 'Clock',
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ])

    this.galleries.set(defaultDoctorId, [
      {
        imageId: 'img_01',
        doctorId: defaultDoctorId,
        tenantId: 'tenant-default-001',
        clinicId: 'clinic-branch-01',
        title: 'Main Reception & Waiting Lounge',
        imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
        imageType: 'Reception',
        displayOrder: 1,
        createdAt: new Date().toISOString(),
      },
      {
        imageId: 'img_02',
        doctorId: defaultDoctorId,
        tenantId: 'tenant-default-001',
        clinicId: 'clinic-branch-01',
        title: 'Cardiac Examination Room',
        imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
        imageType: 'Clinic',
        displayOrder: 2,
        createdAt: new Date().toISOString(),
      },
    ])

    this.faqs.set(defaultDoctorId, [
      {
        faqId: 'faq_01',
        doctorId: defaultDoctorId,
        tenantId: 'tenant-default-001',
        clinicId: 'clinic-branch-01',
        question: 'What documents should I bring to my first consultation?',
        answer: 'Please bring any previous ECG reports, recent blood lab tests, cardiac echo scans, and a complete list of current medications.',
        displayOrder: 1,
        active: true,
        createdAt: new Date().toISOString(),
      },
      {
        faqId: 'faq_02',
        doctorId: defaultDoctorId,
        tenantId: 'tenant-default-001',
        clinicId: 'clinic-branch-01',
        question: 'What is the follow-up visit policy?',
        answer: 'Follow-up visits within 14 days of the initial consultation are provided at a 50% reduced fee.',
        displayOrder: 2,
        active: true,
        createdAt: new Date().toISOString(),
      },
    ])

    this.reviews.set(defaultDoctorId, [
      {
        reviewId: 'rev_01',
        doctorId: defaultDoctorId,
        tenantId: 'tenant-default-001',
        clinicId: 'clinic-branch-01',
        patientName: 'Khaled M.',
        rating: 5,
        reviewText:
          'Dr. Ahmed is exceptionally thorough and patient. He explained my ECG and echo results clearly and set a manageable treatment plan.',
        featured: true,
        approved: true,
        createdAt: '2026-07-20T10:00:00.000Z',
      },
      {
        reviewId: 'rev_02',
        doctorId: defaultDoctorId,
        tenantId: 'tenant-default-001',
        clinicId: 'clinic-branch-01',
        patientName: 'Sarah K.',
        rating: 5,
        reviewText: 'Punctual appointment times, clean modern clinic, and wonderful staff. Highly recommended cardiologist!',
        featured: true,
        approved: true,
        createdAt: '2026-07-15T14:30:00.000Z',
      },
    ])

    this.analytics.set(defaultDoctorId, {
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
  }

  // Profile queries
  public async getProfileBySlug(slug: string): Promise<IDoctorPublicProfile | null> {
    const profile = this.profiles.get(slug)
    return profile ? { ...profile } : null
  }

  public async getProfileByDoctorId(doctorId: string): Promise<IDoctorPublicProfile | null> {
    for (const profile of this.profiles.values()) {
      if (profile.doctorId === doctorId) {
        return { ...profile }
      }
    }
    return null
  }

  public async saveProfile(profile: IDoctorPublicProfile): Promise<IDoctorPublicProfile> {
    profile.updatedAt = new Date().toISOString()
    this.profiles.set(profile.publicSlug, { ...profile })
    return { ...profile }
  }

  // Service catalog queries
  public async getServicesByDoctorId(doctorId: string): Promise<IDoctorService[]> {
    const list = this.services.get(doctorId) || []
    return [...list].sort((a, b) => a.displayOrder - b.displayOrder)
  }

  public async saveService(service: IDoctorService): Promise<IDoctorService> {
    const list = this.services.get(service.doctorId) || []
    const idx = list.findIndex((s) => s.serviceId === service.serviceId)
    if (idx >= 0) {
      list[idx] = { ...service, updatedAt: new Date().toISOString() }
    } else {
      list.push({ ...service })
    }
    this.services.set(service.doctorId, list)
    return { ...service }
  }

  public async deleteService(doctorId: string, serviceId: string): Promise<boolean> {
    const list = this.services.get(doctorId) || []
    const filtered = list.filter((s) => s.serviceId !== serviceId)
    this.services.set(doctorId, filtered)
    return filtered.length < list.length
  }

  // Gallery queries
  public async getGalleryByDoctorId(doctorId: string): Promise<IDoctorGalleryItem[]> {
    const list = this.galleries.get(doctorId) || []
    return [...list].sort((a, b) => a.displayOrder - b.displayOrder)
  }

  public async saveGalleryItem(item: IDoctorGalleryItem): Promise<IDoctorGalleryItem> {
    const list = this.galleries.get(item.doctorId) || []
    const idx = list.findIndex((g) => g.imageId === item.imageId)
    if (idx >= 0) {
      list[idx] = { ...item }
    } else {
      list.push({ ...item })
    }
    this.galleries.set(item.doctorId, list)
    return { ...item }
  }

  public async deleteGalleryItem(doctorId: string, imageId: string): Promise<boolean> {
    const list = this.galleries.get(doctorId) || []
    const filtered = list.filter((g) => g.imageId !== imageId)
    this.galleries.set(doctorId, filtered)
    return filtered.length < list.length
  }

  // FAQ queries
  public async getFaqsByDoctorId(doctorId: string): Promise<IDoctorFaq[]> {
    const list = this.faqs.get(doctorId) || []
    return [...list].sort((a, b) => a.displayOrder - b.displayOrder)
  }

  public async saveFaq(faq: IDoctorFaq): Promise<IDoctorFaq> {
    const list = this.faqs.get(faq.doctorId) || []
    const idx = list.findIndex((f) => f.faqId === faq.faqId)
    if (idx >= 0) {
      list[idx] = { ...faq }
    } else {
      list.push({ ...faq })
    }
    this.faqs.set(faq.doctorId, list)
    return { ...faq }
  }

  public async deleteFaq(doctorId: string, faqId: string): Promise<boolean> {
    const list = this.faqs.get(doctorId) || []
    const filtered = list.filter((f) => f.faqId !== faqId)
    this.faqs.set(doctorId, filtered)
    return filtered.length < list.length
  }

  // Review queries
  public async getReviewsByDoctorId(doctorId: string): Promise<IDoctorReview[]> {
    const list = this.reviews.get(doctorId) || []
    return list.filter((r) => r.approved).sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
  }

  // Analytics queries
  public async getAnalyticsByDoctorId(doctorId: string, _period?: string): Promise<IBookingAnalytics> {
    const analytics = this.analytics.get(doctorId)
    if (analytics) return { ...analytics }

    return {
      period: '2026-08',
      summary: { pageViews: 0, uniqueVisitors: 0, bookingRequests: 0, conversionRate: 0 },
      topServices: [],
      dailyTraffic: [],
    }
  }

  public async recordPageView(doctorId: string): Promise<void> {
    const analytics = await this.getAnalyticsByDoctorId(doctorId)
    analytics.summary.pageViews += 1
    analytics.summary.uniqueVisitors += 1
    this.analytics.set(doctorId, analytics)
  }

  public async recordBookingAttempt(doctorId: string): Promise<void> {
    const analytics = await this.getAnalyticsByDoctorId(doctorId)
    analytics.summary.bookingRequests += 1
    analytics.summary.conversionRate = Number(
      ((analytics.summary.bookingRequests / (analytics.summary.pageViews || 1)) * 100).toFixed(2)
    )
    this.analytics.set(doctorId, analytics)
  }
}

export const bookingPortalRepository = new BookingPortalRepository()
