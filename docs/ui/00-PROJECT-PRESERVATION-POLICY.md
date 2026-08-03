# ClinicOS Project Preservation Policy

**Version:** 1.0  
**Status:** Mandatory Overriding Governance Specification  
**Priority:** Level 0 (Highest - Overrides all assumptions and instructions)  

---

## Executive Summary

This document constitutes the highest-priority governance specification for every UI/UX refinement task within ClinicOS. Every AI agent, software engineer, reviewer, and contributor **MUST** strictly comply with the policies defined herein before reading or modifying any user interface code.

The existing ClinicOS codebase is the sole authoritative source of truth. ClinicOS is **not** being redesigned, rebuilt, or re-architected.

---

## Table of Contents

1. [Core Preservation Principle](#core-preservation-principle)
2. [Mandatory Policy Definitions](#mandatory-policy-definitions)
   - [Policy 1: Project Preservation Policy](#policy-1-project-preservation-policy)
   - [Policy 2: No Default Values Policy](#policy-2-no-default-values-policy)
   - [Policy 3: No Feature Policy](#policy-3-no-feature-policy)
   - [Policy 4: No Architecture Policy](#policy-4-no-architecture-policy)
   - [Policy 5: No UI Redesign Policy](#policy-5-no-ui-redesign-policy)
   - [Policy 6: Source of Truth Policy](#policy-6-source-of-truth-policy)
   - [Policy 7: Strict Refinement Scope Policy](#policy-7-strict-refinement-scope-policy)
3. [Governance Audit & Enforcement](#governance-audit--enforcement)

---

## Core Preservation Principle

ClinicOS is an active, feature-complete enterprise SaaS platform. All modules, backend microservices, database schemas, permissions, authentication routines, business rules, and UI workflows are fully implemented.

This phase is **EXCLUSIVELY** dedicated to visual and usability refinement. We polish what exists — we never reinvent.

---

## Mandatory Policy Definitions

### Policy 1: Project Preservation Policy
The existing ClinicOS repository is the ONLY source of truth. The existing implementation must always be respected. Everything that already exists must be preserved unless explicit governance instruction orders a bug fix.

### Policy 2: No Default Values Policy
The AI agent and developers **MUST NEVER**:
- Invent arbitrary default values.
- Assume missing configuration values.
- Generate placeholder or hardcoded dummy data.
- Create temporary or mock fallbacks inside production code.
- Guess application or domain behavior.

If any implementation detail is missing:
1. Inspect the codebase thoroughly.
2. Reuse existing definitions.
3. If non-existent, report and document it as missing — **do not invent it**.

### Policy 3: No Feature Policy
Under no circumstances shall any contributor:
- Add new features or product capabilities.
- Remove existing features or interactive controls.
- Replace, merge, or split existing features.
- Expand or reduce functional scope.

### Policy 4: No Architecture Policy
Under no circumstances shall any contributor:
- Change application or module architecture.
- Modify routing definitions or URL patterns.
- Alter authentication routines, JWT rules, or authorization scoping.
- Touch backend services, controllers, or database schemas.
- Change business logic, domain models, or workflow logic.
- Rename modules, routes, or established components.

### Policy 5: No UI Redesign Policy
This project is **NOT** a redesign effort. Contributors MUST NOT:
- Invent a new visual design language.
- Apply generic external dashboard templates.
- Replace core page layouts, navigation bars, or sidebars.
- Replace user interaction patterns.

### Policy 6: Source of Truth Policy
Every recommendation and implementation MUST originate directly from the active ClinicOS codebase. Contributors MUST NOT pull inspiration or code patterns from:
- Personal aesthetic preferences.
- Unapproved external SaaS examples.
- Third-party template kits (Material UI, generic Tailwind presets, etc.).
- External design showcases (Dribbble, Behance, etc.).

If a component or utility does not exist in ClinicOS, report it as missing rather than introducing unvetted external patterns.

### Policy 7: Strict Refinement Scope Policy
Refinement is strictly bounded to the following allowable improvements ONLY:
- Visual consistency & contrast optimization.
- Grid spacing, padding, and margin alignment.
- Typography scale adherence & hierarchy.
- Color token standardization.
- Accessibility & keyboard focus navigation.
- Screen responsiveness across standard breakpoints.
- Component state presentation (Loading, Empty, Error).
- Micro-interactions & transition polish.

---

## Governance Audit & Enforcement

Any code submission or modification that violates any of the 7 policies defined in this document shall be immediately rejected during review. Compliance is absolute.
