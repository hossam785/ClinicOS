# Module-017 — Offline AI Medical Assistant Requirements Analysis

## Executive Summary

The **Offline AI Medical Assistant Module** is an intelligent, privacy-first, on-device clinical productivity assistant embedded directly within the ClinicOS Desktop Application.

It functions as an advanced digital co-pilot for healthcare professionals, enabling rapid natural language patient discovery, automated clinical summary generation, structured note formatting, prescription history retrieval, and instant navigation—all operating **100% offline** without transmitting a single byte of patient data over the internet.

---

## 1. Core Principles & Privacy Mandates

1. **100% Offline Inference**: All processing, searching, text formatting, and data aggregation execute locally on the doctor's computer.
2. **Zero Cloud API Reliance**: Strictly NO external cloud API calls (No OpenAI API, No Gemini API, No Anthropic, No cloud-hosted LLM endpoints).
3. **Zero Data Egress**: Patient medical data never leaves the clinic workstation. No remote telemetry, no external logging, no cloud sync.
4. **Zero Diagnostic Substitution**: The AI assistant is strictly a productivity tool. It **NEVER diagnoses** patients and **NEVER replaces medical judgment**. The licensed physician remains 100% responsible for every clinical decision.
5. **Read-Only Scoping by Default**: The assistant cannot autonomously mutate data, modify appointments, delete records, or send external notifications without explicit human confirmation.
6. **Strict RBAC & Privacy Barriers**: Respects all multi-tenant isolation rules. Platform Administrators (`SUPER_ADMIN`) have zero access to clinic AI queries or patient data.

---

## 2. Supported AI Capabilities

### 2.1 Natural Language Patient Search
- **Supported Fields**: Patient Name, Primary Phone Number, National ID Code, Medical Record Number (MRN).
- **Natural Language Intent Recognition**:
  - *"Open Ahmed Ali"* ➔ Navigates directly to Ahmed Ali's Master Profile.
  - *"Show today's patients"* ➔ Filters patient roster for today's scheduled appointments.
  - *"Find diabetic patients"* ➔ Queries active medical flags for Diabetes Mellitus.

### 2.2 Medical Record & Timeline Search
- **Searchable Domains**: Diagnoses, clinical progress notes, active/past prescriptions, attachment metadata, visit history logs.
- **Natural Language Queries**:
  - *"Show last blood test for Mona Hassan"*
  - *"Find all patients prescribed Metformin this month"*

### 2.3 Patient Clinical Summary Generator
- **Aggregated Summary Sections**:
  - Chronic Diseases & Active Medical Flags
  - Documented Allergies & Drug Sensitivities
  - Current Active Medications & Dosage
  - Recent Visits Chronology (Last 3 Encounters)
  - Key Clinical Progress Notes & Vitals Trends

### 2.4 Chronological Visit History Summarizer
- Highlights significant medical events, dosage changes, repeated chief complaints, and lab value changes over time in a concise timeline view.

### 2.5 Prescription History Assistant
- Displays past medication regimens and dosage histories.
- Suggests commonly reused prescription bundles based on doctor's historical patterns.
- **Safety Safeguard**: The AI never prescribes medication independently or alters dosages automatically.

### 2.6 Medical Note Structuring & Refinement
- Formats draft clinical notes into standardized SOAP (Subjective, Objective, Assessment, Plan) format.
- Expands medical abbreviations and improves readability without altering medical meaning.

### 2.7 Attachment Metadata Search
- Searches document attachments by category (Lab Result, Radiology, etc.), tags, and file names.
- Prepares indexing hooks for local OCR text extraction.

### 2.8 Dashboard & Reports Query Assistant
- Translates natural language queries into instant dashboard analytics reports:
  - *"Today's appointments"*
  - *"Pending appointments queue"*
  - *"Patients currently in waiting room"*
  - *"Today's clinic revenue summary"*

### 2.9 Intelligent Navigation & Command Bar
- Global keyboard shortcut (`Ctrl + K` or `Cmd + K`) opens instant AI Command Bar to execute navigation commands:
  - *"Go to Billing"* ➔ Navigates to Billing Module.
  - *"New Patient"* ➔ Opens Patient Creation View.

---

## 3. AI Limitations & Safety Rules

> [!CAUTION]
> **Strict AI Operational Boundaries**:
> The Offline AI Assistant is constrained by hardcoded safety rules:
> 1. **No Autonomous Diagnosis**: Will never suggest primary or differential diagnoses without clinician input.
> 2. **No Autonomous Prescribing**: Will never generate or sign digital prescriptions.
> 3. **No Automatic Database Mutations**: Will never modify, overwrite, or delete records silently.
> 4. **No Notification Dispatch**: Will never send SMS, Email, or Webhooks independently.
> 5. **Zero Hallucination Policy**: If data is missing or query is ambiguous, state clearly *"Data not found in local record"*.

### Response Integrity Metadata Header
Every AI output must display an inline verification header:
- **Confidence Level**: `HIGH (98%)` | `MODERATE` | `LOW`
- **Data Sources Used**: e.g., `Patient Record #pat-101`, `Lab Report #att_101`
- **Retrieval Timestamp**: Precise local timestamp of data fetch.

---

## 4. Multi-Tenant RBAC Permission Scoping Matrix

| Role | Access Level | Permitted AI Operations |
| --- | --- | --- |
| **Doctor** | `FULL_CLINICAL_AI` | Full patient search, clinical summary, SOAP formatting, prescription history, attachments search, reports. |
| **Nurse** | `NURSING_AI` | Patient search, vitals summary, visit history view, attachment metadata view. |
| **Receptionist** | `OPERATIONAL_AI` | Patient lookup, appointment queue query, navigation shortcuts, check-in assistance. |
| **Clinic Manager** | `ADMINISTRATIVE_AI` | Revenue reports queries, appointment statistics, operational metrics, category management. |
| **Platform Owner (`SUPER_ADMIN`)** | `BLOCKED` | **0% Access**. Platform admins cannot launch AI sessions or query patient data. |

---

## 5. Local AI Architecture & Inference Engines

The local AI engine runs entirely on client workstation resources:

```
+-----------------------------------------------------------------------+
|                       ClinicOS Desktop Client                         |
|                                                                       |
|  +-----------------------+              +--------------------------+  |
|  | Natural Language UI   | ------------ | Local AI Command Parser  |  |
|  | Command Bar (Ctrl+K)  |              +--------------------------+  |
|  +-----------------------+                            |               |
|              |                                        v               |
|              v                          +--------------------------+  |
|  +-----------------------+              | Local FTS5 / Index Store |  |
|  | Local Inference Engine| <----------->| SQLite Vector Embeddings |  |
|  | (GGUF / ONNX / llama) |              +--------------------------+  |
|  +-----------------------+                            |               |
|              |                                        v               |
|              +------------------------> +--------------------------+  |
|                                         | Local EMR Database &     |  |
|                                         | Storage Files            |  |
|                                         +--------------------------+  |
+-----------------------------------------------------------------------+
```

### Local Engine Candidates (Documented Only)
1. **GGUF Models via `llama.cpp`**: Quantized 4-bit / 8-bit lightweight local models for fast CPU/GPU inference.
2. **ONNX Runtime**: Cross-platform high-performance local execution engine for structured intent parsing.
3. **SQLite FTS5 & Local Vector Search**: Fast full-text search indexing for instant local retrieval.

---

## 6. Audit Logging & System Telemetry

Every interaction with the AI Assistant triggers an immutable local audit log entry:
- **Event Type**: `AI_QUERY_EXECUTED`, `AI_NAVIGATION_TRIGGERED`, `AI_SUMMARY_GENERATED`
- **Actor Details**: User ID, Role, Timestamp
- **Query Hash**: SHA-256 hash of query text (protecting raw text in audit logs)
- **Data Sources Touched**: List of record IDs accessed by the search engine.

---

## 7. Performance Requirements

- **RAM Footprint**: Under **500 MB** RAM usage for base local indexing engine.
- **Cold Startup Time**: Under **2.0 seconds**.
- **Search Response Time**: Under **200 milliseconds** for patient & record lookups.
- **Text Summarization Time**: Under **1.5 seconds** on standard quad-core CPU.

---

## 8. Future Roadmap Extensions (V2 Reserved)

1. **Voice-to-Text Clinical Dictation**: Offline speech-to-text using local Whisper models.
2. **Local Optical Character Recognition (OCR)**: In-browser/on-device text extraction from scanned medical documents.
3. **Local Medical Knowledge Base**: Offline clinical guidelines & drug interaction reference database.
4. **Local Retrieval-Augmented Generation (RAG)**: Full local vector embedding pipeline for complex clinical queries.

---

## 9. Verification & Approval Gate

- [x] Business Requirements Documented
- [x] 100% Offline & Zero Data Egress Mandates Confirmed
- [x] AI Limitations & Safety Rules Defined
- [x] RBAC Permission Matrix Established
- [x] Performance & Memory Constraints Specified
- [x] No Architectural Conflicts Found
