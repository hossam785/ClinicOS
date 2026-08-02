# Audit Logs REST API Specification — ClinicOS

## 1. Executive Summary & API Principles

The **Audit Logs REST API Specification (Module-013)** defines the HTTP interface for retrieving, inspecting, exporting, and synchronizing audit records within **ClinicOS**. 

### Core API Architectural Principles
1. **Read-Only Protocol**: The API strictly provides `GET` endpoints for retrieval and `POST` endpoints for exports and offline synchronization. **No `PUT`, `PATCH`, or `DELETE` endpoints exist.** Audit log records are permanently non-modifiable and non-deletable.
2. **Global Authentication & Tenant Scoping**: Every request requires a valid `Bearer <token>` JWT header. Middleware automatically injects `tenantId` and `clinicId` context.
3. **Platform Owner Barrier (`PLATFORM_ADMIN_AUDIT_RESTRICTED`)**: Requests under `tenantId: "PLATFORM"` or by `SUPER_ADMIN` are restricted to platform system logs. Clinic operational audit endpoints return `403 Forbidden`.
4. **Audit of Audit Access**: Every audit view, search query, and export request automatically creates an internal audit record to guarantee zero unmonitored surveillance.

---

## 2. Endpoint Roster & Endpoint Specifications

### 2.1 Audit Log Roster
- **Method & Path**: `GET /api/v1/audit-logs`
- **Description**: Retrieves a paginated list of audit records matching optional query filters.
- **Headers**: `Authorization: Bearer <JWT>`, `x-tenant-id: <string>`
- **Query Parameters**:
  - `page` (optional, default: `1`, min: `1`)
  - `limit` (optional, default: `20`, max: `100`)
  - `module` (optional, enum: `AUTH`, `USERS`, `PATIENTS`, `APPOINTMENTS`, `MEDICAL_RECORDS`, `PRESCRIPTIONS`, `EXPENSES`, `DOCTOR_FINANCIALS`, `SYSTEM`, `CLINIC`)
  - `severity` (optional, enum: `INFORMATION`, `WARNING`, `ERROR`, `CRITICAL`)
  - `action` (optional, string: e.g. `PATIENT_CREATED`)
  - `userId` (optional, string: actor user ID)
  - `entityType` (optional, string: target entity class)
  - `entityId` (optional, string: target entity primary key)
  - `startDate` (optional, ISO 8601 string)
  - `endDate` (optional, ISO 8601 string)
  - `search` (optional, string: search term for auditNumber or action)
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "_id": "60d5ecb8b5c9c22b10a5b810",
        "auditNumber": "AUD-202608-00001",
        "tenantId": "tenant-clinic-001",
        "clinicId": "branch-main",
        "userId": "usr_mgr_01",
        "userRole": "ClinicAdmin",
        "userDisplayName": "Sarah Jenkins",
        "module": "FINANCIALS",
        "eventCategory": "FINANCIAL",
        "entityType": "DoctorSettlement",
        "entityId": "stl_9910",
        "action": "DOCTOR_SETTLEMENT_PAID",
        "severity": "WARNING",
        "correlationId": "corr_uuid_881920",
        "operatingMode": "ONLINE",
        "syncStatus": "SYNCED",
        "eventTimestamp": "2026-08-01T15:30:00.000Z"
      }
    ],
    "pagination": {
      "totalItems": 1420,
      "totalPages": 71,
      "currentPage": 1,
      "limit": 20,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  },
  "meta": { "timestamp": "2026-08-01T16:00:00.000Z" }
}
```

---

### 2.2 Audit Log Details Inspector
- **Method & Path**: `GET /api/v1/audit-logs/:id`
- **Description**: Inspects full metadata and state diff summaries for a specific audit entry.
- **Headers**: `Authorization: Bearer <JWT>`
- **Path Parameters**: `id` (string: ObjectId or auditNumber)
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "_id": "60d5ecb8b5c9c22b10a5b810",
    "auditNumber": "AUD-202608-00001",
    "tenantId": "tenant-clinic-001",
    "clinicId": "branch-main",
    "userId": "usr_mgr_01",
    "userRole": "ClinicAdmin",
    "userDisplayName": "Sarah Jenkins",
    "module": "FINANCIALS",
    "eventCategory": "FINANCIAL",
    "entityType": "DoctorSettlement",
    "entityId": "stl_9910",
    "action": "DOCTOR_SETTLEMENT_PAID",
    "severity": "WARNING",
    "previousStateSummary": {
      "status": "APPROVED",
      "payoutAmount": 4250.00
    },
    "newStateSummary": {
      "status": "DISBURSED",
      "disbursedAt": "2026-08-01T15:30:00.000Z",
      "disbursedBy": "usr_mgr_01"
    },
    "correlationId": "corr_uuid_881920",
    "sessionId": "sess_77192",
    "requestId": "req_99182",
    "deviceInformation": {
      "ipAddress": "192.168.1.45",
      "userAgent": "ClinicOS-Desktop/2.4.0",
      "operatingSystem": "Windows 11 Enterprise",
      "clientVersion": "2.4.0"
    },
    "operatingMode": "ONLINE",
    "syncStatus": "SYNCED",
    "eventTimestamp": "2026-08-01T15:30:00.000Z"
  },
  "meta": { "timestamp": "2026-08-01T16:00:00.000Z" }
}
```

---

### 2.3 Recent Audit Events (Widget Endpoint)
- **Method & Path**: `GET /api/v1/audit-logs/recent`
- **Description**: Optimized endpoint returning the 10 most recent system audit events for dashboard widgets.
- **Headers**: `Authorization: Bearer <JWT>`
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "recentEvents": [
      {
        "auditNumber": "AUD-202608-00042",
        "action": "PATIENT_CHECKED_IN",
        "userDisplayName": "Reception Staff",
        "severity": "INFORMATION",
        "eventTimestamp": "2026-08-01T15:55:00.000Z"
      }
    ]
  },
  "meta": { "timestamp": "2026-08-01T16:00:00.000Z" }
}
```

---

### 2.4 Critical Audit Events Roster
- **Method & Path**: `GET /api/v1/audit-logs/critical`
- **Description**: Returns unacknowledged `CRITICAL`, `ERROR`, and `WARNING` events ordered by newest first.
- **Headers**: `Authorization: Bearer <JWT>`
- **Query Parameters**: `limit` (optional, default: `10`)
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "criticalEvents": [
      {
        "_id": "60d5ecb8b5c9c22b10a5b999",
        "auditNumber": "AUD-202608-00030",
        "action": "AUTH_ACCOUNT_LOCKED",
        "userDisplayName": "Dr. Alexander Fleming",
        "severity": "CRITICAL",
        "eventTimestamp": "2026-08-01T14:10:00.000Z"
      }
    ]
  },
  "meta": { "timestamp": "2026-08-01T16:00:00.000Z" }
}
```

---

### 2.5 Audit Statistics Aggregations
- **Method & Path**: `GET /api/v1/audit-logs/statistics`
- **Description**: Returns aggregated metrics summarizing total events, event distribution by severity, module activity, and user action counts.
- **Headers**: `Authorization: Bearer <JWT>`
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "totalEventsCount": 14200,
    "severityBreakdown": {
      "INFORMATION": 12800,
      "WARNING": 1150,
      "ERROR": 210,
      "CRITICAL": 40
    },
    "moduleBreakdown": [
      { "module": "APPOINTMENTS", "count": 5200 },
      { "module": "AUTH", "count": 3100 },
      { "module": "PATIENTS", "count": 2800 },
      { "module": "FINANCIALS", "count": 1800 },
      { "module": "SYSTEM", "count": 1300 }
    ],
    "synchronizationStats": {
      "pendingSyncCount": 0,
      "syncedCount": 14200
    }
  },
  "meta": { "timestamp": "2026-08-01T16:00:00.000Z" }
}
```

---

### 2.6 Export Audit Logs
- **Method & Path**: `POST /api/v1/audit-logs/export`
- **Description**: Generates an export document statement (PDF, Excel, CSV) containing filtered audit logs.
- **Headers**: `Authorization: Bearer <JWT>`
- **Request Body**:
```json
{
  "exportFormat": "PDF",
  "filterParams": {
    "startDate": "2026-07-01",
    "endDate": "2026-07-31",
    "severity": "CRITICAL"
  }
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "exportNumber": "EXP-AUD-202608-001",
    "downloadUrl": "/api/v1/audit-logs/history/exp_audit_991",
    "format": "PDF",
    "fileName": "AuditLog_CRITICAL_20260801.pdf"
  },
  "meta": { "timestamp": "2026-08-01T16:00:00.000Z" }
}
```

---

### 2.7 Offline Synchronization Endpoint
- **Method & Path**: `POST /api/v1/audit-logs/sync`
- **Description**: Uploads a batch queue of local desktop audit records recorded while offline.
- **Headers**: `Authorization: Bearer <JWT>`
- **Request Body**:
```json
{
  "queuedAuditLogs": [
    {
      "clientRequestId": "cl_req_uuid_99182",
      "auditNumber": "AUD-OFF-202608-001",
      "module": "APPOINTMENTS",
      "action": "PATIENT_CHECKED_IN",
      "severity": "INFORMATION",
      "entityType": "Appointment",
      "entityId": "apt_88102",
      "eventTimestamp": "2026-08-01T13:15:00.000Z",
      "hmacSignature": "a3f5b8c9d1e2f3..."
    }
  ]
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "processedCount": 1,
    "duplicateCount": 0,
    "syncedIds": ["AUD-OFF-202608-001"],
    "ignoredDuplicates": []
  },
  "meta": { "timestamp": "2026-08-01T16:00:00.000Z" }
}
```

---

## 3. RBAC & Security Permission Scoping Matrix

| API Endpoint | ClinicOwner / Manager | Doctor | Receptionist | SUPER_ADMIN (Platform) |
| --- | --- | --- | --- | --- |
| `GET /audit-logs` | `ALLOWED` | `FORBIDDEN` | `FORBIDDEN` | `PLATFORM_LOGS_ONLY` |
| `GET /audit-logs/:id` | `ALLOWED` | `FORBIDDEN` | `FORBIDDEN` | `PLATFORM_LOGS_ONLY` |
| `GET /audit-logs/recent` | `ALLOWED` | `FORBIDDEN` | `FORBIDDEN` | `PLATFORM_LOGS_ONLY` |
| `GET /audit-logs/critical` | `ALLOWED` | `FORBIDDEN` | `FORBIDDEN` | `PLATFORM_LOGS_ONLY` |
| `GET /audit-logs/statistics` | `ALLOWED` | `FORBIDDEN` | `FORBIDDEN` | `PLATFORM_LOGS_ONLY` |
| `POST /audit-logs/export` | `ALLOWED` | `FORBIDDEN` | `FORBIDDEN` | `PLATFORM_LOGS_ONLY` |
| `POST /audit-logs/sync` | `ALLOWED` | `ALLOWED (Self Sync)` | `ALLOWED (Self Sync)` | `ALLOWED` |

---

## 4. Error Response Catalog

| HTTP Status | Error Code | Description / Trigger Cause |
| --- | --- | --- |
| `400 Bad Request` | `INVALID_PAGE_PARAM` | Page parameter is negative or non-integer. |
| `400 Bad Request` | `INVALID_LIMIT_PARAM` | Limit parameter is less than 1 or exceeds 100. |
| `400 Bad Request` | `INVALID_DATE_RANGE` | `startDate` is greater than `endDate`. |
| `400 Bad Request` | `INVALID_MODULE_PARAM` | Unrecognized module enum filter. |
| `400 Bad Request` | `INVALID_EXPORT_FORMAT` | Unsupported export format requested. |
| `401 Unauthorized` | `UNAUTHORIZED` | Authorization Bearer header missing or invalid token. |
| `403 Forbidden` | `PLATFORM_ADMIN_AUDIT_RESTRICTED` | SUPER_ADMIN attempting to query clinic operational logs. |
| `403 Forbidden` | `AUDIT_ACCESS_RESTRICTED` | Unauthorized role (e.g. Receptionist) attempting to read logs. |
| `404 Not Found` | `AUDIT_RECORD_NOT_FOUND` | Specified audit ID does not exist or belongs to another tenant. |

---

## 5. Reserved V2 API Extension Signatures

1. `POST /api/v1/audit-logs/siem/forward`: Stream audit logs to external SIEM tools.
2. `GET /api/v1/audit-logs/threats/detect`: Trigger AI threat detection scan over recent events.
3. `POST /api/v1/audit-logs/verify-signature`: Validate cryptographic digest signature of an audit entry.
