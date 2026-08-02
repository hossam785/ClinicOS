import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

const AppointmentsDirectoryView = lazy(() => import('./views/AppointmentsDirectoryView'))
const DailyQueueRosterView = lazy(() => import('./views/DailyQueueRosterView'))
const CreateAppointmentView = lazy(() => import('./views/CreateAppointmentView'))
const AppointmentDetailsView = lazy(() => import('./views/AppointmentDetailsView'))
const EditAppointmentView = lazy(() => import('./views/EditAppointmentView'))
const AppointmentAuditReviewView = lazy(() => import('./views/AppointmentAuditReviewView'))

export const appointmentDashboardRoutes: RouteObject[] = [
  {
    path: 'appointments',
    element: <AppointmentsDirectoryView />,
  },
  {
    path: 'appointments/queue',
    element: <DailyQueueRosterView />,
  },
  {
    path: 'appointments/new',
    element: <CreateAppointmentView />,
  },
  {
    path: 'appointments/:id',
    element: <AppointmentDetailsView />,
  },
  {
    path: 'appointments/:id/edit',
    element: <EditAppointmentView />,
  },
  {
    path: 'appointments/:id/audit',
    element: <AppointmentAuditReviewView />,
  },
]
