# Clinic Management Module User Flows & System Flows (CLINIC_MANAGEMENT_FLOW.md)

This document establishes the user journeys, system workflows, state transition logic, and navigation paths for the **Clinic Management Module** of ClinicOS. It serves as the official workflow specification for database schema design, API contract definition, and UI/UX implementation.

---

## 1. Module Flow Overview

The Clinic Management Module serves as the organizational foundation of ClinicOS. It governs how clinic tenants are created, verified, configured, activated, and managed across their lifecycle. 

This module sits between system-wide platform management (Super Admin context) and tenant-specific clinical operations (Clinic Owner / Staff context). It interacts directly with:
- **Authentication Module**: For tenant identity resolution (`X-Tenant-ID`) and status validation during session initialization.
- **Future Clinical Modules** (Doctors, Patients, Appointments, Billing): By serving as the single source of truth for clinic working hours, timezone defaults, operational status, and organizational metadata.

---

## 2. Actors

### Super Admin
- **Role**: Platform Operator & Administrator.
- **Responsibilities**: Reviews incoming clinic registration applications, audits medical licenses, approves/rejects pending clinics, manages tenant status overrides (Activate, Suspend, Reactivate, Archive), and conducts global system audits.

### Clinic Owner
- **Role**: Primary License Holder / Primary Executive User.
- **Responsibilities**: Completes initial clinic profile configuration, sets default timezone and currency parameters, configures operating hours, manages billing contacts, and delegates operational roles to Clinic Managers.

### Clinic Manager
- **Role**: Operational Administrative Lead.
- **Responsibilities**: Updates daily working hours, manages holiday shift exceptions, updates contact numbers and physical location details, and maintains operational settings.

### System (Automated Services)
- **Role**: Core Platform Services.
- **Responsibilities**: Enforces multi-tenant data boundaries, executes status transition hooks, invalidates active sessions on tenant suspension, logs audit trails for profile modifications, and exposes operating schedules to booking modules.

---

## 3. User Journeys

### Journey 1: Register Clinic
- **Trigger**: A clinic founder or representative submits a new clinic registration form.
- **Preconditions**: Public access to registration interface; user email and mobile number not previously registered for another clinic.
- **Main Flow**:
  1. Registrant enters clinic legal name, tax ID, official email, phone number, and owner details.
  2. System validates input formats and checks for duplicate registrations.
  3. System creates tenant record in `PENDING_REVIEW` state and creates owner user account.
  4. System dispatches verification email to owner and notifies Super Admin queue.
  5. Owner verifies email address.
- **Alternate Flow**:
  - Registrant already has an account: System prompts user to sign in to existing tenant or request multi-clinic association (V2 feature).
- **Failure Flow**:
  - Validation fails (e.g. invalid tax ID or duplicate registration number): System highlights erroneous fields inline and prevents form submission.
- **Completion State**: Clinic tenant created in `PENDING_REVIEW` state; verification pending.

### Journey 2: Review Clinic Information (Super Admin)
- **Trigger**: Super Admin opens the pending clinic approval queue.
- **Preconditions**: Super Admin authenticated with active platform management session.
- **Main Flow**:
  1. Super Admin selects a pending clinic record from the admin dashboard.
  2. System displays submitted medical license documents, tax identifier, contact information, and owner credentials.
  3. Super Admin verifies details against official regulatory database.
  4. Super Admin clicks "Approve Clinic Application".
  5. System updates tenant status to `APPROVED` and dispatches activation email to Clinic Owner.
- **Alternate Flow**:
  - Rejection: Super Admin enters rejection reason and clicks "Reject Application". Tenant status changes to `REJECTED`, email sent to registrant.
- **Failure Flow**:
  - Verification service offline: Super Admin receives alert that external registry lookup failed; can retry or approve manually with override flag.
- **Completion State**: Tenant transitions to `APPROVED` state.

### Journey 3: Update Clinic Profile & Operating Hours (Clinic Owner / Manager)
- **Trigger**: Owner or Manager accesses "Clinic Settings" from the workspace navigation.
- **Preconditions**: User authenticated with `clinic:profile:write` permission; tenant in `ACTIVE` state.
- **Main Flow**:
  1. User navigates to Clinic Profile & Operating Hours page.
  2. System displays current clinic name, logo, contact numbers, address, and daily shift table (Monday–Sunday).
  3. User modifies physical address, contact phone, and updates shift times (e.g., Monday 08:00–17:00, Lunch 12:00–13:00).
  4. User clicks "Save Profile & Schedule Changes".
  5. System validates shift bounds (start < end, lunch within shift), updates record, logs audit entry, and shows success toast.
- **Alternate Flow**:
  - Holiday Exception: User adds a specific holiday override date (e.g. National Holiday closed). System stores date exception.
- **Failure Flow**:
  - Overlapping or invalid shift times: System flags shift inputs with inline error messages (e.g. "Lunch break must start after shift start time").
- **Completion State**: Clinic profile and operational schedules updated and active for scheduling modules.

### Journey 4: Suspend Clinic Tenant (Super Admin)
- **Trigger**: Super Admin flags a clinic for non-payment or compliance violation.
- **Preconditions**: Clinic currently in `ACTIVE` state.
- **Main Flow**:
  1. Super Admin navigates to Tenant Management and selects the target clinic.
  2. Super Admin clicks "Suspend Workspace" and enters mandatory reason code.
  3. System prompts confirmation modal: "Suspending this workspace will immediately terminate all active staff sessions."
  4. Super Admin confirms suspension.
  5. System sets tenant status to `SUSPENDED`, revokes active sessions in session store, dispatches notification email to Clinic Owner, and logs audit event.
- **Alternate Flow**:
  - Scheduled Suspension: Super Admin sets a grace period end date for auto-suspension.
- **Failure Flow**:
  - Concurrent status update: System detects state mismatch and reloads current tenant status.
- **Completion State**: Tenant in `SUSPENDED` state; all user sessions for tenant terminated.

### Journey 5: Reactivate Clinic Tenant (Super Admin)
- **Trigger**: Clinic Owner resolves compliance issue or settles subscription invoice.
- **Preconditions**: Clinic currently in `SUSPENDED` state.
- **Main Flow**:
  1. Super Admin accesses suspended clinics queue.
  2. Super Admin verifies resolution and clicks "Reactivate Workspace".
  3. System updates tenant status to `ACTIVE`, logs audit entry, and dispatches notification email to Clinic Owner.
  4. Clinic Owner and staff can now sign in normally.
- **Failure Flow**:
  - System error during status update: Transaction rolls back, error toast shown to Super Admin.
- **Completion State**: Tenant restored to `ACTIVE` state.

### Journey 6: Archive Clinic Tenant (Super Admin)
- **Trigger**: Clinic permanently closes or contract is terminated.
- **Preconditions**: Clinic in `SUSPENDED` or `APPROVED` state.
- **Main Flow**:
  1. Super Admin initiates archive request from Tenant Management.
  2. System prompts double-confirmation dialog: "Archiving is a permanent soft-delete. Data will remain in read-only audit mode for regulatory compliance."
  3. Super Admin confirms archive action.
  4. System sets tenant status to `ARCHIVED`, soft-deletes active reference pointers, and records final audit log.
- **Completion State**: Tenant in `ARCHIVED` state; read-only for compliance audits.

---

## 4. System Flows

```
[Client Registration Request]
            │
            ▼
┌───────────────────────────────┐
│ Input Format & Format Validation │
└───────────────┬───────────────┘
                │ Valid
                ▼
┌───────────────────────────────┐
│ Unique Check (Name, Tax ID)   │
└───────────────┬───────────────┘
                │ Pass
                ▼
┌───────────────────────────────┐
│ Create Tenant (PENDING_REVIEW)│
│ Create Owner User Record      │
│ Write System Audit Log Entry  │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ Dispatch Verification Email   │
│ Enqueue Super Admin Notice    │
└───────────────────────────────┘
```

### System Process: Status Transition & Invalidation
1. Admin triggers status update (e.g. `ACTIVE` ➔ `SUSPENDED`).
2. System opens database transaction.
3. System updates `tenants.status` field and records `updatedAt` timestamp.
4. System writes entry to `tenant_audit_logs` (actor_id, old_status, new_status, reason, timestamp).
5. If new status is `SUSPENDED` or `ARCHIVED`:
   - System queries active session store for `tenant_id`.
   - System invalidates all active JWT tokens associated with the tenant.
   - System publishes `tenant.status_changed` internal event.
6. Transaction commits.

---

## 5. State Transition Flows

```
  [Registration] ──► PENDING_REVIEW ──► APPROVED ──► ACTIVE
                          │                            │
                          ▼                            ▼
                      REJECTED                     SUSPENDED
                                                       │
                                                       ▼
                                                  REACTIVATED (ACTIVE)
                                                       │
                                                       ▼
                                                   ARCHIVED
```

### Allowed State Transitions
- `PENDING_REVIEW` ➔ `APPROVED` | `REJECTED`
- `APPROVED` ➔ `ACTIVE`
- `ACTIVE` ➔ `SUSPENDED` | `ARCHIVED`
- `SUSPENDED` ➔ `ACTIVE` (Reactivated) | `ARCHIVED`
- `ARCHIVED` ➔ None (Terminal State)

### Invalid Transitions & Rules
- Cannot transition from `SUSPENDED` directly to `PENDING_REVIEW`.
- Cannot transition from `ARCHIVED` back to `ACTIVE` (requires manual database restore under strict audit).
- Cannot transition from `REJECTED` to `ACTIVE` without a new registration application.

---

## 6. Navigation Flows

```
[Platform Admin Dashboard]
           │
           ├─► [Pending Clinics Queue] ──► [Clinic Application Review] ──► [Approval Confirmation]
           │
           └─► [All Clinics List] ──► [Clinic Detail / Audit View] ──► [Suspend / Archive Modal]

[Clinic Workspace]
           │
           └─► [Clinic Settings] ──┬─► [General Profile]
                                    ├─► [Locations & Address]
                                    ├─► [Operating Hours & Shifts]
                                    └─► [Holidays & Exceptions]
```

---

## 7. Permission Flows

| Action | Super Admin | Clinic Owner | Clinic Manager | Staff / Doctor | Patient |
| :--- | :---: | :---: | :---: | :---: | :---: |
| View Clinic Public Profile | Yes | Yes | Yes | Yes | Yes |
| Edit Profile & Settings | Yes | Yes | Yes | No | No |
| Edit Operating Hours | Yes | Yes | Yes | No | No |
| Approve / Reject Registration | Yes | No | No | No | No |
| Suspend / Reactivate Clinic | Yes | No | No | No | No |
| Archive Clinic | Yes | No | No | No | No |

---

## 8. Validation Flows

- **Clinic Name**: Required, 2–100 characters, alphanumeric with standard punctuation.
- **Tax Identifier**: Required, formatted according to national tax standards.
- **Phone Numbers**: Must pass E.164 international format validation.
- **Email Addresses**: Standard RFC 5322 format check.
- **Operating Hours**:
  - `start_time` must be strictly less than `end_time`.
  - `lunch_start` must be >= `start_time`.
  - `lunch_end` must be <= `end_time`.
  - Shifts cannot exceed 24 hours.

---

## 9. Exception Flows

- **Concurrent Edit Collision**: If two managers edit clinic settings simultaneously, the system uses optimistic concurrency control (`version` check). The second save is rejected with a message: "Settings have been updated by another user. Please refresh and try again."
- **Orphaned Clinic Owner**: If owner account creation fails during registration, the tenant creation rolls back completely in a database transaction.
- **Missing Required Settings**: If a clinic attempts to activate without required address/operating hours, the system prevents activation and presents a checklist of incomplete fields.

---

## 10. Security Flows

- **Tenant Scoping**: All backend queries for clinic settings must enforce `WHERE tenant_id = :tenantId`.
- **Authorization Gating**: Request middleware extracts user role and permission scopes from JWT before executing update actions.
- **Audit Logging**: All administrative mutations generate an audit trail record containing Actor ID, IP Address, Tenant ID, Before/After Delta, and Timestamp.

---

## 11. Integration Flows

- **Authentication Module**: Queries tenant status on login. Returns `WORKSPACE_SUSPENDED` (403) if tenant status is `SUSPENDED` or `PENDING_REVIEW`.
- **Doctor / Staff Module**: Fetches clinic working hours to restrict doctor availability schedules within clinic operating bounds.
- **Appointment Booking Module**: Validates appointment request timestamps against clinic operating hours and holiday exception lists.
- **Notifications Module**: Sends automated email alerts to Clinic Owners when status transitions occur (Approval, Suspension, Reactivation).

---

## 12. Edge Cases

- **Timezone Drift**: Clinic operates across day-boundary shifts (e.g. night clinic 20:00 to 04:00). The system supports shift definitions crossing midnight by flagging overnight shift logic in booking modules.
- **Emergency Schedule Override**: Clinic Manager can declare an "Emergency Closure" which immediately cancels or flags upcoming appointments for that day via Notification Module hooks.
- **Owner Transfer**: Transferring clinic ownership to a new Clinic Owner requires current owner authorization and Super Admin approval.

---

## 13. UX Considerations

- **Save Feedback**: Visual toast notifications confirm profile updates ("Clinic profile saved successfully").
- **Unsaved Changes Shield**: Prompt confirmation dialog if user attempts to navigate away from modified settings without saving.
- **Status Badges**: Distinct visual badges for tenant status (`PENDING_REVIEW` - amber, `ACTIVE` - green, `SUSPENDED` - red, `ARCHIVED` - gray).
- **Icon Strategy**: Use Lucide React icons (`Building2`, `Clock`, `MapPin`, `ShieldAlert`, `CheckCircle`) for intuitive visual indicators. Emojis are strictly forbidden.

---

## 14. Assumptions

- A clinic tenant operates in one primary legal jurisdiction and tax framework.
- Operating schedules are defined per day of week (Monday through Sunday) with optional holiday date overrides.
- All timestamps sent over the API utilize ISO 8601 UTC format.

---

## 15. Out of Scope

- Multi-branch clinic hierarchies (V2 Scope).
- Direct billing subscription processing (Handled by Billing Module).
- Doctor individual shift rosters (Handled by Doctor/Staff Module).
- Patient medical record management (Handled by Patient Module).
