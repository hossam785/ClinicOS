# Medical Records Management Module UI/UX Specification (MEDICAL_RECORDS_MANAGEMENT_UI_UX.md)

This document establishes the UI/UX specification, screen inventory, layout wireframe structures, visual status badge systems, SOAP encounter form designs, and accessibility standards for the **Medical Records Management Module** (Module-007) of ClinicOS. It serves as the immutable visual contract for frontend implementation.

---

## 1. Module Overview

### User Experience Purpose
The Medical Records UI provides an intuitive, high-efficiency Electronic Medical Record (EMR) interface for attending physicians, nurses, and clinical managers. It minimizes documentation overhead, supports rapid SOAP note entry, provides real-time vital signs visualization, displays chronological patient clinical timelines, and enforces immutable chart locking policies.

---

## 2. Screen Inventory

1. **Medical Records Directory View (`/dashboard/medical-records`)**: Master EMR chart roster with search bar, doctor filter, date range picker, and status dropdown.
2. **Medical Record Details View (`/dashboard/medical-records/:id`)**: Comprehensive view of a single EMR chart, displaying patient summary, SOAP notes, vital signs, primary diagnosis, and post-lock addenda.
3. **Create Medical Record View (`/dashboard/medical-records/new`)**: Form layout for initializing a new draft EMR chart for a checked-in patient.
4. **Edit Medical Record View (`/dashboard/medical-records/:id/edit`)**: SOAP note editor for draft and in-progress charts.
5. **Patient History Timeline View (`/dashboard/medical-records/patient/:patientId/history`)**: Chronological timeline displaying past consultations and diagnostic history.
6. **Consultation Console View (`/dashboard/medical-records/:id/consultation`)**: Active clinical encounter view combining real-time vital signs entry, SOAP documentation, and chart locking controls.
7. **Locked Record & Addendum View (`/dashboard/medical-records/:id/lock`)**: Read-only display of locked charts with addendum submission form.

---

## 3. Layout Specifications

### 12-Column Responsive Grid Architecture
- **Desktop (1200px+)**: 2-column split view (Left 4 cols: Patient summary card & vital signs panel; Right 8 cols: SOAP notes form & clinical tabs).
- **Tablet (768px - 1024px)**: Single column stacked layout with expandable collapsible sections.
- **Mobile (<768px)**: Optimized card stack with fixed bottom primary action buttons.

---

## 4. Visual System & Iconography Mapping (Lucide React)

All visual indicators use clean SVG icons from `lucide-react`. Zero text emojis.

- `FileText`: EMR medical records and clinical charts.
- `Stethoscope`: Clinical consultations and attending doctor identity.
- `Activity`: Vital signs (BP, Pulse, SpO2, Temp).
- `User`: Patient summary profile.
- `Calendar`: Visit date and encounter timeline.
- `Clock`: Time slot and autosave indicators.
- `Lock`: Locked medical chart status badge.
- `Plus`: New EMR chart creation.
- `Edit3`: Edit SOAP notes action.
- `CheckCircle2`: Sign and lock consultation action.

---

## 5. EMR SOAP Notes Form Design

### SOAP Form Sections
1. **Subjective Section**: Chief complaint textarea, History of Present Illness (HPI), allergies, current medications.
2. **Objective Section**: Vital signs grid inputs (Systolic/Diastolic BP, Pulse, Temperature, SpO2, Height, Weight, calculated BMI), physical examination notes.
3. **Assessment Section**: Primary diagnosis input, secondary diagnoses list, ICD placeholder tags, clinical evaluation notes.
4. **Plan Section**: Treatment plan textarea, medication orders, follow-up instructions, return visit timeframe selector.

---

## 6. Chart Locking & User Feedback Banners

- **Draft Indicator**: Neutral badge (`DRAFT`).
- **In Progress Indicator**: Primary badge (`IN_PROGRESS`).
- **Locked Chart Banner**: Warning alert (`LOCKED`) stating "This medical chart has been signed and locked. Further updates must be submitted as an Addendum."
- **Validation Errors**: High-visibility danger alert listing missing mandatory fields (e.g. Primary Diagnosis required before locking).

---

## 7. Accessibility (WCAG 2.1 AA Compliance)

- **Keyboard Navigation**: Full Tab/Shift+Tab focus traversal across all form inputs and action buttons.
- **Focus Indicators**: High-contrast 2px solid primary color focus rings (`var(--color-primary)`).
- **Touch Targets**: Minimum 44x44px clickable bounds for buttons and form controls.
- **Screen Readers**: Descriptive `aria-label` tags for all interactive icons and status badges.
