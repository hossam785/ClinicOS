import { Request, Response, NextFunction } from 'express'
import { AuthService } from './auth.service'
import { AuthValidator } from './auth.validator'
import type { AuthenticatedRequest } from './auth.types'

export class AuthController {
  public static async registerClinic(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      AuthValidator.registerClinic(req.body)
      const result = await AuthService.registerClinic({
        clinicName: req.body.clinicName,
        ownerEmail: req.body.ownerEmail,
        ownerPasswordHash: req.body.ownerPassword,
        ownerFullName: req.body.ownerFullName,
      })

      res.status(201).json({
        success: true,
        data: result,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (req.headers['x-correlation-id'] as string) || 'none',
        },
      })
    } catch (err) {
      next(err)
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      AuthValidator.login(req.body)
      const result = await AuthService.login({
        tenantId: req.body.tenantId,
        email: req.body.email,
        passwordPlain: req.body.password,
      })

      res.status(200).json({
        success: true,
        data: result,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (req.headers['x-correlation-id'] as string) || 'none',
        },
      })
    } catch (err) {
      next(err)
    }
  }

  public static async onboardStaff(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      AuthValidator.onboardStaff(req.body)
      const result = await AuthService.onboardStaff({
        token: req.body.token,
        fullName: req.body.fullName,
        passwordPlain: req.body.password,
      })

      res.status(201).json({
        success: true,
        data: result,
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (req.headers['x-correlation-id'] as string) || 'none',
        },
      })
    } catch (err) {
      next(err)
    }
  }

  public static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      AuthValidator.forgotPassword(req.body)
      await AuthService.forgotPassword(req.body.email)

      res.status(200).json({
        success: true,
        data: { message: 'Reset instruction email dispatched if account exists.' },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (req.headers['x-correlation-id'] as string) || 'none',
        },
      })
    } catch (err) {
      next(err)
    }
  }

  public static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      AuthValidator.resetPassword(req.body)
      await AuthService.resetPassword({
        token: req.body.token,
        passwordPlain: req.body.password,
      })

      res.status(200).json({
        success: true,
        data: { message: 'Password updated successfully.' },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (req.headers['x-correlation-id'] as string) || 'none',
        },
      })
    } catch (err) {
      next(err)
    }
  }

  public static async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as AuthenticatedRequest).user?.userId || ''
      AuthValidator.changePassword(req.body)
      await AuthService.changePassword(userId, {
        passwordPlain: req.body.password,
        newPasswordPlain: req.body.newPassword,
      })

      res.status(200).json({
        success: true,
        data: { message: 'Password updated successfully.' },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (req.headers['x-correlation-id'] as string) || 'none',
        },
      })
    } catch (err) {
      next(err)
    }
  }

  public static async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userPayload = (req as AuthenticatedRequest).user

      res.status(200).json({
        success: true,
        data: { user: userPayload },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (req.headers['x-correlation-id'] as string) || 'none',
        },
      })
    } catch (err) {
      next(err)
    }
  }

  public static async validateSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json({
        success: true,
        data: { valid: true },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (req.headers['x-correlation-id'] as string) || 'none',
        },
      })
    } catch (err) {
      next(err)
    }
  }

  public static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authHeader = req.headers.authorization
      const token = authHeader ? authHeader.split(' ')[1] : ''
      if (token) {
        await AuthService.logout(token)
      }

      res.status(200).json({
        success: true,
        data: { message: 'Logged out successfully.' },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: (req.headers['x-correlation-id'] as string) || 'none',
        },
      })
    } catch (err) {
      next(err)
    }
  }
}
