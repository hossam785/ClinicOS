# Module-020: Enterprise Localization UI/UX Design Specification

## 1. Executive Summary & Design Vision

The **Enterprise Localization UI/UX Design Specification** defines the visual design system, interaction patterns, typography hierarchy, and bidirectional layout behaviors for Module-020 (**Enterprise Localization System**). 

The design vision ensures that **Arabic (`ar`, RTL)** and **English (`en`, LTR)** offer a 100% first-class, symmetrical user experience. Neither language feels secondary or adapted as an afterthought. Switching languages occurs instantly in-place without page refresh, web layout flickering, or form state loss.

---

## 2. Global Language Switcher Component Specification

The Language Switcher is a ubiquitous navigation control positioned in the application top header bar across all workspaces (Desktop Client, Platform Control Panel, and Online Booking Portal).

### 2.1 Component Blueprint & Layout
```
+-----------------------------------------------------------------------+
|  [Globe SVG]  العربية  [ChevronDown SVG]                             |
+-----------------------------------------------------------------------+
|  Dropdown Menu:                                                       |
|  -------------------------------------------------------------------  |
|  (*) العربية (Arabic)             [RTL Preview] [Check SVG]           |
|  ( ) English                      [LTR Preview]                       |
+-----------------------------------------------------------------------+
```

### 2.2 Interactive Attributes & States
1. **Default State**: Displays the native name of the active language (`العربية` or `English`) accompanied by a Lucide `Globe` icon.
2. **Hover & Focus**: Subtle background highlight (`bg-slate-800/60` dark mode, `bg-slate-100` light mode) with crisp border outline (`border-slate-700`).
3. **Keyboard Shortcut Trigger**: Pressing `Ctrl + Shift + L` instantly opens the dropdown selector.
4. **Active Selection**: Displays a subtle Lucide `Check` icon next to the active language option.

---

## 3. Hot Runtime Switching UX & State Preservation

When a user switches language via the Language Switcher:

1. **Zero Page Reload**: The browser window does not refresh; active WebSockets and desktop Tauri IPC channels remain open.
2. **Form State Retention**: Entered text in active input fields (e.g., patient registration draft) is preserved without loss.
3. **Scroll Position Retention**: The viewport scroll offset is maintained seamlessly.
4. **Modal Window Retention**: Currently open modal dialogs or slide-over drawers remain open, updating their internal text nodes and direction in-place.

---

## 4. Typography & Font System Alignment

To prevent visual layout shifts when toggling between Arabic and English, font line heights, font weights, and vertical metrics are calibrated across both languages.

| Attribute | Arabic (`ar`, RTL) | English (`en`, LTR) | Calibrated Ratio |
| :--- | :--- | :--- | :--- |
| **Primary Font Family** | `Cairo`, `Readex Pro`, sans-serif | `Inter`, `Outfit`, sans-serif | Equalized Line Height |
| **Heading Font Size (H1)**| `1.75rem` (`28px`), `font-black` | `1.75rem` (`28px`), `font-black` | 1:1 Scale |
| **Body Text Size** | `0.875rem` (`14px`), `font-medium` | `0.875rem` (`14px`), `font-normal` | Visual Weight Matched |
| **Line Height Ratio** | `1.6` (for Arabic script clarity) | `1.5` (standard LTR) | Unified Container Bounds |

---

## 5. Bidirectional Layout Mirroring Matrix (RTL / LTR)

| UI Component | LTR Layout (English) | RTL Layout (Arabic) |
| :--- | :--- | :--- |
| **App Sidebar** | Fixed to Left Edge | Fixed to Right Edge |
| **Header Profile / Avatar** | Positioned Top Right | Positioned Top Left |
| **Data Table Alignment** | Headers & Cells Left-Aligned | Headers & Cells Right-Aligned |
| **Table Action Buttons** | Fixed to Rightmost Column | Fixed to Leftmost Column |
| **Form Labels & Inputs** | Labels Top-Left, Text Left-Aligned | Labels Top-Right, Text Right-Aligned |
| **Modal Action Buttons** | Primary Right, Secondary Left | Primary Left, Secondary Right |
| **Breadcrumbs** | `Home > Patients > Profile` | `الرئيسية < المرضى < الملف الشخصي` |
| **Directional Icons** | `ChevronRight` points Right | `ChevronRight` flips to point Left |

---

## 6. Localized Form Controls & Input UX

1. **Field Labels**: Displayed at top-start with a mandatory red asterisk (`*`) for required fields (`الاسم بالكامل *` / `Full Name *`).
2. **Placeholders**: Localized guidance text in muted slate (`bg-slate-500/50`) providing sample data formats.
3. **Validation Errors**: Rendered in `rose-500` with inline `AlertCircle` SVG icons directly beneath the input field with text alignment matching the active direction.

---

## 7. Localized Data Tables & Grid UX

1. **Header Columns**: Column labels translate and align to the start edge (`text-align: start`).
2. **Action Dropdowns**: Action dropdown menus anchor to the opposite edge to prevent viewport overflow.
3. **Pagination Summary**: Renders localized count strings (e.g., `عرض ١-١٠ من ٥٠ مريض` / `Showing 1-10 of 50 Patients`).
4. **Empty State Guidance**: Displays localized zero-data illustrations with clear primary action buttons (`إضافة مريض جديد` / `Add New Patient`).

---

## 8. Localized Dialogs & Modal Windows

```
+-----------------------------------------------------------------------+
|  [ShieldCheck SVG]  حذف سجل المريض              [X SVG Close]       |
+-----------------------------------------------------------------------+
|  هل أنت تأكد من رغبتك في حذف هذا السجل؟ لا يمكن التراجع عن هذا الإجراء.  |
|                                                                       |
|  +---------------------------+   +---------------------------------+  |
|  |  حذف السجل (Primary Danger) |   |  إلغاء (Secondary Cancel)       |  |
|  +---------------------------+   +---------------------------------+  |
+-----------------------------------------------------------------------+
```

1. **Action Placement in RTL**: In Arabic (RTL), the primary destructive action is placed on the **left**, and the cancel button is placed on the **right**, matching natural RTL scanning direction.

---

## 9. Offline AI Assistant Multilingual UI/UX

1. **User Message Bubbles**: Arabic prompts align to the right with blue accent badges; English prompts align to the left.
2. **AI Response Cards**: Structured Markdown responses render with appropriate text direction and embedded code blocks remaining LTR.
3. **Prompt Suggestion Pills**: Displays dual-language quick prompt chips (`تحليل التفاعلات الدوائية` / `Analyze Drug Interactions`).

---

## 10. Public Online Booking Portal Localized Experience

1. **Patient Language Toggle**: Fixed top-bar selector allowing patients to switch between Arabic and English at any step.
2. **Localized Calendar**: Displays days of the week (`الأحد`, `الإثنين`, ...) and localized month titles.
3. **Confirmation Screen**: Renders print-friendly localized booking summary with QR code verification.

---

## 11. Accessibility (WCAG 2.1 AA) Specification

1. **Screen Reader Live Region**: Language switches update `aria-live="polite"` to announce `"Language switched to Arabic"` / `"تم تغيير اللغة إلى العربية"`.
2. **Keyboard Trapping Protection**: Modal windows maintain focus trapping regardless of text direction.
3. **Color Contrast**: Maintained at 4.5:1 minimum ratio across dark slate (`bg-slate-950`) and light slate (`bg-slate-50`) backgrounds.

---

## 12. Verification & UI/UX Design Compliance

- [x] Global Language Switcher component designed with Lucide SVG iconography.
- [x] Zero-page-reload hot runtime language switching specified.
- [x] Typography system calibrated for Cairo/Readex Pro (Arabic) and Inter/Outfit (English).
- [x] RTL/LTR bidirectional mirroring matrix established across all 19 modules.
- [x] Forms, tables, modal dialogs, and toast notifications localized.
- [x] Multilingual Offline AI Assistant conversation UI designed.
- [x] Public Online Booking Portal localized booking flow completed.
- [x] WCAG 2.1 AA accessibility guidelines enforced.
- [x] Zero Emojis policy strictly maintained.
