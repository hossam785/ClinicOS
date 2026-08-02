import type { RouteObject } from 'react-router-dom'
import { lazy } from 'react'

const PatientsDirectoryView = lazy(() => import('./views/PatientsDirectoryView'))
const CreatePatientView = lazy(() => import('./views/CreatePatientView'))
const PatientProfileView = lazy(() => import('./views/PatientProfileView'))
const EditPatientProfileView = lazy(() => import('./views/EditPatientProfileView'))
const PatientAuditReviewView = lazy(() => import('./views/PatientAuditReviewView'))

export const patientDashboardRoutes: RouteObject[] = [
  { path: '', element: <PatientsDirectoryView /> },
  { path: 'new', element: <CreatePatientView /> },
  { path: ':id', element: <PatientProfileView /> },
  { path: ':id/edit', element: <EditPatientProfileView /> },
  { path: ':id/audit', element: <PatientAuditReviewView /> },
]
