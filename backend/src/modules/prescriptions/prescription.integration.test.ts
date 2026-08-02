import { InMemoryPrescriptionRepository } from './repositories/prescription.repository'
import { PrescriptionService } from './services/prescription.service'
import { PrescriptionValidator } from './validators/prescription.validator'
import type { CreatePrescriptionDto } from './types/prescription.types'
import { AppError } from '@/shared/errors/AppError'

async function runPrescriptionIntegrationTests() {
  console.info('===========================================================')
  console.info('STARTING TASK-081: PRESCRIPTION MANAGEMENT INTEGRATION TESTS')
  console.info('===========================================================')

  let totalTests = 0

  function assert(condition: boolean, testName: string, failureDetails?: string) {
    totalTests++
    if (condition) {
      console.info(`[PASS] Test #${totalTests}: ${testName}`)
    } else {
      console.error(`[FAIL] Test #${totalTests}: ${testName}`)
      if (failureDetails) console.error(`       Details: ${failureDetails}`)
      throw new Error(`Integration Test Failed: ${testName} - ${failureDetails || ''}`)
    }
  }

  const repo = new InMemoryPrescriptionRepository()
  const service = new PrescriptionService(repo)

  const tenantId = 'clinic-101'
  const doctorId = 'doc-101'
  const doctorRole = 'DOCTOR'
  const patientId = 'pat-7701'
  const medicalRecordId = 'emr-9901'

  // TEST 1: Pre-database Validation - Create Payload Validation
  {
    const invalidPayload: Record<string, unknown> = {
      patientId: '',
      medicalRecordId: 'emr-1',
      visitDate: '2026-07-30',
    }
    const val = PrescriptionValidator.validateCreate(invalidPayload)
    assert(!val.isValid, 'Validator rejects empty patientId on create', val.error)
  }

  // TEST 2: Pre-database Validation - Dosage Form Check
  {
    const invalidMedPayload: Record<string, unknown> = {
      patientId: 'pat-1',
      medicalRecordId: 'emr-1',
      visitDate: '2026-07-30',
      medications: [
        {
          medicineName: 'Test Med',
          dosageForm: 'UnobtaniumForm', // Invalid form
          dosage: '1 Pill',
          frequency: 'QD',
        },
      ],
    }
    const val = PrescriptionValidator.validateCreate(invalidMedPayload)
    assert(!val.isValid, 'Validator rejects invalid dosageForm', val.error)
  }

  // TEST 3: Create Draft Prescription
  let createdRxId = ''
  let createdRxNum = ''
  {
    const createDto: CreatePrescriptionDto = {
      patientId,
      patientName: 'John Doe',
      patientCode: 'PAT-7701',
      patientAge: 42,
      patientGender: 'Male',
      medicalRecordId,
      appointmentId: 'apt-5501',
      clinicId: 'clinic-branch-01',
      doctorId,
      doctorName: 'Dr. Sarah Jenkins',
      visitDate: '2026-07-30',
      diagnosisSummary: 'Acute Bronchitis & Wheezing',
      clinicalNotes: 'Avoid cold drinks and complete full antibiotic course.',
      followUpAdvice: 'Return in 7 days.',
      medications: [
        {
          medicineName: 'Amoxicillin / Clavulanic Acid',
          strength: '500 mg / 125 mg',
          dosageForm: 'Tablet',
          dosage: '1 Tablet',
          frequency: 'Three times daily (TID)',
          duration: '7 Days',
          quantity: '21 Tablets',
          instructions: 'Take after food.',
        },
      ],
    }

    const rx = await service.createPrescription(tenantId, doctorId, doctorRole, createDto)
    assert(rx.status === 'DRAFT', 'New prescription status is DRAFT')
    assert(rx.patientId === patientId, 'Prescription bound to correct patientId')
    assert(rx.medicalRecordId === medicalRecordId, 'Prescription bound to correct medicalRecordId')
    assert(rx.medications.length === 1, 'Medication line item correctly embedded')
    assert(Boolean(rx.prescriptionNumber), 'Prescription number generated')

    createdRxId = rx._id
    createdRxNum = rx.prescriptionNumber
  }

  // TEST 4: Get Prescription By ID
  {
    const rx = await service.getPrescriptionById(tenantId, createdRxId, doctorRole)
    assert(rx._id === createdRxId, 'Fetched prescription ID matches')
    assert(rx.prescriptionNumber === createdRxNum, 'Fetched prescription number matches')
  }

  // TEST 5: Update Active Draft Prescription
  {
    const updateDto = {
      diagnosisSummary: 'Acute Bronchitis & Cough',
      medications: [
        {
          medicineName: 'Amoxicillin / Clavulanic Acid',
          strength: '500 mg / 125 mg',
          dosageForm: 'Tablet' as const,
          dosage: '1 Tablet',
          frequency: 'Three times daily (TID)',
          duration: '7 Days',
          quantity: '21 Tablets',
          instructions: 'Take after food.',
        },
        {
          medicineName: 'Guaifenesin Cough Syrup',
          strength: '100 mg/5 mL',
          dosageForm: 'Syrup' as const,
          dosage: '10 mL',
          frequency: 'Every 8 hours',
          duration: '5 Days',
          quantity: '1 Bottle',
          instructions: 'Take as needed for severe cough.',
        },
      ],
    }

    const updated = await service.updatePrescription(tenantId, createdRxId, doctorId, doctorRole, updateDto)
    assert(updated.diagnosisSummary === 'Acute Bronchitis & Cough', 'Diagnosis summary updated')
    assert(updated.medications.length === 2, 'Added second medication line item to draft')
    assert(updated.version === 2, 'Optimistic concurrency version incremented to 2')
  }

  // TEST 6: Finalize & Sign Prescription
  {
    const finalized = await service.finalizePrescription(tenantId, createdRxId, doctorId, doctorRole)
    assert(finalized.status === 'FINALIZED', 'Prescription status transitioned to FINALIZED')
    assert(Boolean(finalized.auditInfo.finalizedBy), 'FinalizedBy audit trail recorded')
    assert(Boolean(finalized.auditInfo.finalizedAt), 'FinalizedAt timestamp recorded')
  }

  // TEST 7: Immutability Violation Prevention (Reject Edit After Finalization)
  {
    let caughtError = false
    try {
      await service.updatePrescription(tenantId, createdRxId, doctorId, doctorRole, {
        diagnosisSummary: 'Attempted Illegal Edit',
      })
    } catch (err: unknown) {
      caughtError = true
      const errorObj = err as AppError
      const errCode = errorObj.errorCode || 'UNKNOWN_ERROR'
      assert(errCode === 'PRESCRIPTION_LOCKED', `Returns PRESCRIPTION_LOCKED error code (got ${errCode})`)
    }
    assert(caughtError, 'Updating finalized prescription is blocked')
  }

  // TEST 8: Register Direct Print Event
  {
    const printed = await service.registerPrint(tenantId, createdRxId, doctorId, doctorRole, 'PRINT_DIRECT')
    assert(printed.status === 'PRINTED', 'Status transitioned from FINALIZED to PRINTED on first print')
    assert(printed.printInfo.printCount === 1, 'Print count incremented to 1')
    assert(printed.printInfo.lastPrintedBy === doctorId, 'Last printed by set to actor')
    assert(printed.printInfo.printHistory.length === 1, 'Print history log item added')
  }

  // TEST 9: Register Vector PDF Export Metadata
  {
    const pdfExported = await service.registerPdfExport(tenantId, createdRxId, doctorId, doctorRole)
    assert(pdfExported.printInfo.exportedPdfCount === 1, 'Exported PDF count incremented to 1')
    assert(Boolean(pdfExported.printInfo.exportedPdfAt), 'Exported PDF timestamp recorded')
  }

  // TEST 10: Patient Prescription History Timeline Query
  {
    const history = await service.getPatientHistory(tenantId, patientId, doctorRole)
    assert(history.length >= 1, 'Patient prescription history returns patient record')
    assert(history[0].patientId === patientId, 'History item patient ID matches')
  }

  // TEST 11: EMR Medical Record Prescriptions Query
  {
    const emrRxList = await service.getMedicalRecordPrescriptions(tenantId, medicalRecordId, doctorRole)
    assert(emrRxList.length >= 1, 'Medical record prescriptions query returns record')
    assert(emrRxList[0].medicalRecordId === medicalRecordId, 'Medical record ID matches')
  }

  // TEST 12: Multi-Criteria Search & Filtering
  {
    const searchRes = await service.listPrescriptions(tenantId, doctorRole, {
      patientId,
      status: 'PRINTED',
      search: 'John',
    })
    assert(searchRes.total >= 1, 'Search query returned matching prescription record')
    assert(searchRes.data[0]._id === createdRxId, 'Search returned expected prescription ID')
  }

  // TEST 13: Platform Owner PHI Privacy Block (PLATFORM_ADMIN_PHI_RESTRICTED)
  {
    let caughtAdminBlock = false
    try {
      await service.getPrescriptionById(tenantId, createdRxId, 'PLATFORM_ADMIN')
    } catch (err: unknown) {
      caughtAdminBlock = true
      const errorObj = err as AppError
      const errCode = errorObj.errorCode || 'UNKNOWN_ERROR'
      assert(
        errCode === 'PLATFORM_ADMIN_PHI_RESTRICTED',
        `PLATFORM_ADMIN access rejected with PLATFORM_ADMIN_PHI_RESTRICTED error code (got ${errCode})`
      )
    }
    assert(caughtAdminBlock, 'Platform Admin PHI privacy barrier enforced successfully')
  }

  // TEST 14: Multi-Tenant Workspace Isolation
  {
    let caughtTenantError = false
    try {
      await service.getPrescriptionById('different-tenant-999', createdRxId, doctorRole)
    } catch (err: unknown) {
      caughtTenantError = true
      const errorObj = err as AppError
      const errCode = errorObj.errorCode || 'UNKNOWN_ERROR'
      assert(errCode === 'PRESCRIPTION_NOT_FOUND', `Cross-tenant access returns 404 PRESCRIPTION_NOT_FOUND (got ${errCode})`)
    }
    assert(caughtTenantError, 'Multi-tenant isolation verified')
  }

  // TEST 15: Archive & Restore Lifecycle
  {
    const archiveReason = 'Prescription strength adjusted due to patient feedback.'
    const archived = await service.archivePrescription(tenantId, createdRxId, doctorId, doctorRole, archiveReason)
    assert(archived.status === 'ARCHIVED', 'Prescription status set to ARCHIVED')
    assert(archived.archived === true, 'Soft-delete flag archived set to true')
    assert(archived.auditInfo.archivedReason === archiveReason, 'Archival reason stored in auditInfo')

    const restored = await service.restorePrescription(tenantId, createdRxId, doctorId, doctorRole)
    assert(restored.status === 'FINALIZED', 'Restored prescription status returned to FINALIZED')
    assert(restored.archived === false, 'Archived flag reset to false')
  }

  console.info('===========================================================')
  console.info(`ALL ${totalTests} PRESCRIPTION INTEGRATION TESTS PASSED SUCCESSFULLY!`)
  console.info('===========================================================')
}

runPrescriptionIntegrationTests().catch((err) => {
  console.error('PRESCRIPTION INTEGRATION TEST FAILED:', err)
  process.exit(1)
})
