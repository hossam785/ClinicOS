# ClinicOS Layout Standards

**Version:** 1.0  
**Status:** Official Single Source of Truth  
**Target:** Application Shell, Workspaces, and Module Layout Architecture  

---

## Executive Summary

This document defines the official Layout Standards for the entire ClinicOS platform. Every page, workspace, dashboard, module, form, modal, and administration screen MUST comply with this layout architecture specification to ensure spatial predictability, fluid responsiveness, and zero visual regression.

---

## Table of Contents

1. [Standard Page Anatomy](#standard-page-anatomy)
2. [Responsive Breakpoint Grid System](#responsive-breakpoint-grid-system)
3. [Layout Specifications](#layout-specifications)
   - [Application Shell](#application-shell)
   - [Authentication Layout](#authentication-layout)
   - [Dashboard Layout](#dashboard-layout)
   - [Workspace Layout](#workspace-layout)
   - [Page Layout & Module Layout](#page-layout--module-layout)
   - [Settings Layout](#settings-layout)
   - [Platform Control Layout](#platform-control-layout)
   - [AI Assistant Layout](#ai-assistant-layout)
   - [Sync Center Layout](#sync-center-layout)
   - [Reports Layout](#reports-layout)
   - [Tables Layout & Form Layout](#tables-layout--form-layout)
   - [Dialog Layout & Drawer Layout](#dialog-layout--drawer-layout)
   - [Empty, Loading & Error Layouts](#empty-loading--error-layouts)
4. [Breakpoint Behavioral Matrix](#breakpoint-behavioral-matrix)
5. [Layout Governance & Audit Rules](#layout-governance--audit-rules)

---

## Standard Page Anatomy

Every functional view in ClinicOS adheres to a strict 7-tier anatomical structure:

```
┌────────────────────────────────────────────────────────────────────────┐
│ Global Application Shell                                               │
│ ┌───────────────┬────────────────────────────────────────────────────┐ │
│ │ Sidebar Nav   │ Top Navigation Header                              │ │
│ │               ├────────────────────────────────────────────────────┤ │
│ │               │ Page Header (Title + Subtitle + Action Trigger)    │ │
│ │               ├────────────────────────────────────────────────────┤ │
│ │               │ Action Toolbar (Search + Filters + Bulk Controls)  │ │
│ │               ├────────────────────────────────────────────────────┤ │
│ │               │ Main Content Area (Cards / Data Tables / Grids)   │ │
│ │               ├────────────────────────────────────────────────────┤ │
│ │               │ Primary Actions Area                               │ │
│ │               ├────────────────────────────────────────────────────┤ │
│ │               │ Footer Area (Status / Pagination - Optional)       │ │
│ └───────────────┴────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Responsive Breakpoint Grid System

ClinicOS establishes strict spatial boundaries across 8 key screen resolution targets:

| Breakpoint | Target Width | Max Container Width | Column Grid | Margin / Padding |
| :--- | :--- | :--- | :--- | :--- |
| **4K / Wide** | `1920px+` | `1800px` (centered) | 12 Columns | `32px` |
| **Desktop XL**| `1600px` | `1520px` | 12 Columns | `24px` |
| **Desktop LG**| `1440px` | `1380px` | 12 Columns | `24px` |
| **Laptop Standard**| `1280px` | `1220px` | 12 Columns | `20px` |
| **Tablet Landscape**| `1024px` | `980px` | 6 Columns | `16px` |
| **Tablet Portrait**| `768px` | `100%` | 4 Columns | `16px` |
| **Mobile Large** | `480px` | `100%` | 2 Columns | `12px` |
| **Mobile Small** | `360px` | `100%` | 1 Column | `8px` |

---

## Layout Specifications

### Application Shell
- **Purpose:** Root viewport wrapper hosting global layout providers, language direction (`dir="ltr"` / `dir="rtl"`), and notification toast layers.
- **Scrolling:** Viewport locked `height: 100vh`, `overflow: hidden`. Content scrolling occurs strictly within main sub-containers.

### Authentication Layout
- **Purpose:** Scaffolding for Login, Password Reset, and Clinic Onboarding.
- **Structure:** Centered glassmorphic card container (`max-width: 440px`), full-viewport background (`min-height: 100vh`), centered vertically and horizontally.

### Dashboard Layout
- **Purpose:** Main clinical environment hosting Sidebar, Top Navigation, and active module outlets.
- **Sidebar Rules:** Fixed `260px` width (expanded) or `72px` (collapsed).
- **Content Rules:** Dynamic flex container `flex: 1`, independent vertical scroll area.

### Workspace Layout (Platform Control, AI Assistant, Sync Center)
- **Purpose:** Specialized operational control rooms requiring full-bleed interface density.
- **Platform Control Layout:** Standalone full-width `100vh` layout in LTR, with top status bar, 6-card metrics row, horizontal pill tab bar, and responsive table container.
- **AI Assistant Layout:** Split panel layout — Left chat conversation thread (`flex: 1`), Right medical source reference sidebar (`340px` fixed width).
- **Sync Center Layout:** Telemetry header + 3-card node status grid + real-time sync queue monitor data grid.

### Reports & Tables Layout
- **Structure:** Fixed toolbar top (`56px` height) containing filter selects, search input, and export buttons. Body contains full-height virtualized data table with sticky header (`position: sticky`, `top: 0`).

### Dialog & Drawer Layouts
- **Dialog Modal:** Centered dialog container (`max-width: 560px` standard, `720px` large). Z-index level `var(--z-modal)`.
- **Drawer Layout:** Right-anchored side drawer (`width: 420px` standard). Used for side-by-side patient file review.

### Empty, Loading & Error Layouts
- **Empty State Layout:** Centered flex container (`min-height: 280px`), vertical alignment, `24px` spacing between icon, copy, and action button.
- **Loading Layout:** Skeleton grid mirroring active table column dimensions to prevent Cumulative Layout Shift (CLS).

---

## Breakpoint Behavioral Matrix

- **1920px+**: Expanded multi-column widgets, wide telemetry metrics.
- **1024px - 1440px**: Standard laptop view, sidebar fully visible.
- **768px**: Sidebar collapses to icon drawer overlay. Tables switch to horizontal scroll wrappers without breaking container boundaries.
- **360px - 480px**: Single column stacked layout. Full-width touch-friendly action buttons (`44px` height).

---

## Layout Governance & Audit Rules

1. Horizontal scrolling on the root page body is strictly forbidden.
2. Hardcoded pixel margins on page wrappers are prohibited; use CSS tokens (`var(--spacing-md)`).
3. Every layout modification must be verified against screen resolutions from `360px` to `1920px+`.
