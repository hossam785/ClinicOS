# Doctors Management Module Requirements Specification (DOCTORS_MANAGEMENT.md)

This document establishes the business requirements, operational goals, actor responsibilities, doctor lifecycles, business rules, status state machine models, and conceptual permissions for the **Doctors Management Module** (Module-004) of ClinicOS. It serves as the single source of truth for all future technical design, database schemas, API contracts, and UI/UX implementations.

---

## 1. Module Overview

### Purpose
The Doctors Management Module provides the administrative, professional, and operational framework for managing medical practitioners (doctors, consultants, specialists) working within a clinic workspace tenant.

### Scope
This module covers doctor profile management, medical license tracking, specialty categorizations, employment statuses, internal clinical notes, and association with clinic workspace tenants.

### Responsibilities
- Centralize doctor professional identities, qualifications, and medical licenses.
- Enforce strict tenant isolation (`tenant_id`) ensuring a doctor operates exclusively within their assigned clinic workspace.
- Provide lifecycle controls (Invitation, Activation, Suspension, Archiving) to govern clinical access.
- Expose practitioner availability parameters to future scheduling and patient encounter modules.

### Position inside System Architecture
The Doctors Management Module sits directly below Clinic Management and alongside Authentication. It relies on:
- **Authentication Module**: For identity credentials and user account association (`user_id`).
- **Clinic Management Module**: For workspace tenant boundaries (`tenant_id`) and operational clinic working hours.

---

## 2. Business Objectives

### Operational Goals
- Streamline onboarding for medical practitioners, allowing clinic managers to invite and verify doctors efficiently.
- Eliminate scheduling conflicts by binding doctor shift patterns to verified clinic working hours.

### Administrative Goals
- Maintain a tamper-evident audit history of medical license verifications, specialty assignments, and status updates.
- Centralize employment metadata (consultation fees, contract types, department assignments).

### Security & Compliance Goals
- Guarantee strict multi-tenant isolation; cross-tenant practitioner record bleed is strictly prohibited.
- Protect sensitive practitioner data (national ID, personal contact numbers, compensation parameters) with role-based access control.

---

## 3. Actors

### Super Admin
- Platform operator who conducts high-level compliance audits across tenants and reviews system-wide practitioner activity.

### Clinic Owner
- Primary executive user. Has complete administrative authority to invite doctors, assign specialties, configure consultation fees, update profiles, suspend access, and archive practitioner records within their clinic.

### Clinic Manager
- Delegated administrator. Can manage doctor profile details, update department assignments, and track license expiration dates, but cannot delete or archive doctor records without Owner authorization.

### Doctor
- The medical practitioner user. Can view their own professional profile, update personal biography and consultation settings, and view assigned appointment schedules. Cannot modify medical license numbers or administrative statuses.

---

## 4. Doctor Lifecycle

```
[Invitation Sent] ──► Registration / Pending ──► License Verification ──► Active / Operational
                                                                               │
                                                                               ▼
                                                                      Temporary Suspension
                                                                               │
                                                                               ▼
                                                                     Reactivated / Archived
```

1. **Invitation**: Clinic Owner or Manager sends an onboarding invitation email to the practitioner.
2. **Registration**: Doctor accepts invitation and completes account registration (creating matching `user_id` and `doctor_profile`). Status set to `PENDING_VERIFICATION`.
3. **Verification**: Clinic Owner/Manager reviews uploaded medical licenses and board certifications, confirming valid status (`APPROVED`).
4. **Activation**: Status set to `ACTIVE`. Doctor is now operational and available for patient appointment bookings.
5. **Profile Updates**: Ongoing maintenance of specialties, consultation fees, bio details, and contact numbers.
6. **Temporary Suspension**: If a doctor goes on extended leave or faces internal review, status set to `SUSPENDED`. Active logins are blocked, and future booking slots are hidden.
7. **Reactivation**: Restores a suspended doctor back to `ACTIVE` status.
8. **Archiving**: When employment terminates, status set to `ARCHIVED` (soft-delete). Historical clinical records remain preserved for legal compliance.

---

## 5. Business Responsibilities

- **Professional Identity**: Full legal name, medical title (Dr., Prof.), gender, national ID / passport number.
- **Medical Licensing**: Medical license registration code, issuing authority, license issue date, and license expiration date.
- **Specialties & Departments**: Primary medical specialty (e.g. Cardiology, Pediatrics), sub-specialties, and assigned clinic department.
- **Employment & Financial Parameters**: Contract type (Full-time, Part-time, Visiting Consultant), consultation fee rate, and employment start date.
- **Operational Availability**: Default consultation duration (e.g. 15 mins, 30 mins) and assigned shift hours.

---

## 6. Business Rules

- **Strict Single-Tenant Scoping**: A doctor profile belongs to exactly one clinic tenant (`tenant_id`). Cross-tenant sharing of doctor profiles is prohibited in Version 1.
- **Unique License Code Enforcement**: A medical license number must be unique across all active doctors within the same jurisdiction.
- **Active Status Booking Guard**: Patient appointments can only be booked for doctors in the `ACTIVE` status state.
- **Suspension Booking Lock**: When a doctor's status transitions to `SUSPENDED`, the system must flag all pending future appointments for administrative review.
- **Archiving Data Retention**: Archiving a doctor profile soft-deletes the record; physical database deletion is forbidden to preserve historical medical audit trails.

---

## 7. Permissions

| Action | Super Admin | Clinic Owner | Clinic Manager | Doctor (Self) |
| :--- | :---: | :---: | :---: | :---: |
| View Doctor Profile | Yes | Yes | Yes | Yes |
| Invite Doctor | Yes | Yes | Yes | No |
| Verify Medical License | Yes | Yes | Yes | No |
| Edit Professional Profile | Yes | Yes | Yes | Partial (Bio only) |
| Suspend Doctor Access | Yes | Yes | No | No |
| Archive Doctor Record | Yes | Yes | No | No |

---

## 8. Status Model

| Status | Meaning | Valid Transitions | Restrictions |
| :--- | :--- | :--- | :--- |
| **PENDING_VERIFICATION** | Registered; awaiting license review | `ACTIVE`, `REJECTED` | Cannot accept patient bookings. |
| **ACTIVE** | Verified operational practitioner | `SUSPENDED`, `ARCHIVED` | Full clinical and booking access. |
| **SUSPENDED** | Access blocked due to leave or review | `ACTIVE`, `ARCHIVED` | Cannot log in; hidden from booking slots. |
| **ARCHIVED** | Terminated practitioner record | None (Terminal) | Soft-deleted; read-only compliance access. |

---

## 9. Security Considerations

- **Tenant Boundary Partitioning**: Every query must include `tenant_id` filters.
- **Role-Based Access Control**: Sensitive fields (compensation rates, national ID numbers) are restricted to Clinic Owners and Managers.
- **Audit Trails**: Status changes, license verifications, and profile updates emit immutable audit records.

---

## 10. Relationships

- **Clinic Profile Module**: Linked via `tenant_id` to enforce workspace bounds.
- **Authentication Module**: Linked via `user_id` for login authentication and JWT claims.
- **Future Appointment Module**: Doctor profile serves as the target practitioner for patient slot reservations.
- **Future Patient Record Module**: Doctor profile acts as the attending physician for clinical encounter notes.

---

## 11. Edge Cases

- **Suspension with Pending Appointments**: If a doctor is suspended while having upcoming patient appointments, the system flags affected bookings and prompts the Clinic Manager to reassign or cancel them.
- **License Expiration**: When a doctor's medical license expires, the system displays an administrative warning badge and prevents new slot publishing.
- **Archived Doctor Historical Queries**: Past medical records and invoice lines retain the archived doctor's name and license code for audit integrity.

---

## 12. Assumptions

- Doctors have a single primary medical license code per jurisdiction.
- Consultation fee amounts are defined in the clinic workspace's primary currency.

---

## 13. Future Expansion (Version 2 Scope)

- Multi-clinic association (a doctor working across multiple independent clinic tenants).
- Tele-consultation virtual room link management.
- Doctor commission and payroll calculation hooks.
- External calendar synchronization (Google Calendar, Outlook).

---

## 14. Out of Scope (Version 1)

- Doctor payroll and commission processing.
- Direct patient medical record note generation (Handled by EMR / Patient Module).
- Patient appointment booking processing (Handled by Appointment Module).
