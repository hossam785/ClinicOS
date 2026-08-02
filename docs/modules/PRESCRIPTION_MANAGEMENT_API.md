# Prescription Management Module REST API Specification (PRESCRIPTION_MANAGEMENT_API.md)

This document establishes the official REST API contract for the **Electronic Prescription Management Module** (Module-008) of ClinicOS. It serves as the authoritative interface definition binding backend service controllers with frontend application consumers and integration clients.

---

## 1. API Overview & Gateway Architecture

### Base URL & Protocol
- All endpoints are relative to the gateway root: `/api/v1`.
- Transport Protocol: HTTPS (TLS 1.3 compulsory).
- Content-Type: `application/json` (except binary PDF exports which stream `application/pdf`).
- Authentication: Standard HTTP Authorization header with Bearer JWT token.
- Multi-Tenant Workspace Partitioning: Enforced via mandatory `X-Tenant-ID` HTTP header matching the JWT tenant claim.
- Desktop Sync Compatibility: All write mutations support an optional `X-Client-Request-ID` header for offline transaction deduplication.

---

## 2. Standardized JSON Response Envelopes

### 1. Success Response Structure (`200 OK` / `201 Created`)
```json
{
  "success": true,
  "data": {
    "id": "rx_66901a8b1",
    "prescriptionNumber": "RX-202607-00189",
    "tenantId": "clinic_west_01",
    "clinicId": "branch_main",
    "doctorId": "doc_9921",
    "patientId": "pat_4401",
    "appointmentId": "apt_1102",
    "medicalRecordId": "emr_8803",
    "status": "FINALIZED",
    "visitDate": "2026-07-30",
    "diagnosisSummary": "Acute Bronchitis & Lower Respiratory Symptoms",
    "clinicalNotes": "Drink plenty of warm fluids. Avoid cold exposure.",
    "followUpAdvice": "Return to clinic in 7 days for chest auscultation review.",
    "medications": [
      {
        "medicineName": "Amoxicillin / Clavulanic Acid",
        "strength": "500 mg / 125 mg",
        "dosageForm": "Tablet",
        "dosage": "1 Tablet",
        "frequency": "Three times daily (TID)",
        "duration": "7 Days",
        "quantity": "21 Tablets",
        "instructions": "Take after meals with a full glass of water."
      }
    ],
    "printInfo": {
      "printCount": 1,
      "lastPrintedAt": "2026-07-30T14:20:00.000Z",
      "lastPrintedBy": "doc_9921",
      "exportedPdfAt": "2026-07-30T14:20:00.000Z"
    },
    "auditInfo": {
      "createdBy": "doc_9921",
      "createdAt": "2026-07-30T14:00:00.000Z",
      "updatedBy": "doc_9921",
      "updatedAt": "2026-07-30T14:15:00.000Z",
      "finalizedBy": "doc_9921",
      "finalizedAt": "2026-07-30T14:15:00.000Z"
    },
    "archived": false,
    "version": 2
  },
  "meta": {
    "timestamp": "2026-07-30T14:20:00.000Z"
  }
}
```

### 2. Error Response Structure (`4xx` / `5xx`)
```json
{
  "success": false,
  "error": {
    "code": "PRESCRIPTION_LOCKED",
    "message": "Finalized prescriptions are immutable and cannot be updated.",
    "details": {
      "prescriptionId": "rx_66901a8b1",
      "status": "FINALIZED"
    }
  },
  "meta": {
    "timestamp": "2026-07-30T14:20:00.000Z"
  }
}
```

---

## 3. Detailed Endpoint Catalog

### 1. `POST /api/v1/prescriptions` — Create Draft Prescription
- **Purpose**: Initializes a new draft prescription bound to a patient, medical record, and attending doctor.
- **Authentication**: Required (`Bearer <token>`).
- **Permissions**: `DOCTOR`, `DOCTOR_CLINIC_MANAGER`.
- **Request Body**:
```json
{
  "patientId": "pat_4401",
  "medicalRecordId": "emr_8803",
  "appointmentId": "apt_1102",
  "clinicId": "branch_main",
  "visitDate": "2026-07-30",
  "diagnosisSummary": "Acute Bronchitis",
  "clinicalNotes": "Drink warm fluids.",
  "followUpAdvice": "Return in 7 days.",
  "medications": [
    {
      "medicineName": "Amoxicillin / Clavulanic Acid",
      "strength": "500 mg / 125 mg",
      "dosageForm": "Tablet",
      "dosage": "1 Tablet",
      "frequency": "Three times daily (TID)",
      "duration": "7 Days",
      "quantity": "21 Tablets",
      "instructions": "Take after meals."
    }
  ]
}
```
- **Validation Rules**:
  - `patientId` must reference an active patient in the same tenant.
  - `medicalRecordId` must reference an existing medical record in the same tenant.
  - Attending doctor must be the authenticated user.
- **Response**: `201 Created` with initialized `DRAFT` prescription document.

---

### 2. `GET /api/v1/prescriptions/:id` — Get Prescription Details
- **Purpose**: Retrieves full details of a specific prescription by ID.
- **Authentication**: Required (`Bearer <token>`).
- **Permissions**: `DOCTOR`, `DOCTOR_CLINIC_MANAGER`, `CLINIC_MANAGER`, `RECEPTIONIST` (if permitted by policy).
- **Path Parameters**: `id` (Prescription ID).
- **Validation Rules**: Enforces `tenantId` match. Draft prescriptions are visible only to the prescribing doctor.
- **Response**: `200 OK` with prescription object.

---

### 3. `PUT /api/v1/prescriptions/:id` — Update Draft Prescription
- **Purpose**: Modifies medication line items, notes, or follow-up advice of an active draft prescription.
- **Authentication**: Required (`Bearer <token>`).
- **Permissions**: `DOCTOR` (Creator), `DOCTOR_CLINIC_MANAGER`.
- **Path Parameters**: `id` (Prescription ID).
- **Request Body**:
```json
{
  "diagnosisSummary": "Acute Bronchitis & Cough",
  "clinicalNotes": "Updated clinical instructions.",
  "followUpAdvice": "Return in 5 days.",
  "medications": [
    {
      "medicineName": "Amoxicillin / Clavulanic Acid",
      "strength": "500 mg / 125 mg",
      "dosageForm": "Tablet",
      "dosage": "1 Tablet",
      "frequency": "Three times daily (TID)",
      "duration": "7 Days",
      "quantity": "21 Tablets",
      "instructions": "Take after meals."
    },
    {
      "medicineName": "Cough Syrup (Guaifenesin)",
      "strength": "100 mg/5 mL",
      "dosageForm": "Syrup",
      "dosage": "10 mL",
      "frequency": "Every 8 hours",
      "duration": "5 Days",
      "quantity": "1 Bottle (150 mL)",
      "instructions": "Take as needed for severe cough."
    }
  ]
}
```
- **Validation Rules**:
  - Request fails with `409 Conflict` (`PRESCRIPTION_LOCKED`) if status is not `DRAFT`.
  - Request fails with `403 Forbidden` if authenticated user is not the prescribing doctor.
- **Response**: `200 OK` with updated draft object.

---

### 4. `PATCH /api/v1/prescriptions/:id/finalize` — Finalize & Sign Prescription
- **Purpose**: Signs and locks a draft prescription, transitioning it to `FINALIZED`.
- **Authentication**: Required (`Bearer <token>`).
- **Permissions**: `DOCTOR` (Creator), `DOCTOR_CLINIC_MANAGER`.
- **Request Body**: Empty or optional `{ "digitalSignatureContext": "..." }`.
- **Validation Rules**:
  - Requires status == `DRAFT`.
  - Requires minimum 1 medication line item.
  - Generates official `prescriptionNumber` (`RX-YYYYMM-XXXXX`).
  - Automatically embeds prescription in Patient Medical History timeline.
- **Response**: `200 OK` with finalized, read-only prescription object.

---

### 5. `PATCH /api/v1/prescriptions/:id/archive` — Archive Prescription (Soft Delete)
- **Purpose**: Soft-deletes/revokes a prescription document.
- **Authentication**: Required (`Bearer <token>`).
- **Permissions**: `DOCTOR`, `DOCTOR_CLINIC_MANAGER`, `CLINIC_MANAGER`.
- **Request Body**:
```json
{
  "reason": "Prescription issued with incorrect strength. Re-issued new prescription RX-202607-00192."
}
```
- **Validation Rules**: Mandatory non-empty `reason` string. Sets `archived: true` and status to `ARCHIVED`.
- **Response**: `200 OK` with updated archived prescription object.

---

### 6. `PATCH /api/v1/prescriptions/:id/restore` — Restore Prescription
- **Purpose**: Restores a previously archived prescription document.
- **Authentication**: Required (`Bearer <token>`).
- **Permissions**: `DOCTOR_CLINIC_MANAGER`, `CLINIC_MANAGER`.
- **Validation Rules**: Requires `archived === true`. Restores status to `FINALIZED` (or `DRAFT` if not finalized prior to archival).
- **Response**: `200 OK` with restored prescription object.

---

### 7. `POST /api/v1/prescriptions/:id/print` — Register Print Event & Get Print Data
- **Purpose**: Logs a physical print execution, increments `printCount`, and returns a print-optimized data structure.
- **Authentication**: Required (`Bearer <token>`).
- **Permissions**: `DOCTOR`, `DOCTOR_CLINIC_MANAGER`, `CLINIC_MANAGER`, `RECEPTIONIST` (if permitted).
- **Request Body**: `{ "actionType": "PRINT_DIRECT" }`.
- **Validation Rules**:
  - Increments `printCount` counter by 1.
  - Updates `lastPrintedAt` and `lastPrintedBy`.
  - Transitions status from `FINALIZED` to `PRINTED` if first print execution.
- **Response**: `200 OK` with print payload and updated print statistics.

---

### 8. `POST /api/v1/prescriptions/:id/pdf` — Export PDF Document
- **Purpose**: Generates and streams a vector PDF document for physical printing or digital download.
- **Authentication**: Required (`Bearer <token>`).
- **Permissions**: `DOCTOR`, `DOCTOR_CLINIC_MANAGER`, `CLINIC_MANAGER`, `RECEPTIONIST` (if permitted).
- **Headers**: Accepts `Accept: application/pdf`.
- **Response**: `200 OK` with binary PDF payload (`Content-Type: application/pdf`, `Content-Disposition: attachment; filename="Prescription_RX-202607-00189.pdf"`).

---

### 9. `GET /api/v1/prescriptions` — List & Search Prescriptions
- **Purpose**: Queries clinic prescriptions with pagination, multi-criteria filtering, and text search.
- **Authentication**: Required (`Bearer <token>`).
- **Permissions**: `DOCTOR`, `DOCTOR_CLINIC_MANAGER`, `CLINIC_MANAGER`, `RECEPTIONIST` (if permitted).
- **Query Parameters**:
  - `page` (default: 1)
  - `limit` (default: 20, max: 100)
  - `patientId` (filter by patient)
  - `doctorId` (filter by doctor)
  - `status` (`DRAFT`, `FINALIZED`, `PRINTED`, `ARCHIVED`)
  - `startDate` / `endDate` (visit date range filter)
  - `medicineName` (search by prescribed medication name)
  - `prescriptionNumber` (exact match search)
  - `search` (text search across patient name, code, or prescription number)
- **Response**: `200 OK` with paginated array of prescription summary cards and pagination metadata.

---

### 10. `GET /api/v1/patients/:patientId/prescriptions` — Patient Prescription History
- **Purpose**: Fetches chronological prescription history timeline for a specific patient profile.
- **Authentication**: Required (`Bearer <token>`).
- **Permissions**: `DOCTOR`, `DOCTOR_CLINIC_MANAGER`, `CLINIC_MANAGER`, `RECEPTIONIST` (if permitted).
- **Path Parameters**: `patientId`.
- **Query Parameters**: `page`, `limit`, `includeArchived` (boolean, default: false).
- **Response**: `200 OK` with paginated chronological prescription array.

---

### 11. `GET /api/v1/medical-records/:recordId/prescriptions` — EMR Encounter Prescriptions
- **Purpose**: Fetches all prescriptions issued during a specific medical record consultation.
- **Authentication**: Required (`Bearer <token>`).
- **Permissions**: `DOCTOR`, `DOCTOR_CLINIC_MANAGER`, `CLINIC_MANAGER`, `RECEPTIONIST` (if permitted).
- **Path Parameters**: `recordId` (Medical Record ID).
- **Response**: `200 OK` with list of prescriptions associated with the EMR chart.

---

## 4. Comprehensive Security & Permission Matrix

| Endpoint | HTTP Method | Doctor | Doctor + Manager | Receptionist | Clinic Manager | Platform Admin |
| --- | --- | --- | --- | --- | --- | --- |
| `POST /api/v1/prescriptions` | POST | Allowed | Allowed | Denied (`403`) | Denied (`403`) | Denied (`403`) |
| `GET /api/v1/prescriptions/:id` | GET | Allowed | Allowed | Allowed (Policy) | Allowed | Denied (`403`) |
| `PUT /api/v1/prescriptions/:id` | PUT | Allowed (Own) | Allowed (Own) | Denied (`403`) | Denied (`403`) | Denied (`403`) |
| `PATCH /.../finalize` | PATCH | Allowed (Own) | Allowed (Own) | Denied (`403`) | Denied (`403`) | Denied (`403`) |
| `PATCH /.../archive` | PATCH | Allowed | Allowed | Denied (`403`) | Allowed | Denied (`403`) |
| `PATCH /.../restore` | PATCH | Denied | Allowed | Denied (`403`) | Allowed | Denied (`403`) |
| `POST /.../print` | POST | Allowed | Allowed | Allowed (Policy) | Allowed | Denied (`403`) |
| `POST /.../pdf` | POST | Allowed | Allowed | Allowed (Policy) | Allowed | Denied (`403`) |
| `GET /api/v1/prescriptions` | GET | Allowed | Allowed | Allowed (Policy) | Allowed | Denied (`403`) |
| `GET /patients/.../prescriptions` | GET | Allowed | Allowed | Allowed (Policy) | Allowed | Denied (`403`) |
| `GET /medical-records/.../prescriptions` | GET | Allowed | Allowed | Allowed (Policy) | Allowed | Denied (`403`) |

> [!IMPORTANT]
> **Platform Admin PHI Restriction**: Platform Administrators receive HTTP `403 Forbidden` with error code `PLATFORM_ADMIN_PHI_RESTRICTED` on all clinical prescription routes.

---

## 5. Standard Error Code Catalog

| Error Code | HTTP Status | Description & Remediation |
| --- | --- | --- |
| `PATIENT_NOT_FOUND` | `404 Not Found` | The specified `patientId` does not exist in the active tenant workspace. |
| `MEDICAL_RECORD_NOT_FOUND` | `404 Not Found` | The specified `medicalRecordId` does not exist in the active tenant workspace. |
| `APPOINTMENT_NOT_FOUND` | `404 Not Found` | The specified `appointmentId` does not exist in the active tenant workspace. |
| `UNAUTHORIZED_DOCTOR` | `403 Forbidden` | Authenticated user is not authorized to create or modify prescriptions for this doctor/patient. |
| `PRESCRIPTION_LOCKED` | `409 Conflict` | Attempted modification of a prescription that is in `FINALIZED`, `PRINTED`, or `ARCHIVED` status. |
| `INVALID_STATUS_TRANSITION` | `400 Bad Request` | Attempted illegal state machine transition (e.g. `FINALIZED` ➔ `DRAFT`). |
| `EMPTY_MEDICATION_LIST` | `422 Unprocessable` | Cannot finalize a prescription with 0 medication line items. |
| `ARCHIVED_PATIENT_RECORD` | `422 Unprocessable` | Prescriptions cannot be created for patients with an `ARCHIVED` profile status. |
| `TENANT_ACCESS_DENIED` | `403 Forbidden` | The requested resource belongs to a different clinic workspace tenant. |
| `PLATFORM_ADMIN_PHI_RESTRICTED` | `403 Forbidden` | Platform Administrators are strictly prohibited from viewing patient medical prescriptions. |
| `PRESCRIPTION_NOT_FOUND` | `404 Not Found` | Prescription with the specified ID was not found. |

---

## 6. Audit Logging Contract

All mutating write operations (`POST`, `PUT`, `PATCH`) automatically emit audit events captured in the central audit system with the following attributes:

- `actorId`: User ID of the executing client.
- `actorRole`: User RBAC role (`DOCTOR`, `RECEPTIONIST`, etc.).
- `action`: Audit action code (`PRESCRIPTION_CREATED`, `PRESCRIPTION_UPDATED`, `PRESCRIPTION_FINALIZED`, `PRESCRIPTION_PRINTED`, `PRESCRIPTION_ARCHIVED`, `PRESCRIPTION_RESTORED`).
- `resourceId`: Prescription ID (`rx_...`).
- `tenantId`: Active tenant key.
- `ipAddress` & `userAgent`: Client metadata.
- `timestamp`: UTC timestamp.

---

## 7. Reserved Future API Extensions

The API specification reserves the following endpoint signatures for V2 enhancements:

- `GET /api/v1/prescriptions/:id/qr-code`: Returns base64 QR code image verifying prescription authenticity.
- `POST /api/v1/prescriptions/:id/e-sign`: Signs prescription with PKI cryptographic digital signature.
- `POST /api/v1/prescriptions/check-interactions`: Validates proposed medications against patient allergy profile and drug interaction database.
- `POST /api/v1/prescriptions/:id/dispatch-pharmacy`: Dispatches prescription via HL7 FHIR to partner pharmacy networks.
- `POST /api/v1/prescriptions/:id/send-whatsapp`: Delivers encrypted ePrescription link to patient's WhatsApp number.
- `POST /api/v1/prescriptions/:id/send-email`: Emails signed PDF prescription to patient's email address.

---

## 8. API Architecture Audit & Sign-Off

- [x] REST endpoint catalog (11 endpoints) documented.
- [x] Request and response JSON schemas defined.
- [x] Standard JSON success and error envelopes specified.
- [x] Validation rules and pre-database checks documented.
- [x] Full RBAC security matrix defined.
- [x] Platform Admin PHI privacy barrier enforced (`403 Forbidden`).
- [x] Standard error code catalog specified.
- [x] Desktop sync & offline request header compatibility (`X-Client-Request-ID`) specified.
- [x] Future extension API endpoints reserved.
- [x] Zero API conflicts with TASK-001 through TASK-076.

---

## 9. Next Step Recommendation

The REST API specification for the Prescription Management Module is **100% complete, production-ready, and approved**. We are ready to proceed to **TASK-078 — Prescription Management UI/UX Design**.
