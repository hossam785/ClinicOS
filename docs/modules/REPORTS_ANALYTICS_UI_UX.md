# Reports & Analytics UI/UX Specification — ClinicOS

## 1. Executive Summary & Design System Integration

This document defines the complete UI/UX architecture, screen inventory layouts, visual components, chart visualization guidelines, accessibility standards, and state catalogs for the **Reports & Analytics Module (Module-012)**.

### Core Design DNA Alignment
- **Zero Emojis Policy**: Emojis are strictly forbidden across all UI screens, toasts, empty states, and code comments. Visual iconography strictly uses Lucide React SVG components (`BarChart3`, `TrendingUp`, `PieChart`, `Calendar`, `Download`, `Printer`, `FileText`, `Users`, `DollarSign`, `Activity`, `ShieldAlert`, `RefreshCw`, `SlidersHorizontal`, etc.).
- **Desktop-First Ergonomics**: Designed for high-density desktop displays (1920x1080 and 1440x900 viewports) with responsive adaptations for laptops (1024px) and tablets (768px).
- **Color-Blind Accessible Palettes**: Data visualizations utilize high-contrast, deuteranopia/protanopia-accessible color tokens.
- **Platform Owner Privacy Isolation Barrier**: Platform Owners (`SUPER_ADMIN`) entering `/dashboard/reports` are redirected or presented with an explicit isolation screen (`PLATFORM_ADMIN_REPORTS_RESTRICTED`).

---

## 2. Color Tokens & Typography Specification

### 2.1 Semantic Color Palette Tokens

| Semantic Token | Tailwind Class Equivalent | Hex Code | Usage Target |
| --- | --- | --- | --- |
| **Brand Primary** | `bg-indigo-600` / `text-indigo-600` | `#4F46E5` | Active tabs, primary buttons, trend lines |
| **Success / Positive** | `bg-emerald-500` / `text-emerald-600` | `#10B981` | Revenue gains, completed visits, positive margins |
| **Danger / Negative** | `bg-rose-500` / `text-rose-600` | `#F43F5E` | Expenses, cancellations, financial losses |
| **Warning / Caution** | `bg-amber-500` / `text-amber-600` | `#F59E0B` | Outstanding doctor settlements, no-shows |
| **Neutral Container** | `bg-slate-50` / `bg-slate-900` | `#F8FAFC` | Screen backdrop, card background, table rows |
| **Border Neutral** | `border-slate-200` / `border-slate-800` | `#E2E8F0` | Card borders, grid dividers |

### 2.2 Accessible Chart Color Sequences
- **Series 1 (Revenue / Primary)**: Indigo `#4F46E5`
- **Series 2 (Completed / Success)**: Emerald `#10B981`
- **Series 3 (Expenses / Secondary)**: Rose `#F43F5E`
- **Series 4 (Appointments / Accent)**: Amber `#F59E0B`
- **Series 5 (Neutral / Baseline)**: Slate `#64748B`

---

## 3. Screen Inventory & Wireframe Specifications

### 3.1 Screen 1: Executive Analytics Dashboard (`/dashboard/analytics`)

High-level decision-support dashboard displaying real-time KPI cards, time-series charts, and operational summary widgets.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ Reports & Analytics Dashboard                   [Filter: July 2026]  [Refresh] [Export]│
├────────────────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │
│ │Today Patients│ │Today Appts   │ │Today Revenue │ │Today Expense │ │Net Profit    │ │
│ │  18 (+12%)   │ │ 22 (14 Comp) │ │  $2,450.00   │ │   $450.00    │ │ $34,250 (70%)│ │
│ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ │
├────────────────────────────────────────────────────┬───────────────────────────────────┤
│ Revenue & Expense Trend (Line Chart)              │ Expense Distribution (Donut)      │
│ ┌────────────────────────────────────────────────┐ │ ┌───────────────────────────────┐ │
│ │ [~~~~~~~~~~~~~ Revenue (Indigo) ~~~~~~~~~~~~~] │ │ │   (O) Rent (35%)              │ │
│ │ [------------- Expenses (Rose) -------------] │ │ │       Supplies (43%)          │ │
│ └────────────────────────────────────────────────┘ │ └───────────────────────────────┘ │
├────────────────────────────────────────────────────┴───────────────────────────────────┤
│ Doctor Performance Summary Table                                                       │
│ Doctor Name           │ Specialization │ Consultations │ Revenue Generated │ Comp. Rate │
│ Dr. Alexander Fleming │ Cardiology     │ 78            │ $15,600.00        │ 91.7%      │
│ Dr. Elizabeth Blackwell│ Pediatrics    │ 64            │ $11,200.00        │ 94.1%      │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 3.2 Screen 2: Centralized Reports Center Catalog (`/dashboard/reports`)

Central hub providing access to all 7 report categories with search, filtering, and quick generation.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ Reports Center Catalog                                       [Search Reports...      ] │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ [All] [Executive] [Patient] [Appointment] [Doctor] [Financial] [Medical] [Operational]   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────┐ ┌──────────────────────────────────────┐ │
│ │ Financial Profit & Loss Statement    │ │ Doctor Productivity Summary          │ │
│ │ Category: FINANCIAL                  │ │ Category: DOCTOR                     │ │
│ │ Summary of revenue, expenses & profit│ │ Doctor volume, completion & revenue  │ │
│ │ [Generate Report]  [Quick Export]    │ │ [Generate Report]  [Quick Export]    │ │
│ └──────────────────────────────────────┘ └──────────────────────────────────────┘ │
│ ┌──────────────────────────────────────┐ ┌──────────────────────────────────────┐ │
│ │ Patient Acquisition & Demographics   │ │ Appointment Volume & Wait Times      │ │
│ │ Category: PATIENT                    │ │ Category: APPOINTMENT                │ │
│ │ New vs returning, age/gender cohorts │ │ Cancellation rates, average wait     │ │
│ │ [Generate Report]  [Quick Export]    │ │ [Generate Report]  [Quick Export]    │ │
│ └──────────────────────────────────────┘ └──────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 3.3 Screen 3: Report Viewer Inspector (`/dashboard/reports/view/:type`)

Detailed workspace for viewing, filtering, printing, and exporting a specific report type.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ <- Back to Reports Center | Monthly Profit and Loss Statement     [Print] [Export PDF] │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Applied Filters: Date Range [2026-07-01 to 2026-07-31] | Doctor [All] | Status [Finalized] │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ ┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────────┐          │
│ │ Gross Revenue         │ │ Total Expenses        │ │ Net Operating Profit  │          │
│ │ $48,500.00            │ │ $14,250.00            │ │ $34,250.00 (70.62%)   │          │
│ └───────────────────────┘ └───────────────────────┘ └───────────────────────┘          │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Detailed Breakdown Table                                                               │
│ Category Name       │ Account Code │ Transaction Count │ Invoiced Total │ Paid Amount  │
│ Consultation Fees   │ REV-101      │ 175               │ $48,500.00      │ $48,500.00   │
│ Facility Rent       │ EXP-201      │ 1                 │ $5,000.00       │ $5,000.00    │
│ Medical Supplies    │ EXP-202      │ 12                │ $6,250.00       │ $6,250.00    │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 3.4 Screen 4: Historical Report Snapshots (`/dashboard/reports/history`)

Registry of previously generated report snapshots with search, pagination, and metadata inspector.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ Historical Report Snapshots                                  [Search Snapshots...   ]  │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Report Number   │ Report Title                 │ Type       │ Generated Date │ User   │
│ RPT-202608-0001 │ Monthly Profit & Loss        │ FINANCIAL  │ 2026-08-01      │ Manager│
│ RPT-202607-0042 │ Doctor Performance Summary   │ DOCTOR     │ 2026-07-31      │ Manager│
├────────────────────────────────────────────────────────────────────────────────────────┤
│ Showing 1-20 of 124 snapshots                            [Prev]  Page 1 of 7  [Next]   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 3.5 Screen 5: Export Modal Dialog Component

Modal dialog for rendering and downloading report documents in PDF, Excel, or CSV formats.

```
┌────────────────────────────────────────────────────────────────────────┐
│ Export Report Document                                              [X]│
├────────────────────────────────────────────────────────────────────────┤
│ Report Title: Monthly Profit and Loss Statement - July 2026            │
│ Target Period: 2026-07-01 to 2026-07-31                                │
│                                                                        │
│ Select Export Format:                                                  │
│   (o) PDF Document (.pdf) - Vector printable report with headers       │
│   ( ) Excel Spreadsheet (.xlsx) - Raw multi-sheet table data           │
│   ( ) CSV File (.csv) - Plain comma-separated text values              │
│                                                                        │
│ Included Metadata Header:                                              │
│   - Clinic Name: City Care Clinic                                      │
│   - Generated By: John Manager (Clinic Manager)                        │
│   - Timestamp: 2026-08-01 01:45:00 UTC                                 │
├────────────────────────────────────────────────────────────────────────┤
│                                                [Cancel] [Download File]│
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. UI Component Inventory

1. **`ReportKpiCard`**: Container card displaying title, bold value, currency/unit, change indicator (% pill), and SVG icon.
2. **`ReportFilterHeader`**: Toolbar containing date range picker, doctor dropdown, category selector, refresh button, and export action.
3. **`ReportDataTable`**: Sortable, paginated data table with high contrast borders, zebra striping, and column formatting.
4. **`ReportChartContainer`**: Wrapper card with chart title, legend toggles, full-screen toggle, and SVG chart renderer.
5. **`OfflineReportBanner`**: Alert bar displayed when operating on local SQLite cache: *"Offline Analytical View — Computed from Local Cache"*.
6. **`ExportReportModal`**: Modal dialog for document format selection and download triggering.

---

## 5. Screen States Catalog

### 5.1 Loading Skeleton State
Displays animated shimmer skeletons (`animate-pulse bg-slate-200`) across KPI cards, chart boxes, and table rows while query promises resolve.

### 5.2 Empty Search / No Data State
Displays a clean empty state card with `FileText` SVG icon, heading *"No Analytical Data Found"*, and a secondary text *"Try adjusting your date range or filter criteria."* with a *"Reset Filters"* action button.

### 5.3 Error & Access Barrier State
- **Permission Denied (`RF-001`)**: Displays `ShieldAlert` SVG icon, title *"Access Restricted"*, and message *"Your user role does not have permission to view financial reports."*
- **Platform Owner Barrier (`PLATFORM_ADMIN_REPORTS_RESTRICTED`)**: Displays `ShieldAlert` icon, title *"Platform Owner Restriction"*, and message *"Platform Owners cannot access clinic operational or financial reports."*

---

## 6. WCAG 2.1 AA Accessibility Standards

1. **Keyboard Traversal**: Full keyboard accessibility (`Tab`, `Shift+Tab`, `Space`/`Enter`, `Esc`). Focus rings use high-contrast blue (`focus-visible:ring-2 focus-visible:ring-indigo-600`).
2. **ARIA Live Regions**: Dynamic filter updates update `aria-live="polite"` regions; error states trigger `role="alert"` (`aria-live="assertive"`).
3. **Click Target Bounds**: All filter selects, tabs, and export buttons have a minimum touch target area of **44x44px**.
4. **Color Contrast**: All text elements meet or exceed the **4.5:1** contrast ratio against backgrounds.

---

## 7. Quality Assurance Checklist

- [x] Zero Emojis Policy verified across all wireframes and component specs.
- [x] 5 primary screens (Analytics Dashboard, Reports Center, Report Viewer, History, Export Modal) designed.
- [x] Color tokens and accessible chart color sequences defined.
- [x] Platform Owner privacy barrier (`PLATFORM_ADMIN_REPORTS_RESTRICTED`) wireframed.
- [x] Loading skeleton, empty, error, and offline states specified.
- [x] WCAG 2.1 AA keyboard navigation, ARIA, and contrast rules documented.
- [x] CHANGELOG.md updated with TASK-114 entry.
