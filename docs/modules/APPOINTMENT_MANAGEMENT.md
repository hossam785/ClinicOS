# Appointment Management Module Requirements Specification (APPOINTMENT_MANAGEMENT.md)

This document establishes the business requirements, operational goals, appointment lifecycles, scheduling conflict rules, status state transitions, and integration hooks for the **Appointment Management Module** (Module-006) of ClinicOS. It serves as the single source of truth for all future technical design, database schemas, API contracts, and UI/UX implementations.

---

## 1. Module Purpose

### Why the Appointment Management Module Exists
The Appointment Management Module serves as the operational scheduling engine for ClinicOS. It coordinates patient consultation requests, doctor working shifts, and clinic room availability. It prevents double-bookings, tracks patient visit progressions, and optimizes daily clinic throughput.

### Scope & System Position
The Appointment Management Module connects patient demand with doctor supply across clinic workspace boundaries (`tenant_id`):
- **Clinic Management**: Respects clinic operating hours, branch locations, and holiday closures.
- **Doctors Management**: Enforces doctor weekly shift rosters, consultation fee structures, default slot durations, and vacation leaves.
- **Patients Management**: Binds appointment reservations to verified master patient index (MPI) records (`patient_id`).
- **Future EMR / Medical Records**: Initiates clinical encounter charts upon patient check-in.
- **Future Billing Module**: Emits billable consultation events upon appointment completion.

---

## 2. Business Goals

- **Conflict-Free Scheduling Engine**: Eliminate double-bookings and doctor schedule overlaps.
- **Optimized Daily Operations**: Provide receptionists and doctors with real-time daily queue rosters and visit status trackers.
- **Multi-Doctor & Multi-Clinic Support**: Support multi-practitioner scheduling across multiple clinic branch locations under a unified workspace tenant.
- **Fast Lookup & Queue Filtering**: Support sub-second appointment search by Appointment Number, Patient Name, Doctor, Date, or Status.
- **Future Online Booking & Telemedicine Compatibility**: Structuring reservation entities to support future patient self-service booking portals and video consultations.

---

## 3. Appointment Lifecycle

```
[Booking Request] ──► Scheduled ──► Confirmed ──► Checked In ──► In Consultation ──► Completed
                        │             │                │
                        ▼             ▼                ▼
                   Rescheduled    Cancelled         No Show
```

### Lifecycle Stages & Descriptions
1. **Scheduled**: Appointment reservation created for a future date/time slot.
2. **Confirmed**: Patient or clinic staff confirmed appointment attendance.
3. **Checked In**: Patient arrived at clinic reception desk and is waiting in the waiting room.
4. **In Consultation**: Patient entered the doctor's consultation room; encounter in progress.
5. **Completed**: Consultation finished; doctor ended encounter. Billable event emitted.
6. **Cancelled**: Appointment cancelled by patient or clinic prior to visit. Slot freed.
7. **No Show**: Patient failed to arrive at clinic without prior cancellation notice.
8. **Rescheduled**: Original appointment cancelled and moved to a new date/time slot with audit tracking.

### Allowed & Prohibited Transitions
- **Allowed**: `Scheduled` ➔ `Confirmed` | `Checked In` | `Cancelled` | `Rescheduled`
- **Allowed**: `Confirmed` ➔ `Checked In` | `Cancelled` | `Rescheduled` | `No Show`
- **Allowed**: `Checked In` ➔ `In Consultation` | `Cancelled`
- **Allowed**: `In Consultation` ➔ `Completed`
- **Prohibited**: Cannot transition out of `Completed`, `Cancelled`, or `No Show` terminal states.
- **Prohibited**: Cannot transition directly from `Scheduled` to `Completed` without checking in or entering consultation.

---

## 4. Appointment Information Specification

### 1. System-Generated Attributes (Immutable)
- `appointment_id`: Unique internal identifier (UUID).
- `tenant_id`: Mandatory clinic workspace scoping key.
- `appointment_number`: Human-readable unique code (e.g. `APT-202607-00189`).
- `created_at`: UTC creation timestamp.
- `updated_at`: UTC last modification timestamp.

### 2. Required Business Attributes
- `patient_id`: Reference to patient master profile.
- `doctor_id`: Reference to attending doctor profile.
- `clinic_id`: Reference to clinic branch location.
- `appointment_date`: ISO 8601 date string (`YYYY-MM-DD`).
- `start_time`: 24-hour time format string (`HH:MM`).
- `end_time`: 24-hour time format string (`HH:MM`).
- `duration_minutes`: Slot duration in minutes (e.g. 15, 30, 45, 60).
- `appointment_type`: Visit type (`first_visit`, `follow_up`, `routine_checkup`, `emergency`).
- `status`: Current lifecycle state (`SCHEDULED`, `CONFIRMED`, `CHECKED_IN`, `IN_CONSULTATION`, `COMPLETED`, `CANCELLED`, `NO_SHOW`, `RESCHEDULED`).

### 3. Optional Business Attributes
- `chief_complaint`: Patient's stated reason for visit / symptoms summary.
- `priority`: Visit priority level (`normal`, `urgent`, `emergency`). Default: `normal`.
- `cancellation_reason`: Required text if status transitions to `CANCELLED`.
- `administrative_notes`: Internal receptionist or clinic notes.

---

## 5. Scheduling Rules

- **Doctor Shift Boundary Check**: Appointments can only be booked within a doctor's active weekly shift roster for that day of week.
- **Doctor Vacation & Leave Check**: Appointments cannot be booked on dates where doctor has a declared leave exception.
- **Clinic Operating Hours Check**: Appointments must fall within clinic working hours and cannot be scheduled on clinic holidays.
- **Non-Overlapping Slot Constraint**: Two active appointments for the same doctor cannot overlap in time (`start_time < existing_end_time AND end_time > existing_start_time`).
- **Past Date Restriction**: New appointments cannot be scheduled for past dates or times unless created by Administrator as a historical record override.

---

## 6. Conflict Detection Rules

- **Pre-Booking Conflict Check**: Before saving an appointment, the system evaluates:
  1. Is the doctor active and available on the selected date/time?
  2. Does the doctor have an overlapping active appointment?
  3. Is the patient already booked with another doctor at the exact same time?
- **Conflict Handling**: If a conflict is detected, booking is rejected with explicit message: "Doctor Dr. Smith has an overlapping appointment from 10:00 to 10:30."

---

## 7. Search & Filtering Requirements

- **Multi-Parameter Search**: Search by Appointment Number, Patient Name, Patient Code, Doctor Name, or Phone.
- **Queue Filtering**: Filter by Date Range (Today, Tomorrow, This Week, Custom), Status (`SCHEDULED`, `CHECKED_IN`, `COMPLETED`, etc.), Doctor, or Clinic Branch.
- **Real-Time Queue Sorting**: Default queue sorted chronologically by `start_time`.

---

## 8. Multi-Tenant Rules

- **Tenant Isolation**: Every appointment entity carries a mandatory `tenant_id`.
- **Cross-Tenant Access Guard**: Users cannot query or manage appointments belonging to another clinic workspace tenant.

---

## 9. Relationship Matrix

- **Clinics**: Scoped to Clinic Workspace (`tenant_id`).
- **Doctors**: Assigned to Doctor Profile (`doctor_id`).
- **Patients**: Linked to Patient Master Record (`patient_id`).
- **Future EMR**: Generates encounter chart on `IN_CONSULTATION`.
- **Future Billing**: Emits billable consultation fee item on `COMPLETED`.

---

## 10. Business Rules

- **Check-In Validation**: Patient must be in `SCHEDULED` or `CONFIRMED` status to execute `CHECKED_IN`.
- **In-Consultation Validation**: Only doctors assigned to the appointment or clinic owners can transition status to `IN_CONSULTATION`.
- **Mandatory Cancellation Reason**: Transitioning to `CANCELLED` requires a non-empty cancellation reason.

---

## 11. Security Requirements

- **Role-Based Access Control**:
  - `Receptionist`: Can create, reschedule, confirm, check-in, and cancel appointments.
  - `Doctor`: Can view daily queue, start consultation (`IN_CONSULTATION`), and complete visit (`COMPLETED`).
  - `Clinic Manager / Owner`: Full administrative access across all appointments.
- **Audit Logging**: All appointment creations, status changes, reschedules, and cancellations emit immutable audit logs.

---

## 12. Future Expansion (Version 2 Scope)

- Online patient self-booking portal integration.
- Automated SMS / Email / WhatsApp appointment reminders.
- Waiting list queue management and auto-fill for cancelled slots.
- Telemedicine video consultation room links.

---

## 13. Non-Functional Requirements

- **Performance**: Daily appointment queue searches execute in under 150ms.
- **Availability**: Guarantee 99.9% uptime for appointment queue operations.
- **Scalability**: Support scaling to 1,000,000+ appointment records per tenant.

---

## 14. Out of Scope (Version 1)

- Automatic SMS/WhatsApp notification dispatching.
- Patient self-service booking portal UI.
- Direct billing payment gateway processing.
