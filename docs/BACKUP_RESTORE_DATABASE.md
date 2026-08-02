# Backup & Restore Database Architecture Specification — ClinicOS

## 1. Executive Summary & Strategy

The **Backup & Restore Database Architecture (Module-014)** defines the data storage strategy for metadata, integrity verifications, execution histories, and retention governance in **ClinicOS**.

### Core Database Architectural Principles
1. **Metadata-Only Database Architecture**: Binary backup archives (`.cbk` format containing SQLite data and files) reside strictly on the local filesystem or designated target storage. **No binary blobs are stored inside the database.**
2. **Immutable Backup & Restore Records**: Backup metadata and restore history records are permanently immutable upon creation, with the sole exception of verification status updates.
3. **Mandatory Safety Backup Reference**: Every restore history entry must store a reference to both the target backup ID (`backupId`) and the mandatory pre-restore safety snapshot ID (`safetyBackupId`).
4. **Platform Owner Barrier (`PLATFORM_ADMIN_BACKUP_RESTRICTED`)**: Database collections operate under strict `tenantId` scoping. System backups under `tenantId: "PLATFORM"` or by `SUPER_ADMIN` are stored separately from clinic operational metadata.

---

## 2. MongoDB Collection Schemas

### 2.1 Collection: `backup_metadata`
Stores metadata, file properties, encryption settings, and checksums for all backup packages.

```javascript
{
  "_id": ObjectId("60d5ecb8b5c9c22b10a5b900"),
  "backupId": "BK-202608-00001",
  "tenantId": "tenant-clinic-001",
  "clinicId": "branch-main",
  "backupName": "Daily_Auto_20260801",
  "backupType": "AUTOMATIC", // MANUAL | AUTOMATIC | PRE_UPGRADE | EMERGENCY | SAFETY_PRE_RESTORE
  "backupReason": "Scheduled Daily System Protection",
  "createdBy": "usr_system",
  "createdAt": ISODate("2026-08-01T00:00:00.000Z"),
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
    "compressionMethod": "ZIP_AES",
    "compressionRatio": 2.45
  },
  "security": {
    "encrypted": true,
    "encryptionAlgorithm": "AES-256-GCM",
    "keyDerivationAlgorithm": "Argon2id",
    "passwordProtected": true
  },
  "verification": {
    "checksum": "a3f5b8c9d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8",
    "checksumAlgorithm": "SHA-256",
    "integrityStatus": "VERIFIED", // UNVERIFIED | VERIFIED | CORRUPTED
    "verificationDate": ISODate("2026-08-01T00:01:15.000Z"),
    "verifiedBy": "usr_system"
  },
  "status": {
    "backupStatus": "COMPLETED", // IN_PROGRESS | COMPLETED | FAILED
    "restoreCompatible": true,
    "archived": false
  }
}
```

---

### 2.2 Collection: `backup_restore_history`
Tracks every system restore attempt, referencing the target backup and pre-restore safety snapshot.

```javascript
{
  "_id": ObjectId("60d5ecb8b5c9c22b10a5b910"),
  "restoreId": "RST-202608-00001",
  "backupId": "BK-202608-00001",
  "safetyBackupId": "BK-202608-00002_SAFETY",
  "tenantId": "tenant-clinic-001",
  "clinicId": "branch-main",
  "restoredBy": "usr_mgr_01",
  "restoredAt": ISODate("2026-08-01T14:30:00.000Z"),
  "restoreStatus": "COMPLETED", // COMPLETED | FAILED | ROLLBACK_EXECUTED
  "rollbackPerformed": false,
  "durationMs": 4250,
  "applicationVersion": "2.4.0",
  "databaseVersion": "2.4.0"
}
```

---

### 2.3 Collection: `backup_retention_policies`
Stores retention configurations and automatic cleanup history for each clinic tenant.

```javascript
{
  "_id": ObjectId("60d5ecb8b5c9c22b10a5b920"),
  "tenantId": "tenant-clinic-001",
  "clinicId": "branch-main",
  "retentionMode": "LAST_5", // LAST_5 | LAST_10 | LAST_20 | UNLIMITED
  "retentionCount": 5,
  "autoCleanupEnabled": true,
  "lastCleanupDate": ISODate("2026-08-01T00:02:00.000Z"),
  "updatedBy": "usr_mgr_01",
  "updatedAt": ISODate("2026-07-15T10:00:00.000Z")
}
```

---

### 2.4 Collection: `backup_verification_history`
Stores full verification audit logs for checksum checks and pre-restore validation scans.

```javascript
{
  "_id": ObjectId("60d5ecb8b5c9c22b10a5b930"),
  "verificationId": "VRF-202608-00001",
  "backupId": "BK-202608-00001",
  "tenantId": "tenant-clinic-001",
  "clinicId": "branch-main",
  "verificationType": "PRE_RESTORE", // MANUAL | PRE_RESTORE | AUTOMATIC
  "verificationResult": "PASSED", // PASSED | FAILED
  "checksumVerified": true,
  "databaseVerified": true,
  "attachmentVerified": true,
  "executionTimeMs": 320,
  "verifiedAt": ISODate("2026-08-01T14:29:30.000Z")
}
```

---

## 3. Covered Indexing Strategy

```javascript
// Backup Metadata Covered Indexes
db.backup_metadata.createIndex({ "tenantId": 1, "createdAt": -1 }, { name: "idx_tenant_created" });
db.backup_metadata.createIndex({ "tenantId": 1, "backupType": 1, "status.backupStatus": 1, "createdAt": -1 }, { name: "idx_tenant_type_status" });
db.backup_metadata.createIndex({ "tenantId": 1, "backupId": 1 }, { unique: true, name: "idx_tenant_backup_id" });
db.backup_metadata.createIndex({ "tenantId": 1, "verification.integrityStatus": 1 }, { name: "idx_tenant_integrity" });

// Restore History Covered Indexes
db.backup_restore_history.createIndex({ "tenantId": 1, "restoredAt": -1 }, { name: "idx_restore_tenant_created" });
db.backup_restore_history.createIndex({ "tenantId": 1, "backupId": 1 }, { name: "idx_restore_backup_id" });
```

---

## 4. Constraint Validation Matrix

| Constraint ID | Target Entity | Rule Description | Enforcement |
| --- | --- | --- | --- |
| `CM-001` | `backup_metadata` | `backupId` must match pattern `BK-YYYYMM-XXXXX` and be unique per tenant. | Schema Validation / Index |
| `CM-002` | `backup_metadata` | `fileInformation.fileSizeBytes` must be greater than zero. | Application / BSON Guard |
| `CM-003` | `backup_metadata` | `verification.checksum` must be a valid 64-character hex SHA-256 string. | Regex Schema Validation |
| `CM-004` | `backup_restore_history` | Every restore entry must reference `backupId` AND `safetyBackupId`. | Foreign Key Reference |
| `CM-005` | `backup_retention_policies` | `retentionMode` must be one of `LAST_5`, `LAST_10`, `LAST_20`, `UNLIMITED`. | Enum Schema Validation |
| `CM-006` | Immutability | Backup metadata records are non-editable except verification status. | Controller Guard |
| `CM-007` | Isolation | `tenantId: "PLATFORM"` backups isolated from clinic operational queries. | Middleware Filter Guard |

---

## 5. Desktop Offline SQLite DDL Specification

```sql
-- Desktop Local Backup Metadata Table
CREATE TABLE IF NOT EXISTS local_backup_metadata (
    id TEXT PRIMARY KEY,
    backup_id TEXT NOT NULL UNIQUE,
    tenant_id TEXT NOT NULL,
    clinic_id TEXT NOT NULL,
    backup_name TEXT NOT NULL,
    backup_type TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size_bytes INTEGER NOT NULL,
    checksum_sha256 TEXT NOT NULL,
    integrity_status TEXT NOT NULL DEFAULT 'UNVERIFIED',
    backup_status TEXT NOT NULL DEFAULT 'COMPLETED',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Desktop Local Restore History Table
CREATE TABLE IF NOT EXISTS local_restore_history (
    id TEXT PRIMARY KEY,
    restore_id TEXT NOT NULL UNIQUE,
    backup_id TEXT NOT NULL,
    safety_backup_id TEXT NOT NULL,
    tenant_id TEXT NOT NULL,
    restored_by TEXT NOT NULL,
    restore_status TEXT NOT NULL,
    restored_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## 6. Performance Benchmarks

- **Backup History Query**: Sub-20ms response time for rendering 20 records over 50,000 metadata entries.
- **Checksum Verification**: Sub-500ms execution for 50MB backup container integrity scan.
- **Index Memory Footprint**: Covered indexes occupy < 2.5MB RAM per 10,000 tenant backups.
