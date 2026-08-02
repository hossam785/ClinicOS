# Appointment Management Module User Flows & System Flows (APPOINTMENT_MANAGEMENT_FLOW.md)

This document establishes the user journeys, operational scheduling flows, conflict resolution algorithms, check-in workflows, consultation transitions, and system integration points for the **Appointment Management Module** (Module-006) of ClinicOS. It serves as the official workflow blueprint for database schema design, API contract definition, and UI/UX implementation.

---

## 1. Module Workflow Overview

The Appointment Management Module operates as the central scheduling engine for a clinic workspace tenant.

This module interacts directly with:
- **Clinic Management Module**: Enforces workspace tenant boundaries (`tenant_id`), branch locations (`clinic_id`), and clinic operating hours.
- **Doctors Management Module**: Enforces doctor weekly shift rosters, vacation leaves, default slot durations, and consultation fee rates.
- **Patients Management Module**: Links appointment reservations to master patient index records (`patient_id`).
- **Future Clinical & Financial Modules**: Initiates clinical encounter charts in EMR upon patient check-in and emits billable consultation fee items to Billing upon completion.

---

## 2. Create Appointment Workflow

```
[Booking Request Initiated]
           │
           ▼
┌───────────────────────────────┐
│ Validate Doctor, Patient,     │
│ & Clinic Scoping (Tenant ID)  │
└───────────────┬───────────────┘
                │ Valid
                ▼
┌───────────────────────────────┐
│ Doctor Shift & Leave Check    │
│ (Active Roster & No Vacations)│
└───────────────┬───────────────┘
                │ Available
                ▼
┌───────────────────────────────┐
│ Non-Overlapping Slot Check    │
│ (start_time < existing_end)   │
└───────────────┬───────────────┘
                │ No Conflict
                ▼
┌───────────────────────────────┐
│ Generate Appointment Code     │
│ (APT-YYYYMM-XXXXX)            │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ Save Record (SCHEDULED Status)│
│ Emit Audit Log Event          │
└───────────────────────────────┘
```

- **Entry Conditions**: Receptionist or Clinic Manager clicks "Book Appointment" from Directory, Patient Profile, or Calendar View.
- **Scoping Validation**: System verifies patient, doctor, and clinic belong to active workspace tenant.
- **Shift & Leave Validation**: Verifies date/time falls within doctor's working shifts and no doctor leave exception exists.
- **Conflict Check**: Verifies doctor has no overlapping active appointment (`start_time < existing_end_time AND end_time > existing_start_time`).
- **Success Path**: Generates `APT-YYYYMM-XXXXX` code, saves record in `SCHEDULED` status, displays success notification.
- **Failure Path**: Displays inline error banner detailing conflict (e.g. "Dr. Smith has an overlapping appointment at 10:00 AM").

---

## 3. Edit & Reschedule Appointment Workflows

### Edit Appointment Workflow
- **Editable Fields**: Chief complaint, visit priority, administrative notes.
- **Restricted Fields**: Cannot modify `appointment_number`, `tenant_id`, `patient_id`, or `doctor_id` directly without rescheduling.

### Reschedule Appointment Workflow
- **Entry Conditions**: User requests changing date or time slot of an existing appointment.
- **Execution**: System validates target slot availability against doctor shifts and existing bookings.
- **Status Change**: Original appointment marked as `RESCHEDULED`, and new appointment created in `SCHEDULED` status linked to original reservation ID.

---

## 4. Cancel & Check-In Workflows

### Cancel Appointment Workflow
- **Preconditions**: Appointment in `SCHEDULED` or `CONFIRMED` status.
- **Requirement**: Mandatory non-empty cancellation reason.
- **Outcome**: Status updated to `CANCELLED`, slot released for immediate booking, audit log emitted.

### Check-In Workflow
- **Preconditions**: Patient arrives at clinic; appointment in `SCHEDULED` or `CONFIRMED` status on current date.
- **Outcome**: Status updated to `CHECKED_IN`, patient inserted into Doctor's Real-Time Waiting Room Queue.

---

## 5. Consultation Workflow

```
CHECKED_IN ──► IN_CONSULTATION ──► COMPLETED
                   │                  │
                   ▼                  ▼
          (EMR Chart Created)  (Billing Item Emitted)
```

- **Start Consultation (`IN_CONSULTATION`)**: Doctor selects patient from waiting room queue. Status transitions to `IN_CONSULTATION`. EMR Module creates empty clinical encounter chart.
- **Complete Visit (`COMPLETED`)**: Doctor completes consultation encounter. Status transitions to `COMPLETED`. Billing Module receives billable fee item.

---

## 6. Appointment Status Workflow

```
SCHEDULED ──► CONFIRMED ──► CHECKED_IN ──► IN_CONSULTATION ──► COMPLETED
    │             │              │
    ▼             ▼              ▼
RESCHEDULED   CANCELLED       NO_SHOW
```

- **Allowed State Transitions**:
  - `SCHEDULED` ➔ `CONFIRMED` | `CHECKED_IN` | `CANCELLED` | `RESCHEDULED`
  - `CONFIRMED` ➔ `CHECKED_IN` | `CANCELLED` | `RESCHEDULED` | `NO_SHOW`
  - `CHECKED_IN` ➔ `IN_CONSULTATION` | `CANCELLED`
  - `IN_CONSULTATION` ➔ `COMPLETED`
- **Prohibited Transitions**: Cannot transition out of `COMPLETED`, `CANCELLED`, or `NO_SHOW` terminal states.

---

## 7. Multi-Tenant & Security Workflows

- **Tenant Scoping**: All database operations include mandatory `WHERE tenant_id = :tenantId`.
- **RBAC Roles**:
  - `Receptionist`: Book, reschedule, cancel, confirm, and check-in appointments.
  - `Doctor`: View daily queue, start consultation (`IN_CONSULTATION`), and complete visit (`COMPLETED`).
  - `Clinic Manager / Owner`: Full administrative access.

---

## 8. Edge Cases & Conflict Handling

- **Simultaneous Booking Attempts**: Optimistic concurrency control (`version` counter) rejects overlapping concurrent requests.
- **Doctor Declares Leave After Booking**: Affected appointments flagged with `CONFLICT_LEAVE_DECLARED` badge for receptionist re-assignment.
- **Patient Archived After Booking**: Appointment system blocks check-in for archived patients until profile restored.
