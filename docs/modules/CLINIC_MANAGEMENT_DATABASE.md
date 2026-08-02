# Clinic Management Module Database Design Specification (CLINIC_MANAGEMENT_DATABASE.md)

This document establishes the conceptual database architecture, business entities, ownership paradigms, status models, tenant isolation strategies, and audit frameworks for the **Clinic Management Module** of ClinicOS. It serves as the authoritative database design reference prior to any physical database schema or ORM implementation.

---

## 1. Database Overview

### Purpose
The database architecture for the Clinic Management Module encapsulates all core organizational data, operational metadata, shift schedules, physical address configurations, and lifecycle statuses of medical clinics (tenants) operating within ClinicOS.

### Scope
This design covers the conceptual data model for clinic profiles, operational schedules (shift hours & lunch breaks), date-specific holiday exceptions, clinic location parameters, and administrative audit trails.

### Database Responsibilities
- Maintain strict multi-tenant boundaries between clinic organizations.
- Guarantee transaction-safe status transitions for clinic workspaces.
- Provide high-performance lookup of operating hours for appointment scheduling integrations.
- Record tamper-evident audit history for all profile mutations.

### Relationship to System Architecture
The database model aligns with the hybrid multi-tenant database strategy outlined in `docs/DATABASE_DESIGN.md`. Each clinic maps to an isolated tenant identifier (`tenant_id`), which partitions all tenant-owned entities.

---

## 2. Business Entities

### 1. Clinic Profile Entity
- **Business Purpose**: Represents the legal identity, registration credentials, official branding, and core metadata of a clinic workspace.
- **Ownership**: Owned by the Tenant boundary; managed by Clinic Owner and Super Admin.
- **Lifecycle**: Created on registration (`PENDING_REVIEW`), activated on approval, suspended on policy violation, archived on termination.
- **Responsibilities**: Stores official name, medical license registration code, tax ID, primary contact email, official phone number, logo URL, and active timezone.

### 2. Clinic Operating Hours Entity
- **Business Purpose**: Represents weekly shift operational parameters (start time, end time, lunch break windows) per day of the week.
- **Ownership**: Owned by the parent Clinic Profile; managed by Clinic Owners and Managers.
- **Lifecycle**: Initialized with default clinic hours upon workspace creation, updated as shifts change.
- **Responsibilities**: Defines active days (Monday through Sunday) and shift time bounds used by appointment booking services to validate patient slot availability.

### 3. Clinic Holiday Exception Entity
- **Business Purpose**: Captures date-specific closures, public holidays, or emergency shutdown dates overriding regular operating hours.
- **Ownership**: Owned by the parent Clinic Profile; managed by Clinic Owners and Managers.
- **Lifecycle**: Created when a holiday is declared, archived automatically once the date passes.
- **Responsibilities**: Overrides weekly operating hours for specified calendar dates, blocking appointment creation.

### 4. Clinic Location Entity
- **Business Purpose**: Represents the physical address, geo-coordinates, and physical facility metadata of the clinic.
- **Ownership**: Owned by the parent Clinic Profile; managed by Clinic Owners and Managers.
- **Lifecycle**: Created during workspace setup, updated when physical location changes.
- **Responsibilities**: Stores street address, city, state/province, postal code, country code, latitude, and longitude for location-based services.

### 5. Clinic Status History Entity
- **Business Purpose**: Maintains an immutable timeline of status transitions (`PENDING_REVIEW` ➔ `APPROVED` ➔ `ACTIVE` ➔ `SUSPENDED` ➔ `ARCHIVED`).
- **Ownership**: Owned by the system audit framework.
- **Lifecycle**: Append-only; entries created whenever a status change occurs.
- **Responsibilities**: Tracks actor ID, previous status, new status, status change reason, and timestamp for compliance auditing.

---

## 3. Entity Relationships

### Conceptual Relationships
- **Clinic Profile ── (1 : 1) ── Clinic Location**
  - A clinic profile is linked to exactly one primary physical location record.
- **Clinic Profile ── (1 : N) ── Clinic Operating Hours**
  - A clinic profile owns up to 7 daily operating hour records (one for each day of the week).
- **Clinic Profile ── (1 : N) ── Clinic Holiday Exceptions**
  - A clinic profile owns zero or more date-specific holiday exception records.
- **Clinic Profile ── (1 : N) ── Clinic Status History**
  - A clinic profile maintains a historical append-only record of all status changes.

---

## 4. Ownership Model

### Tenant Ownership Rules
- All data records within the Clinic Management Module must contain a mandatory `tenant_id` association.
- A `tenant_id` is assigned at the moment of registration and cannot be mutated or reassigned.
- Queries executed within a clinic workspace context are strictly locked to that tenant's identifier.

### Administrative & User Ownership Rules
- Each Clinic Profile maintains a direct association with a primary `owner_user_id` (the Clinic Owner).
- Super Admin accounts have cross-tenant read access for audit and platform support purposes, but cannot alter profile data without explicit logging.

---

## 5. Lifecycle Model

```
[Registration] ──► Draft / Pending Review ──► Approved ──► Active / Operational
                                                               │
                                                               ▼
                                                           Suspended
                                                               │
                                                               ▼
                                                           Archived
```

### Lifecycle Progression
1. **Creation**: Clinic record is created in `PENDING_REVIEW` state upon registration form completion.
2. **Verification & Approval**: Super Admin approves medical credentials; status transitions to `APPROVED`.
3. **Activation**: Clinic Owner completes mandatory profile fields; status transitions to `ACTIVE`.
4. **Modification**: Clinic Owner/Manager updates operating hours, location details, or contact parameters as needed.
5. **Suspension**: Super Admin flags workspace due to invoice delinquency or policy violation; status set to `SUSPENDED`.
6. **Restoration**: Super Admin restores suspended workspace back to `ACTIVE` status upon resolution.
7. **Archiving**: Permanent soft-delete; status set to `ARCHIVED`, locking all operations permanently.

---

## 6. Status Model

| Status | Meaning | Valid Transitions | Restrictions |
| :--- | :--- | :--- | :--- |
| **DRAFT** | Incomplete registration draft | `PENDING_REVIEW` | Cannot access operational features. |
| **PENDING_REVIEW** | Registration submitted, awaiting admin approval | `APPROVED`, `REJECTED` | Read-only access for owner; booking disabled. |
| **APPROVED** | Credentials verified by Super Admin | `ACTIVE` | Pending final profile setup. |
| **ACTIVE** | Operational clinic workspace | `SUSPENDED`, `ARCHIVED` | Full operational access for all staff. |
| **SUSPENDED** | Access blocked due to billing or compliance | `ACTIVE`, `ARCHIVED` | All staff user logins & API requests rejected. |
| **ARCHIVED** | Terminated/Closed clinic workspace | None (Terminal) | Soft-deleted; read-only compliance access only. |

---

## 7. Tenant Isolation Strategy

- **Hard Partitioning Conceptual Rule**: Every database request must specify the active `tenant_id` context.
- **Cross-Tenant Prevention**: Data models enforce that foreign keys within clinic sub-entities (operating hours, location) match the parent `tenant_id`. Cross-tenant record references are prohibited.
- **Global Identity Protection**: Super Admin status actions validate tenant boundaries before applying status changes.

---

## 8. Data Integrity Rules

- **Uniqueness Constraints**:
  - Medical registration license code must be globally unique across all active/pending clinics.
  - Primary contact email must be unique across all active users.
- **Operating Hours Integrity**:
  - Daily shift start time must be chronologically earlier than shift end time.
  - Lunch break windows must reside entirely within shift start and end times.
- **State Integrity**:
  - Status updates must follow the authorized State Transition Model. Direct status jumps (e.g. `PENDING_REVIEW` directly to `ARCHIVED`) are rejected.

---

## 9. Soft Delete Strategy

- **Logical Deletion Flag**: Clinic entities do not undergo physical SQL `DELETE` or MongoDB `remove()` commands.
- **Archived State Execution**: When a clinic is deleted, its status transitions to `ARCHIVED` and an `archived_at` timestamp is written.
- **Query Visibility Filters**: All standard database queries filter out `ARCHIVED` records unless explicitly querying compliance audit interfaces.

---

## 10. Audit Strategy

- **Tamper-Evident History**: Every insert, update, or status shift generates an append-only audit record.
- **Audit Field Payload**:
  - `actor_id`: User ID of the administrator making the change.
  - `tenant_id`: Target clinic workspace ID.
  - `action`: Specific operation performed (`PROFILE_UPDATED`, `HOURS_MUTATED`, `STATUS_SUSPENDED`).
  - `changes_delta`: Before and after JSON snapshot of modified fields.
  - `timestamp`: UTC timestamp of the modification.

---

## 11. Security Considerations

- **Data Privacy**: Contact details and medical license data are restricted to authorized clinic staff and platform auditors.
- **Encryption at Rest**: Sensitive license numbers and contact records utilize encrypted storage parameters.
- **Access Boundary Checks**: API handlers verify that the user's token `tenant_id` matches the target clinic `tenant_id` before database query execution.

---

## 12. Scalability Strategy

- **Read Optimization**: Operating hours and profile settings are cached at the application tier to handle high-frequency booking lookups.
- **Horizontal Sharding Preparedness**: All tables/collections are keyed by `tenant_id`, enabling horizontal sharding across database nodes as tenant volume scales.

---

## 13. Future Relationships

- **Doctor / Staff Module**: Staff records will hold a foreign key reference to `clinic_profile.tenant_id`.
- **Patient Module**: Patient profiles will be scoped to `clinic_profile.tenant_id`.
- **Appointment Module**: Appointment slots will validate against `clinic_operating_hours` and `clinic_holiday_exceptions`.
- **Billing Module**: Subscription plans will link to `clinic_profile.tenant_id` to evaluate active feature limits.

---

## 14. Assumptions

- Clinics operate in a single primary time zone.
- Operating schedules repeat on a weekly cycle (Monday to Sunday) with date-based holiday exceptions.
- Legal tax registration codes are immutable once verified by a Super Admin.

---

## 15. Risks & Mitigations

| Risk | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| Duplicate Registration Attempt | High | Enforce unique indexes on registration number & tax ID. |
| Inconsistent Operating Hours | Medium | Programmatic validation enforcing shift time bounds before database write. |
| Mid-Session Tenant Suspension | High | Global auth middleware checks tenant status on every request and revokes active tokens if suspended. |

---

## 16. Out of Scope

- Physical database schema implementation (Mongoose models / SQL DDL).
- Database migrations and seed scripts.
- Physical index optimization commands.
- Specific database driver code or queries.
