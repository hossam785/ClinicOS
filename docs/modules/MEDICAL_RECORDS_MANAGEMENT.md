# Medical Records Management Module Requirements Specification (MEDICAL_RECORDS_MANAGEMENT.md)

This document establishes the business requirements, clinical objectives, record lifecycles, SOAP encounter structures, locking constraints, and multi-tenant compliance rules for the **Medical Records Management Module** (Module-007) of ClinicOS. It serves as the single source of truth for all future technical design, database schemas, API contracts, and UI/UX implementations.

---

## 1. Module Purpose

### Purpose & Clinical Objectives
The Medical Records Management Module serves as the Electronic Medical Record (EMR) core of ClinicOS. It enables attending physicians to document clinical encounters, record patient vital signs, log chief complaints, record clinical assessments and diagnoses, define treatment plans, and reference historical medical charts.

### System Architecture Position
The EMR Module is triggered during active patient consultations (`IN_CONSULTATION` status) established in the Appointment Management Module:
- **Patients Management**: Links clinical notes to verified master patient index (MPI) records (`patient_id`).
- **Doctors Management**: Binds attending physician identity and digital signature context (`doctor_id`).
- **Appointment Management**: Initiated upon appointment check-in and consultation start (`appointment_id`).
- **Future Prescriptions & Billing**: Emits diagnosis data for pharmacy e-prescriptions and billable service codes for invoicing.

---

## 2. Medical Record Lifecycle

```
[Appointment Check-In] ──► Draft ──► Consultation In Progress ──► Signed & Completed ──► Locked Record
                                                                                             │
                                                                                             ▼
                                                                                    (Addendum / Amendment)
```

### Lifecycle States & Progression
1. **Draft**: Record initialized upon appointment consultation start. Editable by attending physician.
2. **Consultation In Progress**: Doctor actively populating SOAP notes, vital signs, physical exam findings, and preliminary diagnoses.
3. **Signed & Completed**: Doctor finalizes encounter notes and signs record digitally.
4. **Locked Record**: Medical chart permanently locked against further edits to guarantee legal HIPAA/GDPR audit compliance.
5. **Addendum / Amendment**: Controlled post-lock amendment process appending timestamped addendum notes without altering original locked chart.

---

## 3. Medical Record Information Specification

### 1. System-Generated & Identity Fields
- `record_id`: Unique internal UUID.
- `tenant_id`: Mandatory workspace tenant key.
- `record_number`: Human-readable identifier (e.g. `EMR-202607-00412`).
- `patient_id`: Reference to patient profile.
- `doctor_id`: Reference to attending physician profile.
- `clinic_id`: Reference to clinic branch location.
- `appointment_id`: Reference to associated appointment reservation.

### 2. Clinical Encounter Data (SOAP Notes Framework)
- **Subjective**: Chief complaint, history of present illness (HPI), medical history, surgical history, allergies, current medications.
- **Objective**: Vital signs (blood pressure, pulse rate, body temperature, respiratory rate, SpO2, height, weight, BMI), physical examination findings.
- **Assessment**: Primary diagnosis, secondary diagnoses, ICD-10 placeholders, clinical summary.
- **Plan**: Treatment plan, recommended medications/prescriptions, lab/radiology request placeholders, follow-up instructions, return visit timeline.

### 3. Administrative Attributes
- `encounter_date`: ISO date string (`YYYY-MM-DD`).
- `status`: Lifecycle state (`DRAFT`, `IN_PROGRESS`, `COMPLETED`, `LOCKED`).
- `locked_at`: UTC timestamp when record was finalized.
- `locked_by`: User ID of doctor who signed and locked chart.

---

## 4. Business Rules & Compliance

- **Attending Physician Editing Rights**: Only the assigned attending physician or authorized covering physician within the same clinic tenant may edit a `DRAFT` or `IN_PROGRESS` medical record.
- **Immutable Lock Rule**: Once a medical record transitions to `COMPLETED` / `LOCKED`, its primary contents become strictly read-only. Modifying existing text is prohibited.
- **Controlled Amendments**: Post-lock corrections must be appended as new timestamped addenda referencing the original `record_id` and identifying the amending doctor.

---

## 5. Security & Multi-Tenant Rules

- **Tenant Partitioning**: Every medical record query enforces `WHERE tenant_id = :tenantId`.
- **Role-Based Access Control (RBAC)**:
  - `Doctor`: Full read/write access to clinical charts for clinic patients.
  - `Receptionist`: Restricted read access to non-clinical scheduling metadata; clinical SOAP notes masked.
  - `Clinic Manager / Owner`: Administrative read/audit access.
- **HIPAA / GDPR Compliance**: All medical record accesses, reads, edits, and locks emit immutable, tamper-evident audit logs.

---

## 6. Future Expansion (Version 2 Hooks)

- Standardized ICD-10 / ICD-11 diagnosis code catalog integrations.
- CPT procedure coding for automated billing claim submission.
- Integrated e-Prescription pharmacy network dispatches.
- AI Clinical Assistant for automated progress note summarizing.

---

## 7. Non-Functional Requirements

- **Performance**: Sub-100ms load time for patient clinical chart history.
- **Reliability**: 99.99% data persistence guarantee with automated point-in-time backups.
- **Auditability**: Complete append-only audit trail for legal health record compliance.

---

## 8. Out of Scope (Version 1)

- Direct pharmacy e-prescribing network transmission.
- DICOM image viewer integration for radiology scans.
- Automated insurance clearinghouse claim processing.
