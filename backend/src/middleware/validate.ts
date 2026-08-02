import { Request, Response, NextFunction } from 'express'

/**
 * Middleware builder for validating inbound HTTP request schemas.
 * Leveraged by route controllers to intercept malformed packages.
 */
export function validate(_schema: unknown) {
  return (_req: Request, _res: Response, next: NextFunction): void => {
    // Inbound payload validation mapping to be implemented in future tasks
    next()
  }
}
