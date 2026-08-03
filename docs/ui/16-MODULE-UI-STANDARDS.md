# ClinicOS Module UI Standards & Consistency Specification

**Version:** 1.0  
**Status:** Official Single Source of Truth  
**Target:** Module UI Standardization, Workspace Consistency & Cross-Module Patterns  

---

## Executive Summary

This document defines the official UI Standards for every functional module in ClinicOS. ClinicOS is feature-complete; every module documented herein exists within the active repository. This specification standardizes visual implementation, table views, form controls, action toolbars, and responsive behaviors across all modules to guarantee that the entire platform operates as a unified, cohesive enterprise SaaS product.

---

## Table of Contents

1. [Governance & Cross-Module Standardization Principles](#governance--cross-module-standardization-principles)
2. [Module UI Specifications](#module-ui-specifications)
   - [1. Authentication Module](#1-authentication-module)
   - [2. Dashboard Module](#2-dashboard-module)
   - [3. Patients Module](#3-patients-module)
   - [4. Doctors Module](#4-doctors-module)
   - [5. Appointments Module](#5-appointments-module)
   - [6. Medical Records Module](#6-medical-records-module)
   - [7. Prescriptions Module](#7-prescriptions-module)
   - [8. Expenses Module](#8-expenses-module)
   - [9. Doctor Financials Module](#9-doctor-financials-module)
   - [10. Notifications Module](#10-notifications-module)
   - [11. Reports & Analytics Module](#11-reports--analytics-module)
   - [12. Audit Logs Module](#12-audit-logs-module)
   - [13. Backup & Restore Module](#13-backup--restore-module)
   - [14. Online Booking Portal Module](#14-online-booking-portal-module)
   - [15. Patient Attachments Module](#15-patient-attachments-module)
   - [16. Offline AI Medical Assistant Module](#16-offline-ai-medical-assistant-module)
   - [17. Synchronization Engine Module](#17-synchronization-engine-module)
   - [18. Platform Control Panel Module](#18-platform-control-panel-module)
   - [19. Localization System Module](#19-localization-system-module)
3. [Cross-Module Interface Matrix](#cross-module-interface-matrix)
4. [Standardization Audit Rules](#standardization-audit-rules)

---

## Governance & Cross-Module Standardization Principles

1. **One Design Language:** Every module must strictly consume primitives from `src/design-system/components/` and token colors from `tokens.css`.
2. **Unified Anatomy:** Every module view must adhere to the 7-tier page structure: `Header → Toolbar → Content → Actions → Footer`.
3. **Strict Non-Functional Scope:** UI standardization must never touch business rules, APIs, database schemas, or routing definitions.

---

## Module UI Specifications

### 1. Authentication Module
- **Views:** `LoginView`, `ForgotPasswordView`, `ResetPasswordView`.
- **Layout:** Centered `AuthLayout` card container (`max-width: 440px`).
- **Standardization:** Password reveal eye toggle icon, inline error alert, auto-role redirection.

### 2. Dashboard Module
- **Views:** Main Clinic Overview Dashboard.
- **Layout:** `DashboardLayout` with responsive KPI stat grid, daily appointment roster, and quick action bar.

### 3. Patients Module
- **Views:** `PatientsDirectoryView`, `PatientProfileView`, `CreatePatientView`, `EditPatientProfileView`.
- **Standardization:** Standardized data table with patient status badges (`ACTIVE`, `INACTIVE`), search filter toolbar, and medical risk flags (`PatientMedicalFlags`).

### 4. Doctors Module
- **Views:** `DoctorsDirectoryView`, `DoctorProfileView`, `DoctorScheduleView`, `DoctorShiftTable`, `DoctorFeesView`.
- **Standardization:** Doctor card grid + shift schedule data tables with status pills.

### 5. Appointments Module
- **Views:** `AppointmentsDirectoryView`, `AppointmentDetailsView`, `CreateAppointmentView`, `EditAppointmentView`, `DailyQueueRosterView`.
- **Standardization:** Real-time queue status indicators (`WAITING`, `IN_CONSULTATION`, `COMPLETED`, `CANCELLED`), sticky date filter bar.

### 6. Medical Records Module
- **Views:** `MedicalRecordsDirectoryView`, `MedicalRecordDetailsView`, `CreateMedicalRecordView`, `EditMedicalRecordView`, `LockedRecordView`.
- **Standardization:** Lock icon indicators for finalized clinical records, tabbed clinical note sections.

### 7. Prescriptions Module
- **Views:** Prescription Editor & Directory Views.
- **Standardization:** Dosage input grid with auto-calculating medication line items and print/export action toolbar.

### 8. Expenses Module
- **Views:** Clinic Expense Directory & Summary Views.
- **Standardization:** Categorized financial tables, date-range picker filters, and total summary KPI widgets.

### 9. Doctor Financials Module
- **Views:** Doctor Earnings & Revenue Share Settlement Views.
- **Standardization:** Settlement calculation card, doctor selection dropdown, and payout history data grid.

### 10. Notifications Module
- **Views:** System & Clinic Notification Feed View.
- **Standardization:** Priority badges (`CRITICAL`, `WARNING`, `INFO`), mark-all-as-read action bar, empty feed state.

### 11. Reports & Analytics Module
- **Views:** `ReportHistoryView`, Analytics Workspace Views.
- **Standardization:** Chart container cards (`height: 320px`), date range filter bar, export CSV/PDF toolbar.

### 12. Audit Logs Module
- **Views:** Immutable Audit Log Review Views (`PatientAuditReviewView`, `AppointmentAuditReviewView`).
- **Standardization:** SHA-256 event hash column, admin IP address label, security action filter dropdown.

### 13. Backup & Restore Module
- **Views:** Backup Management Dashboard (`BackupLogTable`, `BackupDetailsModal`).
- **Standardization:** Database snapshot status pills (`COMPLETED`, `FAILED`, `IN_PROGRESS`), one-click manual backup trigger, restore confirmation modal.

### 14. Online Booking Portal Module
- **Views:** Patient Booking Portal Public Views (`PublicHeroBanner`, `DashboardPortalFaqView`).
- **Standardization:** Clean public layout, doctor selection grid, time slot selector cards.

### 15. Patient Attachments Module
- **Views:** Attachment Directory View (`AttachmentFilterBar`).
- **Standardization:** Document thumbnail grid/table, file size badge, upload drawer modal.

### 16. Offline AI Medical Assistant Module
- **Views:** `AIAssistantWorkspaceView` (`AISourceReferencePills`).
- **Standardization:** Dual-pane split view (Chat thread left, medical source reference sidebar right), streaming message indicator.

### 17. Synchronization Engine Module
- **Views:** `SyncCenterWorkspaceView` (`SyncQueueMonitor`).
- **Standardization:** Gateway telemetry status cards (`OPTIMAL`, `DEGRADED`), queue item monitor table, manual force sync trigger button.

### 18. Platform Control Panel Module
- **Views:** `PlatformControlWorkspaceView` (12 Sub-Tabs).
- **Standardization:** Standalone dark glassmorphic LTR layout, 6-card metric header, glowing blue active tab bar, clinic tenant directory table.

### 19. Localization System Module
- **Views:** Language Preference Bar & Locale Selectors.
- **Standardization:** Seamless RTL/LTR direction switching, font stack swap, translation cache indicator.

---

## Cross-Module Interface Matrix

| Feature Pattern | Patients | Appointments | Medical Records | Platform Control | Sync Engine |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Search Toolbar** | Standard Top Bar | Sticky Date Filter | Patient ID Filter | Global Search | Telemetry Filter |
| **Data View** | Table / Cards | Roster / Table | Clinical Cards | Standalone Table | Real-time Grid |
| **Primary Action** | + Add Patient | + New Booking | + Create Record | Onboard Clinic | Force Gateway Sync |
| **Status Display** | Green/Red Pill | Waiting/Done Pill| Locked Lock Icon | Active/Suspended | Optimal Green Dot |

---

## Standardization Audit Rules

1. Every module MUST consume design tokens from `tokens.css`.
2. Tables across all modules MUST feature sticky headers and row hover highlights.
3. Every module MUST implement zero-data `<EmptyState />` and `<Skeleton />` loading states.
