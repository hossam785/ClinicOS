import { Router } from 'express'
import { InMemoryPatientRepository } from '../repositories/patient.repository'
import { PatientService } from '../services/patient.service'
import { PatientController } from '../controllers/patient.controller'
import { auth } from '@/middleware/auth'

const patientRepo = new InMemoryPatientRepository()
const patientService = new PatientService(patientRepo)
const patientController = new PatientController(patientService)

export const patientRouter = Router()

// All patient management endpoints require valid authentication token
patientRouter.use(auth)

patientRouter.post('/', patientController.createPatient)
patientRouter.get('/', patientController.listPatients)
patientRouter.get('/:id', patientController.getPatientById)
patientRouter.put('/:id', patientController.updatePatient)
patientRouter.post('/:id/archive', patientController.archivePatient)
patientRouter.post('/:id/restore', patientController.restorePatient)
patientRouter.post('/:id/status', patientController.updateStatus)
