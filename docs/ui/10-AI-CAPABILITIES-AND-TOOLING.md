# ClinicOS AI Capabilities & Tooling Protocol

**Version:** 1.0  
**Status:** Mandatory AI Agent Engineering Specification  
**Target:** AI Code Intelligence, Inspection Protocols & Quality Assurance  

---

## Executive Summary

This document defines the mandatory operating protocol for AI agents (and human contributors) working on ClinicOS. The mission of any AI agent contributing to ClinicOS is to maximize the quality, safety, and visual precision of its work by exhausting all available repository inspection tooling, code intelligence features, static analysis, and documentation checks BEFORE proposing or executing any UI modification.

Assumptions, unverified guesses, or generic fallback implementations are strictly forbidden.

---

## Table of Contents

1. [Purpose & Core Mission](#purpose--core-mission)
2. [Repository First Policy](#repository-first-policy)
3. [Mandatory AI Tooling & Intelligence Protocols](#mandatory-ai-tooling--intelligence-protocols)
4. [Inspection Before Modification Workflow](#inspection-before-modification-workflow)
5. [Mandatory UI Documentation Priority Sequence](#mandatory-ui-documentation-priority-sequence)
6. [No Assumptions & Ground Truth Enforcement](#no-assumptions--ground-truth-enforcement)
7. [Pre-Commit Review & Verification Protocol](#pre-commit-review--verification-protocol)
8. [Critical Enforcement Rules](#critical-enforcement-rules)

---

## Purpose & Core Mission

The AI agent's mission in ClinicOS is to operate as a principal frontend software architect with 100% empirical knowledge of the codebase. The AI must never invent default values, guess component signatures, or introduce external unvetted patterns. Every action must be grounded in real repository evidence.

---

## Repository First Policy

The existing ClinicOS repository is the sole authoritative ground truth. Before suggesting or implementing any UI refactoring, the AI agent **MUST** explicitly inspect and understand:

1. **Layout Shells & Routes:** `src/layouts/`, `src/App.tsx`, module route manifests.
2. **Design System Components:** `src/design-system/components/` primitives.
3. **Tokens & Global Styles:** `src/design-system/styles/tokens.css`, `src/index.css`.
4. **Active Hooks & State:** Custom hooks, contexts, and state boundaries.
5. **Existing UI Patterns:** Typography scales, spatial gaps, dark/light theme behavior, and accessibility trees.

---

## Mandatory AI Tooling & Intelligence Protocols

AI agents MUST actively leverage all available system capabilities whenever performing a task:

- **Grep & File Search:** Search exact symbol usages, class occurrences, or token variables across all workspace files before editing.
- **File Inspection:** View complete, un-truncated target files to verify parent layout context, import declarations, and prop types.
- **Directory Analysis:** Audit subdirectories to discover pre-existing utility classes or shared primitives before crafting custom styles.
- **Build & Compiler Validation:** Run build commands (`npm run build`) to verify TypeScript type-checking and compiler health post-modification.
- **Git History & Log Analysis:** Inspect commit messages or system error tracebacks to diagnose runtime issues accurately.

---

## Inspection Before Modification Workflow

For any UI refactoring task, the AI agent must execute this sequential workflow:

```
┌─────────────────────────────────────────────────────────┐
│ Step 1: Read UI Governance Specs (00 to 09 Docs)        │
├─────────────────────────────────────────────────────────┤
│ Step 2: Search Repository for Target Symbols & Routes   │
├─────────────────────────────────────────────────────────┤
│ Step 3: Inspect Full Target & Dependency Files          │
├─────────────────────────────────────────────────────────┤
│ Step 4: Validate Design Token & Responsive Rules        │
├─────────────────────────────────────────────────────────┤
│ Step 5: Perform Minimal Precision Edit (No logic change)│
├─────────────────────────────────────────────────────────┤
│ Step 6: Run Build Verification & Check Zero Regressions │
└─────────────────────────────────────────────────────────┘
```

---

## Mandatory UI Documentation Priority Sequence

Before modifying any user interface element, the AI agent **MUST** read and obey the governance documents in this exact order:

1. `docs/ui/00-PROJECT-PRESERVATION-POLICY.md` *(Overriding Policy)*
2. `docs/ui/01-DESIGN-PRINCIPLES.md` *(20 Design Principles)*
3. `docs/ui/02-UI-RULES.md` *(Allowed vs. Forbidden Rules)*
4. `docs/ui/03-COMPONENT-STANDARDS.md` *(Component Specifications)*
5. `docs/ui/04-LAYOUT-STANDARDS.md` *(Anatomy & Grid Breakpoints)*
6. `docs/ui/05-TYPOGRAPHY-STANDARDS.md` *(Type Scale & Fonts)*
7. `docs/ui/06-SPACING-SYSTEM.md` *(Spacing Scale & Margins)*
8. `docs/ui/07-COLOR-SYSTEM.md` *(Semantic Palette & Contrast)*
9. `docs/ui/08-ICONOGRAPHY.md` *(Icon Library & Sizing)*
10. `docs/ui/09-ACCESSIBILITY-STANDARDS.md` *(WCAG AA Standards)*

Skipping doc inspection constitutes a direct documentation protocol violation.

---

## No Assumptions & Ground Truth Enforcement

1. **No Guessing:** Never guess API prop structures, variable names, or CSS utility classes.
2. **No Fallback Data:** Never introduce fake inline mock data or placeholder values.
3. **No External Injection:** Never copy generic dashboard templates or non-ClinicOS UI patterns.

---

## Pre-Commit Review & Verification Protocol

Prior to marking any UI task as complete, the AI agent must perform a multi-point verification:

- [ ] Has the full codebase build succeeded cleanly (`npm run build`)?
- [ ] Are all business rules, backend routes, APIs, and permissions untouched?
- [ ] Do spacing, color, typography, and layout adhere 100% to governance documents?
- [ ] Is keyboard accessibility and WCAG AA contrast maintained?
- [ ] Does the UI render cleanly across all supported breakpoints (`360px` to `1920px+`)?

---

## Critical Enforcement Rules

1. **Exhaust Tooling:** Always use search and view tools to inspect existing patterns before writing code.
2. **Zero Functional Alteration:** Never touch business logic, backend APIs, DB schemas, or authentication routines during UI refinement.
3. **Empirical Precision:** Base every edit strictly on empirical evidence gathered from the ClinicOS repository.
