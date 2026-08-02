# Appointment Management Module UI/UX Design Specification (APPOINTMENT_MANAGEMENT_UI_UX.md)

This document establishes the official user experience and visual design specification for the **Appointment Management Module** (Module-006) of ClinicOS. It serves as the interaction contract for frontend implementation, ensuring strict compliance with `DESIGN_DNA.md`, accessibility standards (WCAG 2.1 AA), responsive layouts, and zero emoji usage.

---

## 1. Module Overview

### Purpose & User Goals
The Appointment Management user interface provides clinic receptionists, doctors, and clinic managers with a real-time scheduling dashboard. Primary user goals include:
- Rapid patient appointment booking and doctor slot availability verification.
- Conflict-free daily queue management and waiting room status updates (`CHECKED_IN`, `IN_CONSULTATION`, `COMPLETED`).
- Fast lookup by Appointment Number (`APT-YYYYMM-XXXXX`), Patient Name, or Attending Doctor.

---

## 2. Screen Inventory

1. **Appointments Dashboard / Master Directory**: Combined calendar timeline, daily queue roster, and search catalog.
2. **Daily Schedule & Waiting Room View**: Real-time queue tracker showing checked-in patients waiting for consultation.
3. **Register New Appointment View**: Form layout for selecting patient, doctor, date, slot time, visit type, and chief complaint.
4. **Appointment Details View**: Full reservation breakdown with patient summary, doctor summary, timing metadata, and status badges.
5. **Edit Appointment View**: Form layout for updating visit priority, chief complaint, and administrative notes.
6. **Reschedule Modal / View**: Date and time selector to shift an existing reservation to a new conflict-free slot.
7. **Cancel Confirmation Modal**: Dialog requiring a non-empty cancellation reason before setting status to `CANCELLED`.
8. **Check-In Modal**: Quick reception dialog updating patient status to `CHECKED_IN` and logging arrival timestamp.

---

## 3. Layout & Visual Specifications

### 1. Master Page Structure
- **Header & Breadcrumbs**: Displays page title (e.g., "Daily Appointments Roster"), subtitle, breadcrumb links, and primary action buttons ("Book New Appointment", "Export Daily Roster").
- **Toolbar Filter Bar**: Search input with `Search` icon, Status Dropdown (`All Statuses`, `Scheduled`, `Checked In`, `In Consultation`, `Completed`, `Cancelled`), Doctor Filter Dropdown, and Date Range Picker.
- **Main Content Container**: Wrapped inside Design System `PatientCard` container with subtle border radius and shadow tokens.

---

## 4. Status Badge Visualizations & SVG Icons

All visual indicators use Lucide React SVG icons. Emojis are strictly prohibited.

| Status | SVG Icon | Badge Style | Visual Description |
| :--- | :--- | :--- | :--- |
| **SCHEDULED** | `<Calendar size={14} />` | `Badge` (Secondary) | Neutral grey/blue pill indicating future booking. |
| **CONFIRMED** | `<CheckCircle2 size={14} />` | `Badge` (Primary) | Ocean blue pill indicating attendance confirmed. |
| **CHECKED_IN** | `<UserCheck size={14} />` | `Badge` (Warning) | Warm amber pill indicating patient arrived in waiting room. |
| **IN_CONSULTATION** | `<Activity size={14} />` | `Badge` (Primary) | Deep blue pill indicating doctor consultation in progress. |
| **COMPLETED** | `<CheckCircle2 size={14} />` | `Badge` (Success) | Emerald green pill indicating visit finished. |
| **CANCELLED** | `<XCircle size={14} />` | `Badge` (Danger) | Muted crimson pill indicating reservation cancelled. |
| **NO_SHOW** | `<AlertCircle size={14} />` | `Badge` (Danger) | Dark crimson pill indicating unexcused absence. |
| **RESCHEDULED** | `<RotateCcw size={14} />` | `Badge` (Secondary) | Purple pill indicating slot shifted to new date/time. |

---

## 5. Form & Scheduling UX Specification

### 1. Appointment Registration Form (`CreateAppointmentView`)
- **Patient Picker Component**: Searchable autocomplete input allowing receptionist to find patient by name or phone, or click "Quick Register New Patient".
- **Doctor & Shift Availability Picker**: Selecting a doctor dynamically loads their active shift hours for the selected date and renders available 15/30/45/60-minute time slots.
- **Conflict Warning Banner**: If a selected time slot overlaps with an existing booking, an inline `Alert` banner displays: `"Conflict Detected: Dr. Smith is already booked from 10:00 AM to 10:30 AM."` Action buttons are disabled until a conflict-free slot is selected.

---

## 6. Responsive Behavior

- **Desktop (>=1024px)**: Full 12-column grid displaying filter toolbar, timeline grid, and master data table side-by-side.
- **Tablet (768px - 1023px)**: Filter controls wrap into two rows; table scrolls horizontally with fixed action column.
- **Mobile (<768px)**: 1-column layout; table transforms into stacked appointment cards with touch-friendly action buttons (min 44x44px target bounds).

---

## 7. Accessibility & WCAG 2.1 AA Compliance

- **Keyboard Navigation**: Complete `Tab` and `Shift+Tab` sequence across forms, search filters, and table row actions.
- **Focus Indicators**: High-contrast 2px primary focus ring around focused input fields and buttons.
- **Screen Reader Support**: Tables include `aria-label="Appointments Queue"`; status badges carry explicit `aria-label` text describing status.

---

## 8. Reserved Integration Extension Placeholders

- **Clinical EMR Tab**: Reserved tab area on Appointment Details screen titled "Clinical Encounters (EMR)". Renders a placeholder notice for future EMR Module integration.
- **Billing & Receipts Tab**: Reserved tab area titled "Billing & Claims". Renders a placeholder notice for future Billing Module integration.
