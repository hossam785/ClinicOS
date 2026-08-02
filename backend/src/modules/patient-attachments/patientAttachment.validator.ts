// Patient Files & Attachments Payload Validation Engine — Module-016

import type {
  IUploadAttachmentPayload,
  IReplaceVersionPayload,
  IUpdateAttachmentMetadataPayload,
  IAttachmentQueryFilter,
} from './patientAttachment.types'

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
]

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024 // 50 MB

export class PatientAttachmentValidator {
  static validateUploadPayload(payload: Partial<IUploadAttachmentPayload>): void {
    if (!payload.patientId) {
      throw new Error('VALIDATION_ERROR: patientId is required.')
    }
    if (!payload.file) {
      throw new Error('VALIDATION_ERROR: File payload is missing or empty.')
    }
    if (!ALLOWED_MIME_TYPES.includes(payload.file.mimetype)) {
      throw new Error(`FILE_TYPE_INVALID: Mime type "${payload.file.mimetype}" is not supported.`)
    }
    if (payload.file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error(`STORAGE_QUOTA_EXCEEDED: File size exceeds the maximum allowed limit of 50 MB.`)
    }
    if (!payload.categoryId) {
      throw new Error('VALIDATION_ERROR: categoryId is required.')
    }
  }

  static validateReplacePayload(payload: Partial<IReplaceVersionPayload>): void {
    if (!payload.attachmentId) {
      throw new Error('VALIDATION_ERROR: attachmentId is required.')
    }
    if (!payload.file) {
      throw new Error('VALIDATION_ERROR: Replacement binary file is required.')
    }
    if (!ALLOWED_MIME_TYPES.includes(payload.file.mimetype)) {
      throw new Error(`FILE_TYPE_INVALID: Mime type "${payload.file.mimetype}" is not supported.`)
    }
    if (payload.file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error(`STORAGE_QUOTA_EXCEEDED: Replacement file size exceeds 50 MB limit.`)
    }
  }

  static validateMetadataUpdatePayload(payload: IUpdateAttachmentMetadataPayload): void {
    if (payload.originalFileName !== undefined && payload.originalFileName.trim().length === 0) {
      throw new Error('VALIDATION_ERROR: originalFileName cannot be empty string.')
    }
  }

  static validateQueryFilter(query: Record<string, unknown>): IAttachmentQueryFilter {
    const page = typeof query.page === 'string' ? parseInt(query.page, 10) : 1
    const limit = typeof query.limit === 'string' ? parseInt(query.limit, 10) : 20
    const search = typeof query.search === 'string' ? query.search.trim() : undefined
    const categoryId = typeof query.categoryId === 'string' ? query.categoryId : undefined
    const tag = typeof query.tag === 'string' ? query.tag : undefined
    const favoritesOnly = query.favoritesOnly === 'true' || query.favoritesOnly === true
    const status = query.status === 'SOFT_DELETED' ? 'SOFT_DELETED' : 'ACTIVE'
    const sortBy = ['createdAt', 'fileName', 'fileSize'].includes(query.sortBy as string)
      ? (query.sortBy as 'createdAt' | 'fileName' | 'fileSize')
      : 'createdAt'
    const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc'

    return {
      page: Math.max(1, page),
      limit: Math.min(100, Math.max(1, limit)),
      search,
      categoryId,
      tag,
      favoritesOnly,
      status,
      sortBy,
      sortOrder,
    }
  }
}
