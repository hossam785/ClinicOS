// Audit Logs Repository Store — ClinicOS
// Strictly Append-Only Store. Zero Update or Delete Operations Permitted.

import type { IAuditLogRecord, AuditFilterParams, AuditStatisticsData } from './auditLogs.types'

export class AuditLogsRepository {
  private inMemoryLogs: IAuditLogRecord[] = []

  /**
   * Append-only creation of audit log record.
   */
  async create(record: IAuditLogRecord): Promise<IAuditLogRecord> {
    const createdRecord: IAuditLogRecord = {
      ...record,
      _id: record._id || `audit_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.inMemoryLogs.unshift(createdRecord)
    return createdRecord
  }

  /**
   * Query paginated audit log entries with filter parameters.
   */
  async findPaginated(
    tenantId: string,
    params: AuditFilterParams = {}
  ): Promise<{ items: IAuditLogRecord[]; total: number }> {
    const page = params.page || 1
    const limit = params.limit || 20
    const skip = (page - 1) * limit

    let filtered = this.inMemoryLogs.filter((l) => l.tenantId === tenantId)

    if (params.module && params.module !== 'ALL') {
      filtered = filtered.filter((l) => l.module === params.module)
    }
    if (params.severity && params.severity !== 'ALL') {
      filtered = filtered.filter((l) => l.severity === params.severity)
    }
    if (params.action) {
      filtered = filtered.filter((l) => l.action.toLowerCase().includes(params.action!.toLowerCase()))
    }
    if (params.userId) {
      filtered = filtered.filter((l) => l.userId === params.userId)
    }
    if (params.entityType) {
      filtered = filtered.filter((l) => l.entityType === params.entityType)
    }
    if (params.entityId) {
      filtered = filtered.filter((l) => l.entityId === params.entityId)
    }
    if (params.startDate) {
      const start = new Date(params.startDate).getTime()
      filtered = filtered.filter((l) => new Date(l.eventTimestamp).getTime() >= start)
    }
    if (params.endDate) {
      const end = new Date(params.endDate).getTime()
      filtered = filtered.filter((l) => new Date(l.eventTimestamp).getTime() <= end)
    }
    if (params.search) {
      const q = params.search.toLowerCase()
      filtered = filtered.filter(
        (l) =>
          l.auditNumber.toLowerCase().includes(q) ||
          l.action.toLowerCase().includes(q) ||
          l.userDisplayName.toLowerCase().includes(q)
      )
    }

    const total = filtered.length
    const items = filtered.slice(skip, skip + limit)
    return { items, total }
  }

  /**
   * Find audit log record by primary ID or audit number.
   */
  async findById(tenantId: string, id: string): Promise<IAuditLogRecord | null> {
    return (
      this.inMemoryLogs.find(
        (l) => l.tenantId === tenantId && (l._id === id || l.auditNumber === id)
      ) || null
    )
  }

  /**
   * Find N most recent audit events for dashboard stream.
   */
  async findRecent(tenantId: string, limit = 10): Promise<IAuditLogRecord[]> {
    return this.inMemoryLogs.filter((l) => l.tenantId === tenantId).slice(0, limit)
  }

  /**
   * Find unacknowledged high-priority security critical events.
   */
  async findCritical(tenantId: string, limit = 10): Promise<IAuditLogRecord[]> {
    return this.inMemoryLogs
      .filter((l) => l.tenantId === tenantId && ['CRITICAL', 'ERROR', 'WARNING'].includes(l.severity))
      .slice(0, limit)
  }

  /**
   * Find audit logs associated with a specific correlation ID.
   */
  async findByCorrelationId(tenantId: string, correlationId: string): Promise<IAuditLogRecord[]> {
    return this.inMemoryLogs
      .filter((l) => l.tenantId === tenantId && l.correlationId === correlationId)
      .sort((a, b) => new Date(a.eventTimestamp).getTime() - new Date(b.eventTimestamp).getTime())
  }

  /**
   * Aggregate statistics metrics summarizing audit counts.
   */
  async aggregateStatistics(tenantId: string): Promise<AuditStatisticsData> {
    const tenantLogs = this.inMemoryLogs.filter((l) => l.tenantId === tenantId)

    const totalEventsCount = tenantLogs.length
    const severityBreakdown = {
      INFORMATION: tenantLogs.filter((l) => l.severity === 'INFORMATION').length,
      WARNING: tenantLogs.filter((l) => l.severity === 'WARNING').length,
      ERROR: tenantLogs.filter((l) => l.severity === 'ERROR').length,
      CRITICAL: tenantLogs.filter((l) => l.severity === 'CRITICAL').length,
    }

    const moduleCounts: Record<string, number> = {}
    tenantLogs.forEach((l) => {
      moduleCounts[l.module] = (moduleCounts[l.module] || 0) + 1
    })

    const moduleBreakdown = Object.entries(moduleCounts).map(([module, count]) => ({
      module: module as IAuditLogRecord['module'],
      count,
    }))

    const pendingSyncCount = tenantLogs.filter((l) => l.syncStatus === 'PENDING_SYNC').length
    const syncedCount = tenantLogs.filter((l) => l.syncStatus === 'SYNCED').length

    return {
      totalEventsCount,
      severityBreakdown,
      moduleBreakdown,
      synchronizationStats: {
        pendingSyncCount,
        syncedCount,
      },
    }
  }

  /**
   * Seed audit log record for testing parity.
   */
  seedRecord(record: IAuditLogRecord): void {
    this.inMemoryLogs.unshift(record)
  }

  /**
   * Clear in-memory records (Testing helper).
   */
  clearInMemoryRecords(): void {
    this.inMemoryLogs = []
  }
}

export const auditLogsRepository = new AuditLogsRepository()
