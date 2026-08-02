// Patient Files & Attachments Express Router — Module-016

import { Router } from 'express'
import { PatientAttachmentController } from './patientAttachment.controller'

const patientAttachmentRouter = Router()

// Patient-Scoped Attachment Endpoints
patientAttachmentRouter.post(
  '/patients/:patientId/attachments',
  PatientAttachmentController.uploadAttachment
)

patientAttachmentRouter.get(
  '/patients/:patientId/attachments',
  PatientAttachmentController.listPatientAttachments
)

patientAttachmentRouter.get(
  '/patients/:patientId/attachments/:attachmentId',
  PatientAttachmentController.getAttachmentById
)

patientAttachmentRouter.get(
  '/patients/:patientId/attachments/:attachmentId/download',
  PatientAttachmentController.downloadAttachmentStream
)

patientAttachmentRouter.get(
  '/patients/:patientId/attachments/:attachmentId/preview',
  PatientAttachmentController.previewAttachmentStream
)

patientAttachmentRouter.post(
  '/patients/:patientId/attachments/:attachmentId/replace',
  PatientAttachmentController.replaceAttachmentVersion
)

patientAttachmentRouter.patch(
  '/patients/:patientId/attachments/:attachmentId',
  PatientAttachmentController.updateMetadata
)

patientAttachmentRouter.delete(
  '/patients/:patientId/attachments/:attachmentId',
  PatientAttachmentController.softDeleteAttachment
)

patientAttachmentRouter.post(
  '/patients/:patientId/attachments/:attachmentId/restore',
  PatientAttachmentController.restoreAttachment
)

patientAttachmentRouter.get(
  '/patients/:patientId/attachments/:attachmentId/versions',
  PatientAttachmentController.getVersionHistory
)

patientAttachmentRouter.get(
  '/patients/:patientId/attachments/:attachmentId/versions/:versionId/download',
  PatientAttachmentController.downloadVersionStream
)

// Global Attachment Management Endpoints
patientAttachmentRouter.get('/attachments/categories', PatientAttachmentController.listCategories)
patientAttachmentRouter.post('/attachments/categories', PatientAttachmentController.createCategory)

patientAttachmentRouter.get('/attachments/tags', PatientAttachmentController.listTags)
patientAttachmentRouter.post('/attachments/tags', PatientAttachmentController.createTag)

patientAttachmentRouter.get('/attachments/analytics', PatientAttachmentController.getAnalytics)

export { patientAttachmentRouter }
