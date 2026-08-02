# Medical Records Management Module Database Design Specification (MEDICAL_RECORDS_MANAGEMENT_DATABASE.md)

This document establishes the conceptual database architecture, collection schemas, entity relationships, index strategies, locking constraints, tenant isolation rules, and HIPAA/GDPR audit frameworks for the **Medical Records Management Module** (Module-007) of ClinicOS. It serves as the authoritative database contract prior to any physical Mongoose model or database driver implementation.

---

## 1. Database Overview

### Purpose
The database architecture for the Medical Records Management Module encapsulates Electronic Medical Record (EMR) documents, SOAP consultation notes, patient vital signs, diagnostic assessments, treatment plans, chart locking timestamps, and append-only addenda logs within a clinic workspace tenant.

### Scope
This specification details the MongoDB collection design for `medical_records`, compound index optimization strategies, multi-tenant partitioning logic, immutable lock retention, and integration extension points for future clinical (Prescriptions, Lab, Radiology) and financial (Billing) modules.

---

## 2. Collection Design: `medical_records`

The `medical_records` collection serves as the central clinical EMR ledger. All documents are strictly partitioned by mandatory `tenantId` parameters.

---

## 3. Medical Record Document Structure Specification

### Identity Fields
- `_id`: ObjectId — Required. Primary key.
- `recordNumber`: String — Required. Human-readable unique code (`EMR-YYYYMM-XXXXX`). Unique per tenant.
- `tenantId`: String — Required. Mandatory multi-tenant workspace key. Indexed.
- `clinicId`: String — Required. Associated clinic branch location identifier. Indexed.

### Relationship References
- `patientId`: String — Required. Reference to Patient document ID (`patients._id`). Indexed per tenant.
- `doctorId`: String — Required. Reference to attending Doctor document ID (`doctors._id`). Indexed per tenant.
- `appointmentId`: String — Required. Reference to associated Appointment document ID (`appointments._id`). Unique per tenant.

### Consultation Parameters
- `visitDate`: String — Required. ISO 8601 date string (`YYYY-MM-DD`). Indexed per tenant.
- `visitType`: String — Required. Encounter type (`FIRST_VISIT`, `FOLLOW_UP`, `ROUTINE_CHECKUP`, `EMERGENCY`). Default: `FOLLOW_UP`.

### Clinical Information (SOAP Framework)
- `chiefComplaint`: String — Optional. Patient's stated symptoms or primary reason for visit.
- `historyOfPresentIllness`: String — Optional. Detailed HPI timeline and symptom progression.
- `pastMedicalHistory`: String — Optional. Chronic illnesses, past hospitalizations, medical history notes.
- `surgicalHistory`: String — Optional. Past surgical procedures and dates.
- `familyHistory`: String — Optional. Hereditary and family medical conditions.
- `allergies`: Array of Objects — Optional. `[{ allergen: String, reaction: String, severity: String }]`.
- `currentMedications`: Array of Objects — Optional. `[{ drugName: String, dosage: String, frequency: String }]`.

### Vital Signs Object (`vitalSigns`)
- `bloodPressureSystolic`: Number — Optional. mmHg.
- `bloodPressureDiastolic`: Number — Optional. mmHg.
- `pulseRate`: Number — Optional. Beats per minute (bpm).
- `bodyTemperature`: Number — Optional. Degrees Celsius (°C).
- `respiratoryRate`: Number — Optional. Breaths per minute.
- `oxygenSaturation`: Number — Optional. SpO2 percentage (%).
- `heightCm`: Number — Optional. Height in centimeters.
- `weightKg`: Number — Optional. Weight in kilograms.
- `bodyMassIndex`: Number — Optional. Calculated BMI.

### Assessment & Diagnosis
- `primaryDiagnosis`: String — Optional. Primary clinical diagnosis text.
- `secondaryDiagnoses`: Array of Strings — Optional. Additional active diagnoses.
- `icdCodePlaceholders`: Array of Strings — Optional. Placeholder list for future ICD-10 / ICD-11 codes.
- `assessmentNotes`: String — Optional. Doctor's clinical reasoning and evaluation notes.

### Treatment Plan & Follow-up
- `treatmentPlan`: String — Optional. Prescribed therapy, lifestyle recommendations, and clinical plan.
- `followUpInstructions`: String — Optional. Patient instructions and recommended return visit timeframe.

### Administrative, Locking & Addenda
- `status`: String — Required. Lifecycle status (`DRAFT`, `IN_PROGRESS`, `COMPLETED`, `LOCKED`). Default: `DRAFT`. Indexed.
- `isLocked`: Boolean — Required. Lock status flag. Set to `true` when chart finalized. Default: `false`.
- `lockedAt`: Date — Optional. UTC timestamp when chart was signed and locked.
- `lockedBy`: String — Optional. User ID of doctor who signed and locked chart.
- `addenda`: Array of Objects — Optional. Append-only list of post-lock corrections:
  - `addendumId`: String — Unique identifier.
  - `text`: String — Addendum text.
  - `createdAt`: Date — UTC creation timestamp.
  - `createdBy`: String — User ID of amending doctor.

### Metadata & Audit Trail Fields
- `createdAt`: Date — Required. UTC creation timestamp.
- `updatedAt`: Date — Required. UTC last modification timestamp.
- `createdBy`: String — Required. User ID of creator.
- `updatedBy`: String — Required. User ID of last modifier.
- `version`: Number — Required. Optimistic concurrency control counter. Default: `1`.

---

## 4. Relationships

- **Clinic Workspace ── (1 : N) ── Medical Records**: Workspace tenant owns all EMR chart documents (`tenantId`).
- **Patient Profile ── (1 : N) ── Medical Records**: Historical clinical charts linked to patient (`patientId`).
- **Doctor Profile ── (1 : N) ── Medical Records**: Attending physician assigned to chart (`doctorId`).
- **Appointment ── (1 : 1) ── Medical Record**: Each consultation appointment links to a single EMR chart (`appointmentId`).
- **Medical Record ── (1 : N) ── Prescriptions (Future)**: EMR chart reference for e-prescriptions.
- **Medical Record ── (1 : N) ── Billing Claims (Future)**: EMR chart reference for billable services.

---

## 5. Multi-Tenant Design

- **Hard Partitioning Key**: Every database query executed against `medical_records` enforces `{ tenantId: activeTenantId }`.
- **Cross-Tenant Isolation**: Unique index constraints include `tenantId` to ensure identical record numbers can exist across distinct tenant workspaces without collision.

---

## 6. Index Strategy

1. **Unique Record Number Index**:
   - Keys: `{ tenantId: 1, recordNumber: 1 }`
   - Unique: `true`
   - Rationale: Guarantees unique record numbers within clinic workspace.
2. **Unique Appointment Chart Index**:
   - Keys: `{ tenantId: 1, appointmentId: 1 }`
   - Unique: `true`
   - Rationale: Prevents duplicate medical record creation for the same appointment.
3. **Patient History Timeline Index**:
   - Keys: `{ tenantId: 1, patientId: 1, visitDate: -1 }`
   - Rationale: Accelerates loading a patient's complete historical medical chart timeline.
4. **Doctor Daily Consultations Index**:
   - Keys: `{ tenantId: 1, doctorId: 1, visitDate: -1, status: 1 }`
   - Rationale: Optimizes doctor daily consultation queue lookup.

---

## 7. Uniqueness Rules

- `{ tenantId, recordNumber }`: Unique per tenant.
- `{ tenantId, appointmentId }`: Unique per tenant.

---

## 8. Data Integrity & Locking Rules

- **Immutable Chart Lock**: When `isLocked: true`, physical updates to core fields are rejected. Updates must append to `addenda`.
- **Mandatory Patient & Doctor References**: Documents missing `patientId`, `doctorId`, or `appointmentId` are rejected.

---

## 9. Soft Delete Strategy

- **Logical Archival**: Physical database deletion is forbidden. Archiving sets `status: "ARCHIVED"` and preserves chart history for legal compliance.

---

## 10. Future Expansion (Version 2 Hooks)

- Reserved `icdCodes` array of objects for formal ICD-10 / ICD-11 coding.
- Reserved `cptCodes` array of objects for billing procedures.
- Reserved `digitalSignature` object containing cryptographic hash and timestamp.
