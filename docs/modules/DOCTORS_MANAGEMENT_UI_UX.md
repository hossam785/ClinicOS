# Doctors Management Module UI/UX Design Specification (DOCTORS_MANAGEMENT_UI_UX.md)

This document establishes the user interface design, screen inventory, component mappings, responsive behaviors, accessibility standards, and interaction states for the **Doctors Management Module** (Module-004) of ClinicOS. It serves as the official UI/UX blueprint prior to frontend implementation.

---

## 1. UX Goals

### User Goals
- Provide Clinic Owners and Managers with a clean, high-density directory to manage doctor profiles, medical license statuses, consultation fee structures, and individual shift rosters.
- Provide Doctors with a distraction-free self-service dashboard to manage professional biographies, specialty summaries, and personal leave requests.

### Business Goals
- Accelerate practitioner onboarding by streamlining license verification workflows.
- Prevent booking errors by visually surfacing doctor shift patterns and calendar leave closures.

### Core Design Principles
- **Clinical Calm**: Slate neutral surfaces with primary clinic blue accents (`#1066cc`) to minimize visual fatigue.
- **Form Resilience**: Blur-triggered validation with explicit inline helper text.
- **Visual Status Transparency**: Immediate identification of practitioner status tags using Design System badges and Lucide React SVG icons.
- **Absolute Accessibility**: Full WCAG 2.1 AA compliance across all views and interactive controls.

---

## 2. Screen Inventory

### Workspace Practitioner Directory (`/dashboard/doctors/*`)
1. **Doctors Directory (`/dashboard/doctors`)**: Master table/grid view listing all workspace doctors with search, specialty dropdown filters, and status tags.
2. **Invite Doctor Modal (`/dashboard/doctors/invite`)**: Onboarding modal form to invite a new practitioner.
3. **Doctor Profile Overview (`/dashboard/doctors/:id`)**: Comprehensive profile dashboard displaying professional identity, license credentials, consultation fee rates, and active shift roster.
4. **Edit Doctor Profile Form (`/dashboard/doctors/:id/edit`)**: Form view for editing medical title, legal name, biography, specialties, and department.
5. **Consultation Fees & Duration Manager (`/dashboard/doctors/:id/fees`)**: Setting view to manage consultation fees and default appointment slot durations.
6. **Doctor Shift Schedule Manager (`/dashboard/doctors/:id/schedule`)**: Weekly schedule table managing doctor shift hours and lunch breaks.
7. **Doctor Leave Exceptions Manager (`/dashboard/doctors/:id/leaves`)**: Manager view for declaring date-specific practitioner vacation closures.
8. **License Audit Review & Status Actions (`/dashboard/doctors/:id/audit`)**: Audit view for Clinic Owners to review board certifications and execute lifecycle status changes (`Verify & Activate`, `Suspend`, `Archive`).

---

## 3. Screen Specifications

### 1. Doctors Directory (`/dashboard/doctors`)
- **Purpose**: Centralized roster for browsing and managing clinic medical practitioners.
- **Primary Action**: Click "Invite New Doctor" button; search by doctor name or license code.
- **Secondary Action**: Filter by specialty or status (`PENDING_VERIFICATION`, `ACTIVE`, `SUSPENDED`, `ARCHIVED`).
- **Entry Points**: Sidebar navigation link "Doctors & Specialists".
- **Exit Points**: Navigate to Doctor Profile Overview (`/dashboard/doctors/:id`).
- **Required Permission**: `doctor:read`.
- **States**:
  - *Loading State*: Table rows replaced by animated skeleton loaders.
  - *Empty State*: Displays `Stethoscope` icon with message: "No doctors match the selected filter query."

### 2. Doctor Profile Overview (`/dashboard/doctors/:id`)
- **Purpose**: Displays full professional information, license verifications, fees, and shift hours.
- **Primary Action**: Click "Edit Professional Info" or "Manage Shift Schedule".
- **Secondary Action**: View active license verification status badge and department assignments.
- **Entry Points**: Doctors Directory record row click.
- **Exit Points**: Navigate to Edit Profile, Fees Manager, or Schedule Manager.
- **Required Permission**: `doctor:read`.

### 3. Consultation Fees & Duration Manager (`/dashboard/doctors/:id/fees`)
- **Purpose**: Manages consultation rates and appointment slot durations.
- **Primary Action**: Click "Save Fee Settings".
- **Entry Points**: Doctor Profile Overview tab "Fees & Settings".
- **Required Permission**: `doctor:fees:write` (Owner / Manager).
- **States**:
  - *Error State*: Highlights input in red if fee amount is negative or slot duration step is invalid.

---

## 4. Layout Structure

### Workspace Page Shell
- **Top Bar**: Displays workspace clinic name, active tenant indicator, and global search bar.
- **Sidebar Navigation**: Highlights "Doctors & Specialists" under the Clinical Management section.
- **Content Container**: 
  - **Header Section**: Page title, breadcrumbs, status badge, and primary action button (top right).
  - **Tab Navigation**: Horizontal tab bar (`Overview`, `Professional Info`, `Fees & Duration`, `Shift Schedule`, `Leaves & Holidays`).
  - **Main Container**: Centered grid layout with maximum content width of 1200px.

---

## 5. Component Usage (Design System Mapping)

- **Doctor Card**: Encapsulates doctor metadata, fee rates, and specialty badges.
- **Table**: Renders the master Doctors Directory and weekly shift schedule.
- **Badges**: Visual status indicators using Design System color tokens:
  - `PENDING_VERIFICATION`: Amber background + `Clock` Lucide icon.
  - `ACTIVE`: Green background + `CheckCircle2` Lucide icon.
  - `SUSPENDED`: Red background + `ShieldAlert` Lucide icon.
  - `ARCHIVED`: Gray / Neutral background + `Archive` Lucide icon.
- **Alert**: Displays state warning banners (e.g. Amber warning when medical license expiration is within 30 days).
- **Dialog**: Renders confirmation overlays for status actions (Suspend, Archive, Verify License).

---

## 6. Form UX

- **Validation Trigger**: Inputs validate on losing focus (`blur` event).
- **Required Field Marker**: Red asterisk (`*`) placed beside field labels.
- **Error Placement**: Validation error text renders immediately below affected input in 12px red text.
- **Unsaved Changes Shield**: Prompts confirmation modal if user attempts to leave an edit view with dirty inputs.
- **Submission Loading**: Save buttons display a loading spinner and enter a disabled state during API dispatch.

---

## 7. Status Visualization

Emojis are strictly forbidden. Status indicators rely on Lucide React SVG icons and curated color tokens:

- **Pending Verification**: Amber badge with `<Clock size={14} />` icon.
- **Active / Operational**: Green badge with `<CheckCircle2 size={14} />` icon.
- **Suspended Practitioner**: Red badge with `<ShieldAlert size={14} />` icon.
- **Archived Record**: Gray badge with `<Archive size={14} />` icon.

---

## 8. Navigation

- **Breadcrumb Path**: `Dashboard > Doctors Directory > Dr. Sarah Jenkins > Edit Profile`
- **Back Navigation**: Prominent `<ArrowLeft size={16} />` icon button at top left of sub-edit views.
- **Deep Linking**: Direct URL routing supported (e.g. `/dashboard/doctors/doc-101/schedule`).

---

## 9. Responsive Behavior

- **Mobile (<768px)**: 12-column grid collapses to a single column (100% width). Tab bar becomes horizontally scrollable. Action buttons stretch to full width.
- **Tablet (768px - 1024px)**: 2-column grid layout for profile metadata. Schedule table displays with horizontal scroll.
- **Desktop (>1024px)**: 3-column split view (Left: Doctor avatar & license summary; Right: Detailed shift editor & settings).

---

## 10. Accessibility (WCAG 2.1 AA)

- **Keyboard Support**: Full `Tab` key navigation through forms and directory tables. Time pickers support arrow key increments.
- **Focus Management**: Active elements display a 2px blue focus outline ring (`var(--color-primary)`).
- **Screen Reader Support**: All status badges include `aria-label` text descriptions. Form errors attach via `aria-describedby`.
- **Contrast Ratios**: Body text maintains a minimum contrast ratio of 4.5:1 against the background.

---

## 11. Empty & State Overlays

- **No Doctors Found**: Renders centered empty state card with a `<Stethoscope size={44} />` icon and text: "No medical practitioners found in directory."
- **No Leaves Declared**: Displays `<CalendarOff size={40} />` icon with text: "No custom leave exceptions declared for this practitioner."

---

## 12. Confirmation Flows

### Suspend Doctor Confirmation Dialog
- **Trigger**: Clinic Owner clicks "Suspend Practitioner Access".
- **Visual Design**: Danger Alert Dialog featuring a `<ShieldAlert size={32} />` icon.
- **Message**: "Are you sure you want to suspend Dr. [Doctor Name]? Active login access will be blocked, and all upcoming patient appointment slots will be flagged for reassignment."
- **Primary Button**: "Confirm Suspension" (Red Solid Button).
- **Secondary Button**: "Cancel" (Outline Button).

---

## 13. Design System Compliance

- **Typography**: Display headings set in Outfit; body labels set in Inter.
- **Colors**: Slate background (`#f8fafc`), Primary Blue (`#1066cc`), Surface White (`#ffffff`).
- **Icons**: Exclusively Lucide React SVG icons (`Stethoscope`, `UserCheck`, `Clock`, `ShieldAlert`, `CheckCircle2`, `Archive`, `CalendarOff`, `DollarSign`).

---

## 14. Future Extensibility

- **Multi-Clinic Assignment Selector**: Doctor Header includes layout space for multi-tenant branch badges in V2.
- **EMR Integration Hooks**: Doctor Profile layout includes structural slots for recent patient encounter summaries.

---

## 15. Assumptions

- Administrators access the application primarily via desktop browsers during operating hours.
- Consultation fee fields display the workspace tenant's primary currency code.

---

## 16. Out of Scope

- React code, JSX, HTML, or CSS implementation files.
- Figma wireframe files or asset exports.
- Backend routing or controller logic.
