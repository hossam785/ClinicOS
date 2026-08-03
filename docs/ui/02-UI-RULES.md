# ClinicOS Mandatory UI Implementation Rules

**Version:** 1.0  
**Status:** Active Governance Document  
**Target:** Frontend UI Refactoring & Component Maintenance  

---

## Executive Summary

This document defines the mandatory UI implementation rules that every present and future UI task in ClinicOS must follow. It serves as an official governance document to preserve architectural integrity, visual consistency, and user experience standards across the application.

Compliance with this document is strictly enforced for all UI refactoring activities.

---

## Table of Contents

1. [Purpose & Governance](#purpose--governance)
2. [Allowed Changes](#allowed-changes)
3. [Forbidden Changes](#forbidden-changes)
4. [UI Refactoring Rules](#ui-refactoring-rules)
5. [Component Modification Rules](#component-modification-rules)
6. [Layout Rules](#layout-rules)
7. [Form Rules](#form-rules)
8. [Table Rules](#table-rules)
9. [Card Rules](#card-rules)
10. [Modal Rules](#modal-rules)
11. [Navigation Rules](#navigation-rules)
12. [Sidebar Rules](#sidebar-rules)
13. [Header Rules](#header-rules)
14. [Responsive Rules](#responsive-rules)
15. [Accessibility Rules](#accessibility-rules)
16. [Animation Rules](#animation-rules)
17. [Empty States](#empty-states)
18. [Loading States](#loading-states)
19. [Error States](#error-states)
20. [Validation Rules](#validation-rules)
21. [Design Consistency Rules](#design-consistency-rules)
22. [Code Quality Rules](#code-quality-rules)
23. [Refactoring Constraints](#refactoring-constraints)
24. [Review Checklist](#review-checklist)
25. [Definition of Done](#definition-of-done)

---

## Purpose & Governance

The purpose of this document is to set unbreakable boundaries for UI engineering. While visual quality and user experience are continuously elevated to enterprise SaaS standards, system logic, APIs, workflows, and database schemas remain 100% stable and untouched.

---

## Allowed Changes

UI refactoring efforts **MAY ONLY**:

- Improve visual quality, contrast, and dark/light mode balance.
- Improve usability, interaction clarity, and affordance.
- Improve component consistency across all modules.
- Improve spacing, padding, margins, and grid alignments.
- Improve typography scales, font weights, and line heights.
- Improve visual hierarchy and natural eye scanning paths.
- Improve accessibility (contrast, ARIA roles, focus rings).
- Improve screen responsiveness (Desktop, Laptop, Tablet).
- Improve component state presentations (Loading, Empty, Error).
- Improve micro-interactions and transitions without introducing noise.

---

## Forbidden Changes

UI refactoring efforts **MUST NOT**:

- Add new features or product capabilities.
- Remove existing features or existing UI actions.
- Change business workflows or user interaction steps.
- Modify application business logic or calculations.
- Modify backend services, controllers, or handlers.
- Modify REST endpoints, API payloads, or response schemas.
- Modify database schemas, migrations, or Prisma definitions.
- Modify authentication logic, JWT handling, or session storage.
- Modify authorization checks, RBAC permissions, or tenant scoping.
- Modify application routing definitions or URL paths.
- Rename modules, folders, or core data models.
- Change product architecture or state management patterns.
- Change domain logic or data transformation functions.

---

## UI Refactoring Rules

1. Refactoring must improve existing code without breaking contract signatures.
2. Existing prop definitions must be preserved unless extended safely.
3. CSS modifications must leverage design tokens (`var(--color-primary)`, etc.).
4. Ad-hoc hardcoded pixel offsets must be avoided in favor of CSS variables.

---

## Component Modification Rules

1. Modify shared components in `src/design-system/components/` first to propagate improvements globally.
2. Component APIs must remain backward compatible.
3. Never duplicate existing design system components for one-off module customization.

---

## Layout Rules

1. Every main view must follow standardized page anatomy: Header → Toolbar → Main Content → Actions → Footer (if applicable).
2. Layout containers must enforce responsive flex or grid structures.
3. Page containers must prevent horizontal scrolling under all supported resolutions.

---

## Form Rules

1. Form fields must display clear labels and required field indicators (`*`).
2. Error messages must appear inline directly below the failing input.
3. Submit buttons must enter a disabled/loading state during pending API submissions.

---

## Table Rules

1. Dense medical tables must feature sticky headers during scroll.
2. Numeric columns must be right-aligned; text columns must be left-aligned (LTR) or right-aligned (RTL).
3. Rows must highlight on hover to assist visual tracking.

---

## Card Rules

1. Cards must maintain uniform border-radius (`var(--radius-lg)` or equivalent token).
2. Card padding must remain consistent across dashboard widgets (`1rem` to `1.5rem`).
3. Card elevation or subtle borders must clearly delineate content boundaries.

---

## Modal Rules

1. Modals must center on screen with a dark backdrop overlay (`backdrop-filter`).
2. Modals must provide an explicit close button (`X`) and respond to the `ESC` key.
3. Primary action buttons inside modals must be positioned predictably on the bottom right (LTR) or bottom left (RTL).

---

## Navigation Rules

1. Active navigation items must be clearly visually distinguished.
2. Navigation state must accurately reflect the active route.
3. Breadcrumb trails must accurately reflect current module hierarchy.

---

## Sidebar Rules

1. The main navigation sidebar must maintain consistent width across views.
2. Collapsed sidebar states must show recognizable icons with tooltips.
3. Tenant and user profile indicators in the sidebar must remain pinned and visible.

---

## Header Rules

1. View headers must clearly display the current Page Title and Context Subtitle.
2. Global search and quick-action triggers must remain anchored.
3. System status badges (e.g., Sync Status, Online Status) must reside in the top header right section.

---

## Responsive Rules

1. Target breakpoints: Mobile (`<640px`), Tablet (`640px - 1024px`), Desktop (`>1024px`).
2. Multi-column grids must collapse gracefully to single or dual columns on smaller screens.
3. Touch targets on mobile/tablet views must measure at least `44px x 44px`.

---

## Accessibility Rules

1. Text-to-background contrast ratio must satisfy WCAG AA standards (minimum 4.5:1).
2. Interactive controls must display visible focus rings during keyboard navigation.
3. Icons without text labels must include `aria-label` attributes.

---

## Animation Rules

1. Transitions must use fast timing functions (`150ms - 250ms`).
2. Animations must serve state changes (e.g., fade-in, dropdown slide), never idle decoration.
3. Respect user `prefers-reduced-motion` browser settings.

---

## Empty States

1. Views without data must render a clean `<EmptyState />` component.
2. Empty states must include an illustrative icon, title, short guidance text, and optional action button.
3. Empty states must never render blank white screens or raw null errors.

---

## Loading States

1. Content areas fetching data must render skeletons or spinner loaders (`<Loader />`).
2. Loading skeletons must match the dimensions of the content being loaded.
3. Prevent layout shifting (CLS) during data loading transition.

---

## Error States

1. API network or validation failures must present clear, user-friendly alert banners.
2. Error messages must explain what went wrong and provide a retry action if applicable.
3. Technical stack traces must never be displayed to end users.

---

## Validation Rules

1. Validation feedback must trigger inline on blur or submit.
2. Validated fields must show clear visual feedback.
3. Invalid fields must highlight with `--color-danger` border.

---

## Design Consistency Rules

1. Color usage across all views must strictly map to design system tokens.
2. Font family definitions must strictly use system fonts defined in `--font-primary` and `--font-heading`.
3. Icon set usage must remain strictly consistent (`lucide-react`).

---

## Code Quality Rules

1. Avoid inline CSS style blocks where reusable utility CSS classes or tokens apply.
2. Keep component files modular and readable (< 300 lines per component where feasible).
3. Enforce clean TypeScript type definitions without using `any`.

---

## Refactoring Constraints

1. Do NOT touch files outside the frontend presentation layer unless updating component styling imports.
2. Keep git commits small, focused, and descriptive.
3. Verify zero regression errors in automated frontend builds before submitting.

---

## Review Checklist

Prior to completing any UI refactoring task, verify:
- [ ] Are all business logic and workflows unchanged?
- [ ] Are backend APIs and database models untouched?
- [ ] Does the UI conform to Design System tokens?
- [ ] Is visual hierarchy clear and readable?
- [ ] Does the layout work seamlessly across breakpoints?
- [ ] Are loading, empty, and error states handled cleanly?
- [ ] Does the build pass without TypeScript or linting errors?

---

## Definition of Done

A UI refactoring task is **DONE** only when:
1. The UI meets all 25 criteria specified in this governance document.
2. The component builds cleanly with zero TypeScript errors (`npm run build`).
3. The visual output looks production-ready, enterprise-grade, and fully consistent with ClinicOS Design Language.
