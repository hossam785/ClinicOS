import type { RouteObject } from 'react-router-dom'
import { lazy } from 'react'

const ClinicProfileView = lazy(() => import('./views/ClinicProfileView'))
const EditClinicProfileView = lazy(() => import('./views/EditClinicProfileView'))
const OperatingHoursView = lazy(() => import('./views/OperatingHoursView'))
const HolidaysView = lazy(() => import('./views/HolidaysView'))
const AdminClinicRegistryView = lazy(() => import('./views/AdminClinicRegistryView'))
const AdminClinicReviewView = lazy(() => import('./views/AdminClinicReviewView'))

export const clinicDashboardRoutes: RouteObject[] = [
  { path: 'profile', element: <ClinicProfileView /> },
  { path: 'profile/edit', element: <EditClinicProfileView /> },
  { path: 'hours', element: <OperatingHoursView /> },
  { path: 'holidays', element: <HolidaysView /> },
]

export const clinicAdminRoutes: RouteObject[] = [
  { path: 'clinics', element: <AdminClinicRegistryView /> },
  { path: 'clinics/:id', element: <AdminClinicReviewView /> },
]
