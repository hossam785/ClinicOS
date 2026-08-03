# ClinicOS Quality Gate — UI Audit Checklist

**Version:** 1.0  
**Status:** Mandatory Production Quality Gate  
**Target:** Pre-Merge Inspection, Design System Compliance & Quality Assurance  

---

## Executive Summary

This document defines the official UI Audit Checklist for ClinicOS. It serves as an uncompromisable quality gate. No page, component, workspace, dashboard, form, modal, or module modification may be considered production-ready unless it successfully passes every applicable checklist item in this specification.

---

## Table of Contents

1. [Audit Governance & Execution Workflow](#audit-governance--execution-workflow)
2. [Audit Review Categories](#audit-review-categories)
   - [Category 1: Visual & Aesthetic Review](#category-1-visual--aesthetic-review)
   - [Category 2: User Experience (UX) & Flow Review](#category-2-user-experience-ux--flow-review)
   - [Category 3: Accessibility (A11Y) Review](#category-3-accessibility-a11y-review)
   - [Category 4: Responsive & Multi-Device Review](#category-4-responsive--multi-device-review)
   - [Category 5: Technical & Code Architecture Review](#category-5-technical--code-architecture-review)
   - [Category 6: Governance & Documentation Compliance](#category-6-governance--documentation-compliance)
3. [Severity Rating Scale](#severity-rating-scale)
4. [Final Definition of Done (DoD)](#final-definition-of-done-dod)

---

## Audit Governance & Execution Workflow

Every UI modification MUST undergo audit verification following code implementation (`npm run build`) and prior to pull request approval or deployment.

```
┌────────────────────────────────────────────────────────┐
│ Step 1: Execute Automated Build Verification           │
├────────────────────────────────────────────────────────┤
│ Step 2: Perform Visual & Spatial Grid Inspection       │
├────────────────────────────────────────────────────────┤
│ Step 3: Test Keyboard Navigation & Focus Indicators    │
├────────────────────────────────────────────────────────┤
│ Step 4: Validate Multi-Breakpoint Responsive Layout    │
├────────────────────────────────────────────────────────┤
│ Step 5: Verify Zero Non-Functional Regressions         │
└────────────────────────────────────────────────────────┘
```

---

## Audit Review Categories

### Category 1: Visual & Aesthetic Review
- **Objective:** Guarantee visual harmony, spatial balance, and design token compliance.
- **Inspection Items:**
  - [ ] **Alignment:** Are all form labels, inputs, icons, and action buttons aligned to the 4px/8px spatial grid?
  - [ ] **Typography:** Does body text use `Inter` and headings use `Outfit` with valid token font sizes?
  - [ ] **Color Tokens:** Are background, surface, text, and border colors mapped to design tokens (`tokens.css` / `platform-control.css`) without ad-hoc hex values?
  - [ ] **Iconography:** Are all icons rendered using `lucide-react` with 2px stroke width and proper size tiering (`16px`/`20px`/`24px`)?
- **Severity Level:** High

### Category 2: User Experience (UX) & Flow Review
- **Objective:** Ensure clarity, scannability, and immediate action discoverability.
- **Inspection Items:**
  - [ ] **Three Questions Test:** Does the screen immediately communicate *Where am I?*, *What can I do?*, and *What should I do next?*
  - [ ] **State Feedback:** Are loading spinners/skeletons, empty states, and inline error alerts rendered cleanly during asynchronous operations?
  - [ ] **Friction Reduction:** Are form validation messages rendered inline directly below failing input fields?
- **Severity Level:** Critical

### Category 3: Accessibility (A11Y) Review
- **Objective:** Enforce WCAG 2.1 Level AA compliance.
- **Inspection Items:**
  - [ ] **Keyboard Navigation:** Can every interactive control be reached via `Tab` and triggered via `Enter`/`Space`?
  - [ ] **Focus Rings:** Do focused controls display visible blue focus outlines (`outline: 2px solid var(--color-primary)`)?
  - [ ] **ARIA Attributes:** Do icon-only buttons carry descriptive `aria-label` strings, and do modals use `role="dialog"`?
  - [ ] **Color Contrast:** Does text pass the minimum `4.5:1` contrast ratio requirement against backgrounds?
- **Severity Level:** Critical

### Category 4: Responsive & Multi-Device Review
- **Objective:** Guarantee zero layout breakage across desktop, laptop, tablet, and mobile displays.
- **Inspection Items:**
  - [ ] **Viewport Boundaries:** Is horizontal scrolling strictly absent from the main window body at all resolutions (`360px` to `1920px+`)?
  - [ ] **Grid Adaptation:** Do 6-column KPI cards collapse into 2 or 1 column gracefully on tablet and mobile views?
  - [ ] **Touch Targets:** Are interactive buttons and inputs at least `44px` high on tablet and mobile touch devices?
- **Severity Level:** High

### Category 5: Technical & Code Architecture Review
- **Objective:** Maintain clean frontend code quality without structural bloat.
- **Inspection Items:**
  - [ ] **Component Reuse:** Are existing components from `src/design-system/components/` reused rather than duplicated?
  - [ ] **Clean Code:** Are inline hardcoded styles (`style={{ margin: 13 }}`) avoided in favor of CSS utility classes or tokens?
  - [ ] **Compiler Clean:** Does `npm run build` execute without TypeScript compiler or Vite bundling errors?
- **Severity Level:** Critical

### Category 6: Governance & Documentation Compliance
- **Objective:** Verify absolute alignment with all project policies under `docs/ui/`.
- **Inspection Items:**
  - [ ] **Preservation Policy:** Are backend services, APIs, DB schemas, auth logic, and workflows 100% untouched?
  - [ ] **Feature Scope:** Are new unapproved features or capability removals strictly absent?
- **Severity Level:** Level 0 (Highest)

---

## Severity Rating Scale

- **Level 0 (Blocker):** Violation of Project Preservation Policy or functional regression. Rejects commit immediately.
- **Critical:** Accessibility failure, TypeScript compilation error, or broken layout. Must fix before merge.
- **High:** Visual inconsistency, broken spatial grid, or missing dark mode contrast.
- **Medium:** Minor margin offset or non-standard icon size.

---

## Final Definition of Done (DoD)

A UI task is officially marked as **DONE** only when:
1. Every checkbox item in Categories 1 through 6 passes audit inspection.
2. The frontend builds with zero warnings or errors (`npm run build`).
3. The visual output presents an ultra-clean, enterprise SaaS aesthetic worthy of production release.
