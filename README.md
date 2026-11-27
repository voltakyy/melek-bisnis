# Melek Bisnis dari Nol

Panduan belajar bisnis, keuangan dasar, membaca laporan keuangan, hingga pengantar *value investing* berbasis web statis (HTML5, CSS modern, dan Vanilla JavaScript) tanpa *build step* maupun dependensi eksternal. Seluruh psikologi keuangan pada kurikulum ini diintegrasikan dengan rujukan halaman dari buku *The Psychology of Money* karya Morgan Housel (terjemahan Bahasa Indonesia oleh M. Raflie Pratama).

**Situs Langsung (GitHub Pages):** https://voltakyy.github.io/melek-bisnis/

## Struktur Kurikulum 5 Fase

| Modul | Halaman | Materi Inti & Alat Praktik | Rujukan Bab PDF |
| :--- | :--- | :--- | :--- |
| Gerbang Utama | `index.html` | Peta alur 5 fase, pelacak progres lintas halaman (`localStorage`) | Gambaran menyeluruh |
| Fase 1 | `fase-1.html` | Masalah vs ide produk, 4 peran ekonomi, simulator uji ide usaha, kuis 3 soal | Pendahuluan, Bab 1 sampai Bab 3 |
| Fase 2 | `fase-2.html` | Omzet, HPP/COGS, margin, BEP, *Profit vs Cash Flow*, kalkulator BEP & simulator arus kas | Bab 5, Bab 9, Bab 10 |
| Fase 3 | `fase-3.html` | Validasi MVP & Pre-Order, *Sales Funnel*, CAC vs LTV, *Compounding*, *Tails You Win*, 2 simulator | Bab 4, Bab 6, Bab 17, Bab 18 |
| Fase 4 | `fase-4.html` | Laba Rugi, Arus Kas, Neraca, Current Ratio, DER, ROE, meja audit neraca (3 skenario) | Bab 11, Bab 13, Bab 14 |
| Fase 5 | `fase-5.html` | *Economic Moat*, Harga vs Nilai Intrinsik, *Margin of Safety*, jembatan ke *The Intelligent Investor* & *Security Analysis* | Bab 7, 8, 12, 15, 16, 19, 20, & Postscript |
| Referensi | `kamus-pdf.html` | Pencarian lintas tab: 35 istilah bisnis dasar, indeks lengkap 22 bagian PDF, perbandingan 4 buku, & dekoder terjemahan PDF | Keseluruhan PDF (hal. 11 sampai 235) |

## Menjalankan Secara Lokal

1. Klon repositori atau unduh berkas.
2. Klik dua kali `index.html` langsung di browser (`file://`), **atau** jalankan server statis lokal:

```bash
python -m http.server 8080
```

Lalu buka `http://localhost:8080/`.

## Desain Sistem & Aksesibilitas

Seluruh aturan tipografi, tata letak 1 kolom lapang bebas *clutter*, komponen infografik *DOs & DON'Ts*, bentuk kapsul & *bento grid*, rasio kontras WCAG AA dua tema (*Crisp Gallery Light* & *Cozy Obsidian Dark*), serta panduan perawatan didokumentasikan di [`DESIGN.md`](DESIGN.md) dan [`.impeccable/design.json`](.impeccable/design.json).
