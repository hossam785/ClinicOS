// Backup & Restore Route Definitions — ClinicOS

import { Router } from 'express'
import { auth } from '@/middleware/auth'
import { tenantIsolation } from '@/middleware/tenantIsolation'
import { backupRestoreController } from './backupRestore.controller'
import {
  validateTriggerBackup,
  validateBackupQueryParams,
  validateRestoreBackup,
  validateUpdateRetention,
  validateSyncBackupMetadata,
} from './backupRestore.validator'

export const backupRestoreRouter = Router()

// Enforce global authentication & multi-tenant isolation
backupRestoreRouter.use(auth, tenantIsolation)

// Specific non-param GET endpoints
backupRestoreRouter.get('/restores', (req, res, next) =>
  backupRestoreController.getRestoreHistory(req, res, next)
)

backupRestoreRouter.get('/retention', (req, res, next) =>
  backupRestoreController.getRetentionPolicy(req, res, next)
)

backupRestoreRouter.put('/retention', validateUpdateRetention, (req, res, next) =>
  backupRestoreController.updateRetentionPolicy(req, res, next)
)

backupRestoreRouter.get('/statistics', (req, res, next) =>
  backupRestoreController.getStatistics(req, res, next)
)

// Trigger & Sync POST endpoints
backupRestoreRouter.post('/', validateTriggerBackup, (req, res, next) =>
  backupRestoreController.triggerBackup(req, res, next)
)

backupRestoreRouter.post('/sync', validateSyncBackupMetadata, (req, res, next) =>
  backupRestoreController.syncBackupMetadata(req, res, next)
)

// Roster GET endpoint with query filters
backupRestoreRouter.get('/', validateBackupQueryParams, (req, res, next) =>
  backupRestoreController.getBackups(req, res, next)
)

// Param-based endpoints
backupRestoreRouter.get('/:id', (req, res, next) =>
  backupRestoreController.getBackupById(req, res, next)
)

backupRestoreRouter.post('/:id/verify', (req, res, next) =>
  backupRestoreController.verifyBackup(req, res, next)
)

backupRestoreRouter.post('/:id/restore', validateRestoreBackup, (req, res, next) =>
  backupRestoreController.restoreBackup(req, res, next)
)
