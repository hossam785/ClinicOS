# Desktop Offline Synchronization Engine API Specification

## Module Overview

This document specifies the complete RESTful IPC/API specification for the **Desktop Offline Synchronization Engine** (Module-018).

The Synchronization Gateway is the **exclusive conduit** between local desktop clients and the cloud master database server. No business module is permitted to make direct cloud HTTP requests. All communication flows through the centralized, authenticated, stateless, and idempotent Synchronization Engine API.

---

## API Architectural Principles

1. **Stateless & Idempotent Protocol**: Every sync mutation request includes a unique `idempotencyKey` and `syncVersion` to prevent duplicate applications.
2. **Mutual Device Authentication**: Every request requires both a valid JWT Bearer Token and an authenticated `X-Device-Signature` header.
3. **Resumable Chunk Transfer**: Large payloads and binary file attachments support byte-offset range requests and 5MB chunking.
4. **Tenant & Clinic Data Isolation**: Multi-tenant headers (`X-Tenant-ID`, `X-Clinic-ID`) are validated against JWT token claims.
5. **Standardized Response Envelope**: All API responses wrap data in the project's standard JSON envelope (`status`, `data`, `error`, `timestamp`).

---

## Synchronization API Catalog

### 1. Device Registration & License Binding
`POST /api/v1/sync/device/register`

- **Purpose**: Registers desktop client instance, verifies clinic license key, and issues device certificate credentials.
- **Permission**: Clinic Owner / Clinic Admin
- **Request Body**:
```json
{
  "licenseKey": "LIC-2026-CLINICOS-ENTERPRISE",
  "deviceName": "Dr. Mansoor PC (Room 1)",
  "deviceFingerprint": "hw_hash_a8f9001b223c4d5e",
  "osPlatform": "WINDOWS_11_X64",
  "appVersion": "1.0.0"
}
```
- **Response Data (201 Created)**:
```json
{
  "status": "success",
  "data": {
    "deviceId": "dev_pc_doctor_01",
    "deviceSecret": "sec_dev_991823ab881920",
    "registeredAt": "2026-08-02T19:30:00.000Z",
    "syncConfig": {
      "automaticSync": true,
      "syncIntervalSeconds": 60,
      "bandwidthLimitKbps": 10240
    }
  }
}
```

---

### 2. Device Heartbeat & Server Version Check
`POST /api/v1/sync/device/heartbeat`

- **Purpose**: Periodic ping to check server sequence vector, license validity, and maintenance flags.
- **Permission**: Authenticated Device
- **Request Body**:
```json
{
  "deviceId": "dev_pc_doctor_01",
  "currentLocalVersion": 15
}
```
- **Response Data (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "currentServerVersion": 18,
    "hasPendingServerDeltas": true,
    "licenseStatus": "ACTIVE",
    "maintenanceMode": false,
    "recommendedSyncIntervalSeconds": 60
  }
}
```

---

### 3. Initial Full Bootstrap Synchronization
`POST /api/v1/sync/initial`

- **Purpose**: Downloads initial full clinic dataset snapshot during first-time desktop client setup.
- **Permission**: Clinic Admin / Doctor
- **Request Body**:
```json
{
  "deviceId": "dev_pc_doctor_01",
  "includeAttachmentsMetadata": true
}
```
- **Response Data (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "snapshotVersion": 100,
    "totalRecords": 1250,
    "entities": {
      "patients": [],
      "appointments": [],
      "medicalRecords": [],
      "prescriptions": [],
      "clinicSettings": {}
    },
    "checksum": "f8a9100912bc09e123"
  }
}
```

---

### 4. Incremental Delta Synchronization
`POST /api/v1/sync/incremental`

- **Purpose**: Exchanges modified entity deltas bidirectionally between desktop and cloud.
- **Permission**: Authenticated Staff
- **Request Body**:
```json
{
  "deviceId": "dev_pc_doctor_01",
  "lastSyncVersion": 15,
  "outgoingMutations": [
    {
      "queueId": "sq_441209",
      "entityType": "PATIENT",
      "entityId": "pat_101",
      "operationType": "UPDATE",
      "delta": {
        "phoneNumber": "01009876543"
      },
      "localVersion": 3,
      "checksum": "e3b0c44298fc1c149afbf4c8996fb924"
    }
  ]
}
```
- **Response Data (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "newSyncVersion": 18,
    "acceptedQueueIds": ["sq_441209"],
    "conflicts": [],
    "incomingDeltas": [
      {
        "entityType": "APPOINTMENT",
        "entityId": "app_9912",
        "operationType": "CREATE",
        "delta": {
          "patientName": "Sarah Hassan",
          "appointmentDate": "2026-08-03T10:00:00.000Z"
        },
        "serverVersion": 18
      }
    ]
  }
}
```

---

### 5. Resumable Chunked File Upload
`POST /api/v1/sync/files/upload`

- **Purpose**: Uploads large patient file attachments in 5MB binary chunks.
- **Permission**: Authenticated Staff
- **Headers**:
  - `Content-Type: application/octet-stream`
  - `X-Attachment-ID: att_xray_042`
  - `X-Chunk-Index: 2`
  - `X-Total-Chunks: 5`
  - `X-Chunk-SHA256: e3b0c44298fc1c149afbf4c8996fb924`
- **Response Data (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "attachmentId": "att_xray_042",
    "chunkIndex": 2,
    "uploadedChunks": [0, 1, 2],
    "isComplete": false,
    "nextRequiredChunk": 3
  }
}
```

---

### 6. Conflict Resolution Endpoint
`POST /api/v1/sync/conflicts/:conflictId/resolve`

- **Purpose**: Manual resolution of synchronization conflicts by an authorized Clinic Admin or Doctor.
- **Permission**: Doctor / Clinic Admin
- **Request Body**:
```json
{
  "resolutionChoice": "KEEP_LOCAL", // 'KEEP_LOCAL' | 'USE_REMOTE' | 'MANUAL_MERGE'
  "mergedPayload": {
    "patientName": "Ahmed Ali",
    "phoneNumber": "01009876543"
  }
}
```
- **Response Data (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "conflictId": "sc_110293",
    "resolved": true,
    "resolvedAt": "2026-08-02T19:35:00.000Z",
    "newSyncVersion": 19
  }
}
```

---

### 7. Queue Management & Retry Trigger
`POST /api/v1/sync/queue/retry`

- **Purpose**: Triggers immediate retry for failed or delayed synchronization queue items.
- **Permission**: Clinic Admin / Doctor
- **Request Body**:
```json
{
  "retryScope": "ALL_FAILED", // 'ALL_FAILED' | 'SPECIFIC_QUEUE_IDS'
  "queueIds": ["sq_441209"]
}
```
- **Response Data (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "retriedCount": 1,
    "requeuedIds": ["sq_441209"]
  }
}
```

---

### 8. Synchronization Status & Health Summary
`GET /api/v1/sync/status`

- **Purpose**: Returns real-time health metrics of the desktop synchronization engine.
- **Permission**: Authenticated Staff
- **Response Data (200 OK)**:
```json
{
  "status": "success",
  "data": {
    "syncState": "IDLE",
    "lastSuccessfulSync": "2026-08-02T19:30:02.000Z",
    "pendingQueueCount": 0,
    "failedQueueCount": 0,
    "conflictCount": 0,
    "localSequenceVersion": 18,
    "serverSequenceVersion": 18,
    "isDeviceAuthorized": true
  }
}
```

---

## Standard Error Response Catalog

| HTTP Code | Error Code | Description | Automated Recovery Path |
| --- | --- | --- | --- |
| `400` | `INVALID_SYNC_PAYLOAD` | Outgoing delta payload malformed | Quarantine item to `sync_quarantine`; process next queue item. |
| `401` | `SYNC_TOKEN_EXPIRED` | Bearer JWT token expired | Execute background token refresh and re-send request. |
| `403` | `DEVICE_UNAUTHORIZED` | Device certificate or fingerprint invalid | Prompt Clinic Admin to re-authorize device in settings. |
| `403` | `PLATFORM_ADMIN_RESTRICTED` | Platform owner attempted clinic sync access | Reject request immediately with HTTP 403. |
| `409` | `SYNC_VERSION_CONFLICT` | Version vector mismatch | Trigger Conflict Resolution Pipeline. |
| `412` | `CHECKSUM_MISMATCH` | SHA-256 payload integrity check failed | Re-calculate hash and re-transmit payload batch. |
| `429` | `RATE_LIMIT_EXCEEDED` | Exceeded 100 requests / minute quota | Apply exponential backoff delay (15s). |
| `503` | `SYNC_GATEWAY_BUSY` | Cloud gateway undergoing maintenance | Retry request using exponential backoff schedule. |

---

## Security & Multi-Tenant Rules

1. **Strict Tenant & Clinic Header Verification**:
   - `X-Tenant-ID` and `X-Clinic-ID` MUST match the claims embedded in the signed JWT token.
2. **Platform Owner Access Barrier (`PLATFORM_ADMIN_RESTRICTED`)**:
   - Requests with `SUPER_ADMIN` or `PLATFORM` roles are forbidden from accessing `/api/v1/sync/*` data endpoints.
3. **Audit Log Non-Recursion**:
   - Audit event dispatches triggered by synchronization MUST NOT generate nested synchronization events.

---

## Future Extension APIs (V2 Roadmap)

- **`GET /api/v1/sync/mesh/peers`**: Peer-to-peer (P2P) local LAN desktop discovery endpoint for multi-doctor clinics without internet access.
- **`WS /api/v1/sync/stream`**: Persistent WebSocket change stream for instant cloud push notifications.
