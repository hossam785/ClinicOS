# Appointment Management Module Database Design Specification (APPOINTMENT_MANAGEMENT_DATABASE.md)

This document establishes the conceptual database architecture, collection schemas, entity relationships, index strategies, non-overlapping slot queries, tenant isolation rules, and audit frameworks for the **Appointment Management Module** (Module-006) of ClinicOS. It serves as the authoritative database contract prior to any physical Mongoose model or database driver implementation.

---

## 1. Database Overview

### Purpose
The database architecture for the Appointment Management Module encapsulates all appointment reservations, time slot allocations, doctor shift bounds checks, patient check-in timestamps, consultation transitions, and cancellation audit logs within a clinic workspace tenant.

### Scope
This specification details the MongoDB collection design for appointment records, compound index optimization strategies, multi-tenant partitioning logic, soft deletion retention, and integration extension points for future clinical (EMR) and financial (Billing) modules.

---

## 2. Collection Design: `appointments`

The `appointments` collection serves as the primary scheduling ledger. All documents are strictly partitioned by mandatory `tenantId` parameters.

---

## 3. Appointment Document Structure Specification

### Identity Fields
- `_id`: ObjectId — Required. Primary key.
- `appointmentNumber`: String — Required. Human-readable unique code (`APT-YYYYMM-XXXXX`). Unique per tenant.
- `tenantId`: String — Required. Mandatory multi-tenant workspace key. Indexed.
- `clinicId`: String — Required. Associated clinic branch location identifier. Indexed.

### Relationship References
- `patientId`: String — Required. Reference to Patient document ID (`patients._id`). Indexed per tenant.
- `doctorId`: String — Required. Reference to Doctor document ID (`doctors._id`). Indexed per tenant.

### Scheduling & Time Parameters
- `appointmentDate`: String — Required. ISO 8601 date string (`YYYY-MM-DD`). Indexed per tenant.
- `startTime`: String — Required. 24-hour time string (`HH:MM`).
- `endTime`: String — Required. 24-hour time string (`HH:MM`).
- `durationMinutes`: Number — Required. Slot interval in minutes (e.g. 15, 30, 45, 60). Default: `30`.
- `timezone`: String — Required. Timezone identifier (e.g. `America/New_York`). Default: `UTC`.

### Classification & Status
- `appointmentType`: String — Required. Visit type (`FIRST_VISIT`, `FOLLOW_UP`, `ROUTINE_CHECKUP`, `EMERGENCY`). Default: `FOLLOW_UP`.
- `priority`: String — Required. Visit priority (`NORMAL`, `URGENT`, `EMERGENCY`). Default: `NORMAL`.
- `status`: String — Required. State machine status (`SCHEDULED`, `CONFIRMED`, `CHECKED_IN`, `IN_CONSULTATION`, `COMPLETED`, `CANCELLED`, `NO_SHOW`, `RESCHEDULED`). Default: `SCHEDULED`. Indexed.

### Consultation Lifecycle Timestamps
- `checkedInAt`: Date — Optional. UTC timestamp when patient checked in at reception desk.
- `consultationStartedAt`: Date — Optional. UTC timestamp when doctor started consultation encounter.
- `consultationEndedAt`: Date — Optional. UTC timestamp when consultation finished.
- `completedAt`: Date — Optional. UTC timestamp when visit completed.

### Cancellation & Rescheduling Audit Fields
- `cancelledAt`: Date — Optional. UTC timestamp of cancellation.
- `cancelledBy`: String — Optional. User ID of actor who cancelled appointment.
- `cancellationReason`: String — Optional. Required text explanation if status is `CANCELLED`.
- `rescheduledFromId`: String — Optional. Reference to original `_id` if rescheduled.
- `rescheduledToId`: String — Optional. Reference to new `_id` created upon rescheduling.

### Clinical & Administrative Notes
- `chiefComplaint`: String — Optional. Stated symptoms or reason for visit. Max 500 characters.
- `internalNotes`: String — Optional. Administrative reception notes. Max 1000 characters.

### Metadata & Audit Trail Fields
- `createdAt`: Date — Required. UTC creation timestamp.
- `updatedAt`: Date — Required. UTC last modification timestamp.
- `createdBy`: String — Required. User ID of creator.
- `updatedBy`: String — Required. User ID of last modifier.
- `version`: Number — Required. Optimistic concurrency control counter. Default: `1`.

---

## 4. Relationships

- **Clinic Workspace ── (1 : N) ── Appointments**: Workspace tenant owns all appointment documents (`tenantId`).
- **Doctor Profile ── (1 : N) ── Appointments**: Doctor assigned to appointment slot (`doctorId`).
- **Patient Profile ── (1 : N) ── Appointments**: Patient assigned to appointment reservation (`patientId`).
- **Appointment ── (1 : 1) ── EMR Encounter (Future)**: Completing appointment triggers clinical note creation.
- **Appointment ── (1 : 1) ── Invoice / Receipt (Future)**: Completing appointment emits billable item.

---

## 5. Multi-Tenant Design

- **Hard Partitioning Key**: Every query executed against `appointments` includes `{ tenantId: activeTenantId }`.
- **Cross-Tenant Isolation**: Unique index constraints include `tenantId` to ensure identical appointment numbers can exist across distinct tenant workspaces without collision.

---

## 6. Index Strategy

To support sub-150ms scheduling queries, doctor queue filtering, and conflict detection:

1. **Unique Appointment Number Index**:
   - Keys: `{ tenantId: 1, appointmentNumber: 1 }`
   - Unique: `true`
   - Rationale: Guarantees unique appointment numbers within clinic workspace.
2. **Doctor Overlapping Schedule Index (High Traffic)**:
   - Keys: `{ tenantId: 1, doctorId: 1, appointmentDate: 1, status: 1, startTime: 1 }`
   - Rationale: Accelerates non-overlapping slot query checks for active doctor bookings.
3. **Patient Appointment History Index**:
   - Keys: `{ tenantId: 1, patientId: 1, appointmentDate: -1 }`
   - Rationale: Optimizes retrieving a patient's historical visit timeline.
4. **Daily Queue Directory Index**:
   - Keys: `{ tenantId: 1, appointmentDate: 1, status: 1, startTime: 1 }`
   - Rationale: Optimizes receptionist daily waiting room queue view.

---

## 7. Uniqueness Rules

- `{ tenantId, appointmentNumber }`: Unique within tenant workspace.

---

## 8. Scheduling Integrity Strategy

### Database Non-Overlapping Slot Query
To verify doctor availability, application executes query:
```javascript
db.appointments.find({
  tenantId: activeTenantId,
  doctorId: targetDoctorId,
  appointmentDate: targetDate,
  status: { $nin: ["CANCELLED", "RESCHEDULED", "NO_SHOW"] },
  startTime: { $lt: requestedEndTime },
  endTime: { $gt: requestedStartTime }
})
```
If count > 0, booking is rejected as an overlapping slot conflict.

---

## 9. Soft Delete Strategy

- **Logical Archival**: Physical database deletion is forbidden. Cancelling sets `status: "CANCELLED"`, writes `cancelledAt`, and logs `cancellationReason`.
- **Query Filter Policy**: Active queues query `{ status: { $nin: ["CANCELLED", "RESCHEDULED"] } }`.

---

## 10. Data Integrity Rules

- **Mandatory References**: Documents missing `patientId`, `doctorId`, `appointmentDate`, `startTime`, or `endTime` are rejected.
- **Optimistic Concurrency**: Updates must verify `version` counter to prevent lost updates during concurrent edits.

---

## 11. Future Expansion (Version 2 Hooks)

- Reserved `telemedicine` object for video room links and join passcodes.
- Reserved `reminderStatus` object for tracking automated SMS/WhatsApp reminder dispatches.
- Reserved `resourceId` string for physical consultation room assignment.

---

## 12. Security Considerations

- **Audit Logging**: Write operations emit append-only audit records logging actor ID, tenant ID, and timestamp.
- **Role Scoping**: Doctor roles restricted to viewing queue entries where `doctorId` matches their user ID.
