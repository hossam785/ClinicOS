import type { RouteObject } from 'react-router-dom'
import { DoctorFinancialsDashboardView } from './views/DoctorFinancialsDashboardView'
import { SettlementDirectoryView } from './views/SettlementDirectoryView'
import { CreateSettlementView } from './views/CreateSettlementView'
import { SettlementDetailsView } from './views/SettlementDetailsView'
import { DoctorFinancialPortalView } from './views/DoctorFinancialPortalView'
import { FinancialReportsView } from './views/FinancialReportsView'

export const doctorFinancialsDashboardRoutes: RouteObject[] = [
  {
    path: 'doctor-financials',
    children: [
      {
        index: true,
        element: <DoctorFinancialsDashboardView />,
      },
      {
        path: 'settlements',
        element: <SettlementDirectoryView />,
      },
      {
        path: 'create',
        element: <CreateSettlementView />,
      },
      {
        path: 'settlements/:id',
        element: <SettlementDetailsView />,
      },
      {
        path: 'portal',
        element: <DoctorFinancialPortalView />,
      },
      {
        path: 'reports',
        element: <FinancialReportsView />,
      },
    ],
  },
]
