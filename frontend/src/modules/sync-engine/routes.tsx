// Desktop Offline Synchronization Engine Routes — Module-018

import { lazy, Suspense } from 'react'
import type { RouteObject } from 'react-router-dom'
import Loader from '@/design-system/components/Loader'

const SyncCenterWorkspaceView = lazy(() => import('./views/SyncCenterWorkspaceView'))

export const syncEngineDashboardRoutes: RouteObject[] = [
  {
    path: 'sync-engine',
    element: (
      <Suspense
        fallback={
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <Loader size="medium" />
          </div>
        }
      >
        <SyncCenterWorkspaceView />
      </Suspense>
    ),
  },
]
