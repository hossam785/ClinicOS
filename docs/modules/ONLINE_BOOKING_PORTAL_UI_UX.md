# Online Booking Portal UI/UX Design Specification — ClinicOS

## 1. Design System Alignment & Aesthetic Strategy

The **Online Booking Portal (Module-015)** interface is designed as a high-conversion, trust-building digital homepage for doctors and clinics. It strictly enforces the **ClinicOS Design System** guidelines: high legibility, clean visual hierarchy, WCAG 2.1 AA accessibility compliance, mobile-first touch ergonomics, and zero decorative clutter.

### 1.1 Color Palette & Theme Customization Tokens
The portal uses dynamic HSL CSS tokens that adapt to doctor-configured branding colors while preserving contrast ratios:

- **Primary Action Accent**: Dynamic Doctor Token (Default `#047857` Emerald / `#0284C7` Sky Blue)
- **Secondary Accent**: Dynamic Doctor Token (Default `#0F172A` Slate Dark)
- **Highlight / Callout Accent**: Dynamic Doctor Token (Default `#F59E0B` Amber)
- **Background Layer**: `#FFFFFF` (Card White) / `#F8FAFC` (Slate-50 Surface)
- **Text Color Tokens**:
  - Primary Headlines: `#0F172A` (Slate-900)
  - Muted Subtext: `#64748B` (Slate-500)
  - Borders: `#E2E8F0` (Slate-200)

### 1.2 Zero Emojis Policy
Iconography strictly utilizes **Lucide React SVG** components:
- `Stethoscope`, `UserCheck`, `Calendar`, `Clock`, `MapPin`, `Phone`, `Award`, `GraduationCap`, `Star`, `ShieldCheck`, `CheckCircle2`, `AlertCircle`, `X`, `ChevronRight`, `Image`, `FileText`, `HelpCircle`, `Sparkles`, `ExternalLink`, `Share2`.

---

## 2. Screen Architecture & Wireframe Specifications

### 2.1 Landing Page Architecture (11 Sections)

```
+---------------------------------------------------------------------------------------------------------+
| [Clinic Logo] CardioCare Center                      [Phone: +201000000] [Book Appointment CTA]         |
+---------------------------------------------------------------------------------------------------------+
| HERO COVER BANNER                                                                                       |
| +-----------------------------------------------------------------------------------------------------+ |
| | [Doctor Headshot Avatar]                                                                            | |
| | Dr. Ahmed Al-Mansoor, MD                                                                            | |
| | Consultant Cardiologist | Interventional Electrophysiology                                         | |
| | [Star 4.9 (120+ Reviews)]  [15+ Years Experience]  [350 EGP Fee]                                     | |
| |                                                                                                     | |
| | [Book Appointment (Primary)]  [Call Clinic]  [Get Directions]                                       | |
| +-----------------------------------------------------------------------------------------------------+ |
+---------------------------------------------------------------------------------------------------------+
| ABOUT THE DOCTOR                                                                                        |
| Dr. Ahmed Al-Mansoor is a Consultant Cardiologist with 15+ years of clinical experience...             |
| [Degrees: MD Cairo Univ, FESC]  [Languages: Arabic, English, French]                                  |
+---------------------------------------------------------------------------------------------------------+
| MEDICAL SERVICES CATALOG                                                                                |
| +------------------------------------+ +------------------------------------+ +---------------------+ |
| | [Icon] Initial Consultation        | | [Icon] Echocardiogram Exam         | | [Icon] Holter ECG | |
| | 30 Mins | 350 EGP                  | | 45 Mins | 600 EGP                  | | 24 Hours | 800 EGP| |
| | [Book This Service]                | | [Book This Service]                | | [Book This]       | |
| +------------------------------------+ +------------------------------------+ +---------------------+ |
+---------------------------------------------------------------------------------------------------------+
| WORKING HOURS & SCHEDULE                                                                                |
| Sun: 16:00 - 21:00 (Today) | Tue: 16:00 - 21:00 | Thu: 16:00 - 21:00 | Mon/Wed/Fri/Sat: Closed       |
+---------------------------------------------------------------------------------------------------------+
| CLINIC GALLERY & CREDENTIALS                                                                            |
| [Photo: Reception Lounge]  [Photo: Examination Room]  [Certificate: Board Certification Badge]          |
+---------------------------------------------------------------------------------------------------------+
| PATIENT REVIEWS & TESTIMONIALS                                                                          |
| Rating Summary: 4.9 / 5.0 (Based on 120 Verified Reviews)                                               |
| "Exceptional care and very thorough examination..." - Khaled M. (Verified Patient)                      |
+---------------------------------------------------------------------------------------------------------+
| FREQUENTLY ASKED QUESTIONS (FAQ)                                                                        |
| [>] What should I bring to my first cardiac visit?                                                       |
| [>] What is the follow-up visit policy?                                                                 |
+---------------------------------------------------------------------------------------------------------+
| LOCATION & CONTACT                                                                                      |
| Address: 123 Medical Tower, Building B, Cairo | Phone: +201000000000                                    |
| [Interactive Google Maps Container]                                                                     |
+---------------------------------------------------------------------------------------------------------+
| FOOTER: (c) 2026 CardioCare Center. Powered by ClinicOS.                                                |
+---------------------------------------------------------------------------------------------------------+
```

---

### 2.2 Interactive 4-Step Booking Widget / Drawer Wireframe

Tapping "Book Appointment" triggers an accessible, mobile-optimized slide-up bottom drawer (or modal on desktop).

```
+---------------------------------------------------------------------------------------------------------+
| BOOK APPOINTMENT — Dr. Ahmed Al-Mansoor                                                             [X] |
+---------------------------------------------------------------------------------------------------------+
| STEP 1: SELECT SERVICE                                                                                  |
| (x) Initial Cardiology Consultation (30 mins - 350 EGP)                                                 |
| ( ) Follow-up Visit (20 mins - 200 EGP)                                                                 |
| ( ) Echocardiogram Exam (45 mins - 600 EGP)                                                             |
+---------------------------------------------------------------------------------------------------------+
| STEP 2: SELECT DATE                                                                                     |
| [<] AUGUST 2026 [>]                                                                                     |
| SUN 2 | MON 3 | TUE 4 | WED 5 | THU 6 | FRI 7 | SAT 8                                                   |
| [16:00]| (Off) | [16:00]| (Off) | [16:00]| (Off) | (Off)                                                  |
+---------------------------------------------------------------------------------------------------------+
| STEP 3: SELECT TIME SLOT (Wednesday, Aug 5)                                                             |
| [ 16:00 ]   [ 16:30 ]   [ 17:00 (Booked) ]   [*17:30*]   [ 18:00 ]   [ 18:30 ]                          |
+---------------------------------------------------------------------------------------------------------+
| STEP 4: PATIENT DETAILS                                                                                 |
| Full Name: [ Khaled Mahmoud                                                             ]               |
| Mobile Phone: [ +20 1012345678                                                           ]              |
| Email (Optional): [ khaled@example.com                                                  ]               |
| Notes (Optional): [ Experiencing mild chest tightness                                   ]               |
+---------------------------------------------------------------------------------------------------------+
| [ CONFIRM BOOKING (350 EGP) ]                                                                           |
+---------------------------------------------------------------------------------------------------------+
```

---

### 2.3 Instant Booking Confirmation Screen Wireframe

```
+---------------------------------------------------------------------------------------------------------+
| BOOKING CONFIRMED!                                                                                      |
| [CheckCircle2 Icon] Your appointment has been scheduled successfully.                                    |
+---------------------------------------------------------------------------------------------------------+
| BOOKING REFERENCE: APT-202608-00421                                                                     |
| Doctor: Dr. Ahmed Al-Mansoor                                                                            |
| Service: Initial Cardiology Consultation                                                                |
| Date & Time: Wednesday, August 5, 2026 at 17:30 (30 Mins)                                               |
| Consultation Fee: 350 EGP (Pay at Clinic Reception)                                                     |
| Location: 123 Medical Tower, Building B, Cairo, Egypt                                                   |
+---------------------------------------------------------------------------------------------------------+
| An SMS confirmation has been sent to +20 1012345678.                                                    |
|                                                                                                         |
| [Add to Google Calendar]  [Get Directions]  [Back to Doctor Page]                                       |
+---------------------------------------------------------------------------------------------------------+
```

---

### 2.4 Doctor Dashboard Portal Settings & Live Simulator (`/dashboard/booking/settings`)

```
+---------------------------------------------------------------------------------------------------------+
| Booking Portal Customization                                                          [Publish Changes] |
| Control your public branding, services, FAQs, and booking constraints.                                  |
+------------------------------------------------------------------+--------------------------------------+
| PORTAL CONFIGURATION PANELS                                      | LIVE MOBILE PREVIEW SIMULATOR        |
| [Profile] [Branding] [Services] [Gallery] [FAQ] [SEO]            | +----------------------------------+ |
|                                                                  | | [Doctor Header & Cover]          | |
| Primary Theme Color:                                             | | Dr. Ahmed Al-Mansoor             | |
| [*#047857 Emerald*] [#0284C7 Sky] [#6D28D9 Purple] [Custom Hex]  | | Consultant Cardiologist          | |
|                                                                  | |                                  | |
| Upload Cover Image: [Choose File: cover.jpg]                     | | [Service Card: 350 EGP]          | |
| Upload Avatar Image: [Choose File: avatar.jpg]                   | | [Working Hours Badge]            | |
|                                                                  | |                                  | |
| Custom URL Slug:                                                 | | [Sticky Mobile Book Button]      | |
| https://clinic.com/book/ [ dr-ahmed-al-mansoor                 ] | +----------------------------------+ |
+------------------------------------------------------------------+--------------------------------------+
```

---

## 3. Component Library Inventory

The portal utilizes 10 standardized, accessible UI components:

1. **`HeroBanner`**: Displays high-res cover, avatar headshot, doctor titles, quick info badges, and CTAs.
2. **`DoctorIdentityCard`**: Summarizes credentials, specialty badges, years of experience, and languages.
3. **`ServiceCard`**: Displays service title, duration, consultation fee, Lucide icon, and direct book button.
4. **`ScheduleGrid`**: Interactive weekly calendar showing open shift hours and disabling closed days.
5. **`BookingDrawer`**: Multi-step slide-up drawer for service, date, time slot, and patient info collection.
6. **`GalleryGrid`**: Responsive photo grid with lightbox zoom and category filtering.
7. **`CertificateCard`**: Verified board degree & license card with verification checkmark.
8. **`ReviewCard`**: Patient review text, star rating summary, verified patient badge, and visit date.
9. **`FAQAccordion`**: Expandable question/answer accordions with search input.
10. **`ContactCard`**: Phone dialer trigger, full address, and embedded Google Maps view.

---

## 4. Mobile-First Ergonomics & Sticky Bottom Action Bar

- **Sticky Bottom Mobile Bar**: Fixed at the bottom of mobile viewports (320px–480px):
  - Left: Service Fee & Doctor Status (`350 EGP | Available Today`).
  - Right: Full-width primary CTA button (`Book Appointment`).
- **Touch Target Enforcements**: All buttons, calendar date tiles, and input fields enforce a minimum height of **44px**.

---

## 5. Micro-Animations & Motion Design

- **Drawer Slide-Up**: Smooth Framer Motion spring transition (`y: 100% -> y: 0%`, 300ms cubic-bezier).
- **Slot Selection**: Scale transform (`scale(1.03)`) with primary border highlight upon slot tap.
- **Card Hover Effects**: Subtle 2px vertical lift (`translateY(-2px)`) with shadow glow on desktop hover.
- **Skeleton Pulse**: Animated loading gradient pulse (`animate-pulse`) for image and slot loading states.

---

## 6. Comprehensive State Catalog

### 6.1 Loading Skeleton State
- Displays pulshead-shaped skeletons for avatar, doctor title, service cards, and slot grid while fetching public JSON payloads.

### 6.2 Empty States
- **No Services Configured**: "This doctor has not listed individual services yet. Tap 'Book Appointment' for general consultation."
- **No Reviews Yet**: "Be the first patient to leave a review after your visit."

### 6.3 Error States
- **Slot Unavailable (`409 Conflict`)**: Alert banner in drawer: "This time slot was just reserved by another patient. Please select an alternative slot."
- **Doctor Suspended / Unavailable (`404 / 410`)**: Polite page: "Doctor Profile Currently Unavailable."

---

## 7. WCAG 2.1 AA Accessibility Standards

1. **Color Contrast**: All text tokens maintain >= 4.5:1 contrast against background colors.
2. **Keyboard Navigation**: Full support for `Tab`, `Shift+Tab`, `Space`, `Enter`, and `Esc` (closes modals/drawers).
3. **Screen Reader Live Regions**: Slot grid updates announce available slot count using `aria-live="polite"`.
4. **Form Labels**: Every input field includes explicit, visible `<label>` tags with matching `htmlFor` attributes.

---

## 8. Reserved V2 UI Extension Slots

*Note: For documentation only. Do NOT implement in Version 1.*

1. **Online Payment Checkout Modal**: Integrated Stripe / Paymob deposit payment modal frame.
2. **WhatsApp Confirmation Banner**: One-click "Confirm Booking on WhatsApp" button on confirmation screen.
3. **SMS OTP Modal**: 4-digit OTP input step inserted prior to final booking submission.
4. **Telehealth Video Join Card**: Embedded WebRTC "Join Video Consultation" card.
