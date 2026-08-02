# Platform Control Panel REST API Specification

## Module Overview

This document specifies the complete RESTful API specification for the **Platform Control Panel** (Module-019).

The Platform API is used exclusively by the **Platform Owner** and authorized **Platform Administrators** (`SUPER_ADMIN`, `PLATFORM`). It provides endpoints for clinic onboarding, subscription management, cryptographic license issuance, device registry, global synchronization telemetry monitoring, and infrastructure health. 

**Strict Security Isolation**: Platform API endpoints MUST NEVER return, reference, or expose clinic-owned patient medical records, clinical notes, prescriptions, or file attachments.

---

## API Architectural Principles

1. **Stateless & Idempotent Protocol**: Every administrative mutation request supports idempotency headers (`X-Idempotency-Key`) to prevent duplicate license issuance or device actions.
2. **Mandatory Dual Authentication**: Endpoints require a valid signed JWT Bearer Token and MFA validation (`X-MFA-Token`).
3. **Role-Based Access Control (RBAC)**: Strict role enforcement (`SUPER_ADMIN`, `PLATFORM_OPERATOR`, `AUDITOR`).
4. **Platform Owner Privacy Shield (`PLATFORM_ADMIN_RESTRICTED`)**: HTTP requests using platform admin credentials against clinic business routes (`/api/v1/patients/*`, `/api/v1/medical-records/*`, `/api/v1/sync/*`) are intercepted and rejected with HTTP `403 Forbidden`.
5. **Standardized Response Envelope**: All API responses wrap data in the project's standard JSON envelope (`status`, `data`, `error`, `timestamp`).

---

## Complete API Catalog

### 1. Authentication APIs
- `POST /api/v1/platform/auth/login`: Authenticate administrator credentials; return MFA challenge if enabled.
- `POST /api/v1/platform/auth/mfa`: Verify 6-digit TOTP token and issue JWT Bearer Token.
- `POST /api/v1/platform/auth/refresh`: Exchange valid refresh token for a new JWT Bearer Token.
- `POST /api/v1/platform/auth/logout`: Invalidate current administrator refresh token.

---

### 2. Tenant Management APIs
- `GET /api/v1/platform/tenants`: List all onboarded clinic tenants with filtering, search, and pagination.
- `GET /api/v1/platform/tenants/:tenantId`: Retrieve business metadata for a specific clinic tenant.
- `POST /api/v1/platform/tenants`: Onboard new clinic tenant, auto-provisioning tenant ID, subscription, and initial license key.
- `PATCH /api/v1/platform/tenants/:tenantId`: Update editable tenant information (clinic name, owner email, timezone).
- `POST /api/v1/platform/tenants/:tenantId/suspend`: Suspend tenant access immediately.
- `POST /api/v1/platform/tenants/:tenantId/activate`: Re-activate suspended tenant.

---

### 3. Subscription Management APIs
- `GET /api/v1/platform/subscriptions`: List clinic subscriptions across all tiers.
- `GET /api/v1/platform/subscriptions/:subscriptionId`: Retrieve specific subscription details.
- `PATCH /api/v1/platform/subscriptions/:subscriptionId`: Update subscription limits (Max Devices, Storage Quota).
- `POST /api/v1/platform/subscriptions/:subscriptionId/renew`: Extend subscription expiration date.
- `POST /api/v1/platform/subscriptions/:subscriptionId/upgrade`: Upgrade plan tier (e.g. Professional to Enterprise).
- `POST /api/v1/platform/subscriptions/:subscriptionId/cancel`: Cancel auto-renewal.

---

### 4. License Management APIs
- `GET /api/v1/platform/licenses`: Query licenses by status, tenant, or expiration date.
- `GET /api/v1/platform/licenses/:licenseId`: Retrieve single license metadata.
- `POST /api/v1/platform/licenses`: Issue new 256-bit cryptographically signed license key (`LIC-2026-xxx`).
- `PATCH /api/v1/platform/licenses/:licenseId`: Update device limit or expiration date.
- `POST /api/v1/platform/licenses/:licenseId/activate`: Activate issued license.
- `POST /api/v1/platform/licenses/:licenseId/suspend`: Temporarily suspend license.
- `POST /api/v1/platform/licenses/:licenseId/revoke`: Revoke license key permanently.
- `POST /api/v1/platform/licenses/:licenseId/renew`: Renew license validity period.

---

### 5. Device Management APIs
- `GET /api/v1/platform/devices`: List all registered desktop PCs across clinics.
- `GET /api/v1/platform/devices/:deviceId`: View specific device telemetry and fingerprint hash.
- `POST /api/v1/platform/devices/:deviceId/approve`: Approve pending device registration.
- `POST /api/v1/platform/devices/:deviceId/deactivate`: Deactivate registered desktop device.
- `POST /api/v1/platform/devices/:deviceId/transfer`: Re-assign device to a different clinic room or tenant.
- `GET /api/v1/platform/devices/:deviceId/heartbeat`: Inspect latest heartbeat log.

---

### 6. Synchronization Monitoring APIs
- `GET /api/v1/platform/synchronization`: Global synchronization gateway throughput metrics.
- `GET /api/v1/platform/synchronization/:tenantId`: Inspect sync status and active connections for a tenant.
- `GET /api/v1/platform/synchronization/conflicts`: View global conflict counts across clinics.
- `GET /api/v1/platform/synchronization/failures`: View failed queue items requiring intervention.
- `GET /api/v1/platform/synchronization/health`: Gateway queue and worker node telemetry.

---

### 7. Platform Infrastructure Health APIs
- `GET /api/v1/platform/health`: Aggregate system health overview.
- `GET /api/v1/platform/health/services`: Individual API microservice latency checks.
- `GET /api/v1/platform/health/database`: MongoDB cluster nodes, connection pool, and replica status.
- `GET /api/v1/platform/health/storage`: S3/MinIO disk usage and remaining capacity.
- `GET /api/v1/platform/health/workers`: Background job queue processing speeds.

---

### 8. Platform Notification APIs
- `GET /api/v1/platform/notifications`: List administrator alerts.
- `PATCH /api/v1/platform/notifications/:notificationId/read`: Mark alert as read.
- `POST /api/v1/platform/notifications/:notificationId/archive`: Archive notification.

---

### 9. Platform Administrator APIs
- `GET /api/v1/platform/administrators`: List platform admin accounts.
- `GET /api/v1/platform/administrators/:administratorId`: Admin user details.
- `POST /api/v1/platform/administrators`: Add new platform admin user.
- `PATCH /api/v1/platform/administrators/:administratorId`: Edit admin role or permissions.
- `POST /api/v1/platform/administrators/:administratorId/deactivate`: Deactivate admin account.
- `POST /api/v1/platform/administrators/:administratorId/reset-mfa`: Trigger MFA reset workflow.

---

### 10. Audit & Configuration APIs
- `GET /api/v1/platform/audit`: Search immutable cryptographic audit logs.
- `GET /api/v1/platform/audit/:auditId`: Single audit event details with SHA-256 hash.
- `GET /api/v1/platform/configuration`: Fetch global platform settings.
- `PATCH /api/v1/platform/configuration`: Update maintenance mode, min app version, or announcements.
- `GET /api/v1/platform/features`: List feature flags and tenant rollout scopes.
- `PATCH /api/v1/platform/features/:featureId`: Update feature flag rollout state.

---

## Standard Error Response Catalog

| HTTP Code | Error Code | Description | Automated Recovery Path |
| --- | --- | --- | --- |
| `400` | `INVALID_PAYLOAD` | Request payload schema validation failed | Correct input schema and re-submit. |
| `401` | `MFA_REQUIRED` | Administrator credentials valid but MFA token missing | Present TOTP verification screen. |
| `403` | `PLATFORM_ADMIN_RESTRICTED` | Platform admin attempted clinic patient data access | Reject immediately; log security violation audit. |
| `403` | `INSUFFICIENT_PERMISSIONS` | Role does not possess required privilege | Prompt for Super Admin elevation. |
| `404` | `TENANT_NOT_FOUND` | Specified tenantId does not exist | Verify tenant ID string. |
| `409` | `LICENSE_KEY_EXISTS` | License key collision detected | Re-generate unique 256-bit key. |
| `429` | `PLATFORM_RATE_LIMIT` | Exceeded 1,000 requests / minute quota | Apply backoff delay (10s). |

---

## Security & Multi-Tenant Audit Rules

1. **Mandatory Audit Event Dispatches**: All POST, PATCH, and DELETE operations MUST generate an immutable `PLATFORM_AUDIT_LOG` entry.
2. **Cryptographic Event Signatures**: Audit records contain SHA-256 hash digests of action metadata.
3. **No Direct Business DB Queries**: Platform APIs strictly query the Platform Master MongoDB database.

---

## Future Extension APIs (V2 Roadmap)

- **`POST /api/v1/platform/billing/webhooks`**: Automated Stripe and PayPal subscription payment webhooks.
- **`GET /api/v1/platform/resellers`**: Regional distributor white-label management portal endpoints.
