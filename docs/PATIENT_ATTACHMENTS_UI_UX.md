# Module-016 — Patient Files & Attachments UI/UX Design

## Executive Summary

The **Patient Files & Attachments UI/UX Specification** defines the visual design system, component inventory, wireframe layouts, responsive behaviors, accessibility standards, and state catalogs for Module-016.

The design creates a seamless enterprise document management experience directly integrated inside the patient's Electronic Medical Record (EMR). All visual elements adhere strictly to the ClinicOS Design DNA, WCAG 2.1 AA accessibility guidelines, Lucide React SVG iconography, and the **Zero Emojis Policy**.

---

## 1. Information Architecture & Main Layout Hierarchy

The attachment management interface resides inside the patient profile as a dedicated tab:

```
[Patient Profile View]
  ├── Profile Header (Name, MRN, Avatar, Medical Flags)
  ├── Sub-Navigation Bar
  │     ├── Clinical Records
  │     ├── Appointments
  │     ├── Prescriptions
  │     └── [Attachments & Files] (Active Tab)
  │
  └── [Attachments Main Container]
        ├── Summary Header (Total Files, Storage Quota, Action Buttons)
        ├── Search & Filter Bar (Text Search, Category Dropdown, Tags, Sort)
        ├── View Switcher (Grid View / List View)
        ├── [Attachment Roster Grid / List]
        ├── [Interactive Preview Modal] (Lightbox for Images / PDF Viewer)
        ├── [Version History Drawer]
        └── [Clinical Activity Timeline]
```

---

## 2. 10 Reusable UI Component Specifications

### 1. `AttachmentSummaryHeader`
- **Purpose**: Render document stats, storage usage progress bar, and primary actions.
- **Visual Elements**:
  - Storage Progress Bar (`bg-primary-600`, percentage indicator).
  - Total Files Badge (`FileText` icon).
  - Primary Action Button: `"Upload File"` (`Plus` icon, `bg-primary-600`).
  - Secondary Action Button: `"Categories"` (`Folder` icon, `variant="outline"`).
  - Refresh Button: (`RefreshCw` icon).

### 2. `AttachmentFilterBar`
- **Purpose**: Provide real-time filtering, search, and sorting controls.
- **Visual Elements**:
  - Search Input with `Search` prefix icon and clear button.
  - Category Select Dropdown with color badge indicators.
  - Tag Filter Pills with active highlight (`bg-primary-100 text-primary-800`).
  - Sort Dropdown (`Newest First`, `Oldest First`, `File Name`, `File Size`).
  - Toggle Switches for `Favorites Only` (`Star` icon) and `Trash` (`Trash2` icon).

### 3. `AttachmentGridCard`
- **Purpose**: High-impact visual card displaying file thumbnail, title, and metadata.
- **Visual Elements**:
  - Thumbnail Box: High-resolution image preview OR file type SVG icon (`FilePdf`, `FileText`, `Image`).
  - Category Chip: HSL/Hex color background with category label.
  - File Title: Truncated 1-line text with full tooltip.
  - Version Badge: Pill badge displaying `v1`, `v2`, `v3`.
  - Subtext: File size (e.g. `2.4 MB`) and upload date (`02 Aug 2026`).
  - Quick Action Overflow Menu (`MoreVertical` icon): `Preview`, `Download`, `Upload New Version`, `Rename`, `Change Category`, `Delete`.

### 4. `AttachmentListRow`
- **Purpose**: Compact tabular row for dense file listings.
- **Columns**: `File Icon`, `File Name & Tags`, `Category`, `Version`, `File Size`, `Uploaded By & Date`, `Actions`.

### 5. `AttachmentUploadModal`
- **Purpose**: 5-step guided upload modal with drag-and-drop support.
- **Steps**:
  - **Step 1 (File Selection)**: Drag-and-drop zone (`UploadCloud` icon) supporting multi-file pick.
  - **Step 2 (Validation)**: Client-side MIME & file size limit check with error highlights.
  - **Step 3 (Category)**: Select document category from dropdown.
  - **Step 4 (Context)**: Optional description text area.
  - **Step 5 (Tagging & Upload)**: Add tags and trigger upload progress bar.

### 6. `AttachmentPreviewModal`
- **Purpose**: Full-screen or lightbox preview for supported formats.
- **Behaviors**:
  - **Images (JPG, PNG, WEBP)**: Lightbox container with zoom-in, zoom-out, rotate, and reset actions.
  - **PDF Documents**: Embedded PDF canvas with page navigation, zoom, and text search.
  - **Unsupported Formats (DOCX, ZIP)**: Metadata summary card with file hash and download button.

### 7. `AttachmentVersionDrawer`
- **Purpose**: Side drawer listing historic document versions.
- **Visual Elements**: Vertical timeline showing version sequence (`v3` Active, `v2` Historical, `v1` Historical), uploader details, change reason, and one-click historic download button.

### 8. `AttachmentCategoryManagerModal`
- **Purpose**: Clinic Admin category management interface.
- **Visual Elements**: Category list with color picker, SVG icon selector, display reorder handles (`GripVertical`), active toggle switch, and "Add Category" form.

### 9. `AttachmentTagInput`
- **Purpose**: Interactive tag pill editor with autocomplete suggestions.

### 10. `AttachmentStorageWidget`
- **Purpose**: Compact dashboard widget displaying storage quotas, largest files list, and recent uploads telemetry.

---

## 3. Comprehensive State Catalog

| State | Visual Feedback | Design System Elements |
| --- | --- | --- |
| **Initial Loading** | Animated Skeleton Cards | 6 Skeleton grid cards with `animate-pulse` shimmer |
| **Empty Roster** | Friendly Illustration & Text | `FolderOpen` SVG icon, text: *"No attachments found for this patient"*, Upload Button |
| **Search Empty** | Reset Filter Prompt | `SearchX` SVG icon, text: *"No attachments match your filter"*, Reset Filters Button |
| **Upload Error** | Error Banner | `AlertTriangle` icon, red border `border-red-500`, clear error message |
| **Storage Warning** | Warning Quota Badge | Yellow alert banner: *"Storage quota at 90% capacity"*, Manage Storage Link |

---

## 4. Accessibility Standards (WCAG 2.1 AA)

- **Keyboard Navigation**: Full `Tab` focus ring indicators (`ring-2 ring-primary-500 ring-offset-2`).
- **Modal Dialogs**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, focus trap enabled.
- **Screen Reader Support**: All icons rendered with `aria-hidden="true"` and accompanying `sr-only` descriptive text.
- **Contrast**: Minimum 4.5:1 text-to-background contrast ratio across light and dark modes.

---

## 5. Responsive Layout Strategy

- **Desktop (>= 1280px)**: 4-column attachment card grid with side preview drawer.
- **Laptop (1024px - 1279px)**: 3-column attachment card grid with modal preview.
- **Tablet (768px - 1023px)**: 2-column attachment grid.
- **Mobile (< 768px)**: 1-column attachment list with sticky bottom camera capture & upload bar.

---

## 6. Reserved V2 UI Extensions (Document Only)

- **OCR Text Inspector Panel**: Side panel displaying extracted text overlay next to PDF viewer.
- **AI Auto-Categorization Banner**: Top banner proposing AI-detected category with "Approve" button.
- **WebGL DICOM Viewer**: Multi-slice 3D medical image viewing modal.
- **Expiring Share Link Modal**: Time-bound share link generator with copy link action.

---

## Deliverables & Next Step Confirmation

The UI/UX design specification for **Module-016 (Patient Files & Attachments)** is complete, fully validated, and documented.

Ready to proceed to **`TASK-151` — Patient Files & Attachments Frontend Implementation**.
