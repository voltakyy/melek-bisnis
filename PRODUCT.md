# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS/JS multi-halaman (terpisah per fase belajar)

## Users

Mahasiswa Indonesia yang baru mulai dari nol soal bisnis dan keuangan ("buta bisnis"), belum mengenal istilah dasar seperti cash flow, HPP, margin, BEP, atau laporan keuangan, namun ingin memahami cara kerja bisnis secara menyeluruh sebagai bekal membangun usaha maupun membaca perusahaan untuk investasi.

## Product Purpose

Menyajikan kurikulum belajar bisnis dan psikologi uang yang sistematis, panjang, dan mudah dicerna dari level nol hingga pemahaman investasi nilai dasar, memadukan penjelasan bisnis praktis dengan kisah, pelajaran, dan istilah dari PDF The Psychology of Money (Morgan Housel) yang dirapikan agar bebas dari kejanggalan terjemahan literal.

## Positioning

Setiap konsep bisnis yang abstrak selalu dipasangkan dengan:
1. Analogi usaha kecil mahasiswa (kopi susu, katering kos, jasa desain),
2. Rumus dan simulasi angka interaktif yang bisa dicoba langsung,
3. Kisah nyata dan halaman rujukan dari PDF The Psychology of Money (seperti Ronald Read vs Richard Fuscone, Bill Gates & Kent Evans, Walt Disney, Amazon, Warren Buffett vs Jim Simons, Benjamin Graham & Margin of Safety).

## Operating Context

Dibuka langsung sebagai dokumen web statis multi-halaman di browser desktop maupun ponsel (`index.html` sebagai gerbang utama, lalu `fase-1.html` hingga `fase-5.html` serta halaman rujukan `kamus-pdf.html`), tanpa server atau build step.

## Capabilities and Constraints

- Arsitektur multi-halaman statis murni (HTML5 semantik, CSS modern, vanilla JS) agar ringan dan bebas ketergantungan jaringan eksternal.
- Materi mendalam per fase dengan ilustrasi diagram SVG konseptual (dibuat khusus untuk menjelaskan mekanisme bisnis, bukan dekorasi).
- Simulator interaktif per fase: Kalkulator HPP/Margin/BEP, Simulator Profit vs Cash Flow, Kalkulator Compounding (Buffett vs Simons), Simulator Ekor Panjang (Tails You Win), serta Latihan Refleksi/Kuis dengan umpan balik instan.
- Mode tampilan Terang (Titanium Light) dan Gelap (Space Black Titanium) yang mengikuti preferensi sistem dan dapat diubah manual tanpa FOUC.

## Brand Commitments

- Estetika minimalis presisi terinspirasi bahasa produk Apple Pro Max (Titanium Slate, Space Black, kertas terang bersih, hierarki tipografi tajam, bebas dekorasi AI slop).
- Bahasa Indonesia lugas, mengalir, tanpa istilah terjemahan literal yang membingungkan dari PDF sumber (menjelaskan padanan aslinya seperti "Tails, You Win", "Sunk Cost", "Margin of Safety", "Flippers").

## Evidence on Hand

- Seluruh materi psikologi uang, contoh tokoh, tahun, dan halaman rujukan bersumber dari PDF terjemahan The Psychology of Money (Morgan Housel) yang diberikan pengguna (Pendahuluan, Bab 1 sampai Bab 20, dan Postscript).
- Tidak menampilkan testimoni fiktif, klaim statistik pengguna buatan, atau angka keuangan yang tidak berasal dari contoh simulasi transparan maupun PDF sumber.

## Product Principles

1. **Konkret sebelum abstrak**: Setiap istilah teknis (cash flow, HPP, neraca) harus muncul bersama contoh angka nyata dan ilustrasi diagram sebelum rumus formalnya.
2. **Satu kesatuan dengan PDF sumber**: Setiap fase bisnis selalu mengikat kembali pelajaran perilaku dari The Psychology of Money agar pembaca tidak hanya hafal rumus, tetapi tahan menghadapi emosi dan risiko nyata.
3. **Kejelasan dokumen di atas hiasan**: Karena ini permukaan baca dan belajar jangka panjang, keterbacaan kolom teks (65–75 karakter per baris), kontras tinggi, dan navigasi antar-fase lebih utama daripada efek visual mencolok.
4. **Interaktivitas yang bermakna**: Setiap tombol, tab, akordion, dan simulator harus berfungsi penuh dan membantu menguji pemahaman konsep secara langsung.
