# Electronic Prescription Management REST API Specification

> [!NOTE]
> The primary, detailed specification document for Prescription Management REST APIs is maintained in the module docs directory:
> 
> **👉 [docs/modules/PRESCRIPTION_MANAGEMENT_API.md](file:///c:/Users/20114/Documents/hossam%20hamada/ClinicOS/docs/modules/PRESCRIPTION_MANAGEMENT_API.md)**

---

## Quick Reference Summary

- **Module**: Prescription Management REST API (`Module-008`)
- **Base Route**: `/api/v1/prescriptions`
- **Core Endpoints**:
  - `POST /api/v1/prescriptions` — Create Draft Prescription
  - `GET /api/v1/prescriptions/:id` — Get Prescription Details
  - `PUT /api/v1/prescriptions/:id` — Update Draft Prescription
  - `PATCH /api/v1/prescriptions/:id/finalize` — Finalize & Sign Prescription
  - `PATCH /api/v1/prescriptions/:id/archive` — Soft-Delete / Archive Prescription
  - `PATCH /api/v1/prescriptions/:id/restore` — Restore Archived Prescription
  - `POST /api/v1/prescriptions/:id/print` — Register Print Action & Get Print Data
  - `POST /api/v1/prescriptions/:id/pdf` — Stream Vector PDF Document
  - `GET /api/v1/prescriptions` — Paginated List & Multi-Criteria Search
  - `GET /api/v1/patients/:patientId/prescriptions` — Patient History Timeline Prescriptions
  - `GET /api/v1/medical-records/:recordId/prescriptions` — EMR Encounter Prescriptions
- **Security**: Bearer JWT, `X-Tenant-ID` multi-tenant isolation, RBAC controls, Platform Owner PHI block (`PLATFORM_ADMIN_PHI_RESTRICTED`).
