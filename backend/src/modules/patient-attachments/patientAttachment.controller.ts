// Patient Files & Attachments Express Controllers — Module-016

import type { Request, Response } from 'express'
import { patientAttachmentService } from './patientAttachment.service'

interface ICustomRequest extends Request {
  file?: {
    originalname: string
    buffer: Buffer
    size: number
    mimetype: string
  }
}

export class PatientAttachmentController {
  static async uploadAttachment(req: Request, res: Response): Promise<void> {
    try {
      const customReq = req as ICustomRequest
      const patientId = req.params.patientId
      const tenantId = (req as unknown as Record<string, string>).tenantId || 'tenant-default'
      const clinicId = (req as unknown as Record<string, string>).clinicId || 'clinic-default'
      const user = (req as unknown as Record<string, Record<string, string>>).user || {
        userId: 'usr_doc_01',
        userName: 'Dr. Ahmed Al-Mansoor',
        role: 'DOCTOR',
      }

      let fileData = customReq.file
      if (!fileData && req.body.fileBase64) {
        const buf = Buffer.from(req.body.fileBase64, 'base64')
        fileData = {
          originalname: req.body.fileName || 'attachment.pdf',
          buffer: buf,
          size: buf.length,
          mimetype: req.body.mimeType || 'application/pdf',
        }
      }

      if (!fileData) {
        res.status(400).json({
          status: 'error',
          error: { code: 'FILE_MISSING', message: 'Multipart file or base64 file payload missing.' },
        })
        return
      }

      const created = await patientAttachmentService.uploadAttachment({
        patientId,
        tenantId,
        clinicId,
        file: fileData,
        categoryId: req.body.categoryId || 'cat_01',
        description: req.body.description,
        tags: typeof req.body.tags === 'string' ? req.body.tags.split(',') : req.body.tags,
        notes: req.body.notes,
        uploader: {
          userId: user.userId || 'usr_doc_01',
          userName: user.userName || 'Dr. Ahmed Al-Mansoor',
          userRole: user.role || 'DOCTOR',
        },
      })

      res.status(201).json({ status: 'success', data: created })
    } catch (err: unknown) {
      const error = err as { message?: string }
      res.status(400).json({ status: 'error', error: { code: 'UPLOAD_FAILED', message: error.message } })
    }
  }

  static async listPatientAttachments(req: Request, res: Response): Promise<void> {
    try {
      const patientId = req.params.patientId
      const tenantId = (req as unknown as Record<string, string>).tenantId || 'tenant-default'
      const userRole = (req as unknown as Record<string, Record<string, string>>).user?.role

      const result = await patientAttachmentService.getPatientAttachments(tenantId, patientId, req.query, userRole)
      res.status(200).json({ status: 'success', data: result })
    } catch (err: unknown) {
      const error = err as { message?: string }
      const isForbidden = error.message?.includes('PLATFORM_ADMIN_ATTACHMENTS_RESTRICTED')
      res.status(isForbidden ? 403 : 400).json({
        status: 'error',
        error: { code: isForbidden ? 'PLATFORM_ADMIN_RESTRICTED' : 'FETCH_FAILED', message: error.message },
      })
    }
  }

  static async getAttachmentById(req: Request, res: Response): Promise<void> {
    try {
      const { patientId, attachmentId } = req.params
      const tenantId = (req as unknown as Record<string, string>).tenantId || 'tenant-default'
      const userRole = (req as unknown as Record<string, Record<string, string>>).user?.role

      const attachment = await patientAttachmentService.getAttachmentById(tenantId, patientId, attachmentId, userRole)
      res.status(200).json({ status: 'success', data: attachment })
    } catch (err: unknown) {
      const error = err as { message?: string }
      res.status(404).json({ status: 'error', error: { code: 'ATTACHMENT_NOT_FOUND', message: error.message } })
    }
  }

  static async downloadAttachmentStream(req: Request, res: Response): Promise<void> {
    try {
      const { patientId, attachmentId } = req.params
      const tenantId = (req as unknown as Record<string, string>).tenantId || 'tenant-default'
      const userRole = (req as unknown as Record<string, Record<string, string>>).user?.role

      const { stream, attachment } = await patientAttachmentService.getFileStream(tenantId, patientId, attachmentId, userRole)
      res.setHeader('Content-Type', attachment.mimeType)
      res.setHeader('Content-Disposition', `attachment; filename="${attachment.originalFileName}"`)
      stream.pipe(res)
    } catch (err: unknown) {
      const error = err as { message?: string }
      res.status(404).json({ status: 'error', error: { code: 'DOWNLOAD_FAILED', message: error.message } })
    }
  }

  static async previewAttachmentStream(req: Request, res: Response): Promise<void> {
    try {
      const { patientId, attachmentId } = req.params
      const tenantId = (req as unknown as Record<string, string>).tenantId || 'tenant-default'
      const userRole = (req as unknown as Record<string, Record<string, string>>).user?.role

      const { stream, attachment } = await patientAttachmentService.getFileStream(tenantId, patientId, attachmentId, userRole)
      res.setHeader('Content-Type', attachment.mimeType)
      res.setHeader('Content-Disposition', `inline; filename="${attachment.originalFileName}"`)
      stream.pipe(res)
    } catch (err: unknown) {
      const error = err as { message?: string }
      res.status(404).json({ status: 'error', error: { code: 'PREVIEW_FAILED', message: error.message } })
    }
  }

  static async replaceAttachmentVersion(req: Request, res: Response): Promise<void> {
    try {
      const customReq = req as ICustomRequest
      const { patientId, attachmentId } = req.params
      const tenantId = (req as unknown as Record<string, string>).tenantId || 'tenant-default'
      const clinicId = (req as unknown as Record<string, string>).clinicId || 'clinic-default'
      const user = (req as unknown as Record<string, Record<string, string>>).user || {
        userId: 'usr_doc_01',
        userName: 'Dr. Ahmed Al-Mansoor',
        role: 'DOCTOR',
      }

      let fileData = customReq.file
      if (!fileData && req.body.fileBase64) {
        const buf = Buffer.from(req.body.fileBase64, 'base64')
        fileData = {
          originalname: req.body.fileName || 'replacement.pdf',
          buffer: buf,
          size: buf.length,
          mimetype: req.body.mimeType || 'application/pdf',
        }
      }

      if (!fileData) {
        res.status(400).json({ status: 'error', error: { code: 'FILE_MISSING', message: 'Replacement file required.' } })
        return
      }

      const updated = await patientAttachmentService.replaceAttachmentVersion({
        patientId,
        attachmentId,
        tenantId,
        clinicId,
        file: fileData,
        changeReason: req.body.changeReason,
        uploader: {
          userId: user.userId || 'usr_doc_01',
          userName: user.userName || 'Dr. Ahmed Al-Mansoor',
          userRole: user.role || 'DOCTOR',
        },
      })

      res.status(200).json({ status: 'success', data: updated })
    } catch (err: unknown) {
      const error = err as { message?: string }
      res.status(400).json({ status: 'error', error: { code: 'REPLACE_FAILED', message: error.message } })
    }
  }

  static async updateMetadata(req: Request, res: Response): Promise<void> {
    try {
      const { patientId, attachmentId } = req.params
      const tenantId = (req as unknown as Record<string, string>).tenantId || 'tenant-default'
      const userRole = (req as unknown as Record<string, Record<string, string>>).user?.role

      const updated = await patientAttachmentService.updateMetadata(tenantId, patientId, attachmentId, req.body, userRole)
      res.status(200).json({ status: 'success', data: updated })
    } catch (err: unknown) {
      const error = err as { message?: string }
      res.status(400).json({ status: 'error', error: { code: 'UPDATE_FAILED', message: error.message } })
    }
  }

  static async softDeleteAttachment(req: Request, res: Response): Promise<void> {
    try {
      const { patientId, attachmentId } = req.params
      const tenantId = (req as unknown as Record<string, string>).tenantId || 'tenant-default'
      const user = (req as unknown as Record<string, Record<string, string>>).user || {
        userId: 'usr_doc_01',
        userName: 'Dr. Ahmed Al-Mansoor',
        role: 'DOCTOR',
      }

      const deleted = await patientAttachmentService.softDeleteAttachment(tenantId, patientId, attachmentId, {
        userId: user.userId || 'usr_doc_01',
        userName: user.userName || 'Dr. Ahmed Al-Mansoor',
        userRole: user.role || 'DOCTOR',
      })
      res.status(200).json({ status: 'success', data: deleted })
    } catch (err: unknown) {
      const error = err as { message?: string }
      res.status(400).json({ status: 'error', error: { code: 'DELETE_FAILED', message: error.message } })
    }
  }

  static async restoreAttachment(req: Request, res: Response): Promise<void> {
    try {
      const { patientId, attachmentId } = req.params
      const tenantId = (req as unknown as Record<string, string>).tenantId || 'tenant-default'
      const userRole = (req as unknown as Record<string, Record<string, string>>).user?.role

      const restored = await patientAttachmentService.restoreAttachment(tenantId, patientId, attachmentId, userRole)
      res.status(200).json({ status: 'success', data: restored })
    } catch (err: unknown) {
      const error = err as { message?: string }
      res.status(400).json({ status: 'error', error: { code: 'RESTORE_FAILED', message: error.message } })
    }
  }

  static async getVersionHistory(req: Request, res: Response): Promise<void> {
    try {
      const { patientId, attachmentId } = req.params
      const tenantId = (req as unknown as Record<string, string>).tenantId || 'tenant-default'
      const userRole = (req as unknown as Record<string, Record<string, string>>).user?.role

      const history = await patientAttachmentService.getVersionHistory(tenantId, patientId, attachmentId, userRole)
      res.status(200).json({ status: 'success', data: history })
    } catch (err: unknown) {
      const error = err as { message?: string }
      res.status(404).json({ status: 'error', error: { code: 'VERSIONS_FETCH_FAILED', message: error.message } })
    }
  }

  static async downloadVersionStream(req: Request, res: Response): Promise<void> {
    try {
      const { patientId, attachmentId, versionId } = req.params
      const tenantId = (req as unknown as Record<string, string>).tenantId || 'tenant-default'
      const userRole = (req as unknown as Record<string, Record<string, string>>).user?.role

      const { stream, version } = await patientAttachmentService.getVersionFileStream(tenantId, patientId, attachmentId, versionId, userRole)
      res.setHeader('Content-Type', version.mimeType)
      res.setHeader('Content-Disposition', `attachment; filename="v${version.versionNumber}_attachment"`)
      stream.pipe(res)
    } catch (err: unknown) {
      const error = err as { message?: string }
      res.status(404).json({ status: 'error', error: { code: 'VERSION_DOWNLOAD_FAILED', message: error.message } })
    }
  }

  static async listCategories(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = (req as unknown as Record<string, string>).tenantId || 'tenant-default'
      const categories = await patientAttachmentService.getCategories(tenantId)
      res.status(200).json({ status: 'success', data: categories })
    } catch (err: unknown) {
      const error = err as { message?: string }
      res.status(400).json({ status: 'error', error: { code: 'CATEGORIES_FETCH_FAILED', message: error.message } })
    }
  }

  static async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = (req as unknown as Record<string, string>).tenantId || 'tenant-default'
      const clinicId = (req as unknown as Record<string, string>).clinicId || 'clinic-default'
      const { name, color, icon } = req.body

      const category = await patientAttachmentService.createCategory(tenantId, clinicId, name, color, icon)
      res.status(201).json({ status: 'success', data: category })
    } catch (err: unknown) {
      const error = err as { message?: string }
      res.status(400).json({ status: 'error', error: { code: 'CATEGORY_CREATE_FAILED', message: error.message } })
    }
  }

  static async listTags(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = (req as unknown as Record<string, string>).tenantId || 'tenant-default'
      const tags = await patientAttachmentService.getTags(tenantId)
      res.status(200).json({ status: 'success', data: tags })
    } catch (err: unknown) {
      const error = err as { message?: string }
      res.status(400).json({ status: 'error', error: { code: 'TAGS_FETCH_FAILED', message: error.message } })
    }
  }

  static async createTag(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = (req as unknown as Record<string, string>).tenantId || 'tenant-default'
      const clinicId = (req as unknown as Record<string, string>).clinicId || 'clinic-default'
      const { name, color } = req.body

      const tag = await patientAttachmentService.createTag(tenantId, clinicId, name, color)
      res.status(201).json({ status: 'success', data: tag })
    } catch (err: unknown) {
      const error = err as { message?: string }
      res.status(400).json({ status: 'error', error: { code: 'TAG_CREATE_FAILED', message: error.message } })
    }
  }

  static async getAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = (req as unknown as Record<string, string>).tenantId || 'tenant-default'
      const analytics = await patientAttachmentService.getAnalytics(tenantId)
      res.status(200).json({ status: 'success', data: analytics })
    } catch (err: unknown) {
      const error = err as { message?: string }
      res.status(400).json({ status: 'error', error: { code: 'ANALYTICS_FAILED', message: error.message } })
    }
  }
}
