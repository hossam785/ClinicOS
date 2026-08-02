import { Router } from 'express'
import { AuthController } from './auth.controller'
import { auth } from '@/middleware/auth'

const router = Router()

// Public endpoints
router.post('/register-clinic', AuthController.registerClinic)
router.post('/onboard-staff', AuthController.onboardStaff)
router.post('/login', AuthController.login)
router.post('/forgot-password', AuthController.forgotPassword)
router.post('/reset-password', AuthController.resetPassword)

// Protected endpoints
router.post('/logout', auth, AuthController.logout)
router.post('/refresh-session', auth, AuthController.validateSession)
router.post('/change-password', auth, AuthController.changePassword)
router.get('/me', auth, AuthController.me)
router.get('/validate-session', auth, AuthController.validateSession)

export const authRoutes = router
