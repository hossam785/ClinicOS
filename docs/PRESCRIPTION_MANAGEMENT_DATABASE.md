# Electronic Prescription Management Database Design

> [!NOTE]
> The primary, detailed specification document for Prescription Management Database Design is maintained in the module docs directory:
> 
> **👉 [docs/modules/PRESCRIPTION_MANAGEMENT_DATABASE.md](file:///c:/Users/20114/Documents/hossam%20hamada/ClinicOS/docs/modules/PRESCRIPTION_MANAGEMENT_DATABASE.md)**

---

## Quick Reference Summary

- **Module**: Prescription Management Database (`Module-008`)
- **Primary Collection**: `prescriptions`
- **Key Relationships**: Mandatory foreign keys to `patientId`, `medicalRecordId`, `doctorId`, `clinicId` (`tenantId`).
- **Embedded Architecture**: Medications stored as an embedded sub-document array within `prescriptions` for single-read performance and historical immutability.
- **Statuses**: `DRAFT`, `FINALIZED`, `ARCHIVED`.
- **Deletion Policy**: Soft-delete only (`archived: true`). Hard deletes strictly prohibited.
- **Indexes**: Includes compound indexes `idx_tenant_patient_history`, `idx_tenant_doctor_history`, `idx_tenant_rx_number_unique`, `idx_tenant_clinic_reporting`, and `idx_tenant_medical_record_lookup`.
