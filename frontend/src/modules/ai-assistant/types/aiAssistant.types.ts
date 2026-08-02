// Offline AI Medical Assistant Types & Interfaces — Module-017

export type AIConfidenceLevel = 'HIGH' | 'MODERATE' | 'LOW'

export type AIServerStatusType = 'READY' | 'INITIALIZING' | 'DEGRADED' | 'FAILED'

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

export interface AIQuickCommand {
  id: string
  title: string
  description: string
  category: 'PATIENT' | 'CLINICAL' | 'REPORTS' | 'NAVIGATION'
  prompt: string
  iconName: string
}

export interface IAIMessage {
  messageId: string
  sessionId: string
  sender: 'USER' | 'ASSISTANT' | 'SYSTEM'
  content: string
  timestamp: string
  confidenceScore?: number
  confidenceLevel?: AIConfidenceLevel
  dataSources?: AISourceReference[]
  suggestedActions?: AISuggestedAction[]
  navigationTarget?: {
    module: string
    route: string
    params?: Record<string, string>
  }
  isError?: boolean
  errorMessage?: string
}

export interface IAISession {
  sessionId: string
  title: string
  startedAt: string
  lastActivityAt: string
  isPinned: boolean
  turnCount: number
}

export interface AIServerStatus {
  status: AIServerStatusType
  modelName: string
  modelFormat: string
  isOffline: boolean
  indexSyncPercentage: number
  lastIndexUpdate: string
  activeUserRole: string
}

export interface IAIContextState {
  activePatientId?: string
  activePatientName?: string
  activePatientMrn?: string
  activeModule?: string
  appliedRoleScope: string
  tenantId: string
  clinicId: string
}

export interface IAIQueryRequest {
  sessionId: string
  queryText: string
  context?: IAIContextState
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
