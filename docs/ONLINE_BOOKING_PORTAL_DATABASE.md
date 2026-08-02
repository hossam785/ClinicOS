# Online Booking Portal Database Architecture Specification — ClinicOS

## 1. Executive Summary & Strategy

The **Online Booking Portal Database Architecture (Module-015)** defines the MongoDB storage layer, collection schemas, index strategies, relational mappings, and isolation constraints for public doctor landing pages and appointment booking in **ClinicOS**.

### Core Database Architectural Principles
1. **Extension Without Duplication**: The portal extends the existing core `doctors` and `appointments` collections by storing public-facing branding, FAQs, service catalogs, and reviews in dedicated satellite collections without duplicating core clinical data.
2. **Strict Multi-Tenant Isolation**: Every collection mandates `tenantId` scoping, enforcing compound indexes with `tenantId` prefixing to guarantee zero cross-clinic data leaks.
3. **Covered Query Performance**: All public landing page lookups use covered compound indexes to deliver sub-20ms public page rendering.
4. **Zero Exposure of Private PHI**: Public satellite collections contain zero protected health information (PHI), clinical SOAP notes, or private financial ledgers.
5. **Desktop Offline Synchronization Compatibility**: Public portal collections sync seamlessly with the desktop source of truth upon online network reconnection.

---

## 2. MongoDB Collection Schemas

The module introduces 6 dedicated MongoDB collections.

### 2.1 Collection: `doctor_public_profiles`
Stores doctor branding tokens, bio, contact links, booking rules, and SEO configurations.

```javascript
{
  "_id": ObjectId("60d5ecb8b5c9c22b10a5c100"),
  "tenantId": "tenant-clinic-001",
  "clinicId": "branch-main",
  "doctorId": "doc_ahmed_01",
  "publicSlug": "dr-ahmed-al-mansoor",
  "publicProfileEnabled": true,
  "profileVisibility": "PUBLIC", // PUBLIC | UNLISTED | PRIVATE
  "branding": {
    "coverImage": "https://cdn.clinicos.com/tenants/tenant-clinic-001/covers/dr-ahmed-cover.jpg",
    "profileImage": "https://cdn.clinicos.com/tenants/tenant-clinic-001/avatars/dr-ahmed-avatar.jpg",
    "clinicLogo": "https://cdn.clinicos.com/tenants/tenant-clinic-001/logos/clinic-logo.png",
    "primaryColor": "#047857", // Hex color token
    "secondaryColor": "#0F172A",
    "accentColor": "#F59E0B"
  },
  "publicContent": {
    "welcomeMessage": "Welcome to my specialized cardiology practice.",
    "aboutDoctor": "Dr. Ahmed Al-Mansoor is a Consultant Cardiologist with over 15 years of clinical experience in interventional cardiology.",
    "aboutClinic": "State-of-the-art cardiovascular care facility equipped with modern diagnostics."
  },
  "contact": {
    "clinicPhone": "+201000000000",
    "clinicAddress": "123 Medical Tower, Building B, 4th Floor, Cairo, Egypt",
    "googleMapsLink": "https://maps.google.com/?q=30.0444,31.2357"
  },
  "professionalInfo": {
    "specialty": "Cardiology",
    "subSpecialties": ["Interventional Cardiology", "Electrophysiology"],
    "degrees": ["MD Cardiology (Cairo Univ)", "Fellow of European Society of Cardiology (FESC)"],
    "yearsOfExperience": 15,
    "languages": ["Arabic", "English", "French"]
  },
  "bookingConstraints": {
    "onlineBookingEnabled": true,
    "appointmentDuration": 30, // Duration in minutes
    "bookingInterval": 30,
    "bookingBuffer": 5, // Sanitation buffer in minutes
    "maxDailyAppointments": 20,
    "acceptNewPatients": true
  },
  "seo": {
    "seoTitle": "Dr. Ahmed Al-Mansoor — Consultant Cardiologist in Cairo | Book Online",
    "seoDescription": "Book an appointment online with Dr. Ahmed Al-Mansoor, Cardiology specialist. View fees, reviews, and working hours.",
    "seoKeywords": ["Cardiologist Cairo", "Heart Doctor", "Dr Ahmed Al-Mansoor"],
    "canonicalUrl": "https://clinic.com/book/dr-ahmed-al-mansoor",
    "openGraphImage": "https://cdn.clinicos.com/tenants/tenant-clinic-001/og/dr-ahmed-og.jpg"
  },
  "metrics": {
    "pageViews": 1420,
    "bookingRequests": 185
  },
  "createdAt": ISODate("2026-07-01T10:00:00.000Z"),
  "updatedAt": ISODate("2026-08-01T15:30:00.000Z")
}
```

---

### 2.2 Collection: `doctor_services`
Stores offered clinical services, fees, and durations.

```javascript
{
  "_id": ObjectId("60d5ecb8b5c9c22b10a5c110"),
  "serviceId": "srv_cardio_cons_01",
  "tenantId": "tenant-clinic-001",
  "clinicId": "branch-main",
  "doctorId": "doc_ahmed_01",
  "title": "Initial Cardiology Consultation",
  "description": "Comprehensive cardiac evaluation including ECG review and symptom assessment.",
  "duration": 30, // Minutes
  "consultationFee": 350.00,
  "currency": "EGP",
  "displayOrder": 1,
  "icon": "Stethoscope", // Lucide SVG icon name
  "active": true,
  "createdAt": ISODate("2026-07-01T10:00:00.000Z"),
  "updatedAt": ISODate("2026-07-15T12:00:00.000Z")
}
```

---

### 2.3 Collection: `doctor_galleries`
Stores clinic facility photos and verified board certificates.

```javascript
{
  "_id": ObjectId("60d5ecb8b5c9c22b10a5c120"),
  "imageId": "img_gallery_001",
  "tenantId": "tenant-clinic-001",
  "clinicId": "branch-main",
  "doctorId": "doc_ahmed_01",
  "title": "Main Reception & Waiting Lounge",
  "imageUrl": "https://cdn.clinicos.com/tenants/tenant-clinic-001/gallery/reception.jpg",
  "imageType": "Reception", // Clinic | Reception | Equipment | Certificate | Other
  "displayOrder": 1,
  "createdAt": ISODate("2026-07-01T10:00:00.000Z")
}
```

---

### 2.4 Collection: `doctor_faqs`
Stores doctor FAQs and answer accordions.

```javascript
{
  "_id": ObjectId("60d5ecb8b5c9c22b10a5c130"),
  "faqId": "faq_001",
  "tenantId": "tenant-clinic-001",
  "clinicId": "branch-main",
  "doctorId": "doc_ahmed_01",
  "question": "What should I bring to my first cardiac visit?",
  "answer": "Please bring any previous ECGs, recent blood lab results, cardiac echo reports, and a list of current medications.",
  "displayOrder": 1,
  "active": true,
  "createdAt": ISODate("2026-07-01T10:00:00.000Z")
}
```

---

### 2.5 Collection: `doctor_reviews`
Stores patient feedback, ratings, and featured review flags.

```javascript
{
  "_id": ObjectId("60d5ecb8b5c9c22b10a5c140"),
  "reviewId": "rev_001",
  "tenantId": "tenant-clinic-001",
  "clinicId": "branch-main",
  "doctorId": "doc_ahmed_01",
  "patientName": "Khaled M.",
  "rating": 5, // 1 to 5 Stars
  "reviewText": "Exceptional care and very thorough examination. Highly recommended doctor.",
  "featured": true,
  "approved": true,
  "createdAt": ISODate("2026-07-20T14:00:00.000Z")
}
```

---

### 2.6 Collection: `booking_analytics`
Stores privacy-compliant traffic and conversion analytics.

```javascript
{
  "_id": ObjectId("60d5ecb8b5c9c22b10a5c150"),
  "analyticsId": "anl_202608",
  "tenantId": "tenant-clinic-001",
  "clinicId": "branch-main",
  "doctorId": "doc_ahmed_01",
  "monthYear": "2026-08",
  "pageViews": 1420,
  "uniqueVisitors": 980,
  "bookingCount": 185,
  "conversionRate": 18.87, // Percentage
  "dailyVisitors": [
    { "date": "2026-08-01", "views": 45, "bookings": 8 }
  ],
  "lastUpdated": ISODate("2026-08-01T23:59:59.000Z")
}
```

---

## 3. Covered Indexing Strategy

```javascript
// Doctor Public Profiles Indexes
db.doctor_public_profiles.createIndex({ "tenantId": 1, "publicSlug": 1 }, { unique: true, name: "idx_tenant_slug_unique" });
db.doctor_public_profiles.createIndex({ "tenantId": 1, "doctorId": 1 }, { unique: true, name: "idx_tenant_doctor_unique" });
db.doctor_public_profiles.createIndex({ "tenantId": 1, "publicProfileEnabled": 1, "bookingConstraints.onlineBookingEnabled": 1 }, { name: "idx_tenant_public_active" });

// Doctor Services Indexes
db.doctor_services.createIndex({ "tenantId": 1, "doctorId": 1, "active": 1, "displayOrder": 1 }, { name: "idx_tenant_doctor_services" });

// Doctor Galleries & FAQs Indexes
db.doctor_galleries.createIndex({ "tenantId": 1, "doctorId": 1, "displayOrder": 1 }, { name: "idx_tenant_doctor_gallery" });
db.doctor_faqs.createIndex({ "tenantId": 1, "doctorId": 1, "active": 1, "displayOrder": 1 }, { name: "idx_tenant_doctor_faqs" });

// Doctor Reviews Indexes
db.doctor_reviews.createIndex({ "tenantId": 1, "doctorId": 1, "approved": 1, "featured": 1 }, { name: "idx_tenant_doctor_reviews" });

// Booking Analytics Indexes
db.booking_analytics.createIndex({ "tenantId": 1, "doctorId": 1, "monthYear": 1 }, { unique: true, name: "idx_tenant_analytics_month" });
```

---

## 4. Field Constraints & Validation Matrix

| Field | Type | Constraint / Validation Rule | Mandatory? |
| --- | --- | --- | --- |
| `publicSlug` | String | Unique per tenant, lowercase, regex: `^[a-z0-9\-]+$` | `YES` |
| `primaryColor` | String | Valid 6-digit hex color format (e.g. `#047857`) | `YES` |
| `appointmentDuration` | Number | Integer between 5 and 120 (minutes) | `YES` |
| `consultationFee` | Number | Non-negative numeric value (>= 0) | `YES` |
| `rating` | Number | Integer between 1 and 5 | `YES` |
| `displayOrder` | Number | Integer >= 1 | `YES` |

---

## 5. Relational Mapping Matrix

```
  [doctor_public_profiles]
            | 1:1
            v
       [doctors] <------------------+
            |                       |
   +--------+--------+              |
   | 1:N    | 1:N    | 1:N          | 1:N
   v        v        v              v
[services][gallery] [faqs]    [appointments]
                                    | 1:1
                                    v
                              [notifications] & [audit_logs]
```

---

## 6. Multi-Tenant Isolation & Security Barrier

1. **Tenant Scoping**: All queries enforce `{ tenantId: req.user.tenantId }`.
2. **Platform Owner Barrier (`PLATFORM_ADMIN_BRANDING_RESTRICTED`)**: `SUPER_ADMIN` accounts are prohibited from modifying clinic branding or doctor portal settings (`403 Forbidden`).
3. **Zero PHI Exposure**: Satellite portal collections contain zero medical charts, diagnosis codes, or financial ledgers.

---

## 7. Reserved V2 Extension Schema Slots

*Note: For documentation only. Do NOT implement in Version 1.*

1. `paymentsConfig`: Sub-document storing Paymob / Stripe publishable API keys and deposit requirements.
2. `whatsAppBotConfig`: Sub-document storing WhatsApp Business API template IDs and phone numbers.
3. `telehealthConfig`: Sub-document storing WebRTC video meeting room prefixes.
4. `verificationBadge`: Boolean flag indicating official Ministry of Health digital verification.

---

## 8. Summary Matrix

| Collection Name | Primary Purpose | Covered Index |
| --- | --- | --- |
| `doctor_public_profiles` | Public Landing Page Settings & SEO | `idx_tenant_slug_unique` |
| `doctor_services` | Medical Services Catalog & Fees | `idx_tenant_doctor_services` |
| `doctor_galleries` | Clinic Facilities & Certificate Images | `idx_tenant_doctor_gallery` |
| `doctor_faqs` | Patient FAQ Accordions | `idx_tenant_doctor_faqs` |
| `doctor_reviews` | Patient Testimonials & Star Ratings | `idx_tenant_doctor_reviews` |
| `booking_analytics` | Monthly Traffic & Conversion Metrics | `idx_tenant_analytics_month` |
