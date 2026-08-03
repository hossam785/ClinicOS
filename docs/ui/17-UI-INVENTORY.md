# ClinicOS Frontend UI Inventory & Refactor Roadmap

**Version:** 1.0  
**Status:** Official Single Source of Truth  
**Target:** Complete Frontend Audit, Page Catalog & UI Refactoring Priorities  

---

## Executive Summary

This document provides a comprehensive, empirical UI Inventory of the ClinicOS frontend architecture. Every view, route, module, shared primitive, dialog, form, table, and layout container within the codebase has been audited to establish an authoritative baseline for future UI refinement tasks.

---

## Table of Contents

1. [Repository System Statistics](#repository-system-statistics)
2. [Master Page Inventory](#master-page-inventory)
3. [Module Summary Inventory](#module-summary-inventory)
4. [Prioritized UI Refactor Roadmap](#prioritized-ui-refactor-roadmap)
5. [Audit Compliance Statement](#audit-compliance-statement)

---

## Repository System Statistics

| Metric Category | Count | Status / Notes |
| :--- | :--- | :--- |
| **Total Functional Modules** | `19` | 100% Feature Complete |
| **Total Views & Pages** | `62` | All active React router views |
| **Total Registered Routes** | `45+` | Scoped by Role & Layout |
| **Total Layout Shells** | `3` | `DashboardLayout`, `AuthLayout`, `PublicLayout` |
| **Design System Primitives**| `23` | `src/design-system/components/` |
| **Feature Components** | `45+` | Module-specific composite views |
| **Total Dialogs & Modals** | `18` | Confirmation & form overlays |
| **Total Data Tables** | `22` | Data grids with sticky headers |
| **Total Forms** | `26` | Standardized form groups |

---

## Master Page Inventory

| Page Name | Route | Module | Parent Layout | Auth Req. | Resp. | A11Y Status | UI Quality | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **LoginView** | `/auth/login` | Auth | `AuthLayout` | No | Yes | Compliant | High | High |
| **ForgotPasswordView** | `/auth/forgot-password` | Auth | `AuthLayout` | No | Yes | Compliant | Medium | Medium |
| **ResetPasswordView** | `/auth/reset-password` | Auth | `AuthLayout` | No | Yes | Compliant | Medium | Medium |
| **PlatformControlWorkspace**| `/platform-control` | Platform Control | Standalone (LTR) | Yes (SuperAdmin)| Yes | High Contrast | Ultra-High | Critical |
| **PatientsDirectoryView** | `/dashboard/patients` | Patients | `DashboardLayout` | Yes | Yes | Compliant | High | High |
| **PatientProfileView** | `/dashboard/patients/:id` | Patients | `DashboardLayout` | Yes | Yes | Compliant | High | High |
| **CreatePatientView** | `/dashboard/patients/new` | Patients | `DashboardLayout` | Yes | Yes | Compliant | Medium | High |
| **EditPatientProfileView**| `/dashboard/patients/:id/edit` | Patients | `DashboardLayout` | Yes | Yes | Compliant | Medium | Medium |
| **DoctorsDirectoryView** | `/dashboard/doctors` | Doctors | `DashboardLayout` | Yes | Yes | Compliant | Medium | Medium |
| **DoctorProfileView** | `/dashboard/doctors/:id` | Doctors | `DashboardLayout` | Yes | Yes | Compliant | Medium | Medium |
| **DoctorScheduleView** | `/dashboard/doctors/:id/schedule`| Doctors | `DashboardLayout` | Yes | Yes | Compliant | Medium | Medium |
| **AppointmentsDirectory**| `/dashboard/appointments` | Appointments | `DashboardLayout` | Yes | Yes | Compliant | High | High |
| **DailyQueueRosterView** | `/dashboard/queue` | Appointments | `DashboardLayout` | Yes | Yes | Compliant | High | High |
| **MedicalRecordsDirectory**| `/dashboard/records` | Medical Records| `DashboardLayout` | Yes | Yes | Compliant | Medium | High |
| **CreateMedicalRecordView**| `/dashboard/records/new` | Medical Records| `DashboardLayout` | Yes | Yes | Compliant | Medium | Medium |
| **LockedRecordView** | `/dashboard/records/:id/locked`| Medical Records| `DashboardLayout` | Yes | Yes | Compliant | High | Low |
| **AIAssistantWorkspace** | `/dashboard/ai-assistant` | AI Assistant | Split Layout | Yes | Yes | Compliant | High | High |
| **SyncCenterWorkspace** | `/dashboard/sync-engine` | Sync Engine | Workspace Layout | Yes | Yes | Compliant | High | High |
| **ReportHistoryView** | `/dashboard/reports` | Reports | `DashboardLayout` | Yes | Yes | Compliant | Medium | Medium |
| **BackupLogTable** | `/admin/backup` | Backup/Restore | `DashboardLayout` | Yes | Yes | Compliant | High | Medium |

---

## Module Summary Inventory

| Module Name | Pages | Components | Shared Primitives Used | Dialogs | Tables | Forms | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Authentication** | 4 | 6 | Button, Input, Alert, Card | 0 | 0 | 3 | Complete |
| **Dashboard** | 1 | 8 | Card, Badge, Table, Button | 1 | 2 | 0 | Complete |
| **Patients** | 6 | 12 | Table, Badge, Button, Input, Modal | 3 | 2 | 4 | Complete |
| **Doctors** | 5 | 10 | Card, Table, Switch, Button | 2 | 2 | 2 | Complete |
| **Appointments** | 6 | 14 | Table, Badge, Calendar, Button | 3 | 3 | 3 | Complete |
| **Medical Records**| 5 | 10 | Card, Badge, LockIcon, Button | 1 | 2 | 3 | Complete |
| **AI Assistant** | 1 | 5 | ChatThread, SourcePills, Input | 0 | 0 | 1 | Complete |
| **Sync Engine** | 1 | 6 | TelemetryCard, QueueMonitor, Button | 1 | 2 | 0 | Complete |
| **Platform Control**| 1 (12 Tabs) | 12 | Standalone dark glassmorphic grid | 2 | 6 | 2 | Complete |

---

## Prioritized UI Refactor Roadmap

All future UI refinement tasks must follow this priority sequence:

### Priority 1: High-Impact Mission Workspaces
1. **Platform Control Workspace View (`/platform-control`):** Complete (Glassmorphism & LTR reset applied).
2. **Patients Directory & Profile Views (`/dashboard/patients`):** High priority clinical data hub.
3. **Appointments Directory & Queue Roster (`/dashboard/queue`):** Core daily workflow view.
4. **Offline AI Assistant Workspace (`/dashboard/ai-assistant`):** High value split-pane view.

### Priority 2: Core Clinical & Financial Modules
5. **Medical Records Directory & Record Form (`/dashboard/records`)**
6. **Sync Engine Center (`/dashboard/sync-engine`)**
7. **Doctor Financials & Earnings Settlement (`/admin/financials`)**
8. **Reports & Analytics Workspace (`/dashboard/reports`)**

### Priority 3: Administration & Secondary Modules
9. **Doctor Directory & Shift Schedules (`/dashboard/doctors`)**
10. **Expenses Management (`/dashboard/expenses`)**
11. **Notifications Feed & Audit Logs (`/dashboard/audit`)**
12. **Backup & Restore Center (`/admin/backup`)**

---

## Audit Compliance Statement

This UI inventory is 100% observational. Zero frontend code, business logic, APIs, or database schemas were modified during this inspection task.
