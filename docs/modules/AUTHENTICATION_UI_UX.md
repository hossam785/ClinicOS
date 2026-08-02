# Authentication Module UI/UX Design (AUTHENTICATION_UI_UX.md)

This document defines the user interface specifications, interaction states, responsive layouts, form behaviors, accessibility guidelines, and UX edge cases for the **Authentication Module** of ClinicOS.

---

## 1. Module Overview
The primary UX objective of the Authentication Module is to project **security, clinical calm, and efficiency**. As a healthcare SaaS system, the onboarding and sign-in gates must be clean, simple, and error-resilient, minimizing cognitive friction for busy clinical and administrative staff.

---

## 2. Design Principles
Consistent with `docs/DESIGN_DNA.md`, the UI follows these core principles:
- **Clinical Calm**: Minimal, high-contrast layouts using a clean palette of slate neutrals and clinic blue accents to prevent user fatigue.
- **Error Resilience**: Informative, inline validation alerts that guide recovery without clearing previously entered credentials.
- **Enterprise Speed**: Optimized for keyboard navigation (full tab indexes, default autofocus fields).
- **Absolute Accessibility**: Strictly compliant with WCAG 2.1 AA parameters.

---

## 3. Screen Inventory (Version 1)
- **Screen 1 (Login Gateway)**: Unified login form supporting tenant and identity validation.
- **Screen 2 (Forgot Password Link Recovery)**: Request page to dispatch verification codes.
- **Screen 3 (Reset Password Form)**: Password selection form for validated tokens.
- **Screen 4 (Onboard/Activate Staff Account)**: Registration form for invited clinic staff.
- **Screen 5 (Application Review Pending)**: Information screen for owners awaiting Super Admin tenant validation.
- **Screen 6 (Workspace Suspended/Disabled)**: Information screen for users or clinics with locked access.
- **Screen 7 (Session Expired Gateway)**: Session restoration view.

---

## 4. Screen Specifications

### 1. Login Gateway
- **Purpose**: Authenticate user identities and resolve workspace contexts.
- **Primary Goal**: Users submit their email, password, and tenant identifiers to log in.
- **Secondary Goal**: Access account recovery (Forgot Password) or registration application options.
- **Entry Points**: Direct access to base URL `/auth/login`, or redirected from protected pages.
- **Exit Points**: Dashboard workspace (`/dashboard`) on success; recovery screen (`/auth/forgot-password`) on click.
- **Primary Action**: Click "Sign In" button (or press `Enter`).
- **Secondary Action**: Click "Forgot Password?" hyperlink.
- **States**:
  - *Loading State*: Login button disabled; displays a centered loader spinner.
  - *Error State*: Displays a card-level error alert above inputs with a general message: *"Invalid email or password."* Input borders highlight in red.
  - *Success State*: Smooth transition to loading the workspace dashboard.

### 2. Forgot Password Link Recovery
- **Purpose**: Dispatches account recovery links.
- **Primary Goal**: User submits email to trigger a password reset link.
- **Entry Points**: Login screen "Forgot Password" link.
- **Exit Points**: Login screen (`/auth/login`) via "Back to Sign In" option.
- **Primary Action**: Click "Send Recovery Link" button.
- **States**:
  - *Success State*: Hides input form, displays a success card: *"If the email exists in our records, a secure password reset link has been sent to it."*

### 3. Reset Password Form
- **Purpose**: Establishes new secure credentials.
- **Primary Goal**: User sets their new password using a validated link.
- **Entry Points**: Security link clicked from email (`/auth/reset-password?token=...`).
- **Exit Points**: Redirect to Login on success; request a new link on failure.
- **Primary Action**: Click "Save & Update Password" button.
- **States**:
  - *Error State*: Displays alert: *"This recovery link has expired or has already been used. Please request a new one."*

### 4. Onboard / Activate Staff Account
- **Purpose**: Staff profile registration.
- **Primary Goal**: Invited staff set their name and password to activate their profile.
- **Entry Points**: Invitation email link (`/auth/onboard?token=...`).
- **Exit Points**: Redirect to login on success.
- **Primary Action**: Click "Activate Account" button.
- **Required Info**: Full Name, chosen password (email and role are pre-filled and locked to read-only).

### 5. Application Review Pending / Workspace Suspended
- **Purpose**: Display account status details.
- **Primary Goal**: Explain why access is restricted and outline steps for resolution.
- **Primary Action**: "Contact Administrator" email mailto link.
- **Secondary Action**: "Return to Sign In" hyperlink.

---

## 5. Component Usage & Mappings
The UI relies on these design system components:
- **Card**: Forms are encapsulated in elevated cards to focus attention.
- **Input**: Text fields with built-in validation wrappers for email, password, and tenant context.
- **Button**: Primary action buttons (solid blue) and secondary buttons (outline slate).
- **Alert**: Displays state feedback (red for error, green for success, yellow for warning).
- **Loader**: Rendered inside loading buttons to indicate backend communication.
- **Typography**: Display titles for page headers, Body text for labels, and Helper text for input requirements.

---

## 6. Form UX Rules
- **Autofocus**: The first logical form field (e.g. Email) must autofocus on page load.
- **Tab Order**: Logical top-to-bottom, left-to-right indexing. Submit button follows password input, followed by secondary actions.
- **Validation Trigger**: Inputs validate on losing focus (`blur` event) rather than waiting for form submission, reducing validation noise.
- **Required Fields**: Indicated by a red asterisk (`*`) next to field labels.
- **Password Visibility**: Password fields must feature a monoline eye icon toggle button on the right edge, allowing users to show/hide plaintext characters.
- **Error Placement**: Error messages are placed directly below the relevant input field.

---

## 7. Responsive Behavior
- **Mobile (<768px)**: Forms stack vertically and expand to take up 100% of screen width. Left-side hero graphics are hidden, keeping only the form card visible.
- **Tablet (768px - 1024px)**: Form cards display centered, with a fixed width of 480px.
- **Desktop (>1024px)**: Split-screen layout. Left side displays a calming brand illustration or logo panel; right side displays the form card.

---

## 8. Accessibility Guidelines (WCAG 2.1 AA)
- **Contrast Ratios**: Body text contrast must maintain a minimum ratio of 4.5:1 against the background; buttons and alerts must maintain 3:1.
- **Focus Management**: Active elements must display a high-contrast focus outline (e.g. 2px blue ring) when navigated using the `Tab` key.
- **Screen Reader Support**: All form elements must have explicit labels. Error states must map `aria-invalid="true"` and reference descriptive error blocks via `aria-describedby`.
- **Touch Targets**: All interactive elements (buttons, toggles, links) must maintain a minimum touch target size of 44x44px.

---

## 9. Interaction Design States
- **Hover**: Buttons transition smoothly (150ms) to a slightly darker shade.
- **Focus**: Inputs highlight with a blue border ring.
- **Disabled**: Buttons display in desaturated gray, cursor changes to `not-allowed`, and pointer events are disabled during requests.
- **Loading**: Primary button hides text, showing a centered loading spinner.

---

## 10. UX Edge Cases

- **Slow Network Connection**: If a request exceeds 5 seconds, a loading toast notification appears: *"Server taking longer than usual to respond. Please wait..."*
- **Network Interruption**: If the user submits a form while offline, the system prevents request dispatch, highlighting a top-level alert: *"No internet connection detected. Please verify your connection."*
- **Double-Click Prevention**: Submitting a form immediately disables the submit button, preventing duplicate API requests.
- **Expired Invitation Link**: Clicking an expired link redirects to `/auth/error`, displaying an explanation card and a "Request New Link" button.

---

## 11. Animation Guidelines
- **Page Transitions**: Simple fade-in animation (opacity 0 to 1 over 150ms) when navigating between login and recovery views.
- **Error Shake**: Alert boxes shake slightly (horizontal translation of 4px over 200ms) upon appearance to draw attention.
- **Subtlety**: Users with `prefers-reduced-motion` settings must have all transitions disabled.
- **Spinners**: Loading spinners animate at a slow, continuous rotation (360 degrees over 1 second).

---

## 12. Design Consistency Checklist
- All visual variables match the values defined in `docs/DESIGN_DNA.md`.
- Typography targets Google Fonts (Inter for body, Outfit for headings).
- Button styles align with the primary, secondary, and danger variant parameters.

---

## 13. Open Questions
1. **Password Visibility Settings**: Should the password field hide plaintext characters by default when typing starts?
   - *Proposal*: Yes, characters are obscured by default, with a toggle button available to show plaintext.
2. **Help Desk Contact Location**: Should the email address for suspended accounts be system-wide (`support@clinicos.com`) or tenant-specific?
   - *Proposal*: V1 will show the system support email, referencing the tenant ID in the mailto subject line.
