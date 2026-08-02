// Patient Files & Attachments Business Logic Service Engine — Module-016

import fs from 'fs'
import { patientAttachmentRepository } from './patientAttachment.repository'
import { storageDriverFactory } from './patientAttachment.storage'
import { PatientAttachmentValidator } from './patientAttachment.validator'
import type {
  IPatientAttachmentEntity,
  IAttachmentVersionEntity,
  IAttachmentCategoryEntity,
  IAttachmentTagEntity,
  IUploadAttachmentPayload,
  IReplaceVersionPayload,
  IUpdateAttachmentMetadataPayload,
  IAttachmentQueryFilter,
  IAttachmentUploader,
} from './patientAttachment.types'

export class PatientAttachmentService {
  /**
   * Platform Owner Barrier Check
   */
  private checkPlatformOwnerBarrier(userRole?: string): void {
    if (userRole === 'SUPER_ADMIN' || userRole === 'PLATFORM') {
      throw new Error(
        'PLATFORM_ADMIN_ATTACHMENTS_RESTRICTED: Platform owner and super admin accounts are strictly prohibited from viewing or downloading patient medical attachments.'
      )
    }
  }

  /**
   * Malware Scan Integration Hook (Prepares extension point without external engine)
   */
  private async runMalwareScanHook(_buffer: Buffer, _fileName: string): Promise<boolean> {
    // Verified clean by default. Extension point for ClamAV / VirusTotal scanner APIs.
    return true
  }

  async getPatientAttachments(
    tenantId: string,
    patientId: string,
    query: Record<string, unknown>,
    userRole?: string
  ): Promise<{ items: IPatientAttachmentEntity[]; total: number }> {
    this.checkPlatformOwnerBarrier(userRole)
    const filter: IAttachmentQueryFilter = PatientAttachmentValidator.validateQueryFilter(query)
    return patientAttachmentRepository.findPatientAttachments(tenantId, patientId, filter)
  }

  async getAttachmentById(
    tenantId: string,
    patientId: string,
    attachmentId: string,
    userRole?: string
  ): Promise<IPatientAttachmentEntity> {
    this.checkPlatformOwnerBarrier(userRole)
    const found = await patientAttachmentRepository.findById(tenantId, patientId, attachmentId)
    if (!found) {
      throw new Error(`ATTACHMENT_NOT_FOUND: Attachment with ID ${attachmentId} not found.`)
    }
    return found
  }

  async uploadAttachment(payload: IUploadAttachmentPayload): Promise<IPatientAttachmentEntity> {
    this.checkPlatformOwnerBarrier(payload.uploader.userRole)
    PatientAttachmentValidator.validateUploadPayload(payload)

    await this.runMalwareScanHook(payload.file.buffer, payload.file.originalname)

    const categories = await patientAttachmentRepository.findCategories(payload.tenantId)
    const category = categories.find((c) => c.id === payload.categoryId) || categories[0]

    const storageDriver = storageDriverFactory.getDriver('LOCAL')
    const { storagePath, checksum } = await storageDriver.saveFile(
      payload.tenantId,
      payload.patientId,
      payload.file.originalname,
      payload.file.buffer
    )

    const ext = payload.file.originalname.substring(payload.file.originalname.lastIndexOf('.')).toLowerCase() || '.bin'
    const newId = `att_${Date.now()}`
    const attachmentId = `att_202608_${Math.floor(10000 + Math.random() * 90000)}`

    const newAttachment: IPatientAttachmentEntity = {
      id: newId,
      attachmentId,
      patientId: payload.patientId,
      tenantId: payload.tenantId,
      clinicId: payload.clinicId,
      fileName: payload.file.originalname.replace(/[^a-zA-Z0-9.]/g, '_'),
      originalFileName: payload.file.originalname,
      fileExtension: ext,
      mimeType: payload.file.mimetype,
      fileSize: payload.file.size,
      storageProvider: 'LOCAL',
      storagePath,
      checksum,
      categoryId: category.id,
      categoryName: category.name,
      categoryColor: category.color,
      description: payload.description || '',
      tags: payload.tags || [],
      notes: payload.notes || '',
      isFavorite: false,
      version: 1,
      isLatestVersion: true,
      status: 'ACTIVE',
      uploadedBy: payload.uploader,
      uploadedAt: new Date().toISOString(),
      previewAvailable: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const initialVersion: IAttachmentVersionEntity = {
      id: `ver_${Date.now()}_v1`,
      versionId: `ver_202608_001`,
      attachmentId: newId,
      versionNumber: 1,
      storageProvider: 'LOCAL',
      storagePath,
      fileSize: payload.file.size,
      checksum,
      mimeType: payload.file.mimetype,
      uploadedBy: payload.uploader,
      uploadedAt: newAttachment.uploadedAt,
      changeReason: 'Initial file upload.',
      createdAt: newAttachment.createdAt,
    }

    return patientAttachmentRepository.create(newAttachment, initialVersion)
  }

  async replaceAttachmentVersion(payload: IReplaceVersionPayload): Promise<IPatientAttachmentEntity> {
    this.checkPlatformOwnerBarrier(payload.uploader.userRole)
    PatientAttachmentValidator.validateReplacePayload(payload)

    const existing = await this.getAttachmentById(payload.tenantId, payload.patientId, payload.attachmentId, payload.uploader.userRole)
    await this.runMalwareScanHook(payload.file.buffer, payload.file.originalname)

    const nextVersionNumber = existing.version + 1
    const storageDriver = storageDriverFactory.getDriver('LOCAL')
    const { storagePath, checksum } = await storageDriver.saveFile(
      payload.tenantId,
      payload.patientId,
      `v${nextVersionNumber}_${payload.file.originalname}`,
      payload.file.buffer
    )

    existing.version = nextVersionNumber
    existing.fileSize = payload.file.size
    existing.originalFileName = payload.file.originalname
    existing.storagePath = storagePath
    existing.checksum = checksum
    existing.updatedAt = new Date().toISOString()

    const versionEntity: IAttachmentVersionEntity = {
      id: `ver_${Date.now()}_v${nextVersionNumber}`,
      versionId: `ver_202608_00${nextVersionNumber}`,
      attachmentId: existing.id,
      versionNumber: nextVersionNumber,
      storageProvider: 'LOCAL',
      storagePath,
      fileSize: payload.file.size,
      checksum,
      mimeType: payload.file.mimetype,
      uploadedBy: payload.uploader,
      uploadedAt: new Date().toISOString(),
      changeReason: payload.changeReason || `Uploaded new version ${nextVersionNumber}`,
      createdAt: new Date().toISOString(),
    }

    await patientAttachmentRepository.addVersion(existing.id, versionEntity)
    await patientAttachmentRepository.update(existing)
    patientAttachmentRepository.logActivity('REPLACED', existing.id, existing.originalFileName, payload.uploader.userName)

    return existing
  }

  async getFileStream(
    tenantId: string,
    patientId: string,
    attachmentId: string,
    userRole?: string
  ): Promise<{ stream: fs.ReadStream; attachment: IPatientAttachmentEntity }> {
    const attachment = await this.getAttachmentById(tenantId, patientId, attachmentId, userRole)
    const storageDriver = storageDriverFactory.getDriver(attachment.storageProvider)
    const stream = storageDriver.readFileStream(attachment.storagePath)

    patientAttachmentRepository.logActivity('DOWNLOADED', attachment.id, attachment.originalFileName, 'Authenticated Staff')
    return { stream, attachment }
  }

  async getVersionFileStream(
    tenantId: string,
    patientId: string,
    attachmentId: string,
    versionId: string,
    userRole?: string
  ): Promise<{ stream: fs.ReadStream; version: IAttachmentVersionEntity }> {
    this.checkPlatformOwnerBarrier(userRole)
    await this.getAttachmentById(tenantId, patientId, attachmentId, userRole)
    const version = await patientAttachmentRepository.getVersionById(attachmentId, versionId)
    if (!version) {
      throw new Error(`ATTACHMENT_VERSION_NOT_FOUND: Version ${versionId} not found for attachment ${attachmentId}.`)
    }
    const storageDriver = storageDriverFactory.getDriver(version.storageProvider)
    const stream = storageDriver.readFileStream(version.storagePath)
    return { stream, version }
  }

  async updateMetadata(
    tenantId: string,
    patientId: string,
    attachmentId: string,
    dto: IUpdateAttachmentMetadataPayload,
    userRole?: string
  ): Promise<IPatientAttachmentEntity> {
    const existing = await this.getAttachmentById(tenantId, patientId, attachmentId, userRole)
    PatientAttachmentValidator.validateMetadataUpdatePayload(dto)

    if (dto.originalFileName !== undefined) existing.originalFileName = dto.originalFileName.trim()
    if (dto.description !== undefined) existing.description = dto.description.trim()
    if (dto.tags !== undefined) existing.tags = dto.tags
    if (dto.notes !== undefined) existing.notes = dto.notes.trim()
    if (dto.isFavorite !== undefined) existing.isFavorite = dto.isFavorite
    if (dto.categoryId !== undefined) {
      const cat = await patientAttachmentRepository.findCategoryById(dto.categoryId)
      if (cat) {
        existing.categoryId = cat.id
        existing.categoryName = cat.name
        existing.categoryColor = cat.color
      }
    }
    existing.updatedAt = new Date().toISOString()
    await patientAttachmentRepository.update(existing)
    patientAttachmentRepository.logActivity('METADATA_UPDATED', existing.id, existing.originalFileName, 'Authenticated Staff')
    return existing
  }

  async softDeleteAttachment(
    tenantId: string,
    patientId: string,
    attachmentId: string,
    user: IAttachmentUploader
  ): Promise<IPatientAttachmentEntity> {
    const existing = await this.getAttachmentById(tenantId, patientId, attachmentId, user.userRole)
    existing.status = 'SOFT_DELETED'
    existing.deletedAt = new Date().toISOString()
    existing.deletedBy = user
    existing.updatedAt = new Date().toISOString()
    await patientAttachmentRepository.update(existing)
    patientAttachmentRepository.logActivity('SOFT_DELETED', existing.id, existing.originalFileName, user.userName)
    return existing
  }

  async restoreAttachment(
    tenantId: string,
    patientId: string,
    attachmentId: string,
    userRole?: string
  ): Promise<IPatientAttachmentEntity> {
    this.checkPlatformOwnerBarrier(userRole)
    const existing = await patientAttachmentRepository.findById(tenantId, patientId, attachmentId)
    if (!existing) throw new Error(`ATTACHMENT_NOT_FOUND: Attachment ${attachmentId} not found.`)
    existing.status = 'ACTIVE'
    existing.deletedAt = undefined
    existing.deletedBy = undefined
    existing.updatedAt = new Date().toISOString()
    await patientAttachmentRepository.update(existing)
    patientAttachmentRepository.logActivity('RESTORED', existing.id, existing.originalFileName, 'Authenticated Staff')
    return existing
  }

  async getVersionHistory(
    tenantId: string,
    patientId: string,
    attachmentId: string,
    userRole?: string
  ): Promise<IAttachmentVersionEntity[]> {
    await this.getAttachmentById(tenantId, patientId, attachmentId, userRole)
    return patientAttachmentRepository.getVersionHistory(attachmentId)
  }

  async getCategories(tenantId: string): Promise<IAttachmentCategoryEntity[]> {
    return patientAttachmentRepository.findCategories(tenantId)
  }

  async createCategory(tenantId: string, clinicId: string, name: string, color: string, icon?: string): Promise<IAttachmentCategoryEntity> {
    const newCat: IAttachmentCategoryEntity = {
      id: `cat_${Date.now()}`,
      categoryId: `cat_${Date.now()}`,
      tenantId,
      clinicId,
      name,
      color: color || '#3B82F6',
      icon: icon || 'Folder',
      displayOrder: (await patientAttachmentRepository.findCategories(tenantId)).length + 1,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return patientAttachmentRepository.createCategory(newCat)
  }

  async getTags(tenantId: string): Promise<IAttachmentTagEntity[]> {
    return patientAttachmentRepository.findTags(tenantId)
  }

  async createTag(tenantId: string, clinicId: string, name: string, color: string): Promise<IAttachmentTagEntity> {
    const newTag: IAttachmentTagEntity = {
      id: `tag_${Date.now()}`,
      tagId: `tag_${Date.now()}`,
      tenantId,
      clinicId,
      name: name.replace(/^#/, '').trim(),
      color: color || '#0284C7',
      createdAt: new Date().toISOString(),
    }
    return patientAttachmentRepository.createTag(newTag)
  }

  async getAnalytics(tenantId: string) {
    return patientAttachmentRepository.getAnalytics(tenantId)
  }
}

export const patientAttachmentService = new PatientAttachmentService()
