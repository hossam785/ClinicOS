# Backup & Restore REST API Specification — ClinicOS

## 1. Executive Summary & Architectural Principles

The **Backup & Restore REST API Specification (Module-014)** defines the HTTP interface for managing backup archives, executing disaster recovery restores, verifying cryptographic checksums, configuring retention policies, and reconciling offline desktop backups within **ClinicOS**.

### Core API Architectural Principles
1. **Metadata-Only HTTP Interface**: Binary backup archives (`.cbk` format) are stored strictly on local desktop storage or target filesystem storage. **No binary data is transferred or returned over JSON endpoints.**
2. **Mandatory Pre-Restore Safety Snapshot**: Calling `POST /api/v1/backups/:id/restore` automatically creates an immediate `EMERGENCY_SAFETY_PRE_RESTORE` snapshot before overwriting active database or file assets, providing automatic rollback on failure.
3. **Platform Owner Barrier (`PLATFORM_ADMIN_BACKUP_RESTRICTED`)**: Requests under `tenantId: "PLATFORM"` or by `SUPER_ADMIN` are restricted to platform infrastructure backups. Clinic operational backup APIs return `403 Forbidden`.
4. **Audit of Restore Operations**: Every restore execution, backup verification, and retention policy modification automatically generates an internal audit log record.

---

## 2. Endpoint Roster & Endpoint Specifications

### 2.1 Trigger Manual / Emergency Backup
- **Method & Path**: `POST /api/v1/backups`
- **Description**: Triggers manual or emergency backup creation.
- **Headers**: `Authorization: Bearer <JWT>`, `x-tenant-id: <string>`
- **Request Body**:
```json
{
  "backupType": "MANUAL", // MANUAL | EMERGENCY
  "backupName": "Pre_Migration_Snapshot_20260801",
  "backupReason": "Manual snapshot before bulk patient archive operation"
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "data": {
    "backupId": "BK-202608-00001",
    "backupName": "Pre_Migration_Snapshot_20260801",
    "backupType": "MANUAL",
    "createdAt": "2026-08-01T15:30:00.000Z",
    "fileInformation": {
      "fileName": "BK-202608-00001.cbk",
      "fileSizeBytes": 48500200,
      "compressionRatio": 2.45
    },
    "verification": {
      "checksum": "a3f5b8c9d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8",
      "integrityStatus": "VERIFIED"
    },
    "status": {
      "backupStatus": "COMPLETED",
      "restoreCompatible": true
    }
  },
  "meta": { "timestamp": "2026-08-01T15:30:05.000Z" }
}
```

---

### 2.2 Backup Metadata Roster
- **Method & Path**: `GET /api/v1/backups`
- **Description**: Retrieves a paginated list of backup metadata records matching optional query filters.
- **Headers**: `Authorization: Bearer <JWT>`
- **Query Parameters**:
  - `page` (optional, default: `1`)
  - `limit` (optional, default: `20`, max: `100`)
  - `backupType` (optional, enum: `MANUAL`, `AUTOMATIC`, `PRE_UPGRADE`, `EMERGENCY`, `SAFETY_PRE_RESTORE`)
  - `integrityStatus` (optional, enum: `UNVERIFIED`, `VERIFIED`, `CORRUPTED`)
  - `startDate` (optional, ISO 8601 string)
  - `endDate` (optional, ISO 8601 string)
  - `search` (optional, string)
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "_id": "60d5ecb8b5c9c22b10a5b900",
        "backupId": "BK-202608-00001",
        "backupName": "Daily_Auto_20260801",
        "backupType": "AUTOMATIC",
        "createdAt": "2026-08-01T00:00:00.000Z",
        "fileInformation": {
          "fileName": "BK-202608-00001.cbk",
          "fileSizeBytes": 48500200
        },
        "verification": {
          "integrityStatus": "VERIFIED"
        },
        "status": {
          "backupStatus": "COMPLETED",
          "restoreCompatible": true
        }
      }
    ],
    "pagination": {
      "totalItems": 15,
      "totalPages": 1,
      "currentPage": 1,
      "limit": 20,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  },
  "meta": { "timestamp": "2026-08-01T15:35:00.000Z" }
}
```

---

### 2.3 Backup Details & Preview Inspector
- **Method & Path**: `GET /api/v1/backups/:id`
- **Description**: Inspects complete metadata, file properties, schema versions, and content scope for a backup archive.
- **Headers**: `Authorization: Bearer <JWT>`
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "_id": "60d5ecb8b5c9c22b10a5b900",
    "backupId": "BK-202608-00001",
    "backupName": "Daily_Auto_20260801",
    "backupType": "AUTOMATIC",
    "backupReason": "Scheduled Daily System Protection",
    "createdBy": "usr_system",
    "createdAt": "2026-08-01T00:00:00.000Z",
    "applicationVersion": "2.4.0",
    "databaseVersion": "2.4.0",
    "schemaVersion": 14,
    "contentScope": {
      "databaseIncluded": true,
      "uploadedFilesIncluded": true,
      "attachmentsIncluded": true,
      "auditLogsIncluded": true,
      "reportsIncluded": true,
      "settingsIncluded": true
    },
    "fileInformation": {
      "filePath": "C:/ClinicOS/backups/BK-202608-00001.cbk",
      "fileName": "BK-202608-00001.cbk",
      "fileSizeBytes": 48500200,
      "compressionRatio": 2.45
    },
    "security": {
      "encrypted": true,
      "encryptionAlgorithm": "AES-256-GCM",
      "keyDerivationAlgorithm": "Argon2id"
    },
    "verification": {
      "checksum": "a3f5b8c9d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8",
      "checksumAlgorithm": "SHA-256",
      "integrityStatus": "VERIFIED",
      "verificationDate": "2026-08-01T00:01:15.000Z"
    },
    "status": {
      "backupStatus": "COMPLETED",
      "restoreCompatible": true,
      "archived": false
    }
  },
  "meta": { "timestamp": "2026-08-01T15:35:00.000Z" }
}
```

---

### 2.4 Cryptographic Backup Checksum Verification
- **Method & Path**: `POST /api/v1/backups/:id/verify`
- **Description**: Triggers SHA-256 checksum and database schema compatibility verification over a backup archive.
- **Headers**: `Authorization: Bearer <JWT>`
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "verificationId": "VRF-202608-00001",
    "backupId": "BK-202608-00001",
    "verificationResult": "PASSED",
    "checksumVerified": true,
    "databaseVerified": true,
    "attachmentVerified": true,
    "executionTimeMs": 320,
    "verifiedAt": "2026-08-01T15:36:00.000Z"
  },
  "meta": { "timestamp": "2026-08-01T15:36:00.000Z" }
}
```

---

### 2.5 Execute System Restore
- **Method & Path**: `POST /api/v1/backups/:id/restore`
- **Description**: Executes system disaster restore after creating mandatory `EMERGENCY_SAFETY_PRE_RESTORE` snapshot.
- **Headers**: `Authorization: Bearer <JWT>`
- **Request Body**:
```json
{
  "confirmationPhrase": "CONFIRM_RESTORE_BRANCH_MAIN",
  "reason": "Disaster recovery after database corruption event"
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "restoreId": "RST-202608-00001",
    "backupId": "BK-202608-00001",
    "safetyBackupId": "BK-202608-0002_SAFETY",
    "restoreStatus": "COMPLETED",
    "rollbackPerformed": false,
    "durationMs": 4250,
    "restoredAt": "2026-08-01T15:37:00.000Z",
    "message": "System successfully restored. Application restart required."
  },
  "meta": { "timestamp": "2026-08-01T15:37:05.000Z" }
}
```

---

### 2.6 Restore History Roster
- **Method & Path**: `GET /api/v1/backups/restores`
- **Description**: Retrieves history of all system restore attempts referencing target and safety backup IDs.
- **Headers**: `Authorization: Bearer <JWT>`
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "restores": [
      {
        "restoreId": "RST-202608-00001",
        "backupId": "BK-202608-00001",
        "safetyBackupId": "BK-202608-0002_SAFETY",
        "restoredBy": "usr_mgr_01",
        "restoredAt": "2026-08-01T15:37:00.000Z",
        "restoreStatus": "COMPLETED",
        "durationMs": 4250
      }
    ]
  },
  "meta": { "timestamp": "2026-08-01T15:38:00.000Z" }
}
```

---

### 2.7 Retention Policy Inspector & Configuration
- **Method & Path**: `GET /api/v1/backups/retention` / `PUT /api/v1/backups/retention`
- **Description**: Retrieves or updates clinic backup retention governance policy.
- **Headers**: `Authorization: Bearer <JWT>`
- **PUT Request Body**:
```json
{
  "retentionMode": "LAST_10", // LAST_5 | LAST_10 | LAST_20 | UNLIMITED
  "retentionCount": 10,
  "autoCleanupEnabled": true
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "tenantId": "tenant-clinic-001",
    "retentionMode": "LAST_10",
    "retentionCount": 10,
    "autoCleanupEnabled": true,
    "lastCleanupDate": "2026-08-01T00:02:00.000Z"
  },
  "meta": { "timestamp": "2026-08-01T15:39:00.000Z" }
}
```

---

### 2.8 Backup Statistics Overview
- **Method & Path**: `GET /api/v1/backups/statistics`
- **Description**: Returns aggregated metrics summarizing total backups, verified status, storage consumption, and health.
- **Headers**: `Authorization: Bearer <JWT>`
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "totalBackupsCount": 15,
    "verifiedBackupsCount": 14,
    "corruptedBackupsCount": 0,
    "totalRestoreCount": 1,
    "totalStorageSizeBytes": 727503000,
    "lastBackupDate": "2026-08-01T00:00:00.000Z",
    "systemHealthStatus": "HEALTHY"
  },
  "meta": { "timestamp": "2026-08-01T15:40:00.000Z" }
}
```

---

### 2.9 Offline Desktop Backup Metadata Sync
- **Method & Path**: `POST /api/v1/backups/sync`
- **Description**: Reconciles local desktop backup metadata with cloud metadata upon reconnection.
- **Headers**: `Authorization: Bearer <JWT>`
- **Request Body**:
```json
{
  "localBackupMetadata": [
    {
      "backupId": "BK-OFF-001",
      "backupName": "Offline_Backup_20260801",
      "backupType": "MANUAL",
      "fileSizeBytes": 45000000,
      "checksum": "f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2",
      "createdAt": "2026-08-01T12:00:00.000Z"
    }
  ]
}
```
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "syncedCount": 1,
    "ignoredCount": 0,
    "syncedIds": ["BK-OFF-001"]
  },
  "meta": { "timestamp": "2026-08-01T15:41:00.000Z" }
}
```

---

## 3. RBAC & Security Permission Matrix

| API Endpoint | ClinicOwner / Manager | Doctor | Receptionist | SUPER_ADMIN (Platform) |
| --- | --- | --- | --- | --- |
| `POST /backups` | `ALLOWED` | `FORBIDDEN` | `FORBIDDEN` | `PLATFORM_ONLY` |
| `GET /backups` | `ALLOWED` | `FORBIDDEN` | `FORBIDDEN` | `PLATFORM_ONLY` |
| `GET /backups/:id` | `ALLOWED` | `FORBIDDEN` | `FORBIDDEN` | `PLATFORM_ONLY` |
| `POST /backups/:id/verify` | `ALLOWED` | `FORBIDDEN` | `FORBIDDEN` | `PLATFORM_ONLY` |
| `POST /backups/:id/restore` | `ALLOWED` | `FORBIDDEN` | `FORBIDDEN` | `FORBIDDEN (Clinic Data)` |
| `GET /backups/restores` | `ALLOWED` | `FORBIDDEN` | `FORBIDDEN` | `PLATFORM_ONLY` |
| `GET /backups/retention` | `ALLOWED` | `FORBIDDEN` | `FORBIDDEN` | `PLATFORM_ONLY` |
| `PUT /backups/retention` | `ALLOWED` | `FORBIDDEN` | `FORBIDDEN` | `PLATFORM_ONLY` |
| `GET /backups/statistics` | `ALLOWED` | `FORBIDDEN` | `FORBIDDEN` | `PLATFORM_ONLY` |

---

## 4. Error Response Catalog

| HTTP Status | Error Code | Description / Trigger Cause |
| --- | --- | --- |
| `400 Bad Request` | `INVALID_BACKUP_NAME` | Backup label contains forbidden characters or exceeds length limits. |
| `400 Bad Request` | `INVALID_RETENTION_MODE` | Unrecognized retention policy enum provided. |
| `400 Bad Request` | `INSUFFICIENT_STORAGE` | Available disk storage space is less than estimated backup size. |
| `401 Unauthorized` | `UNAUTHORIZED` | Authorization Bearer header missing or invalid JWT. |
| `403 Forbidden` | `PLATFORM_ADMIN_BACKUP_RESTRICTED` | SUPER_ADMIN attempting to access clinic backup operations. |
| `403 Forbidden` | `BACKUP_ACCESS_RESTRICTED` | Unauthorized role (e.g. Doctor) attempting to access backup APIs. |
| `404 Not Found` | `BACKUP_NOT_FOUND` | Backup ID does not exist or belongs to another tenant. |
| `409 Conflict` | `VERSION_MISMATCH` | Backup database schema version incompatible with active app version. |
| `422 Unprocessable` | `CHECKSUM_MISMATCH` | SHA-256 digest validation failed (backup archive corrupted). |
| `500 Internal Error` | `SAFETY_SNAPSHOT_FAILED` | Pre-restore safety backup creation failed. Restore aborted. |
| `500 Internal Error` | `RESTORE_FAILED_ROLLBACK_EXECUTED` | Data replacement error occurred. Automatic rollback executed. |

---

## 5. Reserved V2 API Extension Signatures

1. `POST /api/v1/backups/cloud/upload`: Upload encrypted backup container to cloud storage provider.
2. `POST /api/v1/backups/cloud/sync`: Synchronize local backup index with cloud storage index.
3. `POST /api/v1/backups/verify-digital-signature`: Validate cryptographic digital signature of backup container.
