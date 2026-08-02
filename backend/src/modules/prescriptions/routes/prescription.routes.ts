import { Router } from 'express'
import { InMemoryPrescriptionRepository } from '../repositories/prescription.repository'
import { PrescriptionService } from '../services/prescription.service'
import { PrescriptionController } from '../controllers/prescription.controller'
import { auth } from '@/middleware/auth'

const prescriptionRepo = new InMemoryPrescriptionRepository()
const prescriptionService = new PrescriptionService(prescriptionRepo)
const prescriptionController = new PrescriptionController(prescriptionService)

export const prescriptionRouter = Router()

// All prescription endpoints require valid authentication token
prescriptionRouter.use(auth)

// CRUD & Query Routes
prescriptionRouter.post('/', prescriptionController.createPrescription)
prescriptionRouter.get('/', prescriptionController.listPrescriptions)
prescriptionRouter.get('/patient/:patientId', prescriptionController.getPatientHistory)
prescriptionRouter.get('/medical-record/:recordId', prescriptionController.getMedicalRecordPrescriptions)
prescriptionRouter.get('/:id', prescriptionController.getPrescriptionById)
prescriptionRouter.put('/:id', prescriptionController.updatePrescription)

// Workflow Lifecycle Routes
prescriptionRouter.patch('/:id/finalize', prescriptionController.finalizePrescription)
prescriptionRouter.patch('/:id/archive', prescriptionController.archivePrescription)
prescriptionRouter.patch('/:id/restore', prescriptionController.restorePrescription)

// Print & PDF Metadata Tracking Routes
prescriptionRouter.post('/:id/print', prescriptionController.registerPrint)
prescriptionRouter.post('/:id/pdf', prescriptionController.registerPdfExport)
