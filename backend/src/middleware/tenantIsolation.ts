import { Request, Response, NextFunction } from 'express'
import { AppError } from '@/shared/errors/AppError'

/**
 * Middleware shell for verifying tenant-isolation context headers.
 * Ensures cross-tenant leaks are blocked at API gates.
 */
export function tenantIsolation(req: Request, _res: Response, next: NextFunction): void {
  const tenantId = req.headers['x-tenant-id']

  // Scoping check mapping to be implemented in future integration tasks
  if (!tenantId) {
    return next(
      new AppError('Unauthorized: Missing tenant context header.', 400, 'MISSING_TENANT_CONTEXT')
    )
  }

  next()
}
