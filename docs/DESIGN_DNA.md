# Design DNA & UX/UI System Specification

## Metadata

| Field | Value |
| --- | --- |
| **Title** | Design DNA & UX/UI System Specification |
| **Purpose** | Establishes the design tokens, visual identity, component guidelines, and user experience standards for ClinicOS. |
| **Description** | Serves as the single source of truth for frontend styling, accessibility rules, interaction models, and UI aesthetic guidelines. |
| **Status** | Approved |
| **Last Updated** | 2026-07-29 |

---

## Table of Contents

- [Design Philosophy](#design-philosophy)
- [Design Principles](#design-principles)
- [Visual Identity](#visual-identity)
- [Color Philosophy](#color-philosophy)
- [Typography](#typography)
- [Spacing System](#spacing-system)
- [Border Radius](#border-radius)
- [Shadows](#shadows)
- [Cards](#cards)
- [Buttons](#buttons)
- [Forms](#forms)
- [Tables](#tables)
- [Navigation](#navigation)
- [Icons](#icons)
- [Empty States](#empty-states)
- [Loading States](#loading-states)
- [Responsive Design](#responsive-design)
- [Accessibility](#accessibility)
- [Animations](#animations)
- [Things To Avoid](#things-to-avoid)

---

# Design Philosophy

ClinicOS is built to support healthcare professionals who operate in high-pressure, fast-paced clinical environments. The design philosophy is rooted in creating a **Calm, Professional, and Fast** experience. 
- **Calm**: Interface layouts should reduce cognitive fatigue. Neutral colors, subtle borders, and balanced spacing prevent visual stress during long shifts.
- **Professional**: The system exhibits a highly clinical, reliable aesthetic. Every UI element acts as a functional utility, conveying precision and trustworthiness.
- **Fast**: Layouts optimize user actions. Features prioritize high information density with swift navigation paths, ensuring clinical workflows occur without latency.

---

# Design Principles

- **Simplicity First**: Remove extraneous steps. Critical tasks—like booking an appointment or reviewing an allergy list—must be achievable in the fewest clicks possible.
- **Clarity over Decoration**: UI elements must serve a functional purpose. Avoid purely decorative graphics, shadows, or visual embellishments.
- **Function before Aesthetics**: A clinical dashboard's usability and searchability are always prioritized over stylistic trends.
- **Consistency**: Component behavior, state indicators, error treatments, and keyboard shortcuts must remain uniform across all views and modules.
- **Accessibility**: Designs must accommodate diverse user requirements, supporting high-contrast modes, keyboard accessibility, and screen readers.
- **Predictability**: Interactive controls must perform logically based on standard web application behaviors, preventing accidental data submission.

---

# Visual Identity

The visual direction of ClinicOS blends modern enterprise design with healthcare-focused aesthetics:
- **General Appearance**: Flat surfaces, thin borders, and clean borders define boundaries. Content group layouts are crisp and easy to scan.
- **Visual Hierarchy**: Focus is directed using font weights, background tones, and border accents rather than bold primary colors.
- **Interface Personality**: The system is organized, clean, and clinical. It maintains a neutral demeanor to allow medical data to stand out.
- **Medical Identity**: Clean layouts, soft sanitary hues, and precise medical iconography reinforce the platform's professional medical purpose.

---

# Color Philosophy

Colors in ClinicOS are applied systematically to guide user attention and convey status without creating visual clutter:
- **Primary Color**: Used for the primary brand markers, active navigation states, selection indicators, and primary call-to-action (CTA) triggers.
- **Secondary Color**: Applied to secondary actions, tertiary controls, and structural border borders.
- **Success Color**: Reserved strictly for successful events, fully settled invoices, confirmation messages, and verified status badges.
- **Warning Color**: Used for alert warnings, pending actions, double-booking cautions, and intermediate statuses.
- **Error Color**: Used for invalid inputs, missing fields, destructive actions (e.g., Delete, Void), failed connections, and critical alerts.
- **Information Color**: Applied to tooltips, instruction alerts, info panels, and general system notices.
- **Neutral Colors**: Form the foundation of the interface. Light neutrals are used for backgrounds, card surfaces, and disabled states; dark neutrals are used for text headers and body text.

---

# Typography

Typography guidelines prioritize structural readability and document legibility:
- **Heading Hierarchy**: Distinct scales exist for H1 (Page Headers), H2 (Component Group Headers), and H3 (Card/Modal Titles) to organize screen layouts.
- **Body Text**: Sized and spaced specifically to avoid line crowding on high-resolution clinical monitors.
- **Labels**: Rendered with bold, clear formatting to make form fields distinct from input values.
- **Captions**: Smaller scale used for secondary timestamps, history trails, and micro-metrics.
- **Readability**: Ensure strict hierarchy using color contrasts and variable font weights rather than multiple font families.
- **Line Spacing**: Set to comfortable proportions (e.g., 1.5 for body text, 1.2 for headers) to prevent eye strain.

---

# Spacing System

The spacing system coordinates layout alignments, padding, and margins:
- **Layout Grid**: Interfaces are aligned to a strict modular spacing grid scale (e.g., 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px) to ensure absolute symmetry.
- **White Space**: Utilized to group related patient records and isolate controls. It acts as a structural divider, reducing the need for heavy visual lines.
- **Padding**: Applied compactly in high-density tables, and comfortably inside input forms and modals.
- **Layout Rhythm**: Maintain consistent vertical margins between sections to establish a natural reading pattern.

---

# Border Radius

Corner treatments are subtle and controlled:
- **Inputs & Small Controls**: Minimal border radius (e.g., 4px - 6px) to maintain a crisp, structured form aesthetic.
- **Cards & Containers**: Moderate border radius (e.g., 8px) to define surface containers without introducing excessive rounding.
- **Modals & Dialogs**: Large border radius (e.g., 8px - 12px) to softly separate overlays from background layers.
- **Capsule Rounding**: Prohibited, except for small status indicators/badges.

---

# Shadows

Shadows are used sparingly to indicate visual depth:
- **Flat Layouts**: By default, panels, inputs, and tables are flat, utilizing border lines for separation.
- **Modals & Overlays**: Light, diffuse, low-opacity drop shadows are used to float dialog boxes and dropdown menus above base layers.
- **No Heavy Shadows**: Avoid dark, intense, or high-spread shadows which create visual weight.

---

# Cards

Cards are used to aggregate patient files, billing metrics, and clinic profiles:
- **Padding**: Consistent internal margins on all sides.
- **Borders**: Thin, light neutral borders to define structural edges.
- **Elevation**: Flat background style by default. Interactive cards display a subtle outline shift or elevate slightly on hover.
- **Visual Consistency**: Cards of a similar category must maintain identical layouts, headers, and action alignments.

---

# Buttons

Buttons trigger explicit operations, classified into distinct styles:
- **Primary**: Filled background button. Reserved for the primary positive action on a screen (e.g., Save, Book, Check-In). Only one primary button should dominate a layout.
- **Secondary**: Outlined or soft neutral background button. Used for alternate actions (e.g., Edit, Print, Cancel).
- **Danger**: Solid indicator color (error tone). Reserved strictly for destructive, irreversible operations (e.g., Delete Record, Void Invoice).
- **Outline**: Transparent body with thin borders, applied for tertiary commands.
- **Disabled**: Lowered opacity, grayed color, and pointer event blocking. Visual feedback must clearly communicate why the control is inactive.

---

# Forms

Forms are crucial for clinical data entry and patient intake:
- **Labels**: Always visible, positioned above the input field. Do not replace labels with placeholder text.
- **Required Fields**: Indicated visually using a consistent indicator (e.g., a colored asterisk) and backed by descriptive help texts.
- **Validation**: Performed inline as the user tabs through fields. Clear validation icons show successful entries.
- **Error Handling**: Display clear error messages directly beneath the input field, containing guidance on how to fix the issue.
- **Input Grouping**: Group related inputs (e.g., patient contacts, billing address) within dedicated sections or panels.

---

# Tables

Data tables list clinic logs, bookings, and patient rosters:
- **Sorting**: Column headers display interactive toggle indicators showing active sorting states (ascending/descending).
- **Filtering**: Provided through clean filter bars with clear labels and a "Reset Filters" action button.
- **Pagination**: Positioned at the bottom of the table, showing current row ranges and page selectors.
- **Empty States**: Displayed inline within the table body when queries return zero records, explaining why the table is empty and how to add records.
- **Loading States**: Displayed using subtle inline skeleton row blocks to maintain table headers and columns during data fetch loops.

---

# Navigation

The navigation structure organizes workspace features cleanly:
- **Sidebar**: The primary global navigation mechanism. Placed persistently on the left (desktop). Houses main module links.
- **Topbar**: Hosts clinic tenant selection dropdowns, user profile options, global search, and alerts.
- **Breadcrumbs**: Displayed at the top left of child screens to preserve structural context.
- **Search**: A universal, keyboard-triggered search input in the topbar to find patients or appointments.
- **Quick Actions**: Prominent sidebar or topbar triggers for recurring actions (e.g., "New Appointment", "Add Patient").

---

# Icons

Iconography must remain clean and functional:
- **Style**: Monolinear, clean icons with consistent stroke weight.
- **Purpose**: Icons are supplementary markers. They must always accompany text labels for primary navigation and critical actions to prevent user confusion.

---

# Empty States

Empty states occur when a directory or table contains no data:
- **Behavior**: Displays a friendly message explaining why no records are present.
- **Action Call**: Includes a prominent CTA button (e.g., "Add First Patient") to guide the user on the next step.

---

# Loading States

Loading indicators manage user expectations during asynchronous fetches:
- **Skeleton Screens**: Preferred for layout loading, displaying empty shapes mirroring the incoming content.
- **Inline Spinners**: Used for localized action submissions (e.g., clicking "Save" displays a spinner inside the button).
- **Progress Indicators**: Linear progress bars on page borders for large data updates. Avoid blocking the whole page with modals.

---

# Responsive Design

ClinicOS adapts dynamically across device viewports:
- **Desktop**: High-density dashboard layouts, side-by-side split panels (e.g., patient record next to encounter timeline), and persistent sidebars.
- **Tablet**: Collapsed sidebars, stacked cards, and touch-friendly control areas.
- **Mobile**: Single-column vertical scroll flow, modal-driven action sheets, and tabbed sub-navigation.

---

# Accessibility

ClinicOS adheres to strict accessibility standards to ensure inclusivity:
- **Contrast**: Maintain a contrast ratio of at least 4.5:1 for body text and 3:1 for headers against backgrounds (WCAG 2.1 AA).
- **Keyboard Navigation**: Universal Tab key navigation order. All interactive elements display a distinct focus ring.
- **Focus States**: Clear, visible focus indicators (e.g., blue border outline) that are never hidden.
- **Labels**: Ensure all inputs possess explicit associated label tags.
- **Screen Readers**: Implement semantic HTML tags and ARIA labels on complex controls (e.g., date pickers).

---

# Animations

Animations are functional micro-interactions used to explain state transitions:
- **Transitions**: Constrained to subtle fade-ins, slide-downs, and hover transitions.
- **Timing**: Kept short (150ms - 200ms) with smooth ease-out curves to ensure responsiveness.
- **Reduced Motion**: Respect system preferences for reduced motion, disabling transitions automatically.

---

# Things To Avoid

To preserve the clinical integrity of ClinicOS, the following patterns are **strictly prohibited**:
- **Overloaded Dashboards**: Avoid placing too many metrics, status dials, or widgets on a single overview page.
- **Heavy Shadows**: Do not apply dense, dark drop shadows that distort container structures.
- **Flashy Animations**: Avoid bounce effects, slow page reveals, or rotating loading widgets.
- **Visual Clutter**: Never use decorative graphic lines, icons, or badges that do not present real data.
- **Inconsistent Spacing**: Never mix layout grid padding steps within a single screen.
- **Excessive Gradients**: Do not use multi-color background gradients or colored button gradients. Keep surfaces neutral and clean.
