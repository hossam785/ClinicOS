// Platform Control Panel Routes — Module-019

import { lazy, Suspense } from 'react'
import type { RouteObject } from 'react-router-dom'
import Loader from '@/design-system/components/Loader'

const PlatformControlWorkspaceView = lazy(() => import('./views/PlatformControlWorkspaceView'))

export const platformControlDashboardRoutes: RouteObject[] = [
  {
    path: 'platform-control',
    element: (
      <Suspense
        fallback={
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <Loader size="medium" />
          </div>
        }
      >
        <PlatformControlWorkspaceView />
      </Suspense>
    ),
  },
]
