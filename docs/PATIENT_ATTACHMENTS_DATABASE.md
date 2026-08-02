# Module-016 — Patient Files & Attachments Database Design

## Executive Summary

The **Patient Files & Attachments Database Architecture** defines the MongoDB data models, index strategies, integrity constraints, and storage abstraction layers for Module-016.

This design enforces a strict separation between database metadata and physical file binaries: **MongoDB stores metadata, checksums, and version history only, while physical binary streams reside in external secure file storage systems (Local Storage, S3, NAS).**

---

## 1. Primary Collections & BSON Data Models

### Collection 1: `patient_attachments`
Stores the primary metadata and active state pointer for every patient attachment.

```typescript
export interface IPatientAttachmentDocument {
  _id: string                    // BSON ObjectId string
  attachmentId: string           // Business Key (att_YYYYMM_XXXXX)
  tenantId: string               // Multi-tenant key
  clinicId: string               // Clinic branch key
  patientId: string              // Reference to patient document

  // File Metadata
  fileName: string               // Sanitized storage filename
  originalFileName: string       // Original filename uploaded by user
  fileExtension: string          // Extension (.pdf, .png, etc.)
  mimeType: string               // Standard MIME type
  fileSize: number               // Size in bytes

  // Storage Reference
  storageProvider: 'LOCAL' | 'S3' | 'NAS' | 'AZURE' | 'GCP'
  storagePath: string            // Storage path or object key
  storageBucket?: string         // Bucket name if cloud storage
  checksum: string               // SHA-256 integrity hash

  // Metadata Classification
  categoryId: string             // Reference to attachment_categories
  description?: string           // Clinical context notes
  tags: string[]                 // Search keywords array
  notes?: string                 // Internal staff notes
  isFavorite: boolean            // User bookmark

  // Version Control Pointers
  version: number                // Current active version number (1, 2, 3...)
  parentAttachmentId?: string    // Pointer to parent attachment if versioned
  isLatestVersion: boolean       // Boolean query flag

  // Status & Soft Delete
  status: 'ACTIVE' | 'SOFT_DELETED' | 'ARCHIVED'
  deletedAt?: Date
  deletedBy?: {
    userId: string
    userName: string
    userRole: string
  }

  // Upload Metadata
  uploadedBy: {
    userId: string
    userName: string
    userRole: string
  }
  uploadedAt: Date

  // Preview Metadata
  previewAvailable: boolean
  previewGeneratedAt?: Date

  // Offline Synchronization Metadata
  syncState: 'SYNCED' | 'PENDING' | 'CONFLICT'
  lastSyncedAt?: Date
  localChecksum?: string

  createdAt: Date
  updatedAt: Date
}
```

---

### Collection 2: `attachment_versions`
Stores historic immutable versions when an attachment is updated or replaced.

```typescript
export interface IAttachmentVersionDocument {
  _id: string
  versionId: string              // Unique version identifier (ver_YYYYMM_XXXXX)
  attachmentId: string           // Reference to parent patient_attachments
  tenantId: string
  clinicId: string
  versionNumber: number          // Version sequence (1, 2, 3...)
  
  // Historical File Binary Pointer
  storageProvider: 'LOCAL' | 'S3' | 'NAS'
  storagePath: string
  fileSize: number
  checksum: string
  mimeType: string

  // Audit Info
  uploadedBy: {
    userId: string
    userName: string
    userRole: string
  }
  uploadedAt: Date
  changeReason?: string          // Reason for uploading new version

  createdAt: Date
}
```

---

### Collection 3: `attachment_categories`
Configurable catalog of document categories per clinic.

```typescript
export interface IAttachmentCategoryDocument {
  _id: string
  categoryId: string             // Unique category ID (cat_att_XXXXX)
  tenantId: string
  clinicId: string
  name: string                   // Display name (e.g., "Laboratory Result")
  color: string                  // Hex color token (#0284C7)
  icon: string                   // Lucide React SVG icon key
  displayOrder: number
  active: boolean
  createdAt: Date
  updatedAt: Date
}
```

---

### Collection 4: `attachment_tags`
Reusable keyword tag catalog for indexing.

```typescript
export interface IAttachmentTagDocument {
  _id: string
  tagId: string                  // Tag ID (tag_att_XXXXX)
  tenantId: string
  clinicId: string
  name: string                   // Tag name (e.g. "Cardiology")
  color: string                  // Color code
  createdAt: Date
}
```

---

### Collection 5: `attachment_analytics`
Tracks access metrics, previews, and download telemetry.

```typescript
export interface IAttachmentAnalyticsDocument {
  _id: string
  analyticsId: string            // Metric record ID
  attachmentId: string
  tenantId: string
  clinicId: string
  downloadCount: number
  previewCount: number
  lastAccessedAt?: Date
  lastDownloadedAt?: Date
  lastPreviewedAt?: Date
  updatedAt: Date
}
```

---

### Collection 6 & 7: Reserved V2 Schemas (Document Only)
- **`attachment_ocr_metadata`**: Stores `extractedText`, `language`, `confidenceScore`, `indexedAt`.
- **`attachment_ai_metadata`**: Stores `predictedCategory`, `aiConfidence`, `aiSummary`, `suggestedTags`.

---

## 2. Indexing Strategy & Covered Queries

### `patient_attachments` Indexes:
1. **Patient Roster Covered Index**:
   - `{ tenantId: 1, clinicId: 1, patientId: 1, status: 1, createdAt: -1 }`
2. **Category Filter Index**:
   - `{ tenantId: 1, clinicId: 1, categoryId: 1, status: 1 }`
3. **Full-Text Search Index**:
   - `{ originalFileName: "text", description: "text", tags: "text" }`
4. **Version Lookup Index**:
   - `{ attachmentId: 1, version: 1 }` (Unique)

### `attachment_versions` Indexes:
1. `{ attachmentId: 1, versionNumber: -1 }` (Unique)

---

## 3. Relationships & Foreign Key Integrity

```
[Patients Collection] (1) ◄─── (N) [patient_attachments]
                                     │
                                     ├── (1) ◄─── (N) [attachment_versions]
                                     ├── (1) ◄─── (1) [attachment_analytics]
                                     └── (N) ◄─── (1) [attachment_categories]
```

- **Patient Record Delete**: Hard deletion of a patient is blocked if active attachments exist. Soft-deleted patients retain attachment pointers.
- **Audit Integration**: File operations trigger audit events referencing `attachmentId`, `patientId`, and `checksum`.

---

## 4. Multi-Tenant Isolation & Platform Owner Security Isolation

> [!IMPORTANT]
> **Platform Owner Privacy Isolation Barrier (`PLATFORM_ADMIN_ATTACHMENTS_RESTRICTED`)**:
> System queries executed by `SUPER_ADMIN` or `PLATFORM` tenant accounts are explicitly rejected by MongoDB repository middleware when attempting to read `patient_attachments` or `attachment_versions` metadata documents.

---

## 5. Offline Desktop Synchronization Metadata Schema

For desktop application deployments:
- `syncState`: `SYNCED` | `PENDING` | `CONFLICT`
- `lastSyncedAt`: Timestamp of last successful cloud sync.
- `localChecksum`: Local binary verification hash for offline reconciliation.

---

## Deliverables & Next Step Confirmation

The database architecture design for **Module-016 (Patient Files & Attachments)** is complete, fully validated, and documented.

Ready to proceed to **`TASK-149` — Patient Files & Attachments API Design**.
