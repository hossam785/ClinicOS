// Reports & Analytics Express Routes — ClinicOS

import { Router } from 'express'
import { auth } from '@/middleware/auth'
import { tenantIsolation } from '@/middleware/tenantIsolation'
import { ReportsController } from '../controllers/reports.controller'

const reportsRouter = Router()

// Enforce authentication & multi-tenant isolation middleware globally for reports
reportsRouter.use(auth)
reportsRouter.use(tenantIsolation)

// Active REST Endpoints
reportsRouter.get('/dashboard', ReportsController.getDashboardKpis)
reportsRouter.get('/dashboard/charts', ReportsController.getDashboardCharts)
reportsRouter.get('/financial', ReportsController.getFinancialReport)
reportsRouter.get('/doctors', ReportsController.getDoctorReports)
reportsRouter.get('/patients', ReportsController.getPatientReports)
reportsRouter.get('/appointments', ReportsController.getAppointmentReports)
reportsRouter.get('/medical', ReportsController.getMedicalReports)
reportsRouter.get('/operations', ReportsController.getOperationalReports)
reportsRouter.get('/history', ReportsController.getReportHistory)
reportsRouter.get('/history/:id', ReportsController.getReportHistoryById)
reportsRouter.post('/export', ReportsController.exportReport)

export { reportsRouter }
