# Reports & Analytics Module Specification — ClinicOS

## 1. Executive Summary & Module Overview

The **Reports & Analytics Module (Module-012)** provides comprehensive Business Intelligence (BI), executive dashboards, clinical analytics, operational performance monitoring, and financial reporting for ClinicOS. It consolidates domain metrics across Authentication, Doctors, Reception, Patients, Appointments, Medical Records, Prescriptions, Expenses, Doctor Financial Accounts, and System Notifications into real-time decision-support dashboards and exportable analytical statements.

Designed for hybrid desktop-first SQLite environments with cloud MongoDB synchronization, the module guarantees offline operational reporting continuity, tenant-isolated analytical security, strict role-based data scoping, zero PII leakage in clinical aggregations, and deterministic financial accounting alignment.

---

## 2. Platform Owner Privacy & Multi-Tenant Isolation Barrier

### Security Constraint `PLATFORM_ADMIN_REPORTS_RESTRICTED`
Platform Owners (`SUPER_ADMIN`) operate under global infrastructure scoping (`tenantId: "PLATFORM"`). They monitor platform health, global database backup execution, subscription lifecycle, and tenant count metrics.

**Mandatory Security Barrier**:
- Platform Owners must **NEVER** view, query, aggregate, or export operational clinic reports, patient demographics, doctor performance metrics, diagnosis frequency, or financial cash flow statements belonging to any tenant clinic (`tenantId !== "PLATFORM"`).
- Any report request initiated by a `SUPER_ADMIN` user targeting a clinic tenant is rejected immediately at API gates with HTTP 403 Forbidden (`PLATFORM_ADMIN_REPORTS_RESTRICTED`).
- Clinic financial, operational, and clinical reports are strictly partitioned by `tenantId` and `clinicId`.

---

## 3. Core Business Goals

1. **Executive Performance Monitoring**: Provide clinic owners and managers with high-level KPI dashboards covering daily revenue, expense burn rates, appointment volume, and net profit margin.
2. **Clinical & Operational Intelligence**: Track appointment cancellation rates, patient waiting times, consultation durations, follow-up ratios, and reception workflow bottlenecks.
3. **Doctor Productivity & Settlement Oversight**: Analyze patients treated per doctor, appointment completion ratios, consultation time efficiency, and accrued financial compensation statement readiness.
4. **Financial Control & Accounting Alignment**: Deliver read-only cash flow statements, expense category breakdowns, and revenue reports strictly computed from finalized transactions.
5. **Patient Growth & Demographics Tracking**: Measure patient acquisition rates, retention ratios, visit frequency, and age/gender distributions.
6. **Data Export & Archival Integrity**: Support instant on-demand exports (PDF, Excel, CSV) containing explicit generation metadata, filtering criteria, and immutable audit timestamps.
7. **Offline Reporting Continuity**: Enable desktop clients operating on local SQLite databases to generate instant analytical views and auto-refresh metrics post-cloud sync.

---

## 4. Comprehensive Report Category Inventory

### 4.1 Executive Reports
Executive reports summarize clinic-wide business performance across daily, weekly, monthly, and annual windows.

| Report Name | Frequency | Target Audience | Key Metrics Included |
| --- | --- | --- | --- |
| **Business Overview** | Real-time / Daily | Clinic Owner, Clinic Manager | Net Revenue, Total Expenses, Net Profit, Patient Volume, Active Doctors |
| **Daily Operational Summary** | Daily | Clinic Manager | Today's Appointments, Checked-In Count, Completed Consultations, Daily Revenue, Expenses |
| **Weekly Performance Digest** | Weekly | Clinic Manager | Week-over-Week Growth, Appointment Occupancy Rate, Peak Clinic Hours, Revenue Trajectory |
| **Monthly Financial & Clinical Statement** | Monthly | Clinic Owner, Accountant | Monthly Gross Revenue, Operating Expenses, Net Cash Flow, Doctor Payout Allocations |
| **Annual Business Review** | Annual | Executive Board | Year-over-Year Financial Growth, Patient Lifetime Value, Facility Capacity Utilization |

### 4.2 Patient Analytics Reports
Patient reports track acquisition, demographic distribution, and retention patterns.

| Report Name | Description | Key Metrics / Groupings |
| --- | --- | --- |
| **New Patient Acquisition** | Tracks first-time patient registrations over selected time ranges. | New Registrations Count, Source Channel, Monthly Growth Rate |
| **Patient Retention & Visit Frequency** | Measures returning patient ratios and visit recurrence. | One-Time vs Returning Ratio, Average Days Between Visits |
| **Demographic Distribution** | Analyzes patient age cohorts and gender proportions. | Age Brackets (<18, 18-35, 36-50, 51-65, >65), Gender Breakdown |
| **Top Patient Activity** | Identifies high-frequency consultation patients. | Visit Count, Completed Consultations, Total Invoiced Value |

### 4.3 Appointment & Workflow Reports
Appointment reports monitor scheduling efficiency, waiting room queues, and throughput.

| Report Name | Description | Key Metrics / Groupings |
| --- | --- | --- |
| **Daily Appointment Roster** | Breakdown of scheduled, completed, and canceled visits per day. | Total Scheduled, Completed, Canceled, Rescheduled, No-Shows |
| **Appointment Volume Trends** | Time-series analysis of booking density across hours, days, and months. | Peak Booking Hours, Busiest Days of Week, Monthly Trend Line |
| **Cancellation & No-Show Rate** | Tracks missed visits and late cancellations. | Cancellation %, No-Show %, Reason Category Breakdown |
| **Waiting & Consultation Duration** | Measures patient flow efficiency from check-in to consultation wrap-up. | Average Wait Time (Check-In ➔ Consultation), Average Consultation Duration |

### 4.4 Doctor Performance Reports
Doctor reports evaluate practitioner workload, clinical throughput, and revenue contribution.

| Report Name | Description | Key Metrics / Groupings |
| --- | --- | --- |
| **Patients Per Doctor** | Volume of distinct patients consulted per practitioner. | Total Consultations, Unique Patients Count, Daily Average |
| **Completed Visit Ratio** | Proportion of scheduled appointments successfully completed. | Scheduled vs Completed %, No-Show Rate Per Doctor |
| **Revenue Generation Per Doctor** | Gross revenue generated from doctor consultations and procedures. | Total Revenue Generated, Average Revenue Per Visit |
| **Working Hours & Efficiency** | On-duty clinic hours versus direct consultation time. | Active Duty Hours, Consultation Hours, Utilization % |

### 4.5 Financial & Accounting Reports
Financial reports summarize gross revenue, operating expenses, net profit, and settlement balances.

| Report Name | Invariant Rules | Key Metrics Included |
| --- | --- | --- |
| **Gross Revenue Report** | **COMPLETED appointments only.** | Invoiced Revenue, Payment Method (Cash, Credit Card, Bank Transfer, Insurance) |
| **Operating Expenses Report** | **PAID expenses only.** | Expense Category Breakdown, Fixed vs Variable Expenses, Payment Method |
| **Net Profit & Loss Statement** | Computed as `Finalized Revenue - Paid Expenses`. | Gross Margin, Total Operating Expenses, Net Operating Profit |
| **Doctor Settlements Summary** | Aligned with Module-010 Doctor Financial Accounts. | Accrued Compensation, Disbursed Payments, Outstanding Unsettled Balance |
| **Cash Flow Summary** | Monthly inflow vs outflow statement. | Cash Inflows, Cash Outflows, Net Cash Balance |

### 4.6 Clinical & Medical Reports (Anonymized)
Medical reports summarize clinical activity across procedures, diagnoses, and prescriptions. **Strictly zero Patient Identifiable Information (PII) is included in aggregated views.**

| Report Name | Anonymization Safeguard | Key Metrics Included |
| --- | --- | --- |
| **Diagnoses Frequency Analysis** | ICD-10 / Clinical diagnosis code aggregation only. | Top Diagnoses, Prevalence %, Seasonal Trends |
| **Common Procedures & Treatments** | Aggregated procedure codes; no patient names. | Procedure Volume, Average Duration, Revenue Per Procedure |
| **Prescription Statistics** | Medication category frequency; no patient MRNs. | Top Prescribed Drugs, Dosage Frequency, Refill Rate |
| **Follow-Up Consultation Rate** | Percentage of medical visits requiring follow-up. | Overall Follow-Up %, Follow-Up Rate Per Specialty |

### 4.7 Operational & System Reports
Operational reports monitor staff productivity, system security, and infrastructure stability.

| Report Name | Description | Key Metrics Included |
| --- | --- | --- |
| **Reception Workflow Performance** | Check-in speed and patient intake metrics. | Check-In Processing Time, Queue Bottlenecks |
| **User Login & Security Activity** | Audit of system authentication attempts. | Successful Logins, Failed Login Attempts, Security Lockouts |
| **Database Backup Execution** | Track automated backup jobs. | Backup Status (SUCCESS/FAILED), Storage Location, File Size |
| **Sync & Disconnection History** | Desktop-to-cloud synchronization events. | Sync Duration, Processed Records, Conflict Rate |

---

## 5. Dashboard KPI Cards Inventory

The main Dashboard displays real-time key performance indicators (KPIs) calculated over the active operational window:

1. **Today's Patients**: Total unique patients checked-in or consulted today (+ % change vs yesterday).
2. **Today's Appointments**: Total scheduled visits today (with breakdown of Completed, Waiting, Canceled).
3. **Revenue Today**: Gross finalized revenue from completed visits today (formatted currency).
4. **Expenses Today**: Total paid operating expenses logged today (formatted currency).
5. **Outstanding Doctor Settlements**: Total unsettled financial balance owed across active doctors.
6. **Active Doctors On Duty**: Number of practitioners currently logged in and conducting consultations.
7. **Pending Notifications / Critical Alerts**: Unread high-priority notification counter and unacknowledged critical alert indicator.

---

## 6. Financial Accounting Invariants & Rules

1. **Completed Revenue Rule**: Only appointments marked with status `COMPLETED` contribute to gross revenue calculations. Scheduled, checked-in, or canceled appointments are explicitly excluded from financial revenue figures.
2. **Paid Expense Rule**: Only operating expenses marked with status `PAID` affect finalized financial reports and Net Profit statements. Expenses in `DRAFT`, `SUBMITTED`, `APPROVED`, or `REJECTED` states are excluded from finalized accounting.
3. **Immutable Historical Snapshots**: Analytical reports for closed accounting periods (past months or years) are read-only and immutable. Historical figures do not re-render retroactively upon current-period edits.
4. **Net Profit Calculation**: Computed strictly as `Sum(Finalized Revenue) - Sum(Paid Expenses)`.

---

## 7. Role-Based Access Control (RBAC) Permission Matrix

| Role | Executive Reports | Patient & Appt Reports | Doctor Performance Reports | Financial Reports | Anonymized Medical Reports | Operational & Security Reports |
| --- | --- | --- | --- | --- | --- | --- |
| **Doctor** | DENIED | Own Patients Only | Own Performance Only | Own Financial Payouts Only | Own Clinical Stats Only | DENIED |
| **Receptionist** | DENIED | Appt & Queue Only | DENIED | DENIED | DENIED | Reception Queue Stats |
| **Accountant** | Financial Overview | DENIED | DENIED | Full Financial Reports | DENIED | DENIED |
| **Clinic Manager** | Full Access | Full Access | Full Access | Full Access | Full Access | Full Operational Reports |
| **Clinic Owner** | Full Access | Full Access | Full Access | Full Access | Full Access | Full Access |
| **Platform Owner (`SUPER_ADMIN`)** | DENIED (`PLATFORM_ADMIN_REPORTS_RESTRICTED`) | DENIED | DENIED | DENIED | DENIED | Platform Backup & Sync Only |

---

## 8. Export Strategy & Report Formatting Rules

1. **Export Formats**: On-demand rendering available in **PDF**, **Excel (.xlsx)**, and **CSV**.
2. **Export Header Metadata Requirements**:
   - Clinic Legal Name, Branch Name, and Tenant ID.
   - Generation Date & Time Timestamp (ISO 8601 UTC + Local).
   - Generated By (User Full Name & Role).
   - Applied Filter Summary (Date Range, Selected Doctor, Category, Status).
3. **Export Security & Governance**: Export operations trigger an immutable audit log entry recording `user_id`, `report_type`, `format`, `filter_params`, and `timestamp`.
4. **V2 Reserved Feature (Scheduled Exports)**: Automated email/SMS PDF digest exports are reserved for V2.

---

## 9. Offline Strategy & Local SQLite Synchronization

1. **Local Analytical Computation**: When the desktop application operates offline, analytical reports and KPI cards are computed instantly against the local SQLite database.
2. **Offline Indicator**: Reports rendered offline display a prominent visual banner: *"Offline Analytical View — Computed from Local SQLite Cache"*.
3. **Reconnection Synchronization Refresh**: Upon cloud network restoration, local sync flushes queued records and automatically triggers a silent background re-computation of active report views.

---

## 10. Future Extension Reservations (V2 Features)

1. **AI Insights & Predictive Analytics**: AI-driven patient no-show prediction and clinic revenue forecasting.
2. **Automated Scheduled Report Delivery**: Daily/weekly automated PDF report delivery to Clinic Owners via Email/WhatsApp.
3. **Interactive Chart Drilling**: Deep-drill interactive graph nodes leading directly to source appointment or expense records.

---

## 11. Verification & Quality Assurance Checklist

- [x] All 7 report categories defined with specific metric inventories.
- [x] Platform Owner isolation barrier (`PLATFORM_ADMIN_REPORTS_RESTRICTED`) strictly enforced.
- [x] Financial revenue rule (`COMPLETED` visits) and expense rule (`PAID` expenses) specified.
- [x] Zero PII constraint in clinical/medical reports enforced.
- [x] RBAC permission matrix defined across 6 roles.
- [x] Export strategy (PDF, Excel, CSV) with generation metadata specified.
- [x] Offline SQLite reporting and auto-refresh strategy detailed.
- [x] CHANGELOG.md updated with TASK-110 entry.
