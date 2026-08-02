# Reports & Analytics REST API Specification — ClinicOS

## 1. Executive Summary & Standards Compliance

This document defines the complete REST API specification for the **Reports & Analytics Module (Module-012)**. The API surface delivers real-time executive dashboard KPIs, time-series chart data streams, specialized analytical report statements, export rendering engines (PDF, Excel, CSV), and historical snapshot registries.

### Architectural API Standards
- **RESTful Resource Scoping**: Base routes versioned under `/api/v1/reports`.
- **JWT & Tenant Isolation**: All requests enforce `Authorization: Bearer <token>` and `X-Tenant-ID: <tenant_id>`.
- **Platform Owner Privacy Isolation (`PLATFORM_ADMIN_REPORTS_RESTRICTED`)**: Queries initiated by Platform Owners (`SUPER_ADMIN` under `tenantId: "PLATFORM"`) targeting clinic tenant reports (`tenantId !== "PLATFORM"`) are rejected immediately with HTTP 403 Forbidden.
- **Financial Invariants**: Revenue calculations strictly include `COMPLETED` appointments; expense calculations strictly include `PAID` items.
- **Anonymized Clinical Aggregations**: Clinical reports strictly omit Patient Identifiable Information (PII).

---

## 2. Global Request & Response Envelopes

### 2.1 Standard Success Envelope
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-08-01T01:30:00.000Z",
    "executionTimeMs": 42
  }
}
```

### 2.2 Standard Paginated List Envelope
```json
{
  "success": true,
  "data": {
    "items": [ ... ],
    "pagination": {
      "totalItems": 124,
      "totalPages": 7,
      "currentPage": 1,
      "limit": 20,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  },
  "meta": {
    "timestamp": "2026-08-01T01:30:00.000Z"
  }
}
```

### 2.3 Standard Error Envelope
```json
{
  "success": false,
  "error": {
    "code": "PLATFORM_ADMIN_REPORTS_RESTRICTED",
    "message": "Access Denied: Platform Owners cannot access operational or financial clinic reports.",
    "details": null
  },
  "meta": {
    "timestamp": "2026-08-01T01:30:00.000Z"
  }
}
```

---

## 3. Active REST Endpoint Catalog

### 3.1 Endpoint 1: `GET /api/v1/reports/dashboard`
Fetches real-time KPI card metrics for the executive dashboard.

- **Authentication**: JWT Required
- **RBAC Roles**: `DOCTOR`, `RECEPTIONIST`, `ACCOUNTANT`, `CLINIC_MANAGER`, `CLINIC_OWNER`
- **Security Check**: Enforces `PLATFORM_ADMIN_REPORTS_RESTRICTED` barrier against `SUPER_ADMIN`.
- **Query Parameters**:
  - `clinicId` (string, optional)

#### Response 200 OK
```json
{
  "success": true,
  "data": {
    "todaysPatients": { "value": 18, "changeVsYesterday": 12.5 },
    "todaysAppointments": { "total": 22, "completed": 14, "waiting": 5, "canceled": 3 },
    "revenueToday": { "value": 2450.00, "currency": "USD" },
    "expensesToday": { "value": 450.00, "currency": "USD" },
    "outstandingSettlements": { "value": 4250.00, "currency": "USD" },
    "activeDoctorsOnDuty": { "count": 4 },
    "pendingNotifications": { "unreadCount": 6, "criticalAlerts": 1 }
  },
  "meta": { "timestamp": "2026-08-01T01:30:00.000Z" }
}
```

---

### 3.2 Endpoint 2: `GET /api/v1/reports/dashboard/charts`
Fetches time-series chart dataset streams for dashboard graphs.

- **Authentication**: JWT Required
- **RBAC Roles**: `ACCOUNTANT`, `CLINIC_MANAGER`, `CLINIC_OWNER`
- **Query Parameters**:
  - `interval` (enum: `DAILY`, `WEEKLY`, `MONTHLY`, `ANNUAL`, default `MONTHLY`)
  - `metric` (enum: `REVENUE`, `APPOINTMENTS`, `PATIENTS`, default `REVENUE`)
  - `startDate` (ISO 8601 string)
  - `endDate` (ISO 8601 string)

#### Response 200 OK
```json
{
  "success": true,
  "data": {
    "metric": "REVENUE",
    "interval": "MONTHLY",
    "series": [
      { "label": "Jan 2026", "value": 38200.00 },
      { "label": "Feb 2026", "value": 41500.00 },
      { "label": "Mar 2026", "value": 45100.00 }
    ]
  },
  "meta": { "timestamp": "2026-08-01T01:30:00.000Z" }
}
```

---

### 3.3 Endpoint 3: `GET /api/v1/reports/financial`
Generates financial profit and loss summary report statement.

- **Authentication**: JWT Required
- **RBAC Roles**: `ACCOUNTANT`, `CLINIC_MANAGER`, `CLINIC_OWNER`
- **Business Invariants**: Gross revenue calculated strictly from `COMPLETED` appointments; expenses calculated strictly from `PAID` expenses.
- **Query Parameters**:
  - `startDate` (ISO 8601 string, required)
  - `endDate` (ISO 8601 string, required)
  - `doctorId` (string, optional)

#### Response 200 OK
```json
{
  "success": true,
  "data": {
    "reportType": "FINANCIAL_PROFIT_LOSS",
    "period": { "startDate": "2026-07-01", "endDate": "2026-07-31" },
    "summary": {
      "grossRevenue": 48500.00,
      "totalOperatingExpenses": 14250.00,
      "netOperatingProfit": 34250.00,
      "netProfitMarginPercentage": 70.62
    },
    "revenueBreakdown": [
      { "paymentMethod": "CASH", "totalAmount": 28500.00 },
      { "paymentMethod": "CREDIT_CARD", "totalAmount": 20000.00 }
    ],
    "expenseBreakdown": [
      { "categoryName": "Facility Rent", "totalAmount": 5000.00 },
      { "categoryName": "Medical Supplies", "totalAmount": 6250.00 }
    ]
  },
  "meta": { "timestamp": "2026-08-01T01:30:00.000Z" }
}
```

---

### 3.4 Endpoint 4: `GET /api/v1/reports/doctors`
Generates doctor workload, consultation efficiency, and productivity analytics.

- **Authentication**: JWT Required
- **RBAC Roles**: `DOCTOR` (Self-Service Only), `CLINIC_MANAGER`, `CLINIC_OWNER`
- **Security Constraint**: If `role === "DOCTOR"`, query parameter `doctorId` is locked to `req.user.id`.
- **Query Parameters**:
  - `startDate` (ISO 8601 string, required)
  - `endDate` (ISO 8601 string, required)
  - `doctorId` (string, optional)

#### Response 200 OK
```json
{
  "success": true,
  "data": {
    "doctors": [
      {
        "doctorId": "doc_101",
        "doctorName": "Dr. Alexander Fleming",
        "specialty": "Cardiology",
        "scheduledAppointments": 85,
        "completedVisits": 78,
        "canceledVisits": 5,
        "noShowVisits": 2,
        "completionRatePercentage": 91.76,
        "totalRevenueGenerated": 15600.00,
        "uniquePatients": 62
      }
    ]
  },
  "meta": { "timestamp": "2026-08-01T01:30:00.000Z" }
}
```

---

### 3.5 Endpoint 5: `GET /api/v1/reports/patients`
Generates patient acquisition, demographic cohorts, and retention analytics.

- **Authentication**: JWT Required
- **RBAC Roles**: `CLINIC_MANAGER`, `CLINIC_OWNER`
- **Query Parameters**:
  - `startDate` (ISO 8601 string, required)
  - `endDate` (ISO 8601 string, required)

#### Response 200 OK
```json
{
  "success": true,
  "data": {
    "newPatientsCount": 42,
    "returningPatientsCount": 118,
    "returningRatioPercentage": 73.75,
    "ageDistribution": [
      { "cohort": "<18", "count": 15 },
      { "cohort": "18-35", "count": 55 },
      { "cohort": "36-50", "count": 48 },
      { "cohort": ">50", "count": 42 }
    ],
    "genderDistribution": [
      { "gender": "FEMALE", "count": 92 },
      { "gender": "MALE", "count": 68 }
    ]
  },
  "meta": { "timestamp": "2026-08-01T01:30:00.000Z" }
}
```

---

### 3.6 Endpoint 6: `GET /api/v1/reports/appointments`
Generates appointment volume, cancellation ratios, and queue waiting time metrics.

- **Authentication**: JWT Required
- **RBAC Roles**: `RECEPTIONIST`, `CLINIC_MANAGER`, `CLINIC_OWNER`
- **Query Parameters**:
  - `startDate` (ISO 8601 string, required)
  - `endDate` (ISO 8601 string, required)

#### Response 200 OK
```json
{
  "success": true,
  "data": {
    "totalAppointments": 210,
    "completedCount": 175,
    "canceledCount": 20,
    "noShowCount": 15,
    "cancellationRatePercentage": 9.52,
    "noShowRatePercentage": 7.14,
    "averageWaitTimeMinutes": 12.4,
    "averageConsultationTimeMinutes": 18.6
  },
  "meta": { "timestamp": "2026-08-01T01:30:00.000Z" }
}
```

---

### 3.7 Endpoint 7: `GET /api/v1/reports/medical`
Generates anonymized clinical procedure and diagnosis frequency analytics.

- **Authentication**: JWT Required
- **RBAC Roles**: `DOCTOR`, `CLINIC_MANAGER`, `CLINIC_OWNER`
- **Security Rule**: Zero Patient Identifiable Information (PII) is included in response payloads.
- **Query Parameters**:
  - `startDate` (ISO 8601 string, required)
  - `endDate` (ISO 8601 string, required)

#### Response 200 OK
```json
{
  "success": true,
  "data": {
    "topDiagnoses": [
      { "code": "I10", "description": "Essential (primary) hypertension", "occurrenceCount": 38 },
      { "code": "E11", "description": "Type 2 diabetes mellitus", "occurrenceCount": 29 }
    ],
    "commonProcedures": [
      { "code": "99213", "description": "Office Consultation Level 3", "occurrenceCount": 84 },
      { "code": "93000", "description": "Electrocardiogram Complete", "occurrenceCount": 22 }
    ]
  },
  "meta": { "timestamp": "2026-08-01T01:30:00.000Z" }
}
```

---

### 3.8 Endpoint 8: `GET /api/v1/reports/operations`
Generates operational reception performance, security login audit, and backup status reports.

- **Authentication**: JWT Required
- **RBAC Roles**: `CLINIC_MANAGER`, `CLINIC_OWNER`, `SUPER_ADMIN` (Platform Backup Stats Only)
- **Query Parameters**:
  - `startDate` (ISO 8601 string, required)
  - `endDate` (ISO 8601 string, required)

#### Response 200 OK
```json
{
  "success": true,
  "data": {
    "receptionPerformance": { "averageCheckInDurationSeconds": 45 },
    "securityAudit": { "successfulLogins": 420, "failedLoginAttempts": 3, "lockoutEvents": 0 },
    "databaseBackupHistory": [
      { "jobId": "job_991", "status": "SUCCESS", "completedAt": "2026-08-01T00:00:00.000Z", "fileSizeBytes": 45891200 }
    ]
  },
  "meta": { "timestamp": "2026-08-01T01:30:00.000Z" }
}
```

---

### 3.9 Endpoint 9: `GET /api/v1/reports/history`
Lists historical report snapshots with pagination, filtering, and search.

- **Authentication**: JWT Required
- **RBAC Roles**: `ACCOUNTANT`, `CLINIC_MANAGER`, `CLINIC_OWNER`
- **Query Parameters**: `page`, `limit`, `search`, `reportCategory`, `startDate`, `endDate`, `sortBy`, `sortOrder`.

#### Response 200 OK
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "_id": "rpt_202608_00001",
        "reportNumber": "RPT-202608-00001",
        "title": "Monthly Profit and Loss Statement - July 2026",
        "reportType": "FINANCIAL_PROFIT_LOSS",
        "reportCategory": "FINANCIAL",
        "generatedAt": "2026-08-01T01:15:00.000Z",
        "generatedBy": "usr_manager_01",
        "exported": true
      }
    ],
    "pagination": { "totalItems": 1, "totalPages": 1, "currentPage": 1, "limit": 20 }
  },
  "meta": { "timestamp": "2026-08-01T01:30:00.000Z" }
}
```

---

### 3.10 Endpoint 10: `GET /api/v1/reports/history/:id`
Retrieves full details of a specific historical report snapshot.

- **Authentication**: JWT Required
- **RBAC Roles**: `ACCOUNTANT`, `CLINIC_MANAGER`, `CLINIC_OWNER`

---

### 3.11 Endpoint 11: `POST /api/v1/reports/export`
Renders and downloads a report document in PDF, Excel (.xlsx), or CSV format.

- **Authentication**: JWT Required
- **RBAC Roles**: `DOCTOR` (Own), `RECEPTIONIST` (Operational), `ACCOUNTANT` (Financial), `CLINIC_MANAGER`, `CLINIC_OWNER`
- **Request Body**:
```json
{
  "reportType": "FINANCIAL_PROFIT_LOSS",
  "exportFormat": "PDF",
  "filterParams": {
    "startDate": "2026-07-01T00:00:00.000Z",
    "endDate": "2026-07-31T23:59:59.999Z"
  }
}
```

#### Response 200 OK (File Download Stream)
- Headers:
  - `Content-Type: application/pdf` (or `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` / `text/csv`)
  - `Content-Disposition: attachment; filename="Report_FINANCIAL_PROFIT_LOSS_202607.pdf"`

---

## 4. Security & RBAC Permission Scoping Matrix

| Endpoint Route | Allowed Roles | Ownership / Isolation Rule |
| --- | --- | --- |
| `GET /api/v1/reports/dashboard` | Doctor, Receptionist, Accountant, Manager, Owner | `PLATFORM_ADMIN_REPORTS_RESTRICTED` barrier enforced |
| `GET /api/v1/reports/dashboard/charts` | Accountant, Manager, Owner | Clinic tenant scope |
| `GET /api/v1/reports/financial` | Accountant, Manager, Owner | `COMPLETED` revenue & `PAID` expenses |
| `GET /api/v1/reports/doctors` | Doctor (Own), Manager, Owner | Doctor locked to `req.user.id` |
| `GET /api/v1/reports/patients` | Manager, Owner | Clinic tenant scope |
| `GET /api/v1/reports/appointments` | Receptionist, Manager, Owner | Clinic tenant scope |
| `GET /api/v1/reports/medical` | Doctor, Manager, Owner | Anonymized (Zero PII) |
| `GET /api/v1/reports/operations` | Manager, Owner, Super Admin (Platform Only) | Scoped by tenant |
| `GET /api/v1/reports/history` | Accountant, Manager, Owner | Scoped by tenant |
| `POST /api/v1/reports/export` | Authorized Roles per Report Type | Audit logged |

---

## 5. Reserved V2 Extension Endpoints

- `POST /api/v1/reports/schedules` (Create automated scheduled PDF report delivery)
- `GET /api/v1/reports/ai-insights` (AI-driven predictive revenue & no-show forecasting)

---

## 6. Verification Checklist

- [x] All 11 active endpoints specified with methods, auth, RBAC, inputs, and outputs.
- [x] Platform Owner isolation barrier (`PLATFORM_ADMIN_REPORTS_RESTRICTED`) enforced.
- [x] Financial revenue rule (`COMPLETED` visits) and expense rule (`PAID` items) specified.
- [x] Anonymized clinical data rule (zero PII) enforced for `/medical`.
- [x] Standard JSON response & error envelopes defined.
- [x] Document export endpoint (`POST /export`) with format headers defined.
- [x] Reserved V2 endpoint signatures documented.
- [x] CHANGELOG.md updated with TASK-113 entry.
