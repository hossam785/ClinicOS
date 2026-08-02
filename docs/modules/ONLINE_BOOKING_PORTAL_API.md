# Online Booking Portal REST API Specification — ClinicOS

## 1. Executive Summary & Architectural Principles

The **Online Booking Portal REST API Specification (Module-015)** defines the HTTP interface for public doctor landing pages, real-time appointment booking, doctor dashboard customization, SEO management, and analytics tracking in **ClinicOS**.

### Core API Architectural Principles
1. **Public vs. Dashboard Separation**:
   - **Public Endpoints (`/api/v1/public/doctors/*`)**: Accessible without authentication. Returns sanitized public doctor profiles, service catalogs, open slot calendars, FAQs, and accepts patient bookings.
   - **Dashboard Endpoints (`/api/v1/dashboard/booking/*`)**: Protected by JWT authentication and RBAC permissions. Controls doctor branding, content, services, gallery, FAQs, SEO, and analytics.
2. **Platform Owner Barrier (`PLATFORM_ADMIN_BRANDING_RESTRICTED`)**: Requests under `tenantId: "PLATFORM"` or by `SUPER_ADMIN` are barred from modifying clinic branding or doctor portal settings (`403 Forbidden`).
3. **Atomic Double-Booking Guard**: Calling `POST /api/v1/public/doctors/:slug/book` uses real-time atomic locking to prevent race conditions between online patients and reception queue check-ins.
4. **Zero Exposure of Private PHI**: Public endpoints return zero patient medical records, SOAP notes, diagnosis history, or private clinic ledgers.
5. **Zero Emojis & Standard Response Envelopes**: Iconography strictly uses Lucide React SVG components. All API responses adhere to standardized JSON success and error envelopes.

---

## 2. Endpoint Roster

### Public Endpoints (Unauthenticated)
| Method | Endpoint Path | Description |
| --- | --- | --- |
| `GET` | `/api/v1/public/doctors/:slug` | Get public doctor landing page profile & branding |
| `GET` | `/api/v1/public/doctors/:slug/calendar` | Get available shift days & time slots |
| `POST` | `/api/v1/public/doctors/:slug/book` | Submit patient appointment booking |
| `GET` | `/api/v1/public/doctors/:slug/services` | Get offered medical services catalog |
| `GET` | `/api/v1/public/doctors/:slug/gallery` | Get clinic facility photos & credentials |
| `GET` | `/api/v1/public/doctors/:slug/faq` | Get doctor FAQs |
| `GET` | `/api/v1/public/doctors/:slug/reviews` | Get patient reviews & testimonials |

### Dashboard Management Endpoints (JWT Authenticated)
| Method | Endpoint Path | Description |
| --- | --- | --- |
| `PUT` | `/api/v1/dashboard/booking/profile` | Update doctor profile bio & contact info |
| `PUT` | `/api/v1/dashboard/booking/branding` | Update hero cover, avatar, logo & color tokens |
| `GET` | `/api/v1/dashboard/booking/services` | Get doctor services roster for management |
| `POST` | `/api/v1/dashboard/booking/services` | Create a new medical service offering |
| `PUT` | `/api/v1/dashboard/booking/services/:id` | Update an existing medical service offering |
| `DELETE` | `/api/v1/dashboard/booking/services/:id` | Delete/Deactivate a medical service offering |
| `GET` | `/api/v1/dashboard/booking/gallery` | Get gallery items & credentials |
| `POST` | `/api/v1/dashboard/booking/gallery` | Upload/Add new gallery image or credential |
| `PUT` | `/api/v1/dashboard/booking/gallery/:id` | Update gallery image title or display order |
| `DELETE` | `/api/v1/dashboard/booking/gallery/:id` | Delete gallery image or credential |
| `GET` | `/api/v1/dashboard/booking/faq` | Get FAQs for doctor management |
| `POST` | `/api/v1/dashboard/booking/faq` | Add new FAQ entry |
| `PUT` | `/api/v1/dashboard/booking/faq/:id` | Update existing FAQ entry |
| `DELETE` | `/api/v1/dashboard/booking/faq/:id` | Delete FAQ entry |
| `GET` | `/api/v1/dashboard/booking/settings` | Get portal booking constraints & rules |
| `PUT` | `/api/v1/dashboard/booking/settings` | Update booking constraints & slot buffers |
| `GET` | `/api/v1/dashboard/booking/seo` | Get SEO metadata & custom URL slug settings |
| `PUT` | `/api/v1/dashboard/booking/seo` | Update SEO metadata & custom URL slug |
| `GET` | `/api/v1/dashboard/booking/analytics` | Get traffic, page views & conversion metrics |

---

## 3. Public API Endpoint Specifications

### 3.1 Get Public Doctor Profile
- **Path**: `GET /api/v1/public/doctors/:slug`
- **Auth**: None (Public)
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "doctorInfo": {
      "doctorId": "doc_ahmed_01",
      "fullName": "Dr. Ahmed Al-Mansoor",
      "title": "Consultant Cardiologist",
      "specialty": "Cardiology",
      "subSpecialties": ["Interventional Cardiology", "Electrophysiology"],
      "degrees": ["MD Cardiology (Cairo Univ)", "FESC"],
      "yearsOfExperience": 15,
      "languages": ["Arabic", "English", "French"]
    },
    "clinicInfo": {
      "clinicName": "CardioCare Medical Center",
      "clinicPhone": "+201000000000",
      "clinicAddress": "123 Medical Tower, Building B, Cairo, Egypt",
      "googleMapsLink": "https://maps.google.com/?q=30.0444,31.2357"
    },
    "branding": {
      "coverImage": "https://cdn.clinicos.com/covers/dr-ahmed-cover.jpg",
      "profileImage": "https://cdn.clinicos.com/avatars/dr-ahmed-avatar.jpg",
      "clinicLogo": "https://cdn.clinicos.com/logos/clinic-logo.png",
      "primaryColor": "#047857",
      "secondaryColor": "#0F172A",
      "accentColor": "#F59E0B"
    },
    "content": {
      "welcomeMessage": "Welcome to my specialized cardiology practice.",
      "aboutDoctor": "Dr. Ahmed Al-Mansoor is a Consultant Cardiologist...",
      "aboutClinic": "State-of-the-art cardiovascular care facility..."
    },
    "seo": {
      "seoTitle": "Dr. Ahmed Al-Mansoor — Consultant Cardiologist in Cairo | Book Online",
      "seoDescription": "Book an appointment online with Dr. Ahmed Al-Mansoor, Cardiology specialist.",
      "canonicalUrl": "https://clinic.com/book/dr-ahmed-al-mansoor",
      "openGraphImage": "https://cdn.clinicos.com/og/dr-ahmed-og.jpg"
    },
    "bookingSettings": {
      "onlineBookingEnabled": true,
      "appointmentDuration": 30,
      "acceptNewPatients": true
    }
  },
  "meta": { "timestamp": "2026-08-01T15:30:00.000Z" }
}
```

---

### 3.2 Get Available Calendar & Time Slots
- **Path**: `GET /api/v1/public/doctors/:slug/calendar?date=2026-08-05`
- **Auth**: None (Public)
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "doctorSlug": "dr-ahmed-al-mansoor",
    "selectedDate": "2026-08-05",
    "isShiftDay": true,
    "maxDailyLimitReached": false,
    "availableSlots": [
      { "time": "16:00", "available": true },
      { "time": "16:30", "available": true },
      { "time": "17:00", "available": false, "reason": "SLOT_BOOKED" },
      { "time": "17:30", "available": true },
      { "time": "18:00", "available": true }
    ],
    "workingHours": { "opens": "16:00", "closes": "21:00" }
  },
  "meta": { "timestamp": "2026-08-01T15:30:00.000Z" }
}
```

---

### 3.3 Submit Patient Appointment Booking
- **Path**: `POST /api/v1/public/doctors/:slug/book`
- **Auth**: None (Public - Rate Limited)
- **Request Body**:
```json
{
  "serviceId": "srv_cardio_cons_01",
  "appointmentDate": "2026-08-05",
  "appointmentTime": "17:30",
  "patientName": "Khaled Mahmoud",
  "patientPhone": "+201012345678",
  "patientEmail": "khaled@example.com",
  "notes": "Experiencing mild chest tightness during exertion.",
  "honeypot": "" // Must be empty
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "data": {
    "bookingReference": "APT-202608-00421",
    "status": "APPOINTMENT_SCHEDULED",
    "appointmentDetails": {
      "doctorName": "Dr. Ahmed Al-Mansoor",
      "serviceTitle": "Initial Cardiology Consultation",
      "appointmentDate": "2026-08-05",
      "appointmentTime": "17:30",
      "durationMins": 30,
      "consultationFee": 350.00,
      "currency": "EGP",
      "clinicAddress": "123 Medical Tower, Building B, Cairo, Egypt"
    },
    "patientDetails": {
      "patientName": "Khaled Mahmoud",
      "patientPhone": "+201012345678"
    },
    "confirmationMessage": "Your appointment has been successfully booked. An SMS confirmation has been sent to your mobile."
  },
  "meta": { "timestamp": "2026-08-01T15:32:00.000Z" }
}
```

---

## 4. Dashboard Management API Endpoint Specifications

### 4.1 Update Branding Tokens
- **Path**: `PUT /api/v1/dashboard/booking/branding`
- **Headers**: `Authorization: Bearer <JWT>`, `x-tenant-id: <string>`
- **Permissions**: `ClinicOwner`, `ClinicAdmin`, `Doctor`
- **Request Body**:
```json
{
  "coverImage": "https://cdn.clinicos.com/covers/dr-ahmed-cover-v2.jpg",
  "profileImage": "https://cdn.clinicos.com/avatars/dr-ahmed-avatar-v2.jpg",
  "clinicLogo": "https://cdn.clinicos.com/logos/clinic-logo-v2.png",
  "primaryColor": "#047857",
  "secondaryColor": "#0F172A",
  "accentColor": "#F59E0B",
  "welcomeMessage": "Welcome to CardioCare Specialized Heart Clinic."
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "updatedAt": "2026-08-01T15:35:00.000Z",
    "branding": {
      "primaryColor": "#047857",
      "secondaryColor": "#0F172A",
      "accentColor": "#F59E0B"
    }
  },
  "meta": { "timestamp": "2026-08-01T15:35:00.000Z" }
}
```

---

### 4.2 Get Analytics Metrics
- **Path**: `GET /api/v1/dashboard/booking/analytics?period=2026-08`
- **Headers**: `Authorization: Bearer <JWT>`, `x-tenant-id: <string>`
- **Permissions**: `ClinicOwner`, `ClinicAdmin`, `Doctor`
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "period": "2026-08",
    "summary": {
      "pageViews": 1420,
      "uniqueVisitors": 980,
      "bookingRequests": 185,
      "conversionRate": 18.87
    },
    "topServices": [
      { "serviceTitle": "Initial Cardiology Consultation", "bookings": 120 },
      { "serviceTitle": "Echocardiogram Exam", "bookings": 65 }
    ],
    "dailyTraffic": [
      { "date": "2026-08-01", "views": 45, "bookings": 8 }
    ]
  },
  "meta": { "timestamp": "2026-08-01T15:40:00.000Z" }
}
```

---

## 5. Security & Permission Scoping Matrix

| API Path | Public Visitor | Doctor | Receptionist | Clinic Manager | SUPER_ADMIN (Platform) |
| --- | --- | --- | --- | --- | --- |
| `GET /api/v1/public/doctors/*` | `ALLOWED` | `ALLOWED` | `ALLOWED` | `ALLOWED` | `ALLOWED` |
| `POST /api/v1/public/doctors/:slug/book` | `ALLOWED` | `ALLOWED` | `ALLOWED` | `ALLOWED` | `FORBIDDEN` |
| `PUT /api/v1/dashboard/booking/profile` | `FORBIDDEN` | `ALLOWED` | `FORBIDDEN` | `ALLOWED` | `PLATFORM_RESTRICTED` |
| `PUT /api/v1/dashboard/booking/branding` | `FORBIDDEN` | `ALLOWED` | `FORBIDDEN` | `ALLOWED` | `PLATFORM_RESTRICTED` |
| `GET /api/v1/dashboard/booking/analytics` | `FORBIDDEN` | `ALLOWED` | `FORBIDDEN` | `ALLOWED` | `PLATFORM_RESTRICTED` |

---

## 6. Standardized Error Response Catalog

```json
{
  "success": false,
  "error": {
    "code": "SLOT_UNAVAILABLE",
    "message": "The selected time slot has already been booked by another patient. Please choose an alternative slot.",
    "details": { "requestedDate": "2026-08-05", "requestedTime": "17:30" }
  },
  "meta": { "timestamp": "2026-08-01T15:32:05.000Z" }
}
```

### Standard Error Codes Matrix
- `400 INVALID_SLUG`: Doctor public URL slug format is invalid.
- `400 INVALID_PHONE`: Mobile phone number does not conform to E.164 regional formatting.
- `400 SPAM_DETECTED`: Honeypot input triggered or spam pattern detected.
- `403 PLATFORM_ADMIN_BRANDING_RESTRICTED`: Platform Owner cannot modify clinic branding.
- `404 DOCTOR_NOT_FOUND`: No active doctor profile matches the requested URL slug.
- `409 SLOT_UNAVAILABLE`: Concurrency conflict; requested booking slot was just reserved.
- `429 TOO_MANY_REQUESTS`: IP rate limit exceeded (max 5 booking submissions/hour).

---

## 7. Reserved V2 API Endpoints

*Note: For documentation only. Do NOT implement in Version 1.*

- `POST /api/v1/public/doctors/:slug/pay`: Process online payment deposit before booking slot finalization.
- `POST /api/v1/webhooks/whatsapp`: Process WhatsApp two-way booking confirmation webhooks.
- `POST /api/v1/public/otp/send`: Trigger 4-digit SMS OTP verification code.
- `POST /api/v1/public/telehealth/token`: Generate WebRTC video meeting room tokens.
