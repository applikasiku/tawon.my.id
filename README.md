# TAWON.MY.ID

Portal berita Indonesia dengan identitas visual kuning, hitam, dan putih.

## Status saat ini

Tahap **V2 — homepage dan halaman artikel terhubung ke Supabase**:
- Halaman depan responsif dan PWA.
- Beranda mengambil artikel berstatus `published` dari Supabase REST API.
- Kategori navigasi diambil dari database.
- Pencarian sisi-klien untuk artikel yang sudah dimuat.
- Halaman detail `artikel.html?slug=...` memuat artikel berdasarkan slug.
- Metadata dasar, canonical, Open Graph title, dan structured data NewsArticle pada halaman detail.
- Service worker diperbarui untuk halaman detail artikel.
- Database Supabase memakai RLS pada seluruh tabel aplikasi.

## Database

Supabase project ref: `ajqwpbpaozlurqoxysjt`

Tabel:
- `profiles`
- `categories`
- `articles`
- `tags`
- `article_tags`
- `article_views`
- `site_settings`

Frontend memakai Supabase project URL dan publishable/anon key. Publishable key memang dirancang untuk penggunaan klien, tetapi keamanan tetap bergantung pada RLS dan kebijakan database. **Jangan pernah memasukkan service-role key, database password, atau secret API ke frontend.**

## File utama

- `index.html` — beranda yang mengambil artikel dan kategori dari Supabase.
- `artikel.html` — detail artikel berdasarkan slug.
- `manifest.webmanifest` — metadata PWA.
- `sw.js` — service worker/cache shell.
- `assets/tawon-logo.svg` — logo SVG.
- `robots.txt` dan `sitemap.xml` — berkas crawler awal.

## Batasan yang masih ada

- Dashboard CMS/login admin belum dibuat.
- Belum ada alur aman untuk membuat akun admin dan mengatur role pertama.
- Upload media belum terhubung ke Cloudflare R2/Supabase Storage.
- Sitemap masih statis dan belum memuat URL artikel baru.
- Halaman artikel memakai query-string slug; untuk SEO terbaik sebaiknya gunakan route URL bersih/server-rendered.
- Penghitungan views belum dihubungkan dari frontend.
- Konten akan kosong sampai artikel terbit ditambahkan ke database.
- Belum ada konfirmasi deployment/live domain setelah commit GitHub.

## Deployment dan verifikasi

Pastikan hosting mengarah ke repository ini, HTTPS aktif, dan domain `tawon.my.id` sudah terhubung. Setelah deploy, uji beranda, REST API publik, halaman artikel, cache service worker, dan sitemap. Pengindeksan Google/Google News maupun persetujuan AdSense tidak dapat dijamin hanya dengan metadata.
