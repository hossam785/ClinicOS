# Reports & Analytics Database Design Specification — ClinicOS

## 1. Executive Summary & Database Strategy

This document specifies the MongoDB database architecture, collection schemas, index strategies, aggregation pipelines, and constraint matrix for the **Reports & Analytics Module (Module-012)**.

### Architectural Database Strategy
1. **On-the-Fly Aggregation over Transactional Collections**: To avoid redundant data duplication and stale states, real-time KPI metrics and active report views execute directly against primary operational collections (`appointments`, `expenses`, `doctor_settlements`, `patients`, `medical_records`, `prescriptions`, `users`, `notifications`).
2. **Dedicated Historical Snapshot Collection (`report_snapshots`)**: Immutable historical report statements generated for closed accounting periods or explicit export operations are persisted in `report_snapshots` with human-readable identifiers formatted as `RPT-YYYYMM-XXXXX`.
3. **Transient Dashboard Cache (`dashboard_cache`)**: To optimize high-concurrency executive dashboard loads, aggregated KPI widgets are cached with a configurable Time-To-Live (TTL) index policy (default 300 seconds).
4. **Platform Owner Privacy Isolation Barrier (`PLATFORM_ADMIN_REPORTS_RESTRICTED`)**: All reporting queries enforce strict compound filtering on `{ tenantId, clinicId }`. Queries with `tenantId: "PLATFORM"` are strictly restricted to system infrastructure metrics.

---

## 2. Entity-Relationship & Referential Data Map

```
                  ┌──────────────────────┐
                  │     appointments     │
                  └──────────┬───────────┘
                             │ (COMPLETED visits)
                             ▼
┌──────────────────┐    ┌──────────────────────────┐    ┌──────────────────┐
│     expenses     │───>│    report_snapshots      │<───│doctor_settlements│
└──────────────────┘    │ (RPT-YYYYMM-XXXXX)       │    └──────────────────┘
  (PAID status)         └────────────┬─────────────┘
                             │       │ (Cache hit / miss)
                             │       ▼
                             │  ┌──────────────────┐
                             └──│  dashboard_cache │
                                └──────────────────┘
```

---

## 3. MongoDB Collection Schemas

### 3.1 Collection 1: `report_snapshots`

Stores generated, read-only historical report snapshots and export histories.

```json
{
  "_id": "rpt_202608_00001",
  "reportNumber": "RPT-202608-00001",
  "tenantId": "clinic-101",
  "clinicId": "clinic-branch-01",
  "reportType": "FINANCIAL_PROFIT_LOSS",
  "reportCategory": "FINANCIAL",
  "title": "Monthly Profit and Loss Statement - July 2026",
  "description": "Finalized financial summary of gross revenue, paid expenses, and net profit.",
  "filterParams": {
    "startDate": "2026-07-01T00:00:00.000Z",
    "endDate": "2026-07-31T23:59:59.999Z",
    "doctorId": "ALL",
    "categoryId": "ALL",
    "status": "COMPLETED"
  },
  "reportData": {
    "summary": {
      "grossRevenue": 48500.00,
      "totalOperatingExpenses": 14250.00,
      "netOperatingProfit": 34250.00,
      "netProfitMargin": 70.62
    },
    "breakdowns": [
      { "categoryName": "Facility Rent", "totalAmount": 5000.00 },
      { "categoryName": "Medical Supplies", "totalAmount": 6250.00 },
      { "categoryName": "Utilities & Internet", "totalAmount": 3000.00 }
    ]
  },
  "exportInfo": {
    "exported": true,
    "exportFormat": "PDF",
    "exportedAt": "2026-08-01T01:15:00.000Z",
    "exportedBy": "usr_manager_01"
  },
  "metadata": {
    "generatedAt": "2026-08-01T01:15:00.000Z",
    "generatedBy": "usr_manager_01",
    "executionTimeMs": 142,
    "dataVersion": 1
  },
  "createdAt": "2026-08-01T01:15:00.000Z",
  "updatedAt": "2026-08-01T01:15:00.000Z",
  "version": 1
}
```

#### Field Definition Table — `report_snapshots`

| Field Path | BSON Type | Constraints | Description |
| --- | --- | --- | --- |
| `_id` | `ObjectId` / `String` | Primary Key | Unique document identifier. |
| `reportNumber` | `String` | Unique, Immutable | Human-readable identifier (`RPT-YYYYMM-XXXXX`). |
| `tenantId` | `String` | Required, Indexed | Multi-tenant isolation key. |
| `clinicId` | `String` | Required, Indexed | Clinic branch identifier. |
| `reportType` | `String` | Enum, Required | `BUSINESS_OVERVIEW`, `FINANCIAL_PROFIT_LOSS`, `DOCTOR_PERFORMANCE`, `PATIENT_DEMOGRAPHICS`, `APPOINTMENT_ANALYTICS`, `MEDICAL_ANONYMIZED`, `OPERATIONAL_SECURITY`. |
| `reportCategory` | `String` | Enum, Required | `EXECUTIVE`, `PATIENT`, `APPOINTMENT`, `DOCTOR`, `FINANCIAL`, `MEDICAL`, `OPERATIONAL`. |
| `title` | `String` | Required, Max 150 chars | Human-readable title of report. |
| `filterParams` | `Object` | Required | Key-value dictionary of applied filters (`startDate`, `endDate`, `doctorId`, etc.). |
| `reportData` | `Object` | Required, Immutable | Generated metric calculations and array breakdowns payload. |
| `exportInfo` | `Object` | Optional | Metadata if report was exported to PDF/Excel/CSV. |
| `metadata.generatedAt` | `Date` / `String` | Required | Generation timestamp. |
| `metadata.generatedBy` | `String` | Required | User ID of generator. |

---

### 3.2 Collection 2: `dashboard_cache` (Transient KPI Cache)

Caches pre-calculated dashboard KPI widgets with automatic TTL expiration.

```json
{
  "_id": "dash_cache_clinic-101_user_doc_042",
  "tenantId": "clinic-101",
  "clinicId": "clinic-branch-01",
  "userId": "user_doc_042",
  "role": "DOCTOR",
  "widgets": {
    "todaysPatients": { "value": 14, "changeVsYesterday": 12.5 },
    "todaysAppointments": { "total": 16, "completed": 10, "waiting": 4, "canceled": 2 },
    "revenueToday": { "value": 1850.00, "currency": "USD" },
    "expensesToday": { "value": 350.00, "currency": "USD" },
    "outstandingSettlements": { "value": 4250.00, "currency": "USD" },
    "activeDoctorsOnDuty": { "count": 3 },
    "pendingNotifications": { "unreadCount": 5, "criticalAlerts": 1 }
  },
  "cachedAt": "2026-08-01T01:30:00.000Z",
  "expiresAt": "2026-08-01T01:35:00.000Z"
}
```

#### Field Definition Table — `dashboard_cache`

| Field Path | BSON Type | Constraints | Description |
| --- | --- | --- | --- |
| `_id` | `String` | Primary Key | Format: `dash_cache_{tenantId}_{userId}`. |
| `tenantId` | `String` | Required, Indexed | Tenant isolation key. |
| `userId` | `String` | Required | Scoped user ID. |
| `widgets` | `Object` | Required | Cached KPI values dictionary. |
| `cachedAt` | `Date` / `String` | Required | Cache creation timestamp. |
| `expiresAt` | `Date` | TTL Index Target | Expiration timestamp (300s TTL index). |

---

### 3.3 Reserved Collection 3: `scheduled_reports` (V2 Extension Reservation)

Schema reservation for automated cron report generation.

```json
{
  "_id": "sched_rpt_001",
  "tenantId": "clinic-101",
  "clinicId": "clinic-branch-01",
  "reportType": "FINANCIAL_PROFIT_LOSS",
  "frequency": "WEEKLY",
  "dayOfWeek": "SUNDAY",
  "timeOfDay": "23:59",
  "recipients": ["owner@clinic.com", "manager@clinic.com"],
  "exportFormat": "PDF",
  "deliveryMethod": "EMAIL",
  "isActive": true,
  "lastExecutedAt": "2026-07-26T23:59:00.000Z",
  "nextExecutionAt": "2026-08-02T23:59:00.000Z"
}
```

---

## 4. Optimized Indexing Strategy

### 4.1 Index Strategy Table

| Collection | Index Name | Compound Key Specification | Purpose / Query Optimization Target |
| --- | --- | --- | --- |
| `report_snapshots` | `idx_tenant_report_number` | `{ tenantId: 1, reportNumber: 1 }` | **UNIQUE**. Fast lookup by report number. |
| `report_snapshots` | `idx_tenant_type_date` | `{ tenantId: 1, reportType: 1, "metadata.generatedAt": -1 }` | Covered query for listing historical snapshots by type. |
| `report_snapshots` | `idx_tenant_clinic_date` | `{ tenantId: 1, clinicId: 1, "metadata.generatedAt": -1 }` | Clinic branch snapshot lookup. |
| `dashboard_cache` | `idx_cache_expiration` | `{ expiresAt: 1 }` | **TTL INDEX** (`expireAfterSeconds: 0`). Auto-purge expired cache. |
| `appointments` | `idx_tenant_apt_reporting` | `{ tenantId: 1, status: 1, appointmentDate: 1, doctorId: 1 }` | **Covered Index**. Fast Gross Revenue & Volume aggregation. |
| `expenses` | `idx_tenant_exp_reporting` | `{ tenantId: 1, status: 1, paymentDate: 1, categoryId: 1 }` | **Covered Index**. Fast Operating Expenses aggregation. |

---

## 5. Aggregation Pipeline Strategy

### 5.1 Financial Gross Revenue Pipeline (`appointments` collection)
```javascript
db.appointments.aggregate([
  {
    $match: {
      tenantId: "clinic-101",
      status: "COMPLETED",
      appointmentDate: {
        $gte: ISODate("2026-07-01T00:00:00.000Z"),
        $lte: ISODate("2026-07-31T23:59:59.999Z")
      }
    }
  },
  {
    $group: {
      _id: null,
      grossRevenue: { $sum: "$fee" },
      completedCount: { $sum: 1 }
    }
  }
])
```

### 5.2 Financial Operating Expenses Pipeline (`expenses` collection)
```javascript
db.expenses.aggregate([
  {
    $match: {
      tenantId: "clinic-101",
      status: "PAID",
      paymentDate: {
        $gte: ISODate("2026-07-01T00:00:00.000Z"),
        $lte: ISODate("2026-07-31T23:59:59.999Z")
      }
    }
  },
  {
    $group: {
      _id: "$categoryId",
      categoryName: { $first: "$categoryName" },
      totalExpenses: { $sum: "$amount" }
    }
  }
])
```

### 5.3 Anonymized Clinical Diagnoses Frequency Pipeline (`medical_records` collection)
```javascript
db.medical_records.aggregate([
  {
    $match: {
      tenantId: "clinic-101",
      createdAt: {
        $gte: ISODate("2026-07-01T00:00:00.000Z"),
        $lte: ISODate("2026-07-31T23:59:59.999Z")
      }
    }
  },
  { $unwind: "$diagnoses" },
  {
    $group: {
      _id: "$diagnoses.code",
      diagnosisDescription: { $first: "$diagnoses.description" },
      occurrenceCount: { $sum: 1 }
    }
  },
  { $project: { _id: 0, code: "$_id", diagnosisDescription: 1, occurrenceCount: 1 } },
  { $sort: { occurrenceCount: -1 } }
])
```

---

## 6. Constraint Validation Matrix

| Rule ID | Target Field | Constraint Rule | Error Code | Mitigation / Enforced State |
| --- | --- | --- | --- | --- |
| **CM-001** | `reportNumber` | Must be unique per tenant | `DUPLICATE_REPORT_NUMBER` | Formatted sequence `RPT-YYYYMM-XXXXX` |
| **CM-002** | `filterParams` | `startDate` <= `endDate` | `INVALID_DATE_RANGE` | Pre-database validator rejection |
| **CM-003** | Financial Revenue | Must filter `status == "COMPLETED"` | `UNFINALIZED_REVENUE_EXCLUDED` | Aggregation pipeline match stage |
| **CM-004** | Financial Expenses | Must filter `status == "PAID"` | `UNPAID_EXPENSE_EXCLUDED` | Aggregation pipeline match stage |
| **CM-005** | Medical Data | Zero PII fields allowed | `PII_LEAK_PREVENTED` | Projection stage strips patient IDs & names |
| **CM-006** | `tenantId` | Cannot be `PLATFORM` for clinic reports | `PLATFORM_ADMIN_REPORTS_RESTRICTED` | API gate security middleware rejection |

---

## 7. Offline SQLite Schema Definitions

Desktop local SQLite database schema definitions:

```sql
CREATE TABLE IF NOT EXISTS report_snapshots (
    id TEXT PRIMARY KEY,
    report_number TEXT UNIQUE NOT NULL,
    tenant_id TEXT NOT NULL,
    clinic_id TEXT NOT NULL,
    report_type TEXT NOT NULL,
    report_category TEXT NOT NULL,
    title TEXT NOT NULL,
    filter_params TEXT NOT NULL, -- JSON String
    report_data TEXT NOT NULL,   -- JSON String
    exported INTEGER DEFAULT 0,
    export_format TEXT,
    exported_at TEXT,
    exported_by TEXT,
    generated_at TEXT NOT NULL,
    generated_by TEXT NOT NULL,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS dashboard_cache (
    id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    widgets TEXT NOT NULL,       -- JSON String
    cached_at TEXT NOT NULL,
    expires_at TEXT NOT NULL
);
```

---

## 8. Quality Assurance Checklist

- [x] On-the-fly aggregation strategy over transactional collections specified.
- [x] Dedicated `report_snapshots` and `dashboard_cache` collection schemas defined.
- [x] Covered indexes for `appointments`, `expenses`, and `report_snapshots` specified.
- [x] MongoDB aggregation pipelines for Revenue (`COMPLETED`), Expenses (`PAID`), and Anonymized Medical Diagnoses detailed.
- [x] Constraint Matrix (CM-001 through CM-006) defined.
- [x] Platform Owner isolation barrier (`PLATFORM_ADMIN_REPORTS_RESTRICTED`) enforced in index and pipeline specs.
- [x] Offline SQLite DDL table definitions specified.
- [x] CHANGELOG.md updated with TASK-112 entry.
