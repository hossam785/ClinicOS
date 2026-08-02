# Electronic Prescription User Flows & System Flows

> [!NOTE]
> The primary, detailed specification document for Prescription Management Flows is maintained in the module docs directory:
> 
> **👉 [docs/modules/PRESCRIPTION_MANAGEMENT_FLOW.md](file:///c:/Users/20114/Documents/hossam%20hamada/ClinicOS/docs/modules/PRESCRIPTION_MANAGEMENT_FLOW.md)**

---

## Quick Reference Summary

- **Module**: Prescription Management Flows (`Module-008`)
- **Primary Objective**: Document end-to-end clinical user flows, system execution engines, failure handlers, state transitions, and RBAC matrix for ePrescriptions.
- **User Flows**: 8 complete flows covering Doctor Open Visit, Create Rx, Finalize Rx, Print Rx, Reprint, Reception, Clinic Manager, and Unified Doctor+Manager Dashboard.
- **System Engines**: Creation Validation, Immutability & Finalization, Print & PDF Generation, Patient History Timeline query.
- **Failure Handlers**: Explicit rules for 11 failure scenarios (Patient Missing, EMR Missing, Unauthorized Access, Locked Editing, DB Error, PDF Crash, etc.).
- **State Machine**: Strict forward transitions (`DRAFT` ➔ `FINALIZED` ➔ `PRINTED` ➔ `ARCHIVED`). Prohibits invalid reverse transitions.
