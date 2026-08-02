import type { RouteObject } from 'react-router-dom'
import PrescriptionsDirectoryView from './views/PrescriptionsDirectoryView'
import CreatePrescriptionView from './views/CreatePrescriptionView'
import EditPrescriptionView from './views/EditPrescriptionView'
import PrescriptionDetailsView from './views/PrescriptionDetailsView'
import PatientPrescriptionHistoryView from './views/PatientPrescriptionHistoryView'

export const prescriptionDashboardRoutes: RouteObject[] = [
  {
    index: true,
    element: <PrescriptionsDirectoryView />,
  },
  {
    path: 'new',
    element: <CreatePrescriptionView />,
  },
  {
    path: ':id',
    element: <PrescriptionDetailsView />,
  },
  {
    path: ':id/edit',
    element: <EditPrescriptionView />,
  },
  {
    path: 'patient/:patientId',
    element: <PatientPrescriptionHistoryView />,
  },
]
