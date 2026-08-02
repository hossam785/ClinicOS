import { Router } from 'express'
import { InMemoryDoctorRepository } from '../repositories/doctor.repository'
import { DoctorService } from '../services/doctor.service'
import { DoctorController } from '../controllers/doctor.controller'
import { auth } from '@/middleware/auth'

const doctorRepo = new InMemoryDoctorRepository()
const doctorService = new DoctorService(doctorRepo)
const doctorController = new DoctorController(doctorService)

export const doctorRouter = Router()

// All doctor management endpoints require valid authentication token
doctorRouter.use(auth)

doctorRouter.post('/invite', doctorController.inviteDoctor)
doctorRouter.get('/', doctorController.listDoctors)
doctorRouter.get('/:id', doctorController.getDoctorById)
doctorRouter.put('/:id', doctorController.updateDoctorProfile)
doctorRouter.put('/:id/fees', doctorController.updateFees)
doctorRouter.get('/:id/schedule', doctorController.updateSchedule)
doctorRouter.put('/:id/schedule', doctorController.updateSchedule)
doctorRouter.get('/:id/leaves', doctorController.getLeaves)
doctorRouter.post('/:id/leaves', doctorController.addLeave)
doctorRouter.delete('/:id/leaves/:leaveId', doctorController.deleteLeave)
doctorRouter.post('/:id/verify-license', doctorController.verifyLicense)
doctorRouter.post('/:id/status', doctorController.updateStatus)
