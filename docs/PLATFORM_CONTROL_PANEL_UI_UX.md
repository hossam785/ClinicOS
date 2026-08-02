# Platform Control Panel UI/UX Design Specification

## Module Overview

This document specifies the complete UI/UX design system, information architecture, component specifications, state catalog, accessibility standards, and interaction models for the **Platform Control Panel** (Module-019).

The user experience follows an **Enterprise SaaS Control Center Paradigm**:
- **Target Audience**: Exclusive to Platform Owners and authorized Platform Administrators (`SUPER_ADMIN`, `PLATFORM`).
- **High-Density Telemetry**: Optimized for monitoring thousands of multi-tenant clinics, cryptographic licenses, active desktop devices, and global infrastructure health.
- **Strict Privacy Shield**: UI components are architected so platform administrators can manage clinic tenant metadata without ever viewing, querying, or exposing patient medical records (`PLATFORM_ADMIN_RESTRICTED`).

---

## Global UX Principles

1. **Operational Visibility**: High-density metric cards, live health badges, and real-time security indicators provide instant platform status awareness.
2. **Minimal Cognitive Load**: Structured card grids, clean tabular views, and progressive disclosure minimize administrative fatigue when managing large clinic fleets.
3. **Fast Navigation**: Top navigation bar command palette (`Ctrl + K`) enables instant cross-tenant search across clinics, licenses, devices, and admin users.
4. **Deterministic Security Controls**: Actions such as Emergency Clinic Lockout, License Revocation, or Device Deactivation require explicit confirmation modals with clear impact warnings.
5. **Zero Emojis Policy**: Visual indicators use curated HSL color pills and approved Lucide React SVG iconography (`ShieldCheck`, `Building2`, `Key`, `Cpu`, `Activity`, `Clock`, `Lock`, `AlertTriangle`, `CheckCircle2`, `Zap`).
6. **Full WCAG 2.1 AA Compliance**: Keyboard navigation, screen reader live regions, high-contrast dark/light modes, and focus trap overlays.

---

## Information Architecture & Navigation Hierarchy

```
[Platform Control Panel Workspace]
├── Global Navigation Sidebar (Expandable / Collapsible)
│   ├── 1. Overview Dashboard (`/platform/dashboard`)
│   ├── 2. Clinic Tenants (`/platform/clinics`)
│   ├── 3. Subscriptions (`/platform/subscriptions`)
│   ├── 4. Licenses (`/platform/licenses`)
│   ├── 5. Registered Devices (`/platform/devices`)
│   ├── 6. Sync Telemetry (`/platform/sync-telemetry`)
│   ├── 7. Platform Health (`/platform/health`)
│   ├── 8. Administrators (`/platform/administrators`)
│   ├── 9. Notifications (`/platform/notifications`)
│   ├── 10. Audit Center (`/platform/audit`)
│   ├── 11. Configuration (`/platform/configuration`)
│   └── 12. Feature Flags (`/platform/features`)
└── Main Content Workspace Area
    ├── Top Navigation Header (Global Command Palette `Ctrl+K`, System Status Pill, Admin Profile)
    └── Active Subsystem View (Metrics, Enterprise Data Tables, Action Modals)
```

---

## Detailed Subsystem UI Specifications

### 1. Dashboard Overview (`/platform/dashboard`)
- **Metric Cards Grid**:
  - Total Clinics: `1,250 Total` (`Building2` icon).
  - Active Clinics: `1,210 Active` (Emerald Badge).
  - Suspended Clinics: `40 Suspended` (Amber Badge).
  - Active Devices: `3,420 Desktop PCs` (`Cpu` icon).
  - Active Licenses Issued: `1,250 Issued` (`Key` icon).
  - Global Sync Health: `99.98% Optimal` (`Activity` icon).
- **Real-Time Health Panel**: API response times (42ms), MongoDB replica set health (`HEALTHY`), Redis cache hit ratio (99.4%), and background worker queue speeds.

---

### 2. Clinic Tenants Directory (`/platform/clinics`)
- **Enterprise Data Table Columns**: `Clinic Name`, `Tenant ID`, `Owner Email`, `Subscription Plan`, `License Key`, `Active Devices`, `Last Sync Time`, `Status`, `Actions`.
- **Status Badges**: `ACTIVE` (Emerald), `TRIAL` (Blue), `SUSPENDED` (Amber), `LOCKOUT` (Rose).
- **Actions**: `View Metadata`, `Edit Subscription`, `Suspend Tenant`, `Emergency Lockout`.
- **Privacy Barrier**: Clicking a clinic displays business details only. No links or tabs exist to access patient medical records (`PLATFORM_ADMIN_RESTRICTED`).

---

### 3. Subscription Management Center (`/platform/subscriptions`)
- **Subscription Cards**: Displays plan tier (`COMMUNITY_FREE`, `PROFESSIONAL_MONTHLY`, `ENTERPRISE_YEARLY`, `LIFETIME_RESERVED`), billing cycle, renewal date, max device limits, and monthly storage quota progress bar.
- **Action Buttons**: `Renew Subscription`, `Upgrade Plan`, `Suspend Tenant`, `Activate Plan`.

---

### 4. Cryptographic License Center (`/platform/licenses`)
- **License Table**: Displays `License Key` (`LIC-2026-xxx`), `Tenant Name`, `Status`, `Activation Date`, `Expiration Date`, `Device Limit`, `Activated Devices`, `Actions`.
- **License Generator Modal**: Form for issuing 256-bit signed license keys with custom device quotas and expiration rules.
- **Actions**: `Activate`, `Suspend`, `Revoke Key`, `Renew Expiration`.

---

### 5. Registered Device Center (`/platform/devices`)
- **Device Table**: Displays `Device Name`, `Tenant Name`, `Fingerprint Hash`, `OS Platform`, `App Version`, `Last Heartbeat`, `Last Sync`, `Status`, `Actions`.
- **Actions**: `Approve Registration`, `Deactivate Device`, `Transfer Tenant`, `Revoke Certificate`.

---

### 6. Synchronization Telemetry Dashboard (`/platform/sync-telemetry`)
- **Live Sync Telemetry Cards**: Online Desktop Devices, Offline Devices (>24h), Failed Synchronization Batches, Unresolved Conflicts Count, Queue Health.
- **Tenant Drill-Down**: Inspect specific clinic sync latency and queue backlogs.

---

### 7. Platform Health & Diagnostics (`/platform/health`)
- **Microservices Health Cards**: API Gateway Latency (42ms), MongoDB Cluster Nodes (Healthy), Storage Cluster (S3/MinIO), Worker Processors, CPU/Memory Gauges.
- **Diagnostic Controls**: `Run Full System Diagnostic Check`.

---

### 8. Administrator Center (`/platform/administrators`)
- **Admin Table**: Displays `Admin Name`, `Email`, `Role` (`SUPER_ADMIN`, `PLATFORM_OPERATOR`, `AUDITOR`), `MFA Status` (`ENABLED`), `Last Login`, `Status`, `Actions`.
- **Actions**: `Create Admin`, `Edit Role`, `Deactivate Account`, `Reset MFA Token`.

---

### 9. Notification Alert Center (`/platform/notifications`)
- **Alert Cards**: Prioritized system alert notifications (`CRITICAL`, `WARNING`, `INFO`).
- **Quick Controls**: `Search`, `Filter by Severity`, `Mark Read`, `Archive`.

---

### 10. Immutable Cryptographic Audit Center (`/platform/audit`)
- **Audit Table**: Displays `Timestamp`, `Administrator`, `Action`, `Entity Type`, `Entity ID`, `Result`, `IP Address`, `SHA-256 Hash Digest`.
- **Integrity Indicator**: Emerald badge confirming hash verification.
- **Export Control**: `Export Cryptographic Audit Log (JSON/CSV)`.

---

### 11. Global Configuration View (`/platform/configuration`)
- **Maintenance Mode Switch**: Global toggle with confirmation modal to pause non-essential background tasks.
- **Version Controls**: Minimum required desktop application version and minimum sync protocol version.
- **Global Announcement**: Banner message broadcast to clinic desktop clients.

---

### 12. Feature Flag Rollout Manager (`/platform/features`)
- **Feature Flag Table**: Displays `Feature Name`, `Status` (`ENABLED`, `DISABLED`, `STAGED`), `Rollout Scope`, `Rollout Percentage`.
- **Staged Rollout Slider**: Slider control to adjust rollout percentage (0% to 100%).

---

## Status Indicators & Color Badges

- `ACTIVE`: Emerald green pill + `CheckCircle2` icon.
- `INACTIVE` / `TRIAL`: Soft blue pill + `Clock` icon.
- `SUSPENDED`: Amber pill + `AlertTriangle` icon.
- `EXPIRED` / `LOCKOUT`: Rose red pill + `Lock` icon.
- `CRITICAL`: Crimson pulse pill + `Zap` icon.

---

## State Catalog (Empty, Loading, Error States)

- **Empty States**: Clean cards with SVG iconography and clear guidance (e.g. *"No registered devices found for this clinic. Devices will appear automatically upon initial registration."*).
- **Loading Skeleton UI**: Shimmering skeleton cards for data tables and metric cards while fetching API telemetry.
- **Error Banners**: High-contrast error banners with explicit recovery instructions (e.g. *"Service gateway connection timed out. Retrying in 10 seconds..."*).

---

## Lucide SVG Iconography Mapping

- Dashboard: `<Building2 className="w-5 h-5 text-primary-500" />`
- Licenses: `<Key className="w-5 h-5 text-amber-500" />`
- Devices: `<Cpu className="w-5 h-5 text-blue-500" />`
- Health: `<Activity className="w-5 h-5 text-emerald-500" />`
- Security / Lockout: `<Lock className="w-5 h-5 text-rose-500" />`
- Audit: `<ShieldCheck className="w-5 h-5 text-purple-500" />`

---

## Accessibility Standards (WCAG 2.1 AA)

- **Global Command Palette**: `Ctrl + K` opens instant search dialog.
- **Keyboard Navigation**: Full tab sequence support across forms, tables, and modal dialogs.
- **Screen Reader live regions**: `aria-live="polite"` announces background telemetry updates without stealing focus.

---

## Future UI Extensions (V2 Roadmap)

- **Automated Stripe/PayPal Billing Dashboard**: Payment transaction feeds and recurring revenue charts.
- **White-Label Reseller Portal**: Regional equipment distributor partition.
- **Global Usage Analytics**: Telemetry charts on daily active clinic staff usage.
