# AI Project Requirements Document (AI PRD)

## Metadata

| Field | Value |
| --- | --- |
| **Title** | AI Project Requirements Document (AI PRD) |
| **Purpose** | Establishes the instructions, standards, constraints, and validation rules for AI-assisted development. |
| **Description** | Serves as the primary operational blueprint that any AI agent must read, respect, and validate against before modifying the codebase. |
| **Status** | Approved |
| **Last Updated** | 2026-07-29 |

---

## Table of Contents

- [Project Summary](#project-summary)
- [Project Goals](#project-goals)
- [Technology Stack](#technology-stack)
- [Development Philosophy](#development-philosophy)
- [Project Structure](#project-structure)
- [AI Responsibilities](#ai-responsibilities)
- [Documentation Workflow](#documentation-workflow)
- [Development Workflow](#development-workflow)
- [Coding Principles](#coding-principles)
- [Quality Standards](#quality-standards)
- [Error Handling Standards](#error-handling-standards)
- [Security Principles](#security-principles)
- [Performance Principles](#performance-principles)
- [Documentation Standards](#documentation-standards)
- [Task Execution Rules](#task-execution-rules)
- [Validation Requirements](#validation-requirements)
- [Definition of Done](#definition-of-done)
- [Things AI Must Never Do](#things-ai-must-never-do)
- [Future Expansion](#future-expansion)

---

# Project Summary

ClinicOS is an enterprise-grade multi-tenant Software-as-a-Service (SaaS) clinical management and operational platform. The platform is designed to consolidate patient scheduling, Electronic Health Records (EHR), receptionist front-desk tasks, and billing into a high-performance workspace while ensuring strict data isolation between clinics.

---

# Project Goals

- **Maintain Data Isolation**: Enforce logical partitioning of patient data and clinic workflows between tenants.
- **Operational Speed**: Deliver sub-300ms interactive transitions to minimize administrative queue latency.
- **AI Onboarding Ready**: Establish a clear, structured repository codebase that allows AI coding assistants to contribute with zero ambiguity.
- **Extensible Architecture**: Provide a modular, decoupled codebase where subsystems (such as scheduling or billing) can be updated independently.

---

# Technology Stack

The approved technology stack for ClinicOS is organized as follows:
- **Core Frontend**: [TBD - To be finalized in future architecture tasks]
- **Core Backend**: [TBD - To be finalized in future architecture tasks]
- **Database System**: [TBD - To be finalized in future architecture tasks]
- **Infrastructure**: [TBD - To be finalized in future architecture tasks]
- **Validation Tooling**: [TBD - To be finalized in future testing tasks]

---

# Development Philosophy

- **Build for Maintainability**: Write clean, readable, self-documenting code. Code should be easy for both humans and AI to modify.
- **Simplicity over Complexity**: Prioritize straightforward, explicit implementations over complex, generic abstractions.
- **Performance First**: Prevent resource bloat. Optimize database access paths, bundle sizes, and network payloads.
- **Security by Default**: Treat security as a core requirement at all system layers, implementing input validation, role checks, and tenant isolation gates.
- **Modular Architecture**: Maintain low coupling and high cohesion between service modules.

---

# Project Structure

The project directory is structured to separate documentation, application code, and test suites:
- **`/docs`**: The central repository for all project specifications, design rules, and changelogs.
- **`/src`** (Future): The primary codebase directory, partitioned by components, services, and utilities.
- **`/tests`** (Future): Unit, integration, and end-to-end test suites mirroring the `/src` layout.

---

# AI Responsibilities

Every AI agent participating in this repository is expected to:
- **Read All Documentation**: Review the active PRDs, design system files, and coding standards before proposing code modifications.
- **Understand the Current Task**: Align strictly with the ticket requirements and avoid introducing out-of-scope code.
- **Avoid Breaking Existing Functionality**: Perform rigorous regression checks to ensure existing services continue to operate correctly.
- **Preserve Coding Consistency**: Mirror the formatting, linting rules, naming conventions, and file structure present in the codebase.
- **Update Documentation When Necessary**: Ensure design files, API schemas, and changelogs are updated to match code mutations.

---

# Documentation Workflow

Documentation is treated as an active part of the codebase:
- **Simultaneous Updates**: Code changes that alter business logic, user permissions, API contracts, or schemas must include updates to the corresponding `/docs` files in the same work block.
- **Changelog Maintenance**: All notable additions, changes, bug fixes, or deprecations must be logged in `docs/CHANGELOG.md` under the "Unreleased" section.

---

# Development Workflow

AI agents must execute tasks using the following workflow loop:

```text
Read Documentation
       ↓
  Analyze Task
       ↓
 Plan Solution
       ↓
   Implement
       ↓
   Validate
       ↓
Update Documentation
       ↓
 Complete Task
```

---

# Coding Principles

- **Clean Code**: Emphasize explicit variable naming, small single-purpose functions, and clear logical structures.
- **SOLID**: Follow object-oriented and functional clean coding standards.
- **DRY (Don't Repeat Yourself)**: Abstract shared logic into common utilities, but avoid premature abstractions.
- **KISS (Keep It Simple, Stupid)**: Write readable, direct code instead of clever, complex tricks.
- **Separation of Concerns**: Separate presentation layouts, business controllers, API handling, and persistence layers.
- **Readability**: Format code logically so its intent is immediately clear.
- **Scalability**: Structure modules using clear dependency boundaries to allow future replacements.

---

# Quality Standards

- **Type Safety**: Enforce strict compile-time typing. Avoid the use of dynamic fallback types (e.g. `any`).
- **Linting & Formatting**: Ensure all files compile and pass linter formatting rules without warnings.
- **Test Coverage**: Accompany all new feature implementations with matching unit or integration tests to maintain quality thresholds.

---

# Error Handling Standards

- **Graceful Failures**: Catch exceptions at logical boundaries to prevent system crashes or exposure of internal stack traces to users.
- **Structured Logging**: Log errors with correlation IDs, descriptive messages, timestamps, and contextual data.
- **Custom Exceptions**: Use structured domain exception classes (e.g. `AccessDeniedException`, `ValidationException`) to handle business rule violations.

---

# Security Principles

- **Tenant Separation Validation**: Verify that every data operation checks and enforces the active tenant context.
- **Input Sanitization**: Validate, sanitize, and bound-check all inputs before processing or persistence.
- **Least Privilege Access**: Restrict API endpoints and views based on verified role access levels (RBAC).

---

# Performance Principles

- **Efficient Queries**: Write indexed, optimized database queries; avoid N+1 query patterns.
- **Optimized Bundles**: Prevent importing heavy, unused packages. Use tree-shaking and light dependencies.
- **Payload Management**: Keep API payloads light and send only required fields.

---

# Documentation Standards

- **Markdown Uniformity**: Use consistent Markdown syntax, clear tables, and structured headers.
- **Document Rationale**: Document the "why" behind architecture decisions and domain assumptions.
- **No Redundancy**: Avoid repeating details across multiple files. Link to the source of truth instead.

---

# Task Execution Rules

- **One Task at a Time**: Complete tasks sequentially. Do not start work on a new ticket before completing the current one.
- **Enforce Validation**: Run test suites before declaring work complete.
- **Scoped Edits**: Only modify files directly related to the active task. Avoid refactoring unrelated code.
- **Backward Compatibility**: Preserve existing database schemas and API signatures to prevent breaking active integrations.

---

# Validation Requirements

- Verify code compiles and passes syntax validation checks.
- Run all automated unit and integration tests to ensure zero regressions.
- Validate that UI elements or API payloads conform strictly to `docs/DESIGN_DNA.md` and `docs/API_DESIGN.md`.

---

# Definition of Done

A task is considered complete only when:
- **Requirements Satisfied**: All feature requirements and business constraints are implemented.
- **No Regressions**: Existing functionalities are validated and automated test suites pass.
- **Documentation Updated**: Design, architecture, API docs, and `CHANGELOG.md` are updated.
- **Validation Passed**: Linting, typing, and manual validation checks are clean.
- **Ready for Review**: The workspace is committed and presented for final human verification.

---

# Things AI Must Never Do

- **Do Not Invent Requirements**: Strictly follow user specifications and do not add unrequested features.
- **Do Not Remove Core Functionality**: Never delete existing features or code paths unless explicitly instructed.
- **Do Not Modify Unrelated Files**: Limit work scope to the active ticket boundaries.
- **Do Not Ignore Documentation**: Never write code that violates `docs/CODING_STANDARDS.md` or `docs/DESIGN_DNA.md`.
- **Do Not Introduce Complex Dependencies**: Do not import unverified npm/npm-equivalent libraries without permission.

---

# Future Expansion

The following areas are reserved for future AI PRD updates as development progresses:
- [AI Speech-to-Text API specification metrics]
- [E-prescribing validation schemas]
- [Insurance clearinghouse integration guidelines]
