# Module-017 — Offline AI Medical Assistant UI/UX Design

## Executive Summary

The **Offline AI Medical Assistant UI/UX Specification** defines the visual design system, component inventory, wireframe layouts, accessibility standards, state catalogs, and human-AI interaction patterns for Module-017.

The interface is designed as an **Intelligent Medical Co-Pilot Workspace**—not a generic consumer chatbot. It provides healthcare professionals with instant, context-aware productivity tools while maintaining total transparency, evidence traceability, Zero Emojis policy, and strict adherence to the ClinicOS Design DNA.

---

## 1. Information Architecture & Layout Structure

The AI Assistant is accessible via two primary interface modes:
1. **Full Workspace View**: Dedicated side-by-side workspace inside the EMR layout (`/ai-assistant`).
2. **Command Bar Overlay (`Ctrl + K` / `Cmd + K`)**: Modal command launcher floating over any active screen for instant natural language navigation and queries.

```
+-----------------------------------------------------------------------------------+
|                            ClinicOS Top Header & Search Bar                       |
+------------------------------------+----------------------------------------------+
| AI Left Navigation Sidebar         | Main Conversation & Query Workspace          |
|                                    |                                              |
|  +------------------------------+  |  +----------------------------------------+  |
|  | New Session  [Plus]          |  |  | AI Status Bar (Ready | Model: Local)   |  |
|  +------------------------------+  |  +----------------------------------------+  |
|  | Quick Command Shortcuts:     |  |                                              |  |
|  |  • Open Patient [User]       |  |  [Conversation Feed]                         |  |
|  |  • Summarize [FileText]      |  |   ┌──────────────────────────────────────┐   |  |
|  |  • Appointments [Calendar]   |  |   │ Doctor: "Summarize Ahmed Ali"        │   |  |
|  |  • Reports [BarChart]        |  |   └──────────────────────────────────────┘   |  |
|  +------------------------------+  |   ┌──────────────────────────────────────┐   |  |
|  | Session History:             |  |   │ AI Response Card                     │   |  |
|  |  • Ahmed Ali Summary (10:15) |  |   │ Confidence: HIGH (98%)               │   |  |
|  |  • Revenue Today (09:30)    |  |   │ Sources: [Record #1029] [Lab #101]   │   |  |
|  +------------------------------+  |   └──────────────────────────────────────┘   |  |
|                                    |  +----------------------------------------+  |
|                                    |  | Suggested Actions: [Open Profile] [Rx] |  |
|                                    |  +----------------------------------------+  |
|                                    |  | Query Input Textarea & Send [Send]     |  |
+------------------------------------+----------------------------------------------+
```

---

## 2. 10 Reusable UI Component Specifications

### 1. `AICommandBarOverlay`
- **Purpose**: Floating launcher opened via `Ctrl+K` for instant command execution.
- **Visual Elements**: Glassmorphism backdrop blur (`backdrop-blur-md`), search input with `Sparkles` icon, live command completion list, keyboard shortcut hints (`ESC` to close).

### 2. `AIStatusBar`
- **Purpose**: Display real-time AI engine health, local model state, and active user context.
- **Visual Elements**: Green status dot (`bg-emerald-500`), Model indicator (`"Local Model: GGUF Ready"`), Index sync badge (`"Index Sync: 100%"`), `Shield` icon for offline isolation.

### 3. `AIConversationFeed`
- **Purpose**: Render chronological stream of clinician queries and AI responses.
- **Visual Elements**: Doctor query bubble (`bg-slate-100 dark:bg-slate-800`), AI response card (`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800`).

### 4. `AIConfidenceBadge`
- **Purpose**: Display explicit confidence metrics on every AI output.
- **Visual Elements**:
  - `HIGH`: Emerald pill badge (`bg-emerald-100 text-emerald-800`, `CheckCircle2` icon).
  - `MODERATE`: Amber pill badge (`bg-amber-100 text-amber-800`, `AlertTriangle` icon).
  - `LOW`: Rose pill badge (`bg-rose-100 text-rose-800`, `HelpCircle` icon).

### 5. `AISourceReferencePills`
- **Purpose**: Clickable deep-link badges referencing exact data records used in response.
- **Visual Elements**: Interactive chip (`bg-blue-50 text-blue-700 hover:bg-blue-100`), `ExternalLink` icon, tooltips with document title.

### 6. `AISuggestedActionsBar`
- **Purpose**: Render contextual post-response action chips.
- **Visual Elements**: Horizontal scroll container, action chips (`"Open Profile"`, `"View Prescriptions"`, `"View Timeline"`), `ArrowRight` suffix icon.

### 7. `AIQuickCommandsGrid`
- **Purpose**: Predefined prompt buttons reducing typing effort.
- **Visual Elements**: 2-column or 3-column button grid with Lucide icons (`UserSearch`, `FileText`, `Calendar`, `TrendingUp`).

### 8. `AIContextPanel`
- **Purpose**: Sidebar panel displaying currently focused patient, appointment, and module context.
- **Visual Elements**: Active Patient Card (Avatar, Name, MRN), Active Module Pill, Applied RBAC Role Scope (`"Scope: Doctor"`).

### 9. `AISessionHistorySidebar`
- **Purpose**: Manage local ephemeral chat sessions.
- **Visual Elements**: `"New Session"` button (`Plus` icon), pinned queries, clear history button (`Trash2` icon).

### 10. `AISafetyDisclaimerBanner`
- **Purpose**: Permanent notice reinforcing clinician responsibility and zero auto-diagnosis.
- **Visual Elements**: Subdued text banner (`text-slate-500 text-xs`), `"AI Assistant provides decision support only. Physician retains 100% clinical authority."`

---

## 3. Comprehensive State Catalog

### Empty States
- **No Active Session**: Render centered illustration with Lucide `Sparkles` icon, title `"Offline AI Assistant Ready"`, and 4 quick command suggestion cards.
- **No Search Results**: Render `SearchX` icon, title `"No Local Records Found"`, and advice *"Verify patient name, phone, or MRN."*

### Loading States
- **Model Loading**: Progress spinner with text `"Initializing Local AI Runtime (60%)..."`
- **Query Processing**: Shimmer skeleton animation over response card with text `"Searching local EMR index..."`

### Error States
- **Model Binary Missing**: Alert banner (`bg-amber-50 border-amber-200`) with `"Local AI model package missing. Click to download offline weights."`
- **Permission Denied**: Alert banner (`bg-rose-50 border-rose-200`) with `"Access Restricted: Action exceeds your role scope."`

---

## 4. Accessibility & Design System Standards

- **WCAG 2.1 AA Compliance**: High-contrast text ratio (> 4.5:1), ARIA live regions (`aria-live="polite"`) for real-time AI responses.
- **Keyboard Traps & Shortcuts**: Full keyboard control (`Ctrl+K` to open, `ESC` to dismiss, `Tab` focus ring).
- **Lucide Icons Only**: Strict adherence to Lucide SVG icons (`Sparkles`, `Shield`, `CheckCircle2`, `ExternalLink`).
- **Zero Emojis Policy**: 0% emoji usage in all UI components, buttons, and status messages.

---

## 5. Reserved Future UI Extensions (V2 Roadmap)

1. **Voice Dictation Bar**: Microphone pulse animation & real-time speech waveform display.
2. **Local OCR Lightbox Preview**: Side-by-side image preview with highlighted OCR bounding boxes.
3. **Local Vector RAG Graph**: Interactive visual graph displaying retrieved document chunks and relevance scores.

---

## 6. Verification & Approval Gate

- [x] Information Architecture & 2 UI Modes Documented
- [x] 10 Reusable UI Components Specified
- [x] Confidence Badge & Clickable Source References Designed
- [x] State Catalog (Empty, Loading, Error States) Defined
- [x] WCAG 2.1 AA & Zero Emojis Policy Enforced
- [x] No UI/UX Conflicts Found
