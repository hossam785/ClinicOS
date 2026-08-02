# Module-017 — Offline AI Medical Assistant Database & Knowledge Architecture

## Executive Summary

The **Offline AI Medical Assistant Database & Knowledge Architecture** defines the data structures, indexing mechanisms, retrieval pipelines, session memory strategies, and security isolation barriers for Module-017.

This architecture strictly enforces the **Decoupled AI Knowledge Layer Pattern**: The local AI engine **NEVER queries raw EMR database tables directly**. Instead, it interacts exclusively with an indexed, permission-scoped, locally cached AI Knowledge Layer built by a background synchronization engine.

---

## 1. Data Pipeline & Layered Architecture

```
+-------------------------------------------------------------------------+
|                        Primary EMR Data Tier                            |
| (Patients, Medical Records, Appointments, Prescriptions, Attachments)   |
+-------------------------------------------------------------------------+
                                    │
                                    ▼
+-------------------------------------------------------------------------+
|                     Knowledge Builder Engine                            |
|    - Incremental Indexing  - Change Listener  - Sanitizer/Redactor      |
+-------------------------------------------------------------------------+
                                    │
                                    ▼
+-------------------------------------------------------------------------+
|                      Local AI Knowledge Index                           |
|       (SQLite FTS5 / Decoupled Data Store: `ai_knowledge_index`)        |
+-------------------------------------------------------------------------+
                                    │
                                    ▼
+-------------------------------------------------------------------------+
|                        AI Context Retriever                             |
|       - RBAC Scoping Gate  - Keyword/Vector Filter  - Ranking           |
+-------------------------------------------------------------------------+
                                    │
                                    ▼
+-------------------------------------------------------------------------+
|                       Local LLM Prompt Builder                          |
|         - Token Budget Enforcement  - Integrity Metadata Header         |
+-------------------------------------------------------------------------+
                                    │
                                    ▼
+-------------------------------------------------------------------------+
|                      Local AI Inference Runtime                         |
|                 (GGUF via llama.cpp / ONNX Engine)                      |
+-------------------------------------------------------------------------+
```

---

## 2. Collections & Data Schemas

### Collection 1: `ai_knowledge_index`
Stores pre-processed, searchable text snippets and metadata extracted from authorized clinic entities.

```typescript
export interface IAIKnowledgeIndexDocument {
  _id: string                     // BSON ObjectId string
  knowledgeId: string            // Unique key (knw_YYYYMM_XXXXX)
  tenantId: string               // Multi-tenant key
  clinicId: string               // Clinic branch key
  patientId?: string             // Reference to patient document (if patient-scoped)
  
  // Entity Classification
  entityType: 'PATIENT' | 'MEDICAL_RECORD' | 'APPOINTMENT' | 'PRESCRIPTION' | 'ATTACHMENT' | 'REPORT'
  entityId: string               // Primary key of source record in origin collection
  title: string                  // Human-readable search title

  // Search Engine Fields
  searchableText: string         // Tokenized, sanitized full-text string for FTS5 lookup
  metadata: {                    // Structured JSON key-value attributes
    patientName?: string
    mrn?: string
    phone?: string
    diagnosisCode?: string
    medicationNames?: string[]
    categoryName?: string
    dateRecorded?: Date
    [key: string]: unknown
  }

  // Permission & Versioning
  permissionScope: 'DOCTOR' | 'NURSE' | 'RECEPTIONIST' | 'ADMIN'
  version: number                // Incremental version tracking
  isDeleted: boolean             // Soft delete mirror flag
  updatedAt: Date
  createdAt: Date
}
```

---

### Collection 2: `ai_sessions`
Manages ephemeral, local-only conversation session states. Memory is cleared automatically when the session terminates.

```typescript
export interface IAISessionDocument {
  _id: string                     // BSON ObjectId string
  sessionId: string              // Unique session ID (ais_XXXXX)
  tenantId: string               // Multi-tenant key
  clinicId: string               // Clinic branch key
  userId: string                 // User ID of clinician
  userRole: string               // Role scope at session creation

  // Session Timestamps
  startedAt: Date
  endedAt?: Date
  status: 'ACTIVE' | 'CLOSED' | 'EXPIRED'

  // Ephemeral State (Cleared on close)
  contextState?: {
    activePatientId?: string     // Currently focused patient profile
    activeModule?: string        // Active UI view
    turnCount: number            // Interaction counter
  }
}
```

---

### Collection 3: `ai_query_history`
Stores an immutable audit trail of every query submitted to the local AI assistant.

```typescript
export interface IAIQueryHistoryDocument {
  _id: string                     // BSON ObjectId string
  queryId: string                // Unique Query ID (aiq_YYYYMM_XXXXX)
  sessionId: string              // Pointer to ai_sessions
  tenantId: string               // Multi-tenant key
  clinicId: string               // Clinic branch key
  userId: string                 // User ID of clinician

  // Query Execution Metadata
  query: string                  // Original raw query text
  queryHash: string              // SHA-256 hash of query (for tamper auditing)
  intentCategory: string         // Detected intent (SEARCH_PATIENT, SOAP_FORMAT, etc.)
  
  // Performance & Retrieval Metrics
  responseTimeMs: number         // Query execution time in milliseconds
  confidenceScore: number        // AI confidence score (0.00 to 1.00)
  dataSources: Array<{           // Array of data records retrieved to build prompt
    entityType: string
    entityId: string
    title: string
  }>

  createdAt: Date
}
```

---

### Collection 4: `ai_index_metadata`
Tracks the health, sync status, and performance of the local knowledge index.

```typescript
export interface IAIIndexMetadataDocument {
  _id: string                     // BSON ObjectId string
  tenantId: string               // Multi-tenant key
  clinicId: string               // Clinic branch key
  
  // Build Status
  version: number                // Current index schema version
  lastFullBuildAt: Date          // Timestamp of last full rebuild
  lastIncrementalUpdateAt: Date   // Timestamp of last delta update
  totalIndexedRecords: number    // Count of indexed documents
  
  // Health & Integrity Flags
  isCorrupted: boolean           // True if FTS5 checksum fails
  buildDurationMs: number        // Last build execution time
  status: 'HEALTHY' | 'BUILDING' | 'CORRUPTED' | 'DEGRADED'
  updatedAt: Date
}
```

---

## 3. Database Indexes & Search Strategy

### Covered Indexes Matrix
```javascript
// Compound index for multi-tenant entity lookup
db.ai_knowledge_index.createIndex(
  { tenantId: 1, clinicId: 1, entityType: 1, entityId: 1 },
  { name: "idx_ai_knowledge_entity_lookup" }
);

// Compound index for patient-scoped knowledge retrieval with RBAC scope
db.ai_knowledge_index.createIndex(
  { tenantId: 1, clinicId: 1, patientId: 1, permissionScope: 1, isDeleted: 1 },
  { name: "idx_ai_knowledge_patient_rbac" }
);

// Query history lookup for user session audit
db.ai_query_history.createIndex(
  { tenantId: 1, clinicId: 1, userId: 1, createdAt: -1 },
  { name: "idx_ai_query_history_audit" }
);
```

---

## 4. Knowledge Builder & Incremental Sync Engine

The **Knowledge Builder** monitors primary database change streams and updates `ai_knowledge_index`:

1. **Initial Full Build**: Runs on system setup or index rebuild. Iterates through active EMR documents and populates `ai_knowledge_index`.
2. **Incremental Delta Sync**: Listens to write events (Insert, Update, Soft Delete) across Patients, Medical Records, Appointments, Prescriptions, and Attachments collections.
3. **Redaction & Sanitization Gate**: Drops all credentials, JWT tokens, system secrets, and internal storage paths prior to writing to `ai_knowledge_index`.
4. **Soft-Delete Propagation**: When an EMR document is soft-deleted (`status: "SOFT_DELETED"`), the Knowledge Builder sets `isDeleted: true` on corresponding indexed records.

---

## 5. Security & Multi-Tenant Permission Inheritance

Every index entry inherits strict multi-tenant and RBAC constraints:

```
Tenant Isolation Key (tenantId)
        │
        ▼
Clinic Branch Key (clinicId)
        │
        ▼
User Role Scope (permissionScope)
        │
        ▼
Patient Ownership & Patient ID Masking (patientId)
```

> [!IMPORTANT]
> **Platform Owner Isolation Mandate**:
> Platform Administrators (`SUPER_ADMIN`) are explicitly excluded from `permissionScope`. The query retrieval engine filters out 100% of records if `user.role === 'SUPER_ADMIN'`.

---

## 6. Performance Targets & Resource Allocation

- **Index Build Throughput**: Fast background indexing (> 5,000 records/sec).
- **RAM Footprint**: Under **500 MB** for index cache.
- **Search Retrieval Latency**: Under **200 ms** for compound text & metadata queries.
- **Index Corruption Recovery**: Automatic detection via checksum check; background rebuild in under 10 seconds for 100,000 records.

---

## 7. Future V2 RAG & Vector Architecture (Reserved)

1. **SQLite Vector Extension (sqlite-vss / vec0)**: Reserved schema fields for 384-dimensional dense vector embeddings (`vectorEmbedding: Float32Array`).
2. **Local Embedding Models**: Support for lightweight local embedding models (e.g., `all-MiniLM-L6-v2` ONNX).
3. **Local OCR Text Store**: Extension of `ai_knowledge_index` to index raw OCR text extracted from scanned attachments.

---

## 8. Verification & Approval Gate

- [x] Decoupled AI Knowledge Layer Architecture Designed
- [x] 4 MongoDB BSON Collections Specified (`ai_knowledge_index`, `ai_sessions`, `ai_query_history`, `ai_index_metadata`)
- [x] Covered Compound Indexes Defined
- [x] Knowledge Builder & Incremental Sync Engine Documented
- [x] Multi-Tenant RBAC Permission Inheritance Verified
- [x] Platform Owner Privacy Barrier Enforcement Confirmed
- [x] No Database Schema Conflicts Found
