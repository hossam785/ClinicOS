import { Router } from 'express'
import { InMemoryAppointmentRepository } from '../repositories/appointment.repository'
import { AppointmentService } from '../services/appointment.service'
import { AppointmentController } from '../controllers/appointment.controller'
import { auth } from '@/middleware/auth'

const appointmentRepo = new InMemoryAppointmentRepository()
const appointmentService = new AppointmentService(appointmentRepo)
const appointmentController = new AppointmentController(appointmentService)

export const appointmentRouter = Router()

// All appointment management endpoints require valid authentication token
appointmentRouter.use(auth)

appointmentRouter.post('/', appointmentController.createAppointment)
appointmentRouter.get('/', appointmentController.listAppointments)
appointmentRouter.get('/availability', appointmentController.checkAvailability)
appointmentRouter.get('/queue/daily', appointmentController.getDailyQueue)
appointmentRouter.get('/:id', appointmentController.getAppointmentById)
appointmentRouter.put('/:id', appointmentController.updateAppointment)
appointmentRouter.post('/:id/check-in', appointmentController.checkInPatient)
appointmentRouter.post('/:id/start-consultation', appointmentController.startConsultation)
appointmentRouter.post('/:id/complete', appointmentController.completeConsultation)
appointmentRouter.post('/:id/cancel', appointmentController.cancelAppointment)
appointmentRouter.post('/:id/status', appointmentController.updateStatus)
