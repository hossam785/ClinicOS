# Patients Management Module Database Design Specification (PATIENTS_MANAGEMENT_DATABASE.md)

This document establishes the conceptual database architecture, collection schemas, entity relationships, index strategies, tenant isolation rules, and audit frameworks for the **Patients Management Module** (Module-005) of ClinicOS. It serves as the authoritative database contract prior to any physical Mongoose model or database driver implementation.

---

## 1. Database Overview

### Purpose
The database architecture for the Patients Management Module encapsulates all patient master index records, demographic fields, contact information, emergency contacts, medical flags (allergies, chronic conditions), and lifecycle statuses within a clinic workspace tenant.

### Scope
This specification details the MongoDB collection design for patient master records, compound index optimization strategies, multi-tenant partitioning logic, soft deletion retention, and integration extension points for future clinical and financial modules.

---

## 2. Collection Design: `patients`

The `patients` collection serves as the central Master Patient Index (MPI) store. All records are partitioned by mandatory `tenantId` parameters.

---

## 3. Patient Document Structure Specification

### Identity Fields
- `_id`: ObjectId — Required. Primary key.
- `patientCode`: String — Required. Auto-generated readable code (`PAT-YYYYMM-XXXXX`). Unique per tenant.
- `tenantId`: String — Required. Mandatory multi-tenant workspace key. Indexed.
- `clinicId`: String — Optional. Associated branch clinic identifier. Indexed.

### Personal Information Fields
- `firstName`: String — Required. Legal first name. Trimmed, 1–50 characters.
- `middleName`: String — Optional. Legal middle name. Trimmed, max 50 characters.
- `lastName`: String — Required. Legal last name. Trimmed, 1–50 characters.
- `fullName`: String — Required. Computed full name string (`firstName middleName lastName`). Indexed for search.
- `gender`: String — Required. Biological sex (`male`, `female`, `other`).
- `dateOfBirth`: String — Required. ISO 8601 date string (`YYYY-MM-DD`).
- `nationalId`: String — Optional. National identification number. Indexed per tenant.
- `passportNumber`: String — Optional. Passport identification code.

### Contact Information Fields
- `primaryPhone`: String — Required. E.164 formatted primary phone number. Indexed per tenant.
- `secondaryPhone`: String — Optional. Secondary contact phone number.
- `email`: String — Optional. RFC 5322 formatted email address. Lowercased, indexed per tenant.
- `address`: Object — Optional. Physical residence address:
  - `addressLine1`: String — Street address line 1.
  - `addressLine2`: String — Apartment/Suite number.
  - `city`: String — City name.
  - `state`: String — State/Province.
  - `postalCode`: String — Postal/ZIP code.
  - `country`: String — Country code (ISO 3166-1 alpha-2).

### Medical Flags & Indicators
- `bloodGroup`: String — Optional. ABO blood type (`A+`, `A-`, `B+`, `B-`, `AB+`, `AB-`, `O+`, `O-`, `UNKNOWN`). Default: `UNKNOWN`.
- `allergiesFlag`: Boolean — Required. Flag indicating known drug or food allergies. Default: `false`.
- `chronicDiseaseFlag`: Boolean — Required. Flag indicating underlying chronic health conditions. Default: `false`.
- `insuranceFlag`: Boolean — Required. Flag indicating active medical insurance coverage. Default: `false`.
- `administrativeNotes`: String — Optional. Non-clinical administrative notes. Max 1000 characters.

### Emergency Contact Fields
- `emergencyContact`: Object — Optional.
  - `name`: String — Contact person's full name.
  - `relationship`: String — Relationship (e.g. Spouse, Parent, Sibling).
  - `phone`: String — Emergency phone number.

### Status & Lifecycle Fields
- `status`: String — Required. State machine status (`ACTIVE`, `INACTIVE`, `ARCHIVED`, `DECEASED`). Default: `ACTIVE`.
- `archivedAt`: Date — Optional. UTC timestamp when record was soft-deleted.
- `archivedBy`: String — Optional. User ID of administrator who executed archive action.

### Metadata & Audit Trail Fields
- `createdAt`: Date — Required. UTC registration timestamp.
- `updatedAt`: Date — Required. UTC last modification timestamp.
- `createdBy`: String — Required. User ID of creator.
- `updatedBy`: String — Required. User ID of last modifier.
- `version`: Number — Required. Optimistic concurrency control counter. Default: `1`.

---

## 4. Relationships

- **Clinic Workspace ── (1 : N) ── Patients**: A tenant workspace owns zero or more patient records.
- **Patient ── (1 : N) ── Appointments (Future)**: Patient profile ID (`_id`) acts as target for slot reservations.
- **Patient ── (1 : N) ── Medical Encounters / EMR (Future)**: Patient profile acts as parent for clinical notes, prescriptions, and lab orders.
- **Patient ── (1 : N) ── Invoices / Billing (Future)**: Patient profile acts as target for billing invoices and payment receipts.

---

## 5. Multi-Tenant Design

- **Hard Partitioning Key**: Every query executed against the `patients` collection must include `{ tenantId: activeTenantId }`.
- **Cross-Tenant Guard**: Unique indexes are compound-scoped with `tenantId` to ensure identical patient codes or phone numbers can exist across distinct tenant workspaces without collision.

---

## 6. Index Strategy

To support sub-second search and strict tenant isolation, the following MongoDB indexes are specified:

1. **Unique Patient Code Index**:
   - Keys: `{ tenantId: 1, patientCode: 1 }`
   - Unique: `true`
   - Rationale: Guarantees unique patient codes within each clinic workspace.
2. **National ID Lookup Index**:
   - Keys: `{ tenantId: 1, nationalId: 1 }`
   - Sparse: `true`, Unique: `true`
   - Rationale: Accelerates National ID lookup and prevents duplicate registrations.
3. **Primary Phone Lookup Index**:
   - Keys: `{ tenantId: 1, primaryPhone: 1 }`
   - Rationale: Accelerates phone number searches on reception desks.
4. **Full Name Search Index**:
   - Keys: `{ tenantId: 1, fullName: 1 }`
   - Rationale: Supports fast name autocomplete and directory filtering.
5. **Directory Status Index**:
   - Keys: `{ tenantId: 1, status: 1, updatedAt: -1 }`
   - Rationale: Optimizes paginated patient list queries filtered by active/archived statuses.

---

## 7. Uniqueness Rules

- `{ tenantId, patientCode }`: Unique within tenant workspace.
- `{ tenantId, nationalId }`: Unique within tenant workspace (sparse index allows multiple nulls).

---

## 8. Soft Delete Strategy

- **Logical Archive**: Physical database deletion is forbidden. Archiving sets `status: "ARCHIVED"`, writes `archivedAt`, and logs `archivedBy`.
- **Query Filter Policy**: Standard active roster queries specify `{ tenantId, status: { $ne: "ARCHIVED" } }`. Historical clinical encounter searches can include archived patient documents for legal compliance.
- **Restoration**: Setting status back to `ACTIVE` restores profile visibility while maintaining full audit history.

---

## 9. Data Integrity Rules

- **Mandatory Fields**: Documents missing `firstName`, `lastName`, `gender`, `dateOfBirth`, or `primaryPhone` are rejected.
- **Optimistic Concurrency**: Updates must check `version` match before committing mutations to prevent lost updates during concurrent edits.

---

## 10. Scalability Strategy

- **Horizontal Sharding Preparedness**: The collection uses `{ tenantId: 1, _id: 1 }` as its shard key pattern, supporting seamless sharding across MongoDB clusters.
- **Index Efficiency**: All query patterns use prefix index matching starting with `tenantId`.

---

## 11. Future Expansion (Version 2 Hooks)

- Structural space reserved for `familyMembers` array (linking parent-child dependent `_id` references).
- Structural space reserved for `insurancePolicies` array (storing policy numbers and provider codes).

---

## 12. Security Considerations

- **PII Encryption Candidate**: `nationalId`, `passportNumber`, and `address` parameters are flagged for application-tier encryption at rest.
- **Audit Logging**: All write and update operations emit append-only audit events capturing actor ID, changes, and timestamps.
