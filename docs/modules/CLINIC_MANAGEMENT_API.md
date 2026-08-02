# Clinic Management Module API Design Specification (CLINIC_MANAGEMENT_API.md)

This document establishes the API architecture, endpoint specifications, authentication/authorization requirements, validation rules, error handling strategies, and multi-tenant isolation boundaries for the **Clinic Management Module** of ClinicOS. It serves as the official API blueprint prior to any backend implementation.

---

## 1. API Overview

### Module Responsibilities
The Clinic Management API exposes RESTful endpoints for managing clinic metadata, physical location details, daily operating hours, date-specific holiday exceptions, and administrative tenant status changes.

### Scope
Covers all HTTP interfaces required by Super Admins to review and manage clinic tenants, and by Clinic Owners and Managers to configure their clinic workspace settings.

### Architectural Principles & REST Conventions
- **Nouns over Verbs**: Standard RESTful resource URIs using plural nouns (e.g. `/api/v1/clinics`, `/api/v1/clinics/:id/operating-hours`).
- **Standard HTTP Verbs**: `GET` for reads, `POST` for creations, `PUT`/`PATCH` for updates, `DELETE` for removals.
- **Uniform Envelope**: All JSON responses follow the system-wide response envelope format (`success`, `data`/`error`, `meta`).
- **Stateless Communication**: No session state stored on application servers; requests authenticated via bearer JWTs.

---

## 2. Endpoint Catalog

### Public / Registration Endpoints
1. `POST /api/v1/clinics/register`: Submit a new clinic workspace registration application.

### Tenant Administration Endpoints (Super Admin Scope)
2. `GET /api/v1/clinics`: List all clinic tenants (supports pagination, status filtering, search).
3. `GET /api/v1/clinics/:id`: Retrieve detailed clinic tenant administrative profile.
4. `POST /api/v1/clinics/:id/approve`: Approve a pending clinic application.
5. `POST /api/v1/clinics/:id/reject`: Reject a pending clinic application.
6. `POST /api/v1/clinics/:id/suspend`: Suspend an active clinic workspace.
7. `POST /api/v1/clinics/:id/reactivate`: Reactivate a suspended clinic workspace.
8. `POST /api/v1/clinics/:id/archive`: Archive (soft-delete) a clinic workspace.

### Workspace Profile & Configuration Endpoints (Tenant Scope)
9. `GET /api/v1/clinic/profile`: Get current clinic workspace profile details.
10. `PUT /api/v1/clinic/profile`: Update general profile metadata (name, tax ID, logo, phone, address).
11. `GET /api/v1/clinic/operating-hours`: Retrieve weekly daily operating hours and shifts.
12. `PUT /api/v1/clinic/operating-hours`: Update weekly daily operating schedule.
13. `GET /api/v1/clinic/holidays`: List date-specific holiday exceptions.
14. `POST /api/v1/clinic/holidays`: Declare a new date-specific holiday exception.
15. `DELETE /api/v1/clinic/holidays/:holidayId`: Remove a date-specific holiday exception.

---

## 3. Endpoint Specifications

### 1. Register Clinic Application
- **HTTP Method & Path**: `POST /api/v1/clinics/register`
- **Business Purpose**: Submits a new clinic tenant application and creates the initial owner identity in `PENDING_REVIEW` mode.
- **Primary Actor**: Clinic Registrant / Prospective Owner.
- **Required Permissions**: Public access (Unauthenticated endpoint; protected by rate-limiting).
- **Preconditions**: Owner email and registration tax ID not registered in any active or pending clinic.
- **Success Outcome**: 201 Created; Tenant created in `PENDING_REVIEW` state, verification email queued.
- **Failure Scenarios**: 400 Bad Request (Validation failure), 409 Conflict (Duplicate email or registration ID).

### 2. List All Clinics (Admin Queue)
- **HTTP Method & Path**: `GET /api/v1/clinics`
- **Business Purpose**: Allows Super Admins to browse, search, and filter clinic applications across tenants.
- **Primary Actor**: Super Admin.
- **Required Permissions**: `platform:clinics:read` (Super Admin role).
- **Preconditions**: Authenticated user with Super Admin scope.
- **Success Outcome**: 200 OK; Returns paginated list of clinic tenant summaries and status flags.
- **Failure Scenarios**: 401 Unauthorized, 403 Forbidden (Non-Super Admin user).

### 3. Get Clinic Profile Details
- **HTTP Method & Path**: `GET /api/v1/clinic/profile`
- **Business Purpose**: Retrieves the operational profile, branding, and contact details for the active workspace.
- **Primary Actor**: Clinic Owner, Clinic Manager, Clinical Staff.
- **Required Permissions**: `clinic:profile:read`.
- **Preconditions**: Authenticated user session with valid `X-Tenant-ID` matching user's assigned tenant.
- **Success Outcome**: 200 OK; Returns active clinic profile, location, and metadata.
- **Failure Scenarios**: 401 Unauthorized, 403 Forbidden (Mismatched tenant or suspended status), 404 Not Found.

### 4. Update Clinic Profile & Location
- **HTTP Method & Path**: `PUT /api/v1/clinic/profile`
- **Business Purpose**: Updates general profile attributes, physical address, and contact numbers.
- **Primary Actor**: Clinic Owner, Clinic Manager.
- **Required Permissions**: `clinic:profile:write`.
- **Preconditions**: Active workspace in `ACTIVE` state; user holds write permissions.
- **Success Outcome**: 200 OK; Profile updated, audit log entry created.
- **Failure Scenarios**: 400 Bad Request (Invalid phone/address format), 401 Unauthorized, 403 Forbidden.

### 5. Get / Update Operating Hours Schedule
- **HTTP Method & Path**: `GET /api/v1/clinic/operating-hours` / `PUT /api/v1/clinic/operating-hours`
- **Business Purpose**: Retrieves and updates weekly shift schedules (Monday to Sunday) and lunch break windows.
- **Primary Actor**: Clinic Owner, Clinic Manager.
- **Required Permissions**: Read: `clinic:schedule:read`, Write: `clinic:schedule:write`.
- **Preconditions**: Active tenant workspace.
- **Success Outcome**: 200 OK; Schedule updated and validated against chronological shift rules.
- **Failure Scenarios**: 400 Bad Request (Shift end time <= start time, or invalid lunch interval), 403 Forbidden.

### 6. Declare / Delete Holiday Exception
- **HTTP Method & Path**: `POST /api/v1/clinic/holidays` / `DELETE /api/v1/clinic/holidays/:holidayId`
- **Business Purpose**: Declares or removes date-specific clinic closures.
- **Primary Actor**: Clinic Owner, Clinic Manager.
- **Required Permissions**: `clinic:schedule:write`.
- **Preconditions**: Active tenant workspace; target holiday date is in the future.
- **Success Outcome**: 201 Created (Add) / 200 OK (Delete); Exception stored/removed.
- **Failure Scenarios**: 400 Bad Request (Past date provided), 409 Conflict (Duplicate holiday for same date).

### 7. Approve / Suspend / Reactivate / Archive Tenant
- **HTTP Method & Path**: `POST /api/v1/clinics/:id/[approve|suspend|reactivate|archive]`
- **Business Purpose**: Executes status state machine transitions on clinic workspace tenants.
- **Primary Actor**: Super Admin.
- **Required Permissions**: `platform:clinics:manage` (Super Admin role exclusively).
- **Preconditions**: Valid target tenant ID; status transition complies with authorized state machine.
- **Success Outcome**: 200 OK; Tenant status updated, audit event logged, active sessions invalidated if suspended.
- **Failure Scenarios**: 400 Bad Request (Illegal state transition), 403 Forbidden, 404 Not Found.

---

## 4. Authentication Integration

- **Identity Verification**: All protected endpoints require a valid JWT in the `Authorization: Bearer <token>` header.
- **Session Validation**: Middleware validates token signature, expiration timestamp, and verifies user status is active.
- **Tenant Context Verification**: The API middleware matches the `X-Tenant-ID` header against the `tenantId` embedded inside the decoded JWT token payload. Mismatches trigger a `403 Forbidden` response.

---

## 5. Authorization Strategy

- **Role-Based Access Control (RBAC)**:
  - **Super Admin**: Access to `/api/v1/clinics/*` administrative management paths.
  - **Clinic Owner**: Full read/write access to `/api/v1/clinic/*` workspace configuration paths.
  - **Clinic Manager**: Read/write access to profile, hours, and holidays; restricted from ownership delegation.
  - **Clinical Staff / Doctor**: Read-only access to clinic profile and operating hours.

---

## 6. Validation Strategy

- **Programmatic Input Validation**: Enforced at the controller boundary before service invocation.
- **Constraints**:
  - Required fields check (Name, Tax ID, Address, Phone, Shift times).
  - Format checks (E.164 phone formats, RFC 5322 emails, ISO 8601 timestamps).
  - Shift time logic: `shiftStart < lunchStart < lunchEnd < shiftEnd`.
- **Duplicate Prevention**: Global unique index checks on tax IDs and medical registration numbers.

---

## 7. Error Handling Strategy

- **Standardized Envelope**: Errors return HTTP status code with structured payload:
  - `400 Bad Request`: Validation failure or invalid chronological shift bounds.
  - `401 Unauthorized`: Missing or expired JWT token.
  - `403 Forbidden`: Mismatched tenant, insufficient role permissions, or suspended workspace.
  - `404 Not Found`: Target clinic or holiday ID does not exist.
  - `409 Conflict`: Duplicate registration number or overlapping holiday.
  - `422 Unprocessable Entity`: Prohibited state machine transition.

---

## 8. Tenant Isolation

- **Header Scoping**: Every workspace request must include `X-Tenant-ID`.
- **Query Partitioning**: Database query abstraction automatically appends tenant scope filters.
- **Cross-Tenant Prevention**: Users cannot request or mutate settings belonging to a different `tenant_id`.

---

## 9. API Lifecycle

```
Client Request
      ↓
HTTP Protocol & CORS Headers Check
      ↓
Authentication Middleware (JWT Signature & Session Check)
      ↓
Tenant Scope Middleware (X-Tenant-ID Verification)
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

- **Privileged Path Protection**: Admin paths (`/api/v1/clinics/*`) are strictly segregated from tenant workspace paths (`/api/v1/clinic/*`).
- **Abuse Prevention**: Rate-limiting applied to public clinic registration requests (max 5 requests per IP per hour).
- **Audit Logging**: Mutations (status updates, profile changes, shift alterations) emit immutable audit logs.

---

## 11. Integration Points

- **Authentication Module**: Invokes auth service to invalidate active sessions when a clinic is suspended.
- **Doctor / Staff Module**: Consumes `GET /api/v1/clinic/operating-hours` to validate staff shifts.
- **Appointment Module**: Consumes operating hours and holiday lists to validate slot availability.
- **Notification Service**: Triggers email alerts on approval, suspension, or profile modification.

---

## 12. Versioning Strategy

- **URL Path Versioning**: All endpoints scoped under `/api/v1/`.
- **Backward Compatibility**: Non-breaking additions (new response metadata) introduced without changing version prefix. Breaking contract changes require `/api/v2/` migration.

---

## 13. Assumptions

- Clinics communicate over HTTPS with UTF-8 JSON payloads.
- Operational schedules rely on UTC offsets specified in clinic profile settings.

---

## 14. Risks & Mitigations

| Risk | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| Unauthorized Status Mutation | Critical | Strict RBAC guards restricting `/clinics/:id/*` to Super Admin JWTs. |
| Overlapping Shift Times | Medium | Controller-level programmatic time bound validation. |
| Tenant Boundary Bleed | Critical | Middleware verification of `X-Tenant-ID` against token claims. |

---

## 15. Out of Scope

- Express route handlers, controllers, or TypeScript DTO code implementations.
- Database query or ORM model files.
- Swagger / OpenAPI UI generator setups.
