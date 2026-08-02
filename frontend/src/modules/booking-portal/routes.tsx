import type { RouteObject } from 'react-router-dom'
import { PublicDoctorPortalView } from './views/PublicDoctorPortalView'
import { DashboardPortalProfileView } from './views/DashboardPortalProfileView'
import { DashboardPortalBrandingView } from './views/DashboardPortalBrandingView'
import { DashboardPortalServicesView } from './views/DashboardPortalServicesView'
import { DashboardPortalGalleryView } from './views/DashboardPortalGalleryView'
import { DashboardPortalFaqView } from './views/DashboardPortalFaqView'
import { DashboardPortalSettingsView } from './views/DashboardPortalSettingsView'
import { DashboardPortalSeoView } from './views/DashboardPortalSeoView'
import { DashboardPortalAnalyticsView } from './views/DashboardPortalAnalyticsView'

export const bookingPortalPublicRoutes: RouteObject[] = [
  {
    path: '/book/:slug',
    element: <PublicDoctorPortalView />,
  },
]

export const bookingPortalDashboardRoutes: RouteObject[] = [
  {
    path: 'booking/profile',
    element: <DashboardPortalProfileView />,
  },
  {
    path: 'booking/branding',
    element: <DashboardPortalBrandingView />,
  },
  {
    path: 'booking/services',
    element: <DashboardPortalServicesView />,
  },
  {
    path: 'booking/gallery',
    element: <DashboardPortalGalleryView />,
  },
  {
    path: 'booking/faq',
    element: <DashboardPortalFaqView />,
  },
  {
    path: 'booking/settings',
    element: <DashboardPortalSettingsView />,
  },
  {
    path: 'booking/seo',
    element: <DashboardPortalSeoView />,
  },
  {
    path: 'booking/analytics',
    element: <DashboardPortalAnalyticsView />,
  },
]
