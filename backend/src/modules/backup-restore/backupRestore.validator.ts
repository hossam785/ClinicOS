// Backup & Restore Module Validators — ClinicOS

import { Request, Response, NextFunction } from 'express'
import { AppError } from '@/shared/errors/AppError'
import type { BackupType, IntegrityStatus, RetentionMode } from './backupRestore.types'

const VALID_BACKUP_TYPES: BackupType[] = [
  'MANUAL',
  'AUTOMATIC',
  'PRE_UPGRADE',
  'EMERGENCY',
  'SAFETY_PRE_RESTORE',
]

const VALID_INTEGRITY_STATUSES: IntegrityStatus[] = ['UNVERIFIED', 'VERIFIED', 'CORRUPTED']

const VALID_RETENTION_MODES: RetentionMode[] = ['LAST_5', 'LAST_10', 'LAST_20', 'UNLIMITED']

export function validateTriggerBackup(req: Request, _res: Response, next: NextFunction): void {
  const { backupType, backupName } = req.body

  if (!backupType || !['MANUAL', 'EMERGENCY'].includes(backupType)) {
    return next(
      new AppError(
        'Invalid backupType provided. Must be MANUAL or EMERGENCY.',
        400,
        'INVALID_BACKUP_TYPE'
      )
    )
  }

  if (
    !backupName ||
    typeof backupName !== 'string' ||
    backupName.trim().length < 3 ||
    backupName.trim().length > 100
  ) {
    return next(
      new AppError(
        'Backup name is required and must be between 3 and 100 characters.',
        400,
        'INVALID_BACKUP_NAME'
      )
    )
  }

  const nameRegex = /^[a-zA-Z0-9_\-\s]+$/
  if (!nameRegex.test(backupName.trim())) {
    return next(
      new AppError(
        'Backup name contains invalid characters. Use alphanumeric, spaces, hyphens, and underscores only.',
        400,
        'INVALID_BACKUP_NAME'
      )
    )
  }

  next()
}

export function validateBackupQueryParams(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const { page, limit, backupType, integrityStatus, startDate, endDate } = req.query

  if (page && (isNaN(Number(page)) || Number(page) < 1)) {
    return next(new AppError('Page query parameter must be a positive integer.', 400, 'INVALID_PAGE'))
  }

  if (limit && (isNaN(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)) {
    return next(
      new AppError('Limit query parameter must be an integer between 1 and 100.', 400, 'INVALID_LIMIT')
    )
  }

  if (backupType && !VALID_BACKUP_TYPES.includes(backupType as BackupType)) {
    return next(
      new AppError('Invalid backupType filter specified.', 400, 'INVALID_BACKUP_TYPE_FILTER')
    )
  }

  if (
    integrityStatus &&
    !VALID_INTEGRITY_STATUSES.includes(integrityStatus as IntegrityStatus)
  ) {
    return next(
      new AppError(
        'Invalid integrityStatus filter specified.',
        400,
        'INVALID_INTEGRITY_STATUS_FILTER'
      )
    )
  }

  if (startDate && isNaN(Date.parse(String(startDate)))) {
    return next(
      new AppError(
        'startDate must be a valid ISO 8601 date string.',
        400,
        'INVALID_START_DATE'
      )
    )
  }

  if (endDate && isNaN(Date.parse(String(endDate)))) {
    return next(
      new AppError('endDate must be a valid ISO 8601 date string.', 400, 'INVALID_END_DATE')
    )
  }

  next()
}

export function validateRestoreBackup(req: Request, _res: Response, next: NextFunction): void {
  const { confirmationPhrase } = req.body

  if (!confirmationPhrase || typeof confirmationPhrase !== 'string' || confirmationPhrase.trim() === '') {
    return next(
      new AppError(
        'Confirmation phrase is required to execute a system restore operation.',
        400,
        'CONFIRMATION_REQUIRED'
      )
    )
  }

  next()
}

export function validateUpdateRetention(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const { retentionMode, autoCleanupEnabled } = req.body

  if (!retentionMode || !VALID_RETENTION_MODES.includes(retentionMode as RetentionMode)) {
    return next(
      new AppError(
        'Invalid retentionMode specified. Must be LAST_5, LAST_10, LAST_20, or UNLIMITED.',
        400,
        'INVALID_RETENTION_MODE'
      )
    )
  }

  if (typeof autoCleanupEnabled !== 'boolean') {
    return next(
      new AppError(
        'autoCleanupEnabled field must be a boolean value.',
        400,
        'INVALID_CLEANUP_FLAG'
      )
    )
  }

  next()
}

export function validateSyncBackupMetadata(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const { localBackupMetadata } = req.body

  if (!Array.isArray(localBackupMetadata)) {
    return next(
      new AppError(
        'localBackupMetadata must be an array of offline backup objects.',
        400,
        'INVALID_SYNC_PAYLOAD'
      )
    )
  }

  for (const item of localBackupMetadata) {
    if (!item.backupId || !item.backupName || !item.fileSizeBytes || !item.checksum) {
      return next(
        new AppError(
          'Each offline backup sync item must contain backupId, backupName, fileSizeBytes, and checksum.',
          400,
          'INVALID_SYNC_ITEM'
        )
      )
    }
  }

  next()
}
