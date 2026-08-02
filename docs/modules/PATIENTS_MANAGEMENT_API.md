# Patients Management Module REST API Specification (PATIENTS_MANAGEMENT_API.md)

This document establishes the official REST API specification for the **Patients Management Module** (Module-005) of ClinicOS. It serves as the immutable API contract between backend services and frontend clients.

---

## 1. API Overview

The Patients Management API provides endpoints for registering, retrieving, searching, updating, archiving, restoring, and managing the lifecycle statuses of patient master index records within a multi-tenant workspace (`tenantId`).

### Authentication & Tenant Scoping
All requests require:
- `Authorization: Bearer <jwt-token>` header for identity verification.
- `X-Tenant-ID: <tenant-id>` header for workspace isolation.

---

## 2. Endpoint Catalog

| HTTP Method | Route Endpoint | Description | Authorization |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/patients` | Register new patient profile | `patient:write` |
| `GET` | `/api/v1/patients` | Search & list paginated patient roster | `patient:read` |
| `GET` | `/api/v1/patients/:id` | Fetch detailed patient profile by ID | `patient:read` |
| `PUT` | `/api/v1/patients/:id` | Update patient demographic & contact info | `patient:write` |
| `POST` | `/api/v1/patients/:id/archive` | Soft-delete / archive patient profile | `patient:manage` |
| `POST` | `/api/v1/patients/:id/restore` | Restore archived patient profile | `patient:manage` |
| `POST` | `/api/v1/patients/:id/status` | Change patient lifecycle status | `patient:manage` |

---

## 3. Standard Response Formats

### 1. Success Response Envelope
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-07-29T21:55:00.000Z",
    "requestId": "req-1029384"
  }
}
```

### 2. Paginated Roster Response Envelope
```json
{
  "success": true,
  "data": {
    "patients": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalItems": 142,
      "totalPages": 8,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  },
  "meta": {
    "timestamp": "2026-07-29T21:55:00.000Z"
  }
}
```

### 3. Error Response Envelope
```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_NATIONAL_ID",
    "message": "A patient profile with National ID 1092837465 already exists in this tenant.",
    "details": {
      "field": "nationalId",
      "matchingPatientId": "pat-091238"
    }
  },
  "meta": {
    "timestamp": "2026-07-29T21:55:00.000Z"
  }
}
```

---

## 4. Detailed Endpoint Specifications

### 1. Register New Patient (`POST /api/v1/patients`)
- **Headers**: `Authorization`, `X-Tenant-ID`
- **Request Body**:
  ```json
  {
    "firstName": "John",
    "middleName": "Robert",
    "lastName": "Doe",
    "gender": "male",
    "dateOfBirth": "1988-04-12",
    "nationalId": "1092837465",
    "primaryPhone": "+12025550142",
    "email": "john.doe@example.com",
    "bloodGroup": "O+",
    "allergiesFlag": true,
    "chronicDiseaseFlag": false,
    "emergencyContact": {
      "name": "Jane Doe",
      "relationship": "Spouse",
      "phone": "+12025550199"
    }
  }
  ```
- **Response (`201 Created`)**: Returns full patient document including auto-generated `patientCode` (`PAT-202607-00142`).

---

### 2. Search & List Patients (`GET /api/v1/patients`)
- **Query Parameters**:
  - `search`: String (searches `fullName`, `patientCode`, `primaryPhone`, `nationalId`).
  - `status`: Filter (`ACTIVE`, `INACTIVE`, `ARCHIVED`, `DECEASED`). Default: `ACTIVE`.
  - `gender`: Filter (`male`, `female`, `other`).
  - `bloodGroup`: Filter (`A+`, `O-`, etc.).
  - `page`: Integer. Default: `1`.
  - `limit`: Integer. Default: `20` (max 100).
- **Response (`200 OK`)**: Returns paginated list of matching patient documents.

---

### 3. Fetch Patient Details (`GET /api/v1/patients/:id`)
- **Path Parameters**: `id` — Patient ObjectId.
- **Response (`200 OK`)**: Returns complete patient record. If patient is archived, response includes `"isArchived": true`.
- **Errors**: `404 Not Found` if record does not exist under the provided tenant context.

---

### 4. Update Patient Profile (`PUT /api/v1/patients/:id`)
- **Request Body**: Partial demographic/contact parameters (`firstName`, `lastName`, `primaryPhone`, `email`, `address`, `allergiesFlag`, etc.).
- **Response (`200 OK`)**: Returns updated patient document.
- **Validation**: Rejects changing immutable fields (`patientCode`, `tenantId`, `_id`).

---

### 5. Archive Patient Profile (`POST /api/v1/patients/:id/archive`)
- **Request Body**: `{ "reason": "Patient requested profile closure" }`
- **Response (`200 OK`)**: Returns updated patient document with `status: "ARCHIVED"`.

---

### 6. Restore Patient Profile (`POST /api/v1/patients/:id/restore`)
- **Response (`200 OK`)**: Returns updated patient document with `status: "ACTIVE"`.

---

### 7. Change Patient Status (`POST /api/v1/patients/:id/status`)
- **Request Body**: `{ "status": "DECEASED", "reason": "Deceased notification verified" }`
- **Response (`200 OK`)**: Returns updated status. Rejects invalid transitions (e.g. out of `DECEASED`).

---

## 5. Standardized Error Codes

- `PATIENT_NOT_FOUND`: Patient record missing under active tenant context (`404`).
- `DUPLICATE_PATIENT`: Pre-registration check detected matching National ID or Phone + DOB (`409`).
- `DUPLICATE_NATIONAL_ID`: Provided National ID already assigned to another patient (`409`).
- `INVALID_STATUS_TRANSITION`: Attempted illegal status shift (`400`).
- `TENANT_ACCESS_DENIED`: Header `X-Tenant-ID` does not match user authorization token (`403`).

---

## 6. Security & Audit Requirements

- **Role Authorization**:
  - `Receptionist`: Can search, list, read, create, and update patient contacts.
  - `Doctor`: Can view patient profiles and allergy flags.
  - `Clinic Manager / Owner`: Full permissions, including archiving, restoring, and status shifts.
- **Audit Logging**: Every POST/PUT endpoint dispatches append-only audit events logging Actor ID, Tenant ID, Action Code, and Modified Fields Delta.
