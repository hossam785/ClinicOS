# Medical Records Management Module REST API Specification (MEDICAL_RECORDS_MANAGEMENT_API.md)

This document establishes the official REST API specification for the **Medical Records Management Module** (Module-007) of ClinicOS. It serves as the immutable API contract binding backend implementation services with frontend consumer views.

---

## 1. API Overview

### Base Architecture
All endpoints are relative to the API gateway base URL `/api/v1`. All requests must send and accept `application/json`. Multi-tenant workspace partitioning is enforced via mandatory Bearer JWT authentication tokens and `X-Tenant-ID` HTTP headers.

---

## 2. Standard JSON Response Envelope

### 1. Success Response Structure (`200 OK` / `201 Created`)
```json
{
  "success": true,
  "data": {
    "id": "emr-101",
    "recordNumber": "EMR-202607-00101",
    "tenantId": "clinic-101",
    "patientId": "pat-101",
    "doctorId": "doc-101",
    "appointmentId": "apt-101",
    "status": "DRAFT",
    "isLocked": false
  },
  "meta": {
    "timestamp": "2026-07-29T23:30:00.000Z"
  }
}
```

### 2. Error Response Structure (`400 Bad Request` / `403 Forbidden` / `404 Not Found` / `409 Conflict`)
```json
{
  "success": false,
  "error": {
    "code": "RECORD_LOCKED",
    "message": "Medical chart is locked against modifications. Submit an Addendum to append notes.",
    "details": {}
  },
  "meta": {
    "timestamp": "2026-07-29T23:30:00.000Z"
  }
}
```

---

## 3. Endpoint Catalog

### 1. `POST /api/v1/medical-records` — Initialize Medical Record (Draft)
- **Authentication**: Required (Bearer JWT).
- **Tenant Validation**: Required (`X-Tenant-ID` header matching token).
- **Request Body**:
```json
{
  "appointmentId": "apt-101",
  "patientId": "pat-101",
  "doctorId": "doc-101",
  "clinicId": "clinic-branch-01",
  "visitDate": "2026-07-30",
  "visitType": "FOLLOW_UP",
  "chiefComplaint": "Patient reports cardiac palpitations and shortness of breath."
}
```

### 2. `GET /api/v1/medical-records` — List & Search Medical Records
- **Query Parameters**: `patientId`, `doctorId`, `status`, `search`, `page`, `limit`.
- **Response**: Paginated array of EMR charts matching workspace tenant filter.

### 3. `GET /api/v1/medical-records/:id` — Get Medical Record Details
- **Path Parameter**: `id` (EMR record ID).
- **Response**: Full EMR document including SOAP notes, vital signs, primary diagnosis, and addenda.

### 4. `PUT /api/v1/medical-records/:id` — Update Clinical SOAP Notes & Vital Signs
- **Rules**: Permitted only when `isLocked === false`.
- **Request Body**:
```json
{
  "chiefComplaint": "Updated complaint details.",
  "vitalSigns": {
    "bloodPressureSystolic": 120,
    "bloodPressureDiastolic": 80,
    "pulseRate": 72,
    "bodyTemperature": 36.6,
    "respiratoryRate": 16,
    "oxygenSaturation": 98,
    "heightCm": 175,
    "weightKg": 70
  },
  "primaryDiagnosis": "Essential Primary Hypertension",
  "treatmentPlan": "Continue daily antihypertensive regimen."
}
```

### 5. `POST /api/v1/medical-records/:id/complete` — Complete Consultation & Sign Chart
- **Rules**: Validates mandatory `primaryDiagnosis` and `treatmentPlan`. Transitions status to `COMPLETED` / `LOCKED` (`isLocked: true`).

### 6. `POST /api/v1/medical-records/:id/addendum` — Append Post-Lock Addendum
- **Rules**: Permitted only when `isLocked === true`. Appends timestamped addendum text without altering locked chart.
- **Request Body**:
```json
{
  "text": "Addendum: Lab results reviewed post-consultation. Cholesterol levels normal."
}
```

### 7. `GET /api/v1/medical-records/patient/:patientId/history` — Get Patient Clinical History Timeline
- **Response**: Chronological timeline of all historical medical charts for the specified patient.

### 8. `DELETE /api/v1/medical-records/:id` — Archive Medical Record
- **Rules**: Logical archival (`status: "ARCHIVED"`). Physical deletion forbidden.

---

## 4. Error Codes Catalog

- `RECORD_NOT_FOUND`: EMR record does not exist in workspace tenant.
- `RECORD_LOCKED`: Attempted to modify a locked medical chart.
- `RECORD_ALREADY_EXISTS`: EMR record already initialized for this appointment.
- `INVALID_STATUS_TRANSITION`: Invalid lifecycle status change attempted.
- `MISSING_PRIMARY_DIAGNOSIS`: Cannot complete consultation without primary diagnosis.
- `TENANT_ACCESS_DENIED`: Cross-tenant resource access blocked.

---

## 5. Security & Multi-Tenant Access Rules

- Mandatory `X-Tenant-ID` scoping on all endpoints.
- Role-based authorization (`Doctor` full read/write, `Receptionist` restricted metadata view, `Manager` audit view).
- Immutable audit log emissions on all read/write/lock actions.
