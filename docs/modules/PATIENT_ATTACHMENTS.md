# Module-016 — Patient Files & Attachments Requirements Analysis

## Executive Summary

The **Patient Files & Attachments Module** serves as the central digital document repository for the ClinicOS Enterprise SaaS Platform. It provides secure, organized, versioned, and HIPAA-compliant document management for every patient across the healthcare enterprise.

This module guarantees that every medical image, laboratory result, prescription scan, consent form, referral letter, and administrative record is permanently indexed, searchable, auditable, and linked directly to the patient's master record without cluttering database tables or compromising physical storage performance.

---

## 1. Primary Business Goals

1. **Centralized Patient Document Vault**: Provide a unified, cloud-ready digital health file repository for every patient.
2. **Security & Privacy Isolation**: Guarantee 100% tenant isolation and enforce HIPAA privacy boundaries, ensuring Platform Administrators (`SUPER_ADMIN`) cannot access patient medical files.
3. **Traceability & Auditing**: Maintain a complete audit log of every upload, download, preview, metadata modification, and soft-deletion event.
4. **Immutable Versioning**: Support multi-version history so file replacements create new versions while preserving historical documents.
5. **Zero Overwrite Assurance**: Overwriting files permanently is strictly forbidden; soft-deletion and version chains preserve document integrity for legal and clinical compliance.
6. **Timeline Integration**: Every uploaded file automatically feeds into the patient's interactive clinical timeline.

---

## 2. Supported File Formats & Technical Specifications

| Category | Format / Extension | MIME Type | Maximum File Size |
| --- | --- | --- | --- |
| **Images** | `.jpg`, `.jpeg` | `image/jpeg` | 15 MB |
| **Images** | `.png` | `image/png` | 15 MB |
| **Images** | `.webp` | `image/webp` | 15 MB |
| **Documents** | `.pdf` | `application/pdf` | 50 MB |
| **Documents** | `.docx` | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` | 25 MB |
| **Medical Imaging (V2 Reserved)** | `.dcm`, `.dicom` | `application/dicom` | 250 MB |
| **Archives (Optional)** | `.zip` | `application/zip` | 100 MB |

---

## 3. Configurable Attachment Categories

Categories allow precise classification of medical documents. Clinic Administrators can configure custom categories, while the default system catalog includes:

1. **Identification**: National ID, Passport, Driver's License, Insurance Card scan.
2. **Prescription**: Scanned paper prescriptions, external pharmacy notes.
3. **Laboratory Result**: Blood work, pathology reports, urine analysis, lab test sheets.
4. **Radiology Report**: X-Ray images, MRI scans, CT scan reports, Ultrasound images.
5. **Medical Report**: Discharge summaries, operative notes, specialist consultation letters.
6. **Referral Letter**: Official referral letters from external clinics or hospitals.
7. **Insurance**: Prior authorization forms, claim approvals, coverage letters.
8. **Consent Form**: Signed patient consent forms, procedure release forms.
9. **Invoice**: Billing receipts, payment vouchers, financial statements.
10. **Other**: General notes, miscellaneous correspondence.

---

## 4. Attachment Metadata Schema & Entity Structure

Each stored attachment consists of decoupled database metadata and physical storage pointers:

```typescript
export interface IPatientAttachment {
  attachmentId: string           // Unique identifier (att_YYYYMM_XXXXX)
  patientId: string              // Reference to patient
  tenantId: string               // Multi-tenant isolation key
  clinicId: string               // Clinic branch isolation key
  fileName: string               // Sanitized system storage filename
  originalFileName: string       // Original file name uploaded by user
  category: string               // Category classification
  description?: string           // Clinical context or description
  fileSize: number               // Size in bytes
  mimeType: string               // Standard MIME type
  fileExtension: string          // File extension (.pdf, .png, etc.)
  storageProvider: 'LOCAL' | 'S3' | 'NAS' // Storage engine abstraction
  storagePath: string            // Storage path or object key
  checksum: string               // SHA-256 integrity hash
  version: number                // Sequential version number (1, 2, 3...)
  parentAttachmentId?: string    // Pointer to previous version if updated
  isLatestVersion: boolean       // Quick boolean index flag
  tags: string[]                 // Searchable keywords
  notes?: string                 // Additional internal staff notes
  isFavorite: boolean            // User bookmark flag
  status: 'ACTIVE' | 'SOFT_DELETED' | 'ARCHIVED'
  uploadedBy: {
    userId: string
    userName: string
    userRole: string
  }
  createdAt: string
  updatedAt: string
  deletedAt?: string
  deletedBy?: string
}
```

---

## 5. Patient Clinical Timeline Integration

Every file upload, version update, or deletion automatically dispatches a timeline event to the Patient Clinical Timeline:

- **Event Category**: `PATIENT_ATTACHMENT_UPLOADED`
- **Timeline Entry Summary**: Display upload date, uploader name & role, category badge, original file name, and one-click preview action.

---

## 6. File Organization, Navigation & Filtering Systems

- **Virtual Folders**: Organize files logically without altering underlying storage structures.
- **Categorization**: Filter attachments by single or multiple categories.
- **Tagging**: Assign custom tags (`#cardiology`, `#urgent`, `#lab_2026`).
- **Quick Filters**:
  - `Recent Files` (Uploaded within the last 30 days)
  - `Favorites` (Bookmarked documents)
  - `Images Only` / `Documents Only` / `Lab Results Only`
- **Sorting Options**: Sort by Upload Date (Desc/Asc), File Name (A-Z/Z-A), File Size (Largest/Smallest), Category.

---

## 7. Multi-Parameter Search Engine Specification

The attachment search engine supports covered index querying across:

- Original File Name (partial text match)
- Category Name
- Tags (exact array match)
- Description & Clinical Notes
- Upload Date Range (`startDate` to `endDate`)
- Uploader Name / User ID

---

## 8. In-Browser Multi-Format Preview Capabilities

- **Images (JPG, PNG, WEBP)**: High-resolution zoom, rotate, and lightbox modal view.
- **Documents (PDF)**: Embedded PDF viewer with page navigation and text search.
- **Unsupported Formats (DOCX, ZIP)**: Render metadata card with file size, SHA-256 hash, and secure download button.

---

## 9. Immutable Multi-Version Control System

When an authorized user updates or replaces an existing attachment:

```
Upload New File Version
         │
         ▼
Preserve Existing File Record (version: N, isLatestVersion: false)
         │
         ▼
Create New File Record (version: N+1, parentAttachmentId: prevId, isLatestVersion: true)
         │
         ▼
Record Audit Log ("ATTACHMENT_VERSION_CREATED")
```

**Overwriting file binaries on disk is strictly prohibited.**

---

## 10. Granular RBAC Permission Matrix

| Role | Upload | View / Preview | Download | Metadata Edit | Soft Delete | Permanent Purge |
| --- | --- | --- | --- | --- | --- | --- |
| **Doctor** | `ALLOWED` | `ALLOWED` | `ALLOWED` | `ALLOWED` | `ALLOWED` | `DENIED` |
| **Clinic Admin** | `ALLOWED` | `ALLOWED` | `ALLOWED` | `ALLOWED` | `ALLOWED` | `ALLOWED` |
| **Receptionist** | `CONFIGURABLE` | `CONFIGURABLE` | `CONFIGURABLE` | `DENIED` | `DENIED` | `DENIED` |
| **Nurse** | `ALLOWED` | `ALLOWED` | `ALLOWED` | `ALLOWED` | `DENIED` | `DENIED` |
| **Platform Owner (`SUPER_ADMIN`)** | `RESTRICTED` | `RESTRICTED` | `RESTRICTED` | `RESTRICTED` | `RESTRICTED` | `RESTRICTED` |

> [!IMPORTANT]
> **Platform Owner Privacy Isolation Barrier (`PLATFORM_ADMIN_ATTACHMENTS_RESTRICTED`)**:
> `SUPER_ADMIN` and `PLATFORM` tenant users are strictly prohibited from viewing, downloading, or previewing patient attachments to enforce HIPAA medical privacy laws.

---

## 11. Storage Engine Abstraction & Architecture

Physical file storage is completely decoupled from MongoDB metadata. Storage drivers implement a unified interface:

```typescript
export interface IStorageDriver {
  uploadFile(fileBuffer: Buffer, path: string, mimeType: string): Promise<string>
  downloadFile(path: string): Promise<Buffer>
  deleteFile(path: string): Promise<boolean>
  getPresignedUrl(path: string, expiresInSeconds: number): Promise<string>
}
```

Supported Drivers:
1. `LocalStorageDriver`: Local disk storage inside clinic workspace directory.
2. `S3StorageDriver`: AWS S3 or compatible object storage.
3. `NASStorageDriver`: Network Attached Storage for enterprise hospital deployments.

---

## 12. Strict Business Rules & Security Compliance

1. **Patient Ownership**: Every attachment belongs to exactly one patient.
2. **Audit Logging**: Uploading, downloading, previewing, or deleting files dispatches an immutable audit record to `AuditEngineService`.
3. **Soft Delete Policy**: Deleting an attachment marks `status = 'SOFT_DELETED'` and hides it from standard rosters while retaining audit history.
4. **Filename Sanitization**: Uploaded filenames are sanitized to prevent directory traversal attacks (`../`).
5. **Virus & Malware Scanning Buffer**: File buffers pass through validation checks before persistence.

---

## 13. Reserved V2 Extensions Roadmap (Document Only)

- **OCR Text Extraction**: Optical Character Recognition for automated PDF and image text indexing.
- **AI Document Classification**: Automated tagging and category assignment via machine learning.
- **Web-based DICOM Viewer**: Native WebGL viewing of medical imaging datasets (X-Ray, MRI, CT).
- **Digital Signatures**: Cryptographic signing of medical reports and consent forms.
- **Expiring Presigned Sharing Links**: Time-bound temporary links for sharing documents securely with external specialists.

---

## Deliverables & Next Step Confirmation

The business requirements analysis for **Module-016 (Patient Files & Attachments)** is complete, fully validated, and documented.

Ready to proceed to **`TASK-147` — Patient Files & Attachments User Flow Design**.
