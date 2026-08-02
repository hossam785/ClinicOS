// Offline AI Medical Assistant Data Repository — Module-017

import type {
  IAIKnowledgeIndexDocument,
  IAISessionDocument,
  IAIQueryHistoryDocument,
  IAIIndexMetadataDocument,
} from './aiAssistant.types'

class AIAssistantRepository {
  private knowledgeIndexStore: Map<string, IAIKnowledgeIndexDocument> = new Map()
  private sessionStore: Map<string, IAISessionDocument> = new Map()
  private queryHistoryStore: Map<string, IAIQueryHistoryDocument> = new Map()
  private indexMetadataStore: Map<string, IAIIndexMetadataDocument> = new Map()

  constructor() {
    this.seedDefaultKnowledgeIndex()
  }

  private seedDefaultKnowledgeIndex() {
    const defaultIndexItems: IAIKnowledgeIndexDocument[] = [
      {
        _id: 'knw_101',
        knowledgeId: 'knw_101',
        tenantId: 'tenant-default',
        clinicId: 'clinic-default',
        patientId: 'pat_101',
        entityType: 'PATIENT',
        entityId: 'pat_101',
        title: 'Ahmed Ali (MRN-2026-0042)',
        searchableText: 'ahmed ali 01001234567 29001011234567 mrn-2026-0042 diabetes hypertension',
        metadata: {
          patientName: 'Ahmed Ali',
          mrn: 'MRN-2026-0042',
          phone: '01001234567',
          chronicDiseases: ['Type 2 Diabetes Mellitus', 'Essential Hypertension'],
        },
        permissionScope: 'DOCTOR',
        version: 1,
        isDeleted: false,
        updatedAt: new Date(),
        createdAt: new Date(),
      },
      {
        _id: 'knw_102',
        knowledgeId: 'knw_102',
        tenantId: 'tenant-default',
        clinicId: 'clinic-default',
        patientId: 'pat_101',
        entityType: 'MEDICAL_RECORD',
        entityId: 'rec_8812',
        title: 'Progress Note — Diabetes Follow-up',
        searchableText: 'progress note blood pressure 130/85 hba1c 6.8 fasting blood glucose',
        metadata: {
          patientId: 'pat_101',
          dateRecorded: new Date('2026-07-28'),
        },
        permissionScope: 'DOCTOR',
        version: 1,
        isDeleted: false,
        updatedAt: new Date(),
        createdAt: new Date(),
      },
    ]

    for (const item of defaultIndexItems) {
      this.knowledgeIndexStore.set(item.knowledgeId, item)
    }

    const defaultMetadata: IAIIndexMetadataDocument = {
      _id: 'meta_default',
      tenantId: 'tenant-default',
      clinicId: 'clinic-default',
      version: 1,
      lastFullBuildAt: new Date(),
      lastIncrementalUpdateAt: new Date(),
      totalIndexedRecords: defaultIndexItems.length,
      isCorrupted: false,
      buildDurationMs: 120,
      status: 'HEALTHY',
      updatedAt: new Date(),
    }
    this.indexMetadataStore.set('tenant-default:clinic-default', defaultMetadata)
  }

  async searchKnowledgeIndex(
    tenantId: string,
    clinicId: string,
    queryText: string,
    userRole: string
  ): Promise<IAIKnowledgeIndexDocument[]> {
    const qLower = queryText.toLowerCase().trim()
    const results: IAIKnowledgeIndexDocument[] = []

    for (const doc of this.knowledgeIndexStore.values()) {
      if (doc.tenantId !== tenantId || doc.clinicId !== clinicId || doc.isDeleted) {
        continue
      }

      // Check RBAC Scope
      if (userRole === 'RECEPTIONIST' && doc.permissionScope === 'DOCTOR') {
        continue
      }

      const qTokens = qLower.split(/\s+/).filter((t) => t.length > 2)
      const matchesFull = doc.searchableText.toLowerCase().includes(qLower) || doc.title.toLowerCase().includes(qLower)
      const matchesTokens = qTokens.some(
        (token) => doc.searchableText.toLowerCase().includes(token) || doc.title.toLowerCase().includes(token)
      )

      if (matchesFull || matchesTokens) {
        results.push(doc)
      }
    }

    return results
  }

  async findSessionById(sessionId: string): Promise<IAISessionDocument | null> {
    return this.sessionStore.get(sessionId) || null
  }

  async saveSession(session: IAISessionDocument): Promise<IAISessionDocument> {
    this.sessionStore.set(session.sessionId, session)
    return session
  }

  async listUserSessions(tenantId: string, clinicId: string, userId: string): Promise<IAISessionDocument[]> {
    const userSessions: IAISessionDocument[] = []
    for (const sess of this.sessionStore.values()) {
      if (sess.tenantId === tenantId && sess.clinicId === clinicId && sess.userId === userId) {
        userSessions.push(sess)
      }
    }
    return userSessions.sort((a, b) => b.lastActivityAt.getTime() - a.lastActivityAt.getTime())
  }

  async saveQueryHistory(history: IAIQueryHistoryDocument): Promise<IAIQueryHistoryDocument> {
    this.queryHistoryStore.set(history.queryId, history)
    return history
  }

  async getIndexMetadata(tenantId: string, clinicId: string): Promise<IAIIndexMetadataDocument | null> {
    return this.indexMetadataStore.get(`${tenantId}:${clinicId}`) || null
  }

  async updateIndexMetadata(meta: IAIIndexMetadataDocument): Promise<IAIIndexMetadataDocument> {
    this.indexMetadataStore.set(`${meta.tenantId}:${meta.clinicId}`, meta)
    return meta
  }
}

export const aiAssistantRepository = new AIAssistantRepository()
