# ClinicOS Color System Specification

**Version:** 1.0  
**Status:** Official Single Source of Truth  
**Target:** Visual Palette, Semantic Color Tokens, WCAG AA Accessibility  

---

## Executive Summary

This document defines the official Color System for the entire ClinicOS platform. Color in ClinicOS is functional, predictable, and semantic. Color must communicate state, status, hierarchy, and affordance — never random decorative distraction. Every component, module, badge, table, and view must adhere to this color specification.

---

## Table of Contents

1. [Governance & System Tokens](#governance--system-tokens)
2. [Color Token Hierarchy & Scale](#color-token-hierarchy--scale)
3. [Semantic Color Roles](#semantic-color-roles)
4. [Theme Behavior Matrix (Light vs. Dark)](#theme-behavior-matrix-light-vs-dark)
5. [Specific Color Category Specifications](#specific-color-category-specifications)
   - [Brand & Primary Colors](#brand--primary-colors)
   - [Secondary & Neutral Colors](#secondary--neutral-colors)
   - [Background, Surface & Elevated Surfaces](#background-surface--elevated-surfaces)
   - [Borders, Dividers & Outlines](#borders-dividers--outlines)
   - [Typography & Icon Colors](#typography--icon-colors)
   - [Interactive States (Hover, Active, Focus, Selection)](#interactive-states-hover-active-focus-selection)
   - [Status Colors (Success, Warning, Danger, Info)](#status-colors-success-warning-danger-info)
   - [Domain-Specific Colors (Tables, Badges, Charts, Notifications)](#domain-specific-colors-tables-badges-charts-notifications)
6. [WCAG AA Contrast & Accessibility Standards](#wcag-aa-contrast--accessibility-standards)
7. [Color Anti-Patterns & Common Mistakes](#color-anti-patterns--common-mistakes)

---

## Governance & System Tokens

The ClinicOS Color System is built upon design tokens defined in `src/design-system/styles/tokens.css` and system CSS files. Direct usage of arbitrary hex codes (`#1a2b3c`) or unstandardized RGB values inside module components is strictly forbidden.

---

## Color Token Hierarchy & Scale

### Brand & Primary Palette
- **Primary 500 (`#1066cc` Light / `#3b82f6` Dark):** Main brand call-to-action color.
- **Primary Hover (`#0c4fa0` Light / `#60a5fa` Dark):** Hover interaction state.
- **Primary Surface (`rgba(59, 130, 246, 0.1)`):** Subtitle backgrounds, active tab highlights.

### Neutral Slate Scale
- **Neutral 950 (`#020617`):** Dark theme baseline background.
- **Neutral 900 (`#0f172a`):** Card & table surface container background.
- **Neutral 800 (`#1e293b`):** Borders, dividers, secondary containers.
- **Neutral 600 (`#64748b`):** Muted metadata text, passive icons.
- **Neutral 400 (`#94a3b8`):** Subtitles, table header text.
- **Neutral 100 (`#f8fafc`):** High-contrast body text, primary heading text.

### Semantic Status Scale
- **Success (`#10b981` / `#34d399`):** Completed sync, active tenant, valid record.
- **Warning (`#f59e0b` / `#fbbf24`):** Pending approvals, storage warnings, license expiration.
- **Danger (`#ef4444` / `#fb7185`):** Account lockouts, critical system errors, delete triggers.
- **Info (`#0ea5e9` / `#38bdf8`):** Informational banners, system telemetry notes.

---

## Semantic Color Roles

| Semantic Role | Color Mapping | Allowed Usage & Context |
| :--- | :--- | :--- |
| **Primary Action** | `--color-primary` | Submit buttons, main CTA, active tab indicator |
| **Secondary Action** | `--color-secondary` | Cancel buttons, secondary outline buttons, filter pills |
| **Approved / Active**| `--color-success` | Active clinic status badge, optimal sync dot, success toast |
| **Pending / Review** | `--color-warning` | Pending clinic registration, queue items, lock warning |
| **Critical / Lock** | `--color-danger` | Account locked out badge, delete action, failed auth |
| **System Info** | `--color-info` | Telemetry version badge, audit entry context |
| **Passive Muted** | `--color-text-muted` | Field help text, timestamp labels, table th headers |

---

## Theme Behavior Matrix (Light vs. Dark)

| Interface Layer | Light Theme | Dark Theme |
| :--- | :--- | :--- |
| **Base Canvas** | `#f8fafc` (`--color-bg-base`) | `#020617` (`bg-slate-950`) |
| **Surface Card** | `#ffffff` (`--color-bg-surface`) | `#0f172a` (`bg-slate-900`) |
| **Elevated Modal** | `#ffffff` (Shadow `0 10px 25px`) | `#1e293b` + `border: rgba(255,255,255,0.1)` |
| **Primary Text** | `#0f172a` (`--color-text-main`) | `#f8fafc` (`text-slate-100`) |
| **Border Divider** | `#e2e8f0` (`--color-border`) | `#1e293b` (`border-slate-800`) |

---

## WCAG AA Contrast & Accessibility Standards

1. **Body Text Contrast:** Must achieve at least `4.5:1` contrast ratio against underlying background (`#f8fafc` on `#020617` = `18.5:1`).
2. **Large Headings & UI Icons:** Must achieve at least `3.0:1` contrast ratio.
3. **Interactive Control Focus:** Focus outlines must render a high-contrast `--color-primary` focus ring (`3px` glow or `2px` solid border).
4. **Color Independence:** Status indicators (Success/Warning/Danger) must pair colored badges with text or icons to ensure readability for color-blind users.

---

## Color Anti-Patterns & Common Mistakes

1. **Hardcoded Color Hues:** Using inline hex values like `<div style={{ color: '#ff0000' }}>` instead of semantic status classes (`text-rose-400` or `--color-danger`).
2. **Decorative Color Overuse:** Coloring card headers or table backgrounds with bright primary colors instead of maintaining neutral dark backgrounds.
3. **Low Contrast Muted Text:** Using light grey text (`#475569`) on dark backgrounds (`#0f172a`), failing WCAG AA contrast rules.
