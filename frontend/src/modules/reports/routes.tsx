// Reports & Analytics Module Route Definitions — ClinicOS

import type { RouteObject } from 'react-router-dom'
import { AnalyticsDashboardView } from './views/AnalyticsDashboardView'
import { ReportsCenterView } from './views/ReportsCenterView'
import { ReportViewerInspectorView } from './views/ReportViewerInspectorView'
import { ReportHistoryView } from './views/ReportHistoryView'

export const reportsDashboardRoutes: RouteObject[] = [
  {
    path: 'analytics',
    element: <AnalyticsDashboardView />,
  },
  {
    path: 'reports',
    children: [
      {
        index: true,
        element: <ReportsCenterView />,
      },
      {
        path: 'view/:type',
        element: <ReportViewerInspectorView />,
      },
      {
        path: 'history',
        element: <ReportHistoryView />,
      },
    ],
  },
]
