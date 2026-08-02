# Module-020: Enterprise Localization Architecture & Translation Strategy

## 1. Executive Summary & Infrastructure Overview

The **Enterprise Localization Architecture Specification** defines the core technical infrastructure, data structures, caching layers, bidirectional layout engine, and runtime resolution pipeline for Module-020 (**Enterprise Localization System**). 

The system treats localization as an intrinsic, framework-decoupled infrastructure layer. Domain logic, database entities, sync payloads, and API contracts remain strictly language-agnostic. Translation occurs dynamically at the presentation layer, notification service, and report rendering boundaries.

---

## 2. Platform Folder Structure & Module Namespace Design

### 2.1 Frontend Localization Directory Hierarchy (`frontend/src/i18n/`)
```
frontend/src/i18n/
├── config/
│   ├── i18n.config.ts             # i18next Core Configuration & Initialization
│   └── languages.config.ts        # Supported Languages Registry & Metadata
├── locales/
│   ├── ar/                        # Arabic Language Dictionaries
│   │   ├── auth.json
│   │   ├── dashboard.json
│   │   ├── patients.json
│   │   ├── appointments.json
│   │   ├── medicalRecords.json
│   │   ├── prescriptions.json
│   │   ├── reports.json
│   │   ├── notifications.json
│   │   ├── platformControl.json
│   │   ├── syncEngine.json
│   │   ├── bookingPortal.json
│   │   ├── aiAssistant.json
│   │   ├── validation.json
│   │   ├── errors.json
│   │   ├── printing.json
│   │   └── common.json
│   └── en/                        # English Language Dictionaries (Mirror Structure)
│       ├── auth.json
│       ├── ...
│       └── common.json
├── hooks/
│   ├── useTranslation.ts          # Custom Typed Translation Hook Wrapper
│   ├── useLanguage.ts             # Language & RTL/LTR State Hook
│   └── useFormatter.ts            # Centralized Intl Formatting Hook
├── providers/
│   └── LocalizationProvider.tsx   # Top-level React Context & Provider
├── services/
│   ├── languageResolver.ts        # 3-Tier Cascade Preference Resolver
│   ├── cacheManager.ts            # Local Storage & Tauri File Cache Manager
│   └── bidiEngine.ts              # CSS Logical Property & Direction Manager
├── utils/
│   ├── formatters.ts              # Date, Time, Currency & Number Formatters
│   └── keySanitizer.ts            # XSS & Injection Prevention Utility
└── types/
    └── localization.types.ts      # TypeScript Domain Models & Key Enums
```

---

## 3. Namespaced Translation Key Strategy

Translation keys follow a strict dot-notation hierarchical pattern: `<module>.<subdomain>.<actionOrLabel>`. Keys are immutable strings and are never modified when underlying translations change.

### Example Translation Schema (`ar/common.json` & `en/common.json`)
```json
{
  "actions": {
    "save": "حفظ",
    "cancel": "إلغاء",
    "delete": "حذف",
    "edit": "تعديل",
    "confirm": "تأكيد",
    "export_pdf": "تصدير PDF"
  },
  "status": {
    "active": "نشط",
    "pending": "قيد الانتظار",
    "suspended": "معلق",
    "completed": "مكتمل"
  }
}
```

---

## 4. Runtime Resolution & Fallback Pipeline

```
+-------------------------------------------------------------------------------+
|                       RUNTIME RESOLUTION & FALLBACK LOOP                      |
+-------------------------------------------------------------------------------+
|                                                                               |
|   1. Query Target Key: 'patients.create.success'                              |
|   2. Inspect Active Memory Cache (LRU Memory Map)                             |
|      ├── Hit?  ===> RETURN TRANSLATED STRING IMMEDIATELY                      |
|      └── Miss? ===> PROCEED TO DICTIONARY LOOKUP                              |
|                                                                               |
|   3. Query Active Language Dictionary (e.g., 'ar')                            |
|      ├── Found? ===> CACHE IN MEMORY & RETURN STRING                          |
|      └── Missing? ===> FALLBACK TO ENGLISH ('en') DICTIONARY                  |
|                                                                               |
|   4. Query Fallback Language ('en') Dictionary                                |
|      ├── Found? ===> LOG MISSING 'ar' KEY WARNING & RETURN ENGLISH            |
|      └── Missing? ===> RETURN RAW KEY IDENTIFIER ('patients.create.success')  |
|                                                                               |
+-------------------------------------------------------------------------------+
```

---

## 5. Bidirectional Layout Engine (RTL / LTR)

The system utilizes CSS Logical Properties to ensure 100% layout mirroring without duplicating CSS rules or maintaining separate RTL stylesheets.

### CSS Logical Property System Standard
```css
/* Global Direction Variables */
:root[dir="rtl"] {
  --text-direction: rtl;
  --font-family-primary: 'Cairo', 'Readex Pro', sans-serif;
  --transform-direction: -1;
}

:root[dir="ltr"] {
  --text-direction: ltr;
  --font-family-primary: 'Inter', 'Outfit', sans-serif;
  --transform-direction: 1;
}

/* Logical Property Enforcement */
.container {
  margin-inline-start: 1.5rem;
  padding-inline-end: 2rem;
  border-inline-start: 4px solid var(--color-primary-500);
  text-align: start;
}
```

---

## 6. Centralized `Intl` Formatting Service Architecture

All date, time, number, and currency formatting operations pass through the centralized `IntlFormatter` service to ensure cultural accuracy.

```typescript
export class IntlFormatterService {
  private locale: string;

  constructor(locale: string = 'ar-EG') {
    this.locale = locale;
  }

  public formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return new Intl.DateTimeFormat(this.locale, options || defaultOptions).format(d);
  }

  public formatCurrency(amount: number, currency: string = 'EGP'): string {
    return new Intl.NumberFormat(this.locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2
    }).format(amount);
  }

  public formatNumber(value: number): string {
    return new Intl.NumberFormat(this.locale).format(value);
  }
}
```

---

## 7. Multilingual Offline AI Assistant Integration

1. **Context Ingestion**: The AI Assistant receives prompt contexts enriched with the user's active locale header (`Accept-Language: ar`).
2. **Medical Prompt Wrapper**: Internal prompts format system instructions in Arabic while ensuring standardized scientific terms (e.g., *Amoxicillin 500mg*) remain intact.
3. **Structured Response Generation**: AI output parser formats lists, medical guidance, and prescription instructions according to the target language direction.

---

## 8. BiDi PDF & Print Spooling Pipeline

1. **Font Injection**: Web PDF Canvas embeds TTF font binaries (`Cairo-Regular.ttf` & `Cairo-Bold.ttf`).
2. **Unicode Bidirectional Algorithm (UBA)**: Resolves mixed text strings containing Arabic text alongside numeric values or English acronyms (e.g., `تشخيص: Type 2 Diabetes`).
3. **Print Spooling**: Pre-renders HTML/CSS templates using logical inline properties to ensure thermal receipts and A4 invoices print correctly on native Windows desktop devices.

---

## 9. Security & Injection Protection

1. **Sanitization Filter**: All translation JSON resources are sanitized during build time to strip raw HTML tags or executable script strings (`<script>`, `javascript:`).
2. **Interpolation Escaping**: Variables interpolated into translation templates (e.g., `Hello {{name}}`) are sanitized via React DOM escaping to prevent DOM-based XSS injection.

---

## 10. Performance Optimization Guidelines

1. **Lazy-Loaded Modules**: Namespace translation bundles are loaded asynchronously on demand when visiting specific modules (e.g., `prescriptions.json` loads only when navigating to `/dashboard/prescriptions`).
2. **Memory LRU Caching**: Up to 5,000 resolved translation strings are held in a high-speed memory Map to achieve sub-millisecond lookup latency.
3. **Tauri Disk Cache**: Desktop application persists loaded language bundles locally to guarantee 100% offline availability without server calls.

---

## 11. V2 Future Extension Architecture

1. **ICU Pluralization Rules**: Infrastructure reservation for multi-cardinal plural forms (zero, one, two, few, many, other).
2. **Dynamic Overrides Repository**: Database schema reservations for per-tenant translation overrides.
3. **Third-Party Translation Sync**: Webhook receivers reserved for CrowdIn / Phrase translation updates.

---

## 12. Verification & Architectural Compliance

- [x] Folder structure and namespace dictionary layout designed.
- [x] Namespaced dot-notation key strategy defined.
- [x] Runtime resolution, LRU caching, and 4-tier fallback loop specified.
- [x] CSS Logical Properties and bidirectional layout engine architecture completed.
- [x] Centralized `IntlFormatter` service specified.
- [x] Offline AI Assistant multilingual pipeline integrated.
- [x] XSS & translation injection security safeguards established.
- [x] Zero Emojis policy enforced across all specs.
