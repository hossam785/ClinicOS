// Patient Files & Attachments REST API Client Abstraction — Module-016

import type {
  IPatientAttachment,
  IAttachmentVersion,
  IAttachmentCategory,
  IAttachmentTag,
  IAttachmentAnalytics,
  IUploadAttachmentDto,
  IUpdateAttachmentDto,
  IAttachmentFilterOptions,
} from '../types/attachment.types'

const DEFAULT_CATEGORIES: IAttachmentCategory[] = [
  { id: 'cat_01', categoryId: 'cat_01', tenantId: 'tenant-default', clinicId: 'clinic-default', name: 'Identification', color: '#3B82F6', icon: 'ShieldCheck', displayOrder: 1, active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat_02', categoryId: 'cat_02', tenantId: 'tenant-default', clinicId: 'clinic-default', name: 'Prescription', color: '#10B981', icon: 'Pill', displayOrder: 2, active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat_03', categoryId: 'cat_03', tenantId: 'tenant-default', clinicId: 'clinic-default', name: 'Laboratory Result', color: '#8B5CF6', icon: 'FlaskConical', displayOrder: 3, active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat_04', categoryId: 'cat_04', tenantId: 'tenant-default', clinicId: 'clinic-default', name: 'Radiology Report', color: '#F59E0B', icon: 'Activity', displayOrder: 4, active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat_05', categoryId: 'cat_05', tenantId: 'tenant-default', clinicId: 'clinic-default', name: 'Medical Report', color: '#06B6D4', icon: 'FileText', displayOrder: 5, active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat_06', categoryId: 'cat_06', tenantId: 'tenant-default', clinicId: 'clinic-default', name: 'Referral Letter', color: '#EC4899', icon: 'Send', displayOrder: 6, active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat_07', categoryId: 'cat_07', tenantId: 'tenant-default', clinicId: 'clinic-default', name: 'Insurance', color: '#6366F1', icon: 'Shield', displayOrder: 7, active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat_08', categoryId: 'cat_08', tenantId: 'tenant-default', clinicId: 'clinic-default', name: 'Consent Form', color: '#14B8A6', icon: 'FileCheck', displayOrder: 8, active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat_09', categoryId: 'cat_09', tenantId: 'tenant-default', clinicId: 'clinic-default', name: 'Invoice', color: '#F43F5E', icon: 'Receipt', displayOrder: 9, active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat_10', categoryId: 'cat_10', tenantId: 'tenant-default', clinicId: 'clinic-default', name: 'Other', color: '#64748B', icon: 'Folder', displayOrder: 10, active: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
]

const DEFAULT_TAGS: IAttachmentTag[] = [
  { id: 'tag_01', tagId: 'tag_01', name: 'Urgent', color: '#EF4444' },
  { id: 'tag_02', tagId: 'tag_02', name: 'Cardiology', color: '#0284C7' },
  { id: 'tag_03', tagId: 'tag_03', name: 'Bloodwork_2026', color: '#8B5CF6' },
  { id: 'tag_04', tagId: 'tag_04', name: 'PreOp', color: '#F59E0B' },
]

const SEEDED_ATTACHMENTS: IPatientAttachment[] = [
  {
    id: 'att_101',
    attachmentId: 'att_202608_00101',
    patientId: 'pat-101',
    tenantId: 'tenant-default',
    clinicId: 'clinic-default',
    fileName: 'full_blood_count_report_2026.pdf',
    originalFileName: 'Full Blood Count (FBC) Lab Sheet.pdf',
    fileExtension: '.pdf',
    mimeType: 'application/pdf',
    fileSize: 2450124,
    storageProvider: 'LOCAL',
    storagePath: '/storage/attachments/pat-101/fbc_lab_sheet.pdf',
    checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    categoryId: 'cat_03',
    categoryName: 'Laboratory Result',
    categoryColor: '#8B5CF6',
    description: 'Complete blood count analysis with hemoglobin and platelet metrics.',
    tags: ['Bloodwork_2026', 'Urgent'],
    notes: 'Platelet count slightly elevated. Review in 2 weeks.',
    isFavorite: true,
    version: 2,
    isLatestVersion: true,
    status: 'ACTIVE',
    uploadedBy: { userId: 'usr_doc_01', userName: 'Dr. Ahmed Al-Mansoor', userRole: 'Doctor' },
    uploadedAt: '2026-08-01T10:30:00Z',
    previewAvailable: true,
    createdAt: '2026-07-28T09:00:00Z',
    updatedAt: '2026-08-01T10:30:00Z',
  },
  {
    id: 'att_102',
    attachmentId: 'att_202608_00102',
    patientId: 'pat-101',
    tenantId: 'tenant-default',
    clinicId: 'clinic-default',
    fileName: 'chest_xray_pa_view.png',
    originalFileName: 'Chest X-Ray PA View.png',
    fileExtension: '.png',
    mimeType: 'image/png',
    fileSize: 5820400,
    storageProvider: 'LOCAL',
    storagePath: '/storage/attachments/pat-101/chest_xray_pa.png',
    checksum: '8a123f4598fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b899',
    categoryId: 'cat_04',
    categoryName: 'Radiology Report',
    categoryColor: '#F59E0B',
    description: 'Posteroanterior chest radiograph. Clear lung fields, normal cardiothoracic ratio.',
    tags: ['Cardiology', 'PreOp'],
    isFavorite: false,
    version: 1,
    isLatestVersion: true,
    status: 'ACTIVE',
    uploadedBy: { userId: 'usr_rad_01', userName: 'Sarah Jenkins', userRole: 'Nurse' },
    uploadedAt: '2026-07-30T14:15:00Z',
    previewAvailable: true,
    createdAt: '2026-07-30T14:15:00Z',
    updatedAt: '2026-07-30T14:15:00Z',
  },
  {
    id: 'att_103',
    attachmentId: 'att_202608_00103',
    patientId: 'pat-101',
    tenantId: 'tenant-default',
    clinicId: 'clinic-default',
    fileName: 'national_id_card_scan.jpg',
    originalFileName: 'National ID Card Scan.jpg',
    fileExtension: '.jpg',
    mimeType: 'image/jpeg',
    fileSize: 1120300,
    storageProvider: 'LOCAL',
    storagePath: '/storage/attachments/pat-101/national_id_scan.jpg',
    checksum: '7c99214298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b811',
    categoryId: 'cat_01',
    categoryName: 'Identification',
    categoryColor: '#3B82F6',
    description: 'Scanned front and back copy of national identity card.',
    tags: [],
    isFavorite: false,
    version: 1,
    isLatestVersion: true,
    status: 'ACTIVE',
    uploadedBy: { userId: 'usr_rec_01', userName: 'Mona Hassan', userRole: 'Receptionist' },
    uploadedAt: '2026-07-25T08:45:00Z',
    previewAvailable: true,
    createdAt: '2026-07-25T08:45:00Z',
    updatedAt: '2026-07-25T08:45:00Z',
  },
]

const SEEDED_VERSIONS: Record<string, IAttachmentVersion[]> = {
  att_101: [
    {
      id: 'ver_101_v2',
      versionId: 'ver_202608_002',
      attachmentId: 'att_101',
      versionNumber: 2,
      storageProvider: 'LOCAL',
      storagePath: '/storage/attachments/pat-101/fbc_lab_sheet_v2.pdf',
      fileSize: 2450124,
      checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      mimeType: 'application/pdf',
      uploadedBy: { userId: 'usr_doc_01', userName: 'Dr. Ahmed Al-Mansoor', userRole: 'Doctor' },
      uploadedAt: '2026-08-01T10:30:00Z',
      changeReason: 'Updated with corrected lab technician remarks and signature.',
      createdAt: '2026-08-01T10:30:00Z',
    },
    {
      id: 'ver_101_v1',
      versionId: 'ver_202608_001',
      attachmentId: 'att_101',
      versionNumber: 1,
      storageProvider: 'LOCAL',
      storagePath: '/storage/attachments/pat-101/fbc_lab_sheet_v1.pdf',
      fileSize: 2410000,
      checksum: '1a2b3c4598fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b800',
      mimeType: 'application/pdf',
      uploadedBy: { userId: 'usr_rec_01', userName: 'Mona Hassan', userRole: 'Receptionist' },
      uploadedAt: '2026-07-28T09:00:00Z',
      changeReason: 'Initial preliminary scan uploaded from external lab.',
      createdAt: '2026-07-28T09:00:00Z',
    },
  ],
}

class PatientAttachmentApiService {
  private attachments: IPatientAttachment[] = [...SEEDED_ATTACHMENTS]
  private categories: IAttachmentCategory[] = [...DEFAULT_CATEGORIES]
  private tags: IAttachmentTag[] = [...DEFAULT_TAGS]
  private versions: Record<string, IAttachmentVersion[]> = { ...SEEDED_VERSIONS }

  async getPatientAttachments(
    patientId: string,
    options: IAttachmentFilterOptions = {}
  ): Promise<{ items: IPatientAttachment[]; total: number }> {
    let result = this.attachments.filter((a) => a.patientId === patientId)

    const statusFilter = options.status || 'ACTIVE'
    result = result.filter((a) => a.status === statusFilter)

    if (options.search) {
      const query = options.search.toLowerCase()
      result = result.filter(
        (a) =>
          a.originalFileName.toLowerCase().includes(query) ||
          a.categoryName.toLowerCase().includes(query) ||
          (a.description && a.description.toLowerCase().includes(query)) ||
          a.tags.some((t) => t.toLowerCase().includes(query))
      )
    }

    if (options.categoryId) {
      result = result.filter((a) => a.categoryId === options.categoryId)
    }

    if (options.tag) {
      result = result.filter((a) => a.tags.includes(options.tag!))
    }

    if (options.favoritesOnly) {
      result = result.filter((a) => a.isFavorite)
    }

    const sortBy = options.sortBy || 'createdAt'
    const sortOrder = options.sortOrder || 'desc'
    result.sort((a, b) => {
      let valA: string | number = (a as unknown as Record<string, string | number>)[sortBy] || ''
      let valB: string | number = (b as unknown as Record<string, string | number>)[sortBy] || ''
      if (typeof valA === 'string') valA = valA.toLowerCase()
      if (typeof valB === 'string') valB = valB.toLowerCase()
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return { items: result, total: result.length }
  }

  async getAttachmentById(patientId: string, attachmentId: string): Promise<IPatientAttachment> {
    const found = this.attachments.find((a) => a.patientId === patientId && a.id === attachmentId)
    if (!found) throw new Error('Attachment not found.')
    return found
  }

  async uploadAttachment(dto: IUploadAttachmentDto): Promise<IPatientAttachment> {
    const cat = this.categories.find((c) => c.id === dto.categoryId) || this.categories[0]
    const ext = dto.file.name.substring(dto.file.name.lastIndexOf('.')).toLowerCase() || '.bin'
    
    const newAtt: IPatientAttachment = {
      id: `att_${Date.now()}`,
      attachmentId: `att_202608_${Math.floor(10000 + Math.random() * 90000)}`,
      patientId: dto.patientId,
      tenantId: 'tenant-default',
      clinicId: 'clinic-default',
      fileName: `${dto.file.name.replace(/[^a-z0-9.]/gi, '_')}`,
      originalFileName: dto.file.name,
      fileExtension: ext,
      mimeType: dto.file.type || 'application/octet-stream',
      fileSize: dto.file.size,
      storageProvider: 'LOCAL',
      storagePath: `/storage/attachments/${dto.patientId}/${dto.file.name}`,
      checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      categoryId: cat.id,
      categoryName: cat.name,
      categoryColor: cat.color,
      description: dto.description || '',
      tags: dto.tags || [],
      notes: dto.notes || '',
      isFavorite: false,
      version: 1,
      isLatestVersion: true,
      status: 'ACTIVE',
      uploadedBy: { userId: 'usr_doc_01', userName: 'Dr. Ahmed Al-Mansoor', userRole: 'Doctor' },
      uploadedAt: new Date().toISOString(),
      previewAvailable: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    this.attachments.unshift(newAtt)

    this.versions[newAtt.id] = [
      {
        id: `ver_${Date.now()}_v1`,
        versionId: `ver_202608_001`,
        attachmentId: newAtt.id,
        versionNumber: 1,
        storageProvider: 'LOCAL',
        storagePath: newAtt.storagePath,
        fileSize: newAtt.fileSize,
        checksum: newAtt.checksum,
        mimeType: newAtt.mimeType,
        uploadedBy: newAtt.uploadedBy,
        uploadedAt: newAtt.uploadedAt,
        changeReason: 'Initial file upload.',
        createdAt: newAtt.createdAt,
      },
    ]

    return newAtt
  }

  async replaceAttachment(
    patientId: string,
    attachmentId: string,
    file: File,
    changeReason?: string
  ): Promise<IPatientAttachment> {
    const existing = await this.getAttachmentById(patientId, attachmentId)
    const nextVersion = existing.version + 1

    existing.version = nextVersion
    existing.fileSize = file.size
    existing.originalFileName = file.name
    existing.updatedAt = new Date().toISOString()

    const verList = this.versions[attachmentId] || []
    verList.unshift({
      id: `ver_${Date.now()}_v${nextVersion}`,
      versionId: `ver_202608_00${nextVersion}`,
      attachmentId: existing.id,
      versionNumber: nextVersion,
      storageProvider: 'LOCAL',
      storagePath: `/storage/attachments/${patientId}/v${nextVersion}_${file.name}`,
      fileSize: file.size,
      checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      mimeType: file.type || 'application/octet-stream',
      uploadedBy: { userId: 'usr_doc_01', userName: 'Dr. Ahmed Al-Mansoor', userRole: 'Doctor' },
      uploadedAt: new Date().toISOString(),
      changeReason: changeReason || `Uploaded new version ${nextVersion}`,
      createdAt: new Date().toISOString(),
    })
    this.versions[attachmentId] = verList

    return existing
  }

  async updateAttachment(
    patientId: string,
    attachmentId: string,
    dto: IUpdateAttachmentDto
  ): Promise<IPatientAttachment> {
    const existing = await this.getAttachmentById(patientId, attachmentId)
    if (dto.originalFileName !== undefined) existing.originalFileName = dto.originalFileName
    if (dto.description !== undefined) existing.description = dto.description
    if (dto.tags !== undefined) existing.tags = dto.tags
    if (dto.notes !== undefined) existing.notes = dto.notes
    if (dto.isFavorite !== undefined) existing.isFavorite = dto.isFavorite
    if (dto.categoryId !== undefined) {
      const cat = this.categories.find((c) => c.id === dto.categoryId)
      if (cat) {
        existing.categoryId = cat.id
        existing.categoryName = cat.name
        existing.categoryColor = cat.color
      }
    }
    existing.updatedAt = new Date().toISOString()
    return existing
  }

  async softDeleteAttachment(patientId: string, attachmentId: string): Promise<IPatientAttachment> {
    const existing = await this.getAttachmentById(patientId, attachmentId)
    existing.status = 'SOFT_DELETED'
    existing.deletedAt = new Date().toISOString()
    existing.deletedBy = { userId: 'usr_doc_01', userName: 'Dr. Ahmed Al-Mansoor', userRole: 'Doctor' }
    existing.updatedAt = new Date().toISOString()
    return existing
  }

  async restoreAttachment(patientId: string, attachmentId: string): Promise<IPatientAttachment> {
    const existing = this.attachments.find((a) => a.patientId === patientId && a.id === attachmentId)
    if (!existing) throw new Error('Attachment not found.')
    existing.status = 'ACTIVE'
    existing.deletedAt = undefined
    existing.deletedBy = undefined
    existing.updatedAt = new Date().toISOString()
    return existing
  }

  async getVersionHistory(attachmentId: string): Promise<IAttachmentVersion[]> {
    return this.versions[attachmentId] || []
  }

  async getCategories(): Promise<IAttachmentCategory[]> {
    return this.categories
  }

  async createCategory(name: string, color: string, icon: string): Promise<IAttachmentCategory> {
    const newCat: IAttachmentCategory = {
      id: `cat_${Date.now()}`,
      categoryId: `cat_${Date.now()}`,
      tenantId: 'tenant-default',
      clinicId: 'clinic-default',
      name,
      color,
      icon,
      displayOrder: this.categories.length + 1,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.categories.push(newCat)
    return newCat
  }

  async getTags(): Promise<IAttachmentTag[]> {
    return this.tags
  }

  async createTag(name: string, color: string): Promise<IAttachmentTag> {
    const newTag: IAttachmentTag = { id: `tag_${Date.now()}`, tagId: `tag_${Date.now()}`, name, color }
    this.tags.push(newTag)
    return newTag
  }

  async getAnalytics(): Promise<IAttachmentAnalytics> {
    const totalStorageBytes = this.attachments.reduce((sum, a) => sum + a.fileSize, 0)
    const storageLimitBytes = 50 * 1024 * 1024 * 1024 // 50 GB
    const usagePct = Math.round((totalStorageBytes / storageLimitBytes) * 100)

    const catCounts: Record<string, number> = {}
    this.attachments.forEach((a) => {
      catCounts[a.categoryName] = (catCounts[a.categoryName] || 0) + 1
    })

    return {
      totalFiles: this.attachments.length,
      totalStorageBytes,
      storageLimitBytes,
      storageUsagePercentage: usagePct,
      categoryCounts: catCounts,
      largestFiles: [...this.attachments].sort((a, b) => b.fileSize - a.fileSize).slice(0, 5),
      recentUploads: [...this.attachments].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
      recentActivity: [
        { id: 'act_1', action: 'UPLOADED', fileName: 'Full Blood Count (FBC) Lab Sheet.pdf', performedBy: 'Dr. Ahmed Al-Mansoor', timestamp: '2026-08-01T10:30:00Z' },
        { id: 'act_2', action: 'PREVIEWED', fileName: 'Chest X-Ray PA View.png', performedBy: 'Sarah Jenkins', timestamp: '2026-07-30T14:20:00Z' },
        { id: 'act_3', action: 'DOWNLOADED', fileName: 'National ID Card Scan.jpg', performedBy: 'Mona Hassan', timestamp: '2026-07-25T09:10:00Z' },
      ],
    }
  }
}

export const patientAttachmentApi = new PatientAttachmentApiService()
