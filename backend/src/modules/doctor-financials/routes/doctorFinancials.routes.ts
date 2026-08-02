import { Router } from 'express'
import { InMemoryDoctorFinancialsRepository } from '../repositories/doctorFinancials.repository'
import { DoctorFinancialsService } from '../services/doctorFinancials.service'
import { DoctorFinancialsController } from '../controllers/doctorFinancials.controller'
import { auth } from '@/middleware/auth'

const repo = new InMemoryDoctorFinancialsRepository()
const service = new DoctorFinancialsService(repo)
const controller = new DoctorFinancialsController(service)

export const doctorFinancialsRouter = Router()

// All routes require valid authentication token
doctorFinancialsRouter.use(auth)

// Dashboard Summary & Account Endpoints
doctorFinancialsRouter.get('/dashboard/summary', controller.getDashboardSummary)
doctorFinancialsRouter.get('/account/:doctorId', controller.getAccountSummary)

// Settlement Roster CRUD & Query Endpoints
doctorFinancialsRouter.get('/settlements', controller.listSettlements)
doctorFinancialsRouter.post('/settlements', controller.createSettlement)
doctorFinancialsRouter.get('/settlements/:id', controller.getSettlementById)
doctorFinancialsRouter.put('/settlements/:id', controller.updateSettlement)

// Workflow Lifecycle Transition Endpoints
doctorFinancialsRouter.patch('/settlements/:id/submit', controller.submitSettlement)
doctorFinancialsRouter.patch('/settlements/:id/approve', controller.approveSettlement)
doctorFinancialsRouter.patch('/settlements/:id/reject', controller.rejectSettlement)
doctorFinancialsRouter.post('/settlements/:id/payments', controller.recordPayment)
doctorFinancialsRouter.patch('/settlements/:id/close', controller.closeSettlement)
doctorFinancialsRouter.patch('/settlements/:id/archive', controller.archiveSettlement)
doctorFinancialsRouter.patch('/settlements/:id/restore', controller.restoreSettlement)
