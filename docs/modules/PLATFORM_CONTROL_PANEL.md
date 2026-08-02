# Platform Control Panel Business Requirements Analysis

## Module Overview

This document specifies the complete functional and business requirements for the **Platform Control Panel** (Module-019).

The Platform Control Panel is the centralized administration platform used exclusively by the **Platform Owner** and authorized **Platform Administrators** (`SUPER_ADMIN`, `PLATFORM`). It is completely separate from clinic operational dashboards (`CLINIC_ADMIN`, `DOCTOR`, `RECEPTIONIST`).

---

## Core Architectural Principles

1. **Multi-Tenant SaaS Management**: Managing thousands of clinic tenants, licenses, subscriptions, and registered desktop devices from a unified cloud gateway.
2. **Platform Owner Privacy Isolation (`PLATFORM_ADMIN_RESTRICTED`)**: Platform administrators are strictly forbidden from viewing, browsing, or querying clinic-owned patient medical records, clinical notes, prescriptions, file attachments, and AI sessions.
3. **100% Immutable Audit Trail**: Every action performed by a platform administrator generates an immutable cryptographic audit event log (`PLATFORM_AUDIT_LOG`).
4. **License-Bound Device Autonomy**: Clinic desktop devices require a valid, active license key and device certificate to initialize synchronization.
5. **Zero Emojis & Enterprise Aesthetics**: Strict adherence to curated HSL color systems, structured layouts, and approved SVG iconography (`ShieldCheck`, `Building2`, `Key`, `Cpu`, `Activity`, `Clock`, `Lock`).

---

## Subsystem Functional Requirements

### 1. Clinic Tenant Management
- Onboard new clinic tenants with owner credentials, business details, and contact info.
- Manage clinic tenant status (`ACTIVE`, `SUSPENDED`, `TRIAL`, `EXPIRED`).
- View aggregated clinic telemetry (Total Patients Count, Total Appointments Count, Active Staff Count) without accessing underlying clinical record contents.
- Instant suspension tool for overdue subscriptions or compliance violations.

---

### 2. Subscription Management
- Support subscription tiers (`COMMUNITY_FREE`, `PROFESSIONAL_MONTHLY`, `ENTERPRISE_YEARLY`, `LIFETIME_RESERVED`).
- Track trial expiration dates, auto-renewal schedules, payment status, and feature entitlements.
- Enforce tenant limits (Max Doctors, Max Registered Devices, Monthly Storage Quota).

---

### 3. Device & Registration Management
- Track registered desktop application instances across all clinics (`deviceId`, `deviceFingerprint`, `osPlatform`, `appVersion`).
- Enforce device quota limits per clinic (e.g. 5 desktop PCs per clinic license).
- Instant device revocation tool for lost, stolen, or compromised clinic hardware.

---

### 4. License Management
- Generate 256-bit cryptographically signed license keys (`LIC-2026-CLINICOS-ENTERPRISE-xxxx`).
- Manage license lifecycle (`DRAFT`, `ISSUED`, `ACTIVE`, `SUSPENDED`, `EXPIRED`, `REVOKED`).
- Automated license renewal workflows and grace period configurations (7 days grace).

---

### 5. Synchronization Engine Telemetry
- Real-time global dashboard monitoring sync gateway throughput, active desktop connections, and sequence vectors.
- Telemetry metrics: Active Sync Sessions, Pending Outgoing Queue Items, Unresolved Conflicts Count, Failed Queue Retries.
- Highlighting clinics with stalled synchronization (>24 hours offline).

---

### 6. Platform Health & Infrastructure Telemetry
- Real-time monitoring of cloud API latency, MongoDB cluster health, Redis cache utilization, and background worker queues.
- Automated alert triggers when gateway API latency exceeds 500ms or storage exceeds 85% capacity.

---

### 7. Platform User & Access Management
- Manage platform administrator accounts, RBAC roles (`SUPER_ADMIN`, `PLATFORM_OPERATOR`, `AUDITOR`), and Mandated Two-Factor Authentication (MFA).
- IP Whitelisting for platform control panel access.

---

### 8. Platform Audit & Compliance Center
- Immutable logging of all administrative actions (Clinic Suspension, License Issuance, Device Revocation, Configuration Changes).
- Cryptographic hash verification to guarantee audit log tamper-resistance.

---

### 9. Platform Notification & Security Alerts
- Real-time system notifications for critical platform events (License Expiration, Security Barrier Attempt, Infrastructure Outage).

---

## Business Rules & Security Isolation

1. **Patient Privacy Shield (`PLATFORM_ADMIN_RESTRICTED`)**:
   - Any HTTP request originating from a `SUPER_ADMIN` or `PLATFORM` token attempting to access patient medical records (`/api/v1/patients/*`, `/api/v1/medical-records/*`, `/api/v1/sync/*`) MUST return HTTP `403 Forbidden` (`PLATFORM_ADMIN_RESTRICTED`).
2. **Device Registration Rule**:
   - A desktop device cannot register without a valid, unexpired clinic license key and matching device fingerprint.
3. **Audit Non-Bypassability**:
   - Platform administration endpoints cannot execute mutations without dispatching a corresponding `PLATFORM_AUDIT_LOG` entry.

---

## Future Roadmap (V2 Extensions)

- **Automated Stripe/PayPal Billing Gateway Integration**: Self-service subscription renewal and automated invoice generation.
- **SMS & Email Gateway Aggregator**: Centralized SMS quota management for appointment reminder dispatches.
- **Reseller & Franchise Sub-Panels**: White-label management portals for regional medical equipment distributors.
