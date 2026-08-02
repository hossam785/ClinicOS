# Backup & Restore Business Requirements Specification — ClinicOS

## 1. Executive Summary & Module Purpose

The **Backup & Restore Module (Module-014)** provides enterprise data protection, disaster recovery, and data resilience for **ClinicOS**. Operating under an **Offline-First Desktop Primary Architecture**, the module guarantees that all medical records, patient charts, financial settlements, prescriptions, appointments, notifications, audit trails, and system configurations are protected against hardware failure, ransomware attacks, software upgrades, and user mistakes.

### Key Architectural Principles
1. **Offline-First Resilience**: Full backup creation, cryptographic verification, and system restore operations execute locally on the desktop application without requiring internet connectivity.
2. **AES-256-GCM Encryption**: All backup archives (`.cbk` format) are encrypted using AES-256-GCM with key derivation via Argon2id. Passwords themselves are never stored.
3. **Mandatory Pre-Restore Safety Snapshot**: The system automatically generates an immediate emergency safety backup (`EMERGENCY_SAFETY_PRE_RESTORE`) prior to executing any restore operation, guaranteeing automatic rollback capabilities in case of failure.
4. **Platform Owner Barrier (`PLATFORM_ADMIN_BACKUP_RESTRICTED`)**: System infrastructure backups under `tenantId: "PLATFORM"` or by `SUPER_ADMIN` are strictly separated from clinic operational backups. Platform owners cannot read or extract clinic backup contents.
5. **Zero Emojis & Audit Logging**: Iconography strictly adheres to Lucide React SVG components. Every backup creation, verification, restore attempt, and deletion event automatically writes an immutable audit record.

---

## 2. Backup Taxonomy & Operational Scope

### 2.1 Backup Types
- **Manual Backup**: Initiated on-demand by a Clinic Manager or Administrator.
- **Automatic Backup**: Scheduled background execution based on active clinic configuration:
  - *Options*: Every Login, Daily (Midnight), Weekly (Sunday 02:00 UTC), Monthly (1st of month).
  - *Constraint*: Only one automatic schedule can be active at a time.
- **Pre-Upgrade Backup**: Automatically triggered before executing application updates or database migration scripts. Mandatory and unskippable.
- **Emergency Backup**: Instant, high-priority snapshot created prior to performing high-risk administrative operations.

### 2.2 Backup Inclusions vs. Exclusions

| Included in Backup Container (`.cbk`) | Excluded from Backup Container |
| --- | --- |
| Database Collections (Patients, Appointments, Medical Records) | Temporary Browser / Desktop Cache |
| Prescriptions & Financial Settlements Data | System Runtime Debug Logs |
| Expenses, Categories, & Doctor Financial Accounts | Active User Session Tokens |
| Complete Audit Log Registry | Ephemeral PDF Preview Caches |
| System Settings & Clinic Configurations | Unsent Local Crash Dump Files |
| Local File Attachments & Patient Scans | Temporary Build Artifacts |

---

## 3. Restore Modes & Disaster Recovery Workflows

### 3.1 Restore Modes
1. **Full System Restore**: Replaces current active database and local attachment storage with the exact state from the selected backup archive.
2. **Point-in-Time Restore**: Restores data back to a specific timestamped backup snapshot selected from backup history.
3. **Preview Restore**: Safe inspection mode that reads backup metadata (date, app version, database schema version, record counts, file size) without modifying active database state.

### 3.2 Pre-Restore Safety Workflow
```
[User Selects Backup Archive]
             |
             v
[Inspect Backup Preview & Checksum Validation]
             |
             v
[Generate Mandatory Pre-Restore Safety Snapshot (EMERGENCY_SAFETY_PRE_RESTORE)]
             |
             v
[Execute Database & File System Restore Operation]
             |
   +---------+---------+
   |                   |
[SUCCESS]           [FAILURE]
   |                   |
[Audit Log Logged]  [Automatic Rollback to Pre-Restore Safety Snapshot]
```

---

## 4. Retention Policy & Storage Governance

The system enforces automated retention policies to manage local disk storage while protecting critical historical snapshots.

### 4.1 Retention Configurations
- **Last 5 Verified Backups** (Default)
- **Last 10 Verified Backups**
- **Last 20 Verified Backups**
- **Unlimited Retention** (Manual cleanup required)

### 4.2 Automated Cleanup Invariants
1. **Protected Newest Backup Rule**: The most recent verified backup is permanently protected and can **never** be deleted automatically by retention policy rules.
2. **Pre-Upgrade Protection**: Pre-upgrade backups are tagged as immutable for at least 30 days regardless of retention settings.

---

## 5. RBAC Security & Multi-Tenant Permission Matrix

| Operation | ClinicOwner / Manager | Doctor | Receptionist | SUPER_ADMIN (Platform) |
| --- | --- | --- | --- | --- |
| Create Manual Backup | `ALLOWED` | `FORBIDDEN` | `FORBIDDEN` | `PLATFORM_ONLY` |
| View Backup History | `ALLOWED` | `FORBIDDEN` | `FORBIDDEN` | `PLATFORM_ONLY` |
| Preview Backup Archive | `ALLOWED` | `FORBIDDEN` | `FORBIDDEN` | `PLATFORM_ONLY` |
| Verify Backup Checksum | `ALLOWED` | `FORBIDDEN` | `FORBIDDEN` | `PLATFORM_ONLY` |
| Execute Restore Operation | `ALLOWED` | `FORBIDDEN` | `FORBIDDEN` | `FORBIDDEN (Clinic Data)` |
| Configure Retention Schedule | `ALLOWED` | `FORBIDDEN` | `FORBIDDEN` | `PLATFORM_ONLY` |

---

## 6. Security, Encryption & Integrity Verification

1. **AES-256-GCM Encryption**: Backup files are encrypted before writing to disk. The secret key is derived using Argon2id with a unique per-tenant salt.
2. **Cryptographic SHA-256 Checksum**: Every backup package contains a signed manifest with SHA-256 hashes of all internal database tables and file assets.
3. **Tamper Detection**: If any byte in the backup archive is modified or corrupted, checksum validation fails, preventing execution of invalid restore operations.

---

## 7. Offline Architecture & Sync Reconciliation

- **Local Execution**: All backup generation and restore processes execute against local SQLite and file storage without internet access.
- **Sync Vector Preservation**: Restoring a backup retains local HMAC sync sequence vectors, ensuring that when the application reconnects online, cloud synchronization reconciles seamlessly without generating duplicate records or overwriting remote changes inappropriately.

---

## 8. Reserved V2 Extension Roadmap (Documentation Only)

1. **Cloud Storage Integration**: Direct encrypted backup upload to Google Drive, OneDrive, Dropbox, and AWS S3.
2. **Incremental & Differential Backups**: Block-level delta backups to minimize archive file size.
3. **NAS / Local Network Target Integration**: Automatic network storage replication for multi-room clinic desktop setups.
