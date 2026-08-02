// Patient Files & Attachments Data Models & DTO Interfaces — Module-016

export type StorageProvider = 'LOCAL' | 'S3' | 'NAS' | 'AZURE' | 'GCP'
export type AttachmentStatus = 'ACTIVE' | 'SOFT_DELETED' | 'ARCHIVED'

export interface IPatientAttachment {
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
  storageProvider: StorageProvider
  storagePath: string
  storageBucket?: string
  checksum: string
  categoryId: string
  categoryName: string
  categoryColor: string
  description?: string
  tags: string[]
  notes?: string
  isFavorite: boolean
  version: number
  parentAttachmentId?: string
  isLatestVersion: boolean
  status: AttachmentStatus
  uploadedBy: {
    userId: string
    userName: string
    userRole: string
  }
  uploadedAt: string
  deletedAt?: string
  deletedBy?: {
    userId: string
    userName: string
    userRole: string
  }
  previewAvailable: boolean
  previewGeneratedAt?: string
  createdAt: string
  updatedAt: string
}

export interface IAttachmentVersion {
  id: string
  versionId: string
  attachmentId: string
  versionNumber: number
  storageProvider: StorageProvider
  storagePath: string
  fileSize: number
  checksum: string
  mimeType: string
  uploadedBy: {
    userId: string
    userName: string
    userRole: string
  }
  uploadedAt: string
  changeReason?: string
  createdAt: string
}

export interface IAttachmentCategory {
  id: string
  categoryId: string
  tenantId: string
  clinicId: string
  name: string
  color: string
  icon: string
  displayOrder: number
  active: boolean
  fileCount?: number
  createdAt: string
  updatedAt: string
}

export interface IAttachmentTag {
  id: string
  tagId: string
  name: string
  color: string
  fileCount?: number
}

export interface IAttachmentAnalytics {
  totalFiles: number
  totalStorageBytes: number
  storageLimitBytes: number
  storageUsagePercentage: number
  categoryCounts: Record<string, number>
  largestFiles: IPatientAttachment[]
  recentUploads: IPatientAttachment[]
  recentActivity: Array<{
    id: string
    action: 'UPLOADED' | 'DOWNLOADED' | 'PREVIEWED' | 'RENAMED' | 'REPLACED' | 'RESTORED' | 'DELETED'
    fileName: string
    performedBy: string
    timestamp: string
  }>
}

export interface IUploadAttachmentDto {
  patientId: string
  file: File
  categoryId: string
  description?: string
  tags?: string[]
  notes?: string
}

export interface IUpdateAttachmentDto {
  originalFileName?: string
  description?: string
  categoryId?: string
  tags?: string[]
  notes?: string
  isFavorite?: boolean
}

export interface IAttachmentFilterOptions {
  search?: string
  categoryId?: string
  tag?: string
  status?: AttachmentStatus
  favoritesOnly?: boolean
  sortBy?: 'createdAt' | 'fileName' | 'fileSize' | 'category'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}
