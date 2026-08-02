import { AppError } from '@/shared/errors/AppError'
import type {
  QueryNotificationsDto,
  UpdatePreferencesDto,
  NotificationCategory,
  NotificationPriority,
  ReadStatus,
} from '../types/notification.types'

const VALID_CATEGORIES: NotificationCategory[] = [
  'APPOINTMENT',
  'PATIENT',
  'MEDICAL_RECORD',
  'PRESCRIPTION',
  'FINANCIAL',
  'SYSTEM',
  'ADMINISTRATIVE',
]

const VALID_PRIORITIES: NotificationPriority[] = ['LOW', 'NORMAL', 'HIGH', 'CRITICAL']

export class NotificationValidator {
  static validateQueryParams(query: Record<string, unknown>): QueryNotificationsDto {
    const page = query.page ? parseInt(String(query.page), 10) : 1
    const limit = query.limit ? parseInt(String(query.limit), 10) : 20

    if (isNaN(page) || page < 1) {
      throw new AppError('Query parameter "page" must be a positive integer.', 400, 'INVALID_PAGE_PARAM')
    }

    if (isNaN(limit) || limit < 1 || limit > 100) {
      throw new AppError('Query parameter "limit" must be between 1 and 100.', 400, 'INVALID_LIMIT_PARAM')
    }

    const category = query.category as NotificationCategory | 'ALL' | undefined
    if (category && category !== 'ALL' && !VALID_CATEGORIES.includes(category)) {
      throw new AppError(`Invalid notification category "${category}".`, 400, 'INVALID_CATEGORY_PARAM')
    }

    const priority = query.priority as NotificationPriority | 'ALL' | undefined
    if (priority && priority !== 'ALL' && !VALID_PRIORITIES.includes(priority)) {
      throw new AppError(`Invalid notification priority "${priority}".`, 400, 'INVALID_PRIORITY_PARAM')
    }

    let archived: boolean | undefined = undefined
    if (query.archived !== undefined) {
      archived = String(query.archived) === 'true'
    }

    return {
      page,
      limit,
      search: query.search ? String(query.search).trim() : undefined,
      category,
      priority,
      readStatus: query.readStatus ? (String(query.readStatus) as ReadStatus | 'ALL') : undefined,
      archived,
      startDate: query.startDate ? String(query.startDate) : undefined,
      endDate: query.endDate ? String(query.endDate) : undefined,
      sortBy: query.sortBy === 'priority' ? 'priority' : 'createdAt',
      sortOrder: query.sortOrder === 'asc' ? 'asc' : 'desc',
    }
  }

  static validatePreferencesUpdate(body: Record<string, unknown>): UpdatePreferencesDto {
    if (!body || typeof body !== 'object') {
      throw new AppError('Request body must be a valid JSON object.', 400, 'INVALID_REQUEST_BODY')
    }

    const dto: UpdatePreferencesDto = {}

    if (body.enableAppointmentNotifications !== undefined) {
      if (typeof body.enableAppointmentNotifications !== 'boolean') {
        throw new AppError('Field "enableAppointmentNotifications" must be a boolean.', 400, 'INVALID_PREFERENCE_TYPE')
      }
      dto.enableAppointmentNotifications = body.enableAppointmentNotifications
    }

    if (body.enableFinancialNotifications !== undefined) {
      if (typeof body.enableFinancialNotifications !== 'boolean') {
        throw new AppError('Field "enableFinancialNotifications" must be a boolean.', 400, 'INVALID_PREFERENCE_TYPE')
      }
      dto.enableFinancialNotifications = body.enableFinancialNotifications
    }

    if (body.enableAdministrativeNotifications !== undefined) {
      if (typeof body.enableAdministrativeNotifications !== 'boolean') {
        throw new AppError('Field "enableAdministrativeNotifications" must be a boolean.', 400, 'INVALID_PREFERENCE_TYPE')
      }
      dto.enableAdministrativeNotifications = body.enableAdministrativeNotifications
    }

    if (body.enableSystemNotifications !== undefined) {
      if (typeof body.enableSystemNotifications !== 'boolean') {
        throw new AppError('Field "enableSystemNotifications" must be a boolean.', 400, 'INVALID_PREFERENCE_TYPE')
      }
      dto.enableSystemNotifications = body.enableSystemNotifications
    }

    return dto
  }

  static validateSyncPayload(body: Record<string, unknown>): Record<string, unknown>[] {
    if (!body || !Array.isArray(body.queuedNotifications)) {
      throw new AppError('Field "queuedNotifications" must be an array.', 400, 'INVALID_SYNC_PAYLOAD')
    }

    return body.queuedNotifications as Record<string, unknown>[]
  }
}
