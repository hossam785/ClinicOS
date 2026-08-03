# ClinicOS Iconography Standards

**Version:** 1.0  
**Status:** Official Single Source of Truth  
**Target:** Global Icon Library, Visual Geometry & Icon Accessibility  

---

## Executive Summary

This document defines the official Iconography Standards for the entire ClinicOS platform. Icons in ClinicOS serve a strict functional purpose: to reinforce visual scanning, communicate component affordance, signal system state, and guide user actions. Every icon used across navigation bars, dashboards, action toolbars, status badges, forms, and dialogs must conform to this specification.

---

## Table of Contents

1. [Global Icon Library Specification](#global-icon-library-specification)
2. [Icon Geometry & Sizing Standards](#icon-geometry--sizing-standards)
3. [Icon Functional Categories](#icon-functional-categories)
   - [Navigation & Sidebar Icons](#navigation--sidebar-icons)
   - [Dashboard & Metric Icons](#dashboard--metric-icons)
   - [Action & CRUD Icons](#action--crud-icons)
   - [Status & Feedback Icons](#status--feedback-icons)
   - [Domain Module Icons (AI, Sync, Platform, Reports)](#domain-module-icons-ai-sync-platform-reports)
4. [Icon Usage & Style Rules](#icon-usage--style-rules)
5. [Accessibility & Screen Reader Rules](#accessibility--screen-reader-rules)
6. [Icon Anti-Patterns & Common Mistakes](#icon-anti-patterns--common-mistakes)

---

## Global Icon Library Specification

- **Approved Library:** `lucide-react` (Strict Single Source of Truth).
- **Style:** Clean 2px stroke outline SVG icons.
- **Prohibition:** Introducing second icon packages (FontAwesome, Material Icons, Bootstrap Icons) or unoptimized inline SVG blobs is strictly forbidden.

---

## Icon Geometry & Sizing Standards

Icons must adhere to 5 standardized dimensional tiers:

| Tier | Dimensions | Stroke Width | Target Placement & Usage |
| :--- | :--- | :--- | :--- |
| **Micro** | `12px` (`w-3 h-3`) | `2px` | Kbd shortcuts, inline status indicators |
| **Small / Inline** | `16px` (`w-4 h-4`) | `2px` | Buttons, navigation tabs, input left icons, table actions |
| **Medium / Standard**| `20px` (`w-5 h-5`) | `2px` | Card headers, sidebar nav links, search inputs, modal titles |
| **Large / Featured** | `24px` (`w-6 h-6`) | `1.75px` | Page title icon badges, metric KPI headers |
| **Display / Hero** | `48px` (`w-12 h-12`)| `1.5px` | Empty state illustrations, error state screens |

---

## Icon Functional Categories

### Navigation & Sidebar Icons
- `Building2` (Clinics), `Users` (Patients), `Calendar` (Appointments), `FileText` (Medical Records), `DollarSign` (Financials), `Sliders` (Settings), `Activity` (Telemetry).

### Dashboard & Metric Icons
- `Building2` (Total Clinics), `Cpu` (Desktop PCs), `Key` (Licenses), `Zap` (System Health), `TrendingUp` (Revenue Trend).

### Action & CRUD Icons
- `Plus` / `CirclePlus` (Create), `PenLine` (Edit), `Trash2` (Delete), `Eye` (View Details), `Search` (Search), `Filter` (Filter), `Download` (Export), `Upload` (Import), `RefreshCw` (Refresh Sync).

### Status & Feedback Icons
- `CheckCircle2` (Success / Active), `AlertTriangle` (Warning / Suspended), `XCircle` (Error / Lockout), `Info` (Information / Telemetry).

### Domain Module Icons
- `Bot` / `Sparkles` (AI Assistant), `RefreshCw` / `Wifi` (Sync Engine), `ShieldCheck` (Platform Control Panel), `BarChart3` (Reports).

---

## Icon Usage & Style Rules

1. **Icon Alignment:** Icons paired with text must align vertically center (`align-items: center`) with a `8px` (`--spacing-xs`) horizontal gap.
2. **Icon Stroke Consistency:** Standard stroke width must measure `2px`. Never mix solid filled icons with outline icons in the same list or component.
3. **Interactive Icon States:** Action icons must provide hover background highlighting (`padding: 4px`, `border-radius: 4px`, `hover:bg-slate-800`).

---

## Accessibility & Screen Reader Rules

1. **Decorative Icons:** Icons accompanied by visible text labels must include `aria-hidden="true"` to prevent duplicate screen reader announcements.
2. **Icon-Only Action Buttons:** Buttons containing only an icon (e.g., Close `X`, Edit Pen) MUST include an explicit `aria-label="Descriptive Action Name"` attribute.

---

## Icon Anti-Patterns & Common Mistakes

1. **Mixing Icon Libraries:** Importing icons from multiple libraries within one view.
2. **Unbounded Sizing:** Setting non-standard icon sizes like `w-[19px]` or `height: 23px`.
3. **Missing Touch Targets:** Creating icon-only buttons smaller than `36px x 36px` on desktop or `44px x 44px` on tablet/mobile.
