---
name: melek-bisnis
version: 4.2.0
description: Crisp White Gallery, Deep Slate (#162133), & Emerald Consulting Infographic System (7 modular green infographic boards: stepped 4-pillar watermarks, timeline spine rail, curved 4-leaf petal clusters, serpentine 6-step roadmaps, orbital stadium medallions, horizontal action strips, and 3-tier stepped pyramids) for Melek Bisnis.
generatedBy: impeccable-document
source: scan
---

# DESIGN.md: Melek Bisnis Curriculum Design System

## 1. Visual Identity & Design Thesis
Melek Bisnis memadukan kejelasan **halaman satu kolom lapang** (`--container-max: 60rem`, ukuran paragraf dibatasi `--measure: 64ch` agar nyaman dibaca), **ritme kontras blok Slate-Navy (`#162133`)** berisi kartu terang terstruktur, **perbandingan `✓ DO` vs `× DON'T`**, serta **skema visual lintas fase** (*Hero Triad*, *Asymmetric Mosaic*, *Journey Dual Split*, *Concentric Rings* SVG, dan *Orbit Ring*). Cerita panjang dari *The Psychology of Money* dirapikan ke dalam `.accordion-group details`.

## 2. Color System & Verified WCAG AA Contrast
Dua polaritas penuh (`color-scheme: light dark`) dengan deteksi `prefers-color-scheme`, pencegahan FOUC sinkron di `<head>`, dan tombol alih tema (`[data-theme="light"]` / `[data-theme="dark"]`). Seluruh tautan CSS/JS memakai query cache-busting `?v=`.

| Token | Crisp Light | Cozy Obsidian Dark | Peran |
| :--- | :--- | :--- | :--- |
| `--bg-page` | `#FFFFFF` | `#101114` | Kanvas baca utama bersih |
| `--bg-surface` | `#F4F5F7` | `#181A1F` | Pita kontras, panel kartu, pelat diagram |
| `--bg-subtle` | `#EAECEF` | `#22252C` | Bento tile, kapsul lembut, latar tajuk |
| `--slab-bg` / `--slab-ink` | `#162133` / `#FFFFFF` | `#1A2333` / `#F3F4F6` | Pita aksi Quick Finder, Contrast Slab, CTA Banner |
| `--slab-card-bg` / `--slab-card-ink` | `#FFFFFF` / `#141418` | `#11151E` / `#F3F4F6` | Kartu isi di dalam `.contrast-slab` & preview CTA |
| `--text-primary` | `#141418` | `#F3F4F6` | Judul utama, angka, teks pokok |
| `--text-secondary` | `#4B4E57` | `#B4B8C4` | Teks pendukung, deskripsi skema |
| `--cta-bg` / `--cta-ink` | `#F5B82E` / `#141418` | `#F5B82E` / `#101114` | Tombol aksi utama (*standout CTA*) |
| `--neg` / `--neg-soft` | `#C8281E` / `#FDF0EF` | `#FF7A70` / `#2B1414` | Aksen judul, tanda `× DON'T`, beban/rugi |
| `--pos` / `--pos-soft` | `#136D3E` / `#ECF8F1` | `#4ADE80` / `#10291B` | Tanda `✓ DO`, laba sehat, aman |
| `--accent` / `--accent-soft` | `#184FC4` / `#EDF3FE` | `#7AAFFF` / `#15253E` | Tautan, cincin fokus, informasi |
| `--titanium` / `--titanium-tint` | `#7D5200` / `#FEF7E6` | `#F6C453` / `#292111` | Kutipan & rujukan halaman PDF |

## 3. Unified Modular Structure Architecture (All Phases)
- **Zero-CLS Header & Progress Guard:** Tinggi header terkunci `4.25rem`, lebar `.theme-toggle` stabil, `.skip-link` hanya tampil saat `:focus`/`:focus-visible`, dan teks awal `#progress-summary` sinkron dengan output JS (`CLS <= 0.01`).
- **Komponen Struktur Lintas Halaman:**
  - `.hero-triad` + `.metric-stack`: Hero 3 kolom dengan diagram berlabel gelap & metrik riil kurikulum (`index.html`).
  - `.finder-strip`: Bar pencarian & lompat cepat berlatar `--slab-bg` (`index.html`, `fase-1` sampai `fase-5`, `kamus-pdf.html` dengan `?q=` auto-filter).
  - `.asymmetric-mosaic`: Mosaik 2 kartu potret + 2 kartu melebar dengan `.dark-pill-bar`.
  - `.contrast-slab` + `.slab-grid-4`: Wadah gelap membungkus 4 kartu konsep di `index.html`, `fase-1`, `fase-3`, `fase-4`, dan `fase-5`.
  - `.journey-split`: Perbandingan 2 skenario utama mengapit metrik tengah di `index.html`, `fase-1`, `fase-2`, `fase-3`, dan `fase-5`.
  - `.ring-split` (`fase-2` SVG cincin konsentris) & `.orbit-split` (`fase-4` siklus 3 laporan).
  - `.dept-tabs`: Filter kategori garis bawah satu baris pada `index.html` dengan navigasi keyboard panah.
  - `.cta-dark-banner`: Penutup halaman dan pengontrol `#phase-complete-btn` di seluruh fase.
  - `.do-dont-board` & `.capsule-grid`: Perbandingan visual dan kapsul tahapan per fase.
  - `.trio-contrast` (`.tone-white`, `.tone-amber`, `.tone-slate`): Grid tiga kartu kontras putih, emas `#F5B82E`, dan slate `#162133`.
  - `.bracket-grid` + `.bracket-card`: Kartu sudut L-bracket asimetris untuk poin alasan dan sinyal bahaya.
  - `.oval-spotlight`: Tata letak 3 kolom (langkah bernomor + bingkai SVG oval tengah + statistik bertumpuk).
  - `.dark-card-band` + `.dark-tile` & `.dark-bridge-wrap` + `.bridge-cards-4`: Kartu gelap elevasi `#1E2C44` di atas latar `#162133` serta jembatan 4 kartu menyembul.
  - `.process-chain`, `.worked-pair`, & `.check-matrix`: Alur siklus berurutan, contoh perhitungan berdampingan, dan checklist audit bernomor.
  - `.info-sheet` (Sistem Infografik Zamrud 7 Pola): `.pillar-4` (*4-Pillar Stepped Watermark Cards*), `.spine-grid` (*Left KPI Rail + Horizontal Chevron Timeline*), `.petal-grid` (*4-Leaf Asymmetrical Quadrant Cluster*), `.serp-grid` (*Serpentine 6-Step Roadmap + KPI Rail*), `.medallion-board` (*Orbital Stadium Ring + 4 Circular Medallions*), `.strip-grid` (*Horizontal Tonal Strips + Pill Tags*), dan `.pyramid-grid` (*Stepped 3-Tier Pyramid SVG + Core Badges*).
