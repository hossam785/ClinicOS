import { Router } from 'express'
import { auth } from '@/middleware/auth'
import { tenantIsolation } from '@/middleware/tenantIsolation'
import { NotificationController } from '../controllers/notification.controller'

const notificationRouter = Router()
const notificationPreferencesRouter = Router()

// All routes require JWT auth and tenant isolation context
notificationRouter.use(auth)
notificationRouter.use(tenantIsolation)

notificationPreferencesRouter.use(auth)
notificationPreferencesRouter.use(tenantIsolation)

// Notification Roster & Details Endpoints
notificationRouter.get('/', NotificationController.getNotifications)
notificationRouter.get('/recent', NotificationController.getRecentNotifications)
notificationRouter.get('/unread-count', NotificationController.getUnreadCount)
notificationRouter.get('/:id', NotificationController.getNotificationById)

// Actions
notificationRouter.patch('/:id/read', NotificationController.markAsRead)
notificationRouter.patch('/read-all', NotificationController.markAllAsRead)
notificationRouter.patch('/:id/acknowledge', NotificationController.acknowledgeCritical)
notificationRouter.patch('/:id/archive', NotificationController.archiveNotification)
notificationRouter.patch('/:id/restore', NotificationController.restoreNotification)

// Offline Sync Batch Endpoint
notificationRouter.post('/sync', NotificationController.syncOfflineQueue)

// Preferences Endpoints
notificationPreferencesRouter.get('/', NotificationController.getPreferences)
notificationPreferencesRouter.put('/', NotificationController.updatePreferences)

export { notificationRouter, notificationPreferencesRouter }
