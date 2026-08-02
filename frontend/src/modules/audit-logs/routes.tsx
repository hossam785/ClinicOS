// Audit Logs Module Subroutes — ClinicOS

import type { RouteObject } from 'react-router-dom'
import { AuditLogsCenterView } from './views/AuditLogsCenterView'
import { AuditInvestigationView } from './views/AuditInvestigationView'
import { AuditStatisticsView } from './views/AuditStatisticsView'

export const auditLogsDashboardRoutes: RouteObject[] = [
  {
    path: 'audit-logs',
    children: [
      {
        index: true,
        element: <AuditLogsCenterView />,
      },
      {
        path: 'investigate/:correlationId',
        element: <AuditInvestigationView />,
      },
      {
        path: 'stats',
        element: <AuditStatisticsView />,
      },
    ],
  },
]
