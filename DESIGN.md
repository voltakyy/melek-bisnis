---
name: melek-bisnis
version: 1.0.0
description: Titanium Editorial & Financial Workbench design system for the static multi-page Melek Bisnis curriculum.
generatedBy: impeccable-document
source: scan
---

# DESIGN.md: Melek Bisnis Curriculum Design System

## 1. Visual Identity & Design Thesis
Melek Bisnis treats introductory business literacy and behavioral finance as an engineered reference manual and financial workbench rather than a decorative SaaS landing page. Inspired by Apple Titanium hardware restraint, the interface pairs calm paper surfaces, hairline rules, and strict tabular typography with custom schematic SVG plates and live numeric calculators. Decorative gradients, pill eyebrows above headings, floating badges, and emoji clutter are intentionally absent so long-form Indonesian study remains fast, crisp, and legible from mobile phones to widescreen monitors.

## 2. Color System & Verified WCAG AA Contrast
The palette supports dual polarity (`color-scheme: light dark`) using automatic `prefers-color-scheme` resolution, inline `localStorage` FOUC prevention, and CSS `light-dark()` with explicit `[data-theme="light"]` and `[data-theme="dark"]` attribute overrides.

| Token | Light Mode | Dark Mode | Role |
| :--- | :--- | :--- | :--- |
| `--bg-page` | `#F5F5F7` | `#0A0A0C` | Primary reading ground |
| `--bg-surface` | `#FFFFFF` | `#141416` | Elevated panels, diagrams, workbenches |
| `--bg-subtle` | `#E8E8ED` | `#1D1D20` | Table headers, secondary button fill |
| `--text-primary` | `#1D1D1F` | `#F5F5F7` | Headings, prose, high-emphasis values |
| `--text-secondary` | `#515154` | `#B8B8C0` | Supporting text, captions, definitions |
| `--titanium` | `#755936` | `#D4B48C` | Desert Titanium structural accents & PDF tags |
| `--titanium-tint` | `#F3EDE4` | `#1E1B16` | Editorial callouts & neutral diagnostic banners |
| `--accent` | `#0066CC` | `#4DA3FF` | Links, focus rings, sliders, active controls |
| `--accent-hover` | `#004FA3` | `#74B8FF` | Hover state on links & primary buttons |
| `--pos` / `--pos-soft` | `#186F38` / `#E8F5ED` | `#4CD97B` / `#11291B` | Positive margins, healthy ratios, correct answers |
| `--neg` / `--neg-soft` | `#B8251E` / `#FCECEB` | `#FF7A72` / `#2D1413` | Negative cash flow, insolvency risk, errors |

All body text, control borders, hover states, and tinted banner pairings were verified via `contrast-check.py` to meet or exceed WCAG AA (minimum 4.52:1 to 18.17:1 across tested light and dark pairings).

## 3. Typography & Hierarchies
- **Display & UI (`--font-sans`):** `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", system-ui, sans-serif`
- **Book Quotes (`--font-serif`):** `"New York", "Iowan Old Style", Georgia, serif`
- **Equations & Financial Readouts (`--font-mono`):** `ui-monospace, "SF Mono", Consolas, monospace`
- **Modular Fluid Scale:**
  - `h1`: `clamp(2rem, 1.4rem + 2.4vw, 3.25rem)`, tight leading `1.08`, tracking `-0.03em`.
  - `h2`: `clamp(1.5rem, 1.2rem + 1.1vw, 2.05rem)`, generous section margin above `2.75rem`.
  - `body`: `clamp(1rem, 0.96rem + 0.18vw, 1.0625rem)`, leading `1.65`, line width constrained to `--measure: 68ch`.
- **Numeric Discipline:** `.num`, `output`, and `table` enforce `font-variant-numeric: tabular-nums` so Rupiah columns and real-time calculator readouts never jitter horizontally as sliders move.

## 4. Layout Architecture & Responsive Breakpoints
- **Container Ceiling:** `--container-max: 76rem` centered with fluid inline gutter `clamp(1rem, 3vw, 2rem)`.
- **Navigation Adaptation (`initNavbar`):** Measures brand + nav links dynamically on a single line; switches smoothly between a horizontal inline menu and a native `[popover="auto"]` drawer on narrow viewports with zero two-line wrapping.
- **Documentation Rail (`.doc-layout`):** Single-column reading flow on mobile; expands at `66rem` (`1056px`) into a `15.5rem` sticky Table of Contents rail plus flexible reading column, synchronized by native `:target-current` / `IntersectionObserver` scrollspy.
- **Responsive Content Breakpoints:** `44rem` (glossary search bar), `48rem` (4-column syllabus ledger), `50rem` (2-column simulator workbench), `54rem` (1.55fr / 0.95fr split-reading prose + PDF callout), and `@container (width < 580px)` for `.responsive-table` vertical card stacking.

## 5. Surfaces, Radii & Elevation
- **Flat-First Depth:** Primary contrast relies on subtle 1px hairlines (`--border-subtle`) and controlled step shifts (`--bg-page` to `--bg-surface`), reserving shadows (`--shadow-panel`, `--shadow-elevated`) strictly for workbenches, diagram plates, and the open navigation popover.
- **Radii Scale:** `--radius-sm: 0.5rem` (buttons, inputs, banners), `--radius-md: 0.875rem` (callouts, tables, TOC rail), `--radius-lg: 1.25rem` (workbenches, diagram plates, quizzes), `--radius-pill: 999px` (slider track).

## 6. Interactive Components & Native Patterns
- **Theme Switcher:** Two-state toggle (`Sistem (Terang/Gelap)` -> manual opposite override -> revert to system) synced across tabs via `storage` events.
- **Range Controls & Sliders:** Native `<input type="range">` styled via `--control-value` linear gradient fill paired with `44px` (`2.75rem`) +/- stepper buttons for accessible fine-tuning.
- **Calculators & Quizzes:** Zero-reload vanilla JS workbenches (`aria-live="polite"` readouts) and multi-question phase quizzes with inline contextual feedback.
- **Accessible Tabs & Hidden-Until-Found Search:** ARIA `role="tablist"` with roving `tabindex`, keyboard arrow/Home/End navigation, and `hidden="until-found"` panels (padding/borders strictly applied to inner `.tab-panel-inner` wrapper) paired with native `<search>` cross-tab counting and instant filter jump banners.
- **Progress Persistence:** Client-side completion tracking (`melek_bisnis_progress_v1`) linking individual phase pages back to the central `index.html` ledger.

## 7. Motion & Accessibility Rules
- **Scroll Progress:** Driven natively by CSS `animation-timeline: scroll(root block)` with a `requestAnimationFrame` scaleX fallback where unsupported.
- **Reduced Motion:** `prefers-reduced-motion: reduce` switches `scroll-behavior` to `auto` and disables scroll/chevron animations.
- **Touch & Focus:** All buttons, inputs, tabs, `<summary>` toggles, and links enforce `min-block-size: 2.75rem` (`44px`), visible `2.5px solid var(--accent)` `:focus-visible` outlines, and `@media (forced-colors: active)` border/indicator support.
- **SVG Illustrations:** Every diagram carries explicit `width`, `height`, `role="img"`, `<title>`, and `<desc>`, painted strictly via semantic CSS tokens for dual-theme legibility.

## 8. Implementation Do's and Don'ts
- **Do** use shared semantic CSS tokens (`--bg-surface`, `--titanium`, `--accent`) across both HTML UI and inline SVGs.
- **Do** preserve `padding >= 12px` inside bordered containers (`.table-wrapper`, `.accordion-group details`) and explicit `.skip-link:hover` foreground/background pairings.
- **Don't** add em dashes, decorative emojis, ungrounded claims, external CDN scripts, or ES modules that break offline `file://` viewing.
- **Don't** place heading tags inside `<summary>` elements or override `[hidden="until-found"]` with `display: none`.
