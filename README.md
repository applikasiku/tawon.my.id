# TAWON.MY.ID

Portal berita Indonesia dengan identitas visual kuning, hitam, dan putih.

## Status saat ini

Tahap **V1 — fondasi frontend**:
- Halaman depan responsif untuk ponsel dan desktop.
- Navigasi kategori dan pencarian sisi-klien untuk konten contoh.
- Metadata SEO dasar, canonical URL, Open Graph.
- `robots.txt` dan sitemap awal.
- Web App Manifest, ikon SVG, dan service worker untuk cache dasar/offline shell.

## File utama

- `index.html` — halaman depan statis prototipe.
- `manifest.webmanifest` — metadata PWA.
- `sw.js` — service worker/cache shell.
- `assets/tawon-logo.svg` — logo lebah SVG.
- `robots.txt` — arahan crawler dan tautan sitemap.
- `sitemap.xml` — sitemap awal; perlu diperbarui saat halaman/artikel dinamis ditambahkan.

## Penting

Kartu berita yang saat ini tampil adalah **konten contoh**, bukan laporan berita aktual. Jangan gunakan sebagai publikasi berita nyata tanpa menggantinya dengan artikel yang diverifikasi redaksi.

PWA dan sitemap baru akan bekerja penuh setelah website di-deploy dengan HTTPS di domain yang benar. Pengindeksan Google/Google News tidak dapat dijamin hanya dengan menambahkan metadata.

## Tahap berikutnya

1. Hubungkan atau pilih project Supabase khusus TAWON.MY.ID untuk database dan autentikasi admin.
2. Buat skema artikel, kategori, penulis, status publikasi, dan Row Level Security (RLS).
3. Bangun dashboard admin dan editor artikel.
4. Tambahkan API publikasi aman dengan secret server-side; jangan pernah menaruh service-role key atau token rahasia di frontend.
5. Buat halaman artikel dinamis, sitemap dinamis, structured data NewsArticle, dan alur deployment.

## Deployment

Pilih target deployment (misalnya Cloudflare Pages/Workers atau GitHub Pages) dan pastikan DNS domain `tawon.my.id`, HTTPS, dan konfigurasi build sesuai target tersebut.
