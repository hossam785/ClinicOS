# Doctor Financial Accounts UI/UX Design Specification (DOCTOR_FINANCIAL_ACCOUNTS_UI_UX.md)

This document establishes the official UI/UX design specifications for the **Doctor Financial Accounts Module** (Module-010) of ClinicOS. It defines the visual architecture, screen layouts, visual hierarchies, design DNA tokens, component inventories, accessibility standards, and desktop-first responsive strategies.

---

## 1. Executive Summary & Design Principles

The Doctor Financial Accounts interface is designed to provide complete clarity, financial transparency, and operational efficiency for both Clinic Managers and Doctors.

### Design Principles
1. **Zero Emojis Policy**: Exclusively use `lucide-react` SVG icons for all status badges, metrics, and navigation elements.
2. **Design DNA Compliance**: Built on ClinicOS `DESIGN_DNA.md` (Inter typography, Slate background, Indigo primary accents, Emerald success badges, Amber pending badges, Rose alert badges).
3. **Role-Tailored Screen Scoping**:
   - **Clinic Manager View**: Full administrative control, settlement generation wizard, payment disbursement modal, approval actions.
   - **Doctor Self-Service Portal View**: Clean, read-only personal financial portal displaying earned commission, paid amounts, unsettled balance, and downloadable PDF statements.
4. **Desktop-First Layout**: Primary layout optimized for 1440px+ desktop workstations, with responsive flex and grid adaptation for laptops, tablets, and mobile devices.

---

## 2. Screen Architecture & Navigation Hierarchy

```
[Main Navigation Sidebar]
   │
   ├── [Financial Dashboard] (/dashboard/doctor-financials)
   │      ├── KPI Summary Cards (Total Earnings, Outstanding, Paid Amount, Pending)
   │      ├── Real-Time Monthly Earnings Chart
   │      └── Quick Action Toolbar (Create Settlement, Export Report)
   │
   ├── [Settlement Roster Directory] (/dashboard/doctor-financials/settlements)
   │      ├── Multi-Criteria Filter Bar (Doctor, Status, Date Bounds, Search)
   │      ├── Sortable Data Table (STL-YYYYMM-XXXXX)
   │      └── Pagination Controls
   │
   ├── [Settlement Details View] (/dashboard/doctor-financials/settlements/:id)
   │      ├── Revenue & Share Calculation Cards
   │      ├── Completed Visit Line Items Table
   │      ├── Disbursement History Log
   │      └── Audit Trail History Timeline
   │
   ├── [Doctor Self-Service Portal] (/portal/doctor-financials)
   │      ├── Personal Balance Summary
   │      ├── My Settlements Roster (Read-Only)
   │      └── PDF Statement Download Action
   │
   └── [Financial Reports & Analytics] (/dashboard/doctor-financials/reports)
          ├── Monthly & Annual Earnings Summary
          ├── Doctor Performance & Commission Comparison
          └── Revenue Share Distribution Charts
```

---

## 3. Screen Layout Specifications

### Screen 1: Financial Dashboard (`/dashboard/doctor-financials`)
- **Header**: Page title "Doctor Financial Accounts", breadcrumb navigation, "Create Settlement" primary action button (`Plus` Lucide icon), and "Export Summary" secondary button (`Download` Lucide icon).
- **KPI Summary Cards Grid (4 Columns)**:
  1. **Total Doctor Earnings**: Emerald card with `TrendingUp` icon, total realized earnings amount.
  2. **Total Clinic Share**: Indigo card with `Building2` icon, total clinic commission retained.
  3. **Outstanding Balance**: Amber card with `Clock` icon, total pending unsettled doctor balance.
  4. **Paid Disbursements**: Slate card with `CheckCircle2` icon, total payouts completed.
- **Main Content Area (Split Grid)**:
  - Left Panel (2/3 width): Interactive monthly earnings breakdown chart (`recharts` area chart).
  - Right Panel (1/3 width): Pending Settlement Action List with quick "Review" and "Pay" buttons.

---

### Screen 2: Settlement Directory Roster (`/dashboard/doctor-financials/settlements`)
- **Search & Filter Bar**:
  - Full-text search input with `Search` icon (searches doctor name, settlement code `STL-...`, notes).
  - Dropdown filters for `Doctor`, `Status` (`DRAFT`, `PENDING_REVIEW`, `APPROVED`, `PAID`, `CLOSED`, `ARCHIVED`), `Payment Method`, and `Date Range`.
- **Data Table Columns**:
  1. `Settlement Code` (e.g., `STL-202607-00012` with link to details).
  2. `Doctor Name` (Avatar + Name + Specialty badge).
  3. `Settlement Period` (`2026-07-01` to `2026-07-31`).
  4. `Visits` (Completed visit count pill).
  5. `Gross Revenue` (Formatted currency).
  6. `Doctor Share` (Formatted currency).
  7. `Outstanding` (Amber text if > 0).
  8. `Status Badge` (Custom styled status pill).
  9. `Actions` (More options dropdown `MoreVertical`).

---

### Screen 3: Settlement Details View (`/dashboard/doctor-financials/settlements/:id`)
- **Header Banner**: Settlement code `STL-202607-00012`, status badge, creation date, and action toolbar (`Approve`, `Pay`, `Archive`, `Download PDF`).
- **Financial Calculation Summary Grid**:
  - `Gross Revenue`: $35,000.00 EGP
  - `Compensation Rule`: 60% Revenue Percentage
  - `Doctor Share`: $21,000.00 EGP
  - `Clinic Share`: $14,000.00 EGP
  - `Amount Paid`: $10,000.00 EGP
  - `Outstanding Balance`: $11,000.00 EGP
- **Completed Visit Line Items Table**: Displays individual appointment date, patient name, treatment, gross fee, and doctor share breakdown.
- **Disbursement History Log**: List of all partial/full payments recorded with reference numbers, payment methods, and timestamps.

---

### Screen 4: Payment Disbursement Modal (`DoctorPaymentModal`)
- **Dialog Title**: "Record Settlement Payment"
- **Form Controls**:
  1. `Settlement Code` (Read-only summary).
  2. `Outstanding Balance` (Read-only amber badge).
  3. `Payment Amount` (Numeric input, auto-validates `amountPaid <= outstandingBalance`).
  4. `Payment Date` (Date picker, defaults to today `YYYY-MM-DD`).
  5. `Payment Method` (Select: `BANK_TRANSFER`, `CASH`, `CHEQUE`, `CREDIT_CARD`).
  6. `Reference Code` (Text input for bank transfer / cheque transaction ID).
  7. `Notes` (Textarea for reconciliation notes).
- **Actions**: "Cancel" button and "Record Payment" primary button (`Check` icon).

---

### Screen 5: Doctor Self-Service Portal View (`/portal/doctor-financials`)
- **Header**: "My Financial Account", welcome text for doctor.
- **Personal KPI Summary**:
  - `Earned This Month`: Realized earnings for current month.
  - `Unsettled Balance`: Earned money awaiting payout.
  - `Last Disbursed Payment`: Date and amount of last payout.
- **Settlement Statement List (Read-Only)**: Doctor's historical settlements with "Download PDF Statement" button.

---

## 4. Component Inventory & Design Tokens

### Status Badge Color Matrix

| Status Code | Badge Label | Background Class | Text Class | Border Class | Lucide Icon |
| --- | --- | --- | --- | --- | --- |
| `DRAFT` | Draft | `bg-slate-100` | `text-slate-700` | `border-slate-300` | `FileText` |
| `PENDING_REVIEW` | Pending Review | `bg-amber-50` | `text-amber-700` | `border-amber-200` | `Clock` |
| `APPROVED` | Approved | `bg-blue-50` | `text-blue-700` | `border-blue-200` | `CheckCircle` |
| `PAID` | Paid | `bg-emerald-50` | `text-emerald-700` | `border-emerald-200` | `CreditCard` |
| `CLOSED` | Closed | `bg-slate-100` | `text-slate-800` | `border-slate-400` | `CheckCircle2` |
| `ARCHIVED` | Archived | `bg-rose-50` | `text-rose-700` | `border-rose-200` | `Archive` |

---

## 5. Accessibility Specification (WCAG 2.1 AA)

1. **Keyboard Navigation**:
   - `Tab` / `Shift+Tab`: Logical focus order through form controls, table rows, and action buttons.
   - `Esc`: Closes modals (`DoctorPaymentModal`, `SettlementReviewModal`).
   - `Ctrl+Enter`: Submits active forms.
2. **Focus Management**: Explicit visible focus rings on all interactive elements (`focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`).
3. **Screen Reader Compatibility**:
   - `aria-live="polite"` on real-time balance calculations.
   - `aria-describedby` linking input fields to validation error strings.
4. **Color Contrast**: All text elements maintain a minimum contrast ratio of `4.5:1` against their backgrounds.

---

## 6. Desktop-First Responsive Layout Strategy

- **Desktop (1440px+)**: Multi-column dashboard grid, full data tables, side-by-side analytics panels.
- **Laptop (1024px - 1439px)**: Responsive container scaling, 2-column KPI grid.
- **Tablet (768px - 1023px)**: Stacked KPI grid, scrollable data table container, full-screen modals.
- **Mobile (< 768px)**: Single column layout, card-based settlement roster replacing wide data tables.

---

## 7. Reserved Future UI Extensions (V2 Hooks)

1. **Payroll Summary Card**: Displaying base salary, commission earnings, and payroll status.
2. **Tax Deduction Line Item**: Highlighting withholding tax deductions.
3. **Direct Bank Payout Action**: "Instant Bank Transfer" button for automated EFT payout.
4. **Cryptographic Signature Badge**: "Verified Digital Signature" badge on settlement statements.

---

## 8. CHANGELOG & Compliance Statement

This UI/UX specification has been verified against all ClinicOS standards (`DESIGN_DNA.md`, `DESIGN_SYSTEM.md`, `CODING_STANDARDS.md`).
