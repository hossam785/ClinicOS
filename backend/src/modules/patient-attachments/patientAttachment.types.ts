// Patient Files & Attachments Domain Types & Interfaces — Module-016

export type StorageProviderType = 'LOCAL' | 'NAS' | 'S3' | 'AZURE' | 'GCS'
export type AttachmentStatusType = 'ACTIVE' | 'SOFT_DELETED' | 'ARCHIVED'

export interface IAttachmentUploader {
  userId: string
  userName: string
  userRole: string
}

export interface IPatientAttachmentEntity {
  id: string
  attachmentId: string
  patientId: string
  tenantId: string
  clinicId: string
  fileName: string
  originalFileName: string
  fileExtension: string
  mimeType: string
  fileSize: number
  storageProvider: StorageProviderType
  storagePath: string
  checksum: string
  categoryId: string
  categoryName: string
  categoryColor: string
  description?: string
  tags: string[]
  notes?: string
  isFavorite: boolean
  version: number
  isLatestVersion: boolean
  parentAttachmentId?: string
  status: AttachmentStatusType
  uploadedBy: IAttachmentUploader
  uploadedAt: string
  deletedAt?: string
  deletedBy?: IAttachmentUploader
  previewAvailable: boolean
  createdAt: string
  updatedAt: string
}

export interface IAttachmentVersionEntity {
  id: string
  versionId: string
  attachmentId: string
  versionNumber: number
  storageProvider: StorageProviderType
  storagePath: string
  fileSize: number
  checksum: string
  mimeType: string
  uploadedBy: IAttachmentUploader
  uploadedAt: string
  changeReason?: string
  createdAt: string
}

export interface IAttachmentCategoryEntity {
  id: string
  categoryId: string
  tenantId: string
  clinicId: string
  name: string
  color: string
  icon: string
  displayOrder: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface IAttachmentTagEntity {
  id: string
  tagId: string
  tenantId: string
  clinicId: string
  name: string
  color: string
  createdAt?: string
}

export interface IAttachmentActivityLog {
  id: string
  action: 'UPLOADED' | 'DOWNLOADED' | 'PREVIEWED' | 'REPLACED' | 'METADATA_UPDATED' | 'SOFT_DELETED' | 'RESTORED'
  attachmentId: string
  fileName: string
  performedBy: string
  timestamp: string
}

export interface IAttachmentAnalyticsSummary {
  totalFiles: number
  totalStorageBytes: number
  storageLimitBytes: number
  storageUsagePercentage: number
  categoryCounts: Record<string, number>
  largestFiles: IPatientAttachmentEntity[]
  recentUploads: IPatientAttachmentEntity[]
  recentActivity: IAttachmentActivityLog[]
}

export interface IUploadAttachmentPayload {
  patientId: string
  tenantId: string
  clinicId: string
  file: {
    originalname: string
    buffer: Buffer
    size: number
    mimetype: string
  }
  categoryId: string
  description?: string
  tags?: string[]
  notes?: string
  uploader: IAttachmentUploader
}

export interface IReplaceVersionPayload {
  patientId: string
  attachmentId: string
  tenantId: string
  clinicId: string
  file: {
    originalname: string
    buffer: Buffer
    size: number
    mimetype: string
  }
  changeReason?: string
  uploader: IAttachmentUploader
}

export interface IUpdateAttachmentMetadataPayload {
  originalFileName?: string
  categoryId?: string
  description?: string
  tags?: string[]
  notes?: string
  isFavorite?: boolean
}

export interface IAttachmentQueryFilter {
  page?: number
  limit?: number
  search?: string
  categoryId?: string
  tag?: string
  favoritesOnly?: boolean
  status?: AttachmentStatusType
  sortBy?: 'createdAt' | 'fileName' | 'fileSize'
  sortOrder?: 'asc' | 'desc'
}
