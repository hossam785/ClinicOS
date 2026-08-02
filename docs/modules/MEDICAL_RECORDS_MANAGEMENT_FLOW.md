# Medical Records Management Module User Flows & System Flows (MEDICAL_RECORDS_MANAGEMENT_FLOW.md)

This document establishes the user journeys, clinical SOAP documentation flows, chart locking algorithms, addendum processes, and multi-tenant security guards for the **Medical Records Management Module** (Module-007) of ClinicOS. It serves as the official workflow blueprint for database schema design, API contract definition, and UI/UX implementation.

---

## 1. Module Workflow Overview

The Medical Records Management Module functions as the clinical documentation engine for ClinicOS.

This module integrates directly with:
- **Appointment Management Module**: Triggered when appointment status transitions to `IN_CONSULTATION`.
- **Patients Management Module**: Binds clinical records to master patient index (MPI) profiles (`patient_id`).
- **Doctors Management Module**: Binds attending physician identity and digital signature context (`doctor_id`).
- **Clinic Management Module**: Enforces workspace tenant boundaries (`tenant_id`).
- **Future Clinical & Financial Modules**: Emits e-prescriptions to Pharmacy, lab orders to Diagnostic Labs, and billable service items to Billing.

---

## 2. Create Medical Record Workflow

```
[Appointment "IN_CONSULTATION"]
           │
           ▼
┌───────────────────────────────┐
│ Validate Appointment, Doctor, │
│ & Patient Scoping (Tenant ID) │
└───────────────┬───────────────┘
                │ Valid
                ▼
┌───────────────────────────────┐
│ Check Existing Record         │
│ (Prevent Duplicate Encounter) │
└───────────────┬───────────────┘
                │ None Exists
                ▼
┌───────────────────────────────┐
│ Generate Record Number        │
│ (EMR-YYYYMM-XXXXX)            │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ Initialize Record (DRAFT)     │
│ Emit Audit Log Event          │
└───────────────────────────────┘
```

- **Entry Conditions**: Doctor selects patient from waiting room queue and clicks "Start Consultation" in Appointment Module.
- **Scoping Validation**: System verifies appointment, doctor, and patient belong to active workspace tenant.
- **Duplicate Prevention**: System verifies no existing active EMR chart is attached to the same appointment.
- **Success Path**: Generates `EMR-YYYYMM-XXXXX` code, initializes record in `DRAFT` status, opens clinical SOAP editor.
- **Failure Path**: Displays inline error banner detailing conflict or missing credentials.

---

## 3. Update & SOAP Notes Documentation Workflow

- **SOAP Sections Entry**: Attending doctor documents:
  1. **Subjective**: Chief complaint, history of present illness, allergies, current medications.
  2. **Objective**: Vital signs (BP, Pulse, Temp, SpO2, Weight, Height), physical examination notes.
  3. **Assessment**: Clinical evaluation, primary diagnosis, secondary diagnoses.
  4. **Plan**: Treatment plan, medication orders, follow-up instructions.
- **Autosave & Draft Preservation**: System periodically autosaves draft changes to prevent data loss.

---

## 4. Complete & Lock Medical Record Workflow

```
DRAFT ──► IN_PROGRESS ──► COMPLETED / LOCKED ──► ADDENDUM
                               │
                               ▼
                   (Read-Only Lock & Digital Signature)
```

- **Complete Consultation (`COMPLETED`)**: Doctor clicks "Complete Consultation & Sign Record". System validates mandatory primary diagnosis and treatment plan.
- **Chart Locking (`LOCKED`)**: Status transitions to `LOCKED`. Record becomes permanently read-only.
- **Post-Lock Addenda Workflow**: If a correction is needed post-lock, doctor submits an Addendum request. Original locked chart remains untouched; addendum text is appended with timestamp and doctor ID.

---

## 5. Multi-Tenant & Security Workflows

- **Tenant Partitioning**: All EMR database operations enforce `WHERE tenant_id = :tenantId`.
- **RBAC Roles**:
  - `Doctor`: Full read/write access to clinical EMR charts.
  - `Receptionist`: Restricted access to appointment metadata; clinical SOAP notes masked.
  - `Clinic Manager / Owner`: Read/audit access for clinic compliance.
- **HIPAA / GDPR Audit**: Access attempts emit immutable audit records logging actor ID and timestamp.

---

## 6. Edge Cases & Exception Handling

- **Network Interruption During SOAP Entry**: Local storage preserves draft text until connection restored.
- **Attempted Modification of Locked Chart**: System blocks edit request with `400 Bad Request` ("Medical chart is locked against modifications. Submit an Addendum").
- **Archived Patient Record**: If patient profile is archived while EMR chart is in draft, consultation is paused until patient profile is restored.
