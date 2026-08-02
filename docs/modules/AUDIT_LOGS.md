# Audit Logs Module Specification — ClinicOS

## 1. Executive Summary & Module Overview

The **Audit Logs Module (Module-013)** provides an enterprise-grade, immutable, tamper-evident security, operational, and compliance audit trail for **ClinicOS**. It records every critical action executed across all core functional modules (Authentication, Users, Patients, Appointments, Medical Records, Prescriptions, Expenses, Doctor Financial Accounts, Notifications, Reports, and System Administration).

Audit logs serve accountability, security investigations, forensic incident tracing, and regulatory compliance (HIPAA / GDPR audit logging standards). They are read-only, non-modifiable records of system events.

---

## 2. Core Business Goals

1. **Security & Forensic Investigations**: Enable security officers and clinic administrators to investigate security incidents, unauthorized access attempts, and account lockouts.
2. **User Activity Tracking**: Maintain a clear timeline of user activities, configuration changes, and administrative overrides.
3. **Data Integrity & Modification Tracing**: Track creation, updates, archiving, and restoration of system entities with sanitized state diff summaries.
4. **Regulatory Compliance**: Fulfill healthcare compliance mandates requiring immutable logging of medical record accesses and financial transactions.
5. **Offline Synchronization Audit**: Maintain a transparent audit trail of offline desktop operations and subsequent cloud synchronization events.

---

## 3. Comprehensive Audit Event Catalog

### 3.1 Authentication Events
| Event Code | Severity | Description | Triggering Action |
| --- | --- | --- | --- |
| `AUTH_LOGIN_SUCCESS` | `INFORMATION` | User successfully authenticated | Valid credentials submitted |
| `AUTH_LOGIN_FAILED` | `WARNING` | Failed authentication attempt | Invalid password or user email |
| `AUTH_LOGOUT` | `INFORMATION` | User terminated active session | Explicit logout action |
| `AUTH_PASSWORD_CHANGED` | `WARNING` | User updated account password | Password update form submitted |
| `AUTH_PASSWORD_RESET_REQ` | `INFORMATION` | Password reset link requested | Forgot password initiated |
| `AUTH_PASSWORD_RESET_SUCCESS` | `WARNING` | Password successfully reset | Valid reset token consumed |
| `AUTH_SESSION_EXPIRED` | `INFORMATION` | Session token expired automatically | JWT expiration reached |
| `AUTH_ACCOUNT_LOCKED` | `CRITICAL` | User account locked due to failed attempts | Failed login count exceeded threshold |

### 3.2 User Management Events
| Event Code | Severity | Description | Triggering Action |
| --- | --- | --- | --- |
| `USER_CREATED` | `INFORMATION` | New user account created | Admin adds staff/doctor account |
| `USER_UPDATED` | `INFORMATION` | User profile or details updated | Profile edit saved |
| `USER_DELETED` | `WARNING` | User account deleted/archived | User removal confirmed |
| `USER_ROLE_CHANGED` | `CRITICAL` | User authorization role modified | Administrative role reassignment |
| `USER_PERMISSION_CHANGED` | `CRITICAL` | Fine-grained permissions updated | Custom permission toggled |

### 3.3 Patient Management Events
*(Strict Requirement: Zero medical condition or diagnostic data stored in log entries; metadata only)*
| Event Code | Severity | Description | Triggering Action |
| --- | --- | --- | --- |
| `PATIENT_CREATED` | `INFORMATION` | New patient registered | Patient intake form saved |
| `PATIENT_UPDATED` | `INFORMATION` | Patient demographic details updated | Profile update saved |
| `PATIENT_ARCHIVED` | `WARNING` | Patient profile archived | Archive action confirmed |
| `PATIENT_RESTORED` | `INFORMATION` | Archived patient profile restored | Restore action confirmed |

### 3.4 Appointment Management Events
| Event Code | Severity | Description | Triggering Action |
| --- | --- | --- | --- |
| `APPOINTMENT_CREATED` | `INFORMATION` | New appointment scheduled | Booking created |
| `APPOINTMENT_UPDATED` | `INFORMATION` | Appointment details modified | Booking modified |
| `APPOINTMENT_CANCELLED` | `WARNING` | Appointment cancelled | Cancellation submitted |
| `APPOINTMENT_RESCHEDULED` | `INFORMATION` | Appointment time slot updated | Reschedule saved |
| `PATIENT_CHECKED_IN` | `INFORMATION` | Patient marked as arrived in waiting room | Reception check-in click |
| `CONSULTATION_STARTED` | `INFORMATION` | Doctor initiated visit consultation | Doctor opens active visit |
| `CONSULTATION_COMPLETED` | `INFORMATION` | Doctor finalized visit consultation | Doctor marks visit complete |

### 3.5 Medical Records Events
*(Strict Requirement: Never duplicate medical content; log action metadata and record IDs only)*
| Event Code | Severity | Description | Triggering Action |
| --- | --- | --- | --- |
| `VISIT_RECORD_CREATED` | `INFORMATION` | Clinical visit encounter created | Doctor saves initial clinical note |
| `VISIT_RECORD_UPDATED` | `INFORMATION` | Clinical note or diagnosis updated | Doctor saves note edit |
| `MEDICAL_RECORD_ACCESSED` | `WARNING` | User viewed medical history | User opens patient record inspector |
| `MEDICAL_RECORD_PRINTED` | `WARNING` | Clinical record document printed | Print action triggered |

### 3.6 Prescription Management Events
*(Strict Requirement: Zero drug lists or dosages stored in log entries; metadata only)*
| Event Code | Severity | Description | Triggering Action |
| --- | --- | --- | --- |
| `PRESCRIPTION_CREATED` | `INFORMATION` | New prescription issued | Doctor signs prescription |
| `PRESCRIPTION_UPDATED` | `INFORMATION` | Prescription updated | Doctor edits active prescription |
| `PRESCRIPTION_PRINTED` | `INFORMATION` | Prescription PDF printed | Print action executed |

### 3.7 Financial Operations Events
| Event Code | Severity | Description | Triggering Action |
| --- | --- | --- | --- |
| `EXPENSE_CREATED` | `INFORMATION` | Operating expense recorded | Staff adds expense item |
| `EXPENSE_UPDATED` | `INFORMATION` | Expense details modified | Staff edits expense item |
| `EXPENSE_PAID` | `INFORMATION` | Expense marked as paid | Payment executed |
| `DOCTOR_SETTLEMENT_CREATED` | `INFORMATION` | Doctor settlement statement generated | Manager computes payout |
| `DOCTOR_SETTLEMENT_PAID` | `WARNING` | Doctor settlement funds disbursed | Manager confirms payout |

### 3.8 System & Data Operations Events
| Event Code | Severity | Description | Triggering Action |
| --- | --- | --- | --- |
| `BACKUP_STARTED` | `INFORMATION` | Database backup process initiated | Scheduled or manual trigger |
| `BACKUP_COMPLETED` | `INFORMATION` | Backup successfully completed | Backup job finished |
| `BACKUP_FAILED` | `CRITICAL` | Backup process failed | Storage error or timeout |
| `RESTORE_STARTED` | `CRITICAL` | Database restore initiated | Disaster recovery started |
| `RESTORE_COMPLETED` | `CRITICAL` | Database restore finalized | Data restore completed |
| `SYNC_STARTED` | `INFORMATION` | Offline sync process started | Reconnection sync initiated |
| `SYNC_COMPLETED` | `INFORMATION` | Offline sync successfully completed | Batch queue processed |
| `SYNC_FAILED` | `ERROR` | Offline sync failed | Network or conflict error |

### 3.9 Administrative Events
| Event Code | Severity | Description | Triggering Action |
| --- | --- | --- | --- |
| `SETTINGS_CHANGED` | `WARNING` | System/Clinic configuration modified | Manager edits clinic settings |
| `LICENSE_UPDATED` | `CRITICAL` | License key or tier updated | License renewal applied |
| `CLINIC_PROFILE_UPDATED` | `INFORMATION` | Clinic profile details updated | Profile edit saved |

---

## 4. Audit Record Field Schema

Each immutable audit log entry contains:

```typescript
export interface AuditLogRecord {
  _id: string                      // Unique UUID / BSON ID
  tenantId: string                 // Scoped multi-tenant identifier
  clinicId: string                 // Specific clinic branch identifier
  eventId: string                  // Business event code (e.g. AUTH_LOGIN_SUCCESS)
  severity: 'INFORMATION' | 'WARNING' | 'ERROR' | 'CRITICAL'
  module: 'AUTH' | 'USERS' | 'PATIENTS' | 'APPOINTMENTS' | 'MEDICAL_RECORDS' | 'PRESCRIPTIONS' | 'EXPENSES' | 'DOCTOR_FINANCIALS' | 'SYSTEM' | 'CLINIC'
  action: string                   // Standardized action verb (e.g. CREATE, UPDATE, DELETE, ACCESS, EXPORT)
  entityType: string               // Target entity class (e.g. User, Patient, Appointment)
  entityId: string                 // Target entity primary key
  userId: string                   // Actor user ID
  userRole: string                 // Actor role (e.g. ClinicAdmin, Doctor)
  previousStateSummary?: Record<string, unknown> // Sanitized diff summary before change
  newStateSummary?: Record<string, unknown>      // Sanitized diff summary after change
  ipAddress?: string               // Client IP address (online mode)
  deviceInformation: {
    userAgent?: string
    clientVersion?: string
    operatingSystem?: string
  }
  operatingMode: 'ONLINE' | 'OFFLINE'
  synchronizationStatus: 'SYNCED' | 'PENDING_SYNC' | 'SYNC_CONFLICT_RESOLVED'
  correlationId: string            // Request tracing UUID
  timestamp: string                // ISO 8601 UTC timestamp of original execution
}
```

---

## 5. Security & Permission Scoping Matrix (RBAC)

| User Role | Audit Log Viewing Scope | Allowed Actions |
| --- | --- | --- |
| `SUPER_ADMIN` (Platform Owner) | **PLATFORM System Logs ONLY** | View global platform system events. **Strictly prohibited** from viewing clinic operational or medical logs. |
| `ClinicOwner` | Full Clinic Audit Logs | Read-only search, filter, inspect, export clinic audit logs. |
| `ClinicAdmin` / `ClinicManager` | Full Clinic Audit Logs | Read-only search, filter, inspect, export clinic audit logs. |
| `Doctor` | Personal Security Events Only | View own login history and account security events (if enabled by clinic policy). |
| `Receptionist` / `Nurse` | **NO ACCESS** | Access Denied (`403 Forbidden`). |

---

## 6. Offline Architecture & Synchronization Requirements

1. **Local Storage**: When the desktop application operates offline, audit events are recorded immediately in local SQLite `local_audit_logs`.
2. **Cryptographic Integrity**: Local logs are signed with a local HMAC SHA-256 digest to prevent local tampering or editing.
3. **Reconnection Synchronization**: Upon network reconnection, local audit records are transmitted to the backend. Original execution timestamps (`timestamp`) are strictly preserved.
4. **Zero Data Loss Guarantee**: Audit event creation operates in a non-blocking background queue with retry persistence to ensure 0 lost audit events.

---

## 7. Mandatory Business Rules

1. **Immutability**: Audit records are read-only. No API endpoint or database operation permits updating, editing, or deleting audit entries.
2. **Exact Action Logging**: Every critical action generates exactly 1 audit event.
3. **Tenant & Clinic Scoping**: Audit log queries must include validated `tenantId` and `clinicId` context. Cross-tenant queries are blocked.
4. **Sanitization**: Password strings, JWT tokens, credit card numbers, and raw PII values are stripped before log creation.

---

## 8. Reserved Future Extension Points (V2 Architecture)

1. **SIEM Integration**: Forwarding audit events via Syslog/CEF format to enterprise SIEM platforms (Splunk, Datadog).
2. **Automated AI Threat Detection**: Real-time anomaly detection for credential stuffing, out-of-hours mass data exports, or suspicious privilege escalation attempts.
3. **Cryptographic Ledger Signatures**: Blockchain/Merkle tree cryptographic hashing per audit block for verifiable legal proof of immutability.
