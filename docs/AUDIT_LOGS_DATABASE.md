# Audit Logs Database Architecture Specification — ClinicOS

## 1. Database Strategy & Principles

The **Audit Logs Module (Module-013)** database architecture enforces an **append-only**, **immutable**, and **tamper-evident** storage strategy. Every state-modifying action or security event in **ClinicOS** generates a single, unalterable BSON record.

### Core Database Principles
1. **Append-Only Immutability**: No MongoDB update or delete operations are granted to application users or API endpoints. Records are written once and preserved permanently.
2. **Multi-Tenant Isolation**: Every collection embeds `tenantId` and `clinicId`. Compound indexes guarantee strict tenant boundaries.
3. **Platform Owner Barrier (`PLATFORM`)**: Platform system audit logs operate under `tenantId: "PLATFORM"` and are physically and logically segregated from clinic operational logs.
4. **Sanitized State Diffs**: `previousStateSummary` and `newStateSummary` store sanitized JSON key-value diffs. Passwords, JWT secrets, credit card strings, and raw medical note content are strictly stripped prior to insertion.
5. **Offline SQLite Parity**: Local desktop databases maintain DDL schemas mirror MongoDB structures, backed by local HMAC SHA-256 signatures.

---

## 2. MongoDB Collections Schema

### 2.1 `audit_logs` Collection Specification
Stores all immutable audit log entries generated across online and offline execution sessions.

```json
{
  "_id": "ObjectId",
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
    "userAgent": "ClinicOS-Desktop/2.4.0 (Windows NT 10.0; Win64; x64)",
    "operatingSystem": "Windows 11 Enterprise",
    "clientVersion": "2.4.0",
    "machineIdentifier": "HWID-9981-AB72"
  },
  "operatingMode": "ONLINE",
  "syncStatus": "SYNCED",
  "syncVersion": 1,
  "synchronizedAt": "2026-08-01T15:30:01.000Z",
  "eventTimestamp": "2026-08-01T15:30:00.000Z",
  "createdAt": "2026-08-01T15:30:00.000Z"
}
```

#### BSON Schema Validation Rules (`audit_logs`)
- `auditNumber`: String, Required, Matching `/^AUD-\d{6}-\d{5}$/`.
- `tenantId`: String, Required.
- `clinicId`: String, Required.
- `userId`: String, Required.
- `userRole`: String, Required.
- `module`: Enum [`AUTH`, `USERS`, `PATIENTS`, `APPOINTMENTS`, `MEDICAL_RECORDS`, `PRESCRIPTIONS`, `EXPENSES`, `DOCTOR_FINANCIALS`, `SYSTEM`, `CLINIC`].
- `severity`: Enum [`INFORMATION`, `WARNING`, `ERROR`, `CRITICAL`].
- `operatingMode`: Enum [`ONLINE`, `OFFLINE`].
- `syncStatus`: Enum [`SYNCED`, `PENDING_SYNC`, `SYNC_CONFLICT_RESOLVED`].

---

### 2.2 `audit_export_history` Collection Specification
Tracks all export jobs executed on the audit log registry (PDF/CSV/Excel exports).

```json
{
  "_id": "ObjectId",
  "exportId": "exp_audit_991",
  "exportNumber": "EXP-AUD-202608-001",
  "tenantId": "tenant-clinic-001",
  "clinicId": "branch-main",
  "exportedBy": "usr_mgr_01",
  "exportedAt": "2026-08-01T16:00:00.000Z",
  "exportFormat": "PDF",
  "appliedFilters": {
    "startDate": "2026-07-01",
    "endDate": "2026-07-31",
    "severity": "CRITICAL"
  },
  "recordCount": 14,
  "fileSizeBytes": 245120,
  "checksumSha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
}
```

---

### 2.3 Reserved `audit_retention_policies` Collection (V2 Extension Schema)
```json
{
  "_id": "ObjectId",
  "tenantId": "tenant-clinic-001",
  "retentionPeriodDays": 2555,
  "autoArchiveEnabled": true,
  "archiveStorageTier": "COLD_GLACIER",
  "complianceFramework": "HIPAA_7_YEARS",
  "updatedAt": "2026-08-01T00:00:00.000Z"
}
```

---

## 3. Covered Indexing Strategy

To guarantee sub-50ms search performance across millions of audit records, MongoDB compound covered indexes are established:

| Index Name | Keys & Direction | Query Purpose |
| --- | --- | --- |
| `idx_tenant_event_time` | `{ tenantId: 1, eventTimestamp: -1 }` | Default audit viewer pagination. |
| `idx_tenant_module_sev_time` | `{ tenantId: 1, module: 1, severity: 1, eventTimestamp: -1 }` | Filtered audit roster queries. |
| `idx_tenant_entity` | `{ tenantId: 1, entityType: 1, entityId: 1, eventTimestamp: -1 }` | Entity timeline reconstruction (e.g. view all changes to Patient X). |
| `idx_tenant_user_time` | `{ tenantId: 1, userId: 1, eventTimestamp: -1 }` | User forensic security investigation. |
| `idx_tenant_correlation` | `{ tenantId: 1, correlationId: 1 }` | Cross-module transaction correlation tracing. |
| `idx_sync_status` | `{ syncStatus: 1, eventTimestamp: 1 }` | Offline reconnection sync queue processing. |
| `idx_audit_number_unique` | `{ tenantId: 1, auditNumber: 1 }` | Unique sparse index for exact audit lookup. |

---

## 4. Relationship Map

The Audit Logs collection maintains non-enforced logical relationships with all core system entities via string references (`entityType` + `entityId`):

```
[Users] ──────────► (userId) ─────────────┐
[Patients] ────────► (entityId: Patient) ──┼──► [audit_logs Collection]
[Appointments] ────► (entityId: Apt) ─────┼──► (Immutable Records)
[Expenses] ────────► (entityId: Expense) ─┤
[Settlements] ─────► (entityId: Stl) ─────┘
```

---

## 5. Constraint Validation Matrix

| Constraint Code | Constraint Name | Enforcement Rule | Action on Violation |
| --- | --- | --- | --- |
| `CM-001` | Append-Only Constraint | No database user/role has `update` or `remove` privileges on `audit_logs`. | Throw MongoDB Authorization Error. |
| `CM-002` | Tenant Isolation | All queries must include `tenantId`. Cross-tenant queries prohibited. | Return empty / 404 response. |
| `CM-003` | PII/Secret Stripping | `previousStateSummary` and `newStateSummary` must not contain regex matching `/password\|token\|secret\|cvv/i`. | Interceptor strips field before DB insert. |
| `CM-004` | Sequence Formatting | `auditNumber` generated sequentially using atomic `$inc` counters. | Retry sequence allocation. |
| `CM-005` | Timestamp Preservation | `eventTimestamp` must match original execution time, even during offline sync. | Preserve original client ISO timestamp. |
| `CM-006` | Platform Owner Segregation | `SUPER_ADMIN` platform logs stored under `tenantId: PLATFORM`. | Reject clinic query attempt. |
| `CM-007` | Device Context Completion | `deviceInformation.operatingSystem` and `clientVersion` must not be null. | Populate default client metadata. |

---

## 6. Offline Desktop SQLite DDL Schema

For the desktop client offline storage engine, SQLite local tables mirror MongoDB structures:

```sql
CREATE TABLE IF NOT EXISTS local_audit_logs (
    id TEXT PRIMARY KEY,
    audit_number TEXT NOT NULL,
    tenant_id TEXT NOT NULL,
    clinic_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    user_role TEXT NOT NULL,
    user_display_name TEXT NOT NULL,
    module TEXT NOT NULL,
    event_category TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    action TEXT NOT NULL,
    severity TEXT NOT NULL,
    previous_state_json TEXT,
    new_state_json TEXT,
    correlation_id TEXT NOT NULL,
    operating_mode TEXT NOT NULL DEFAULT 'OFFLINE',
    sync_status TEXT NOT NULL DEFAULT 'PENDING_SYNC',
    event_timestamp TEXT NOT NULL,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS local_audit_hmac_signatures (
    audit_id TEXT PRIMARY KEY,
    hmac_signature TEXT NOT NULL,
    signed_at TEXT NOT NULL,
    FOREIGN KEY(audit_id) REFERENCES local_audit_logs(id)
);

CREATE INDEX IF NOT EXISTS idx_local_audit_sync ON local_audit_logs(sync_status, event_timestamp);
CREATE INDEX IF NOT EXISTS idx_local_audit_entity ON local_audit_logs(tenant_id, entity_type, entity_id);
```

---

## 7. Performance & Scalability Benchmarks

1. **Write Throughput**: Sub-5ms insertion time using single-document MongoDB writes with `{ w: 1, j: true }`.
2. **Sharding Strategy**: For high-volume multi-tenant scaling, `audit_logs` collection is sharded using compound shard key `{ tenantId: 1, eventTimestamp: 1 }`.
3. **Storage Compression**: MongoDB WiredTiger Zstandard (zstd) compression applied to reduce storage footprint by up to 70%.
