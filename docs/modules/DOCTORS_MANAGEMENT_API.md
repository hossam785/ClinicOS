# Doctors Management Module API Design Specification (DOCTORS_MANAGEMENT_API.md)

This document establishes the API architecture, endpoint specifications, authentication/authorization requirements, validation rules, error handling strategies, and multi-tenant isolation boundaries for the **Doctors Management Module** (Module-004) of ClinicOS. It serves as the official API blueprint prior to any backend implementation.

---

## 1. API Overview

### Module Responsibilities
The Doctors Management API exposes RESTful HTTP endpoints for inviting medical practitioners, managing professional profiles, board licenses, consultation fee structures, individual shift schedules, date-specific leave exceptions, and administrative practitioner lifecycle state transitions (`PENDING_VERIFICATION` ➔ `ACTIVE` ➔ `SUSPENDED` ➔ `ARCHIVED`).

### Scope
Covers all HTTP interfaces required by Clinic Owners and Managers to manage practitioner rosters and workspace schedules, by Doctors to view and manage self-service biography details, and by Super Admins for platform compliance audits.

### Architectural Principles & REST Conventions
- **Nouns over Verbs**: Standard RESTful resource URIs using plural nouns (e.g. `/api/v1/doctors`, `/api/v1/doctors/:id/schedule`).
- **Standard HTTP Verbs**: `GET` for reads, `POST` for creations/actions, `PUT`/`PATCH` for updates, `DELETE` for removals.
- **Uniform Envelope**: All JSON responses follow the system-wide response envelope format (`success`, `data`/`error`, `meta`).
- **Stateless Communication**: No session state stored on application servers; requests authenticated via bearer JWTs and scoped via `X-Tenant-ID`.

---

## 2. Endpoint Catalog

### Workspace Practitioner Endpoints (Tenant Scope)
1. `POST /api/v1/doctors/invite`: Send an onboarding invitation to a new medical practitioner.
2. `GET /api/v1/doctors`: List all doctors within the workspace (supports pagination, specialty filtering, search).
3. `GET /api/v1/doctors/:id`: Retrieve detailed doctor profile, board licenses, and shift schedule.
4. `PUT /api/v1/doctors/:id`: Update professional profile details, biography, and department assignment.
5. `PUT /api/v1/doctors/:id/fees`: Update consultation fee structures and default consultation duration.
6. `GET /api/v1/doctors/:id/schedule`: Retrieve weekly shift hours for a doctor.
7. `PUT /api/v1/doctors/:id/schedule`: Update weekly shift schedule for a doctor.
8. `GET /api/v1/doctors/:id/leaves`: List date-specific leave exceptions for a doctor.
9. `POST /api/v1/doctors/:id/leaves`: Declare a date-specific leave exception.
10. `DELETE /api/v1/doctors/:id/leaves/:leaveId`: Remove a date-specific leave exception.

### Lifecycle & Administrative Action Endpoints
11. `POST /api/v1/doctors/:id/verify-license`: Approve medical license credentials and transition status to `ACTIVE`.
12. `POST /api/v1/doctors/:id/suspend`: Suspend practitioner access (temporary leave or review).
13. `POST /api/v1/doctors/:id/reactivate`: Reactivate a suspended practitioner workspace access.
14. `POST /api/v1/doctors/:id/archive`: Archive (soft-delete) a practitioner record upon employment termination.

---

## 3. Endpoint Specifications

### 1. Invite New Doctor
- **HTTP Method & Path**: `POST /api/v1/doctors/invite`
- **Business Purpose**: Submits a new doctor onboarding invitation and creates a profile in `PENDING_VERIFICATION` state.
- **Primary Actor**: Clinic Owner, Clinic Manager.
- **Required Permissions**: `doctor:invite` (Owner / Manager).
- **Preconditions**: Primary email and medical license code not registered to another active doctor in the jurisdiction.
- **Success Outcome**: 201 Created; Doctor profile created in `PENDING_VERIFICATION` state, invitation email dispatched.
- **Failure Scenarios**: 400 Bad Request (Validation failure), 409 Conflict (Duplicate email or license code).

### 2. List Doctors (Workspace Directory)
- **HTTP Method & Path**: `GET /api/v1/doctors`
- **Business Purpose**: Retrieves a paginated list of doctors within the tenant workspace with optional search and specialty filtering.
- **Primary Actor**: Clinic Owner, Clinic Manager, Staff, Patient.
- **Required Permissions**: `doctor:read`.
- **Preconditions**: Authenticated user session with valid `X-Tenant-ID`.
- **Success Outcome**: 200 OK; Returns array of doctor profile summaries and status tags.
- **Failure Scenarios**: 401 Unauthorized, 403 Forbidden (Mismatched tenant or suspended workspace).

### 3. Get Doctor Profile Details
- **HTTP Method & Path**: `GET /api/v1/doctors/:id`
- **Business Purpose**: Retrieves complete practitioner details, license codes, fee rates, and shift hours.
- **Primary Actor**: Clinic Owner, Clinic Manager, Doctor (Self).
- **Required Permissions**: `doctor:read`.
- **Preconditions**: Target doctor belongs to the request's `X-Tenant-ID`.
- **Success Outcome**: 200 OK; Returns complete doctor profile payload.
- **Failure Scenarios**: 401 Unauthorized, 403 Forbidden, 404 Not Found.

### 4. Update Professional Profile
- **HTTP Method & Path**: `PUT /api/v1/doctors/:id`
- **Business Purpose**: Updates practitioner legal name, medical title, biography, specialties, and department.
- **Primary Actor**: Clinic Owner, Clinic Manager, Doctor (Self - Bio only).
- **Required Permissions**: `doctor:write`.
- **Preconditions**: Doctor is in `ACTIVE` or `PENDING_VERIFICATION` state.
- **Success Outcome**: 200 OK; Profile updated, audit log written.
- **Failure Scenarios**: 400 Bad Request, 403 Forbidden (Unauthorized field mutation).

### 5. Update Consultation Fees
- **HTTP Method & Path**: `PUT /api/v1/doctors/:id/fees`
- **Business Purpose**: Configures consultation fee rates and default consultation slot durations.
- **Primary Actor**: Clinic Owner, Clinic Manager.
- **Required Permissions**: `doctor:fees:write` (Owner / Manager scope exclusively).
- **Preconditions**: Non-negative decimal fee amount; duration step between 10 and 120 minutes.
- **Success Outcome**: 200 OK; Consultation rates updated.
- **Failure Scenarios**: 400 Bad Request (Invalid fee or duration step), 403 Forbidden (Doctor self-edit blocked).

### 6. Verify License & Activate Doctor
- **HTTP Method & Path**: `POST /api/v1/doctors/:id/verify-license`
- **Business Purpose**: Confirms board license validation and transitions doctor status to `ACTIVE`.
- **Primary Actor**: Clinic Owner, Clinic Manager.
- **Required Permissions**: `doctor:verify` (Owner / Manager).
- **Preconditions**: Doctor in `PENDING_VERIFICATION` state; valid license code.
- **Success Outcome**: 200 OK; Doctor status updated to `ACTIVE`, audit log written.
- **Failure Scenarios**: 400 Bad Request (Illegal state transition), 404 Not Found.

### 7. Suspend / Reactivate / Archive Doctor
- **HTTP Method & Path**: `POST /api/v1/doctors/:id/[suspend|reactivate|archive]`
- **Business Purpose**: Executes status state machine transitions on doctor accounts.
- **Primary Actor**: Clinic Owner.
- **Required Permissions**: `doctor:manage` (Owner scope exclusively).
- **Preconditions**: Valid state machine transition; mandatory reason payload provided.
- **Success Outcome**: 200 OK; Doctor status updated, active sessions invalidated if suspended, audit log emitted.
- **Failure Scenarios**: 400 Bad Request (Illegal transition), 403 Forbidden.

---

## 4. Authentication Integration

- **Identity Verification**: All endpoints require a valid JWT in the `Authorization: Bearer <token>` header.
- **Session Validation**: Middleware checks token expiration and verifies user status is active.
- **Tenant Context Verification**: Middleware checks that `X-Tenant-ID` matches the token claim `tenantId`. Mismatches return `403 Forbidden`.

---

## 5. Authorization Strategy

- **Role-Based Access Control (RBAC)**:
  - **Clinic Owner**: Full read/write authority across all doctor management endpoints including fee edits and status actions.
  - **Clinic Manager**: Read/write access to profiles, schedules, and leave declarations; restricted from status suspensions/archives.
  - **Doctor**: Read access to self profile; write access restricted to biography and personal bio details.
  - **Patient**: Public read access to active doctor directory summaries and specialties for booking context.

---

## 6. Validation Strategy

- **Programmatic Input Validation**:
  - Medical License Code: 4–30 alphanumeric characters, non-empty.
  - Consultation Fee: Decimal number >= 0.
  - Slot Duration: Integer between 10 and 120 minutes.
  - Dates: Valid ISO 8601 string (`YYYY-MM-DD`).
- **Duplicate Prevention**: Global unique index checks on medical license codes per jurisdiction.

---

## 7. Error Handling Strategy

- **Standardized Response Envelopes**:
  - `400 Bad Request`: Validation failure or invalid shift bounds.
  - `401 Unauthorized`: Missing or expired Bearer token.
  - `403 Forbidden`: Cross-tenant violation, suspended workspace, or insufficient role permission.
  - `404 Not Found`: Doctor ID or leave ID not found.
  - `409 Conflict`: Duplicate email or medical license code.
  - `422 Unprocessable Entity`: Illegal state machine transition attempt.

---

## 8. Tenant Isolation

- **Header Enforcement**: `X-Tenant-ID` header required on all doctor requests.
- **Repository Partitioning**: Queries automatically append `WHERE tenant_id = :tenantId`.
- **Cross-Tenant Prevention**: Users cannot request or mutate doctor profiles belonging to a different tenant.

---

## 9. API Lifecycle

```
Client Request
      ↓
HTTP Protocol & CORS Check
      ↓
Authentication Middleware (Bearer JWT Check)
      ↓
Tenant Scoping Middleware (X-Tenant-ID Verification)
      ↓
Authorization Guard (Role & Permission Evaluation)
      ↓
Request Body Validation (Programmatic Schema Check)
      ↓
Service Execution & Business Rule Validation
      ↓
Database Transaction & Audit Log Emission
      ↓
Standard JSON Envelope Response
```

---

## 10. Security Considerations

- **Privileged Endpoint Guards**: Status actions (`suspend`, `archive`) and fee updates (`fees`) require `CLINIC_OWNER` scope.
- **Abuse Prevention**: Rate-limiting applied to public doctor list requests.
- **Audit Logging**: All administrative operations emit tamper-evident audit logs with actor ID context.

---

## 11. Integration Points

- **Authentication Module**: Invokes session service to invalidate JWT tokens when a doctor is suspended.
- **Clinic Management Module**: Validates doctor shift schedules against clinic workspace working hours.
- **Appointment Module**: Exposes active doctor rosters for appointment slot reservations.
- **Notification Service**: Sends email alerts upon doctor invitation, license approval, or schedule changes.

---

## 12. Versioning Strategy

- **URL Path Versioning**: All endpoints scoped under `/api/v1/doctors`.
- **Backward Compatibility**: Non-breaking response fields added without version bumps; breaking changes require `/api/v2/`.

---

## 13. Assumptions

- Payloads use UTF-8 JSON formatting over HTTPS.
- Monetary fee values use the workspace tenant's default currency.

---

## 14. Risks & Mitigations

| Risk | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| Unauthorized Fee Mutation | High | Strict RBAC guard restricting `PUT /doctors/:id/fees` to Clinic Owners. |
| Duplicate License Registration | High | Unique index constraint check on license codes during invite validation. |
| Cross-Tenant Data Bleed | Critical | Middleware verification of `X-Tenant-ID` against token claims. |

---

## 15. Out of Scope

- Express route handlers, controllers, or DTO code implementations.
- Database query or ORM model files.
- Swagger / OpenAPI UI generator setups.
