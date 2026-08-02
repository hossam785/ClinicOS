# Patients Management Module User Flows & System Flows (PATIENTS_MANAGEMENT_FLOW.md)

This document establishes the user journeys, business workflows, state transition rules, duplicate resolution mechanisms, and system interaction flows for the **Patients Management Module** (Module-005) of ClinicOS. It serves as the official workflow blueprint for database schema design, API contract definition, and UI/UX implementation.

---

## 1. Module Workflow Overview

The Patients Management Module operates as the central Master Patient Index (MPI) for a clinic workspace tenant.

This module interacts directly with:
- **Clinic Management Module**: Enforces workspace tenant boundaries (`tenant_id`).
- **Authentication Module**: Verifies user token claims (`tenant_id`, `role`, `permissions`) and logs administrative audit events.
- **Doctors Management Module**: Supplies verified patient demographic summaries and clinical allergy flags during doctor encounters.
- **Future Clinical & Financial Modules**: Provides patient identity context for Appointments, EMR, Billing, and Medical Prescriptions.

---

## 2. Create Patient Workflow

```
[Create Request Submitted]
           │
           ▼
┌───────────────────────────────┐
│ Input Format & Date Validation │
└───────────────┬───────────────┘
                │ Valid
                ▼
┌───────────────────────────────┐
│ Pre-Registration Duplicate Check│
│ (National ID & Phone + DOB)   │
└───────────────┬───────────────┘
                │ No Conflict
                ▼
┌───────────────────────────────┐
│ Generate Patient Code         │
│ (PAT-YYYYMM-XXXXX)            │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ Save Record (ACTIVE Status)   │
│ Emit Audit Log Entry          │
└───────────────────────────────┘
```

- **Entry Conditions**: Clinic Receptionist or Manager clicks "Register New Patient" from Patients Directory or Appointment Booking Modal.
- **Input Validation**: Verifies full name, valid date of birth (not in future), valid gender, and E.164 phone format.
- **Duplicate Check**: System queries tenant database for matching National ID or Phone + DOB. If found, triggers Duplicate Resolution Workflow.
- **Patient Code Generation**: Generates readable code (`PAT-YYYYMM-XXXXX`) scoped to the tenant workspace.
- **Success Flow**: Profile saved in `ACTIVE` status; success notification displayed; user navigated to Patient Details view.
- **Failure Flow**: Validation error displays inline on affected input fields; request aborted.

---

## 3. Edit Patient Workflow

- **Editable Fields**: Phone numbers, email, physical address, emergency contact, allergy flags, chronic disease flags, insurance flags, and administrative notes.
- **Restricted Fields**: `patient_id`, `tenant_id`, and `patient_code` are immutable. Changing `national_id` requires explicit Manager approval.
- **Audit Logging**: Every profile mutation writes an append-only audit record capturing Actor ID, Modified Fields Delta, and Timestamp.
- **Success Path**: Profile updated in database; success toast notification displayed.

---

## 4. Patient Search Workflow

- **Search Initiation**: User types query into search bar on Patients Directory or Appointment Scheduler.
- **Matching Strategy**:
  - *Full Name*: Partial string & fuzzy matching.
  - *Phone Number*: Suffix & digit-only matching.
  - *Patient Code*: Exact string match (e.g. `PAT-202607-00142`).
  - *National ID*: Exact alphanumeric match.
- **Filtering & Pagination**: Supports filtering by status (`ACTIVE`, `INACTIVE`, `ARCHIVED`) and blood group; paginated in blocks of 20 records.
- **Empty Results**: Displays empty state component with `UserX` Lucide icon and text: "No patient records match your search criteria."

---

## 5. Patient Details Workflow

- **Loading Profile**: System fetches patient record by `patient_id` scoped to active `tenant_id`.
- **Related Information Display**: Displays demographic card, emergency contacts, allergy warning banner (if `has_allergies_flag` is `true`), and upcoming appointment timeline.
- **Archived Patient Behavior**: Renders amber warning banner: "Archived Patient Profile — Read-Only Mode". Edit controls are disabled.
- **Missing Patient Handling**: Displays `404 Not Found` view with button to return to Patients Directory.

---

## 6. Archive Patient Workflow

- **Preconditions**: Patient currently in `ACTIVE` or `INACTIVE` status; no pending unpaid bills or active scheduled appointments.
- **Confirmation Process**: System displays confirmation modal emphasizing soft-delete compliance: "Archiving removes patient from active rosters while preserving clinical encounter histories for legal compliance."
- **Success Path**: Patient status updated to `ARCHIVED`, `archived_at` timestamp set, audit log emitted.
- **Failure Path**: If patient has active scheduled appointments, archive operation is blocked with message: "Cannot archive patient with active scheduled appointments. Reassign or cancel appointments first."

---

## 7. Restore Patient Workflow

- **Eligibility**: Patient currently in `ARCHIVED` status.
- **Permission Check**: Requires `patient:manage` permission (Owner / Manager).
- **Success Flow**: Status restored to `ACTIVE`; edit controls re-enabled; audit log emitted.

---

## 8. Patient Status Workflow

```
ACTIVE ──► INACTIVE ──► ARCHIVED ──► RESTORED (ACTIVE)
  │            │           │
  ▼            ▼           ▼
DECEASED   DECEASED    DECEASED (Terminal)
```

- **Allowed State Transitions**:
  - `ACTIVE` ➔ `INACTIVE` | `ARCHIVED` | `DECEASED`
  - `INACTIVE` ➔ `ACTIVE` | `ARCHIVED` | `DECEASED`
  - `ARCHIVED` ➔ `RESTORED` (`ACTIVE`)
- **Prohibited Transitions**: Cannot transition out of `DECEASED` state (Terminal).

---

## 9. Duplicate Resolution Workflow

- **Trigger**: Pre-registration check detects matching National ID or Phone + DOB.
- **Conflict Presentation**: Modal dialog presents existing matching patient profile summary (Name, Code, Phone, DOB).
- **User Choice Options**:
  1. *View Existing Record*: Aborts registration and opens matching patient details.
  2. *Confirm Distinct Record*: Requires user to enter mandatory justification note (e.g. "Twins with shared contact number") before proceeding to save.

---

## 10. Multi-Tenant Workflow

- **Tenant Scoping**: All database operations include mandatory `WHERE tenant_id = :tenantId`.
- **Cross-Tenant Guard**: API gateway verifies token `tenantId` matches request header. Attempts to query another tenant's patients return `403 Forbidden`.

---

## 11. Error Handling Workflow

- **Validation Failure**: `400 Bad Request` with field-level error messages.
- **Authorization Failure**: `403 Forbidden` if user role lacks read/write permissions.
- **Duplicate Conflict**: `409 Conflict` presenting matching patient details.
- **Missing Resource**: `404 Not Found` if patient ID does not exist in tenant database.

---

## 12. Security Workflow

- **Authentication**: JWT token validation on all HTTP routes.
- **Sensitive Data Protection**: Allergy flags and national IDs restricted to authorized clinical/reception staff.
- **Audit Trails**: All status shifts and record edits generate append-only audit records.

---

## 13. Future Integration Points

- **Appointments Module**: Invokes patient search to attach `patient_id` to slot reservations.
- **EMR / Medical Records Module**: Attaches clinical encounter notes, diagnoses, and lab orders to `patient_id`.
- **Billing Module**: Queries patient identity to generate invoices and record payment receipts.

---

## 14. Edge Cases

- **Duplicate Phone Number (Family Shared)**: System allows shared phone numbers if National ID or Date of Birth differs, prompting explicit justification.
- **Archived Patient Appointment Attempt**: Booking system prevents selecting `ARCHIVED` patients until restored.
- **Concurrent Profile Edits**: Optimistic concurrency control (`version` parameter) rejects stale updates with: "Profile updated by another user. Refreshing data."
