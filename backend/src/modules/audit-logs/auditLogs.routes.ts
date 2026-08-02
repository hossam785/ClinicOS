// Audit Logs Express Route Definitions — ClinicOS

import { Router } from 'express'
import { auth } from '@/middleware/auth'
import { tenantIsolation } from '@/middleware/tenantIsolation'
import { auditLogsController } from './auditLogs.controller'
import {
  validateAuditQueryParams,
  validateExportPayload,
  validateSyncPayload,
} from './auditLogs.validator'

export const auditLogsRouter = Router()

// Enforce global authentication & multi-tenant isolation
auditLogsRouter.use(auth, tenantIsolation)

// Read-only retrieval endpoints
auditLogsRouter.get('/', validateAuditQueryParams, (req, res, next) =>
  auditLogsController.getAuditLogs(req, res, next)
)

auditLogsRouter.get('/recent', (req, res, next) =>
  auditLogsController.getRecentAuditEvents(req, res, next)
)

auditLogsRouter.get('/critical', (req, res, next) =>
  auditLogsController.getCriticalAuditEvents(req, res, next)
)

auditLogsRouter.get('/statistics', (req, res, next) =>
  auditLogsController.getAuditStatistics(req, res, next)
)

auditLogsRouter.get('/:id', (req, res, next) =>
  auditLogsController.getAuditLogById(req, res, next)
)

// Document Export & Offline Synchronization endpoints
auditLogsRouter.post('/export', validateExportPayload, (req, res, next) =>
  auditLogsController.exportAuditLogs(req, res, next)
)

auditLogsRouter.post('/sync', validateSyncPayload, (req, res, next) =>
  auditLogsController.syncAuditLogs(req, res, next)
)
