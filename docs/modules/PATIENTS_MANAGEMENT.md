# Patients Management Module Requirements Specification (PATIENTS_MANAGEMENT.md)

This document establishes the business requirements, operational goals, patient lifecycles, demographic attributes, duplicate prevention rules, multi-tenant boundaries, and non-functional requirements for the **Patients Management Module** (Module-005) of ClinicOS. It serves as the single source of truth for all future technical design, database schemas, API contracts, and UI/UX implementations.

---

## 1. Module Purpose

### Why the Patients Module Exists
The Patients Management Module serves as the master patient index (MPI) for ClinicOS. It centralizes patient demographic data, contact information, emergency contacts, medical flags (allergies, chronic conditions), and unique patient identification codes within a clinic workspace tenant.

### Scope & System Position
The Patients Module provides the foundational identity records consumed across all clinical and administrative modules:
- **Clinic Management**: Binds patient profiles to specific clinic workspace boundaries (`tenant_id`).
- **Doctors Management**: Enables practitioners to view patient histories and clinical flags during encounters.
- **Future Appointments Module**: Links patient profiles to slot reservations and attendance histories.
- **Future EMR / Medical Records**: Acts as the master record to which clinical notes, diagnoses, and lab results are attached.
- **Future Billing Module**: Serves as the billing target for invoices, payment receipts, and insurance claims.

---

## 2. Business Goals

- **Centralized Master Patient Index (MPI)**: Eliminate fragmented paper charts by storing complete patient profiles digitally.
- **Accurate Demographic & Identity Tracking**: Capture verified national IDs, emergency contacts, and contact numbers to prevent identity mismatches.
- **Fast Search & Lookup**: Support sub-second patient retrieval by Name, Phone Number, Patient Code, or National ID.
- **Strict Multi-Tenant Partitioning**: Ensure patient data is strictly isolated within the subscribing clinic workspace tenant (`tenant_id`).
- **Future EMR & HIPAA/GDPR Compliance Readiness**: Structuring data fields to comply with international health privacy standards and audit logging mandates.

---

## 3. Patient Lifecycle

```
[Patient Registered] ──► Active / Operational ──► Inactive (Dormant)
                                │                      │
                                ▼                      ▼
                            Archived ◄────────────── Restored
                                │
                                ▼
                       Deceased (Terminal)
```

### Lifecycle Stages & Descriptions
1. **Created / Registered**: Initial entry of patient record upon first clinic visit or online pre-registration.
2. **Active**: Patient is actively receiving care or has booked appointments within the clinic.
3. **Inactive**: Patient has had no appointments or clinical encounters for over 12 months.
4. **Archived**: Soft-deleted state executed when a patient requests profile closure or is transferred out. Record retained for medical audit trails.
5. **Restored**: Administrative action restoring an `Archived` patient record back to `Active` status.
6. **Deceased**: Terminal state recorded upon notification of patient death. Prevents future appointment bookings while preserving medical encounter histories.

### Allowed & Prohibited Transitions
- **Allowed**: `Active` ➔ `Inactive` | `Archived` | `Deceased`
- **Allowed**: `Inactive` ➔ `Active` | `Archived` | `Deceased`
- **Allowed**: `Archived` ➔ `Restored` (`Active`)
- **Prohibited**: Cannot transition from `Deceased` to any other state (Terminal State).
- **Prohibited**: Cannot book new appointments for `Archived` or `Deceased` patients.

---

## 4. Patient Profile Specification

### 1. System-Generated Attributes (Immutable)
- `patient_id`: Unique internal system identifier (UUID).
- `tenant_id`: Mandatory clinic workspace scoping key.
- `patient_code`: Readable, auto-generated unique identifier (e.g. `PAT-2026-00102`).
- `created_at`: UTC registration timestamp.
- `updated_at`: UTC last modification timestamp.

### 2. Required Patient Attributes
- `full_name`: Complete legal name.
- `gender`: Biological sex / gender identifier (`male`, `female`, `other`).
- `date_of_birth`: ISO 8601 date string (`YYYY-MM-DD`).
- `primary_phone`: E.164 international formatted phone number.
- `status`: Current lifecycle status (`ACTIVE`, `INACTIVE`, `ARCHIVED`, `DECEASED`).

### 3. Optional Patient Attributes
- `national_id_or_passport`: Unique national identification or passport number.
- `primary_email`: RFC 5322 formatted email address.
- `address_line1`, `address_line2`, `city`, `state`, `postal_code`, `country`: Physical residence location.
- `emergency_contact_name`, `emergency_contact_relationship`, `emergency_contact_phone`: Emergency contact details.
- `blood_group`: ABO blood type (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`, `UNKNOWN`).
- `has_allergies_flag`: Boolean flag indicating known drug/food allergies.
- `has_chronic_diseases_flag`: Boolean flag indicating underlying chronic conditions (e.g. Diabetes, Hypertension).
- `has_insurance_flag`: Boolean flag indicating active medical insurance coverage.
- `administrative_notes`: Internal non-clinical administrative notes (e.g. preferred contact time).

---

## 5. Patient Search Requirements

- **Multi-Parameter Querying**: Search engine must support indexing across:
  - Patient Full Name (partial string & fuzzy matching).
  - Primary Phone Number (exact or suffix matching).
  - National ID / Passport Code (exact match).
  - Patient Code (`PAT-YYYY-XXXXX` exact match).
  - Primary Email Address (exact match).
- **Sub-Second Latency**: Search results returned in under 200ms across datasets exceeding 100,000 patient records per tenant.

---

## 6. Patient Code Strategy

- **Format**: `PAT-YYYYMM-XXXXX` (e.g. `PAT-202607-00142`).
  - `PAT`: Standard prefix.
  - `YYYYMM`: Year and Month of registration.
  - `XXXXX`: Sequential 5-digit zero-padded counter per tenant workspace.
- **Tenant Uniqueness**: Patient codes must be strictly unique within the subscribing clinic workspace.
- **Readability**: Formatted for visual clarity on printed labels, wristbands, and invoices.

---

## 7. Duplicate Prevention Rules

- **Duplicate Triggers**: The system performs pre-registration checks against:
  1. National ID / Passport Number (Strict match check per jurisdiction).
  2. Combination of Primary Phone Number + Date of Birth.
- **Conflict Resolution Workflow**:
  - If a potential duplicate is detected, the system displays an administrative warning banner: "A patient record with matching National ID or Phone & DOB already exists."
  - Administrator can choose to view existing profile or confirm creating a distinct record with explicit justification.

---

## 8. Multi-Tenant Rules

- **Tenant Isolation Constraint**: Every patient entity carries a mandatory `tenant_id`.
- **Cross-Tenant Access Block**: Clinic staff from Tenant A cannot view, query, or modify patient records belonging to Tenant B under any circumstance.
- **Multi-Clinic Patient Scoping**: In Version 1, if a patient visits two independent clinic tenants, separate patient profiles exist under each respective `tenant_id` to preserve HIPAA/GDPR data ownership boundaries.

---

## 9. Relationship Matrix

- **Clinics**: Owned by Clinic Workspace (`tenant_id`).
- **Doctors**: Linked as Attending Physician / Preferred Doctor (`doctor_id`).
- **Future Appointments**: Target subject for slot reservations (`appointment_id`).
- **Future Medical Records (EMR)**: Parent entity for clinical encounter notes, diagnoses, and lab results.
- **Future Billing**: Primary recipient for invoices, payment receipts, and insurance claims.

---

## 10. Business Rules

- **Archive vs Physical Delete**: Physical deletion of patient records is forbidden; archiving soft-deletes the record while retaining medical encounter data for legal compliance.
- **Deceased Record Lock**: Setting status to `DECEASED` permanently locks the profile against future slot scheduling.
- **Allergy Alert Visibility**: If `has_allergies_flag` is `true`, a prominent visual warning indicator must render on all patient header screens.
- **Mandatory Minimum Data**: A patient profile cannot be saved without Full Name, Gender, Date of Birth, and Primary Phone.

---

## 11. Security Requirements

- **Privacy & Encryption**: Sensitive medical flags and national identity codes must be encrypted at rest.
- **RBAC Data Restrictions**: Non-clinical administrative staff can view demographic details but cannot alter clinical allergy flags.
- **Audit Logging**: All profile creations, edits, status transitions, and data exports emit immutable, tamper-evident audit logs containing Actor ID, Tenant ID, and Timestamp.

---

## 12. Future Expansion (Version 2 Scope)

- Family member profile grouping (parent-child dependent relationships).
- External EMR interoperability (HL7 / FHIR data exchange format exports).
- Biometric identification integration (fingerprint scanner hooks).
- Multi-insurance policy coverage tracking.

---

## 13. Non-Functional Requirements

- **Scalability**: Support scaling to 500,000+ patient records per clinic workspace without performance degradation.
- **Availability**: Guarantee 99.9% uptime for patient search and registration APIs.
- **Maintainability**: Clean modular separation of patient validation, repository, and service layers.

---

## 14. Out of Scope (Version 1)

- Direct clinical note authoring or prescription generation (Handled by EMR Module).
- Patient slot reservation execution (Handled by Appointments Module).
- Direct invoice generation or payment processing (Handled by Billing Module).
