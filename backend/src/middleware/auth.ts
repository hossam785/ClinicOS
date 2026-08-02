import { Request, Response, NextFunction } from 'express'
import { AuthService } from '@/modules/auth/auth.service'
import { AppError } from '@/shared/errors/AppError'
import type { AuthenticatedRequest } from '@/modules/auth/auth.types'

/**
 * Global authentication middleware verifying incoming JWT signatures
 * and attaching validated credentials payload to the request object.
 */
export async function auth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(
      new AppError(
        'Unauthorized: Missing or malformed authorization header.',
        401,
        'MISSING_TOKEN'
      )
    )
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = await AuthService.validateToken(token)
    ;(req as AuthenticatedRequest).user = decoded
    next()
  } catch (err) {
    next(err)
  }
}
