# Clinic Management Module UI/UX Design Specification (CLINIC_MANAGEMENT_UI_UX.md)

This document establishes the user interface design, screen inventory, component mappings, responsive behaviors, accessibility standards, and interaction states for the **Clinic Management Module** of ClinicOS. It serves as the official UI/UX blueprint prior to frontend implementation.

---

## 1. UX Goals

### User Goals
- Provide Clinic Owners and Managers with an intuitive, clutter-free dashboard to manage clinic profiles, operational contact details, and daily shift schedules.
- Provide Super Admins with an efficient, clear administrative console to review pending clinic registrations and execute lifecycle status changes (Approve, Suspend, Reactivate, Archive).

### Business Goals
- Reduce onboarding time for new clinics by guiding administrators through profile completion steps.
- Eliminate operational booking conflicts by making shift time bounds and holiday date declarations visually explicit.

### Core Design Principles
- **Clinical Calm**: Minimal, high-contrast layouts using a slate neutral palette and clinic blue accents to minimize cognitive fatigue.
- **Form Error Resilience**: Inline, blur-triggered validations that guide error recovery without losing previously entered values.
- **Visual Status Transparency**: Unambiguous visual indicators (badges and SVG icons) displaying clinic tenant lifecycle states.
- **Absolute Accessibility**: Full WCAG 2.1 AA compliance across all views and interactive controls.

---

## 2. Screen Inventory

### Platform Super Admin Scope
1. **Clinic Registry List (`/admin/clinics`)**: Overview table of all clinic tenants with status filtering, search bar, and pagination.
2. **Clinic Review & Audit View (`/admin/clinics/:id`)**: Detailed verification view displaying medical license credentials, tax IDs, owner contact information, and status management actions.

### Tenant Workspace Scope (`/dashboard/clinic/*`)
3. **Clinic Profile View (`/dashboard/clinic/profile`)**: Main workspace dashboard view presenting clinic metadata, physical location, emergency contact info, and registration status.
4. **Edit Clinic Profile Form (`/dashboard/clinic/profile/edit`)**: Form view for updating name, tax ID, phone, address, and logo URL.
5. **Operating Hours & Shift Manager (`/dashboard/clinic/hours`)**: Interactive shift table managing Monday–Sunday working hours, daily start/end times, and lunch break intervals.
6. **Holiday & Exception Declarations (`/dashboard/clinic/holidays`)**: Date-specific exception manager for adding and removing holiday closures.

---

## 3. Screen Specifications

### 1. Clinic Registry List (`/admin/clinics`)
- **Purpose**: Allows Super Admins to monitor all registered clinic tenants.
- **Primary Action**: Click "Review Application" on pending records; click "Search / Filter".
- **Secondary Action**: Export clinic audit list; filter by status (`PENDING_REVIEW`, `ACTIVE`, `SUSPENDED`, `ARCHIVED`).
- **Entry Points**: Super Admin sidebar link "Tenants & Clinics".
- **Exit Points**: Navigate to Clinic Review & Audit View (`/admin/clinics/:id`).
- **Required Permission**: `platform:clinics:read`.
- **States**:
  - *Loading State*: Table rows replaced by animated skeleton loaders.
  - *Empty State*: Displays `Building2` icon with message: "No clinic records match the selected filter."

### 2. Clinic Profile View (`/dashboard/clinic/profile`)
- **Purpose**: Displays the operational profile and contact details of the active clinic.
- **Primary Action**: Click "Edit Profile Information" button.
- **Secondary Action**: View active operating hours preview card; view location map pin details.
- **Entry Points**: Workspace sidebar link "Clinic Settings".
- **Exit Points**: Navigate to Edit Profile (`/dashboard/clinic/profile/edit`) or Operating Hours (`/dashboard/clinic/hours`).
- **Required Permission**: `clinic:profile:read`.

### 3. Operating Hours & Shift Manager (`/dashboard/clinic/hours`)
- **Purpose**: Manages weekly daily shift hours and lunch break windows.
- **Primary Action**: Click "Save Operating Hours".
- **Secondary Action**: Toggle day active/closed switch; "Reset to Standard Shift".
- **Entry Points**: Clinic Profile tab "Operating Hours".
- **Exit Points**: Return to Clinic Profile.
- **Required Permission**: `clinic:schedule:write`.
- **States**:
  - *Error State*: Displays inline red helper message under day row when `shiftStart >= shiftEnd` or lunch break falls outside shift bounds.

---

## 4. Layout Structure

### Workspace Page Shell
- **Top Bar**: Displays active clinic name, status badge, and global search bar.
- **Sidebar Navigation**: Highlights "Clinic Settings" under the Organization group.
- **Content Area**: 
  - **Header Section**: Page title, breadcrumbs, and primary call-to-action button (top right).
  - **Tab Navigation**: Horizontal tab bar (`Profile`, `Operating Hours`, `Holidays & Closures`).
  - **Main Container**: Centered 12-column grid layout with maximum content width of 1200px.

---

## 5. Component Usage (Design System Mapping)

- **Card**: Used to encapsulate profile sections (General Info, Location, Operating Hours Summary).
- **Table**: Renders the Super Admin Clinic Registry and the Holiday Exceptions list.
- **Badges**: Displays clinic tenant statuses using Design System color mappings:
  - `PENDING_REVIEW`: Yellow / Amber background + `Clock` Lucide icon.
  - `APPROVED`: Blue background + `CheckCircle` Lucide icon.
  - `ACTIVE`: Green background + `CheckCircle2` Lucide icon.
  - `SUSPENDED`: Red background + `ShieldAlert` Lucide icon.
  - `ARCHIVED`: Gray / Neutral background + `Archive` Lucide icon.
- **Alert**: Displays state banners (e.g. Warning banner when clinic is pending approval).
- **Dialog**: Renders confirmation overlays for critical actions (Suspend, Archive, Reset Hours).
- **Form Controls**: Text `Input`, Select dropdowns, Time pickers, and Switch toggles.

---

## 6. Form UX

- **Validation Trigger**: Field inputs validate on losing focus (`blur` event).
- **Required Field Marker**: Red asterisk (`*`) placed beside input labels.
- **Error Placement**: Validation messages render immediately below the affected input field in 12px red text.
- **Unsaved Changes Guard**: If a user attempts to leave a form view with dirty fields, a native browser modal prompts: "You have unsaved changes. Are you sure you want to discard them?"
- **Submission Loading**: Save buttons display a loading spinner and enter a disabled state during API dispatch.

---

## 7. Status Visualization

Emojis are strictly prohibited. Visual status indicators rely on Lucide React SVG icons and curated color tokens:

- **Pending Review**: Amber badge with `<Clock size={14} />` icon.
- **Active / Operational**: Green badge with `<CheckCircle2 size={14} />` icon.
- **Suspended Workspace**: Red badge with `<ShieldAlert size={14} />` icon.
- **Archived Record**: Gray badge with `<Archive size={14} />` icon.

---

## 8. Navigation

- **Breadcrumb Path**: `Dashboard > Clinic Settings > Operating Hours`
- **Back Button**: Prominent `<ArrowLeft size={16} />` icon button at top left of sub-edit views.
- **Deep Linking**: Direct URL routing supported (e.g. `/dashboard/clinic/hours#monday`).

---

## 9. Responsive Behavior

- **Mobile (<768px)**: 12-column grid collapses to a single column (100% width). Tab bar becomes horizontally scrollable. Action buttons stretch to full width.
- **Tablet (768px - 1024px)**: 2-column grid layout for form sections. Operating hours table displays with horizontal scroll.
- **Desktop (>1024px)**: 3-column split view (Left: Profile card & map summary; Right: Detailed shift editor & settings).

---

## 10. Accessibility (WCAG 2.1 AA)

- **Keyboard Support**: Full `Tab` key navigation through forms and tables. Shift time pickers support arrow key increments.
- **Focus Management**: Active elements display a 2px blue focus outline ring (`var(--color-primary)`).
- **Screen Reader Support**: All visual status badges include `aria-label` text descriptions. Form errors attach to inputs via `aria-describedby`.
- **Contrast Ratios**: Body text maintains a minimum contrast ratio of 4.5:1 against the background.

---

## 11. Empty & State Overlays

- **No Holidays Declared**: Renders a centered empty state card with a `<CalendarOff size={40} />` icon and description: "No custom holiday closures declared. Clinic follows standard weekly operating hours."
- **No Search Results**: Displays `<SearchX size={40} />` icon with text: "No clinics match your query parameters."

---

## 12. Confirmation Flows

### Suspend Clinic Confirmation Dialog
- **Trigger**: Super Admin clicks "Suspend Workspace".
- **Visual Design**: Danger Alert Dialog featuring a `<ShieldAlert size={32} />` icon.
- **Message**: "Are you sure you want to suspend [Clinic Name]? All active user sessions associated with this workspace will be immediately terminated."
- **Primary Button**: "Confirm Suspension" (Red Solid Button).
- **Secondary Button**: "Cancel" (Outline Button).

---

## 13. Design System Compliance

- **Typography**: Display headings set in Outfit; body labels set in Inter.
- **Colors**: Slate background (`#f8fafc`), Primary Blue (`#1066cc`), Surface White (`#ffffff`).
- **Icons**: Exclusively Lucide React SVG icons (`Building2`, `Clock`, `MapPin`, `Calendar`, `ShieldAlert`, `CheckCircle2`, `Archive`).

---

## 14. Future Extensibility

- **Multi-Branch Selector**: Layout header leaves structural space for a branch dropdown selector in V2.
- **Doctor Roster Integration**: Operating hours views include hooks to display active doctor count per shift.

---

## 15. Assumptions

- Administrators access the application primarily via desktop browsers during operating hours.
- Time pickers use 24-hour HH:mm notation.

---

## 16. Out of Scope

- React code, JSX, HTML, or CSS implementation files.
- Figma wireframe files or asset exports.
- Backend routing or controller logic.
