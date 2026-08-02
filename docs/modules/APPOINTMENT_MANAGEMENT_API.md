# Appointment Management Module REST API Specification (APPOINTMENT_MANAGEMENT_API.md)

This document establishes the official REST API specification for the **Appointment Management Module** (Module-006) of ClinicOS. It serves as the immutable API contract binding backend implementation services with frontend consumer views.

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
    "id": "apt-101",
    "appointmentNumber": "APT-202607-00101",
    "tenantId": "clinic-101",
    "clinicId": "clinic-branch-01",
    "patientId": "pat-101",
    "doctorId": "doc-101",
    "appointmentDate": "2026-07-30",
    "startTime": "09:00",
    "endTime": "09:30",
    "durationMinutes": 30,
    "appointmentType": "FOLLOW_UP",
    "priority": "NORMAL",
    "status": "SCHEDULED",
    "chiefComplaint": "Routine follow-up consultation",
    "createdAt": "2026-07-29T19:00:00.000Z",
    "updatedAt": "2026-07-29T19:00:00.000Z",
    "createdBy": "usr-101",
    "updatedBy": "usr-101",
    "version": 1
  },
  "meta": {
    "timestamp": "2026-07-29T19:44:00.000Z"
  }
}
```

### 2. Standard Error Response Structure (`400`, `401`, `403`, `404`, `409`, `422`)
```json
{
  "success": false,
  "error": {
    "code": "APPOINTMENT_CONFLICT",
    "message": "Dr. Eleanor Vance has an overlapping active appointment from 09:00 to 09:30.",
    "details": {
      "conflictingAppointmentId": "apt-099",
      "doctorId": "doc-101",
      "requestedTime": "09:00-09:30"
    }
  },
  "meta": {
    "timestamp": "2026-07-29T19:44:00.000Z"
  }
}
```

---

## 3. Endpoint Catalog

| HTTP Method | Resource Path | Description | Access Roles |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/v1/appointments` | Book new appointment reservation | Receptionist, Doctor, Manager, Owner |
| **GET** | `/api/v1/appointments` | List & filter appointments with pagination | Receptionist, Doctor, Manager, Owner |
| **GET** | `/api/v1/appointments/availability` | Check doctor slot availability & conflict status | Receptionist, Doctor, Manager, Owner |
| **GET** | `/api/v1/appointments/queue/daily` | Get real-time daily waiting room queue roster | Receptionist, Doctor, Manager, Owner |
| **GET** | `/api/v1/appointments/:id` | Get details of a specific appointment | Receptionist, Doctor, Manager, Owner |
| **PUT** | `/api/v1/appointments/:id` | Update administrative details of appointment | Receptionist, Manager, Owner |
| **POST** | `/api/v1/appointments/:id/reschedule` | Reschedule appointment to a new date/time | Receptionist, Manager, Owner |
| **POST** | `/api/v1/appointments/:id/cancel` | Cancel appointment reservation | Receptionist, Manager, Owner |
| **POST** | `/api/v1/appointments/:id/check-in` | Mark patient as arrived (Waiting Room queue) | Receptionist, Manager, Owner |
| **POST** | `/api/v1/appointments/:id/start-consultation`| Doctor starts consultation (`IN_CONSULTATION`) | Doctor, Manager, Owner |
| **POST** | `/api/v1/appointments/:id/complete` | Doctor completes visit (`COMPLETED`) | Doctor, Manager, Owner |
| **POST** | `/api/v1/appointments/:id/status` | Generic administrative status transition | Receptionist, Manager, Owner |

---

## 4. Endpoint Specifications

### 1. Book New Appointment
* **Method & Path**: `POST /api/v1/appointments`
* **Request Body**:
```json
{
  "patientId": "pat-101",
  "doctorId": "doc-101",
  "clinicId": "clinic-branch-01",
  "appointmentDate": "2026-07-30",
  "startTime": "09:00",
  "endTime": "09:30",
  "durationMinutes": 30,
  "appointmentType": "FOLLOW_UP",
  "priority": "NORMAL",
  "chiefComplaint": "Routine follow-up consultation"
}
```
* **Success Response**: `201 Created`

### 2. Check Doctor Availability
* **Method & Path**: `GET /api/v1/appointments/availability?doctorId=doc-101&date=2026-07-30&startTime=09:00&endTime=09:30`
* **Success Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "available": true,
    "doctorId": "doc-101",
    "date": "2026-07-30",
    "requestedTime": "09:00-09:30",
    "conflicts": []
  }
}
```

### 3. Patient Check-In (Reception Desk)
* **Method & Path**: `POST /api/v1/appointments/:id/check-in`
* **Success Response**: `200 OK` (Updates status to `CHECKED_IN`, records `checkedInAt` timestamp).

---

## 5. Standardized Error Codes

- `APPOINTMENT_NOT_FOUND`: Appointment record does not exist or belongs to another tenant (`404`).
- `APPOINTMENT_CONFLICT`: Requested slot overlaps with an active appointment (`409`).
- `DOCTOR_UNAVAILABLE`: Doctor has no active shift or is on leave on selected date (`400`).
- `CLINIC_CLOSED`: Selected date coincides with clinic holiday or closure (`400`).
- `INVALID_STATUS_TRANSITION`: Prohibited state machine transition (`400`).
- `TENANT_ACCESS_DENIED`: Missing or mismatched workspace tenant header (`403`).

---

## 6. Security Model

- **Bearer JWT Authentication**: All endpoints require a valid Authorization header (`Bearer <token>`).
- **X-Tenant-ID Header**: Mandatory workspace scoping header; must match token `tenantId`.
- **Role-Based Access Control (RBAC)**:
  - `Doctor`: Restricted to viewing queues and completing visits.
  - `Receptionist`: Full booking, rescheduling, check-in, and cancellation privileges.
