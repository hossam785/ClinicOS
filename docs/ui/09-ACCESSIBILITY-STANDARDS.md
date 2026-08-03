# ClinicOS Accessibility Standards (A11Y)

**Version:** 1.0  
**Status:** Official Single Source of Truth  
**Target:** WCAG 2.1 AA Compliance, Keyboard Navigation & Screen Reader Compatibility  

---

## Executive Summary

This document defines the official Accessibility Standards (A11Y) for the entire ClinicOS platform. Accessibility in ClinicOS is mandatory. Because ClinicOS is an enterprise SaaS medical platform utilized by diverse healthcare professionals, administrators, and staff, every view, form, table, dialog, and component MUST ensure equal usability, high-contrast visual legibility, keyboard navigation, and screen reader compatibility.

---

## Table of Contents

1. [Governance & Target Compliance Level](#governance--target-compliance-level)
2. [Keyboard Navigation & Focus Management](#keyboard-navigation--focus-management)
3. [Screen Reader & Semantic HTML Standards](#screen-reader--semantic-html-standards)
4. [Accessible Component Guidelines](#accessible-component-guidelines)
   - [Accessible Forms & Inputs](#accessible-forms--inputs)
   - [Accessible Buttons & Icon Controls](#accessible-buttons--icon-controls)
   - [Accessible Tables & Data Grids](#accessible-tables--data-grids)
   - [Accessible Dialogs, Modals & Drawers](#accessible-dialogs-modals--drawers)
   - [Accessible Navigation, Tabs & Menus](#accessible-navigation-tabs--menus)
   - [Accessible Overlays (Tooltips, Popovers, Toasts)](#accessible-overlays-tooltips-popovers-toasts)
5. [Visual Accessibility & Contrast Requirements](#visual-accessibility--contrast-requirements)
6. [Multi-Input & Interaction Accessibility](#multi-input--interaction-accessibility)
7. [Responsive Accessibility Across Breakpoints](#responsive-accessibility-across-breakpoints)
8. [Comprehensive Accessibility Testing Checklist](#comprehensive-accessibility-testing-checklist)

---

## Governance & Target Compliance Level

ClinicOS targets **WCAG 2.1 Level AA** compliance across all web and desktop interfaces.

Every UI refactor must preserve compliance without introducing accessibility regressions. Accessibility is enforced at the design system component level (`src/design-system/components/`) and verified during pull request review.

---

## Keyboard Navigation & Focus Management

### Core Navigation Rules
1. **Logical Tab Sequence:** Keyboard navigation via `Tab` (forward) and `Shift+Tab` (backward) must strictly mirror visual layout reading order (top-to-bottom, left-to-right in LTR / right-to-left in RTL).
2. **Visible Focus Rings:** Every interactive element (`<button>`, `<input>`, `<a>`, `<select>`, `<textarea>`) MUST display an unambiguous focus indicator upon receiving keyboard focus (`outline: 2px solid var(--color-primary)`, `outline-offset: 2px`).
3. **No Keyboard Traps:** Focus must never become trapped inside any component or modal container without a standard keyboard exit route (`Escape` key).
4. **Modal Focus Locking:** Opening a dialog or modal locks focus inside the modal boundary. Closing the modal restores focus to the triggering element.

### Standard Keyboard Shortcuts Matrix

| Key | Context | Standard Expected Behavior |
| :--- | :--- | :--- |
| `Tab` | Global | Move focus to next focusable interactive control |
| `Shift + Tab` | Global | Move focus to previous focusable control |
| `Enter` | Buttons, Links, Form Fields | Trigger primary action or submit form |
| `Space` | Buttons, Checkboxes, Switches | Toggle control state or press button |
| `Escape` | Modals, Drawers, Dropdowns | Close active overlay and restore focus |
| `Arrow Keys` | Dropdown Menus, Tab Strips | Navigate between options or tabs |
| `Ctrl + K` / `Cmd + K` | Global Workspace | Open Platform Command Palette Overlay |

---

## Screen Reader & Semantic HTML Standards

1. **Semantic HTML First:** Use native HTML elements (`<button>`, `<main>`, `<nav>`, `<header>`, `<table>`, `<h1>`-`<h6>`) rather than generic `<div>` or `<span>` click handlers.
2. **ARIA Attributes:**
   - **`aria-label` / `aria-labelledby`:** Mandatory on icon-only buttons (e.g., Close `X`, Edit Pen).
   - **`aria-expanded`:** Mandatory on collapsible accordions and dropdown triggers.
   - **`aria-current="page"`:** Mandatory on active main navigation links.
   - **`aria-live="polite"`:** Used for toast alerts and dynamic search count updates.
3. **Decorative Element Hiding:** Decorative background icons and structural visual dividers must carry `aria-hidden="true"`.

---

## Accessible Component Guidelines

### Accessible Forms & Inputs
- **Explicit Labels:** Every input must be explicitly bound to a `<label htmlFor="fieldId">`.
- **Error Linkage:** Form errors must be linked to inputs using `aria-invalid="true"` and `aria-describedby="fieldId-error"`.
- **Required Fields:** Required fields must carry both a visual asterisk (`*`) and `required` / `aria-required="true"`.

### Accessible Buttons & Icon Controls
- **Touch Target Minimums:** Desktop touch/click targets must measure at least `36px x 36px`; Mobile/Tablet targets must measure at least `44px x 44px`.
- **Disabled State:** Disabled buttons carry `disabled` attribute and `aria-disabled="true"`.

### Accessible Tables & Data Grids
- **Header Structure:** Tables must use `<thead>` with `<th scope="col">` column headers.
- **Row Associations:** Dynamic cells link to headers via proper row placement.

### Accessible Dialogs, Modals & Drawers
- Container carries `role="dialog"`, `aria-modal="true"`, and `aria-labelledby="dialog-title-id"`.

---

## Visual Accessibility & Contrast Requirements

| Element Category | Minimum WCAG Ratio | Standard Reference Colors |
| :--- | :--- | :--- |
| **Normal Text (<18px)** | `4.5:1` | `#0f172a` on `#ffffff` (Light) / `#f8fafc` on `#020617` (Dark) |
| **Large Headings (18px+ Bold)** | `3.0:1` | `#0f172a` on `#f8fafc` |
| **UI Components & Borders** | `3.0:1` | `#334155` border on `#0f172a` |
| **Focus Outline** | `3.0:1` | `#3b82f6` glowing focus ring |

*Note: Status indicators (Success, Warning, Danger) must never rely on color alone; they must pair color hues with explicit text labels or semantic icons.*

---

## Multi-Input & Interaction Accessibility

- **Mouse & Trackpad:** Smooth hover indicators, clear cursor pointers (`cursor: pointer` on interactive elements, `cursor: not-allowed` on disabled states).
- **Assistive Technologies:** Tested and compatible with major screen readers (NVDA, JAWS, VoiceOver).

---

## Responsive Accessibility Across Breakpoints

- At mobile breakpoints (`360px - 480px`), text zoom up to `200%` must not clip content or cause horizontal scroll overflow. Touch targets automatically expand to full width where appropriate.

---

## Comprehensive Accessibility Testing Checklist

Prior to merging any UI refactoring task, perform this verification audit:

- [ ] Can every interactive control be reached and triggered using strictly the `Tab` and `Enter`/`Space` keys?
- [ ] Are visible blue/primary focus rings rendered around inputs and buttons when tabbing?
- [ ] Do all icon-only buttons include descriptive `aria-label` strings?
- [ ] Are all form error messages linked via `aria-describedby`?
- [ ] Does text contrast pass the 4.5:1 ratio requirement?
- [ ] Are modal overlays focus-locked with working `ESC` key dismissal?
- [ ] Are table column headers defined using native `<th>` elements?
- [ ] Does the page remain legible when zoomed to 200% in browser settings?
