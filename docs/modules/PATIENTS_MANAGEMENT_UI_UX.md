# Patients Management Module UI/UX Design Specification (PATIENTS_MANAGEMENT_UI_UX.md)

This document establishes the user interface design, visual hierarchy, interaction patterns, accessibility standards, and responsive specifications for the **Patients Management Module** (Module-005) of ClinicOS. It aligns with `DESIGN_DNA.md` and serves as the visual contract for frontend React component development.

---

## 1. Module Overview

The Patients Management interface enables clinic receptionists, doctors, and clinic owners to manage the Master Patient Index (MPI). It prioritizes fast demographic retrieval, clear visual identification of medical alerts (allergies, chronic conditions), and intuitive patient registration.

---

## 2. Screen Inventory

1. **Patients Directory (`/dashboard/patients`)**: Paginated master roster table featuring multi-parameter search, status dropdown filters, and quick action buttons.
2. **Create Patient Form (`/dashboard/patients/new`)**: Multi-section form for registering new patients with pre-registration duplicate detection.
3. **Patient Profile Details (`/dashboard/patients/:id`)**: Comprehensive view of patient demographics, emergency contacts, medical flags, and reserved tabs for clinical encounters.
4. **Edit Patient Profile (`/dashboard/patients/:id/edit`)**: Pre-populated form for updating contact details, address, and medical flags.
5. **Archive Confirmation Modal**: Confirmation dialog warning about soft-delete behavior and compliance rules.
6. **Restore Confirmation Modal**: Dialog confirming restoration of an archived patient profile to `ACTIVE` status.
7. **Empty State View**: Standardized view displayed when search queries return zero matching patient records.
8. **Permission Denied View**: Renders when a user attempts unauthorized patient actions.
9. **Not Found View (`404`)**: Displayed when querying a non-existent patient ID under the tenant context.

---

## 3. Screen Layout Specifications

### 1. Patients Directory Layout
- **Page Header**: Title ("Patients Master Index"), breadcrumbs (`Dashboard > Patients Directory`), and primary action button (`UserPlus` icon: "Register New Patient").
- **Search & Filter Toolbar**: Search input field (`Search` icon) alongside Status (`ACTIVE`, `INACTIVE`, `ARCHIVED`) and Gender dropdown filters.
- **Roster Table**: 8-column data table displaying Patient Name, Patient Code (`PAT-YYYYMM-XXXXX`), Phone, DOB, Gender, Medical Flags, Status Badge, and Action Buttons.
- **Footer Pagination**: Pagination control displaying `Showing 1–20 of 142 Patients` with Previous/Next controls.

### 2. Patient Profile Details Layout
- **Page Header**: Patient Name, Patient Code, Status Badge, and action buttons (`Edit Profile`, `Archive Patient`).
- **Allergy Warning Banner**: Prominent crimson banner rendered at top if `allergiesFlag` is `true`:
  - Icon: `AlertTriangle`
  - Text: "PATIENT ALLERGY ALERT: Known drug or food allergies declared. Review clinical records prior to administering medication."
- **Grid View (2-Column Desktop)**:
  - *Left Column*: Demographics, Contact Information, Address, and Emergency Contact cards.
  - *Right Column*: Medical Flags Summary, Insurance Indicators, Administrative Notes, and Clinical Timeline Reserved Tabs.

---

## 4. Visual Components & Status Badges

### Status Badge Mapping (Lucide React SVG Icons Only - Zero Emojis)
- `ACTIVE`: Emerald green badge with `CheckCircle2` icon. Text: "Active".
- `INACTIVE`: Slate gray badge with `Clock` icon. Text: "Inactive".
- `ARCHIVED`: Amber badge with `Archive` icon. Text: "Archived".
- `DECEASED`: Dark slate badge with `UserX` icon. Text: "Deceased".

### Medical Flag Indicators
- `Allergies Flag`: Crimson pill badge with `ShieldAlert` icon ("Allergies Declared").
- `Chronic Disease Flag`: Purple pill badge with `Activity` icon ("Chronic Condition").
- `Insurance Flag`: Blue pill badge with `CreditCard` icon ("Insured").

---

## 5. Form Design & Validation Triggers

- **Personal Information**: Full Name (Required), Gender Select (Required), DOB Datepicker (Required), National ID / Passport (Optional).
- **Contact Information**: Primary Phone (Required, E.164 pattern), Primary Email (Optional), Address Fields.
- **Emergency Contact**: Name, Relationship, Phone.
- **Medical Flags Checkboxes**: Toggle switches for Allergies, Chronic Diseases, and Insurance Coverage.
- **Validation Error Behavior**: Field borders turn crimson (`var(--color-danger)`), with inline message below field. Form submission disabled while invalid.

---

## 6. Accessibility & WCAG 2.1 AA Standards

- **Keyboard Focus**: Logical `Tab` navigation order across all inputs, filters, and table actions with high-contrast outline (`2px solid var(--color-primary)`).
- **Touch Target Bounds**: Minimum interactive button size of 44x44px.
- **Screen Reader Support**: All visual iconography paired with descriptive `aria-label` or `sr-only` text spans.
- **Color Contrast**: Text and badge contrast ratios meet 4.5:1 minimum compliance against surface backgrounds.

---

## 7. Responsive Layout Specifications

- **Desktop (>= 1024px)**: 2-column grid layout for patient details; 8-column data table for directory.
- **Tablet (768px - 1023px)**: Data table converts to horizontal scroll container; details grid collapses to stacked 1-column layout.
- **Mobile (< 768px)**: Toolbar items stack vertically; patient data table transforms into responsive card lists.

---

## 8. Reserved UI Extension Points (Future Modules)

- **Encounters & EMR Tab**: Reserved tab container on Patient Details view for viewing future clinical notes and prescriptions.
- **Appointments History Tab**: Reserved tab container for slot reservation history.
- **Billing & Invoices Tab**: Reserved tab container for payment receipts and insurance claims.
