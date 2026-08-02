// Patient Files & Attachments Repository Layer — Module-016

import type {
  IPatientAttachmentEntity,
  IAttachmentVersionEntity,
  IAttachmentCategoryEntity,
  IAttachmentTagEntity,
  IAttachmentActivityLog,
  IAttachmentQueryFilter,
} from './patientAttachment.types'

const DEFAULT_CATEGORIES: IAttachmentCategoryEntity[] = [
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

const DEFAULT_TAGS: IAttachmentTagEntity[] = [
  { id: 'tag_01', tagId: 'tag_01', tenantId: 'tenant-default', clinicId: 'clinic-default', name: 'Urgent', color: '#EF4444' },
  { id: 'tag_02', tagId: 'tag_02', tenantId: 'tenant-default', clinicId: 'clinic-default', name: 'Cardiology', color: '#0284C7' },
  { id: 'tag_03', tagId: 'tag_03', tenantId: 'tenant-default', clinicId: 'clinic-default', name: 'Bloodwork_2026', color: '#8B5CF6' },
  { id: 'tag_04', tagId: 'tag_04', tenantId: 'tenant-default', clinicId: 'clinic-default', name: 'PreOp', color: '#F59E0B' },
]

const SEEDED_ATTACHMENTS: IPatientAttachmentEntity[] = [
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
]

const SEEDED_VERSIONS: Record<string, IAttachmentVersionEntity[]> = {
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

export class PatientAttachmentRepository {
  private attachments: IPatientAttachmentEntity[] = [...SEEDED_ATTACHMENTS]
  private categories: IAttachmentCategoryEntity[] = [...DEFAULT_CATEGORIES]
  private tags: IAttachmentTagEntity[] = [...DEFAULT_TAGS]
  private versions: Record<string, IAttachmentVersionEntity[]> = { ...SEEDED_VERSIONS }
  private activityLogs: IAttachmentActivityLog[] = [
    { id: 'act_1', action: 'UPLOADED', attachmentId: 'att_101', fileName: 'Full Blood Count (FBC) Lab Sheet.pdf', performedBy: 'Dr. Ahmed Al-Mansoor', timestamp: '2026-08-01T10:30:00Z' },
    { id: 'act_2', action: 'PREVIEWED', attachmentId: 'att_102', fileName: 'Chest X-Ray PA View.png', performedBy: 'Sarah Jenkins', timestamp: '2026-07-30T14:20:00Z' },
  ]

  async findPatientAttachments(
    tenantId: string,
    patientId: string,
    filter: IAttachmentQueryFilter
  ): Promise<{ items: IPatientAttachmentEntity[]; total: number }> {
    let result = this.attachments.filter((a) => a.tenantId === tenantId && a.patientId === patientId)

    const statusFilter = filter.status || 'ACTIVE'
    result = result.filter((a) => a.status === statusFilter)

    if (filter.search) {
      const q = filter.search.toLowerCase()
      result = result.filter(
        (a) =>
          a.originalFileName.toLowerCase().includes(q) ||
          a.categoryName.toLowerCase().includes(q) ||
          (a.description && a.description.toLowerCase().includes(q)) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      )
    }

    if (filter.categoryId) {
      result = result.filter((a) => a.categoryId === filter.categoryId)
    }

    if (filter.tag) {
      result = result.filter((a) => a.tags.includes(filter.tag!))
    }

    if (filter.favoritesOnly) {
      result = result.filter((a) => a.isFavorite)
    }

    const sortBy = filter.sortBy || 'createdAt'
    const sortOrder = filter.sortOrder || 'desc'
    result.sort((a, b) => {
      let valA: string | number = (a as unknown as Record<string, string | number>)[sortBy] || ''
      let valB: string | number = (b as unknown as Record<string, string | number>)[sortBy] || ''
      if (typeof valA === 'string') valA = valA.toLowerCase()
      if (typeof valB === 'string') valB = valB.toLowerCase()
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    const total = result.length
    const page = filter.page || 1
    const limit = filter.limit || 20
    const startIdx = (page - 1) * limit
    const items = result.slice(startIdx, startIdx + limit)

    return { items, total }
  }

  async findById(tenantId: string, patientId: string, attachmentId: string): Promise<IPatientAttachmentEntity | null> {
    const item = this.attachments.find(
      (a) => a.tenantId === tenantId && a.patientId === patientId && (a.id === attachmentId || a.attachmentId === attachmentId)
    )
    return item || null
  }

  async create(attachment: IPatientAttachmentEntity, initialVersion: IAttachmentVersionEntity): Promise<IPatientAttachmentEntity> {
    this.attachments.unshift(attachment)
    this.versions[attachment.id] = [initialVersion]
    this.logActivity('UPLOADED', attachment.id, attachment.originalFileName, attachment.uploadedBy.userName)
    return attachment
  }

  async update(attachment: IPatientAttachmentEntity): Promise<IPatientAttachmentEntity> {
    const idx = this.attachments.findIndex((a) => a.id === attachment.id)
    if (idx !== -1) {
      this.attachments[idx] = attachment
    }
    return attachment
  }

  async addVersion(attachmentId: string, version: IAttachmentVersionEntity): Promise<IAttachmentVersionEntity> {
    const list = this.versions[attachmentId] || []
    list.unshift(version)
    this.versions[attachmentId] = list
    return version
  }

  async getVersionHistory(attachmentId: string): Promise<IAttachmentVersionEntity[]> {
    return this.versions[attachmentId] || []
  }

  async getVersionById(attachmentId: string, versionId: string): Promise<IAttachmentVersionEntity | null> {
    const list = this.versions[attachmentId] || []
    const found = list.find((v) => v.id === versionId || v.versionId === versionId)
    return found || null
  }

  async findCategories(tenantId: string): Promise<IAttachmentCategoryEntity[]> {
    return this.categories.filter((c) => c.tenantId === tenantId || c.tenantId === 'tenant-default')
  }

  async findCategoryById(categoryId: string): Promise<IAttachmentCategoryEntity | null> {
    return this.categories.find((c) => c.id === categoryId || c.categoryId === categoryId) || null
  }

  async createCategory(category: IAttachmentCategoryEntity): Promise<IAttachmentCategoryEntity> {
    this.categories.push(category)
    return category
  }

  async findTags(tenantId: string): Promise<IAttachmentTagEntity[]> {
    return this.tags.filter((t) => t.tenantId === tenantId || t.tenantId === 'tenant-default')
  }

  async createTag(tag: IAttachmentTagEntity): Promise<IAttachmentTagEntity> {
    this.tags.push(tag)
    return tag
  }

  logActivity(action: IAttachmentActivityLog['action'], attachmentId: string, fileName: string, performedBy: string) {
    this.activityLogs.unshift({
      id: `act_${Date.now()}`,
      action,
      attachmentId,
      fileName,
      performedBy,
      timestamp: new Date().toISOString(),
    })
  }

  async getAnalytics(tenantId: string) {
    const tenantAtts = this.attachments.filter((a) => (a.tenantId === tenantId || a.tenantId === 'tenant-default') && a.status === 'ACTIVE')
    const totalStorageBytes = tenantAtts.reduce((sum, a) => sum + a.fileSize, 0)
    const storageLimitBytes = 50 * 1024 * 1024 * 1024 // 50 GB
    const storageUsagePercentage = Math.round((totalStorageBytes / storageLimitBytes) * 100)

    const catCounts: Record<string, number> = {}
    tenantAtts.forEach((a) => {
      catCounts[a.categoryName] = (catCounts[a.categoryName] || 0) + 1
    })

    return {
      totalFiles: tenantAtts.length,
      totalStorageBytes,
      storageLimitBytes,
      storageUsagePercentage,
      categoryCounts: catCounts,
      largestFiles: [...tenantAtts].sort((a, b) => b.fileSize - a.fileSize).slice(0, 5),
      recentUploads: [...tenantAtts].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
      recentActivity: this.activityLogs.slice(0, 10),
    }
  }
}

export const patientAttachmentRepository = new PatientAttachmentRepository()
