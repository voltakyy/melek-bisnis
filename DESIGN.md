---
name: melek-bisnis
version: 2.0.0
description: Studio Paper & Cozy Dark Desk design system ("Ruang Visual Pemvis" paper aesthetic + HTML+CSS Hybrid Diagrams) for the static multi-page Melek Bisnis curriculum.
generatedBy: impeccable-document
source: scan
---

# DESIGN.md: Melek Bisnis Curriculum Design System

## 1. Visual Identity & Design Thesis
Melek Bisnis memperlakukan literasi bisnis pemula dan psikologi uang sebagai buku catatan studio kertas (*Studio Paper*) dan meja kerja interaktif yang tenang, akrab, dan tahan uji keterbacaan di ponsel maupun monitor lebar. Terinspirasi dari estetika studio kertas **Pemvis (Ruang Visual)**, antarmuka memadukan latar kertas krem berpetak titik (*dot-grid*), bayangan tinta solid ringan (`2px` hingga `3px`), batas putus-putus (*dashed ledger dividers*), ilustrasi Polaroid selotip, serta **diagram hibrida HTML+CSS** (seluruh label teks dan angka tinggal di dalam kotak Grid/Flex HTML agar membungkus rapi di layar kecil tanpa pernah terpotong di dalam SVG).

## 2. Color System & Verified WCAG AA Contrast
Sistem mendukung dua polaritas (`color-scheme: light dark`) dengan deteksi `prefers-color-scheme`, skrip pencegah FOUC sinkron di `<head>`, serta tombol alih tema (`[data-theme="light"]` dan `[data-theme="dark"]`) yang tersimpan di `localStorage`.

| Token | Studio Paper (Light) | Studio Desk (Dark) | Peran |
| :--- | :--- | :--- | :--- |
| `--bg-page` | `#F6F0E4` | `#161412` | Kanvas utama kertas hangat / meja malam |
| `--bg-surface` | `#FFFDF7` | `#211E1A` | Panel kartu, pelat diagram, meja simulator |
| `--bg-subtle` | `#EFE5D1` | `#2B2621` | Latar tajuk tabel, kontrol sekunder |
| `--text-primary` | `#24221F` | `#F4EDE0` | Judul, paragraf inti, angka utama |
| `--text-secondary` | `#575148` | `#C5BEB2` | Teks pendukung, keterangan gambar, sub-label |
| `--titanium` | `#7A540E` | `#F2C464` | Label indeks skema, catatan halaman PDF |
| `--titanium-tint` | `#FDF2D4` | `#2C2517` | Kotak rujukan mustard, selotip Polaroid |
| `--mustard` | `#F2B544` | `#F2C464` | Aksen kutipan buku & batas penekanan |
| `--accent` / `--pos` | `#1B6356` | `#5ED0BA` | Tautan, fokus, progres positif, laba sehat |
| `--accent-soft` / `--pos-soft` | `#E5F2EE` | `#182D29` | Sorotan latar sehat & TOC aktif |
| `--neg` / `--neg-soft` | `#B43A1C` / `#FBE8E1` | `#FF8A6B` / `#2E1A15` | Arus kas negatif, beban HPP, koreksi |
| `--info` / `--info-soft` | `#1A567A` / `#E8F1F5` | `#7DC2E8` / `#172834` | Node ekuitas, parit *Economic Moat*, rujukan netral |

Seluruh pasangan teks dan latar pada Studio Paper maupun Studio Desk telah terverifikasi memenuhi WCAG AA (`>= 4.98:1` hingga `15.78:1`).

## 3. Typography & Hierarchies
- **Display & UI (`--font-sans`):** `"Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif`
- **Kutipan Buku (`--font-serif`):** `Georgia, "Iowan Old Style", Cambria, serif`
- **Rumus, Kode Skema & Angka (`--font-mono`):** `ui-monospace, "Cascadia Code", Consolas, monospace`
- **Skala & Kenyamanan Baca:** `--measure: 68ch`, `line-height: 1.65`, `scrollbar-gutter: stable` agar pergantian halaman dan panel tidak memicu pergeseran tata letak (`CLS <= 0.01`).
- **Disiplin Angka:** `.num`, `output`, dan `table` wajib menggunakan `font-variant-numeric: tabular-nums` agar kolom Rupiah dan pembacaan slider stabil tanpa getaran horizontal.

## 4. Layout Architecture & Hybrid Diagrams
- **Header Bebas CLS (`68rem` CSS-First):** Tata letak navigasi atas langsung stabil sejak render CSS pertama melalui `@media (min-width: 68rem)` serta `min-block-size: 4.25rem; contain: layout style;` sambil tetap menyesuaikan lebar dinamis melalui `ResizeObserver` di `app.js`.
- **Rel Dokumentasi (`.doc-layout`):** Satu kolom penuh di ponsel; membelah di `66rem` menjadi rel daftar isi sticky `16rem` (`.doc-rail`) dan kolom bacaan utama.
- **Diagram Hibrida HTML+CSS (`.hybrid-flow`, `.hybrid-node`, `.funnel-grid`, `.live-split-wrap`):** Memisahkan ilustrasi vektor murni (`<svg>` dengan `aspect-ratio`, `width`, `height`, dan `padding: 0.85rem` di `.diagram-plate`) dari teks penjelasan di kotak HTML/Grid responsif agar nol kejadian tulisan keluar garis (`text overflow`) baik di ponsel `390px` maupun desktop `1440px`.

## 5. Surfaces, Radii & Elevation
- **Gaya Tinta Kertas Ringan:** Menggunakan batas `1.5px solid var(--border-control)` hingga `2px` pada kartu/pelat, garis putus-putus `1.5px`/`2px dashed var(--border-subtle)` sebagai pemisah sesi, serta bayangan solid terkendali (`--shadow-btn: 2px 2px 0`, `--shadow-panel: 3px 3px 0`, `--shadow-elevated: 3px 3px 0`).
- **Skala Radius:** `--radius-sm: 0.55rem`, `--radius-md: 0.9rem`, `--radius-lg: 1.2rem`, `--radius-pill: 999px`.

## 6. Interactive Components & Schema Modules
- **Simulator Visual Terpadu:** Simulator Fase 2 (cangkir komposisi HPP/OPEX/Laba langsung), Fase 3 (perbandingan bar dini vs terlambat), dan Fase 4 (neraca proporsional Ekuitas vs Liabilitas) membarui meter visual HTML berbarengan dengan angka tabel secara langsung (`aria-live="polite"`).
- **Galeri Skema Fase (`.schema-gallery` & `.schema-card`):** Kartu navigasi interaktif antar-fase di `index.html` menggunakan pola tautan tunggal aksesibel (`a.card-link::after` dan `:has(...)`) disertai diagram mini per fase.
- **Data Terstruktur & Offline-Ready:** Setiap halaman dilengkapi `schema.org` JSON-LD (`LearningResource`, `Course`, `DefinedTermSet`), navigasi lintas tab `hidden="until-found"` pada `kamus-pdf.html`, dan dukungan buka langsung via `file://` tanpa dependensi eksternal.

## 7. Implementation Do's and Don'ts
- **Do** gunakan komponen `.hybrid-flow` / `.funnel-grid` untuk skema berisi teks panjang atau angka Rupiah alih-alih teks panjang di dalam `<rect>` SVG.
- **Do** pertahankan `padding >= 12px` di dalam kotak berbingkai (`.diagram-plate > svg`, `.polaroid > svg`, `.site-menu`, `.table-wrapper`, `.accordion-group details`).
- **Don't** tambahkan *em dash* (`—`), *en dash* (`–`), aksen garis samping (`border-inline-start` tebal ala *side-tab*), pill dekoratif di atas `h1`, atau skrip CDN eksternal yang memutus mode `file://`.
