// AI Assistant Dashboard Routes — Module-017

import { lazy, Suspense } from 'react'
import type { RouteObject } from 'react-router-dom'
import Loader from '@/design-system/components/Loader'

const AIAssistantWorkspaceView = lazy(() => import('./views/AIAssistantWorkspaceView'))

export const aiAssistantDashboardRoutes: RouteObject[] = [
  {
    path: 'ai-assistant',
    element: (
      <Suspense
        fallback={
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <Loader size="medium" />
          </div>
        }
      >
        <AIAssistantWorkspaceView />
      </Suspense>
    ),
  },
]
