# Clinic Management Module Requirements Specification (CLINIC_MANAGEMENT.md)

This document establishes the business requirements, boundaries, lifecycles, and security considerations for the **Clinic Management Module** of ClinicOS. It serves as the single source of truth for all future design, database schema, API contract, and frontend UI/UX implementations.

---

## 1. Module Overview

### Purpose
The Clinic Management Module is the administrative foundation of ClinicOS. It is responsible for managing the profiles, operational parameters, and configuration settings of individual medical clinics (tenants) using the platform.

### Scope
This module covers the settings, working hours, contact profiles, operational metadata, and administrative states of a clinic workspace. It establishes the organizational structure needed to support clinical practitioners, receptionists, and patients.

### Goals
- Establish secure and isolated clinic profiles.
- Provide interfaces to configure working hours, locations, and branding assets.
- Manage the lifecycle states of clinic tenants.

### Business Value
By centralizing clinic operations, the platform ensures that clinical staff work in a configured environment that complies with regional hours and regulations, while guaranteeing multi-tenant data isolation.

---

## 2. Business Objectives

### Problems Solved
- Fragmented clinic settings: Prevents inconsistent configurations of working hours, contact info, and branding.
- Tenant configuration sprawl: centralizes tenant settings to simplify Super Admin audits.
- Operational chaos: Ensures scheduling modules respect clinic working hours.

### Expected Outcomes
- Clinic administrators can self-manage operational metadata without database administrator intervention.
- Super Admins can lock, suspend, or activate clinics from a central registry.
- Clear separation of global system configuration from tenant-specific configurations.

### Success Criteria
- Clinic Owners can update profiles and working hours in less than 2 minutes.
- Tenant status transitions take effect immediately across all active sessions.
- Zero data leakage between clinics.

---

## 3. Actors

### Super Admin
- Platform operator who reviews clinic registrations, validates licenses, and toggles tenant states (Approve, Suspend, Reactivate, Archive).

### Clinic Owner
- The medical professional or entrepreneur who registered the clinic. Has full read-write access to clinic profiles, working hours, branding settings, and administrative contacts.

### Clinic Manager
- An administrator delegated by the Clinic Owner. Can view and modify working hours, contact information, and secondary settings, but cannot delete the clinic profile or change ownership details.

---

## 4. Core Responsibilities

The Clinic Management Module owns the following entities and states:
- **Clinic Profile Metadata**: Official name, registration number, medical license details, tax identifiers, and logo branding.
- **Contact Specifications**: Physical address, geo-coordinates, telephone numbers, emergency contacts, and administrative email.
- **Operational Schedule (Working Hours)**: Active days, daily shift start/end times, lunch break windows, and public holiday exceptions.
- **Tenant Isolation Identifier**: The unique immutable tenant ID associated with all sub-resources.
- **Activation Status State**: The official lifecycle status of the clinic workspace.

---

## 5. Business Rules

- **One Tenant Per Clinic**: A clinic workspace maps exactly to one isolated tenant database boundary. Cross-tenant sharing is strictly forbidden.
- **Verification Gating**: A newly registered clinic remains in a read-only pending state until a Super Admin approves the medical credentials and activation status.
- **Required Profile Fields**: A clinic profile cannot be saved without a validated physical address, official clinic name, tax identifier, and owner designation.
- **Working Hours Constraints**: Clinic working hours must not exceed 24 hours in a single shift, and lunch break intervals must fall within the defined shift start and end parameters.
- **Status Gating**: If a tenant's status is set to SUSPENDED, all active user sessions associated with that tenant ID must be locked immediately.

---

## 6. Module Boundaries

### Owned by This Module
- Clinic metadata profiles.
- Working hour configurations.
- Clinic operational contact parameters.
- Tenant lifecycle state machine execution.

### NOT Owned by This Module
- Individual practitioner schedules (Owned by Staff Module).
- Patient records and appointments (Owned by Scheduling and Patient Modules).
- Billing packages, plans, and transaction processing (Owned by Billing Module).

---

## 7. Clinic Lifecycle

```
Registration [Status: Pending Review]
      ↓
Super Admin Validation
      ↓
Approved [Status: Approved]
      ↓
Clinic Owner Configuration Setup
      ↓
Activated [Status: Active / Operational]
      ↓
(Subscription Term Expired / Compliance Issue)
      ↓
Suspended [Status: Suspended] ➔ Reactivated [Status: Active]
      ↓
Archived [Status: Archived] (Soft-deleted, Read-only Audit Log)
```

---

## 8. High-Level Permissions

- `clinic:profile:read`: Granted to all authenticated staff of the clinic.
- `clinic:profile:write`: Restricted to Clinic Owners and Clinic Managers.
- `clinic:status:write`: Restricted exclusively to Super Admins.
- `clinic:schedule:write`: Restricted to Clinic Owners, Clinic Managers, and authorized administrative staff.

---

## 9. Edge Cases

- **Duplicate Clinic Registrations**: Prevented by enforcing unique indexes on clinic registration numbers and owner email combinations.
- **Suspended Clinic Access**: Active users trying to log in or dispatch requests within a suspended clinic receive a 403 Forbidden response.
- **Mid-Session Suspension**: When a Super Admin suspends a tenant, active JWTs check-ins are invalidated, forcing immediate redirect.
- **Holiday Exceptions**: If a holiday is active, the scheduling module must block patient bookings for that day.

---

## 10. Security Considerations

- **Data Isolation**: All database queries must include a tenant ID filter.
- **Audit Logging**: Any modifications to working hours, payment statuses, or status updates must be logged with the actor's user ID and timestamp.
- **Branding Upload Safety**: Logos must be validated for size and type, and stored in isolated storage paths.

---

## 11. Future Integrations

- **Authentication Module**: Provides the tenant context (`X-Tenant-ID`) validated during login.
- **Staff / Doctor Module**: Reads clinic working hours to restrict individual staff shift patterns.
- **Appointment Booking**: Validates that all appointments fall within the clinic's active working hours.
- **Billing Module**: Restricts clinic features based on active subscription tiers.

---

## 12. Assumptions
- Clinics operate under one primary time zone.
- Clinics have a single physical headquarters for billing and licensing.
- Clinics operate with a maximum of one medical license verification number.

---

## 13. Out of Scope (Version 1)
- Managing multiple branches under a single tenant (multi-branch is V2).
- Automatic geo-routing for patient searches.
- Direct integration with national healthcare registries (e.g. insurance networks).
