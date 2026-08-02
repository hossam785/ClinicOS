# Backup & Restore UI/UX Design Specification — ClinicOS

## 1. Design System Alignment & Safety Aesthetics

The **Backup & Restore Module (Module-014)** interface is designed as a disaster recovery control center. It strictly enforces the **ClinicOS Design System** guidelines: high readability, explicit risk warnings, color-blind accessible verification badges, and zero decorative clutter.

### 1.1 Color Tokens & Integrity Badges
- **Primary Brand / Action Accent**: `#4F46E5` (Indigo-600)
- **Background & Card Containers**: `#F8FAFC` (Slate-50) / `#FFFFFF` (White) / `#0F172A` (Slate-900 Dark Mode)
- **Integrity Status Badges**:
  - `VERIFIED`: `#ECFDF5` background, `#047857` text (Emerald-50 / Emerald-700)
  - `UNVERIFIED`: `#FFFBEB` background, `#B45309` text (Amber-50 / Amber-700)
  - `CORRUPTED`: `#FEF2F2` background, `#B91C1C` text (Rose-50 / Rose-700)
  - `PRE_UPGRADE`: `#F3E8FF` background, `#6D28D9` text (Purple-50 / Purple-700)

### 1.2 Zero Emojis Policy
All iconography strictly utilizes **Lucide React SVG** components:
- `Database`, `HardDrive`, `ShieldCheck`, `ShieldAlert`, `RefreshCw`, `Download`, `Upload`, `Clock`, `AlertTriangle`, `CheckCircle2`, `XCircle`, `Lock`, `Settings`, `Activity`, `ChevronRight`, `ArrowLeft`.

---

## 2. Screen Architecture & Wireframe Specifications

### 2.1 Screen 1: Backup Center Hub (`/dashboard/backup`)
Primary disaster recovery overview presenting system health cards, action triggers, and recent backups.

```
+---------------------------------------------------------------------------------------------------------+
| Backup & Disaster Recovery Center                               [Create Manual Backup] [Restore Wizard] |
| Local offline data protection and disaster recovery control suite.                                      |
+---------------------------------------------------------------------------------------------------------+
| [ Last Successful Backup ] | [ System Health ]        | [ Disk Space Used ]      | [ Active Retention ]|
| Today, 00:00 UTC (Verified)| 100% HEALTHY (0 Failures)| 485.0 MB (2.4 GB Free)   | Last 10 Backups     |
+---------------------------------------------------------------------------------------------------------+
| RECENT BACKUP ARCHIVES                                                                [View Full History]|
+---------------------------------------------------------------------------------------------------------+
| BACKUP ID     | LABEL                 | TYPE       | CREATED AT   | SIZE     | INTEGRITY | ACTIONS      |
+---------------+-----------------------+------------+--------------+----------+-----------+--------------+
| BK-202608-001 | Daily_Auto_20260801   | AUTOMATIC  | Today 00:00  | 48.5 MB  | VERIFIED  | [Inspect]    |
| BK-202607-099 | Pre_Migration_v2.4.0  | PRE_UPGRAD | Jul 28 14:00 | 46.2 MB  | VERIFIED  | [Inspect]    |
+---------------------------------------------------------------------------------------------------------+
```

---

### 2.2 Screen 2: Backup History Roster (`/dashboard/backup/history`)
Paginated table rendering all historical backup archives with multi-filter toolbars.

```
+---------------------------------------------------------------------------------------------------------+
| Backup Execution History                                                      [Back to Backup Center]   |
+---------------------------------------------------------------------------------------------------------+
| [ Search backup ID or label... ] [ Type: ALL v ] [ Integrity: VERIFIED v ] [ Date Range Picker v ]       |
+---------------------------------------------------------------------------------------------------------+
| BACKUP ID     | LABEL                 | TYPE       | SIZE     | VERIFICATION | COMPATIBLE | ACTIONS    |
+---------------+-----------------------+------------+----------+--------------+------------+------------+
| BK-202608-001 | Daily_Auto_20260801   | AUTOMATIC  | 48.5 MB  | VERIFIED     | YES        | [Inspect]  |
| BK-202607-099 | Pre_Migration_v2.4.0  | PRE_UPGRAD | 46.2 MB  | VERIFIED     | YES        | [Inspect]  |
+---------------------------------------------------------------------------------------------------------+
| Showing 1-20 of 15 records                                                 < Previous  Page 1 of 1  Next >|
+---------------------------------------------------------------------------------------------------------+
```

---

### 2.3 Screen 3: Backup Details & Preview Modal (`BackupDetailsModal`)
Inspects complete container metadata, file information, AES-256 encryption parameters, and included modules.

```
+---------------------------------------------------------------------------------------------------------+
| Backup Archive Inspector — BK-202608-00001                                                       [ X ] |
+---------------------------------------------------------------------------------------------------------+
| Backup Label: Daily_Auto_20260801       | Backup Type: AUTOMATIC                                         |
| Creation Date: 2026-08-01 00:00:00 UTC  | Created By: usr_system                                        |
| App Version: 2.4.0 (DB Schema v14)      | Restore Compatibility: COMPATIBLE                              |
+---------------------------------------------------------------------------------------------------------+
| FILE & ENCRYPTION PROPERTIES                                                                            |
| File Name: BK-202608-00001.cbk | Size: 48.5 MB | Encryption: AES-256-GCM (Argon2id Key Derivation)       |
| Checksum (SHA-256): a3f5b8c9d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8                      |
+---------------------------------------------------------------------------------------------------------+
| INCLUDED MODULES DATA SCOPE                                                                             |
| [x] Database Collections   [x] Patients & Charts   [x] Appointments   [x] Prescriptions                 |
| [x] Medical Records        [x] Financial Accounts  [x] Audit Logs     [x] Local Files & Attachments     |
+---------------------------------------------------------------------------------------------------------+
| [ Verify Checksum Integrity ]                                                [ Restore Backup ] [ Close ]|
+---------------------------------------------------------------------------------------------------------+
```

---

### 2.4 Screen 4: Safe Disaster Restore Wizard Modal (`RestoreWizardModal`)
7-Step guided wizard enforcing safety checks, warnings, confirmation inputs, and mandatory safety pre-restore snapshots.

```
+---------------------------------------------------------------------------------------------------------+
| System Disaster Restore Wizard — Step 4 of 7: Safety Snapshot Creation                           [ X ] |
+---------------------------------------------------------------------------------------------------------+
| Target Backup Archive: BK-202608-00001 (Daily_Auto_20260801)                                            |
| Warning: Restoring will replace your current active database collections and local attachment files.    |
+---------------------------------------------------------------------------------------------------------+
| Mandatory Pre-Restore Safety Snapshot Generation:                                                       |
| [==============================================>         ] 82% Creating EMERGENCY_SAFETY_PRE_RESTORE    |
| (Ensures 100% automatic rollback capability in case of restore failure).                                |
+---------------------------------------------------------------------------------------------------------+
| [ Cancel Restore ]                                                             [ Proceed to Step 5 > ]  |
+---------------------------------------------------------------------------------------------------------+
```

---

### 2.5 Screen 5: Verification & Integrity Center (`/dashboard/backup/verify`)
Integrity verification log table rendering SHA-256 digest checks and pre-restore validation history.

```
+---------------------------------------------------------------------------------------------------------+
| Cryptographic Integrity & Verification Center                                                           |
+---------------------------------------------------------------------------------------------------------+
| VERIFICATION ID | BACKUP ID     | TYPE        | CHECKSUM RESULT | DB SCHEMA CHECK | VERIFIED AT          |
+-----------------+---------------+-------------+-----------------+-----------------+----------------------+
| VRF-202608-001  | BK-202608-001 | PRE_RESTORE | PASSED (SHA-256)| PASSED (v14)    | Today 14:29 UTC      |
| VRF-202608-002  | BK-202607-099 | MANUAL      | PASSED (SHA-256)| PASSED (v14)    | Jul 28 14:01 UTC     |
+---------------------------------------------------------------------------------------------------------+
```

---

### 2.6 Screen 6: Retention Policy & Schedule Configurator (`/dashboard/backup/retention`)
Configuration view for setting automatic backup schedules, retention thresholds, and disk storage alerts.

```
+---------------------------------------------------------------------------------------------------------+
| Retention Governance & Schedule Configuration                                                           |
+---------------------------------------------------------------------------------------------------------+
| Retention Policy Mode:  (o) Last 5 Backups     ( ) Last 10 Backups     ( ) Last 20     ( ) Unlimited    |
| Automatic Schedule:     ( ) Off   (o) Daily (Midnight)   ( ) Weekly   ( ) Monthly                     |
| Storage Auto-Cleanup:   [x] Automatically purge unverified backups beyond retention limit               |
| Invariant Notice:       The newest verified backup is permanently protected from automatic deletion.     |
+---------------------------------------------------------------------------------------------------------+
| [ Save Configuration ]                                                                                  |
+---------------------------------------------------------------------------------------------------------+
```

---

### 2.7 Screen 7: Backup Statistics Overview (`/dashboard/backup/stats`)
Aggregated metrics, backup health distribution, storage consumption trends, and restore execution counts.

```
+---------------------------------------------------------------------------------------------------------+
| Backup Analytics & System Health Overview                                                               |
+---------------------------------------------------------------------------------------------------------+
| [ Total Backups ]       | [ Verified Integrity ]  | [ Corrupted Archives ]   | [ Total Restores ]      |
| 15                      | 14                      | 0                        | 1                        |
+---------------------------------------------------------------------------------------------------------+
```

---

## 3. Dashboard Integration Security Widgets

1. **Backup Health Card Widget**: Rendered on Clinic Manager dashboard displaying Last Backup Date, Integrity Badge (`VERIFIED`), Storage Consumption, and Next Scheduled Backup.
2. **Backup Failure Warning Banner Widget**: Rendered if an automatic backup fails or if no backup has been performed in > 7 days.

---

## 4. Multi-Stage Progress Indicators, Skeletons, Empty & Error States

- **Multi-Stage Progress Indicator**:
  1. Packaging Database Collections
  2. Compressing Asset Archive
  3. Generating AES-256 Encryption Key
  4. Computing SHA-256 Checksum Manifest
  5. Generating Safety Pre-Restore Snapshot
  6. Restoring Database Collections
  7. Finalizing Post-Restore Verification
- **Empty States**:
  - *No Backups*: "Zero Backup Archives Found. Click 'Create Manual Backup' to protect clinic data."
  - *No Restore History*: "Zero restore operations executed. System operating under original snapshot."
- **Error Banners**:
  - *Permission Denied (403)*: Shield icon with message: "Access Restricted: Backup and restore operations require Clinic Manager privileges."
  - *Checksum Validation Failed*: Alert banner: "SHA-256 Checksum Mismatch: Container file has been corrupted or modified. Restore blocked."

---

## 5. WCAG 2.1 AA Accessibility Standards

1. **Keyboard Focus & Navigation**: Every interactive button, filter dropdown, and modal trigger features `focus-visible:ring-2 focus-visible:ring-indigo-600`. Full keyboard navigation supported (`Tab`, `Shift+Tab`, `Enter`, `Escape`).
2. **Screen Reader ARIA Attributes**:
   - `aria-label="Backup Management Roster Table"`
   - `aria-live="polite"` for multi-stage backup/restore progress announcements.
   - `aria-describedby` for risk warning modals.
3. **Color Contrast**: Text tokens achieve >= 4.5:1 contrast against backgrounds.
4. **Touch & Click Targets**: Minimum 44x44px target area on all interactive controls.

---

## 6. Responsive Layout Grid

- **Desktop (Primary 1440px+)**: Full 6-card dashboard overview with inline multi-filter history roster and side-by-side restore wizard preview.
- **Laptop (1024px - 1439px)**: Compact 4-card overview with collapsible filter toolbar.
- **Tablet (768px - 1023px)**: Card roster view with full-screen restore wizard modal.
- **Mobile (< 768px)**: Deferred to future mobile admin build.

---

## 7. Reserved Future UI Extension Slots (V2 Architecture)

1. **Cloud Storage Provider Selector**: Connectors for Google Drive, Microsoft OneDrive, Dropbox, and Amazon S3.
2. **Delta Incremental Backup Progress Bar**: Block-level delta compression metrics.
3. **NAS Target Replication Status Tag**: Local network storage replication status badge.
