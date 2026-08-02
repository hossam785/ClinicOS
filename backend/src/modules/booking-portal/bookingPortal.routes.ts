import { Router } from 'express'
import { auth } from '@/middleware/auth'
import { tenantIsolation } from '@/middleware/tenantIsolation'
import { BookingPortalController } from './bookingPortal.controller'

const bookingPortalRouter = Router()

// ----------------------------------------------------
// 1. PUBLIC UNAUTHENTICATED ENDPOINTS (/public/doctors/*)
// ----------------------------------------------------
bookingPortalRouter.get('/public/doctors/:slug', BookingPortalController.getPublicDoctorProfile)
bookingPortalRouter.get('/public/doctors/:slug/services', BookingPortalController.getPublicServices)
bookingPortalRouter.get('/public/doctors/:slug/gallery', BookingPortalController.getPublicGallery)
bookingPortalRouter.get('/public/doctors/:slug/faqs', BookingPortalController.getPublicFaqs)
bookingPortalRouter.get('/public/doctors/:slug/reviews', BookingPortalController.getPublicReviews)
bookingPortalRouter.get('/public/doctors/:slug/calendar', BookingPortalController.getPublicCalendar)
bookingPortalRouter.post('/public/doctors/:slug/book', BookingPortalController.submitPublicBooking)

// ----------------------------------------------------
// 2. DASHBOARD AUTHENTICATED MANAGEMENT ENDPOINTS (/dashboard/booking/*)
// ----------------------------------------------------
const dashboardRouter = Router()
dashboardRouter.use(auth)
dashboardRouter.use(tenantIsolation)

dashboardRouter.get('/profile', BookingPortalController.getDashboardProfile)
dashboardRouter.put('/profile', BookingPortalController.updateDashboardProfile)

dashboardRouter.get('/branding', BookingPortalController.getDashboardProfile)
dashboardRouter.put('/branding', BookingPortalController.updateBranding)

dashboardRouter.get('/settings', BookingPortalController.getDashboardProfile)
dashboardRouter.put('/settings', BookingPortalController.updateBookingSettings)

dashboardRouter.get('/seo', BookingPortalController.getDashboardProfile)
dashboardRouter.put('/seo', BookingPortalController.updateSeo)

dashboardRouter.get('/services', BookingPortalController.getDashboardServices)
dashboardRouter.post('/services', BookingPortalController.createDashboardService)
dashboardRouter.delete('/services/:id', BookingPortalController.deleteDashboardService)

dashboardRouter.get('/gallery', BookingPortalController.getDashboardGallery)
dashboardRouter.post('/gallery', BookingPortalController.createDashboardGalleryItem)
dashboardRouter.delete('/gallery/:id', BookingPortalController.deleteDashboardGalleryItem)

dashboardRouter.get('/faqs', BookingPortalController.getDashboardFaqs)
dashboardRouter.post('/faqs', BookingPortalController.createDashboardFaq)
dashboardRouter.delete('/faqs/:id', BookingPortalController.deleteDashboardFaq)

dashboardRouter.get('/analytics', BookingPortalController.getDashboardAnalytics)

// Mount dashboard router onto main router
bookingPortalRouter.use('/dashboard/booking', dashboardRouter)

export { bookingPortalRouter }
