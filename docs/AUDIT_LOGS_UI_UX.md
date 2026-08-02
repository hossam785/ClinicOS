# Audit Logs UI/UX Design Specification — ClinicOS

## 1. Design System Alignment & Aesthetics

The **Audit Logs Module (Module-013)** interface is designed as an enterprise security, forensic investigation, and compliance workspace. It follows the **ClinicOS Design System** guidelines: high readability, low visual noise, color-blind accessible severity indicators, and zero decorative clutter.

### 1.1 Color Tokens & Severity System
- **Primary Brand / Workspace Focus**: `#4F46E5` (Indigo-600)
- **Background & Card Containers**: `#F8FAFC` (Slate-50) / `#FFFFFF` (White) / `#0F172A` (Slate-900 Dark Mode Slate)
- **Severity Badge Tokens**:
  - `INFORMATION`: `#ECFDF5` background, `#047857` text (Emerald-50 / Emerald-700)
  - `WARNING`: `#FFFBEB` background, `#B45309` text (Amber-50 / Amber-700)
  - `ERROR`: `#FEF2F2` background, `#B91C1C` text (Rose-50 / Rose-700)
  - `CRITICAL`: `#F3E8FF` background, `#6D28D9` text (Purple-50 / Purple-700) with subtle pulse animation

### 1.2 Zero Emojis Policy
All iconography strictly utilizes **Lucide React SVG** components:
- `Shield`, `ShieldAlert`, `FileText`, `Search`, `SlidersHorizontal`, `Download`, `Clock`, `User`, `CheckCircle2`, `AlertTriangle`, `XCircle`, `Lock`, `RefreshCw`, `Copy`, `Eye`, `ArrowRight`, `ChevronRight`.

---

## 2. Screen Architecture & Wireframe Specifications

### 2.1 Screen 1: Audit Logs Center Roster View (`/dashboard/audit-logs`)
Central investigation hub displaying paginated audit records with advanced filter toolbars.

```
+---------------------------------------------------------------------------------------------------------+
| Audit Logs Roster Center                                     [Refresh Data] [Export Audit Log]          |
| Immutable security, operational, and compliance audit trail registry.                                   |
+---------------------------------------------------------------------------------------------------------+
| [ Search audit number or action... ] [ Module: ALL v ] [ Severity: ALL v ] [ Date Range Picker v ]      |
+---------------------------------------------------------------------------------------------------------+
| TIMESTAMPS   | AUDIT NO.       | SEVERITY   | MODULE       | ACTION                 | ACTOR        | ACTION |
+--------------+-----------------+------------+--------------+------------------------+--------------+--------+
| 15:30:00 UTC | AUD-202608-0001 | WARNING    | FINANCIALS   | DOCTOR_SETTLEMENT_PAID | Sarah J.     | [View] |
| 15:28:12 UTC | AUD-202608-0002 | INFO       | APPOINTMENTS | PATIENT_CHECKED_IN     | Reception    | [View] |
| 14:10:05 UTC | AUD-202608-0003 | CRITICAL   | AUTH         | AUTH_ACCOUNT_LOCKED    | System       | [View] |
+---------------------------------------------------------------------------------------------------------+
| Showing 1-20 of 1,420 records                                               < Previous  Page 1 of 71  Next >|
+---------------------------------------------------------------------------------------------------------+
```

---

### 2.2 Screen 2: Audit Event Details & State Diff Inspector Modal (`AuditDetailsModal`)
Inspects complete metadata, request device context, and sanitized state diff summary.

```
+---------------------------------------------------------------------------------------------------------+
| Audit Event Inspector — AUD-202608-00001                                                         [ X ] |
+---------------------------------------------------------------------------------------------------------+
| Event ID: AUD-202608-00001              | Timestamp: 2026-08-01 15:30:00 UTC                            |
| Action: DOCTOR_SETTLEMENT_PAID          | Module: FINANCIALS                                            |
| Severity: WARNING                       | Operating Mode: ONLINE (Synced)                               |
| Actor: Sarah Jenkins (usr_mgr_01)       | Actor Role: ClinicAdmin                                       |
| Target Entity: DoctorSettlement (stl_9910)| Correlation ID: corr_uuid_881920                             |
+---------------------------------------------------------------------------------------------------------+
| Device Context: IP 192.168.1.45 | OS: Windows 11 Enterprise | Client: ClinicOS-Desktop/2.4.0              |
+---------------------------------------------------------------------------------------------------------+
| PREVIOUS STATE SUMMARY                  | NEW STATE SUMMARY                                             |
| {                                       | {                                                             |
|   "status": "APPROVED",                 |   "status": "DISBURSED",                                      |
|   "payoutAmount": 4250.00               |   "disbursedAt": "2026-08-01T15:30:00.000Z",                  |
| }                                       |   "disbursedBy": "usr_mgr_01"                                 |
|                                         | }                                                             |
+---------------------------------------------------------------------------------------------------------+
| [ Copy Correlation ID ]                                                     [ Investigate Timeline ] [ Close ]|
+---------------------------------------------------------------------------------------------------------+
```

---

### 2.3 Screen 3: Forensic Investigation Workspace & Correlation Timeline (`/dashboard/audit-logs/investigate/:correlationId`)
Reconstructs the exact chronological sequence of events associated with a specific transaction correlation ID.

```
+---------------------------------------------------------------------------------------------------------+
| Forensic Investigation Timeline — Correlation ID: corr_uuid_881920                 [ Back to Audit Roster ]|
| Chronological trace of related transaction operations.                                                  |
+---------------------------------------------------------------------------------------------------------+
| (o) 15:25:00 UTC — EXPENSE_CREATED (Info) by usr_mgr_01                                                 |
|  |  Expense EXP-991 created for facility maintenance ($4,250.00).                                      |
|  v                                                                                                      |
| (o) 15:28:00 UTC — EXPENSE_PAID (Info) by usr_mgr_01                                                    |
|  |  Expense marked as PAID via Bank Transfer.                                                           |
|  v                                                                                                      |
| (o) 15:30:00 UTC — DOCTOR_SETTLEMENT_PAID (Warning) by usr_mgr_01                                        |
|     Settlement stl_9910 funds disbursed to Dr. Fleming.                                                |
+---------------------------------------------------------------------------------------------------------+
```

---

### 2.4 Screen 4: Audit Statistics Overview (`/dashboard/audit-logs/stats`)
Aggregated security metrics, event volumes by module, severity breakdown, and sync status summaries.

```
+---------------------------------------------------------------------------------------------------------+
| Audit Overview & Security Statistics                                                                    |
+---------------------------------------------------------------------------------------------------------+
| [ Total Audit Events ]  | [ Critical Alerts ]     | [ Failed Logins ]       | [ Offline Sync Status ]     |
| 14,200                  | 40                      | 12                      | 100% Synced (0 Pending)    |
+---------------------------------------------------------------------------------------------------------+
| Events Distribution by Severity (Donut Chart)  | Module Activity Volumes (Bar Chart)                     |
| [ Emerald: Info 90% ] [ Amber: Warn 8% ]      | Appointments: 5,200 | Auth: 3,100 | Patients: 2,800     |
+---------------------------------------------------------------------------------------------------------+
```

---

### 2.5 Screen 5: Export Audit Log Modal Dialog (`AuditExportModal`)
Format selector and filter confirmation for downloading official signed audit logs.

```
+---------------------------------------------------------------------------------------------------------+
| Export Audit Log Document                                                                        [ X ] |
| Generate an official signed audit log statement for compliance or investigation.                        |
+---------------------------------------------------------------------------------------------------------+
| Select Export Format:  (o) PDF Document     ( ) Excel Spreadsheet (.xlsx)     ( ) CSV File              |
| Date Range Filter:     2026-07-01 to 2026-07-31                                                          |
| Severity Filter:       CRITICAL, ERROR, WARNING                                                         |
| Estimated Records:     1,420 records                                                                    |
+---------------------------------------------------------------------------------------------------------+
| Warning: This export action will be logged in the system audit history.                                 |
+---------------------------------------------------------------------------------------------------------+
| [ Cancel ]                                                                       [ Download Export ]    |
+---------------------------------------------------------------------------------------------------------+
```

---

## 3. Dashboard Integration Security Widgets

1. **Security Alert Banner Widget**: Highlighted banner rendered on Clinic Manager dashboard when unacknowledged `CRITICAL` events exist (e.g. `AUTH_ACCOUNT_LOCKED` or `BACKUP_FAILED`). Includes direct link to `/dashboard/audit-logs?severity=CRITICAL`.
2. **Recent Audit Stream Widget**: Compact 5-item activity feed widget rendered on executive dashboard displaying recent operational events.

---

## 4. Loading Skeletons, Empty & Error States

- **Loading Skeleton**: Pulse skeleton rows with animated background gradients for table rows and details modals.
- **Empty States**:
  - *No Audit Records*: "Zero Audit Logs Recorded. System operational."
  - *No Search Matches*: "No audit events match your active search filter parameters."
  - *No Critical Alerts*: "Zero critical security alerts detected."
- **Error States**:
  - *Permission Denied (403)*: Shield icon with message: "Access Restricted: Audit log inspection requires Clinic Manager privileges."
  - *Offline Indicator Banner*: "Operating Offline: Audit logs are recorded locally with cryptographic signatures and will sync automatically upon reconnection."

---

## 5. WCAG 2.1 AA Accessibility Standards

1. **Keyboard Focus & Navigation**: Every interactive button, filter dropdown, search input, and table row features `focus-visible:ring-2 focus-visible:ring-indigo-600`. Full keyboard navigation supported (`Tab`, `Shift+Tab`, `Enter`, `Escape`).
2. **Screen Reader ARIA Attributes**:
   - `aria-label="Audit Logs Data Table"`
   - `aria-live="polite"` for live search roster updates.
   - `aria-expanded` for state diff accordion toggles.
3. **Color Contrast**: All text tokens achieve >= 4.5:1 contrast against background colors.
4. **Touch & Click Targets**: Minimum 44x44px target area on all action triggers.

---

## 6. Responsive Layout Grid

- **Desktop (Primary 1440px+)**: Full 6-column tabular roster with expanded inline filters and side-by-side state diff inspector.
- **Laptop (1024px - 1439px)**: Compact 5-column table view with collapsible filter toolbar.
- **Tablet (768px - 1023px)**: Cards roster view with modal inspector.
- **Mobile (< 768px)**: Deferred to future mobile admin build.

---

## 7. Reserved Future UI Extension Slots (V2 Architecture)

1. **SIEM Live Stream Toggle**: Real-time Syslog/CEF streaming status indicator.
2. **AI Security Anomaly Badge**: AI threat confidence score tag on unusual user behavior events.
3. **Digital Signature Proof Seal**: Verification badge confirming Merkle tree cryptographic integrity of exported log statements.
