# ClinicOS Animation & Motion Standards

**Version:** 1.0  
**Status:** Official Single Source of Truth  
**Target:** Motion Architecture, Micro-Interactions, Performance & Accessibility  

---

## Executive Summary

This document defines the official Motion and Animation Standards for the entire ClinicOS platform. Motion in ClinicOS exists to improve usability, provide immediate state feedback, guide focal attention, and smooth spatial transitions. Because ClinicOS is an enterprise SaaS medical software, motion must feel calm, fast, intentional, and unobtrusive.

Unnecessary, slow, or purely decorative animations are strictly prohibited.

---

## Table of Contents

1. [Governance & Motion Philosophy](#governance--motion-philosophy)
2. [Standardized Timing & Easing Scale](#standardized-timing--easing-scale)
3. [Component & Interaction Motion Specifications](#component--interaction-motion-specifications)
   - [Page & Route Transitions](#page--route-transitions)
   - [Modal, Dialog & Drawer Animations](#modal-dialog--drawer-animations)
   - [Sidebar & Navigation Transitions](#sidebar--navigation-transitions)
   - [Dropdown, Tooltip & Popover Animations](#dropdown-tooltip--popover-animations)
   - [Toast Notifications & Inline Alerts](#toast-notifications--inline-alerts)
   - [Button, Card & Interactive Feedback](#button-card--interactive-feedback)
   - [Accordion, Expansion & Tab Motion](#accordion-expansion--tab-motion)
   - [Loading, Skeleton & State Animations](#loading-skeleton--state-animations)
4. [Accessibility & Reduced Motion Standards](#accessibility--reduced-motion-standards)
5. [GPU Performance & Rendering Optimization](#gpu-performance--rendering-optimization)
6. [Motion Anti-Patterns & Common Mistakes](#motion-anti-patterns--common-mistakes)

---

## Governance & Motion Philosophy

Motion in ClinicOS is governed by three foundational rules:
1. **Speed & Purpose:** Motion must clarify state change in real-time. Action feedback occurs within `150ms`; structural transitions execute within `250ms`.
2. **GPU Acceleration:** Only composite CSS properties (`transform`, `opacity`) may be animated. Animating geometry layout properties (`width`, `height`, `margin`, `top`) is strictly forbidden to prevent browser repaint layout thrashing.
3. **Reduced Motion First:** All motion respects user OS preferences via `@media (prefers-reduced-motion: reduce)`.

---

## Standardized Timing & Easing Scale

ClinicOS standardizes two global transition timing tokens mapped in `src/design-system/styles/tokens.css`:

| Token Name | Duration | Easing Function | Primary Application |
| :--- | :--- | :--- | :--- |
| `--transition-fast` | `150ms` | `cubic-bezier(0.4, 0, 0.2, 1)` | Button hovers, focus rings, tooltip fades, badge toggles |
| `--transition-normal` | `250ms` | `cubic-bezier(0.4, 0, 0.2, 1)` | Modals, drawers, dropdown menus, sidebar collapse, tab switches |

---

## Component & Interaction Motion Specifications

### Page & Route Transitions
- **Behavior:** Subtle cross-fade (`opacity: 0` to `opacity: 1`) over `150ms`.
- **Rule:** Page navigation must never trigger disruptive sliding or bouncing transitions.

### Modal, Dialog & Drawer Animations
- **Modal Backdrop:** Fade-in background (`rgba(0,0,0,0.7)`) over `200ms`.
- **Modal Dialog:** Scale up (`scale(0.95)` to `scale(1.0)`) + fade-in (`150ms`).
- **Side Drawer:** Slide-in from viewport edge (`translateX(100%)` to `translateX(0)`) over `250ms ease-out`.

### Sidebar & Navigation Transitions
- **Sidebar Collapse:** Width transition (`260px` to `72px`) over `250ms ease-in-out`.
- **Active Navigation Tab:** Background highlight transition (`150ms ease-out`).

### Dropdown, Tooltip & Popover Animations
- **Dropdown Overlay:** Fade-in + slight vertical slide (`translateY(-4px)` to `translateY(0)`) over `150ms`.
- **Tooltip:** Instant display (`100ms` fade-in, zero delay on hover).

### Toast Notifications & Inline Alerts
- **Toast Entrance:** Slide-in from top/bottom right (`translateY(-8px)` to `translateY(0)`) + fade-in over `200ms`. Auto-dismiss fade-out (`200ms`).

### Button, Card & Interactive Feedback
- **Button Click (Active):** Subdued scale depression (`transform: scale(0.98)`) over `100ms`.
- **Card Hover:** Subtle elevation lift (`transform: translateY(-2px)`, shadow transition) over `150ms`.

### Accordion, Expansion & Tab Motion
- **Accordion Panel:** Height expansion using max-height composite over `200ms`.
- **Tab Content Switch:** Instant content mount with `100ms` opacity fade-in.

### Loading, Skeleton & State Animations
- **Skeleton Loading:** Infinite pulse animation (`opacity: 0.4` to `opacity: 0.8`) over `1.5s ease-in-out`.
- **Spinner Loader:** Continuous 360-degree rotation (`transform: rotate(360deg)`) over `0.8s linear`.

---

## Accessibility & Reduced Motion Standards

All animation stylesheets MUST include the global reduced-motion media query:

```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

When reduced motion is enabled, all slide and scale animations degrade instantly to zero-duration opacity cuts.

---

## GPU Performance & Rendering Optimization

1. **Hardware Acceleration:** Force GPU layer creation using `will-change: transform, opacity` only on heavy interactive elements during transition.
2. **Zero Layout Shifts (CLS):** Never animate `height`, `width`, `padding`, `margin`, or `border-width`.
3. **Repaint Avoidance:** Use `transform: translate3d(x, y, 0)` for hardware composition.

---

## Motion Anti-Patterns & Common Mistakes

1. **Slow Heavy Animations:** Using transition durations exceeding `350ms`, delaying user task completion.
2. **Animating Layout Geometry:** Animating `height` or `width` directly, causing severe FPS drops and browser reflows.
3. **Bouncing Easing Curves:** Applying playful spring or bounce easing (`elastic` / `bounce`) in an enterprise medical application.
