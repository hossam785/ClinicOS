// Offline AI Medical Assistant Domain Types & Contracts — Module-017

export type AIConfidenceLevel = 'HIGH' | 'MODERATE' | 'LOW'

export type AIServerStatusType = 'READY' | 'INITIALIZING' | 'DEGRADED' | 'FAILED'

export interface AIServerStatus {
  status: AIServerStatusType
  modelName: string
  modelFormat: string
  isOffline: boolean
  indexSyncPercentage: number
  lastIndexUpdate: string
  activeUserRole: string
}

export type AIIntentCategory =
  | 'PATIENT_SEARCH'
  | 'PATIENT_OPEN'
  | 'PATIENT_SUMMARY'
  | 'VISIT_HISTORY'
  | 'PRESCRIPTION_HISTORY'
  | 'SOAP_FORMAT'
  | 'ATTACHMENT_SEARCH'
  | 'REPORTS_QUERY'
  | 'NAVIGATE_MODULE'
  | 'UNSUPPORTED'

export interface IAIKnowledgeIndexDocument {
  _id: string
  knowledgeId: string
  tenantId: string
  clinicId: string
  patientId?: string
  entityType: 'PATIENT' | 'MEDICAL_RECORD' | 'APPOINTMENT' | 'PRESCRIPTION' | 'ATTACHMENT' | 'REPORT'
  entityId: string
  title: string
  searchableText: string
  metadata: Record<string, unknown>
  permissionScope: 'DOCTOR' | 'NURSE' | 'RECEPTIONIST' | 'ADMIN'
  version: number
  isDeleted: boolean
  updatedAt: Date
  createdAt: Date
}

export interface IAISessionDocument {
  _id: string
  sessionId: string
  tenantId: string
  clinicId: string
  userId: string
  userRole: string
  title: string
  startedAt: Date
  lastActivityAt: Date
  status: 'ACTIVE' | 'CLOSED' | 'EXPIRED'
  isPinned: boolean
  turnCount: number
}

export interface IAIQueryHistoryDocument {
  _id: string
  queryId: string
  sessionId: string
  tenantId: string
  clinicId: string
  userId: string
  userRole: string
  query: string
  queryHash: string
  intentCategory: AIIntentCategory
  responseTimeMs: number
  confidenceScore: number
  dataSources: Array<{
    entityType: string
    entityId: string
    title: string
    subtitle?: string
    route?: string
  }>
  createdAt: Date
}

export interface IAIIndexMetadataDocument {
  _id: string
  tenantId: string
  clinicId: string
  version: number
  lastFullBuildAt: Date
  lastIncrementalUpdateAt: Date
  totalIndexedRecords: number
  isCorrupted: boolean
  buildDurationMs: number
  status: 'HEALTHY' | 'BUILDING' | 'CORRUPTED' | 'DEGRADED'
  updatedAt: Date
}

export interface IAIIntentResult {
  intent: AIIntentCategory
  confidence: number
  entities: {
    patientName?: string
    mrn?: string
    phone?: string
    moduleName?: string
    [key: string]: unknown
  }
}

export interface IAIContextPayload {
  tenantId: string
  clinicId: string
  userId: string
  userRole: string
  patientId?: string
  activeModule?: string
}

export interface AISourceReference {
  entityType: 'PATIENT' | 'MEDICAL_RECORD' | 'APPOINTMENT' | 'PRESCRIPTION' | 'ATTACHMENT' | 'REPORT'
  entityId: string
  title: string
  subtitle?: string
  route?: string
}

export interface AISuggestedAction {
  id: string
  label: string
  actionType: 'NAVIGATE' | 'PREFILL_PROMPT' | 'TRIGGER_FILTER'
  targetRoute?: string
  promptText?: string
  iconName?: string
}

export interface IAIQueryRequest {
  sessionId?: string
  queryText: string
  patientIdContext?: string
  activeModuleContext?: string
}

export interface IAIQueryResponse {
  queryId: string
  sessionId: string
  answer: string
  confidenceScore: number
  confidenceLevel: AIConfidenceLevel
  dataSources: AISourceReference[]
  suggestedActions?: AISuggestedAction[]
  navigationTarget?: {
    module: string
    route: string
    params?: Record<string, string>
  }
  generatedAt: string
}
