# ClinicOS Component Standards

**Version:** 1.0  
**Status:** Official Single Source of Truth  
**Target:** Frontend Component Architecture & System Design  

---

## Executive Summary

This document defines the official UI Component Standards for the entire ClinicOS platform. Every reusable component across the application MUST comply with this specification to guarantee visual harmony, interaction consistency, WCAG AA accessibility, and predictable user behavior.

---

## Table of Contents

1. [Governance & Scope](#governance--scope)
2. [Base System Tokens & Variables](#base-system-tokens--variables)
3. [Form & Input Controls](#form--input-controls)
   - [Buttons & Action Buttons](#buttons--action-buttons)
   - [Inputs, Password Inputs & Search Inputs](#inputs-password-inputs--search-inputs)
   - [Textareas](#textareas)
   - [Checkboxes, Radio Buttons & Switches](#checkboxes-radio-buttons--switches)
   - [Select Dropdowns & Multi Selects](#select-dropdowns--multi-selects)
   - [Date & Time Pickers](#date--time-pickers)
4. [Data Display & Badges](#data-display--badges)
   - [Badges & Tags](#badges--tags)
   - [Cards & Statistic Cards](#cards--statistic-cards)
   - [Tables & Data Grids](#tables--data-grids)
   - [Avatars & Status Indicators](#avatars--status-indicators)
5. [Overlays & Navigation](#overlays--navigation)
   - [Dialogs, Modals & Drawers](#dialogs-modals--drawers)
   - [Dropdown Menus & Context Menus](#dropdown-menus--context-menus)
   - [Tooltips & Popovers](#tooltips--popovers)
   - [Breadcrumbs, Tabs & Accordions](#breadcrumbs-tabs--accordions)
   - [Pagination](#pagination)
6. [Feedback, Loading & States](#feedback-loading--states)
   - [Alerts, Notifications & Toasts](#alerts-notifications--toasts)
   - [Loading Indicators, Skeleton Loaders & Progress Indicators](#loading-indicators-skeleton-loaders--progress-indicators)
   - [Empty States & Error States](#empty-states--error-states)
7. [Structure & Layout Modules](#structure--layout-modules)
   - [Page Headers & Section Headers](#page-headers--section-headers)
   - [Information Panels](#information-panels)
   - [Filters, Search Bars & Action Toolbars](#filters-search-bars--action-toolbars)
8. [Compliance & Audit Checklist](#compliance--audit-checklist)

---

## Governance & Scope

This specification applies universally to all reusable UI primitives in `src/design-system/components/` and module views. Components documented herein reflect existing project architecture; no new unapproved primitives may be added without architecture review.

---

## Component Specifications

### Buttons & Action Buttons

#### Purpose & Usage
- **Primary Use:** Trigger actions, submit forms, confirm decisions.
- **When NOT to use:** Navigation between routes (use links/anchor tags).

#### Visual Hierarchy & Sizing
- **Primary:** Filled brand accent (`--color-primary`). Maximum 1 per section.
- **Secondary:** Outlined or subtle background for supporting options.
- **Danger:** Destructive actions (`--color-danger`).
- **Sizing:** Small (`32px`), Medium (`40px`), Large (`48px`).

#### States & Accessibility
- **Hover:** Darken/lighten background by 8%.
- **Focus:** 2px visible focus ring (`--color-primary`).
- **Disabled:** 40% opacity, `cursor: not-allowed`, `aria-disabled="true"`.
- **Keyboard:** Triggers on `Enter` or `Space`.

---

### Inputs, Password Inputs & Search Inputs

#### Purpose & Usage
- **Primary Use:** Single-line data entry, credential entry, real-time filtering.
- **When NOT to use:** Multi-line text entry (use Textarea).

#### Visual Hierarchy & Styling
- **Height:** Standard `40px` (Medium), `32px` (Compact).
- **Icons:** Left icon for Search (`lucide-react Search`), Right toggle icon for Password visibility toggle.

#### States & Accessibility
- **Default:** `--color-border` 1px border.
- **Focus:** `--color-primary` border + 3px soft focus ring.
- **Error:** `--color-danger` border + inline error message below.
- **Accessibility:** `aria-invalid`, `aria-describedby` linked to helper/error text.

---

### Textareas

#### Purpose & Usage
- **Primary Use:** Multi-line notes, medical observations, prescription instructions.

#### Sizing & Rules
- **Min Height:** `96px` (3 lines). Vertical resize only.
- **Typography:** `14px` (`0.875rem`) line-height `1.5`.

---

### Checkboxes, Radio Buttons & Switches

#### Purpose & Usage
- **Checkbox:** Multi-selection or boolean agreement.
- **Radio:** Exclusive single selection from 2-5 options.
- **Switch:** Instant binary system setting toggle.

#### Accessibility & Keyboard
- Native input backing for accessibility. Responds to `Space` key.

---

### Select Dropdowns & Multi Selects

#### Purpose & Usage
- **Primary Use:** Selecting from categorized datasets (e.g., Doctor, Clinic, Specialty).

#### Styling & Keyboard
- Custom dropdown overlay with search filter for options > 7.
- Keyboard navigation via `ArrowDown`, `ArrowUp`, `Enter`, `Escape`.

---

### Badges & Tags

#### Purpose & Usage
- **Badges:** Passive status indicators (e.g., `ACTIVE`, `SUSPENDED`, `PENDING`).
- **Tags:** Removable metadata filters (e.g., Patient Medical Flags).

#### Visual Rules
- Compact pill shape (`border-radius: 9999px`), uppercase `11px` bold text.
- Semantic colors: Green (Success), Red (Danger), Yellow (Warning), Blue (Info).

---

### Cards & Statistic Cards

#### Purpose & Usage
- **Cards:** Group related data items or form sections.
- **Stat Cards:** High-level key performance indicators (KPIs).

#### Visual Hierarchy & Spacing
- Surface background (`--color-bg-surface`), 1px border (`--color-border`), `16px` padding.
- Stat Cards: Large numeric display (`1.5rem - 1.75rem` bold) + muted title + trend icon.

---

### Tables & Data Grids

#### Purpose & Usage
- **Primary Use:** Displaying tabular records (Patients, Appointments, Audit Logs).

#### Formatting & Spacing
- Sticky headers (`position: sticky`, `top: 0`).
- Text left-aligned (LTR), numbers right-aligned, status centered.
- Row padding: `12px 16px`. Hover background state `rgba(255,255,255,0.03)`.

---

### Dialogs, Modals & Drawers

#### Purpose & Usage
- **Modal/Dialog:** Critical confirmation or focused form entry.
- **Drawer:** Side panel for detailed entity inspection (e.g., Patient History).

#### Rules
- Dimmed backdrop blur overlay. Focus trap enabled. Closed via `ESC` or overlay click.

---

### Tooltips & Popovers

#### Purpose & Usage
- **Tooltip:** Hover text explanation for icon-only actions (`<30` chars).
- **Popover:** Interactive popup with rich content or contextual controls.

---

### Breadcrumbs, Tabs & Accordions

#### Purpose & Usage
- **Breadcrumbs:** Path context navigation (`Dashboard > Patients > Profile`).
- **Tabs:** Module sub-view switching without page reload.
- **Accordions:** Collapsible dense form sections.

---

### Pagination

#### Purpose & Usage
- **Primary Use:** Navigating multi-page dataset results in tables.
- **Elements:** Previous/Next buttons, Page numbers, Items-per-page selector, Total count label.

---

### Alerts, Notifications & Toasts

#### Purpose & Usage
- **Alert:** Static inline message within a page container.
- **Toast:** Floating temporary message notification (`3000ms` auto-dismiss).

#### Semantic Variants
- Info (Blue), Success (Green), Warning (Yellow), Error (Red).

---

### Loading Indicators, Skeleton Loaders & Progress Indicators

#### Purpose & Usage
- **Spinner:** Action button or initial page load indicator.
- **Skeleton:** Content block placeholder during data fetching to eliminate CLS.
- **Progress Bar:** Multi-step form or file upload progress.

---

### Empty States & Error States

#### Purpose & Usage
- **Empty State:** Displayed when a database query returns zero records. Must include Icon + Title + Body + Action Button.
- **Error State:** Displayed on API failure. Must provide clear explanation + Retry trigger.

---

### Structure & Layout Modules

#### Page Headers & Section Headers
- **Page Header:** `24px` Bold Title + Subtitle + Primary Action Toolbar.
- **Section Header:** `16px` Semi-bold + Divider line.

#### Filters, Search Bars & Action Toolbars
- Standardized layout bar positioning search on left, status dropdowns in middle, primary create buttons on right.

---

## Compliance & Audit Checklist

All pull requests and UI changes must pass validation against this specification prior to merging.
