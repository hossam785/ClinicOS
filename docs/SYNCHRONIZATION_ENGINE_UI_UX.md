# Desktop Offline Synchronization Engine UI/UX Design Specification

## Module Overview

This document specifies the complete UI/UX design system, information architecture, component specifications, state catalog, and accessibility standards for the **Desktop Offline Synchronization Engine** (Module-018).

The user experience follows an **Invisible Offline-First UX Paradigm**:
- **Daily Operations**: During regular clinic work, synchronization is completely invisible and non-intrusive.
- **Persistent Header Badge**: A subtle status badge in the global navigation top-bar communicates real-time connectivity and sync health.
- **Synchronization Center**: A dedicated enterprise administration dashboard accessible to Clinic Admins and Doctors for monitoring operation queues, resolving conflicts, reviewing file transfers, and inspecting system diagnostics.

---

## Global UX Principles

1. **Zero Interruptions**: Clinical workflows (patient intake, medical note editing, prescription issuing) are never blocked or paused by sync operations.
2. **Transparent Connectivity**: The system always provides clear, non-technical feedback regarding internet connectivity and synchronization status.
3. **Deterministic Conflict Resolution**: Side-by-side visual diffing allows authorized users to inspect local vs. remote record changes before applying resolutions.
4. **Zero Emojis Policy**: All visual indicators use curated HSL color pills and approved Lucide React SVG iconography (`RefreshCw`, `Wifi`, `WifiOff`, `AlertTriangle`, `CheckCircle2`, `HardDrive`, `ShieldCheck`).
5. **Full WCAG 2.1 AA Compliance**: Keyboard shortcuts, ARIA live regions for sync progress, screen reader support, and high-contrast color palettes.

---

## Information Architecture & Layout Structure

```
[ClinicOS Top Bar Navigation]
└── Persistent Sync Status Indicator Badge (`Offline` | `Synced` | `Syncing...` | `Conflict`)
    └── Click -> Opens [Synchronization Center Workspace]

[Synchronization Center Workspace]
├── 1. Header & Quick Actions Bar ("Sync Now", Rebuild Index, Diagnostic Check)
├── 2. Status Overview Metrics Cards (Sync State, Last Sync Time, Pending Queue, Conflicts)
├── 3. Tabbed Administration Workspace:
│   ├── Tab 1: Operation Queue Monitor (Pending, Upload, Download, Retry, Failed)
│   ├── Tab 2: Conflict Resolution Center (Side-by-side Version Diffing)
│   ├── Tab 3: File Attachment Transfer Monitor (Resumable Chunk Progress)
│   ├── Tab 4: Registered Device Status & License Identity
│   ├── Tab 5: Historical Sync Logs & Cryptographic Audit Records
│   ├── Tab 6: System Diagnostics & Connection Repair Tools
│   └── Tab 7: Multi-Tenant Sync Configuration Settings
```

---

## Component Specifications

### 1. Global Persistent Sync Indicator Badge
Located in the top right header navigation next to user profile menu:

- **Idle / Synced State**: Emerald green dot + `Synced — 100% Up to Date` (`CheckCircle2` icon).
- **Synchronizing State**: Animated blue spinning ring + `Syncing (3 items)...` (`RefreshCw` spinning icon).
- **Offline State**: Slate gray badge + `Offline Mode (Local Autonomy)` (`WifiOff` icon).
- **Conflict State**: Amber badge + `1 Conflict Needs Review` (`AlertTriangle` icon).
- **Error State**: Rose red badge + `Sync Error — Click to Diagnose` (`AlertCircle` icon).

---

### 2. Status Overview Cards
Grid of 4 high-density metric summary cards at top of Synchronization Center:

1. **Connection & State Card**:
   - Status: `ONLINE & AUTHENTICATED` (Emerald Badge).
   - Device: `Dr. Mansoor PC (Room 1)`.
   - Protocol: TLS 1.3 encrypted JWT.
2. **Queue Health Card**:
   - Pending Mutations: `0 Items`.
   - Retry Pending: `0 Items`.
   - Health: `100% Optimal`.
3. **Conflict Monitor Card**:
   - Unresolved Conflicts: `0 Conflicts` (or `1 Pending Resolution`).
   - Conflict Policy: `Desktop Wins (Clinical Notes)`.
4. **Last Sync Execution Card**:
   - Last Sync: `2 minutes ago (19:30:00)`.
   - Duration: `2.15 seconds`.
   - Payload: `4 uploaded, 1 downloaded`.

---

### 3. Queue Monitor Component
Table interface displaying enqueued mutations in SQLite `sync_queue`:

- **Columns**: `Priority`, `Entity Type`, `Entity Title / ID`, `Operation`, `Status`, `Retry Count`, `Enqueued At`, `Actions`.
- **Status Pills**:
  - `WAITING`: Slate badge.
  - `UPLOADING`: Blue pulse badge.
  - `RETRY_PENDING`: Amber badge with countdown (`Retrying in 12s`).
  - `FAILED`: Rose badge with "Retry" action button.
- **Bulk Actions**: `Retry All Failed Items`, `Clear Completed History`.

---

### 4. Conflict Resolution Center Component
Interactive visual diffing tool for resolving entity version divergence:

- **Split View Layout**:
  - **Left Card (Local Desktop Record)**: Highlighted in blue, showing local point-of-care attributes.
  - **Right Card (Remote Cloud Record)**: Highlighted in purple, showing server attributes.
- **Diff Highlighting**: Changed attributes (e.g. Phone Number, Appointment Time) highlighted in yellow.
- **Action Buttons**:
  - `Keep Desktop Version` (Applies local version to cloud).
  - `Use Server Version` (Overwrites local version with cloud data).
  - `Manual Merge` (Opens field-by-field selector).

---

### 5. File Attachment Transfer Monitor Component
Dedicated progress view for large binary uploads (X-rays, lab PDFs):

- **Progress Cards**:
  - File Name: `Chest_XRay_Ahmed_Ali.dicom` (25 MB).
  - Progress Bar: Animated 60% completion (`Chunk 3 of 5 Uploaded`).
  - Speed: `1.2 MB/s` — `10 seconds remaining`.
  - Controls: `Pause Upload`, `Cancel Upload`.

---

### 6. Configuration Settings Screen
Form controls for authorized Clinic Admins:

- `Automatic Background Sync`: Toggle Switch (Default: ON).
- `Sync Interval`: Select Dropdown (`30s`, `60s`, `5m`, `15m`).
- `Sync File Attachments`: Toggle Switch (Default: ON).
- `Bandwidth Limit`: Select Dropdown (`Unlimited`, `10 Mbps`, `5 Mbps`).
- `Conflict Policy Default`: Select Dropdown (`Entity Standard`, `Desktop Wins`, `Server Wins`).

---

## State Catalog (Empty, Loading, Error States)

- **Empty Queue State**: Clean empty state card with `CheckCircle2` icon and subtitle: *"Operation queue is empty. All local desktop changes are synchronized with the cloud."*
- **Empty Conflicts State**: Clean card with `ShieldCheck` icon: *"No sync conflicts detected."*
- **Loading Skeleton State**: Shimmering skeleton cards for metrics and tables while fetching sync status.
- **Error State**: Rose banner for connection drops: *"Unable to reach cloud synchronization gateway. Application will continue running offline. Outgoing changes are queued locally."*

---

## Lucide SVG Iconography Mapping

- Status Ready: `<CheckCircle2 className="w-4 h-4 text-emerald-500" />`
- Status Syncing: `<RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />`
- Status Offline: `<WifiOff className="w-4 h-4 text-slate-400" />`
- Status Warning / Conflict: `<AlertTriangle className="w-4 h-4 text-amber-500" />`
- Status Error: `<AlertCircle className="w-4 h-4 text-rose-500" />`
- Storage / Database: `<HardDrive className="w-4 h-4 text-primary-500" />`
- Security Shield: `<ShieldCheck className="w-4 h-4 text-emerald-600" />`

---

## Accessibility Standards (WCAG 2.1 AA)

- **Keyboard Shortcut**: `Ctrl + Shift + S` opens the Synchronization Center workspace.
- **Screen Reader Announcements**: `aria-live="polite"` region announces sync completion without grabbing focus.
- **Color Contrast**: All badge text and metric numbers meet minimum 4.5:1 contrast ratio against card backgrounds.
- **Focus Management**: Focus trapped inside Conflict Resolution Modal when reviewing side-by-side diffs.

---

## Future UI Extensions (V2 Roadmap)

- **Multi-Device Mesh LAN Topology Visualizer**: Graphical map showing peer-to-peer connection nodes between desktop PCs in the clinic.
- **WebSocket Real-Time Live Stream Feed**: Ticker stream showing live incoming online booking events.
