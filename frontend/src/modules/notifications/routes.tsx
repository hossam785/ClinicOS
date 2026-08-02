import type { RouteObject } from 'react-router-dom'
import { NotificationCenterView } from './views/NotificationCenterView'
import { NotificationPreferencesView } from './views/NotificationPreferencesView'

export const notificationDashboardRoutes: RouteObject[] = [
  {
    path: 'notifications',
    element: <NotificationCenterView />,
  },
  {
    path: 'notifications/preferences',
    element: <NotificationPreferencesView />,
  },
]
