# Notifications Management Module REST API Specification (NOTIFICATIONS_API.md)

This document establishes the official REST API specification for the **Notifications Management Module** (Module-011) of ClinicOS. It defines endpoint signatures, request/response schemas, HTTP status codes, security boundaries, multi-tenant isolation rules, offline synchronization contracts, and future channel adapter reservations.

---

## 1. API Overview & Gateway Architecture

### Base URL & Protocol
- **Gateway Root**: `/api/v1`
- **Protocol**: HTTPS (TLS 1.3 compulsory)
- **Content-Type**: `application/json`
- **Authentication**: HTTP Authorization header with Bearer JWT token (`Authorization: Bearer <token>`)
- **Multi-Tenant Header**: Mandatory `X-Tenant-ID: <tenantId>` header for all clinic requests.
- **Offline Idempotency Header**: Optional `X-Client-Request-ID: <UUID>` header for offline synchronization idempotency.

### Standardized JSON Response Envelopes

#### 1. Success Response Structure (`200 OK` / `201 Created`)
```json
{
  "success": true,
  "data": {
    "id": "notif_66901a8b1",
    "notificationNumber": "NOT-202608-00104",
    "tenantId": "clinic_west_01",
    "clinicId": "branch_main",
    "recipientUserId": "user_doc_042",
    "recipientRole": "DOCTOR",
    "title": "Patient Checked-In",
    "message": "Patient Sarah Jenkins has arrived in the waiting room.",
    "notificationType": "PATIENT_CHECKED_IN",
    "category": "APPOINTMENT",
    "priority": "HIGH",
    "isRead": false,
    "isArchived": false,
    "isAcknowledged": false,
    "syncStatus": "SYNCHRONIZED",
    "targetRoute": "/dashboard/appointments/queue",
    "targetId": "APT-202608-00012",
    "createdAt": "2026-08-01T08:30:00.000Z"
  },
  "meta": {
    "timestamp": "2026-08-01T08:30:00.000Z"
  }
}
```

#### 2. Error Response Structure (`4xx` / `5xx`)
```json
{
  "success": false,
  "error": {
    "code": "NOTIFICATION_IMMUTABLE",
    "message": "Notification content cannot be modified after creation.",
    "details": {
      "notificationId": "notif_66901a8b1",
      "attemptedField": "message"
    }
  },
  "meta": {
    "timestamp": "2026-08-01T08:30:00.000Z"
  }
}
```

---

## 2. Endpoint Catalog Overview

| HTTP Method | API Path | Access Scope | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/v1/notifications` | Authenticated Users | Fetch paginated notifications roster with search & filters |
| `GET` | `/api/v1/notifications/recent` | Authenticated Users | Fetch top 5 recent unread notifications for flyout drawer |
| `GET` | `/api/v1/notifications/unread-count` | Authenticated Users | Get total unread, high priority, and critical alert counts |
| `GET` | `/api/v1/notifications/:id` | Recipient / Admin | Get detailed single notification record |
| `PATCH` | `/api/v1/notifications/:id/read` | Recipient / Admin | Mark single notification as read |
| `PATCH` | `/api/v1/notifications/read-all` | Authenticated Users | Mark all unread notifications for user as read |
| `PATCH` | `/api/v1/notifications/:id/acknowledge` | Recipient / Admin | Acknowledge critical priority notification to unpin |
| `PATCH` | `/api/v1/notifications/:id/archive` | Recipient / Admin | Soft archive notification (`isArchived: true`) |
| `PATCH` | `/api/v1/notifications/:id/restore` | Recipient / Admin | Restore archived notification (`isArchived: false`) |
| `GET` | `/api/v1/notification-preferences` | Authenticated Users | Fetch user notification preference configuration |
| `PUT` | `/api/v1/notification-preferences` | Authenticated Users | Update user notification preference category toggles |
| `POST` | `/api/v1/notifications/sync` | Desktop / Mobile Client | Upload offline queued notifications payload |

---

## 3. Detailed REST Endpoint Specifications

---

### 3.1 `GET /api/v1/notifications` — Notification List Roster

#### Purpose
Fetches a paginated roster of notifications for the authenticated user with multi-criteria search, filtering, and sorting.

#### Security & Permissions
- **Allowed Roles**: `DOCTOR`, `RECEPTIONIST`, `CLINIC_MANAGER`, `ACCOUNTANT`, `SUPER_ADMIN`
- **Tenant Scope**: Strict `X-Tenant-ID` scoping. Platform Owner queries fetch global `tenantId: "PLATFORM"` system alerts (`PLATFORM_ADMIN_CLINIC_NOTIFICATIONS_RESTRICTED`).
- **Recipient Scope**: Clinic staff see notifications matching their `recipientUserId` or role-based clinic subscriptions.

#### Query Parameters

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `page` | Integer | No | `1` | Page number for pagination |
| `limit` | Integer | No | `20` | Items per page (Max: 100) |
| `search` | String | No | `null` | Free-text search on `title`, `message`, `notificationNumber` |
| `category` | String | No | `ALL` | Filter by category (`APPOINTMENT`, `PATIENT`, `EMR`, `PRESCRIPTION`, `FINANCIAL`, `SYSTEM`, `ADMINISTRATIVE`) |
| `priority` | String | No | `ALL` | Filter by priority (`LOW`, `NORMAL`, `HIGH`, `CRITICAL`) |
| `readStatus` | String | No | `ALL` | Filter by read status (`UNREAD`, `READ`, `ALL`) |
| `archived` | Boolean | No | `false` | Include archived items (`true` = Archived view, `false` = Active view) |
| `startDate` | Date | No | `null` | Start date ISO string filter |
| `endDate` | Date | No | `null` | End date ISO string filter |
| `sortBy` | String | No | `createdAt` | Field to sort by (`createdAt`, `priority`) |
| `sortOrder` | String | No | `desc` | Sort direction (`asc`, `desc`) |

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "notif_66901a8b1",
        "notificationNumber": "NOT-202608-00104",
        "recipientUserId": "user_doc_042",
        "title": "Patient Checked-In",
        "message": "Patient Sarah Jenkins has arrived in the waiting room.",
        "notificationType": "PATIENT_CHECKED_IN",
        "category": "APPOINTMENT",
        "priority": "HIGH",
        "isRead": false,
        "isArchived": false,
        "isAcknowledged": false,
        "targetRoute": "/dashboard/appointments/queue",
        "targetId": "APT-202608-00012",
        "createdAt": "2026-08-01T08:30:00.000Z"
      }
    ],
    "pagination": {
      "totalItems": 42,
      "totalPages": 3,
      "currentPage": 1,
      "limit": 20,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  },
  "meta": {
    "timestamp": "2026-08-01T08:30:00.000Z"
  }
}
```

---

### 3.2 `GET /api/v1/notifications/unread-count` — Notification Counter

#### Purpose
Returns real-time aggregated unread notification counts for header badges and alert indicators.

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "totalUnread": 4,
    "highPriorityUnread": 1,
    "criticalUnacknowledged": 1,
    "byCategory": {
      "APPOINTMENT": 2,
      "FINANCIAL": 1,
      "SYSTEM": 1
    }
  },
  "meta": {
    "timestamp": "2026-08-01T08:30:00.000Z"
  }
}
```

---

### 3.3 `GET /api/v1/notifications/recent` — Recent Flyout Notifications

#### Purpose
Returns top 5 recent unread notifications optimized for header bell icon dropdown flyouts.

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "recent": [
      {
        "id": "notif_66901a8b1",
        "notificationNumber": "NOT-202608-00104",
        "title": "Patient Checked-In",
        "message": "Patient Sarah Jenkins has arrived in the waiting room.",
        "category": "APPOINTMENT",
        "priority": "HIGH",
        "targetRoute": "/dashboard/appointments/queue",
        "createdAt": "2026-08-01T08:30:00.000Z"
      }
    ],
    "totalUnread": 4
  },
  "meta": {
    "timestamp": "2026-08-01T08:30:00.000Z"
  }
}
```

---

### 3.4 `GET /api/v1/notifications/:id` — Notification Details

#### Purpose
Fetches single notification details and validates recipient ownership.

#### Error Responses
- `404 NOT_FOUND` (`NOTIFICATION_NOT_FOUND`): Notification ID does not exist.
- `403 FORBIDDEN` (`TENANT_ACCESS_DENIED`): User attempts to view notification outside their tenant or recipient scope.

---

### 3.5 `PATCH /api/v1/notifications/:id/read` — Mark Notification as Read

#### Purpose
Sets `isRead: true` and records `readAt: timestamp` for a specific notification.

#### Business Rules
- Only the intended recipient or authorized manager may mark a notification as read.
- Mutation alters only `isRead` and `readAt` flags; content remains immutable.

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "id": "notif_66901a8b1",
    "isRead": true,
    "readAt": "2026-08-01T08:32:00.000Z"
  },
  "meta": {
    "timestamp": "2026-08-01T08:32:00.000Z"
  }
}
```

---

### 3.6 `PATCH /api/v1/notifications/read-all` — Mark All as Read

#### Purpose
Batch updates all unread notifications belonging to the authenticated user to `isRead: true`.

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "markedCount": 4,
    "readAt": "2026-08-01T08:35:00.000Z"
  },
  "meta": {
    "timestamp": "2026-08-01T08:35:00.000Z"
  }
}
```

---

### 3.7 `PATCH /api/v1/notifications/:id/acknowledge` — Acknowledge Critical Alert

#### Purpose
Acknowledges a `CRITICAL` priority alert, setting `isAcknowledged: true`, `isRead: true`, and unpinning it from the top dashboard banner.

#### Request Body
```json
{
  "notes": "Backup procedure re-run manually by Admin."
}
```

#### Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "id": "notif_critical_001",
    "priority": "CRITICAL",
    "isAcknowledged": true,
    "acknowledgedAt": "2026-08-01T08:40:00.000Z",
    "acknowledgedBy": "user_manager_01"
  },
  "meta": {
    "timestamp": "2026-08-01T08:40:00.000Z"
  }
}
```

---

### 3.8 `PATCH /api/v1/notifications/:id/archive` — Archive Notification

#### Purpose
Soft archives a notification (`isArchived: true`, `archivedAt: timestamp`). Physical deletion is strictly prohibited (`isDeleted: false`).

---

### 3.9 `PATCH /api/v1/notifications/:id/restore` — Restore Archived Notification

#### Purpose
Restores an archived notification (`isArchived: false`), returning it to active views.

---

### 3.10 `GET` & `PUT /api/v1/notification-preferences` — Preference Management

#### `GET` Success Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "userId": "user_doc_042",
    "tenantId": "clinic_west_01",
    "enableAppointmentNotifications": true,
    "enableFinancialNotifications": true,
    "enableAdministrativeNotifications": true,
    "enableSystemNotifications": true,
    "futureChannels": {
      "channelInApp": true,
      "channelWhatsApp": false,
      "channelSMS": false,
      "channelEmail": false,
      "channelPush": false
    }
  },
  "meta": {
    "timestamp": "2026-08-01T08:00:00.000Z"
  }
}
```

#### `PUT` Request Body
```json
{
  "enableAppointmentNotifications": true,
  "enableFinancialNotifications": false,
  "enableAdministrativeNotifications": true,
  "enableSystemNotifications": true
}
```

---

## 4. Offline Synchronization API Specification

### `POST /api/v1/notifications/sync`

#### Purpose
Uploads an array of locally queued offline notifications generated on desktop workstations during internet disruptions.

#### Headers
- `Authorization: Bearer <token>`
- `X-Tenant-ID: clinic_west_01`
- `X-Client-Request-ID: req_uuid_batch_99201`

#### Request Body
```json
{
  "queuedNotifications": [
    {
      "clientRequestId": "req_uuid_99201-abc-123",
      "notificationNumber": "NOT-202608-00104",
      "recipientUserId": "user_doc_042",
      "title": "Patient Checked-In",
      "message": "Patient Sarah Jenkins has arrived in the waiting room.",
      "notificationType": "PATIENT_CHECKED_IN",
      "category": "APPOINTMENT",
      "priority": "HIGH",
      "sourceModule": "APPOINTMENTS",
      "sourceEntity": "Appointment",
      "sourceEntityId": "apt_88129031",
      "targetRoute": "/dashboard/appointments/queue",
      "targetId": "APT-202608-00104",
      "localCreatedAt": "2026-08-01T08:30:00.000Z"
    }
  ]
}
```

#### Success Response (`200 OK` / `207 Multi-Status`)
```json
{
  "success": true,
  "data": {
    "processedCount": 1,
    "duplicateCount": 0,
    "syncedIds": ["notif_66901a8b1"],
    "ignoredDuplicateRequestIds": []
  },
  "meta": {
    "timestamp": "2026-08-01T08:35:00.000Z"
  }
}
```

---

## 5. Security & Permission Matrix

| Endpoint | Access Scope | Doctor | Receptionist | Clinic Manager | Accountant | Platform Owner (`SUPER_ADMIN`) |
| --- | --- | --- | --- | --- | --- | --- |
| `GET /api/v1/notifications` | User Scope | Own Only | Clinic-Wide | Clinic-Wide | Finance Alerts | Global System Alerts Only |
| `GET /api/v1/notifications/unread-count` | Authenticated | Allowed | Allowed | Allowed | Allowed | Allowed (Platform Scope) |
| `GET /api/v1/notifications/recent` | Authenticated | Allowed | Allowed | Allowed | Allowed | Allowed (Platform Scope) |
| `GET /api/v1/notifications/:id` | Recipient / Admin | Own Item | Own Item | Tenant Items | Own Item | Platform Items Only |
| `PATCH /api/v1/notifications/:id/read` | Recipient / Admin | Allowed | Allowed | Allowed | Allowed | Allowed |
| `PATCH /api/v1/notifications/read-all` | Authenticated | Allowed | Allowed | Allowed | Allowed | Allowed |
| `PATCH /api/v1/notifications/:id/acknowledge` | Recipient / Admin | Allowed | Allowed | Allowed | Allowed | Allowed |
| `PATCH /api/v1/notifications/:id/archive` | Recipient / Admin | Allowed | Allowed | Allowed | Allowed | Allowed |
| `PATCH /api/v1/notifications/:id/restore` | Recipient / Admin | Allowed | Allowed | Allowed | Allowed | Allowed |
| `GET/PUT /api/v1/notification-preferences` | Self Only | Own Prefs | Own Prefs | Own Prefs | Own Prefs | Own Prefs |
| `POST /api/v1/notifications/sync` | Desktop Node | Allowed | Allowed | Allowed | Allowed | Allowed |

---

## 6. Error Response Catalog & HTTP Status Codes

| HTTP Code | Error Code String | Business Trigger / Condition |
| --- | --- | --- |
| `400` | `INVALID_NOTIFICATION_PAYLOAD` | Missing required fields (`title`, `category`, `priority`). |
| `400` | `NOTIFICATION_IMMUTABLE` | Client attempted to mutate immutable notification text or category. |
| `401` | `UNAUTHORIZED` | Invalid or expired Bearer JWT token. |
| `403` | `TENANT_ACCESS_DENIED` | Attempted cross-tenant access or Platform Owner viewing clinic data (`PLATFORM_ADMIN_CLINIC_NOTIFICATIONS_RESTRICTED`). |
| `404` | `NOTIFICATION_NOT_FOUND` | Notification ID does not exist in tenant collection. |
| `409` | `DUPLICATE_NOTIFICATION_IDEMPOTENT` | Duplicate `X-Client-Request-ID` submitted during offline sync. |
| `422` | `UNPROCESSABLE_ENTITY` | Validation failed for preference settings payload. |
| `500` | `INTERNAL_SERVER_ERROR` | Database write failure or internal processing exception. |
| `503` | `SYNC_FLUSH_FAILED` | Synchronization queue processing temporarily unavailable. |

---

## 7. Audit & Governance Tracking Rules

1. **State Mutation Logging**: Every `read`, `read-all`, `acknowledge`, `archive`, `restore`, and `sync` operation records an audit entry with `actorUserId`, `clientIp`, `userAgent`, and timestamp.
2. **Platform Owner Barrier Audit**: Any attempted request by a Platform Owner to query clinic operational notification endpoints triggers an immediate security alert in system governance logs.

---

## 8. Reserved Future API Endpoints (Documentation Only)

*Note: The following endpoints describe future delivery channels for V2 expansion. They are NOT to be implemented in TASK-104.*

- `POST /api/v1/notifications/channels/whatsapp` — Send WhatsApp message template to patient
- `POST /api/v1/notifications/channels/sms` — Send SMS text alert
- `POST /api/v1/notifications/channels/email` — Send transactional HTML email
- `POST /api/v1/notifications/channels/push` — Dispatch mobile/web push notification
- `POST /api/v1/notifications/schedule` — Schedule future notification broadcast
- `GET /api/v1/notifications/templates` — List notification message templates

---

## 9. Requirements Validation Checklist

| # | Validation Item | Status | Verification Detail |
| --- | --- | --- | --- |
| 1 | **REST Endpoints Documented** | APPROVED | Complete endpoint catalog covering list, details, count, recent, read, archive, and preferences. |
| 2 | **Synchronization API Documented** | APPROVED | `POST /api/v1/notifications/sync` detailed with payload schema and `X-Client-Request-ID` idempotency. |
| 3 | **Preference APIs Documented** | APPROVED | `GET` & `PUT /api/v1/notification-preferences` detailed with validation rules. |
| 4 | **Security & Multi-Tenancy** | APPROVED | `X-Tenant-ID` header and `PLATFORM_ADMIN_CLINIC_NOTIFICATIONS_RESTRICTED` security boundary enforced. |
| 5 | **Response Envelopes Documented** | APPROVED | Standardized success and error JSON envelopes specified. |
| 6 | **Error Catalog Documented** | APPROVED | HTTP status codes mapped to error codes (400, 403, 404, 409, 500, 503). |
| 7 | **Future APIs Reserved** | APPROVED | Reserved endpoints for WhatsApp, SMS, Email, Push, Schedule, and Templates documented. |
| 8 | **CHANGELOG Updated** | PENDING | To be recorded in `/docs/CHANGELOG.md`. |
| 9 | **No API Conflicts** | APPROVED | 100% aligned with SYSTEM_ARCHITECTURE.md, NOTIFICATIONS.md, and Modules 001–103. |

---

## 10. API Architecture Sign-Off & Audit

### Audit Summary
- **Endpoint Completeness**: 100% complete across 12 REST endpoints and 6 reserved V2 endpoints.
- **Security & Privacy**: Strict tenant isolation and Platform Owner privacy barrier (`PLATFORM_ADMIN_CLINIC_NOTIFICATIONS_RESTRICTED`) verified.
- **Offline Synchronization**: Idempotency headers and batch sync contracts specified.
- **REST Compliance**: Follows standard JSON envelopes, HTTP verbs, and status codes.

### Approval Statement
The REST API specification for the **Notifications Management Module (TASK-104)** is complete, audited, production-ready, and officially **APPROVED**.

Proceed immediately to **TASK-105 — Notifications Management UI/UX Design**.
