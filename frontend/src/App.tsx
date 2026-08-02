import { Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'
import PublicLayout from '@/layouts/PublicLayout'
import AuthLayout from '@/layouts/AuthLayout'
import DashboardLayout from '@/layouts/DashboardLayout'
import { authRoutes } from '@/modules/auth/routes'
import { clinicDashboardRoutes, clinicAdminRoutes } from '@/modules/clinic/routes'
import { doctorDashboardRoutes } from '@/modules/doctors/routes'
import { patientDashboardRoutes } from '@/modules/patients/routes'
import { appointmentDashboardRoutes } from '@/modules/appointments/routes'
import { medicalRecordDashboardRoutes } from '@/modules/medical-records/routes'
import { prescriptionDashboardRoutes } from '@/modules/prescriptions/routes'
import { expenseDashboardRoutes } from '@/modules/expenses/routes'
import { doctorFinancialsDashboardRoutes } from '@/modules/doctor-financials/routes'
import { notificationDashboardRoutes } from '@/modules/notifications/routes'
import { reportsDashboardRoutes } from '@/modules/reports/routes'
import { auditLogsDashboardRoutes } from '@/modules/audit-logs/routes'
import { backupRestoreDashboardRoutes } from '@/modules/backup-restore/routes'
import { bookingPortalPublicRoutes, bookingPortalDashboardRoutes } from '@/modules/booking-portal/routes'
import { aiAssistantDashboardRoutes } from '@/modules/ai-assistant/routes'
import { syncEngineDashboardRoutes } from '@/modules/sync-engine/routes'
import { platformControlDashboardRoutes } from '@/modules/platform-control/routes'
import Loader from '@/design-system/components/Loader'

import { AuthProvider } from '@/modules/auth/context/AuthProvider'
import { LocalizationProvider } from '@/i18n'

const router = createBrowserRouter([
  ...bookingPortalPublicRoutes,
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Welcome to ClinicOS</h1>
            <p>Enterprise Medical Operating System. Workspace is initialized.</p>
          </div>
        ),
      },
    ],
  },
  {
    path: '/auth',
    element: (
      <Suspense
        fallback={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Loader size="large" />
          </div>
        }
      >
        <AuthLayout />
      </Suspense>
    ),
    children: authRoutes,
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard/patients" replace />,
      },
      {
        path: '',
        element: (
          <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}><Loader size="medium" /></div>}>
            <Outlet />
          </Suspense>
        ),
        children: clinicDashboardRoutes,
      },
      {
        path: '',
        element: (
          <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}><Loader size="medium" /></div>}>
            <Outlet />
          </Suspense>
        ),
        children: doctorDashboardRoutes,
      },
      {
        path: '',
        element: (
          <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}><Loader size="medium" /></div>}>
            <Outlet />
          </Suspense>
        ),
        children: patientDashboardRoutes,
      },
      {
        path: '',
        element: (
          <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}><Loader size="medium" /></div>}>
            <Outlet />
          </Suspense>
        ),
        children: appointmentDashboardRoutes,
      },
      {
        path: '',
        element: (
          <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}><Loader size="medium" /></div>}>
            <Outlet />
          </Suspense>
        ),
        children: medicalRecordDashboardRoutes,
      },
      {
        path: '',
        element: (
          <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}><Loader size="medium" /></div>}>
            <Outlet />
          </Suspense>
        ),
        children: prescriptionDashboardRoutes,
      },
      {
        path: '',
        element: (
          <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}><Loader size="medium" /></div>}>
            <Outlet />
          </Suspense>
        ),
        children: expenseDashboardRoutes,
      },
      {
        path: '',
        element: (
          <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}><Loader size="medium" /></div>}>
            <Outlet />
          </Suspense>
        ),
        children: doctorFinancialsDashboardRoutes,
      },
      {
        path: '',
        element: (
          <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}><Loader size="medium" /></div>}>
            <Outlet />
          </Suspense>
        ),
        children: notificationDashboardRoutes,
      },
      {
        path: '',
        element: (
          <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}><Loader size="medium" /></div>}>
            <Outlet />
          </Suspense>
        ),
        children: reportsDashboardRoutes,
      },
      {
        path: '',
        element: (
          <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}><Loader size="medium" /></div>}>
            <Outlet />
          </Suspense>
        ),
        children: auditLogsDashboardRoutes,
      },
      {
        path: '',
        element: (
          <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}><Loader size="medium" /></div>}>
            <Outlet />
          </Suspense>
        ),
        children: backupRestoreDashboardRoutes,
      },
      {
        path: '',
        element: (
          <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}><Loader size="medium" /></div>}>
            <Outlet />
          </Suspense>
        ),
        children: bookingPortalDashboardRoutes,
      },
      {
        path: '',
        element: (
          <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}><Loader size="medium" /></div>}>
            <Outlet />
          </Suspense>
        ),
        children: aiAssistantDashboardRoutes,
      },
      {
        path: '',
        element: (
          <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}><Loader size="medium" /></div>}>
            <Outlet />
          </Suspense>
        ),
        children: syncEngineDashboardRoutes,
      },
      {
        path: '',
        element: (
          <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}><Loader size="medium" /></div>}>
            <Outlet />
          </Suspense>
        ),
        children: platformControlDashboardRoutes,
      },
    ],
  },
  {
    path: '/admin',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/clinics" replace />,
      },
      {
        path: '',
        element: (
          <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}><Loader size="medium" /></div>}>
            <Outlet />
          </Suspense>
        ),
        children: clinicAdminRoutes,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

export default function App() {
  return (
    <LocalizationProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </LocalizationProvider>
  )
}
