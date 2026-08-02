# Doctors Management Module User Flows & System Flows (DOCTORS_MANAGEMENT_FLOW.md)

This document establishes the user journeys, system workflows, state transition logic, navigation paths, and permission flows for the **Doctors Management Module** (Module-004) of ClinicOS. It serves as the official workflow specification for database schema design, API contract definition, and UI/UX implementation.

---

## 1. Module Flow Overview

The Doctors Management Module governs how medical practitioners are invited, verified, activated, configured, and managed within a clinic workspace tenant.

This module interacts directly with:
- **Authentication Module**: To map identity credentials (`user_id`), issue authentication tokens, and restrict login access for suspended doctor accounts.
- **Clinic Management Module**: To enforce workspace tenant boundaries (`tenant_id`) and bind doctor availability schedules to clinic working hours.
- **Future Clinical Modules** (Appointments, Patients, EMR, Billing): By providing verified doctor availability, medical license codes, and practitioner consultation parameters.

---

## 2. Actors

### Super Admin
- **Role**: System Compliance Auditor.
- **Responsibilities**: Conducts cross-tenant compliance audits, reviews verified doctor license codes, and manages global platform security policies.

### Clinic Owner
- **Role**: Executive Workspace Administrator.
- **Responsibilities**: Invites new doctors, reviews board certifications, approves medical licenses, configures consultation fee structures, manages department assignments, suspends access, and archives practitioner records.

### Clinic Manager
- **Role**: Operational Administrator.
- **Responsibilities**: Updates doctor shift schedules, maintains department listings, tracks license expiration dates, and updates contact information.

### Doctor
- **Role**: Medical Practitioner.
- **Responsibilities**: Accepts workspace invitation, sets up security credentials, manages professional biography and specialty summaries, and views assigned patient appointment rosters. Cannot alter medical license numbers or administrative statuses.

---

## 3. User Journeys

### Journey 1: Add / Invite New Doctor
- **Trigger**: Clinic Owner or Manager clicks "Invite Doctor" from the Doctors Directory page.
- **Preconditions**: User authenticated with `doctor:invite` permission; workspace in `ACTIVE` state.
- **Main Flow**:
  1. Administrator enters doctor's official email, legal name, primary specialty, and assigned department.
  2. System validates input formats and checks for duplicate registrations.
  3. System creates doctor profile in `PENDING_VERIFICATION` state and dispatches invitation email.
  4. Doctor receives email containing secure onboarding token link.
  5. Doctor completes password creation and profile setup.
- **Alternate Flow**:
  - Doctor already has a platform identity: System prompts doctor to accept association with current tenant workspace.
- **Failure Flow**:
  - Duplicate license code or email: System flags inputs inline with message: "A practitioner with this email or license number is already registered."
- **Completion State**: Doctor profile created in `PENDING_VERIFICATION` state.

### Journey 2: Verify License & Activate Doctor
- **Trigger**: Clinic Owner opens pending practitioner verification queue.
- **Preconditions**: Owner authenticated; doctor in `PENDING_VERIFICATION` state.
- **Main Flow**:
  1. Owner views doctor's uploaded medical license number, issuing authority, and board certification documents.
  2. Owner verifies credentials against official registry.
  3. Owner clicks "Approve License & Activate".
  4. System updates doctor status to `ACTIVE`, logs audit event, and enables practitioner slot publishing for patient appointments.
- **Alternate Flow**:
  - Rejection: Owner enters rejection reason and clicks "Reject Application". Status set to `REJECTED`.
- **Failure Flow**:
  - Verification error: System displays alert if license code format fails national regulatory checks.
- **Completion State**: Doctor status updated to `ACTIVE`.

### Journey 3: Update Doctor Profile & Consultation Fees
- **Trigger**: Clinic Owner, Manager, or Doctor accesses Doctor Profile settings.
- **Preconditions**: User authenticated with appropriate write permissions; doctor in `ACTIVE` state.
- **Main Flow**:
  1. User edits consultation fee rate, default consultation duration (e.g. 20 mins), biography text, or contact number.
  2. User clicks "Save Profile Changes".
  3. System validates input values, updates database record, logs audit entry, and shows success toast.
- **Failure Flow**:
  - Invalid fee format or negative numbers: Input flagged with inline validation error.
- **Completion State**: Doctor profile and consultation parameters updated.

### Journey 4: Suspend Doctor Access (Temporary Leave / Review)
- **Trigger**: Clinic Owner initiates suspension for a practitioner going on extended leave or under internal audit.
- **Preconditions**: Doctor currently in `ACTIVE` state.
- **Main Flow**:
  1. Owner selects doctor profile and clicks "Suspend Practitioner Access".
  2. System prompts confirmation modal: "Suspending this practitioner will block their login and flag all upcoming appointments."
  3. Owner confirms suspension with mandatory reason note.
  4. System sets status to `SUSPENDED`, revokes active user JWT sessions, flags upcoming booking slots for reassignment, and logs audit record.
- **Failure Flow**:
  - Concurrent modification error: System reloads current status if already altered.
- **Completion State**: Doctor status set to `SUSPENDED`; login blocked.

### Journey 5: Reactivate Doctor Access
- **Trigger**: Doctor returns from extended leave; Clinic Owner restores active status.
- **Preconditions**: Doctor currently in `SUSPENDED` state.
- **Main Flow**:
  1. Owner opens suspended practitioners list and clicks "Reactivate Access".
  2. System updates doctor status to `ACTIVE`, logs audit record, and restores login access.
- **Completion State**: Doctor restored to `ACTIVE` status.

### Journey 6: Archive Doctor Record (Employment Termination)
- **Trigger**: Doctor leaves clinic permanently.
- **Preconditions**: Doctor in `SUSPENDED` or `ACTIVE` state; no unhandled active appointments.
- **Main Flow**:
  1. Owner clicks "Archive Doctor Record".
  2. System displays confirmation modal emphasizing soft-delete compliance: "Archiving preserves historical patient encounters for legal compliance but removes practitioner from active rosters."
  3. Owner confirms archive operation.
  4. System updates status to `ARCHIVED`, sets `archived_at` timestamp, and revokes access permanently.
- **Completion State**: Doctor record in `ARCHIVED` state (read-only audit trail).

---

## 4. System Flows

```
[Invite Request Submitted]
           │
           ▼
┌───────────────────────────────┐
│ Input Format & Email Validation│
└───────────────┬───────────────┘
                │ Valid
                ▼
┌───────────────────────────────┐
│ Check Unique License & Email  │
└───────────────┬───────────────┘
                │ Pass
                ▼
┌───────────────────────────────┐
│ Create Doctor Record          │
│ (PENDING_VERIFICATION)        │
│ Emit Audit Trail Entry        │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ Dispatch Verification Email   │
└───────────────────────────────┘
```

### System Process: Suspension Execution & Session Invalidation
1. Admin triggers doctor status change to `SUSPENDED`.
2. System opens database transaction.
3. System updates `doctors.status` to `SUSPENDED` and writes `updated_at`.
4. System queries active session store for `user_id` and revokes active JWT tokens.
5. System scans appointment registry for upcoming slots assigned to `doctor_id` and marks them as `REQUIRES_REASSIGNMENT`.
6. System records audit log entry (`DOCTOR_SUSPENDED`, actor_id, timestamp).
7. Transaction commits.

---

## 5. State Transition Flows

```
[Invitation] ──► PENDING_VERIFICATION ──► ACTIVE ──► SUSPENDED
                                            │            │
                                            ▼            ▼
                                        ARCHIVED ◄── REACTIVATED (ACTIVE)
```

### Allowed State Transitions
- `PENDING_VERIFICATION` ➔ `ACTIVE` | `REJECTED`
- `ACTIVE` ➔ `SUSPENDED` | `ARCHIVED`
- `SUSPENDED` ➔ `ACTIVE` (Reactivated) | `ARCHIVED`
- `ARCHIVED` ➔ None (Terminal State)

### Blocked / Prohibited Transitions
- Cannot transition from `SUSPENDED` directly to `PENDING_VERIFICATION`.
- Cannot transition from `ARCHIVED` back to `ACTIVE` without manual Super Admin database restore under compliance audit.
- Cannot activate a doctor without a validated medical license number.

---

## 6. Navigation Flows

```
[Workspace Navigation]
           │
           └─► [Doctors Directory] ──┬─► [Invite Doctor Modal]
                                      ├─► [Doctor Profile View] ──┬─► [Edit Professional Details]
                                      │                           ├─► [Working Hours & Shifts]
                                      │                           └─► [Status Actions Modal]
                                      └─► [Suspended / Archive Queue]
```

---

## 7. Permission Flows

| Action | Super Admin | Clinic Owner | Clinic Manager | Doctor (Self) | Patient |
| :--- | :---: | :---: | :---: | :---: | :---: |
| View Doctor Directory | Yes | Yes | Yes | Yes | Yes (Public info) |
| Invite New Doctor | Yes | Yes | Yes | No | No |
| Verify Medical License | Yes | Yes | Yes | No | No |
| Edit Consultation Fees | Yes | Yes | No | No | No |
| Edit Biography & Photo | Yes | Yes | Yes | Yes | No |
| Suspend Doctor Access | Yes | Yes | No | No | No |
| Archive Doctor Record | Yes | Yes | No | No | No |

---

## 8. Validation Flows

- **Medical License Code**: Required, 4–30 alphanumeric characters, unique per jurisdiction.
- **Consultation Fee**: Non-negative numeric decimal value (>= 0).
- **Default Duration**: Required integer step between 10 and 120 minutes (e.g. 15, 20, 30, 45, 60 mins).
- **Email Address**: Valid RFC 5322 format.
- **Phone Number**: Valid E.164 international phone number format.

---

## 9. Exception Flows

- **Expired Medical License**: System displays amber warning badge on doctor profile when license expiration date is within 30 days. On expiration, new booking slot publishing is blocked.
- **Concurrent Status Update**: If two managers alter a doctor's status simultaneously, optimistic concurrency control (`version` check) rejects the second attempt with: "Doctor status updated by another user. Refreshing."
- **Suspension with Active Appointments**: System displays alert modal presenting total count of affected future appointments and links directly to reassignment console.

---

## 10. Security Flows

- **Tenant Scoping**: All database requests for doctor profiles enforce `WHERE tenant_id = :tenantId`.
- **RBAC Guard**: API gateway verifies user JWT role (`CLINIC_OWNER`, `CLINIC_MANAGER`) before granting update permissions.
- **Audit Logging**: All administrative actions (invitations, license approvals, fee edits, status changes) emit immutable audit logs containing Actor ID, Doctor ID, Tenant ID, and Timestamp.

---

## 11. Integration Flows

- **Authentication Module**: Verifies user token claims on login; rejects login if doctor status is `SUSPENDED` or `ARCHIVED`.
- **Clinic Management Module**: Verifies doctor shift hours do not exceed clinic workspace operating hours.
- **Future Appointment Module**: Queries active doctors to publish appointment slot rosters.
- **Notification Service**: Sends email alerts to doctors upon invitation, license verification, or schedule changes.

---

## 12. UX Considerations

- **Visual Status Badges**: Visual indicators utilizing Design System colors and Lucide React SVG icons (`Clock` - Amber, `CheckCircle2` - Green, `ShieldAlert` - Red, `Archive` - Neutral). Emojis are strictly forbidden.
- **Toast Feedback**: Instant visual confirmation when profile settings or consultation fees are saved ("Doctor profile updated successfully").
- **Unsaved Changes Shield**: Prompts confirmation modal if user attempts to leave an edit view with unsaved input fields.

---

## 13. Assumptions

- Doctors belong to one primary clinic workspace tenant in Version 1.
- License codes are verified manually by Clinic Owners or Managers against official medical boards.
- All monetary amounts use the workspace tenant's default currency.

---

## 14. Out of Scope

- Doctor payroll and commission processing.
- Direct patient medical encounter notes (EMR Module).
- Patient slot booking execution (Appointment Module).
