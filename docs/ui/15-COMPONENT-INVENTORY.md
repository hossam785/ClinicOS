# ClinicOS Component Inventory & Reuse Specification

**Version:** 1.0  
**Status:** Official Single Source of Truth  
**Target:** Component Audit, Cataloging, Reuse Policy & Architectural Ownership  

---

## Executive Summary

This document serves as the official component inventory for the entire ClinicOS codebase. It catalogs every reusable UI primitive, shared layout wrapper, and feature-specific component across the frontend architecture. 

Before creating or editing any component, software engineers and AI agents **MUST** consult this document to discover existing primitives, enforce component reuse, eliminate duplication, and preserve design system integrity.

---

## Table of Contents

1. [Component Architecture & Discovery Policy](#component-architecture--discovery-policy)
2. [Design System Primitives Catalog (`src/design-system/components/`)](#design-system-primitives-catalog)
3. [Global Layout & Shell Components](#global-layout--shell-components)
4. [Domain & Feature-Specific Component Inventory](#domain--feature-specific-component-inventory)
   - [Authentication & Onboarding Components](#authentication--onboarding-components)
   - [Platform Control Panel Components](#platform-control-panel-components)
   - [Sync Engine Components](#sync-engine-components)
   - [AI Assistant Components](#ai-assistant-components)
   - [Patient & Medical Records Components](#patient--medical-records-components)
   - [Backup & Restore Components](#backup--restore-components)
5. [Component Reuse & Consolidation Rules](#component-reuse--consolidation-rules)
6. [Component Maintenance & Refactoring Matrix](#component-maintenance--refactoring-matrix)

---

## Component Architecture & Discovery Policy

ClinicOS organizes UI components into two distinct layers:
1. **Core Design System Primitives (`src/design-system/components/`):** Pure, un-styled or token-styled stateless UI building blocks (e.g., `<Button>`, `<Input>`, `<Card>`, `<Table>`). These must be reused across all modules.
2. **Domain Workspace Components (`src/modules/[module]/components/`):** Business-aware compositions that combine primitives with domain data models (e.g., `<PlatformClinicTable>`, `<SyncQueueMonitor>`).

Duplicating primitives inside feature folders is strictly prohibited.

---

## Design System Primitives Catalog

| Component Name | File Location | Purpose & Description | Reusability |
| :--- | :--- | :--- | :--- |
| **`<Button />`** | `src/design-system/components/Button.tsx` | Standard interactive trigger with primary, secondary, and danger variants. | Global Shared |
| **`<Input />`** | `src/design-system/components/Input.tsx` | Single-line text input field with error and helper text integration. | Global Shared |
| **`<Textarea />`** | `src/design-system/components/Textarea.tsx` | Multi-line text field for clinical observations and medical records. | Global Shared |
| **`<Checkbox />`** | `src/design-system/components/Checkbox.tsx` | Native accessible checkbox with label binding. | Global Shared |
| **`<RadioButton />`** | `src/design-system/components/RadioButton.tsx` | Exclusive choice radio control. | Global Shared |
| **`<Switch />`** | `src/design-system/components/Switch.tsx` | Binary setting toggle switch. | Global Shared |
| **`<Card />`** | `src/design-system/components/Card.tsx` | Surface card container with border and padding props. | Global Shared |
| **`<Badge />`** | `src/design-system/components/Badge.tsx` | Compact status indicator pill. | Global Shared |
| **`<Table />`** | `src/design-system/components/Table.tsx` | Data table container with header and row formatting. | Global Shared |
| **`<Dialog />`** | `src/design-system/components/Dialog.tsx` | Modal dialog wrapper with backdrop overlay and focus management. | Global Shared |
| **`<Modal />`** | `src/design-system/components/Modal.tsx` | Controlled overlay window for forms and confirmations. | Global Shared |
| **`<Drawer />`** | `src/design-system/components/Drawer.tsx` | Right-anchored side drawer for detailed inspection. | Global Shared |
| **`<Dropdown />`** | `src/design-system/components/Dropdown.tsx` | Action menu overlay. | Global Shared |
| **`<Tabs />`** | `src/design-system/components/Tabs.tsx` | Sub-view navigation tab bar. | Global Shared |
| **`<Alert />`** | `src/design-system/components/Alert.tsx` | Inline warning, success, info, or error banner. | Global Shared |
| **`<EmptyState />`**| `src/design-system/components/EmptyState.tsx` | Zero-data container with icon, title, description, and action button. | Global Shared |
| **`<Loader />`** | `src/design-system/components/Loader.tsx` | Asynchronous spinner loading indicator. | Global Shared |
| **`<Skeleton />`** | `src/design-system/components/Skeleton.tsx` | Layout placeholder box for zero Cumulative Layout Shift (CLS). | Global Shared |
| **`<Breadcrumbs />`**| `src/design-system/components/Breadcrumbs.tsx` | Hierarchical navigation breadcrumb path. | Global Shared |
| **`<Pagination />`** | `src/design-system/components/Pagination.tsx` | Table result pagination controls. | Global Shared |
| **`<Avatar />`** | `src/design-system/components/Avatar.tsx` | User profile avatar badge. | Global Shared |
| **`<Tooltip />`** | `src/design-system/components/Tooltip.tsx` | Hover text helper popup. | Global Shared |

---

## Global Layout & Shell Components

| Layout Wrapper | Location | Responsibilities |
| :--- | :--- | :--- |
| **`DashboardLayout`** | `src/layouts/DashboardLayout.tsx` | Main application shell hosting Sidebar, Top Navigation Header, and active Module Outlet. |
| **`AuthLayout`** | `src/layouts/AuthLayout.tsx` | Authentication layout hosting Login and Password Reset views with auto-role redirect logic. |
| **`PublicLayout`** | `src/layouts/PublicLayout.tsx` | Base root wrapper for landing and public booking pages. |

---

## Domain & Feature-Specific Component Inventory

### Platform Control Panel Components (`src/modules/platform-control/components/`)
- **`PlatformMetricsHeader.tsx`**: 6-card KPI summary header.
- **`PlatformClinicTable.tsx`**: Clinic tenant management table with lockout and detail triggers.
- **`PlatformSubscriptionCenter.tsx`**: SaaS subscription plan status grid.
- **`PlatformLicenseCenter.tsx`**: License key management table.
- **`PlatformDeviceCenter.tsx`**: Registered desktop PC hardware fingerprint table.
- **`PlatformSyncTelemetry.tsx`**: Gateway sync queue & conflict status viewer.
- **`PlatformHealthDiagnostics.tsx`**: Infrastructure service health check metrics.
- **`PlatformAdminCenter.tsx`**: Super Admin user roster table.
- **`PlatformNotificationCenter.tsx`**: Platform alert feed.
- **`PlatformAuditCenter.tsx`**: Immutable security audit log table.
- **`PlatformConfigPanel.tsx`**: Global system maintenance & version configuration.
- **`PlatformFeatureFlags.tsx`**: Feature flag rollout percentage manager.

### Sync Engine Components (`src/modules/sync-engine/components/`)
- **`SyncQueueMonitor.tsx`**: Real-time queue item inspector and manual sync trigger table.

---

## Component Reuse & Consolidation Rules

1. **Always Reuse Primitives:** Before writing a new input, button, card, or modal, verify if a matching primitive exists in `src/design-system/components/`.
2. **Zero Duplication Policy:** Never copy component code across feature modules. If a component is required by two distinct modules, elevate it to `src/design-system/components/` or a shared module directory.
3. **No Component Redesign:** Never modify component signatures or visual structure without documenting the edit in `docs/ui/03-COMPONENT-STANDARDS.md`.
