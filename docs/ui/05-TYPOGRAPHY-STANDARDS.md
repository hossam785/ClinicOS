# ClinicOS Typography Standards

**Version:** 1.0  
**Status:** Official Single Source of Truth  
**Target:** Font Architecture, Type Scale, Hierarchy & Text Accessibility  

---

## Executive Summary

This document defines the official Typography Standards for the entire ClinicOS platform. Typography is the primary information design tool in ClinicOS. Because users read clinical records, telemetry, and administrative data much more than they click controls, typography must establish immediate visual hierarchy, legibility, and effortless scannability.

---

## Table of Contents

1. [Font Family Architecture & Load Strategy](#font-family-architecture--load-strategy)
2. [Unified Typography Hierarchy](#unified-typography-hierarchy)
3. [Type Scale & Specification Matrix](#type-scale--specification-matrix)
4. [Functional Typography Categories](#functional-typography-categories)
   - [Display & Page Titles (H1, H2, H3, H4)](#display--page-titles-h1-h2-h3-h4)
   - [Form & Input Typography](#form--input-typography)
   - [Data Display & Table Typography](#data-display--table-typography)
   - [Navigation & Interface Element Typography](#navigation--interface-element-typography)
   - [Status, Metadata & Micro Typography](#status-metadata--micro-typography)
5. [Accessibility & Readability Standards](#accessibility--readability-standards)
6. [Common Typography Anti-Patterns](#common-typography-anti-patterns)

---

## Font Family Architecture & Load Strategy

ClinicOS employs a dual-font architecture defined in `src/design-system/styles/tokens.css`:

```css
--font-primary: 'Inter', system-ui, -apple-system, sans-serif;
--font-heading: 'Outfit', system-ui, -apple-system, sans-serif;
```

- **Primary Body Font (`Inter`):** Used for UI controls, inputs, body copy, tables, badges, and system metadata. Optimized for screen legibility at small sizes (`10px - 14px`).
- **Heading Font (`Outfit`):** Used for Display titles, H1 page headers, H2 section headings, and dashboard KPI values. Features modern geometric character shapes.
- **Font Loading:** Fonts are loaded via Google Fonts with `font-display: swap` to ensure immediate text rendering without layout shift (CLS).

---

## Unified Typography Hierarchy

All textual content across ClinicOS follows a single 9-tier hierarchy:

```
Display Titles (32px Bold - Outfit)
 ↓
H1 Page Header (24px Black/Bold - Outfit)
 ↓
H2 Section Title (20px Bold - Outfit)
 ↓
H3 Card & Dialog Title (18px Bold - Outfit)
 ↓
H4 Subsection Header (16px SemiBold - Inter)
 ↓
Body Large (16px Regular - Inter)
 ↓
Body Standard (14px Regular/Medium - Inter)
 ↓
Body Small & Captions (12px Regular/Medium - Inter)
 ↓
Micro Text & Badges (10px Bold - Inter)
```

---

## Type Scale & Specification Matrix

| Level | Size | Line Height | Weight | Font Family | Letter Spacing | Target Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display** | `32px` (`2rem`) | `1.2` | `700` (Bold) | `Outfit` | `-0.02em` | Metric KPI hero values |
| **H1** | `24px` (`1.5rem`) | `1.25` | `900` / `700` | `Outfit` | `-0.025em` | Page Header Title |
| **H2** | `20px` (`1.25rem`)| `1.3` | `700` (Bold) | `Outfit` | `-0.015em` | Section Title, Drawer Title |
| **H3** | `18px` (`1.125rem`)| `1.35` | `700` (Bold) | `Outfit` | `-0.01em` | Card Header, Dialog Header |
| **H4** | `16px` (`1rem`) | `1.4` | `600` (SemiBold)| `Inter` | `normal` | Sub-card header, Group title |
| **Body Large**| `16px` (`1rem`)| `1.5` | `400` (Regular) | `Inter` | `normal` | Empty state text, lead text |
| **Body** | `14px` (`0.875rem`)|`1.5` | `400` / `500` | `Inter` | `normal` | Table rows, Input text, Forms |
| **Caption** | `12px` (`0.75rem`)| `1.4` | `400` / `500` | `Inter` | `normal` | Helper text, Subtitles, Dates |
| **Micro** | `10px` (`0.625rem`)|`1.2` | `700` (Bold) | `Inter` | `0.05em` | Badges, Kbd key shortcuts |

---

## Functional Typography Categories

### Form & Input Typography
- **Input Text:** `14px` (`0.875rem`), weight `400`, color `--color-text-main`.
- **Form Label:** `14px` (`0.875rem`), weight `500` (Medium).
- **Placeholder Text:** `14px`, weight `400`, color `--color-text-muted` (`#94a3b8`).
- **Validation / Error Text:** `12px` (`0.75rem`), weight `500`, color `--color-danger`.

### Data Display & Table Typography
- **Table Column Header (`th`):** `11px` (`0.7rem`), weight `700` (Bold), uppercase, letter spacing `0.05em`, color `--color-text-muted`.
- **Table Data Cell (`td`):** `13px - 14px`, weight `400`, line-height `1.4`.

### Navigation & Interface Element Typography
- **Sidebar Nav Link:** `14px` (`0.875rem`), weight `500`. Active state weight `600`.
- **Navigation Tab Button:** `12px` (`0.75rem`), weight `600` (SemiBold).
- **Button Label:** `14px` (`0.875rem`), weight `600` (SemiBold).

---

## Accessibility & Readability Standards

1. **Minimum Text Size:** Body text must never drop below `12px` (`0.75rem`), except for uppercase micro badge labels (`10px`).
2. **WCAG AA Contrast:** Text colors must guarantee minimum `4.5:1` contrast ratio against backgrounds.
3. **Paragraph Width:** Paragraph containers should maintain max-width of `65ch` (characters) for optimal line scanning.
4. **Line Height:** Line-height for multi-line body text must measure at least `1.5` (`21px` for `14px` text).

---

## Common Typography Anti-Patterns

1. **Ad-Hoc Font Sizes:** Using arbitrary sizes like `font-size: 15px` instead of standard token sizes (`14px` or `16px`).
2. **Missing Line-Height:** Omitting line-height on headings, causing overlapping descenders.
3. **Low Contrast Muted Text:** Applying low-contrast grey text that violates WCAG AA standards.
