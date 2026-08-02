// Audit Logs Domain Types & Document Interfaces — ClinicOS

export type AuditSeverity = 'INFORMATION' | 'WARNING' | 'ERROR' | 'CRITICAL'

export type AuditModule =
  | 'AUTH'
  | 'USERS'
  | 'PATIENTS'
  | 'APPOINTMENTS'
  | 'MEDICAL_RECORDS'
  | 'PRESCRIPTIONS'
  | 'EXPENSES'
  | 'DOCTOR_FINANCIALS'
  | 'SYSTEM'
  | 'CLINIC'

export type AuditEventCategory =
  | 'AUTHENTICATION'
  | 'USER_MANAGEMENT'
  | 'PATIENT_CARE'
  | 'CLINICAL'
  | 'FINANCIAL'
  | 'SYSTEM_SECURITY'
  | 'ADMINISTRATION'

export type OperatingMode = 'ONLINE' | 'OFFLINE'
export type SyncStatus = 'SYNCED' | 'PENDING_SYNC' | 'SYNC_CONFLICT_RESOLVED'
export type ExportFormat = 'PDF' | 'EXCEL' | 'CSV'

export interface DeviceInformation {
  ipAddress?: string
  userAgent?: string
  operatingSystem?: string
  clientVersion?: string
  machineIdentifier?: string
}

export interface IAuditLogRecord {
  _id?: string
  auditNumber: string
  tenantId: string
  clinicId: string
  userId: string
  userRole: string
  userDisplayName: string
  module: AuditModule
  eventCategory: AuditEventCategory
  entityType: string
  entityId: string
  action: string
  severity: AuditSeverity
  previousStateSummary?: Record<string, unknown>
  newStateSummary?: Record<string, unknown>
  correlationId: string
  sessionId?: string
  requestId?: string
  deviceInformation?: DeviceInformation
  operatingMode: OperatingMode
  syncStatus: SyncStatus
  syncVersion?: number
  synchronizedAt?: Date
  eventTimestamp: Date
  createdAt?: Date
  updatedAt?: Date
}

export interface AuditFilterParams {
  page?: number
  limit?: number
  module?: AuditModule | 'ALL'
  severity?: AuditSeverity | 'ALL'
  action?: string
  userId?: string
  entityType?: string
  entityId?: string
  startDate?: string
  endDate?: string
  search?: string
  operatingMode?: OperatingMode | 'ALL'
}

export interface AuditStatisticsData {
  totalEventsCount: number
  severityBreakdown: {
    INFORMATION: number
    WARNING: number
    ERROR: number
    CRITICAL: number
  }
  moduleBreakdown: Array<{ module: AuditModule; count: number }>
  synchronizationStats: {
    pendingSyncCount: number
    syncedCount: number
  }
}

export interface ExportAuditPayload {
  exportFormat: ExportFormat
  filterParams?: AuditFilterParams
}

export interface ExportAuditResult {
  exportNumber: string
  downloadUrl: string
  format: ExportFormat
  fileName: string
}

export interface SyncAuditPayload {
  queuedAuditLogs: Array<{
    clientRequestId: string
    auditNumber: string
    module: AuditModule
    action: string
    severity: AuditSeverity
    entityType: string
    entityId: string
    eventTimestamp: string
    hmacSignature: string
  }>
}

export interface SyncAuditResult {
  processedCount: number
  duplicateCount: number
  syncedIds: string[]
  ignoredDuplicates: string[]
}
