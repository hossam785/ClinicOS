# ClinicOS Mandatory UI Implementation Workflow

**Version:** 1.0  
**Status:** Mandatory Governance Workflow Specification  
**Target:** Standardized 8-Phase Engineering Process for UI Modifications  

---

## Executive Summary

This document defines the mandatory 8-phase implementation workflow that every AI agent, software engineer, reviewer, and contributor **MUST** follow before and during any UI modification in ClinicOS. 

No UI task may skip any phase. Jumping directly into code implementation without inspection, planning, and verification is strictly prohibited.

---

## Table of Contents

1. [Workflow Philosophy & Mission](#workflow-philosophy--mission)
2. [The Standard 8-Phase Implementation Workflow](#the-standard-8-phase-implementation-workflow)
   - [Phase 1: Documentation Review](#phase-1--documentation-review)
   - [Phase 2: Repository Inspection](#phase-2--repository-inspection)
   - [Phase 3: Project Analysis](#phase-3--project-analysis)
   - [Phase 4: Implementation Planning](#phase-4--implementation-planning)
   - [Phase 5: Surgical Code Implementation](#phase-5--surgical-code-implementation)
   - [Phase 6: Multi-Dimensional Self-Review](#phase-6--multi-dimensional-self-review)
   - [Phase 7: Technical & Architectural Validation](#phase-7--technical--architectural-validation)
   - [Phase 8: Final Build & Regression Verification](#phase-8--final-build--regression-verification)
3. [Mandatory Task Deliverables](#mandatory-task-deliverables)
4. [Critical Rules & Anti-Patterns](#critical-rules--anti-patterns)

---

## Workflow Philosophy & Mission

Every UI modification in ClinicOS must follow a controlled engineering process. The goal is to eliminate risk, maintain architectural integrity, prevent visual regressions, and ensure complete compliance with the ClinicOS Design System.

```
┌───────────┐    ┌───────────┐    ┌───────────┐    ┌───────────┐
│ Phase 1   │───>│ Phase 2   │───>│ Phase 3   │───>│ Phase 4   │
│ Doc Review│    │ Repository│    │ Project   │    │ Plan      │
└───────────┘    └───────────┘    └───────────┘    └───────────┘
                                                         │
┌───────────┐    ┌───────────┐    ┌───────────┐          ▼
│ Phase 8   │<───│ Phase 7   │<───│ Phase 6   │<───┌───────────┐
│ Final Verification │ Architecture │ Self-Review│   │ Phase 5   │
└───────────┘    └───────────┘    └───────────┘    │ Execute   │
                                                   └───────────┘
```

---

## The Standard 8-Phase Implementation Workflow

### Phase 1 — Documentation Review
Before opening or editing any source code file, the contributor MUST review all governing specifications under `docs/ui/`:
1. `00-PROJECT-PRESERVATION-POLICY.md`
2. `01-DESIGN-PRINCIPLES.md`
3. `02-UI-RULES.md`
4. `03-COMPONENT-STANDARDS.md`
5. `04-LAYOUT-STANDARDS.md`
6. `05-TYPOGRAPHY-STANDARDS.md`
7. `06-SPACING-SYSTEM.md`
8. `07-COLOR-SYSTEM.md`
9. `08-ICONOGRAPHY.md`
10. `09-ACCESSIBILITY-STANDARDS.md`
11. `10-AI-CAPABILITIES-AND-TOOLING.md`

### Phase 2 — Repository Inspection
Inspect all related project context using code search and viewing tools:
- Parent layout wrappers & subcomponents.
- Imported hooks, state context, and types.
- Design tokens (`tokens.css`, `index.css`).
- Existing responsive rules and accessibility properties.

### Phase 3 — Project Analysis
Analyze potential side-effects:
- List all affected files and shared dependencies.
- Identify reusable design system components in `src/design-system/components/`.
- Evaluate technical constraints and potential visual regression risks.

### Phase 4 — Implementation Planning
Construct a structured implementation plan prior to editing:
- Detail exact target files to modify.
- Document reasons for each change.
- Define expected visual/usability outcomes.
- Outline rollback strategies if needed.

### Phase 5 — Surgical Code Implementation
Execute precision edits adhering to these constraints:
- Modify ONLY what is strictly necessary.
- Reuse existing components, tokens, and utility classes.
- Never duplicate styles or introduce unnecessary component abstractions.

### Phase 6 — Multi-Dimensional Self-Review
Review implementation against design system criteria:
- **Visual Consistency:** Color, typography, and contrast compliance.
- **Geometry:** Spacing scale, margins, alignment.
- **States:** Hover, focus, active, disabled, loading, empty, error.
- **Accessibility:** Focus rings, keyboard tabbing, ARIA labels.

### Phase 7 — Technical & Architectural Validation
Confirm strict non-functional constraints:
- ❌ Zero business logic changes.
- ❌ Zero backend API or payload changes.
- ❌ Zero database or schema changes.
- ❌ Zero authentication, authorization, or routing changes.

### Phase 8 — Final Build & Regression Verification
Execute build verification (`npm run build`) to ensure zero TypeScript errors, clean bundle compilation, and no visual layout breakage across screen breakpoints.

---

## Mandatory Task Deliverables

Upon completion of any UI task, the final report MUST include:

1. **Summary:** Brief overview of visual refinements completed.
2. **Files Modified:** List of exact file paths edited.
3. **Reasoning:** Justification based on governance specifications.
4. **Impact Analysis:** Confirmation of affected modules and components.
5. **Validation Results:** Output of build validation (`npm run build`).
6. **Known Limitations & Recommendations:** Optional notes for follow-up maintenance.

---

## Critical Rules & Anti-Patterns

- **NEVER** code before inspecting repository context.
- **NEVER** skip documentation review in `docs/ui/`.
- **NEVER** implement code based on assumptions or generic external templates.
- **NEVER** introduce fake placeholder data or mock fallbacks.
