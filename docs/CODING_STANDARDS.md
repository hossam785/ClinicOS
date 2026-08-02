# Coding Standards & Clean Code Specification

## Metadata

| Field | Value |
| --- | --- |
| **Title** | Coding Standards & Clean Code Specification |
| **Purpose** | Establishes the engineering philosophies, naming conventions, architectural boundaries, and code quality expectations for ClinicOS. |
| **Description** | Acts as the official code quality reference, keeping the guidelines conceptual, language-agnostic, and future-proof. |
| **Status** | Approved |
| **Last Updated** | 2026-07-29 |

---

## Table of Contents

- [Coding Philosophy](#coding-philosophy)
- [Clean Code Principles](#clean-code-principles)
- [SOLID Principles](#solid-principles)
- [DRY Principle](#dry-principle)
- [KISS Principle](#kiss-principle)
- [Separation of Concerns](#separation-of-concerns)
- [Project Organization](#project-organization)
- [Naming Conventions](#naming-conventions)
- [Function Design](#function-design)
- [Component Design](#component-design)
- [State Management Principles](#state-management-principles)
- [Error Handling Standards](#error-handling-standards)
- [Logging Standards](#logging-standards)
- [Validation Standards](#validation-standards)
- [Security Standards](#security-standards)
- [Performance Standards](#performance-standards)
- [Documentation Standards](#documentation-standards)
- [Dependency Management](#dependency-management)
- [Refactoring Rules](#refactoring-rules)
- [Code Review Expectations](#code-review-expectations)
- [Things Developers Must Never Do](#things-developers-must-never-do)
- [Future Improvements](#future-improvements)

---

# Coding Philosophy

- **Readability over Cleverness**: Code must be written so it is easy to read, scan, and understand. Avoid complex, shorthand syntax tricks that hide developer intent.
- **Simplicity over Complexity**: Prioritize straightforward implementations. Do not build abstract, generic patterns until a concrete business requirement demands them.
- **Maintainability First**: Structure code to simplify testing, extension, and refactoring by different developers or AI coding agents.
- **Consistency Everywhere**: Follow identical styling, patterns, naming conventions, and layout structures across all workspaces.
- **Explicit is Better than Implicit**: Explicitly define variables, dependencies, state transitions, and parameters. Avoid side effects.

---

# Clean Code Principles

- **Small Functions**: Keep functions short and focused on a single logical task.
- **Single Responsibility**: Every module, file, and function must have one, and only one, reason to change.
- **Meaningful Naming**: Use descriptive, intention-revealing names for variables, methods, and files. Avoid generic terms.
- **Avoid Duplication**: Refactor common operations into reusable helpers.
- **Clear Abstractions**: Expose simple interfaces, hiding internal implementation details from outer modules.

---

# SOLID Principles

- **Single Responsibility**: Restrict files and classes to a single logical context or responsibility.
- **Open-Closed**: Design modules to be open for extension but closed for modification.
- **Liskov Substitution**: Ensure child components or classes can replace their parent definitions without altering system stability.
- **Interface Segregation**: Keep interfaces and type contracts small and client-focused. Clients must not depend on capabilities they do not use.
- **Dependency Inversion**: High-level modules must depend on abstractions rather than concrete lower-level classes.

---

# DRY Principle

- **Avoid Duplicate Logic**: All common calculations, formatting routines, validation schemas, and database operations must reside in a single, authoritative location. Copy-pasted logic increases maintenance costs and introduces bugs.

---

# KISS Principle

- **Keep It Simple**: Choose the simplest implementation that satisfies the business requirements. Avoid complex architectures, unnecessary patterns, and extra variables.

---

# Separation of Concerns

- **Decoupled Layers**: Enforce clear boundaries between application layers:
  - **Presentation Layer**: Renders UI layouts and captures events.
  - **Orchestration Layer**: Manages business workflows and controls data flow.
  - **Service Layer**: Executes business rules, checks constraints, and processes entities.
  - **Data Access Layer**: Interacts with databases and filesystem stores.

---

# Project Organization

- **Feature-Based Modules**: Group source files logically by business module (e.g., scheduler, billing, patient) rather than file type.
- **Encapsulated Directories**: Keep related UI components, helpers, and types in the same folder area.
- **Public Gates**: Use clear entry files to expose only the necessary methods of a module, protecting internal module details.

---

# Naming Conventions

- **Files**: Use lowercase kebab-case to denote the module name and type.
- **Components**: Use capitalization (e.g. PascalCase) to indicate visual user interface components.
- **Functions**: Use verb prefixes to represent actions and operations.
- **Variables**: Use clear, descriptive nouns to represent stored values.
- **Constants**: Use uppercase formatting to distinguish immutable system parameters.
- **Types & Interfaces**: Use noun structures that state the shape of data models.
- **Hooks**: Use specific prefixes to designate stateful side-effect containers.
- **Utilities**: Use domain-focused names to represent common helper libraries.

---

# Function Design

- **Size**: Restrict functions to a readable size limit, keeping them within a single screen viewport.
- **Responsibility**: Enforce single-task execution. Split a function if it executes multiple operations.
- **Inputs**: Keep parameter lists short. Group complex inputs into a single parameter object.
- **Outputs**: Return predictable, strongly-typed values.
- **Side Effects**: Avoid side effects. Favor pure functions where inputs map directly to outputs.

---

# Component Design

- **Presentational Focus**: Keep UI components focused on layout rendering. Extract business calculations and state orchestration to hooks or controllers.
- **Modular Layouts**: Build small, reusable components that can be composed to form pages.
- **Accessibility Integration**: Design components to support accessibility parameters by default.

---

# State Management Principles

- **Single Source of Truth**: Data states must belong to a single source of truth to prevent synchronization drift.
- **Scoped State**: Keep state as local as possible. Global state is restricted to configurations shared across the entire system (such as active sessions or tenant contexts).
- **Traceable Mutations**: Modify states only through explicit actions.

---

# Error Handling Standards

- **Graceful Capture**: Intercept errors at boundaries, log detailed context internally, and return user-friendly messages.
- **No Silenced Errors**: Empty catch blocks are prohibited. Every error must be logged or handled.
- **Custom Exceptions**: Use custom domain exceptions to differentiate validation errors from system failures.

---

# Logging Standards

- **Log Purposefully**: Log critical events like authentication attempts, security warnings, transaction completions, and integration failures.
- **No Verbose Logs**: Do not log high-frequency UI events. Never write sensitive personal health data (PHI) or passwords to log files.

---

# Validation Standards

- **Boundary Validation**: Check all data inputs at the application boundary (API gate, input form, database ingress).
- **Format Verification**: Enforce strict schema checks, type verification, and length constraints on all fields.

---

# Security Standards

- **Input Validation**: Check and validate all inputs for safety and formatting before processing.
- **Least Privilege**: Restrict execution environments and credentials to the minimal permissions required.
- **Data Protection**: Encrypt sensitive patient data and mask credentials in logs and screens.
- **Secret Isolation**: Do not hardcode or commit keys, tokens, or passwords to the code repository.

---

# Performance Standards

- **Optimized Rendering**: Avoid unnecessary layout re-renders.
- **Memoization**: Cache expensive computations.
- **Lazy Loading**: Import modules and components only when they are requested by the client.
- **Chunk Splitting**: Partition application chunks to optimize initial page loading speeds.

---

# Documentation Standards

- **Document the "Why"**: Use comments to explain the reasoning behind complex code paths and business logic rather than explaining what the code does.
- **API Documentation**: Maintain public API specs alongside the codebase.

---

# Dependency Management

- **Native Features**: Prefer standard language features and native APIs over importing external libraries.
- **Vulnerability Checks**: Audit third-party packages for maintenance status and security issues.
- **Bundle Optimization**: Keep dependency sizes small to prevent network latency.

---

# Refactoring Rules

- **Continuous Improvement**: Refactor code when duplication occurs, when modules grow too large, or when performance drops.
- **Test Protection**: Refactoring must be validated by automated test suites to ensure zero regressions.

---

# Code Review Expectations

- **Code Auditing**: Reviewers must check code for:
  - Compliance with DRY, KISS, and SOLID principles.
  - Strict tenant boundary isolation checks.
  - Presence of automated tests.
  - Absence of hardcoded values, credentials, or dead code.

---

# Things Developers Must Never Do

- **Duplicate Logic**: Never duplicate common logic; abstract it.
- **Hardcode Secrets**: Never commit passwords, tokens, or keys to the code.
- **Dead Code**: Never leave commented-out code, unused variables, or dead modules in the repository.
- **Magic Numbers**: Never use raw numbers; replace them with named constants.
- **Ignored Errors**: Never swallow exceptions or leave empty catch blocks.
- **Unused Dependencies**: Never keep unused packages in configuration files.

---

# Future Improvements

The following spaces are reserved for future coding standards updates:
- [Automated linter configuration rules]
- [Pre-commit hook test configurations]
- [Git branch naming conventions]
