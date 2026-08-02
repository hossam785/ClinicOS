// Desktop Offline Synchronization Engine REST Routes — Module-018

import { Router, Request, Response, NextFunction } from 'express'
import { syncEngineController } from './syncEngine.controller'

const router = Router()

// Platform Owner Access Guard Middleware (PLATFORM_ADMIN_RESTRICTED)
const platformAdminRestrictedGuard = (req: Request, res: Response, next: NextFunction): void => {
  const userRole = req.headers['x-user-role'] as string
  if (userRole === 'SUPER_ADMIN' || userRole === 'PLATFORM') {
    res.status(403).json({
      status: 'error',
      error: {
        code: 'PLATFORM_ADMIN_RESTRICTED',
        message: 'Platform super administrators are strictly forbidden from accessing tenant sync endpoints.',
      },
    })
    return
  }
  next()
}

router.use(platformAdminRestrictedGuard)

// Sync Endpoints
router.get('/status', (req, res, next) => syncEngineController.getStatusSummary(req, res, next))
router.post('/device/register', (req, res, next) => syncEngineController.registerDevice(req, res, next))
router.post('/device/heartbeat', (req, res, next) => syncEngineController.processHeartbeat(req, res, next))
router.post('/incremental', (req, res, next) => syncEngineController.processIncrementalDelta(req, res, next))
router.post('/files/upload', (req, res, next) => syncEngineController.processFileChunkUpload(req, res, next))
router.get('/queue', (req, res, next) => syncEngineController.getQueue(req, res, next))
router.post('/queue/retry', (req, res, next) => syncEngineController.retryQueue(req, res, next))
router.get('/conflicts', (req, res, next) => syncEngineController.getConflicts(req, res, next))
router.post('/conflicts/:conflictId/resolve', (req, res, next) => syncEngineController.resolveConflict(req, res, next))
router.get('/logs', (req, res, next) => syncEngineController.getSyncLogs(req, res, next))
router.get('/diagnostics', (req, res, next) => syncEngineController.getDiagnostics(req, res, next))
router.get('/config', (req, res, next) => syncEngineController.getConfig(req, res, next))
router.patch('/config', (req, res, next) => syncEngineController.updateConfig(req, res, next))

export default router
