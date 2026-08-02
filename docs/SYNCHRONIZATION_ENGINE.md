# Desktop Offline Synchronization Engine Requirements Analysis

## Module Overview

The **Desktop Offline Synchronization Engine** (Module-018) is the hybrid platform backbone connecting local desktop instances with the cloud synchronization server. Built on an **Offline-First Architecture**, the desktop application operates with 100% autonomy without internet dependencies. When internet connectivity is detected, the engine transparently synchronizes data bidirectionally without interrupting clinical workflows.

---

## Core Business Principles

1. **Offline-First Autonomy**: The desktop application operates at 100% capacity offline. Internet loss never blocks clinical encounters, prescription issuing, or patient intake.
2. **Zero Clinical Work Disruption**: Synchronization executes asynchronously in background threads with low CPU and memory footprints (<5% CPU, <50MB RAM).
3. **Deterministic Conflict Resolution**: Every entity defines an explicit conflict resolution policy. Silent data loss or overwrite is strictly forbidden.
4. **Delta & Incremental Replication**: Only modified entity attributes and changed records are transmitted over the wire.
5. **Resumable Binary Uploads**: File attachments use chunked, resumable HTTP uploads so network drops do not require restarting file transfers.
6. **Multi-Tenant & Security Isolation**: Device authentication, JWT tokens, and TLS 1.3 encryption enforce tenant and clinic isolation during data transfer.
7. **Complete Event Auditability**: Every sync attempt, retry, conflict, and resolution is logged in the Audit Trail with cryptographic SHA-256 event hashing.

---

## Synchronization Scope Matrix

### Synchronized Entities (Desktop ↔ Cloud)
- **Patients**: Profile, contacts, emergency contacts, medical flags.
- **Appointments**: Slots, queue roster, status transitions, doctor assignments.
- **Medical Records**: Clinical SOAP notes, diagnoses, vital signs, physical exams.
- **Prescriptions**: Prescribed medications, dosage instructions, pharmacy fulfillment statuses.
- **Patient Files Metadata & Binaries**: Attachment records, file metadata, chunked binary blobs.
- **Dashboard & Financial Reports**: Financial encounter totals, expense records, doctor settlements.
- **Clinic Settings & Employees**: Operating hours, doctor shift rosters, staff roles, permissions.
- **Online Booking Portal Data**: Portal slot reservations, patient self-bookings.

### Excluded Local-Only Entities (Zero Cloud Replication)
- **Local AI Session Memory**: Ephemeral conversation history of the Offline AI Medical Assistant.
- **FTS5 Search Indexes**: Local SQLite FTS5 index files built on-device.
- **Temporary Operating Cache**: Local UI state, view history, and draft form inputs.
- **Local Diagnostic Logs**: Application runtime logs not designated for central telemetry.

---

## Synchronization Modes

1. **Automatic Background Sync**: Triggered periodically (e.g. every 60 seconds) or immediately on local record creation/update.
2. **Manual On-Demand Sync**: Triggered by clinic staff via "Sync Now" UI button in the desktop status bar.
3. **Initial Full Bootstrap Sync**: Executed during new clinic desktop installation to populate local SQLite database from cloud master.
4. **Incremental Delta Sync**: Fetches and pushes only records modified since `lastSyncTimestamp`.
5. **Recovery Sync**: Re-reads local queue and verifies server sequence tokens following system crashes or abrupt network termination.
6. **Forced Index Rebuild Sync**: Re-downloads entity sequence state and rebuilds local synchronization state tables in case of sequence divergence.

---

## Bidirectional Sync & Conflict Resolution Strategies

Each entity implements a designated conflict resolution strategy:

| Entity Type | Direction | Default Conflict Policy | Rationale |
| --- | --- | --- | --- |
| **Patients** | Bidirectional | **Last Write Wins (LWW)** | Most recent patient profile update takes precedence. |
| **Medical Records** | Desktop → Cloud | **Desktop Wins** | Clinical notes created at point-of-care on desktop are authoritative. |
| **Prescriptions** | Desktop → Cloud | **Desktop Wins** | Prescriptions issued by licensed physician on desktop are immutable. |
| **Appointments** | Bidirectional | **Server Wins / Queue Merge** | Prevents double-booking between online portal and clinic walk-ins. |
| **Patient Files** | Desktop → Cloud | **Desktop Wins** | Uploaded medical files on desktop take precedence. |
| **Clinic Settings** | Cloud → Desktop | **Server Wins** | Central administrative settings override local defaults. |

---

## Queue Engine & Resilience Architecture

1. **FIFO Queue Order**: Outgoing sync mutations are enqueued in an indexed SQLite operation queue table (`sync_queue`).
2. **Exponential Backoff Retry Protocol**:
   - Initial Retry: 5 seconds.
   - Secondary Retry: 15 seconds.
   - Tertiary Retry: 60 seconds.
   - Max Retry Backoff: 15 minutes (with jitter).
   - Maximum Retry Threshold: 10 attempts before flagging record as `SyncStatus = FAILED`.
3. **Prioritization Tiers**:
   - Tier 1 (Urgent): Patient bookings and queue roster updates.
   - Tier 2 (Standard): Clinical notes and prescriptions.
   - Tier 3 (Bulk): Large file attachments and analytical telemetry.

---

## Delta Synchronization & Version Vectors

- Every synchronizable database table includes tracking metadata columns:
  - `version`: Monotonically increasing sequence integer.
  - `updatedAt`: ISO 8601 UTC timestamp.
  - `syncStatus`: `PENDING` | `SYNCED` | `FAILED` | `CONFLICT`.
  - `syncVersion`: Cloud sequence counter.
- Delta queries fetch only records where `version > lastKnownServerVersion`.

---

## Security & Multi-Tenant Isolation

1. **TLS 1.3 Transport Security**: All cloud endpoint communications require TLS 1.3.
2. **Mutual Device Authentication**: Every registered desktop client possesses a unique RSA/ECDSA device certificate and API secret.
3. **JWT Token Scoping**: Bearer tokens carry explicit `tenantId`, `clinicId`, and `deviceId` claims.
4. **Tenant Isolation Guard**: Cloud sync gateway verifies `tenantId` match before persisting incoming operations.

---

## Future Extension Points (V2 Roadmap)

- **Multi-Device Local Mesh Sync**: P2P Local LAN synchronization between multiple doctor desktops in the same clinic without internet.
- **WebSocket Push Notifications**: Real-time push of online patient bookings directly to desktop UI via persistent WebSocket connection.
- **Mobile Companion Client Sync**: Direct sync with mobile tablet apps used by nurses for vital signs intake.
