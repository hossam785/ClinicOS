import { Request, Response, NextFunction } from 'express'
import { AppError } from '@/shared/errors/AppError'
import { logger } from '@/shared/logging/logger'

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  const correlationId = (req.headers['x-correlation-id'] as string) || 'none'
  const tenantId = (req.headers['x-tenant-id'] as string) || undefined

  if (err instanceof AppError) {
    // Log operational error
    logger.warn({
      message: err.message,
      tenantId,
      correlationId,
      context: { statusCode: err.statusCode, errorCode: err.errorCode },
    })

    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.errorCode,
        message: err.message,
        details: [],
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: correlationId,
      },
    })
    return
  }

  // Log unhandled server exception
  logger.error({
    message: err.message || 'Unhandled server exception',
    tenantId,
    correlationId,
    stack: err.stack,
  })

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected connection or database error occurred.',
      details: [],
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: correlationId,
    },
  })
}
