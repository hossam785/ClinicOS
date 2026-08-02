# Module-020: Enterprise Localization System Requirements Specification

## 1. Executive Summary & Architectural Overview

The **Enterprise Localization System** (Module-020) provides an enterprise-grade, multi-tenant internationalization (i18n) and localization (L10n) framework for the ClinicOS platform. Localization is designed as an intrinsic infrastructure subsystem—not a simple superficial UI translation layer. Every existing and future platform module operates seamlessly across multiple languages and text directions without modifying core business logic.

The system natively supports **Arabic (`ar`, RTL)** and **English (`en`, LTR)** for Version 1.0, while maintaining a decoupled JSON-based dictionary architecture capable of supporting unlimited future languages (French, German, Spanish, Italian, Turkish) without requiring architectural alterations or code refactoring.

---

## 2. Core Architectural Principles

1. **Strict Decoupling of Business Logic**: Core domain services, database schemas, API contracts, and sync engine payloads operate using standardized immutable key identifiers and ISO data formats (`ISO 8601` UTC timestamps, numeric values in raw standard decimal). Translation occurs strictly at presentation, reporting, and message generation boundaries.
2. **Zero-Downtime Hot Runtime Language Switching**: Users can toggle between Arabic and English instantaneously without application restarts, page reloads, or state loss. All active React context nodes and Tauri native windows re-render dynamically.
3. **Automatic Bidirectional Layout Adaptation (RTL / LTR)**: Changing the active language automatically updates the HTML root `dir` attribute (`dir="rtl"` or `dir="ltr"`), font family variables, flex/grid directional flows, padding/margin logical properties, and iconography alignments.
4. **Hierarchical Cascading Preference Resolution**: Language selection resolves automatically according to a 3-tier cascade:
   $$\text{Resolved Language} = \text{User Preference} \gg \text{Tenant Default} \gg \text{Platform System Default}$$
5. **Fallback & Resiliency Guarantee**: If a translation key is missing in a specific regional dictionary, the framework gracefully falls back to English (`en`), and subsequently renders the raw key identifier (e.g., `common.actions.save`) without throwing runtime exceptions.
6. **Zero Emojis Policy**: All localized UI layouts, alerts, notifications, and PDF documents strictly enforce SVG Lucide iconography and professional typography.

---

## 3. Supported V1 Languages & Text Direction Matrix

| Language | ISO Code | Text Direction | Primary Font Family | Number System | Primary Target Use Case |
| :--- | :---: | :---: | :--- | :--- | :--- |
| **Arabic** | `ar` | **RTL** | Cairo / Readex Pro | Eastern Arabic (١٢٣) / Western (123) | Primary MENA Regional Clinics & Staff |
| **English** | `en` | **LTR** | Inter / Outfit | Western Arabic (123) | International Clinics, Enterprise Admin |

### Reserved V2 Extension Languages
- French (`fr`, LTR)
- German (`de`, LTR)
- Spanish (`es`, LTR)
- Italian (`it`, LTR)
- Turkish (`tr`, LTR)

---

## 4. Comprehensive Localization Scope

Localization applies universally across all 19 platform modules:

```
+-----------------------------------------------------------------------------------+
|                        CLINICOS LOCALIZATION PIPELINE                             |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [ React Frontend UI ] ---->  i18next / React-i18next  ---->  RTL/LTR CSS Engine   |
|  [ Tauri Desktop Native ] ->  Rust i18n Dictionary     ---->  Native Dialogs      |
|  [ Offline AI Assistant ] ->  Multilingual Prompts     ---->  Localized Responses |
|  [ PDF & Print Reports ] -->  React-PDF / HTML Canvas  ---->  BiDI Arabic PDF     |
|  [ Gateway APIs ] --------->  Accept-Language Header   ---->  Localized Error Msgs|
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

1. **Desktop Client (Tauri + React)**: Navigation menus, form fields, action buttons, status indicators, modal dialogs, and native OS notifications.
2. **Platform Control Panel**: SaaS administration tables, subscription tiers, 256-bit license keys, health diagnostics, and audit log event labels.
3. **Online Booking Portal**: Patient-facing booking steps, doctor profiles, availability schedules, SMS/Email appointment confirmations.
4. **Offline AI Assistant**: Prompt interpretation, medical report summaries, clinical decision support responses in Arabic and English.
5. **PDF & Printed Medical Documents**: Prescriptions, invoices, medical records, patient history summaries rendered in proper RTL/LTR layout with embedded Arabic typography.
6. **System Notifications & Alerts**: In-app toast messages, system alerts, push notifications, and validation error messages.

---

## 5. Text Direction & CSS Logical Property Adaptation Strategy

To ensure seamless RTL/LTR layout mirroring without maintaining dual CSS stylesheets, the platform adopts **CSS Logical Properties**:

| Legacy Physical Property | Modern Logical Property (RTL/LTR Responsive) | Behavior in RTL (`ar`) | Behavior in LTR (`en`) |
| :--- | :--- | :--- | :--- |
| `margin-left: 16px` | `margin-inline-start: 16px` | Applies 16px to Right | Applies 16px to Left |
| `padding-right: 24px` | `padding-inline-end: 24px` | Applies 24px to Left | Applies 24px to Right |
| `left: 0` | `inset-inline-start: 0` | Aligns to Right edge | Aligns to Left edge |
| `text-align: left` | `text-align: start` | Text aligns Right | Text aligns Left |

---

## 6. Formatting & Culture Standardization

The system utilizes standard `Intl` APIs for localized formatting:

1. **Date & Time Formatting**:
   - English (`en`): `DD/MM/YYYY` or `MM/DD/YYYY` (e.g., `02/08/2026 08:30 PM`)
   - Arabic (`ar`): `YYYY/MM/DD` or Hijri/Gregorian option (e.g., `٢٠٢٦/٠٨/٠٢ ٠٨:٣٠ م`)
2. **Currency & Financial Numbers**:
   - English: `$1,450.00` / `EGP 1,450.00`
   - Arabic: `١,٤٥٠.٠٠ ج.م` / `EGP 1,450.00`
3. **Phone Numbers & National Identifiers**:
   - Standardized using E.164 format (+201000000000) and formatted with regional grouping.

---

## 7. Multi-Tenant Preference Resolution Flow

```
+---------------------------------------------------------------------------+
|               LANGUAGE PREFERENCE RESOLUTION CASCADE                      |
+---------------------------------------------------------------------------+
|                                                                           |
|   1. Check User Account Profile (`user.preferredLanguage`)                |
|      ├── Found? ===> USE USER PREFERRED LANGUAGE (e.g., 'ar')             |
|      └── Null?  ===> Proceed to Step 2                                    |
|                                                                           |
|   2. Check Tenant Clinic Settings (`tenant.defaultLanguage`)              |
|      ├── Found? ===> USE TENANT DEFAULT LANGUAGE (e.g., 'ar')            |
|      └── Null?  ===> Proceed to Step 3                                    |
|                                                                           |
|   3. Fallback to Global Platform Default                                  |
|      └── ===> USE SYSTEM DEFAULT LANGUAGE ('en')                          |
|                                                                           |
+---------------------------------------------------------------------------+
```

---

## 8. Offline AI Assistant Multilingual Capability

1. **Language Detection**: The AI Assistant detects the input query language automatically.
2. **Context Translation**: Clinical prompt templates are dynamically populated in the target language.
3. **Medical Terminology Consistency**: Medical terminology (ICD-10 codes, drug scientific names) is preserved in English when appropriate to maintain clinical accuracy, accompanied by Arabic translations.

---

## 9. Reporting & PDF Layout Architecture

1. **Embedded Web Fonts**: PDF generation engines embed custom TTF/WOFF2 Arabic fonts (Cairo/Amiri) to prevent character corruption or missing glyphs.
2. **BiDi Layout Engine**: PDF documents process Complex Text Layout (CTL) to handle mixed Arabic and English text blocks (e.g., Arabic diagnosis with English drug names).

---

## 10. Accessibility (WCAG 2.1 AA) Compliance

1. **Screen Reader `lang` Attribute**: The `lang` attribute on the `<html>` tag updates dynamically to `lang="ar"` or `lang="en"` for screen reader inflection.
2. **Focus Order**: Keyboard tab navigation flows right-to-left in RTL mode and left-to-right in LTR mode.
3. **Color Contrast**: Maintained at 4.5:1 minimum ratio for standard text across both light and dark themes.

---

## 11. V2 Future Extension Reservations

1. **Dynamic Translation Overrides**: Ability for clinic administrators to customize translation strings via the UI.
2. **Pluralization Rules**: Advanced ICU syntax support for 6 Arabic plural forms (Zero, One, Two, Few, Many, Other).
3. **Third-Party Translation Provider Integration**: Automated translation sync via CrowdIn/Locize.

---

## 12. Validation & Compliance Checklist

- [x] Multilingual strategy documented for Arabic and English.
- [x] RTL/LTR CSS Logical Property adaptation specification defined.
- [x] Multi-tenant preference resolution hierarchy established.
- [x] Offline AI Assistant localization rules integrated.
- [x] Reporting and PDF character rendering guidelines specified.
- [x] WCAG 2.1 AA RTL accessibility compliance verified.
- [x] Zero Emojis policy enforced.
