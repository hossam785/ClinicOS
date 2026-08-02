# Online Booking Portal Business Requirements Specification — ClinicOS

## 1. Executive Summary & Core Philosophy

The **Online Booking Portal (Module-015)** serves as the digital public face, branding hub, and patient acquisition gateway for doctors and clinics operating on **ClinicOS**. 

Far beyond a basic appointment scheduler, the portal is an enterprise-grade, high-conversion medical landing page designed to establish clinical trust, showcase credentials, present medical services, and deliver a frictionless mobile-first booking experience.

```
+-------------------------------------------------------------------------------+
|                        PUBLIC ONLINE BOOKING PORTAL                           |
|  [Hero Cover & Doctor Profile]  -->  [Services]  -->  [Gallery & Certs]       |
|                                       |                                       |
|                                       v                                       |
|  [Real-Time Slot Engine]  -->  [Patient Details]  -->  [Instant Confirmation]  |
+-------------------------------------------------------------------------------+
                                        |
                                        v
+-------------------------------------------------------------------------------+
|                       CLINICOS BACKEND CORE MODULES                           |
|  [Appointments Module] <--> [Patient Index] <--> [Notifications] <--> [Audit] |
+-------------------------------------------------------------------------------+
```

### Core Philosophy & Architectural Pillars
1. **Digital Public Identity**: The portal represents the doctor's professional brand. Every public element—from visual themes to FAQs—is designed to maximize patient confidence and conversion.
2. **Zero-Code Doctor Dashboard Control**: 100% of public content, branding colors, imagery, services, working hours, and booking constraints are configurable directly from the **Doctor Dashboard**. No developer intervention is ever required.
3. **Real-Time Double-Booking Prevention**: Public booking slots dynamically calculate active shift schedules, vacations, blocked dates, appointment durations, and reception queue bookings to guarantee zero scheduling conflicts.
4. **Mobile-First Responsiveness**: Designed with priority focus on mobile browsers, featuring sticky bottom action bars, touch-optimized date pickers, and sub-second page loads.
5. **SEO & Structured Data Excellence**: Built-in OpenGraph cards, canonical URLs, dynamic XML sitemaps, and Schema.org JSON-LD (`Physician` and `MedicalBusiness`) for top search engine visibility.
6. **Zero Emojis & Strict PHI Isolation**: Visuals strictly use Lucide SVG iconography. Public endpoints are completely isolated from private clinical charts, medical records, or financial ledgers.

---

## 2. Public URL Taxonomy & Routing Strategy

Each doctor receives a dedicated, memorable public URL slug.

### 2.1 URL Patterns
- **Primary Domain Pattern**: `https://clinic.com/book/:doctorSlug`
- **Subdomain Pattern**: `https://booking.clinic.com/:doctorSlug`
- **Custom Doctor Subdomain Pattern**: `https://dr-ahmed.clinic.com`

### 2.2 Slug Management Invariants
1. **Slug Uniqueness**: Slugs are unique per tenant workspace and sanitized (alphanumeric and hyphens only, e.g., `dr-ahmed-al-mansoor`).
2. **Custom Slug Editing**: Doctors can customize their slug via Doctor Dashboard settings (e.g. changing `dr-ahmed-102` to `dr-ahmed`).
3. **Automatic Redirects**: Changing a slug preserves a 301 Permanent Redirect from the old slug for 90 days.
4. **Deactivated Profile Handling**: Suspended or archived doctor profiles immediately render a polite public profile unavailable page (`404 Not Found` or `410 Gone`) without exposing internal account status details.

---

## 3. Landing Page Component Architecture & Inventory

The landing page consists of 10 modular, configurable sections designed to guide the patient from discovery to booking confirmation.

```
+-------------------------------------------------------------------+
| 1. Hero Section (Cover Banner, Doctor Avatar, Clinic Logo, CTAs) |
+-------------------------------------------------------------------+
| 2. Doctor Identity Card (Degrees, Title, Fee, Working Hours Badge)|
+-------------------------------------------------------------------+
| 3. About Doctor (Rich Text Bio, Education, Experience, Awards)    |
+-------------------------------------------------------------------+
| 4. Medical Services Catalog (Consultations, Procedures, Fees)     |
+-------------------------------------------------------------------+
| 5. Clinic Gallery & Facilities (Photos, Reception, Equipment)     |
+-------------------------------------------------------------------+
| 6. Board Certifications & Licenses (Verification Badges)          |
+-------------------------------------------------------------------+
| 7. Patient Testimonials & Star Ratings (Curated Reviews)          |
+-------------------------------------------------------------------+
| 8. Frequently Asked Questions (FAQ Accordions)                   |
+-------------------------------------------------------------------+
| 9. Location & Contact Information (Address, Interactive Map)      |
+-------------------------------------------------------------------+
| 10. Interactive Slot Picker & Patient Booking Drawer              |
+-------------------------------------------------------------------+
```

### 3.1 Hero Section
- **Cover Banner Image**: High-resolution branding image (1920x600px).
- **Doctor Avatar**: Professional headshot with status indicator (`Available Today`).
- **Clinic Logo**: Displays parent clinic logo and name.
- **Action Buttons**:
  - *Primary CTA*: "Book Appointment" (Smooth-scrolls or opens Booking Drawer).
  - *Secondary CTAs*: "Call Clinic", "Get Directions" (Google Maps link).

### 3.2 Doctor Identity Card
- **Full Name & Honorific**: e.g., `Dr. Ahmed Al-Mansoor, MD`.
- **Primary Specialty & Sub-specialties**: e.g., `Cardiology | Interventional Electrophysiology`.
- **Years of Experience**: e.g., `15+ Years Experience`.
- **Languages Spoken**: e.g., `Arabic, English, French`.
- **Consultation Fee Display**: Configurable option to display fee (e.g., `350 EGP`) or `Contact for Fee`.
- **Working Days Badge**: e.g., `Sun, Tue, Thu (16:00 - 21:00)`.

### 3.3 About Doctor
- **Biography**: Rich text description of clinical philosophy, background, and patient care approach.
- **Education & Degrees**: Medical school, residency, fellowships.
- **Professional Memberships**: Fellowships in medical associations (e.g., `FACC`, `ESC Member`).
- **Awards & Publications**: Recognized achievements and research papers.

### 3.4 Medical Services Catalog
Doctors can create an unlimited list of offered clinical services.
Each service card contains:
- Service Title (e.g., `Initial Cardiac Consultation`, `Echocardiogram Exam`).
- Short Description.
- Estimated Duration (e.g., `30 mins`).
- Service Fee (Optional).
- Lucide SVG Category Icon.
- Direct "Book This Service" CTA.

### 3.5 Clinic Gallery & Facilities
- High-resolution carousel/grid of clinic facilities:
  - Reception & Waiting Lounge.
  - Examination Rooms.
  - Medical Equipment & Diagnostics.
- Captions and full-screen image lightbox modal.

### 3.6 Board Certifications & Licenses
- Displays verified medical licenses, board certifications, and ministry of health registrations.
- Enhances patient trust and compliance transparency.

### 3.7 Patient Testimonials & Star Ratings
- Overall rating summary (e.g., `4.9 / 5.0 Rating based on 120+ Patients`).
- Patient review cards with verified booking badges.
- Doctor controls review visibility and featured reviews from the dashboard.

### 3.8 Frequently Asked Questions (FAQ)
- Expandable accordion list of doctor-created FAQs:
  - *Working Hours & Parking Availability*.
  - *Follow-up Visit Policies*.
  - *Accepted Payment Methods*.
  - *Insurance Coverage Information*.

### 3.9 Location & Contact Information
- Clinic physical address and branch name.
- Google Maps interactive embed / direct navigation link.
- Direct clinic telephone contact.
- Detailed working hours table per day of the week.

### 3.10 Interactive Slot Picker & Booking Drawer
A multi-step, mobile-optimized booking workflow:
1. **Step 1: Select Service & Doctor Shift Day** (Interactive calendar date picker).
2. **Step 2: Select Available Time Slot** (Real-time available slots grid).
3. **Step 3: Enter Patient Information** (Name, Phone Number, Optional Email, Notes).
4. **Step 4: Instant Confirmation Screen** (Displays Booking Code `APT-YYYYMM-XXXXX`, Date, Time, Directions, and Add-to-Calendar link).

---

## 4. Branding & Customization System Engine

The branding engine allows full visual customization without writing a single line of CSS code.

### 4.1 Customization Tokens Matrix

| Customization Token | Description | Fallback Default |
| --- | --- | --- |
| `coverImageUrl` | Header Hero Banner Background Image | Default Medical Gradient Banner |
| `avatarUrl` | Doctor Professional Headshot | Default Gender Neutral Medical Avatar |
| `clinicLogoUrl` | Parent Clinic Official Logo | ClinicOS Default Logo |
| `primaryColor` | Primary Theme Color (Buttons, Headers, Badges) | `#0284C7` (Sky Blue) |
| `secondaryColor` | Secondary Accent & Highlight Color | `#0F172A` (Slate Dark) |
| `accentColor` | Callout Badges & Rating Star Color | `#F59E0B` (Amber) |
| `welcomeMessage` | Personal Greeting Headline | "Welcome to my medical practice" |
| `customCssOverrides` | Reserved for V2 CSS tweaking | Null |

### 4.2 Live Preview Engine
The Doctor Dashboard provides a side-by-side **Live Mobile & Desktop Preview Simulator** that updates instantly as color pickers or text fields are modified.

---

## 5. Real-Time Booking Rules Engine & Safeguards

The booking engine ensures that public slot availability aligns 100% with the doctor's operational schedule.

```
[Patient Selects Date & Time Slot]
               |
               v
[Check Doctor Active Shifts & Working Hours] ---> (Closed? -> Reject Slot)
               |
               v
[Check Vacations & Emergency Blocked Dates] ---> (On Leave? -> Reject Slot)
               |
               v
[Calculate Existing Bookings & Buffer Times] ---> (Full? -> Reject Slot)
               |
               v
[Atomic Concurrency Lock (X-Tenant-ID)]
               |
               v
[Create Appointment (Status: APPOINTMENT_SCHEDULED)]
               |
               v
[Dispatch SMS / Email / Notification & Audit Log]
```

### 5.1 Rules Engine Invariants
1. **Shift Schedule Alignment**: Slots are only generated within active shift bounds configured in `doctor_shifts`.
2. **Vacation & Blocked Date Suppression**: No slots are generated on official holidays, approved doctor leaves, or emergency blocked time ranges.
3. **Duration & Buffer Calculations**: Total slot interval = `serviceDuration` + `bufferTime` (e.g. 20 mins consultation + 5 mins sanitation buffer = 25 min slot steps).
4. **Max Daily Appointments Cap**: If max daily bookings limit is reached for a given date, the portal automatically displays `Fully Booked for Selected Date`.
5. **Real-Time Atomic Locking**: Prevents race conditions when multiple online users or clinic receptionists attempt to book the exact same slot simultaneously.

---

## 6. Doctor Dashboard Configuration Matrix

Doctors manage 100% of their public portal settings from their private dashboard.

| Configuration Domain | Configurable Options | Dashboard Location |
| --- | --- | --- |
| **Profile & Bio** | Name, Title, Specialty, Bio, Languages, Fees | `Dashboard -> Portal -> Profile` |
| **Branding Theme** | Cover Photo, Avatar, Primary/Secondary Colors | `Dashboard -> Portal -> Branding` |
| **Services Catalog** | Add/Edit/Delete Services, Prices, Durations | `Dashboard -> Portal -> Services` |
| **Clinic Gallery** | Upload Photos, Captions, Reorder Gallery | `Dashboard -> Portal -> Gallery` |
| **Certifications** | Upload Licenses, Board Degrees, Badges | `Dashboard -> Portal -> Credentials` |
| **Patient Reviews** | Toggle Ratings Visibility, Feature Reviews | `Dashboard -> Portal -> Testimonials` |
| **FAQ Builder** | Add/Edit/Delete FAQs & Ordering | `Dashboard -> Portal -> FAQ` |
| **Booking Constraints** | Slot Interval, Buffers, Max Daily Limit | `Dashboard -> Schedule -> Constraints` |
| **Custom URL Slug** | Edit Public URL Slug (`dr-ahmed`) | `Dashboard -> Portal -> Settings` |
| **SEO Settings** | Custom Meta Title, Description, OG Image | `Dashboard -> Portal -> SEO` |

---

## 7. SEO, Metadata & Schema.org Specification

The portal includes automated SEO optimization to rank highly in search engine results for local medical queries (e.g., "Best Cardiologist in Cairo").

### 7.1 Dynamic Metadata Generation
- **Meta Title Pattern**: `Dr. {Doctor Name} — {Specialty} in {Clinic Location} | Book Online`
- **Meta Description Pattern**: `Book an appointment online with Dr. {Doctor Name}, {Specialty} specialist at {Clinic Name}. View consultation fees, reviews, and working hours.`

### 7.2 OpenGraph & Social Sharing Cards
- `og:type`: `profile` / `business.business`
- `og:title`: Doctor Name and Title.
- `og:description`: Bio snippet and specialty.
- `og:image`: High-res doctor avatar or custom branding banner.

### 7.3 Schema.org JSON-LD Structured Data
Automatically injected into page `<head>`:

```json
{
  "@context": "https://schema.org",
  "@type": ["Physician", "MedicalBusiness"],
  "name": "Dr. Ahmed Al-Mansoor",
  "image": "https://clinic.com/uploads/dr-ahmed-avatar.jpg",
  "telePhone": "+201000000000",
  "medicalSpecialty": "Cardiovascular",
  "priceRange": "$$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Medical Tower, Building B",
    "addressLocality": "Cairo",
    "addressCountry": "EG"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Sunday", "Tuesday", "Thursday"],
      "opens": "16:00",
      "closes": "21:00"
    }
  ]
}
```

---

## 8. Analytics & Conversion Performance Metrics

Doctors can view private conversion analytics inside their dashboard.

### 8.1 Key Tracked Metrics
- **Total Portal Page Views**: Monthly and daily traffic counts.
- **Unique Visitors**: Unique patient IP/device visits.
- **Booking Conversion Rate**: `(Completed Bookings / Total Unique Visitors) * 100`.
- **Top Booked Services**: Ranking of most popular service offerings.
- **Peak Booking Days & Hours**: Analytics showing when patients prefer to book.

---

## 9. Security, Anti-Spam & Public Data Protection

Operating on the public internet requires security safeguards.

### 9.1 Anti-Spam & Bot Mitigation
1. **IP Rate Limiting**: Max 5 booking attempts per IP address per hour.
2. **Honeypot Captcha**: Invisible honeypot inputs to trap automated spam bots without burdening real patients.
3. **Mobile Phone Format Validation**: Enforces international E.164 phone number formatting and regional regex checks.
4. **Duplicate Booking Throttling**: Prevents identical phone numbers from booking multiple slots on the same day.

### 9.2 Public Data Privacy Barrier
- Public endpoints return **only** public doctor profiles, service catalogs, and open time slots.
- **Zero Access to Private PHI**: Public users can never inspect existing patient names, medical histories, medical notes, or internal clinic financial ledgers.

---

## 10. WCAG 2.1 AA Accessibility & Responsive Strategy

### 10.1 Mobile-First Responsiveness
- Optimized for mobile viewports (320px to 480px) up to 4K desktop displays.
- Touch-friendly click targets (minimum 44x44px).
- Sticky bottom mobile booking bar for instant access.

### 10.2 Accessibility Standards (WCAG 2.1 AA)
- High contrast text ratios (>= 4.5:1).
- Full keyboard focus navigation (`Tab`, `Enter`, `Space`, `Esc`).
- ARIA labels and live regions for dynamic slot updates.
- Zero reliance on color alone for status indicators.

---

## 11. Core Module Integration Architecture

The Online Booking Portal connects seamlessly with existing ClinicOS backend modules:

1. **Appointment Management Module (Module-006)**: Public bookings directly insert records with status `APPOINTMENT_SCHEDULED` and channel `ONLINE_PORTAL`.
2. **Patient Management Module (Module-005)**: Automatically matches existing patient profiles by phone number or creates a candidate patient record.
3. **Notifications Management Module (Module-011)**: Triggers instant SMS/Email/WhatsApp confirmation dispatches to both patient and clinic reception.
4. **Audit Logs Module (Module-013)**: Automatically logs `PUBLIC_BOOKING_CREATED` events with client IP and user agent.

---

## 12. Reserved V2 Roadmap (Future Extensions)

*Note: For documentation only. Do NOT implement in Version 1.*

1. **Online Payment Gateway Integration**: Deposit and full consultation fee prepayments (Paymob, Stripe, Fawry, Tap).
2. **Direct WhatsApp Booking Bot**: Automated two-way appointment booking via WhatsApp Business API.
3. **SMS OTP Mobile Verification**: Mandatory 4-digit SMS verification code before final slot confirmation.
4. **Telehealth & Video Consultation**: Embedded WebRTC video call links for remote online visits.
5. **AI Chat Assistant**: Conversational AI agent answering patient FAQs and guiding slot selection.

---

## 13. Summary Matrix & Validation Checklist

| Feature Domain | V1 Scope | Configurable in Dashboard? |
| --- | --- | --- |
| **Public Landing Page** | Hero, Bio, Services, Gallery, FAQ, Map | `YES (100%)` |
| **Custom URL Slug** | `clinic.com/book/dr-ahmed` | `YES` |
| **Color Branding Token System** | Primary, Secondary, Accent Colors | `YES` |
| **Real-Time Slot Engine** | Shift Hours, Buffers, Vacations, Double Booking Guard | `YES` |
| **SEO & Schema.org** | JSON-LD, OpenGraph, Dynamic Meta Titles | `YES` |
| **Analytics Dashboard** | Page Views, Conversion Rate %, Top Services | `YES (Private)` |
| **Security & Anti-Spam** | Rate Limit, Phone Regex, Honeypot, Zero PHI Leak | `YES (Enforced)` |
