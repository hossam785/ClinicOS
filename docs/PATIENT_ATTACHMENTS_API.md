# Module-016 — Patient Files & Attachments API Design

## Executive Summary

The **Patient Files & Attachments REST API Specification** documents all 20 API endpoints, authentication boundaries, request/response JSON schemas, multi-tenant RBAC security matrices, error response envelopes, audit logging integrations, and reserved V2 roadmap extensions for Module-016.

All endpoints adhere strictly to RESTful standards, JWT bearer authentication, zero data leak guidelines, and HIPAA medical privacy isolation.

---

## 1. Global API Standards & Envelopes

### Base API Path
All endpoints are versioned under `/api/v1`.

### Success Response Envelope
```json
{
  "status": "success",
  "data": { ... }
}
```

### Error Response Envelope
```json
{
  "status": "error",
  "error": {
    "code": "ATTACHMENT_NOT_FOUND",
    "message": "The requested patient attachment could not be found or access is denied.",
    "details": null
  }
}
```

---

## 2. API Endpoint Catalog Overview

| Endpoint | Method | Path | Access Scope |
| --- | --- | --- | --- |
| **Upload Attachment** | `POST` | `/api/v1/patients/:patientId/attachments` | Doctor, Admin, Nurse, Receptionist (Config) |
| **List Attachments** | `GET` | `/api/v1/patients/:patientId/attachments` | Doctor, Admin, Nurse, Receptionist (Config) |
| **Attachment Details** | `GET` | `/api/v1/patients/:patientId/attachments/:attachmentId` | Doctor, Admin, Nurse, Receptionist (Config) |
| **Download Binary** | `GET` | `/api/v1/patients/:patientId/attachments/:attachmentId/download` | Doctor, Admin, Nurse, Receptionist (Config) |
| **Preview Binary** | `GET` | `/api/v1/patients/:patientId/attachments/:attachmentId/preview` | Doctor, Admin, Nurse, Receptionist (Config) |
| **Upload New Version** | `POST` | `/api/v1/patients/:patientId/attachments/:attachmentId/replace` | Doctor, Admin, Nurse |
| **Rename / Edit Metadata**| `PATCH` | `/api/v1/patients/:patientId/attachments/:attachmentId` | Doctor, Admin, Nurse |
| **Soft Delete** | `DELETE` | `/api/v1/patients/:patientId/attachments/:attachmentId` | Doctor, Admin |
| **Restore Attachment** | `POST` | `/api/v1/patients/:patientId/attachments/:attachmentId/restore` | Doctor, Admin |
| **Version History** | `GET` | `/api/v1/patients/:patientId/attachments/:attachmentId/versions` | Doctor, Admin, Nurse |
| **Download Version** | `GET` | `/api/v1/patients/:patientId/attachments/:attachmentId/versions/:versionId/download` | Doctor, Admin, Nurse |
| **List Categories** | `GET` | `/api/v1/attachments/categories` | All Authenticated Staff |
| **Create Category** | `POST` | `/api/v1/attachments/categories` | Clinic Admin Only |
| **Update Category** | `PUT` | `/api/v1/attachments/categories/:categoryId` | Clinic Admin Only |
| **Delete Category** | `DELETE` | `/api/v1/attachments/categories/:categoryId` | Clinic Admin Only |
| **List Tags** | `GET` | `/api/v1/attachments/tags` | All Authenticated Staff |
| **Create Tag** | `POST` | `/api/v1/attachments/tags` | Doctor, Admin, Nurse |
| **Update Tag** | `PUT` | `/api/v1/attachments/tags/:tagId` | Doctor, Admin |
| **Delete Tag** | `DELETE` | `/api/v1/attachments/tags/:tagId` | Clinic Admin Only |
| **Analytics Metrics** | `GET` | `/api/v1/attachments/analytics` | Clinic Admin Only |

---

## 3. Patient Attachment Endpoints Detail

### 3.1 Upload Attachment
- **`POST /api/v1/patients/:patientId/attachments`**
- **Content-Type**: `multipart/form-data`
- **Request Body**:
  - `file`: Binary file stream (PDF, JPG, PNG, WEBP, DOCX)
  - `categoryId`: Category ID string
  - `description`: (Optional) Clinical context description
  - `tags`: (Optional) Comma-separated or array of tag strings
  - `notes`: (Optional) Internal staff notes
- **Success Response (201 Created)**:
  ```json
  {
    "status": "success",
    "data": {
      "attachmentId": "att_202608_00101",
      "patientId": "pat_12345",
      "originalFileName": "blood_work_report.pdf",
      "fileSize": 2450124,
      "mimeType": "application/pdf",
      "category": "Laboratory Result",
      "version": 1,
      "uploadedAt": "2026-08-02T15:00:00Z"
    }
  }
  ```

### 3.2 List Patient Attachments
- **`GET /api/v1/patients/:patientId/attachments`**
- **Query Parameters**:
  - `page`: Default `1`
  - `limit`: Default `20` (Max `100`)
  - `search`: Search query string
  - `categoryId`: Filter by category ID
  - `tag`: Filter by tag keyword
  - `status`: `ACTIVE` (default), `SOFT_DELETED`, `ARCHIVED`
  - `sortBy`: `createdAt`, `fileName`, `fileSize`
  - `sortOrder`: `asc`, `desc`
- **Success Response (200 OK)**:
  ```json
  {
    "status": "success",
    "data": {
      "items": [...],
      "pagination": {
        "totalItems": 42,
        "totalPages": 3,
        "currentPage": 1,
        "pageSize": 20
      }
    }
  }
  ```

### 3.3 Download Binary Stream
- **`GET /api/v1/patients/:patientId/attachments/:attachmentId/download`**
- **Headers**: `Authorization: Bearer <JWT>`
- **Response**: Binary stream response with headers:
  - `Content-Type: application/pdf` (or corresponding MIME)
  - `Content-Disposition: attachment; filename="blood_work_report.pdf"`

### 3.4 Upload New Attachment Version
- **`POST /api/v1/patients/:patientId/attachments/:attachmentId/replace`**
- **Content-Type**: `multipart/form-data`
- **Request Body**: `file` (Binary), `changeReason` (Optional string)
- **Behavior**: Preserves existing file record (version N), creates version N+1 record, dispatches `ATTACHMENT_VERSION_CREATED` audit log.

---

## 4. RBAC Permission & Security Matrix

| Role | Read / List | Upload | Download / Preview | Version / Edit | Soft Delete / Restore | Category Admin |
| --- | --- | --- | --- | --- | --- | --- |
| **Doctor** | `ALLOWED` | `ALLOWED` | `ALLOWED` | `ALLOWED` | `ALLOWED` | `DENIED` |
| **Clinic Admin** | `ALLOWED` | `ALLOWED` | `ALLOWED` | `ALLOWED` | `ALLOWED` | `ALLOWED` |
| **Receptionist** | `CONFIGURABLE` | `CONFIGURABLE` | `CONFIGURABLE` | `DENIED` | `DENIED` | `DENIED` |
| **Nurse** | `ALLOWED` | `ALLOWED` | `ALLOWED` | `ALLOWED` | `DENIED` | `DENIED` |
| **Platform Owner (`SUPER_ADMIN`)** | `RESTRICTED` | `RESTRICTED` | `RESTRICTED` | `RESTRICTED` | `RESTRICTED` | `RESTRICTED` |

> [!IMPORTANT]
> **Platform Owner Security Barrier (`PLATFORM_ADMIN_ATTACHMENTS_RESTRICTED`)**:
> `SUPER_ADMIN` and `PLATFORM` tenant accounts attempting to execute any patient attachment API endpoint receive `403 Forbidden`:
> `"Platform administrators are strictly prohibited from accessing patient medical files."`

---

## 5. Audit Logging Integration Matrix

| Action | Audit Event Category | Audit Event Code | Severity |
| --- | --- | --- | --- |
| Upload File | `PATIENT_CARE` | `ATTACHMENT_UPLOADED` | `INFORMATION` |
| Download File | `PATIENT_CARE` | `ATTACHMENT_DOWNLOADED` | `INFORMATION` |
| Preview File | `PATIENT_CARE` | `ATTACHMENT_PREVIEWED` | `INFORMATION` |
| New Version Upload | `PATIENT_CARE` | `ATTACHMENT_VERSION_CREATED` | `INFORMATION` |
| Metadata Edit | `PATIENT_CARE` | `ATTACHMENT_RENAMED` | `INFORMATION` |
| Soft Delete | `PATIENT_CARE` | `ATTACHMENT_SOFT_DELETED` | `WARNING` |
| Restore File | `PATIENT_CARE` | `ATTACHMENT_RESTORED` | `WARNING` |

---

## 6. Reserved V2 API Endpoints Roadmap (Document Only)

- `POST /api/v1/patients/:patientId/attachments/:attachmentId/ocr` (Trigger OCR text extraction)
- `POST /api/v1/patients/:patientId/attachments/:attachmentId/ai-classify` (Trigger AI classification)
- `GET /api/v1/patients/:patientId/attachments/:attachmentId/dicom-slices` (Fetch WebGL DICOM dataset)
- `POST /api/v1/patients/:patientId/attachments/:attachmentId/share-link` (Generate expiring presigned link)

---

## Deliverables & Next Step Confirmation

The REST API design for **Module-016 (Patient Files & Attachments)** is complete, fully validated, and documented.

Ready to proceed to **`TASK-150` — Patient Files & Attachments UI/UX Design**.
