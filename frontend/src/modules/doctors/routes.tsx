import type { RouteObject } from 'react-router-dom'
import { lazy } from 'react'

const DoctorsDirectoryView = lazy(() => import('./views/DoctorsDirectoryView'))
const DoctorProfileView = lazy(() => import('./views/DoctorProfileView'))
const EditDoctorProfileView = lazy(() => import('./views/EditDoctorProfileView'))
const DoctorFeesView = lazy(() => import('./views/DoctorFeesView'))
const DoctorScheduleView = lazy(() => import('./views/DoctorScheduleView'))
const DoctorLeavesView = lazy(() => import('./views/DoctorLeavesView'))
const DoctorAuditReviewView = lazy(() => import('./views/DoctorAuditReviewView'))

export const doctorDashboardRoutes: RouteObject[] = [
  { path: '', element: <DoctorsDirectoryView /> },
  { path: ':id', element: <DoctorProfileView /> },
  { path: ':id/edit', element: <EditDoctorProfileView /> },
  { path: ':id/fees', element: <DoctorFeesView /> },
  { path: ':id/schedule', element: <DoctorScheduleView /> },
  { path: ':id/leaves', element: <DoctorLeavesView /> },
  { path: ':id/audit', element: <DoctorAuditReviewView /> },
]
