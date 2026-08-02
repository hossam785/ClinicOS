import { Request, Response, NextFunction } from 'express'
import { NotificationValidator } from '../validators/notification.validator'
import { NotificationEngineService } from '../services/notificationEngine.service'
import { InMemoryNotificationRepository } from '../repositories/notification.repository'

interface AuthenticatedRequest extends Request {
  user?: {
    id?: string
    userId?: string
    role?: string
    tenantId?: string
    clinicId?: string
  }
}

// Singleton repository & engine service instance
const notificationRepository = new InMemoryNotificationRepository()
export const notificationEngineService = new NotificationEngineService(notificationRepository)

export class NotificationController {
  private static getUserContext(req: AuthenticatedRequest) {
    const tenantId = (req.headers['x-tenant-id'] as string) || req.user?.tenantId || 'clinic-101'
    const userId = req.user?.id || req.user?.userId || 'user_anonymous'
    const role = req.user?.role || 'STAFF'
    return { tenantId, userId, role }
  }

  static async getNotifications(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tenantId, userId, role } = NotificationController.getUserContext(req)

      const params = NotificationValidator.validateQueryParams(req.query)
      const result = await notificationEngineService.listNotifications(tenantId, userId, role, params)

      res.status(200).json({
        success: true,
        data: {
          items: result.data,
          pagination: {
            totalItems: result.total,
            totalPages: result.totalPages,
            currentPage: result.page,
            limit: params.limit || 20,
            hasNextPage: result.page < result.totalPages,
            hasPrevPage: result.page > 1,
          },
        },
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  static async getRecentNotifications(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tenantId, userId, role } = NotificationController.getUserContext(req)

      const result = await notificationEngineService.getRecentNotifications(tenantId, userId, role, 5)

      res.status(200).json({
        success: true,
        data: result,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  static async getUnreadCount(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tenantId, userId, role } = NotificationController.getUserContext(req)

      const summary = await notificationEngineService.getUnreadCount(tenantId, userId, role)

      res.status(200).json({
        success: true,
        data: summary,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  static async getNotificationById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tenantId, userId, role } = NotificationController.getUserContext(req)
      const { id } = req.params

      const notification = await notificationEngineService.getNotificationById(tenantId, userId, role, id)

      res.status(200).json({
        success: true,
        data: notification,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  static async markAsRead(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tenantId, userId, role } = NotificationController.getUserContext(req)
      const { id } = req.params

      const updated = await notificationEngineService.markAsRead(tenantId, userId, role, id)

      res.status(200).json({
        success: true,
        data: updated,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  static async markAllAsRead(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tenantId, userId, role } = NotificationController.getUserContext(req)

      const result = await notificationEngineService.markAllAsRead(tenantId, userId, role)

      res.status(200).json({
        success: true,
        data: result,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  static async acknowledgeCritical(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tenantId, userId, role } = NotificationController.getUserContext(req)
      const { id } = req.params
      const { notes } = req.body || {}

      const updated = await notificationEngineService.acknowledgeCritical(tenantId, userId, role, id, notes)

      res.status(200).json({
        success: true,
        data: updated,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  static async archiveNotification(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tenantId, userId, role } = NotificationController.getUserContext(req)
      const { id } = req.params

      const updated = await notificationEngineService.archiveNotification(tenantId, userId, role, id)

      res.status(200).json({
        success: true,
        data: updated,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  static async restoreNotification(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tenantId, userId, role } = NotificationController.getUserContext(req)
      const { id } = req.params

      const updated = await notificationEngineService.restoreNotification(tenantId, userId, role, id)

      res.status(200).json({
        success: true,
        data: updated,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  static async getPreferences(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tenantId, userId, role } = NotificationController.getUserContext(req)

      const preferences = await notificationEngineService.getPreferences(tenantId, userId, role)

      res.status(200).json({
        success: true,
        data: preferences,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  static async updatePreferences(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tenantId, userId, role } = NotificationController.getUserContext(req)

      const dto = NotificationValidator.validatePreferencesUpdate(req.body)
      const updated = await notificationEngineService.updatePreferences(tenantId, userId, role, dto)

      res.status(200).json({
        success: true,
        data: updated,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }

  static async syncOfflineQueue(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tenantId, userId, role } = NotificationController.getUserContext(req)

      const queuedNotifications = NotificationValidator.validateSyncPayload(req.body)
      const result = await notificationEngineService.syncOfflineQueue(tenantId, userId, role, queuedNotifications)

      res.status(200).json({
        success: true,
        data: result,
        meta: { timestamp: new Date().toISOString() },
      })
    } catch (err) {
      next(err)
    }
  }
}
