import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { env } from '@/config/environment'
import { errorHandler } from '@/middleware/errorHandler'
import { AppError } from '@/shared/errors/AppError'
import { authRoutes } from '@/modules/auth/auth.routes'
import { clinicTenantRoutes, clinicAdminRoutes } from '@/modules/clinic/clinic.routes'
import { doctorRouter } from '@/modules/doctor/routes/doctor.routes'
import { patientRouter } from '@/modules/patient/routes/patient.routes'
import { appointmentRouter } from '@/modules/appointment/routes/appointment.routes'
import { medicalRecordRouter } from '@/modules/medical-records/routes/medicalRecord.routes'
import { prescriptionRouter } from '@/modules/prescriptions/routes/prescription.routes'
import { expenseRouter, expenseCategoryRouter } from '@/modules/expenses/routes/expense.routes'
import { doctorFinancialsRouter } from '@/modules/doctor-financials/routes/doctorFinancials.routes'
import { notificationRouter, notificationPreferencesRouter } from '@/modules/notifications/routes/notification.routes'
import { reportsRouter } from '@/modules/reports/routes/reports.routes'
import { auditLogsRouter } from '@/modules/audit-logs/auditLogs.routes'
import { backupRestoreRouter } from '@/modules/backup-restore/backupRestore.routes'
import { bookingPortalRouter } from '@/modules/booking-portal/bookingPortal.routes'
import { patientAttachmentRouter } from '@/modules/patient-attachments/patientAttachment.routes'
import { aiAssistantRouter } from '@/modules/ai-assistant/aiAssistant.routes'
import syncEngineRoutes from '@/modules/sync-engine/syncEngine.routes'
import platformControlRoutes from '@/modules/platform-control/platformControl.routes'
import { localizationMiddleware } from '@/modules/localization/localizationMiddleware'
import { AuthService } from '@/modules/auth/auth.service'

const app = express()

// Initialize Platform Super Admin Bootstrap
AuthService.bootstrapSuperAdmin().catch((err) => {
  console.error('[ClinicOS Backend] Platform Super Admin Bootstrap Error:', err)
})

// Global Middlewares
app.use(cors())
app.use(express.json())
app.use(localizationMiddleware)

// Mount API Routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/clinic', clinicTenantRoutes)
app.use('/api/v1/clinics', clinicAdminRoutes)
app.use('/api/v1/doctors', doctorRouter)
app.use('/api/v1/patients', patientRouter)
app.use('/api/v1/appointments', appointmentRouter)
app.use('/api/v1/medical-records', medicalRecordRouter)
app.use('/api/v1/prescriptions', prescriptionRouter)
app.use('/api/v1/expenses', expenseRouter)
app.use('/api/v1/expense-categories', expenseCategoryRouter)
app.use('/api/v1/doctor-financial-accounts', doctorFinancialsRouter)
app.use('/api/v1/notifications', notificationRouter)
app.use('/api/v1/notification-preferences', notificationPreferencesRouter)
app.use('/api/v1/reports', reportsRouter)
app.use('/api/v1/audit-logs', auditLogsRouter)
app.use('/api/v1/backup-restore', backupRestoreRouter)
app.use('/api/v1/booking-portal', bookingPortalRouter)
app.use('/api/v1/patient-attachments', patientAttachmentRouter)
app.use('/api/v1/ai-assistant', aiAssistantRouter)
app.use('/api/v1/sync', syncEngineRoutes)
app.use('/api/v1/platform', platformControlRoutes)

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'ClinicOS Backend Gateway',
    env: env.NODE_ENV,
  })
})

// Mock error trigger endpoint for verification
app.get('/error-test', (_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError('This is a simulated validation conflict error.', 409, 'SIMULATED_CONFLICT'))
})

// Global Error Handler Middleware
app.use(errorHandler)

export { app }
export default app
