# Database Design & Data Modeling Specification

## Metadata

| Field | Value |
| --- | --- |
| **Title** | Database Design & Data Modeling Specification |
| **Purpose** | Defines the conceptual database models, entity relationships, isolation rules, and security guidelines for ClinicOS. |
| **Description** | Acts as the official data architecture reference, keeping the schema plans conceptual and technology-independent. |
| **Status** | Approved |
| **Last Updated** | 2026-07-29 |

---

## Table of Contents

- [Database Overview](#database-overview)
- [Database Goals](#database-goals)
- [Database Type](#database-type)
- [Data Organization Strategy](#data-organization-strategy)
- [Main Business Entities](#main-business-entities)
- [Entity Relationships](#entity-relationships)
- [Tenant Isolation Strategy](#tenant-isolation-strategy)
- [Data Ownership](#data-ownership)
- [Data Lifecycle](#data-lifecycle)
- [Soft Delete Strategy](#soft-delete-strategy)
- [Audit Strategy](#audit-strategy)
- [Backup Strategy](#backup-strategy)
- [Restore Strategy](#restore-strategy)
- [Data Validation Principles](#data-validation-principles)
- [Data Consistency](#data-consistency)
- [Performance Considerations](#performance-considerations)
- [Security Principles](#security-principles)
- [Scalability Strategy](#scalability-strategy)
- [Future Expansion](#future-expansion)
- [Constraints](#constraints)
- [Risks](#risks)
- [Open Questions](#open-questions)

---

# Database Overview

The persistence layer serves as the single source of truth for all transactional data in ClinicOS. The database handles structured records for scheduling, patient details, digital clinical charts, and billing invoices. This specifications document maps the conceptual schema properties, data lifecycle stages, and isolation rules before any tables, queries, or indexes are physically implemented.

---

# Database Goals

- **Data Integrity**: Enforce strict relationship constraints to prevent orphan data states (e.g. billing items without a parent invoice).
- **Scalability**: Support rising database query and transactional volume as new clinics onboard.
- **Performance**: Maintain rapid data access times for daily scheduling dashboards and patient searches.
- **Maintainability**: Utilize normalized data models that simplify updates and database upgrades.
- **Reliability**: Prevent transactional data loss by designing robust replication and backup rules.
- **Security**: Apply field-level encryption for private medical records and enforce zero-trust access paths.
- **Flexibility**: Ensure schema layouts can accommodate future healthcare feature expansions.

---

# Database Type

ClinicOS requires a **Relational Database** engine model. Relational systems are selected because of their mature support for ACID (Atomicity, Consistency, Isolation, Durability) transactions, which are necessary to prevent double-booking timeslots and manage financial invoicing accurately. Additionally, relational models enforce strict schemas and foreign key validation to guarantee data consistency.

---

# Data Organization Strategy

The database isolates data into three logical workspaces:
1. **Global Configuration Workspace**: Stores multi-tenant directories, tenant status indicators (Pending, Active, Suspended), subscription details, and licensing configuration limits.
2. **Tenant Workspace**: Houses isolated tables containing staff details, calendar setups, patient directories, clinical charts, and billing history.
3. **Security Audit Workspace**: Stores immutable logs capturing user access history, record modifications, and system security transactions.

---

# Main Business Entities

### Tenant (Clinic)
- **Purpose**: Represents an isolated clinic customer workspace instance.
- **Responsibilities**: Manages clinic branding configurations, features settings, and license limits.
- **Relationships**: Parent container for Users, Patients, Appointments, EHR Notes, and Invoices.

### User (Staff)
- **Purpose**: Represents clinical and administrative personnel.
- **Responsibilities**: Governs login credentials, assigned roles, permissions, and shift schedules.
- **Relationships**: Belongs to a Tenant. Links to Appointments (as Doctor) and Invoices (as Creator).

### Patient
- **Purpose**: Represents the patient receiving medical care.
- **Responsibilities**: Governs patient demographics, contact details, and emergency identifiers.
- **Relationships**: Belongs to a Tenant. Links to multiple Appointments, EHR Notes, and Invoices.

### Appointment
- **Purpose**: Manages scheduling grid timeslots.
- **Responsibilities**: Governs specific timeslots, visit types, check-in queues, and status (Scheduled, Completed, No-Show).
- **Relationships**: Belongs to a Tenant. Connects a Patient with a Doctor (User).

### EHR Note (Medical Record)
- **Purpose**: Records clinical encounters and diagnoses.
- **Responsibilities**: Governs diagnostic summaries, symptom checklists, treatment logs, prescriptions, and digital physician signatures.
- **Relationships**: Belongs to a Tenant. Links to one Patient, one Doctor (User), and optionally one Appointment.

### Invoice
- **Purpose**: Records clinic service bills.
- **Responsibilities**: Governs invoice numbers, line-item fees, tax rules, and settlement statuses (Paid, Unpaid, Refunded).
- **Relationships**: Belongs to a Tenant. Links to one Patient, one EHR Note, and the generating User.

### Audit Log Entry
- **Purpose**: Security access trail.
- **Responsibilities**: Records read, write, and export events targeting clinical or financial data.
- **Relationships**: Belongs to a Tenant. References the performing User.

---

# Entity Relationships

The relational boundaries dictate how data entities interact:
- A single **Tenant (Clinic)** owns multiple **Users**, **Patients**, **Appointments**, and **Invoices**.
- An **Appointment** connects one **Patient** to one **Doctor (User)**.
- A completed **Appointment** leads to the generation of one **EHR Note** signed by the **Doctor**.
- An **EHR Note** triggers the creation of a corresponding **Invoice** for the **Patient**.
- Every transaction, file view, or data edit across these entities generates an immutable **Audit Log Entry** tracking the acting **User**.

---

# Tenant Isolation Strategy

- **Logical Scoping**: Every database transaction in the tenant workspace must query tables using filters containing the tenant's workspace identifier.
- **Access Interceptor**: An application-level database interceptor must automatically append tenant workspace filters to all incoming read/write queries.
- **No Shared Pools**: Cross-tenant data interactions are strictly prohibited. A tenant workspace cannot query or join tables belonging to another clinic workspace.

---

# Data Ownership

- **Tenant Ownership**: The clinic owner owns all records generated inside their respective tenant workspace.
- **Doctor Authority**: Doctors retain authority over the clinical accuracy of EHR Notes they sign.
- **Patient Privacy**: Patients own privacy access permissions to their demographic records, with the platform functioning as a secure custodian.

---

# Data Lifecycle

- **Creation**: Records are created by authenticated users with strict validation (e.g. an invoice cannot be created without a patient link).
- **Update**: Active fields (like appointment timeslots or payment statuses) can be modified. Medical EHR notes are locked upon signature and cannot be edited.
- **Archive**: Inactive patient files or settled invoices are marked as archived to clean up active directory lists.
- **Deletion**: Physical deletion is blocked; records are soft-deleted to maintain audit compliance.
- **Restoration**: Soft-deleted or archived items can be restored by system administrators under audited workflows.

---

# Soft Delete Strategy

- **No Hard Deletes**: Physical deletion of patient files, invoices, or appointment histories is disabled to comply with medical record retention regulations.
- **Status Flag**: Deleting a record updates a status flag (e.g. `is_deleted = true`), hiding the record from UI dashboards while preserving it in historical database records.

---

# Audit Strategy

- **Immutable Logging**: System modifications are tracked using immutable audit tables that are write-only.
- **Sensitive Operations**: Any read, write, export, or deletion targeting Patient Health Information (PHI) or Invoices must write an audit log entry.
- **Audit Details**: Logs must capture the timestamp, the acting user, the target tenant, the action category, and the IP address.

---

# Backup Strategy

- **Transaction Logs**: Continuously write and replicate database transaction logs to secondary storage targets.
- **Full Backups**: Run daily full database backups. Backups must be encrypted and stored in physically separated geographic server regions with a 7-year retention policy.

---

# Restore Strategy

- **Point-in-Time Recovery (PITR)**: Restore systems must support recovering database states to any specific second in the preceding 30 days.
- **Restore Testing**: Automatically run backup restoration tests weekly on isolated sandbox databases to verify backup file integrity.

---

# Data Validation Principles

- **Schema Integrity**: Relational constraints and foreign keys must be active, preventing orphan data entries.
- **Formatting Checks**: Clean format validation schemas are enforced at the database ingress to reject malformed data.

---

# Data Consistency

- **Transaction Boundaries**: Wrap multi-step processes (e.g., locking an appointment slot and creating a patient invoice) inside database transactions to ensure atomic execution.
- **Concurrency Locks**: Implement locking mechanisms to prevent two receptionists from booking the same timeslot simultaneously.

---

# Performance Considerations

- **Indexing Strategy**: Define indexes for foreign keys, tenant identifiers, patient search terms, and active appointment datetimes.
- **Paging Rules**: Enforce server-side pagination for all list-view queries.
- **Partitioning Plan**: Plan table partitioning for audit log tables and historical appointment grids as database size scales.

---

# Security Principles

- **Field Encryption**: Sensitive fields, including consultation notes, diagnoses, and medical prescriptions, must be encrypted at rest.
- **Least Privilege Access**: Database user credentials must operate under minimal permissions.
- **Credential Storage**: Passwords and keys must be hashed using strong, slow hashing functions.

---

# Scalability Strategy

- **Read Replicas**: Direct heavy analytical read queries (e.g., reports, analytics) to read-only database replicas.
- **Database Partitioning**: Prepare database partitioning rules by tenant workspace groups as system volume grows.

---

# Future Expansion

The following database spaces are reserved for future planning:
- [Dynamic schema metadata extensions for custom clinic templates]
- [NoSQL storage integrations for heavy telemetry metrics]
- [Audit log archiving pipelines to cold storage]

---

# Constraints

- **Offline Limits**: The database does not support local offline edits; active internet access is required.
- **Referential Blocks**: Foreign key relationships prevent the hard deletion of referenced entities.

---

# Risks

- **Locks and Latency**: High concurrency during peak clinic hours could lead to row locks and latency spikes.
- **Audit Storage Growth**: Extensive audit logging will cause storage requirements to grow rapidly, increasing server costs.

---

# Open Questions

- *Encryption Standard*: What specific standard will be used for field-level encryption of clinical notes?
- *Audit Log Storage*: Will security audit trails be saved in the main database or sent to a separate, dedicated log management system?
