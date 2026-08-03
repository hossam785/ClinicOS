# ClinicOS Spacing System

**Version:** 1.0  
**Status:** Official Single Source of Truth  
**Target:** Spatial Architecture, Layout Padding, Margins & Component Geometry  

---

## Executive Summary

This document defines the official Spacing System for the entire ClinicOS platform. Spacing serves as a functional foundation of the design system, establishing spatial hierarchy, element grouping, cognitive clarity, and visual rhythm. Every page, workspace, form, table, dialog, and component must adhere strictly to these spatial tokens.

---

## Table of Contents

1. [Governance & Alignment](#governance--alignment)
2. [The Unified Spacing Scale](#the-unified-spacing-scale)
3. [Component & Container Spacing Categories](#component--container-spacing-categories)
   - [Global Layout Spacing & Page Margins](#global-layout-spacing--page-margins)
   - [Section Spacing](#section-spacing)
   - [Card Padding & Content Spacing](#card-padding--content-spacing)
   - [Form & Input Group Spacing](#form--input-group-spacing)
   - [Button Group Spacing](#button-group-spacing)
   - [Table Padding & Cell Geometry](#table-padding--cell-geometry)
   - [Sidebar & Navigation Spacing](#sidebar--navigation-spacing)
   - [Toolbar & Breadcrumb Spacing](#toolbar--breadcrumb-spacing)
   - [Modal, Drawer & Dialog Spacing](#modal-drawer--dialog-spacing)
   - [Tabs & Widget Spacing](#tabs--widget-spacing)
   - [State Container Spacing (Empty, Error, Loading)](#state-container-spacing-empty-error-loading)
4. [Responsive Scaling Matrix](#responsive-scaling-matrix)
5. [Common Spatial Mistakes & Anti-Patterns](#common-spatial-mistakes--anti-patterns)

---

## Governance & Alignment

This document directly aligns with:
- `docs/ui/01-DESIGN-PRINCIPLES.md` (Principle 6: Whitespace is Functional)
- `docs/ui/02-UI-RULES.md` (Layout & Component Rules)
- `docs/ui/03-COMPONENT-STANDARDS.md` (Component Anatomy)
- `docs/ui/04-LAYOUT-STANDARDS.md` (Grid & Breakpoints)

Arbitrary hardcoded pixel margins (e.g., `margin-top: 17px`) are strictly forbidden. All layout geometry must reference standard CSS variables mapped from `src/design-system/styles/tokens.css`.

---

## The Unified Spacing Scale

ClinicOS utilizes a base 4px/8px incremental spacing scale:

| Token Name | Value | Target Applications & Usage |
| :--- | :--- | :--- |
| `--spacing-3xs` | `2px` | Micro gaps, sub-pixel borders, badge inline badges |
| `--spacing-xxs` | `4px` | Label-to-input gap, icon-to-text gap, dense table padding |
| `--spacing-xs`  | `8px` | Small element gap, inline button gap, form field vertical gap |
| `--spacing-sm-8`| `12px` | Compact container padding, list item spacing |
| `--spacing-md`  | `16px` | Standard card padding, toolbar button spacing, grid row gap |
| `--spacing-md-20`| `20px` | Table cell horizontal padding, dashboard widget gap |
| `--spacing-lg`  | `24px` | Modal container padding, section header bottom margin |
| `--spacing-xl`  | `32px` | Main page container margin, empty state vertical padding |
| `--spacing-xxl` | `48px` | Major section division gap, hero container padding |
| `--spacing-3xl` | `64px` | Large workspace section separator |
| `--spacing-4xl` | `96px` | Viewport boundary vertical padding |
| `--spacing-5xl` | `128px`| Outer landing/booking portal maximum section gap |

---

## Component & Container Spacing Categories

### Global Layout Spacing & Page Margins
- **Purpose:** Establishes outer margin bounds around active view contents.
- **Min / Rec / Max:** `16px` (Mobile) / `24px` (Laptop) / `32px` (4K Displays).
- **Rule:** Page padding must scale fluidly via responsive breakpoints without breaking internal grid alignment.

### Section Spacing
- **Purpose:** Separates logical form groups, analytics sections, and workflow blocks.
- **Min / Rec / Max:** `16px` / `24px` / `48px`.

### Card Padding & Content Spacing
- **Card Padding:** `16px` standard, `20px` for large dashboard cards.
- **Internal Content Gap:** `12px` between header, body, and action footer.

### Form & Input Group Spacing
- **Label to Input:** `4px` (`--spacing-xxs`).
- **Input Field Vertical Gap:** `16px` (`--spacing-md`).
- **Error Message Offset:** `4px` directly below input box.

### Button Group Spacing
- **Horizontal Button Gap:** `8px` (`--spacing-xs`) for secondary actions, `12px` between primary and cancel controls.

### Table Padding & Cell Geometry
- **Table Cell Padding:** `12px 16px` (`py-3 px-4`).
- **Row Height:** Standard data row `44px`, Compact table row `36px`.

### Sidebar & Navigation Spacing
- **Item Padding:** `10px 16px` (`0.625rem 1rem`).
- **Icon to Text Offset:** `12px`.
- **Category Header Offset:** `16px` top margin, `8px` bottom margin.

### Modal, Drawer & Dialog Spacing
- **Modal Header / Body / Footer Padding:** `24px` (`--spacing-lg`).
- **Drawer Side Margin:** `24px` content padding.

### State Container Spacing (Empty, Error, Loading)
- **Empty State Container:** Minimum `280px` height, centered with `16px` gap between icon, title, description, and action button.

---

## Responsive Scaling Matrix

| Layout Zone | Large Displays (1920px+) | Laptop (1280px - 1440px) | Tablet (768px - 1024px) | Mobile (360px - 480px) |
| :--- | :--- | :--- | :--- | :--- |
| **Page Outer Padding** | `32px` | `24px` | `16px` | `12px` |
| **Grid Column Gap**    | `24px` | `20px` | `16px` | `12px` |
| **Card Padding**       | `24px` | `16px` | `16px` | `12px` |
| **Form Field Spacing** | `16px` | `16px` | `12px` | `12px` |

---

## Common Spatial Mistakes & Anti-Patterns

1. **Hardcoded Ad-Hoc Pixel Margins:** Using arbitrary inline styles like `margin-top: 13px` instead of design token values (`var(--spacing-xs)`).
2. **Asymmetric Container Padding:** Setting uneven left/right padding (`padding: 10px 25px 12px 5px`) without structural justification.
3. **Double Spacing Collision:** Placing a container with `margin-bottom: 24px` directly above a sibling with `margin-top: 24px`, creating an unintended 48px gap.
