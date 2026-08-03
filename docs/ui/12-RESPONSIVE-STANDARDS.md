# ClinicOS Responsive Design Standards

**Version:** 1.0  
**Status:** Official Single Source of Truth  
**Target:** Responsive Breakpoints, Fluid Grids & Device Adaptation Rules  

---

## Executive Summary

This document defines the official Responsive Design Standards for the entire ClinicOS platform. ClinicOS must deliver a fluid, high-performance, and visually consistent enterprise SaaS experience across all supported screen resolutions — from 4K workstation displays to laptop screens, tablets, and mobile devices.

Responsive adaptation must preserve usability, workflow clarity, and WCAG AA accessibility without introducing layout breakage, text collision, or horizontal scrolling.

---

## Table of Contents

1. [Governance & Responsive Strategy](#governance--responsive-strategy)
2. [Official Responsive Breakpoint Matrix](#official-responsive-breakpoint-matrix)
3. [Core Layout & Component Responsive Specifications](#core-layout--component-responsive-specifications)
   - [Application Shell & Navigation Sidebar](#application-shell--navigation-sidebar)
   - [Dashboard Layout & Workspace Grids](#dashboard-layout--workspace-grids)
   - [Authentication & Form Layouts](#authentication--form-layouts)
   - [Data Tables & Data Grids](#data-tables--data-grids)
   - [Cards & Statistic KPI Widgets](#cards--statistic-kpi-widgets)
   - [Modals, Dialogs & Side Drawers](#modals-dialogs--side-drawers)
   - [Toolbars, Filters & Search Bars](#toolbars-filters--search-bars)
4. [Touch Targets & Interaction Accessibility](#touch-targets--interaction-accessibility)
5. [Mandatory Responsive Testing Matrix](#mandatory-responsive-testing-matrix)
6. [Responsive Anti-Patterns & Common Mistakes](#responsive-anti-patterns--common-mistakes)

---

## Governance & Responsive Strategy

ClinicOS employs a **Desktop-First Adaptive Strategy** with robust responsive fallbacks. Medical and administrative users primarily operate ClinicOS on desktop workstations and laptops in clinical environments, requiring dense, scannable data layouts. When accessed on tablets or mobile devices, layouts collapse gracefully into single or dual columns while preserving full functionality.

---

## Official Responsive Breakpoint Matrix

The application layout responds to 8 standard media query breakpoints:

| Breakpoint Tier | Media Query Range | Container Max Width | Grid Columns | Padding |
| :--- | :--- | :--- | :--- | :--- |
| **Large Desktop / 4K**| `@media (min-width: 1920px)` | `1800px` | 12 Columns | `32px` |
| **Desktop XL** | `@media (min-width: 1600px)` | `1520px` | 12 Columns | `24px` |
| **Desktop Standard**| `@media (min-width: 1440px)` | `1380px` | 12 Columns | `24px` |
| **Laptop Standard** | `@media (min-width: 1280px)` | `1220px` | 12 Columns | `20px` |
| **Tablet Landscape**| `@media (min-width: 1024px)` | `980px` | 6 Columns | `16px` |
| **Tablet Portrait** | `@media (min-width: 768px)` | `100%` | 4 Columns | `16px` |
| **Large Mobile** | `@media (min-width: 480px)` | `100%` | 2 Columns | `12px` |
| **Small Mobile** | `@media (max-width: 479px)` | `100%` | 1 Column | `8px` |

---

## Core Layout & Component Responsive Specifications

### Application Shell & Navigation Sidebar
- **Desktop (1024px+):** Sidebar expanded (`260px` width) or collapsed (`72px` width). Main content occupies remaining width (`flex: 1`).
- **Tablet & Mobile (<1024px):** Sidebar transforms into a slide-over drawer triggered by a top navigation hamburger menu button. Content area occupies 100% width.

### Dashboard Layout & Workspace Grids
- **KPI Metric Grids:** 6 columns on `1280px+`, 3 columns on `1024px`, 2 columns on `768px`, 1 column on `<480px`.
- **Split View Workspaces (e.g., AI Assistant):** Dual-pane side-by-side view on `1024px+`; stacks vertically on `<1024px`.

### Data Tables & Data Grids
- **Desktop (1024px+):** Full data table with all metadata columns visible.
- **Tablet & Mobile (<1024px):** Table wraps inside a horizontal scroll container (`overflow-x: auto`) with fixed sticky left column (Patient Name / Clinic Name) to prevent breaking screen layout.

### Modals, Dialogs & Side Drawers
- **Desktop:** Centered modal card (`max-width: 560px` standard, `720px` large).
- **Mobile (<640px):** Modal expands to full-screen container (`width: 100%`, `height: 100%`) or bottom sheet with pinned top header and bottom action bar.

---

## Touch Targets & Interaction Accessibility

- **Desktop Click Targets:** Minimum height `36px` (`py-2`).
- **Mobile/Tablet Touch Targets:** Minimum height `44px` (`py-3`) for all buttons, select boxes, and list items.
- **Spacing Between Touch Controls:** Minimum `8px` gap between adjacent interactive buttons to prevent accidental tap errors.

---

## Mandatory Responsive Testing Matrix

Before approving any UI refactoring task, perform testing across these environments:

- [ ] **4K Monitor (1920px+):** Confirm layout is centered and does not stretch unnaturally.
- [ ] **Standard Laptop (1366px - 1440px):** Verify baseline workspace density.
- [ ] **Tablet View (768px - 1024px):** Confirm sidebar collapses gracefully and grid cards adjust to 2-3 columns.
- [ ] **Mobile View (360px - 480px):** Verify zero horizontal scroll on body element, full-width touch buttons, and readable text at 100% zoom.
- [ ] **Browser Zoom (Up to 200%):** Confirm text scales without overlapping adjacent elements.
