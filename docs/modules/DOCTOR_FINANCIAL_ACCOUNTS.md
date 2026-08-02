# Doctor Financial Accounts Module Requirements Analysis (DOCTOR_FINANCIAL_ACCOUNTS.md)

This document establishes the official business, functional, architectural, and financial requirements for the **Doctor Financial Accounts Module** (Module-010) of ClinicOS. It serves as the authoritative blueprint for database schemas, REST APIs, user workflows, UI/UX designs, and future payroll/accounting integrations.

---

## 1. Executive Summary & Business Goals

### Overview
The **Doctor Financial Accounts Module** manages all financial calculations, revenue sharing, commission tracking, and settlement disbursements between clinics and doctors. It provides automated financial tracking for solo-practitioner clinics, multi-doctor polyclinics, and multi-branch medical centers.

### Strategic Business Goals
1. **Automated Revenue Distribution**: Automatically calculate Doctor Share and Clinic Share based on predefined, tenant-configurable compensation rules for every completed appointment.
2. **Transparent Settlement Tracking**: Eliminate financial discrepancies between doctors and clinic management through immutable settlement statements and clear payment histories.
3. **Flexible Compensation Models**: Support revenue percentage sharing, fixed amount per visit, and hybrid compensation contracts.
4. **Tenant Financial Privacy**: Enforce strict SaaS privacy barriers preventing Platform Owners (`PLATFORM_ADMIN`) and unauthorized roles from accessing clinic financial records.
5. **Future Accounting & Payroll Integration**: Reserve clean architectural extension points for payroll automation, tax withholdings, bank transfer APIs, and accounting journal entries.

---

## 2. Compensation Models & Calculation Engine

Every doctor registered in ClinicOS is assigned a configurable compensation model within their clinic contract settings. The financial engine supports three core compensation structures:

### A. Revenue Percentage Model (Default)
The clinic and doctor share consultation and treatment revenues according to an agreed percentage split.

$$\text{Doctor Share} = \text{Gross Revenue} \times \left( \frac{\text{Doctor Percentage}}{100} \right)$$

$$\text{Clinic Share} = \text{Gross Revenue} - \text{Doctor Share}$$

*Example*:
- Appointment Gross Revenue: $1,000 \text{ EGP}$
- Doctor Split: $60\%$ / Clinic Split: $40\%$
- **Doctor Share**: $600 \text{ EGP}$
- **Clinic Share**: $400 \text{ EGP}$

### B. Fixed Amount Per Visit Model
The doctor earns a flat fee for every completed consultation, regardless of the patient fee collected by the clinic.

$$\text{Doctor Share} = \text{Fixed Fee Per Visit}$$

$$\text{Clinic Share} = \text{Gross Revenue} - \text{Fixed Fee Per Visit}$$

*Example*:
- Appointment Gross Revenue: $800 \text{ EGP}$
- Doctor Fixed Fee: $500 \text{ EGP}$
- **Doctor Share**: $500 \text{ EGP}$
- **Clinic Share**: $300 \text{ EGP}$

### C. Hybrid Compensation Model (Reserved V2 Specification)
A base fixed fee plus a percentage bonus on gross treatment revenues exceeding a monthly baseline quota.

$$\text{Doctor Share} = \text{Fixed Base Fee} + \left( \text{Eligible Revenue} \times \frac{\text{Bonus Percentage}}{100} \right)$$

---

## 3. Revenue Recognition Rules & Invariants

Revenue and doctor earnings recognition must adhere to strict financial control invariants:

### A. Trigger Condition
- **ONLY** appointments with status `COMPLETED` generate recognized doctor financial earnings.
- Earnings are recognized on the date and time the appointment transitions to `COMPLETED`.

### B. Non-Earning Conditions (Strictly Excluded)
The following appointment states must **NEVER** generate doctor earnings or clinic shares:
- `SCHEDULED` (Draft or booked slot)
- `CONFIRMED` (Patient confirmed, consultation pending)
- `CHECKED_IN` (Patient waiting in lobby)
- `IN_CONSULTATION` (Consultation in progress)
- `CANCELLED` (Cancelled by patient or clinic)
- `NO_SHOW` (Patient missed appointment)
- `RESCHEDULED` (Shifted to another date)

---

## 4. Settlement Document Record Specification

Every settlement transaction in ClinicOS is represented by an immutable financial document with the following schema fields:

| Field Name | Type | Required | Description |
| --- | --- | --- | --- |
| `_id` | String | Yes | Unique Mongo document identifier (`stl_...`) |
| `settlementNumber` | String | Yes | System-generated unique code (`STL-YYYYMM-XXXXX`) |
| `tenantId` | String | Yes | Multi-tenant workspace identifier (`clinic_...`) |
| `clinicId` | String | Yes | Specific clinic branch location identifier |
| `doctorId` | String | Yes | Doctor identifier (`doc_...`) |
| `doctorName` | String | Yes | Denormalized full name of the doctor |
| `settlementPeriod` | Object | Yes | Period bounds (`startDate`, `endDate`) |
| `completedVisitsCount` | Number | Yes | Total number of completed appointments in period |
| `grossRevenue` | Number | Yes | Total revenue collected for completed visits |
| `doctorShare` | Number | Yes | Total earnings allocated to doctor |
| `clinicShare` | Number | Yes | Total earnings retained by clinic |
| `amountPaid` | Number | Yes | Total disbursement amount paid to doctor |
| `outstandingBalance` | Number | Yes | Remaining unpaid balance (`doctorShare - amountPaid`) |
| `paymentDate` | String | No | Date payment was disbursed (`YYYY-MM-DD`) |
| `paymentMethod` | String | Yes | Payment mode (`CASH`, `BANK_TRANSFER`, `CHEQUE`, `CREDIT_CARD`) |
| `notes` | String | No | Optional reconciliation or audit notes |
| `status` | String | Yes | State machine status (`DRAFT`, `PENDING_REVIEW`, `APPROVED`, `PAID`, `CLOSED`, `ARCHIVED`) |
| `auditInfo` | Object | Yes | Created, approved, paid, and archived timestamps & actor IDs |
| `version` | Number | Yes | Document version for optimistic locking (starts at 1) |

---

## 5. State Machine Lifecycle & Workflow Engine

Doctor settlements follow a strict, linear state machine transition lifecycle:

```
 [DRAFT] ──(Submit)──> [PENDING_REVIEW] ──(Approve)──> [APPROVED] ──(Pay)──> [PAID] ──(Close)──> [CLOSED]
    │                        │                                                                      │
    └──(Archive)─────────────┴──────(Reject ➔ DRAFT)────────────────────────────────────────────────┴──(Archive)──> [ARCHIVED]
```

### Legal State Transitions Table

| Current Status | Allowed Action | Target Status | Permitted Roles | Conditions & Invariants |
| --- | --- | --- | --- | --- |
| `DRAFT` | Submit for Review | `PENDING_REVIEW` | Clinic Manager | Validates completed visit line items |
| `DRAFT` | Archive | `ARCHIVED` | Clinic Manager | Soft-delete with mandatory reason |
| `PENDING_REVIEW` | Approve Settlement | `APPROVED` | Clinic Manager | Locks line items against modification |
| `PENDING_REVIEW` | Reject to Draft | `DRAFT` | Clinic Manager | Requires feedback notes for correction |
| `APPROVED` | Disburse Payment | `PAID` | Clinic Manager | Records `paymentDate`, `paymentMethod`, and `amountPaid` |
| `PAID` | Close Settlement | `CLOSED` | Clinic Manager | Finalizes period reconciliation |
| `PAID` / `CLOSED` | Soft Delete | `ARCHIVED` | Clinic Manager | Soft-delete with mandatory audit reason |
| `ARCHIVED` | Restore | `DRAFT` / `APPROVED` | Clinic Manager | Resets `archived: false` |

---

## 6. Security, RBAC & Multi-Tenant Isolation

### A. Role-Based Access Control (RBAC) Matrix

| User Role | View Own Earnings | View All Doctors | Create/Edit Settlement | Approve & Disburse Payment | Archive Settlement |
| --- | --- | --- | --- | --- | --- |
| **Doctor** | YES | NO | NO | NO | NO |
| **Clinic Manager** | YES | YES | YES | YES | YES |
| **Receptionist** | NO | NO | NO | NO | NO |
| **Platform Owner** | **NO (403)** | **NO (403)** | **NO (403)** | **NO (403)** | **NO (403)** |

### B. Platform Owner Financial Barrier (`PLATFORM_ADMIN_FINANCIAL_RESTRICTED`)
- Platform Administrators (`PLATFORM_ADMIN`) are strictly barred from accessing doctor earnings, settlement rosters, or financial summaries.
- Any request from a `PLATFORM_ADMIN` returns HTTP `403 Forbidden` with error code `PLATFORM_ADMIN_FINANCIAL_RESTRICTED`.

---

## 7. Reporting & Multi-Criteria Search Requirements

### A. Financial KPI & Dashboard Metrics
1. **Total Doctor Earnings (YTD / Monthly)**: Sum of realized doctor shares for completed visits.
2. **Total Clinic Revenue Share**: Sum of retained clinic commission.
3. **Pending Disbursal Balance**: Unsettled doctor earnings awaiting payment.
4. **Average Revenue Per Visit**: Ratio of gross revenue to completed visits.

### B. Multi-Criteria Filter & Search Capability
- **Search Query**: Doctor name, settlement number (`STL-...`), notes.
- **Filter Parameters**: `doctorId`, `status`, `paymentMethod`, `startDate`, `endDate`, `minAmount`, `maxAmount`.
- **Sorting Options**: `settlementDate:desc`, `grossRevenue:desc`, `outstandingBalance:desc`.
- **Pagination**: Default 20 records per page.

---

## 8. Reserved Future Extension Points (V2 Specification)

The Doctor Financial Accounts Module reserves clean extension hooks for future enterprise modules:

1. **Automated Payroll Engine**: Automatic generation of monthly doctor paystubs combining fixed salary, consultation commissions, and overtime.
2. **Tax & Withholding Calculation**: Automatic calculation of local commercial income taxes and withholding tax deductions prior to payout.
3. **Bonuses & Penalty Deductions**: Performance-based bonus additions and penalty/lateness deductions.
4. **Direct Bank API Integration**: Direct electronic funds transfer (EFT) via bank payout APIs.
5. **Accounting Journal Ledger Entries**: Automated posting of Debit (Doctor Expense) and Credit (Bank/Cash Account) entries into core accounting ledgers.
6. **Digital Signatures**: Cryptographic doctor acknowledgment of settlement statement receipts.

---

## 9. CHANGELOG & Compliance Statement

This document has been verified against all previous ClinicOS tasks (TASK-001 through TASK-091) and complies fully with `SYSTEM_ARCHITECTURE.md`, `CODING_STANDARDS.md`, and `DESIGN_DNA.md`.
