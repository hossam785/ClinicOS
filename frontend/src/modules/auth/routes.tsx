import type { RouteObject } from 'react-router-dom'
import { lazy } from 'react'

const LoginView = lazy(() => import('./views/LoginView'))
const ForgotPasswordView = lazy(() => import('./views/ForgotPasswordView'))
const ResetPasswordView = lazy(() => import('./views/ResetPasswordView'))
const OnboardStaffView = lazy(() => import('./views/OnboardStaffView'))
const PendingApprovalView = lazy(() => import('./views/PendingApprovalView'))
const AccountDisabledView = lazy(() => import('./views/AccountDisabledView'))
const SessionExpiredView = lazy(() => import('./views/SessionExpiredView'))
const UnauthorizedView = lazy(() => import('./views/UnauthorizedView'))

export const authRoutes: RouteObject[] = [
  { path: 'login', element: <LoginView /> },
  { path: 'forgot-password', element: <ForgotPasswordView /> },
  { path: 'reset-password', element: <ResetPasswordView /> },
  { path: 'onboard', element: <OnboardStaffView /> },
  { path: 'pending-approval', element: <PendingApprovalView /> },
  { path: 'account-disabled', element: <AccountDisabledView /> },
  { path: 'session-expired', element: <SessionExpiredView /> },
  { path: 'unauthorized', element: <UnauthorizedView /> },
]
