import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

const MedicalRecordsDirectoryView = lazy(() => import('./views/MedicalRecordsDirectoryView'))
const CreateMedicalRecordView = lazy(() => import('./views/CreateMedicalRecordView'))
const EditMedicalRecordView = lazy(() => import('./views/EditMedicalRecordView'))
const MedicalRecordDetailsView = lazy(() => import('./views/MedicalRecordDetailsView'))
const PatientHistoryView = lazy(() => import('./views/PatientHistoryView'))
const LockedRecordView = lazy(() => import('./views/LockedRecordView'))

export const medicalRecordDashboardRoutes: RouteObject[] = [
  {
    path: '',
    element: <MedicalRecordsDirectoryView />,
  },
  {
    path: 'new',
    element: <CreateMedicalRecordView />,
  },
  {
    path: ':id',
    element: <MedicalRecordDetailsView />,
  },
  {
    path: ':id/edit',
    element: <EditMedicalRecordView />,
  },
  {
    path: ':id/lock',
    element: <LockedRecordView />,
  },
  {
    path: 'patient/:patientId/history',
    element: <PatientHistoryView />,
  },
]
