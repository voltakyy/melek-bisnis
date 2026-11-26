---
name: melek-bisnis
version: 3.0.0
description: Crisp White Gallery & Modular Bento Editorial design system (no left sidebar, alternating surface bands, DOs & DON'Ts infographics, collapsible PDF story drawers) for Melek Bisnis.
generatedBy: impeccable-document
source: scan
---

# DESIGN.md: Melek Bisnis Curriculum Design System

## 1. Visual Identity & Design Thesis
Melek Bisnis memadukan kejelasan **halaman 1 kolom lapang bebas *clutter***, **perbandingan infografik `✓ DO` vs `× DON'T`**, dan **bentuk modular lembut** (*bead rail*, *stadium pill capsules*, *staggered offset cards*, dan *asymmetric bento mosaic*). Cerita panjang dari *The Psychology of Money* tetap lengkap 22 bagian tetapi terlipat rapi di dalam `.accordion-group details`, sehingga halaman langsung menyorot inti pelajaran dan skema visual.

## 2. Color System & Verified WCAG AA Contrast
Dua polaritas penuh (`color-scheme: light dark`) dengan deteksi `prefers-color-scheme`, pencegahan FOUC sinkron di `<head>`, dan tombol alih tema (`[data-theme="light"]` / `[data-theme="dark"]`).

| Token | Crisp Light | Cozy Obsidian Dark | Peran |
| :--- | :--- | :--- | :--- |
| `--bg-page` | `#FFFFFF` | `#101114` | Kanvas baca utama ultra bersih |
| `--bg-surface` | `#F4F5F7` | `#181A1F` | Pita kontras, panel kartu, pelat diagram |
| `--bg-subtle` | `#EAECEF` | `#22252C` | Bento tile, kapsul lembut, latar tajuk |
| `--text-primary` | `#141418` | `#F3F4F6` | Judul utama, angka, teks pokok |
| `--text-secondary` | `#4B4E57` | `#B4B8C4` | Teks pendukung, deskripsi skema |
| `--cta-bg` / `--cta-ink` | `#F5B82E` / `#141418` | `#F5B82E` / `#101114` | Tombol aksi utama (*standout CTA*) |
| `--neg` / `--neg-soft` | `#C8281E` / `#FDF0EF` | `#FF7A70` / `#2B1414` | Aksen judul, tanda `× DON'T`, beban/rugi |
| `--pos` / `--pos-soft` | `#136D3E` / `#ECF8F1` | `#4ADE80` / `#10291B` | Tanda `✓ DO`, laba sehat, aman |
| `--accent` / `--accent-soft` | `#184FC4` / `#EDF3FE` | `#7AAFFF` / `#15253E` | Tautan, cincin fokus, informasi |
| `--titanium` / `--titanium-tint` | `#7D5200` / `#FEF7E6` | `#F6C453` / `#292111` | Kutipan & rujukan halaman PDF |

Seluruh kombinasi teks dan latar memenuhi WCAG AA (`>= 4.70:1` hingga `18.37:1`).

## 3. Modular Grid Shapes & Layout Structure
- **Tanpa Sidebar Kiri:** Seluruh halaman berpusat pada kolom tunggal `max-inline-size: 60rem` dengan paragraf terbatas `--measure: 64ch`. Navigasi bagian dalam fase memakai strip lompat tipis (`.section-jumps`).
- **Pita Permukaan Bergantian (`.band` & `.band-surface` / `.band-muted`):** Mengalihkan kontras secara bersih di beranda tanpa membebani layar dengan kotak batas bertumpuk.
- **5 Komponen Bentuk Visual:**
  - `.bead-rail`: 5 simpul lingkaran (`01` sampai `05`) di bawah Hero.
  - `.capsule-grid` & `.capsule-pill`: 4 kapsul stadion (`border-radius: 999px`) untuk tahapan alur belajar, kas, dan urutan 4 buku.
  - `.stagger-pair`: Dua blok bento berundak dengan penunjuk arah (`<<<` / `>>>`).
  - `.bento-mosaic`: Komposisi 1 kartu tinggi di kiri + 2 kotak mini & ringkasan di kanan.
  - `.do-dont-board`: Tabel perbandingan 2 kolom bersebelahan dengan ikon vektor mini `72x52`.
