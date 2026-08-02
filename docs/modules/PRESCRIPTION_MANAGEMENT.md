# Prescription Management Requirements Specification (PRESCRIPTION_MANAGEMENT.md)

This document establishes the official business requirements, clinical rules, state machine lifecycles, ownership constraints, printable format rules, security specifications, and future architectural expansion hooks for the **Electronic Prescription (ePrescription) Management Module** (Module-008) of ClinicOS. It serves as the single source of truth for all engineering, design, database schema, API contracts, and UI/UX implementations.

---

## 1. Module Purpose & System Architecture Position

### Purpose & Clinical Objectives
The Prescription Management Module provides an enterprise-grade Electronic Prescription (ePrescription) system designed for healthcare practices ranging from single-doctor outpatient clinics to large multi-doctor, multi-specialty medical centers.

The module enables attending physicians to generate, review, finalize, print, export, and archive digital prescriptions. Every finalized prescription becomes an immutable, legally sound component of the patient's permanent medical history chart and can be rendered, printed, or exported as a PDF at any time.

### System Architecture Position & Integrations
The ePrescription module operates as a core clinical extension of the Electronic Medical Record (EMR) ecosystem and integrates seamlessly with key platform modules:

- **Authentication Module**: Enforces Role-Based Access Control (RBAC), user session contexts, identity attribution, and multi-tenant workspace isolation (`tenantId`).
- **Doctors Management Module**: Supplies attending physician credentials, medical licensing numbers, specializations, clinic affiliations, contact details, and digital signature contexts (`doctorId`).
- **Patients Management Module**: Binds prescriptions to the Master Patient Index (MPI), extracting demographic metadata (Full Name, Age, Gender, DOB, Address, Phone, Allergies) (`patientId`).
- **Appointment Management Module**: Links prescriptions to the specific clinical encounter reservation (`appointmentId`) and visit timestamp.
- **Medical Records Management Module**: Binds prescriptions directly to an active or completed clinical encounter SOAP chart (`medicalRecordId`), embedding primary and secondary diagnosis summaries.

```
+------------------+      +------------------+      +---------------------+
|  Patients Module |      |  Doctors Module  |      | Appointments Module |
|   (patient_id)   |      |   (doctor_id)    |      |  (appointment_id)   |
+--------+---------+      +--------+---------+      +----------+----------+
         |                         |                           |
         +--------------------+    |    +----------------------+
                              |    |    |
                              v    v    v
                    +--------------------------+
                    | Medical Records Module   |
                    |   (medical_record_id)    |
                    +------------+-------------+
                                 |
                                 v
                    +--------------------------+
                    | Prescription Module      |
                    |     (rx_number)          |
                    +--------------------------+
```

---

## 2. Prescription Ownership & Relational Architecture

### Mandatory Relationship Constraints
A prescription **cannot exist in isolation**. To maintain legal compliance, clinical traceability, and system data integrity, the system enforces the following strict relational invariants:

1. **Mandatory Patient Link (`patientId`)**: Every prescription must be attached to a valid, non-archived patient record.
2. **Mandatory Medical Record Link (`medicalRecordId`)**: A prescription **cannot exist** without an associated Medical Record (EMR SOAP encounter note). Prescriptions are legally derived from clinical evaluations.
3. **Mandatory Doctor Link (`doctorId`)**: Every prescription must identify the prescribing physician registered within the clinic workspace.
4. **Mandatory Clinic Link (`tenantId`)**: Every prescription is strictly scoped to a multi-tenant workspace instance. Cross-tenant leakage is physically impossible.
5. **Optional/Associated Appointment Link (`appointmentId`)**: When a prescription is issued during a scheduled consultation, the appointment identifier is recorded for billing and queue workflow correlation.

### Ownership Matrix
| Entity | Ownership Model | Cascade / Constraint Rule |
| --- | --- | --- |
| **Clinic (`tenantId`)** | Workspace Boundary Owner | Enforces data partitioning. All prescription queries filter by `tenantId`. |
| **Doctor (`doctorId`)** | Prescribing Clinical Authority | Only the prescribing doctor (or authorized covering physician) can edit drafts or finalize. |
| **Patient (`patientId`)** | Clinical Subject | The prescription forms a permanent node in the patient's medical history timeline. |
| **Medical Record (`medicalRecordId`)** | Legal Parent Encounter | Deleting a Medical Record is prohibited; soft-archiving a record flags linked prescriptions. |
| **Appointment (`appointmentId`)** | Operational Origin | Provides visit date/time and queue context. |

---

## 3. Prescription State Machine & Lifecycle

A prescription transitions through four distinct lifecycle states governed by strict validation rules:

```
                  +---------------+
                  |     DRAFT     |
                  +-------+-------+
                          |
                          | (Finalize & Sign)
                          v
                  +---------------+
                  |   FINALIZED   | <-----------------+
                  +-------+-------+                   |
                          |                           |
        +-----------------+-----------------+         | (Re-Print)
        | (Print / PDF)                     |         |
        v                                   v         |
+---------------+                   +---------------+ |
|    PRINTED    | ----------------> |   ARCHIVED    | |
+---------------+ (Re-Print)        +---------------+-+
```

### Lifecycle States Defined

#### 1. Draft (`DRAFT`)
- **Description**: Initial state created when a doctor initiates prescription entry during a patient encounter.
- **Allowed Actions**:
  - Add, edit, or remove medication items.
  - Modify dosage, frequency, duration, instructions, notes, and follow-up advice.
  - Delete draft.
- **Constraints**:
  - Visible **only** to the prescribing doctor.
  - **Not** visible in the patient's public medical history timeline.
  - **Not** valid for official pharmacy dispensing.
  - Direct printing outputs a prominent background watermark: `"DRAFT - NOT VALID FOR DISPENSING"`.

#### 2. Finalized (`FINALIZED`)
- **Description**: The prescribing doctor locks and signs the prescription, transforming it into an official medical document.
- **Allowed Actions**:
  - Print direct physical copy.
  - Export to standardized PDF.
  - View in patient medical history timeline.
  - Archive (with mandatory audit reason).
- **Constraints**:
  - Clinical content (medications, dosage, diagnosis) becomes **100% immutable**. Edits are prohibited.
  - Automatically embedded in patient's medical history chart.
  - Official prescription code generated (e.g. `RX-202607-00189`).

#### 3. Printed (`PRINTED`)
- **Description**: Operational state or tracking flag indicating that an official physical printout or PDF export has been generated.
- **Allowed Actions**:
  - Re-print / Export PDF at any time.
  - Archive (with mandatory audit reason).
- **Constraints**:
  - Clinical content remains **100% immutable**.
  - Increments `printCount` counter.
  - Logs `lastPrintedAt` timestamp and `lastPrintedBy` user ID.

#### 4. Archived (`ARCHIVED`)
- **Description**: Prescription revoked, superseded, or archived due to administrative reasons or clinical changes (e.g. adverse reaction, incorrect dosage entered prior to dispensing).
- **Allowed Actions**:
  - Read-only viewing for audit and compliance purposes.
- **Constraints**:
  - Cannot be edited, finalized, or reprinted.
  - Retained permanently in database for legal audit trails with status badge `ARCHIVED`.

---

## 4. Prescription Content & Data Specifications

An Electronic Prescription consists of six major sections, supporting an unlimited number of medication line items per document:

### Section A: Header & System Identifiers
- **Prescription Code**: Auto-generated human-readable identifier following format `RX-YYYYMM-XXXXX` (e.g., `RX-202607-00042`).
- **Lifecycle Status**: `DRAFT`, `FINALIZED`, `PRINTED`, `ARCHIVED`.
- **Issue Timestamp**: UTC and local clinic time of finalization.
- **Tenant Scope**: `tenantId`.

### Section B: Clinic & Facility Metadata
- **Clinic Name**: Registered workspace business name.
- **Branch Address**: Street, City, State, Country, Postal Code.
- **Contact Info**: Clinic Phone Number, Emergency Hotline, Email Address.
- **Tax / Licensing ID**: Clinic registration or health facility license code.
- **Clinic Branding**: High-resolution logo URL (used for PDF/Print header).

### Section C: Doctor (Prescriber) Metadata
- **Doctor Full Name**: Title, First Name, Last Name (e.g., `Dr. Sarah Jenkins, MD`).
- **Specialization**: Primary medical specialty (e.g., `Cardiology`, `Pediatrics`).
- **Medical License Number**: Official state/national license ID.
- **Doctor Contact / Signature**: Doctor phone/email, digital signature graphic placeholder.

### Section D: Patient Metadata & Clinical Context
- **Patient Full Name**: First Name, Middle Name, Last Name.
- **Patient Code**: Auto-generated identifier (`PAT-YYYYMM-XXXXX`).
- **Demographics**: Age (years/months), Gender (`MALE`, `FEMALE`, `OTHER`), Date of Birth.
- **Contact Details**: Phone Number, Residential Address.
- **Known Allergies & Risk Flags**: Highlighted list of recorded drug allergies (e.g., `Penicillin`, `Sulfa Drugs`) pulled directly from Patient Record.
- **Clinical Encounter Details**:
  - **Visit Date**: Date of clinical encounter.
  - **Linked Medical Record**: `EMR-YYYYMM-XXXXX` link.
  - **Diagnosis Summary**: Primary and secondary diagnosis summary extracted from SOAP Assessment.

### Section E: Medication Line Items (Unlimited Items)
Each medication line item contains:
1. **Medicine Name**: Name of drug (e.g., `Amoxicillin / Clavulanic Acid`).
2. **Strength / Concentration**: Active ingredient strength (e.g., `500 mg / 125 mg`, `10 mg/mL`, `0.5%`).
3. **Form**: Dosage form selection:
   - `Tablet`
   - `Capsule`
   - `Syrup / Oral Suspension`
   - `Injection / IV / IM`
   - `Cream / Ointment / Gel`
   - `Drops (Eye / Ear / Nasal)`
   - `Inhaler / Respule`
   - `Patch (Transdermal)`
   - `Suppository`
   - `Solution / Elixir`
   - `Other`
4. **Dosage**: Specific quantity per intake (e.g., `1 Tablet`, `5 mL`, `2 Puffs`, `1 Application`).
5. **Frequency**: Administration schedule (e.g., `Once daily (QD)`, `Twice daily (BID)`, `Three times daily (TID)`, `Four times daily (QID)`, `Every 8 hours`, `As needed (PRN)`, `Before bedtime (QHS)`).
6. **Duration**: Course length (e.g., `5 Days`, `7 Days`, `2 Weeks`, `1 Month`, `Continuous`).
7. **Total Quantity**: Dispensing quantity (e.g., `21 Tablets`, `1 Bottle (100ml)`, `2 Boxes`).
8. **Patient Instructions**: Clear intake directions (e.g., `Take after meals with a full glass of water. Complete full course.`).

### Section F: Notes & Follow-Up Advice
- **General Doctor Notes**: Special dietary, lifestyle, or clinical warnings (e.g., `Avoid alcohol and direct sunlight while on this medication`).
- **Follow-Up Advice**: Scheduled return date or criteria for follow-up consultation (e.g., `Return to clinic in 7 days for blood pressure re-evaluation or sooner if symptoms worsen`).

---

## 5. Medication Entry Mechanics

### Current Manual Entry Rules (Version 1)
- Doctors can input any medication name, strength, form, dosage, frequency, duration, quantity, and instructions via structured form controls.
- Quick-fill presets and recent medication shortcuts accelerate clinical entry.
- Text inputs enforce strict length limits and XSS sanitization.

### Architectural Blueprint for Future Drug Database Integration
While V1 uses manual entry, the system architecture separates the UI data contracts from the storage engine to prepare for external drug catalogs (e.g., RxNorm, SNOMED CT, WHO ATC, FDA NDC):

```
+-----------------------------------------------------------+
|                   Prescription Form UI                    |
+-----------------------------+-----------------------------+
                              |
                              v
+-----------------------------------------------------------+
|                 Medication Input Interface                |
|  - manualEntry: { name, strength, form, dosage }          |
|  - catalogRef?: { drugId, rxNormCui, codeSystem } [HOOK]  |
+-----------------------------+-----------------------------+
                              |
                              v
+-----------------------------------------------------------+
|               Prescription Service & Database             |
+-----------------------------------------------------------+
```
- **Schema Reservation**: Includes optional `catalogId`, `rxNormCode`, and `atcClassification` fields in the medication schema without making them mandatory in V1.

---

## 6. Printing, PDF Export & Reprint Engine

### 1. Direct Printing Workflow
- The system provides a dedicated, print-optimized stylesheet (`@media print`) rendering a standard medical header, structured tabular medication layout, doctor signature block, and clinic footer.
- Eliminates non-printable UI elements (navigation sidebars, buttons, headers).
- Supports standard paper sizes (A4, Letter, A5 prescription pad format).

### 2. PDF Export Engine
- Generates pixel-perfect vector PDF documents matching official clinic prescription templates.
- Includes embedded clinic logo, doctor registration details, and security checksum.
- Filename standard: `Prescription_[RX-Code]_[Patient-Name].pdf`.

### 3. Reprint Rules & Audit Logs
- Re-printing or re-exporting a `FINALIZED` or `PRINTED` prescription is permitted at any time by authorized staff.
- Every print or PDF export action triggers an immutable audit log update:
  - Increments `printCount` counter by `1`.
  - Sets `lastPrintedAt` to current UTC timestamp.
  - Records `lastPrintedBy` user ID.
  - Appends entry to `printHistory` audit log array.

---

## 7. Patient Medical History Timeline Integration

Every finalized prescription is automatically indexed in the Patient Medical History timeline (`GET /api/v1/patients/:patientId/history`):

- **Chronological Placement**: Displayed alongside SOAP encounter notes, vitals, and appointment history.
- **Summary Card**: Shows `RX-YYYYMM-XXXXX` code, prescribing doctor name, encounter date, primary diagnosis, number of prescribed medications, and status (`FINALIZED` / `PRINTED`).
- **One-Click View/Print**: Direct access to view full prescription details, download PDF, or send to printer.

---

## 8. Multi-Criteria Search & Filtering Engine

The ePrescription module provides flexible search capabilities across the clinic workspace:

- **Filter by Patient**: Search by patient full name, phone number, or patient code (`PAT-...`).
- **Filter by Doctor**: Search by attending physician name or license code.
- **Filter by Date Range**: Filter by prescription creation date or encounter date (`startDate`, `endDate`).
- **Filter by Medicine Name**: Search for prescriptions containing a specific drug (e.g. `Amoxicillin`).
- **Filter by Prescription Code**: Exact match search for `RX-YYYYMM-XXXXX`.
- **Filter by Status**: Filter by `DRAFT`, `FINALIZED`, `PRINTED`, `ARCHIVED`.

---

## 9. Role-Based Permission Matrix (RBAC)

Access permissions are strictly governed by user roles within the active clinic workspace (`tenantId`):

| Action / Capability | Doctor (Prescriber) | Receptionist | Clinic Manager / Owner | Platform Admin |
| --- | --- | --- | --- | --- |
| **Create Draft Prescription** | Yes | No | No | No |
| **Edit Draft Prescription** | Yes (Own drafts) | No | No | No |
| **Delete Draft Prescription** | Yes (Own drafts) | No | No | No |
| **Finalize & Sign Prescription** | Yes | No | No | No |
| **View Finalized Prescription** | Yes | Yes (If granted permission) | Yes | **No** (Zero clinical access) |
| **Print / Export PDF** | Yes | Yes (If granted permission) | Yes | **No** |
| **Archive Prescription** | Yes | No | Yes | **No** |
| **View Audit Trail & Print Logs** | Yes | No | Yes | **No** (Only non-PHI system logs) |
| **Access Prescription Reports** | Yes | No | Yes | **No** |

> [!IMPORTANT]
> **Platform Admin Boundary**: Platform Administrators manage tenant infrastructure, system health, and billing subscriptions. They have **zero access** to patient health information (PHI), clinical SOAP notes, or prescription content.

---

## 10. Comprehensive Audit Trail Specifications

To ensure compliance with healthcare governance standards (HIPAA, GDPR, local medical council regulations), every prescription maintains an immutable audit log capturing:

- `createdBy`: User ID and timestamp when draft was created.
- `finalizedBy`: Doctor ID and timestamp when prescription was signed & finalized.
- `printedBy`: User ID of staff member who initiated physical print or PDF export.
- `printCount`: Total number of times the prescription has been printed or exported.
- `lastPrintedAt`: Timestamp of the most recent print action.
- `updatedAt`: Timestamp of last modification (during draft state).
- `archivedBy` & `archivedReason`: User ID and mandatory justification note if archived.

---

## 11. Future Extension Architecture Hooks

The ePrescription module reserves clean architectural interfaces for future seamless enhancements **without requiring breaking changes to V1**:

1. **Electronic Signature Engine (`eSignature`)**: Architectural slot for PKI-based digital signatures, cryptographic hashes (SHA-256), and doctor certificate validation.
2. **QR Code Verification (`qrVerification`)**: Placeholder for generating tamper-proof QR codes on printed/PDF prescriptions to enable pharmacy verification against clinic API.
3. **Drug Interaction & Allergy Checker Engine (`drugInteraction`)**: Service interface hook for automated allergy contraindication alerts and drug-drug interaction warnings prior to finalization.
4. **Pharmacy Network Integration (`pharmacyIntegration`)**: API gateway hooks for direct electronic dispatch to partner pharmacy management systems (HL7 FHIR / REST).
5. **WhatsApp Delivery Engine (`whatsAppDelivery`)**: Integration hook for sending secure ePrescription download links directly to patient WhatsApp numbers.
6. **Email Delivery Engine (`emailDelivery`)**: Service hook for mailing encrypted PDF prescriptions directly to verified patient email addresses.

---

## 12. Non-Functional Requirements

- **Performance**: Prescription creation and retrieval must complete in `< 100ms`. PDF rendering in `< 500ms`.
- **Reliability**: 99.99% data availability with zero loss of finalized prescription records.
- **Security & Privacy**: Strict multi-tenant isolation, TLS 1.3 in transit, AES-256 encryption at rest.
- **Compliance**: Full audit trail recording to prevent unauthorized modifications or illegal prescription re-issuance.

---

## 13. Deliverables Checklist & Sign-Off

- [x] Business workflow documented
- [x] Lifecycle state machine documented (`DRAFT`, `FINALIZED`, `PRINTED`, `ARCHIVED`)
- [x] Relational ownership documented (Clinic, Doctor, Patient, Medical Record, Appointment)
- [x] Permission matrix defined (Doctor, Reception, Manager, Admin)
- [x] Printing & PDF export rules documented
- [x] Patient Medical History integration documented
- [x] Multi-criteria search capabilities documented
- [x] Audit trail requirements specified
- [x] Future extensions clean architecture hooks defined
- [x] Zero architectural conflicts with previous modules (TASK-001 through TASK-073)

---

## 14. Next Step Recommendation

The business requirements for the Prescription Management Module are complete, thoroughly validated, and approved. We are ready to proceed to **TASK-075 — Prescription Management User Flows & System Flows**.
