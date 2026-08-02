# Business Analysis & Domain Specification

## Metadata

| Field | Value |
| --- | --- |
| **Title** | Business Analysis & Domain Specification |
| **Purpose** | Details the domain analysis, core business logic, organizational workflows, and regulatory constraints for ClinicOS. |
| **Description** | Acts as the authoritative blueprint for business domain rules, terminology, actor roles, and process flows. |
| **Status** | Approved |
| **Last Updated** | 2026-07-29 |

---

## Table of Contents

- [Business Overview](#business-overview)
- [Business Objectives](#business-objectives)
- [Stakeholders](#stakeholders)
- [User Types](#user-types)
- [Business Processes](#business-processes)
- [Functional Requirements](#functional-requirements)
- [Non-Functional Requirements](#non-functional-requirements)
- [Business Rules](#business-rules)
- [Constraints](#constraints)
- [Success Criteria](#success-criteria)
- [Risks](#risks)
- [Future Business Opportunities](#future-business-opportunities)
- [Open Questions](#open-questions)

---

# Business Overview

ClinicOS is a multi-tenant, enterprise-grade Software-as-a-Service (SaaS) clinical workflow platform. From a business perspective, the system coordinates scheduling, patient intake, consultation logs, and invoicing under a unified workspace. The platform functions as the operational core of a medical practice, maintaining strict data isolation between clinics while providing customized views based on clinical and administrative roles.

---

# Business Objectives

- **Operational Efficiency**: Reduce the duration of patient check-in and checkout queues by 40%.
- **Documentation Optimization**: Decrease the administrative scheduling overhead for clinical staff by 25%.
- **Rapid Clinic Onboarding**: Enable a new clinic workspace to be configured and ready to receive bookings within 10 minutes of account approval.
- **Data Governance Compliance**: Ensure 100% compliance with data privacy regulations (such as HIPAA and GDPR) by enforcing absolute tenant-level data segregation.

---

# Stakeholders

### Clinic Owner
- **Responsibilities**: Manages clinic finances, oversees staff access controls, and monitors practice metrics.
- **Goals**: Optimize staff productivity, track practice revenue growth, and minimize operational waste.
- **Expectations**: Accurate performance reports, secure access management, and high system availability.

### Doctors
- **Responsibilities**: Examine patients, record diagnoses, write clinical prescription logs, and review patient medical histories.
- **Goals**: Focus on patient care with minimal administrative friction and rapid text entry during consultations.
- **Expectations**: Zero-latency file access, clean high-density layout, and simple, checklist-driven consultation forms.

### Receptionists
- **Responsibilities**: Coordinate the scheduling calendar, register patients, check patients in/out, and process billing invoices.
- **Goals**: Zero booking conflicts, fast client registration, and clear billing tracking.
- **Expectations**: A reliable calendar dashboard, instantaneous search functionality, and simple billing triggers.

### Patients
- **Responsibilities**: Arrive for bookings on time, provide accurate history, and pay for services.
- **Goals**: Enjoy minimal wait times and receive clear, itemized invoices.
- **Expectations**: High security of their health logs and professional clinic coordination.

### System Administrator
- **Responsibilities**: Configures tenant integrations, manages data backups, and adjusts configuration presets.
- **Goals**: Keep system components configured correctly and resolve staff configuration queries.
- **Expectations**: Clear documentation, audit logs, and diagnostic dashboards.

### Super Administrator
- **Responsibilities**: Manages the global multi-tenant platform, validates clinic applications, and monitors overall service health.
- **Goals**: Ensure platform integrity, audit usage, and approve clinic accounts safely.
- **Expectations**: Master access controls, tenant suspension tools, and global performance summaries.

---

# User Types

### Clinic Owner
- **Description**: The primary business owner of a clinic tenant workspace.
- **Permissions Overview**: Read, write, and delete permissions on billing profiles, staff registrations, clinic configurations, and patient directories.
- **Primary Responsibilities**: Onboarding staff, reviewing financial metrics, and configuring doctor shifts.

### Doctor
- **Description**: Authorized medical practitioner within a clinic.
- **Permissions Overview**: Read/write access to Electronic Health Records (EHR), patient histories, and prescription logs. Read-only access to doctor schedules. No access to financial billing details.
- **Primary Responsibilities**: Patient diagnoses, writing notes, and authorizing treatment logs.

### Receptionist
- **Description**: Operational administrative staff at the clinic.
- **Permissions Overview**: Read/write access to appointment schedules, patient contact profiles, and billing invoices. Read-only access to general doctor schedules. Prohibited from viewing patient clinical EHR notes.
- **Primary Responsibilities**: Front-desk operations, calendar coordination, and invoice tracking.

### System Administrator
- **Description**: Tenant technical configuration manager.
- **Permissions Overview**: Read/write access to integrations and tenant system settings. No access to clinical EHR contents or financial billing line items.
- **Primary Responsibilities**: Managing clinic integration settings and exporting system logs.

### Super Administrator
- **Description**: Platform operator.
- **Permissions Overview**: Absolute master access to tenant creation, clinic approval systems, platform configuration settings, and audit logs.
- **Primary Responsibilities**: Creating tenants, approving clinics, and applying platform patches.

---

# Business Processes

### Clinic Registration
1. Clinic owner submits a registration form with business information, owner details, and proof of licensing.
2. The system registers the tenant in a `Pending Verification` status.
3. The owner receives an email acknowledging the submission.

### Clinic Approval
1. The Super Administrator reviews the pending clinic applications on a global dashboard.
2. Upon verification, the Super Administrator approves the clinic.
3. The clinic status changes to `Active`, the tenant database workspace is initialized, and login access is sent to the owner.

### Login
1. Users provide credentials along with their specific clinic tenant identifier.
2. The system authenticates the credentials and evaluates the user role permissions.
3. The user is redirected to their designated dashboard interface (e.g., Doctor dashboard, Receptionist calendar).

### Appointment Management
1. A patient contacts the clinic, and the receptionist reviews doctor availability via the calendar.
2. The receptionist logs an appointment, matching the patient profile to a doctor and a specific timeslot.
3. The system locks the timeslot to prevent double-booking.

### Patient Management
1. Receptionist inputs patient contact details, demographic facts, and primary identifiers.
2. The system creates a master patient directory entry.
3. Users search the directory using parameters like name, contact number, or national health ID.

### Doctor Management
1. The Clinic Owner defines a doctor's active working hours, weekly shift cycles, and specializations.
2. The system dynamically updates the calendar scheduler rules using these parameters.

### Medical Records
1. During a consultation, the doctor opens the patient's EHR file.
2. The doctor inputs notes, logs symptoms, assigns codes, and generates a prescription.
3. The EHR entry is saved and timestamped. It cannot be altered after signing, except via authorized addendum logs.

### Billing
1. Upon consultation completion, the system automatically drafts a billing invoice listing the consultation fee and prescribed items.
2. The receptionist reviews the draft, adjusts discounts if allowed, and collects payment.
3. The receptionist flags the invoice status as `Paid`.

### Reports
1. Clinic Owners run reports based on date ranges.
2. The platform generates operational totals, such as aggregate consultation counts, active patient growth, and billing totals.

---

# Functional Requirements

### Tenant & Workspace Management Module
- **`REQ-BUS-101`**: The platform must support self-service registration for clinic owners.
- **`REQ-BUS-102`**: The platform must allow Super Administrators to activate, suspend, or deactivate clinic workspaces.
- **`REQ-BUS-103`**: The system must enforce absolute logical segregation of data between clinic tenants.

### IAM & Role-Based Access Control Module
- **`REQ-BUS-201`**: Users must authenticate using a secure login that verifies their association with a specific clinic tenant.
- **`REQ-BUS-202`**: The system must restrict UI features and data endpoints based on the authenticated user's role (RBAC).
- **`REQ-BUS-203`**: Session timeouts must trigger after 15 minutes of inactivity to protect sensitive health data.

### Scheduler Module
- **`REQ-BUS-301`**: Receptionists must be able to view, create, reschedule, and cancel appointments in a visual calendar dashboard.
- **`REQ-BUS-302`**: The system must prevent double-booking of a doctor's timeslot.

### Patient Directory Module
- **`REQ-BUS-401`**: Users must be able to create, update, and search patient files using name, phone number, or ID.
- **`REQ-BUS-402`**: A timeline showing all past appointments and consultation instances must be available in each patient record.

### Medical Records (EHR) Module
- **`REQ-BUS-501`**: Doctors must be able to enter diagnostic notes and prescriptions in a structured EHR template.
- **`REQ-BUS-502`**: Completed medical files must be electronically signed, locked, and audit-logged upon submission.

### Invoicing & Billing Module
- **`REQ-BUS-601`**: The system must automatically draft an invoice upon the conclusion of a doctor consult.
- **`REQ-BUS-602`**: Receptionists must be able to flag invoices as Paid, Unpaid, or Refunded.

---

# Non-Functional Requirements

- **Performance**: High interactive response. Pages must display critical data in less than 300ms.
- **Reliability**: Zero clinical transaction loss. System data mutations must guarantee transactional integrity.
- **Availability**: The system must maintain 99.9% availability during general clinic operation hours (08:00 to 22:00 local time).
- **Scalability**: The multi-tenant engine must support 500+ active clinic tenants without database contention or performance drops.
- **Security**: Healthcare data protection. Field-level encryption for consultation text and strict user read/write logging.
- **Maintainability**: Clear separation of modules so changes to the billing engine do not affect the scheduling tool.
- **Accessibility**: Compliance with WCAG 2.1 Level AA color contrast, font scaling, and keyboard accessibility.
- **Usability**: High-density UI layouts minimizing typing; extensive checkmark inputs and tab keys for clinical staff efficiency.

---

# Business Rules

- **`BR-001`**: A clinic workspace must be manually approved and activated by a Super Administrator before any clinic staff can log in.
- **`BR-002`**: Data access is strictly compartmentalized; clinic staff can only access data belonging to their specific clinic workspace.
- **`BR-003`**: Super Administrators can manage tenant statuses and globally configure properties, but they cannot view patient medical files (EHR notes) without generating a security audit flag.
- **`BR-004`**: Deletion of records must follow a soft-delete pattern to prevent accidental data loss and comply with medical record preservation standards.

---

# Constraints

- **No Online Payment Integration**: Version 1 does not process credit cards online (no Stripe or PayPal integrations). Payments are handled in cash or via local clinic terminals, then marked as Paid manually.
- **Strict Multi-Tenancy**: The database architecture must isolate each tenant schema from the first deployment.
- **Manual Verification**: No automated approvals of medical credentials; clinic registration approvals must be processed manually by the Super Admin.
- **Always Online**: System requires active cloud server access; no offline synchronization or local network fallback is supported.

---

# Success Criteria

- Successful onboarding and operational run of 10 pilot clinics with zero cross-tenant data leaks.
- Front-desk scheduling and check-in time takes less than 30 seconds per patient.
- 100% pass rate in security compliance testing (verifying audit logs and schema separation).

---

# Risks

### Operational Risks
- Super Administrator approval delays during high sign-up periods could cause clinic owners to abandon onboarding.

### Adoption Risks
- Busy doctors may reject the EHR module if the text inputs are slow or require excessive clicking.

### Data Risks
- Incorrect RBAC configuration could lead to receptionist staff viewing patient EHR files, breaching patient confidentiality.

### Growth Risks
- Multiple active tenants querying database records simultaneously may lead to query blockages if connection pooling is not configured properly.

---

# Future Business Opportunities

- **Patient Portal**: A patient-facing app for booking appointments and reviewing medical logs.
- **e-Prescriptions**: Integration with local pharmacy networks to transmit prescriptions directly.
- **Insurance Automation**: Integration with local health insurance providers for instant coverage claims.

---

# Open Questions

- **Soft-delete Policy**: What is the default retention period for soft-deleted records before they are legally allowed to be purged?
- **Subscription Engine**: Will tenant billing (clinic subscriptions) be managed in the system or handled externally in early versions?
