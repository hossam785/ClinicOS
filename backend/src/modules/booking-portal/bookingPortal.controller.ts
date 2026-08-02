import { Request, Response, NextFunction } from 'express'
import { AuthenticatedRequest } from '@/modules/auth/auth.types'
import { AppError } from '@/shared/errors/AppError'
import { bookingPortalService } from './bookingPortal.service'

export class BookingPortalController {
  // Public Unauthenticated Endpoints
  public static async getPublicDoctorProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params
      const bundle = await bookingPortalService.getPublicDoctorProfileBundle(slug)
      res.status(200).json({
        status: 'success',
        data: bundle,
      })
    } catch (err) {
      next(err)
    }
  }

  public static async getPublicServices(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params
      const bundle = await bookingPortalService.getPublicDoctorProfileBundle(slug)
      res.status(200).json({
        status: 'success',
        data: bundle.services,
      })
    } catch (err) {
      next(err)
    }
  }

  public static async getPublicGallery(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params
      const bundle = await bookingPortalService.getPublicDoctorProfileBundle(slug)
      res.status(200).json({
        status: 'success',
        data: bundle.gallery,
      })
    } catch (err) {
      next(err)
    }
  }

  public static async getPublicFaqs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params
      const bundle = await bookingPortalService.getPublicDoctorProfileBundle(slug)
      res.status(200).json({
        status: 'success',
        data: bundle.faqs,
      })
    } catch (err) {
      next(err)
    }
  }

  public static async getPublicReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params
      const bundle = await bookingPortalService.getPublicDoctorProfileBundle(slug)
      res.status(200).json({
        status: 'success',
        data: bundle.reviews,
      })
    } catch (err) {
      next(err)
    }
  }

  public static async getPublicCalendar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params
      const date = (req.query.date as string) || new Date().toISOString().split('T')[0]
      const calendar = await bookingPortalService.getPublicCalendar(slug, date)
      res.status(200).json({
        status: 'success',
        data: calendar,
      })
    } catch (err) {
      next(err)
    }
  }

  public static async submitPublicBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params
      const confirmation = await bookingPortalService.submitPublicBooking(slug, req.body)
      res.status(201).json({
        status: 'success',
        data: confirmation,
      })
    } catch (err) {
      next(err)
    }
  }

  // Helper for Platform Owner Privacy Barrier Check
  private static enforcePlatformBarrier(req: AuthenticatedRequest): string {
    const user = req.user
    if (!user) {
      throw new AppError('Authentication required', 401, 'UNAUTHORIZED')
    }

    if (user.role === 'SUPER_ADMIN' || user.tenantId === 'PLATFORM') {
      throw new AppError(
        'Platform administrators cannot modify doctor branding or clinic booking settings.',
        403,
        'PLATFORM_ADMIN_BRANDING_RESTRICTED'
      )
    }

    return user.userId || 'doc_ahmed_01'
  }

  // Dashboard Management Endpoints
  public static async getDashboardProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const doctorId = BookingPortalController.enforcePlatformBarrier(req)
      const profile = await bookingPortalService.getDashboardProfile(doctorId)
      res.status(200).json({ status: 'success', data: profile })
    } catch (err) {
      next(err)
    }
  }

  public static async updateDashboardProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const doctorId = BookingPortalController.enforcePlatformBarrier(req)
      const updated = await bookingPortalService.updateProfileBio(doctorId, req.body)
      res.status(200).json({ status: 'success', data: updated })
    } catch (err) {
      next(err)
    }
  }

  public static async updateBranding(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const doctorId = BookingPortalController.enforcePlatformBarrier(req)
      const branding = await bookingPortalService.updateBranding(doctorId, req.body)
      res.status(200).json({ status: 'success', data: branding })
    } catch (err) {
      next(err)
    }
  }

  public static async updateBookingSettings(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const doctorId = BookingPortalController.enforcePlatformBarrier(req)
      const settings = await bookingPortalService.updateBookingSettings(doctorId, req.body)
      res.status(200).json({ status: 'success', data: settings })
    } catch (err) {
      next(err)
    }
  }

  public static async updateSeo(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const doctorId = BookingPortalController.enforcePlatformBarrier(req)
      const seo = await bookingPortalService.updateSeoSettings(doctorId, req.body)
      res.status(200).json({ status: 'success', data: seo })
    } catch (err) {
      next(err)
    }
  }

  // Service Catalog Management
  public static async getDashboardServices(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const doctorId = BookingPortalController.enforcePlatformBarrier(req)
      const services = await bookingPortalService.getDashboardServices(doctorId)
      res.status(200).json({ status: 'success', data: services })
    } catch (err) {
      next(err)
    }
  }

  public static async createDashboardService(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const doctorId = BookingPortalController.enforcePlatformBarrier(req)
      const service = await bookingPortalService.createDashboardService(doctorId, req.body)
      res.status(201).json({ status: 'success', data: service })
    } catch (err) {
      next(err)
    }
  }

  public static async deleteDashboardService(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const doctorId = BookingPortalController.enforcePlatformBarrier(req)
      const { id } = req.params
      const deleted = await bookingPortalService.deleteDashboardService(doctorId, id)
      res.status(200).json({ status: 'success', data: { deleted } })
    } catch (err) {
      next(err)
    }
  }

  // Gallery Management
  public static async getDashboardGallery(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const doctorId = BookingPortalController.enforcePlatformBarrier(req)
      const gallery = await bookingPortalService.getDashboardGallery(doctorId)
      res.status(200).json({ status: 'success', data: gallery })
    } catch (err) {
      next(err)
    }
  }

  public static async createDashboardGalleryItem(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const doctorId = BookingPortalController.enforcePlatformBarrier(req)
      const item = await bookingPortalService.createDashboardGalleryItem(doctorId, req.body)
      res.status(201).json({ status: 'success', data: item })
    } catch (err) {
      next(err)
    }
  }

  public static async deleteDashboardGalleryItem(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const doctorId = BookingPortalController.enforcePlatformBarrier(req)
      const { id } = req.params
      const deleted = await bookingPortalService.deleteDashboardGalleryItem(doctorId, id)
      res.status(200).json({ status: 'success', data: { deleted } })
    } catch (err) {
      next(err)
    }
  }

  // FAQ Management
  public static async getDashboardFaqs(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const doctorId = BookingPortalController.enforcePlatformBarrier(req)
      const faqs = await bookingPortalService.getDashboardFaqs(doctorId)
      res.status(200).json({ status: 'success', data: faqs })
    } catch (err) {
      next(err)
    }
  }

  public static async createDashboardFaq(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const doctorId = BookingPortalController.enforcePlatformBarrier(req)
      const faq = await bookingPortalService.createDashboardFaq(doctorId, req.body)
      res.status(201).json({ status: 'success', data: faq })
    } catch (err) {
      next(err)
    }
  }

  public static async deleteDashboardFaq(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const doctorId = BookingPortalController.enforcePlatformBarrier(req)
      const { id } = req.params
      const deleted = await bookingPortalService.deleteDashboardFaq(doctorId, id)
      res.status(200).json({ status: 'success', data: { deleted } })
    } catch (err) {
      next(err)
    }
  }

  // Analytics Dashboard Metric
  public static async getDashboardAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const doctorId = BookingPortalController.enforcePlatformBarrier(req)
      const period = (req.query.period as string) || '2026-08'
      const analytics = await bookingPortalService.getDashboardAnalytics(doctorId, period)
      res.status(200).json({ status: 'success', data: analytics })
    } catch (err) {
      next(err)
    }
  }
}
