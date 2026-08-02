# Module-017 — Offline AI Medical Assistant API & Local Engine Design

## Executive Summary

The **Offline AI Medical Assistant Internal API & Local Engine Specification** defines the modular components, 100% on-device processing pipeline, internal service interfaces (IPC/TypeScript APIs), prompt building strategies, response validators, and error catalogs for Module-017.

All interactions execute locally inside the ClinicOS Desktop Application without making external HTTP requests to cloud LLM services or third-party APIs.

---

## 1. Local AI Engine Processing Pipeline

```
[ User Input (Natural Language / Command Bar) ]
                       │
                       ▼
            +--------------------+
            |   Intent Router    | ──► Classify Action & Extract Entities
            +--------------------+
                       │
                       ▼
            +--------------------+
            | Permission Guard   | ──► Validate RBAC, Tenant, & Patient Scope
            +--------------------+
                       │
                       ▼
            +--------------------+
            | Knowledge Retriever| ──► Query FTS5 Local Knowledge Index
            +--------------------+
                       │
                       ▼
            +--------------------+
            |  Context Builder   | ──► Assemble Token Budget & Aggregated State
            +--------------------+
                       │
                       ▼
            +--------------------+
            |   Prompt Builder   | ──► Inject Safety Rules & System Prompts
            +--------------------+
                       │
                       ▼
            +--------------------+
            | Local LLM Runtime  | ──► Execute Local Inference (GGUF/ONNX)
            +--------------------+
                       │
                       ▼
            +--------------------+
            | Response Validator | ──► Check Anti-Hallucination & Sources
            +--------------------+
                       │
                       ▼
            +--------------------+
            |    Audit Logger    | ──► Dispatch Event to Audit Logs Module
            +--------------------+
                       │
                       ▼
[ Render Response UI & Navigation Action ]
```

---

## 2. Local AI Engine Components Specification

### 2.1 Intent Router
- **Function**: Parses natural language queries to detect clinician intent and extract entities.
- **Supported Intents**:
  - `PATIENT_SEARCH`: Search patient by Name, MRN, National ID, or Phone.
  - `PATIENT_OPEN`: Navigate directly to specific patient profile.
  - `PATIENT_SUMMARY`: Aggregate medical summary for focused patient.
  - `VISIT_HISTORY`: Summarize chronological visit history.
  - `PRESCRIPTION_HISTORY`: Query active/past prescription regimens.
  - `SOAP_FORMAT`: Convert rough clinical notes to structured SOAP format.
  - `ATTACHMENT_SEARCH`: Query document metadata and tags.
  - `REPORTS_QUERY`: Translate questions into financial/operational report queries.
  - `NAVIGATE_MODULE`: Handle shortcuts (`"Go to Billing"`, `"Open Appointments"`).
  - `UNSUPPORTED`: Gracefully decline unknown intents with safe alternatives.

### 2.2 Permission Validator
- Validates user role, tenant ID, clinic ID, and patient ownership before fetching context.
- **Platform Owner Barrier**: Immediately aborts processing if `user.role === 'SUPER_ADMIN'`.

### 2.3 Knowledge Retriever
- Executes fast local FTS5 keyword & metadata queries against `ai_knowledge_index`.
- Filters out all deleted (`isDeleted: true`) or unauthorized records.

### 2.4 Context Builder
- Assembles minimal context payload (Diagnoses, Allergies, Current Meds, Vitals, Notes).
- Enforces strict token limit budgets (e.g., maximum 2,048 tokens context window).

### 2.5 Prompt Builder
- Injects standard medical system prompts and hardcoded safety guardrails:
  - *"Do not diagnose diseases."*
  - *"Do not recommend unprescribed medications."*
  - *"Format output strictly in JSON format."*

### 2.6 Local LLM Runtime (Engine Abstraction Interface)
- Decoupled interface supporting local execution runtimes: `llama.cpp` (GGUF 4-bit/8-bit models), ONNX Runtime, and SQLite FTS5 index engines.

### 2.7 Response Validator
- Validates that AI output contains mandatory `confidenceScore`, `dataSources`, and timestamp.
- Rejects outputs containing unverified diagnoses or missing data source references.

### 2.8 Audit Logger
- Dispatches audit events (`AI_QUERY_EXECUTED`) with SHA-256 query hashes and execution metrics.

---

## 3. Internal Service API Specifications

### 3.1 AI Initialization Service (`IAIInitializationService`)
```typescript
export interface IAIInitializationService {
  initializeEngine(): Promise<{ status: 'READY' | 'DEGRADED' | 'FAILED'; message: string }>
  verifyModelBinary(): Promise<boolean>
  verifyIndexIntegrity(): Promise<{ isHealthy: boolean; recordCount: number }>
  warmupRuntime(): Promise<void>
}
```

### 3.2 AI Query Service (`IAIQueryService`)
```typescript
export interface IAIQueryRequest {
  sessionId: string
  queryText: string
  patientIdContext?: string
  activeModuleContext?: string
}

export interface IAIQueryResponse {
  queryId: string
  sessionId: string
  answer: string
  confidenceScore: number            // 0.00 to 1.00
  dataSources: Array<{
    entityType: string
    entityId: string
    title: string
  }>
  navigationTarget?: {
    module: string
    route: string
    params?: Record<string, string>
  }
  generatedAt: string
}

export interface IAIQueryService {
  processQuery(request: IAIQueryRequest): Promise<IAIQueryResponse>
  parseIntent(queryText: string): Promise<{ intent: string; confidence: number; entities: Record<string, string> }>
}
```

### 3.3 Search Service (`IAISearchService`)
```typescript
export interface IAISearchService {
  searchPatients(query: string): Promise<Array<{ patientId: string; name: string; mrn: string; phone: string }>>
  searchAttachments(query: string): Promise<Array<{ attachmentId: string; fileName: string; category: string }>>
  searchAppointments(query: string): Promise<Array<{ appointmentId: string; date: string; patientName: string }>>
}
```

### 3.4 Clinical Summary Service (`IAISummaryService`)
```typescript
export interface IAISummaryService {
  generatePatientSummary(patientId: string): Promise<{
    chronicDiseases: string[]
    allergies: string[]
    activeMedications: string[]
    recentVisits: Array<{ date: string; summary: string }>
  }>
  formatSOAPNote(rawDraft: string): Promise<{ structuredSOAP: string; diffChanges: string[] }>
}
```

### 3.5 Index Management Service (`IAIIndexManagementService`)
```typescript
export interface IAIIndexManagementService {
  buildFullIndex(): Promise<{ success: boolean; totalIndexed: number; durationMs: number }>
  updateIncrementalIndex(entityType: string, entityId: string): Promise<void>
  validateIndexHealth(): Promise<{ isHealthy: boolean; corruptedRecords: number }>
}
```

---

## 4. Standard Response JSON Contract

Every internal AI query response returns a predictable, type-safe JSON structure:

```json
{
  "queryId": "aiq_202608_00109",
  "sessionId": "ais_88201",
  "answer": "Ahmed Ali has 2 documented chronic conditions (Type 2 Diabetes, Hypertension) and is currently prescribed Metformin 500mg BD.",
  "confidenceScore": 0.98,
  "dataSources": [
    {
      "entityType": "MEDICAL_RECORD",
      "entityId": "rec_10029",
      "title": "Clinical Progress Note (2026-07-15)"
    },
    {
      "entityType": "PRESCRIPTION",
      "entityId": "rx_88102",
      "title": "Prescription #88102"
    }
  ],
  "navigationTarget": {
    "module": "PATIENT_PROFILE",
    "route": "/patients/pat-101",
    "params": { "patientId": "pat-101" }
  },
  "generatedAt": "2026-08-02T15:52:00.000Z"
}
```

---

## 5. Standardized Error Catalog

| Error Code | HTTP Status / Exception | Cause | User Action |
| --- | --- | --- | --- |
| `AI_MODEL_MISSING` | `503 Service Unavailable` | Local GGUF/ONNX binary file missing | Download local model package |
| `AI_MODEL_LOAD_FAILED` | `500 Internal Error` | Out of RAM / memory allocation failure | Close background apps or fallback to search |
| `AI_INDEX_CORRUPTED` | `500 Internal Error` | SQLite FTS5 checksum check failed | Click to rebuild local AI index |
| `AI_PERMISSION_DENIED` | `403 Forbidden` | User role lacks access to requested entity | Access denied notice shown |
| `AI_PATIENT_NOT_FOUND` | `404 Not Found` | Natural language search matched 0 patients | Verify name, phone, or MRN |
| `AI_CONTEXT_TOO_LARGE` | `400 Bad Request` | Query context exceeded 2,048 tokens | Refine query parameters |
| `AI_TIMEOUT` | `504 Gateway Timeout` | Local inference exceeded 5,000ms | Retry with shorter query |
| `AI_UNSUPPORTED_REQUEST`| `422 Unprocessable Entity` | Query attempts unpermitted action (diagnose) | Display safety limitation notice |

---

## 6. Reserved Future API Extensions (V2 Roadmap)

1. **`IVoiceDictationService`**: `startVoiceDictation()`, `stopVoiceDictation()`, `streamAudioToText()`.
2. **`IOCRExtractionService`**: `extractTextFromImage(attachmentId)`, `indexOCRText()`.
3. **`IRAGVectorService`**: `generateDenseEmbeddings(text)`, `vectorSearch(queryVector)`.

---

## 7. Verification & Approval Gate

- [x] Complete Local Processing Pipeline Designed
- [x] 8 Core Engine Components Specified
- [x] 5 Internal Service Interfaces Documented (`IAIInitializationService`, `IAIQueryService`, `IAISearchService`, `IAISummaryService`, `IAIIndexManagementService`)
- [x] Standard Response JSON Schema Established
- [x] Standardized Error Catalog Created
- [x] Anti-Hallucination & Safety Validation Flow Included
- [x] No API Conflicts Found
