import { Router } from 'express'
import { ClinicController } from './clinic.controller'
import { auth } from '@/middleware/auth'

const tenantRouter = Router()
const adminRouter = Router()

// Workspace Scoped Endpoints (/api/v1/clinic/*)
tenantRouter.get('/profile', auth, ClinicController.getProfile)
tenantRouter.put('/profile', auth, ClinicController.updateProfile)
tenantRouter.get('/operating-hours', auth, ClinicController.getOperatingHours)
tenantRouter.put('/operating-hours', auth, ClinicController.updateOperatingHours)
tenantRouter.get('/holidays', auth, ClinicController.getHolidays)
tenantRouter.post('/holidays', auth, ClinicController.addHoliday)
tenantRouter.delete('/holidays/:holidayId', auth, ClinicController.deleteHoliday)

// Super Admin Endpoints (/api/v1/clinics/*)
adminRouter.get('/', auth, ClinicController.listClinics)
adminRouter.get('/:id', auth, ClinicController.getClinicById)
adminRouter.post('/:id/status', auth, ClinicController.updateStatus)

export const clinicTenantRoutes = tenantRouter
export const clinicAdminRoutes = adminRouter
