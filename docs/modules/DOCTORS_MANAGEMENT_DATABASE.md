# Doctors Management Module Database Design Specification (DOCTORS_MANAGEMENT_DATABASE.md)

This document establishes the conceptual database architecture, business entities, entity relationships, ownership paradigms, status models, tenant isolation strategies, and audit frameworks for the **Doctors Management Module** (Module-004) of ClinicOS. It serves as the authoritative database design specification prior to any physical database schema or ORM implementation.

---

## 1. Database Overview

### Purpose
The database architecture for the Doctors Management Module encapsulates all practitioner profile records, professional qualifications, medical licenses, specialty categorizations, consultation fee structures, shift rosters, and administrative lifecycle statuses of doctors within a clinic workspace tenant.

### Scope
This design covers the conceptual data model for doctor profiles, medical license verifications, specialty assignments, consultation fee parameters, doctor working hours, date-specific doctor leave exceptions, and tamper-evident status audit logs.

### Database Responsibilities
- Maintain rigid multi-tenant data boundaries between clinic workspaces (`tenant_id`).
- Guarantee transaction-safe status transitions for medical practitioner lifecycle states.
- Provide high-performance lookup of active doctor rosters and consultation availability for appointment booking services.
- Record tamper-evident audit logs for all medical license approvals, fee edits, and status changes.

---

## 2. Business Entities

### 1. Doctor Profile Entity
- **Business Purpose**: Represents the professional identity, legal qualifications, contact information, consultation fee rates, and status of a medical practitioner.
- **Ownership**: Owned by the Tenant boundary (`tenant_id`); linked to a specific user account (`user_id`); managed by Clinic Owner and Manager.
- **Lifecycle**: Created on invitation (`PENDING_VERIFICATION`), activated on license approval (`ACTIVE`), suspended on leave/audit (`SUSPENDED`), archived on employment termination (`ARCHIVED`).
- **Responsibilities**: Stores legal name, medical title, gender, national ID, primary email, phone, consultation fee, default duration, biography, and active status.

### 2. Doctor License Entity
- **Business Purpose**: Captures medical board registration details, board certification codes, issuing authorities, and expiration dates.
- **Ownership**: Owned by parent Doctor Profile; managed by Clinic Owner.
- **Lifecycle**: Submitted during registration, verified by Clinic Owner, updated upon annual license renewal.
- **Responsibilities**: Ensures practitioners hold valid medical credentials prior to patient slot publishing.

### 3. Doctor Specialty & Department Entity
- **Business Purpose**: Maps primary medical specialties (e.g. Cardiology, Orthopedics), sub-specialties, and assigned clinical departments.
- **Ownership**: Owned by parent Doctor Profile; managed by Clinic Owner and Manager.
- **Lifecycle**: Configured during onboarding, updated when additional certifications are acquired.
- **Responsibilities**: Provides categorization taxonomy for patient doctor searches and department reporting.

### 4. Doctor Schedule & Shift Entity
- **Business Purpose**: Represents weekly working hours and shift patterns specific to an individual doctor.
- **Ownership**: Owned by parent Doctor Profile; bounded by Clinic Working Hours.
- **Lifecycle**: Initialized upon activation, updated as shift rotations change.
- **Responsibilities**: Defines active days and daily shift start/end times for slot reservations.

### 5. Doctor Leave Exception Entity
- **Business Purpose**: Captures date-specific practitioner leaves, vacation dates, or conference closures overriding standard shift hours.
- **Ownership**: Owned by parent Doctor Profile; managed by Clinic Manager or Doctor.
- **Lifecycle**: Created when leave is approved, archived automatically once the date passes.
- **Responsibilities**: Overrides weekly shift schedules for specified calendar dates, preventing slot booking.

### 6. Doctor Status Audit History Entity
- **Business Purpose**: Maintains an immutable timeline of practitioner status transitions (`PENDING_VERIFICATION` ➔ `ACTIVE` ➔ `SUSPENDED` ➔ `ARCHIVED`).
- **Ownership**: Owned by the system audit framework.
- **Lifecycle**: Append-only; entries created whenever a status change occurs.
- **Responsibilities**: Tracks actor ID, previous status, new status, status change reason, and timestamp for legal compliance audits.

---

## 3. Entity Relationships

### Conceptual Relationships
- **Clinic Workspace ── (1 : N) ── Doctor Profiles**
  - A clinic workspace owns zero or more doctor profiles.
- **User Account ── (1 : 1) ── Doctor Profile**
  - A doctor profile links to exactly one user account (`user_id`) for authentication.
- **Doctor Profile ── (1 : 1) ── Doctor License**
  - A doctor profile maintains one active medical license specification.
- **Doctor Profile ── (1 : N) ── Doctor Specialties**
  - A doctor profile links to one primary specialty and zero or more sub-specialties.
- **Doctor Profile ── (1 : N) ── Doctor Schedules**
  - A doctor profile owns up to 7 weekly day-shift schedule records.
- **Doctor Profile ── (1 : N) ── Doctor Leave Exceptions**
  - A doctor profile owns zero or more date-specific leave exception records.
- **Doctor Profile ── (1 : N) ── Doctor Status Audit History**
  - A doctor profile maintains an append-only audit trail of status changes.

---

## 4. Ownership Model

### Tenant Ownership Rules
- All entities within the Doctors Management Module must carry a mandatory, immutable `tenant_id`.
- Queries executed within a workspace context are strictly partitioned by `tenant_id`.

### Administrative & User Ownership Rules
- Clinic Owners hold master administrative write ownership over doctor statuses, fee structures, and license approvals.
- Doctors hold self-service edit permissions over personal biography details, sub-specialty text, and contact channels.

---

## 5. Lifecycle Model

```
[Invitation] ──► Pending Verification ──► Active / Operational
                                                │
                                                ▼
                                            Suspended
                                                │
                                                ▼
                                            Archived
```

### Lifecycle Progression
1. **Creation**: Doctor profile created in `PENDING_VERIFICATION` status upon workspace invitation acceptance.
2. **Verification & Activation**: Clinic Owner approves medical license code; status transitions to `ACTIVE`.
3. **Modification**: Clinic Owner/Manager or Doctor updates professional bio, consultation duration, or fees.
4. **Suspension**: Clinic Owner flags practitioner for extended leave or internal audit; status set to `SUSPENDED`.
5. **Reactivation**: Clinic Owner restores suspended practitioner back to `ACTIVE` status.
6. **Archiving**: Employment termination transitions status to `ARCHIVED` (soft-delete). Record retained for medical audit trails.

---

## 6. Status Model

| Status | Meaning | Valid Transitions | Restrictions |
| :--- | :--- | :--- | :--- |
| **PENDING_VERIFICATION** | Registered; awaiting license review | `ACTIVE`, `REJECTED` | Hidden from booking channels; cannot accept appointments. |
| **ACTIVE** | Verified active medical practitioner | `SUSPENDED`, `ARCHIVED` | Full clinical access; appointment slots published. |
| **SUSPENDED** | Access blocked due to leave or audit | `ACTIVE`, `ARCHIVED` | Login blocked; pending appointment slots flagged. |
| **ARCHIVED** | Terminated practitioner record | None (Terminal) | Soft-deleted; preserved for legal encounter logs. |

---

## 7. Tenant Isolation Strategy

- **Hard Partitioning Rule**: Every database record must specify `tenant_id`.
- **Cross-Tenant Prevention**: Foreign key validation ensures referenced entities (departments, schedules) belong to the matching `tenant_id`. Cross-tenant references are strictly prohibited.
- **Global Identity Safeguards**: Platform API handlers cross-verify `X-Tenant-ID` headers against token claims prior to database execution.

---

## 8. Data Integrity Rules

- **Uniqueness Constraints**:
  - Medical license code must be unique across active doctors within the jurisdiction.
  - Primary contact email must be unique across all system users.
- **Shift Schedule Integrity**:
  - Doctor shift hours must fall within the clinic workspace's overall operating hours.
  - Daily shift start time must precede shift end time.
- **State Integrity**:
  - Status updates must follow the authorized State Transition Model. Illegal jumps (e.g. `PENDING_VERIFICATION` directly to `ARCHIVED`) are rejected.

---

## 9. Soft Delete Strategy

- **Logical Deletion Flag**: Doctor entities do not undergo physical database removal.
- **Archived State Execution**: When a doctor leaves, status transitions to `ARCHIVED` and an `archived_at` timestamp is recorded.
- **Query Visibility Filters**: Standard booking and roster queries exclude `ARCHIVED` records. Historical medical encounter logs retain soft-deleted doctor names and license codes for legal compliance.

---

## 10. Audit Strategy

- **Tamper-Evident History**: Every license approval, fee change, schedule edit, or status shift generates an append-only audit record.
- **Audit Field Payload**:
  - `actor_id`: User ID of the administrator executing the mutation.
  - `tenant_id`: Target clinic workspace ID.
  - `doctor_id`: Target doctor profile ID.
  - `action`: Specific operation (`LICENSE_APPROVED`, `FEE_UPDATED`, `STATUS_SUSPENDED`).
  - `changes_delta`: JSON snapshot of modified fields.
  - `timestamp`: UTC timestamp.

---

## 11. Security Considerations

- **Sensitive Field Protection**: Compensation parameters, national IDs, and personal phone numbers are restricted to Clinic Owners and Managers.
- **Encryption at Rest**: Medical license numbers and national identity fields utilize encrypted database parameters.
- **Authorization Verification**: Middleware checks user roles before executing database mutations.

---

## 12. Scalability Strategy

- **Read Optimization**: Doctor rosters and active shift schedules are cached at the application tier to support high-throughput booking lookups.
- **Horizontal Sharding Preparedness**: All tables/collections are sharded by `tenant_id`, allowing seamless scaling across database nodes as tenant volume expands.

---

## 13. Future Relationships

- **Appointment Module**: Appointments link to `doctor_profile.id` for slot reservation.
- **Patient EMR Module**: Patient encounters link to `doctor_profile.id` as the attending physician.
- **Billing & Payroll Module**: Consultation fee structures link to billing logic for invoice line calculations.

---

## 14. Assumptions

- Doctors belong to one primary clinic workspace tenant in Version 1.
- Medical license codes are validated manually against official regulatory boards.
- All fee structures use the workspace tenant's default currency.

---

## 15. Risks & Mitigations

| Risk | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| Duplicate Medical License | High | Unique index constraint on medical license code per jurisdiction. |
| Inconsistent Doctor Shift Times | Medium | Programmatic time bound check ensuring doctor shifts fall within clinic working hours. |
| Cross-Tenant Data Bleed | Critical | Mandatory `tenant_id` query scoping at repository layer. |

---

## 16. Out of Scope

- Physical database schema implementation (Mongoose models / SQL DDL).
- Database migrations and seed scripts.
- Physical index creation commands.
- Specific ORM or database driver code.
