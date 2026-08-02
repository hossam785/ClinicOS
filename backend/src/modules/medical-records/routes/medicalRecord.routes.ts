import { Router } from 'express'
import { InMemoryMedicalRecordRepository } from '../repositories/medicalRecord.repository'
import { MedicalRecordService } from '../services/medicalRecord.service'
import { MedicalRecordController } from '../controllers/medicalRecord.controller'
import { auth } from '@/middleware/auth'

const recordRepo = new InMemoryMedicalRecordRepository()
const recordService = new MedicalRecordService(recordRepo)
const recordController = new MedicalRecordController(recordService)

export const medicalRecordRouter = Router()

// All medical record management endpoints require valid authentication token
medicalRecordRouter.use(auth)

medicalRecordRouter.post('/', recordController.createRecord)
medicalRecordRouter.get('/', recordController.listRecords)
medicalRecordRouter.get('/patient/:patientId/history', recordController.getPatientHistory)
medicalRecordRouter.get('/:id', recordController.getRecordById)
medicalRecordRouter.put('/:id', recordController.updateRecord)
medicalRecordRouter.post('/:id/complete', recordController.completeRecord)
medicalRecordRouter.post('/:id/addendum', recordController.addAddendum)
medicalRecordRouter.delete('/:id', recordController.archiveRecord)
