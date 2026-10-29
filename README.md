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


## CMS Admin

- Open `/admin.html` on the deployed domain.
- Sign in with Supabase Auth, or create an account. New accounts are assigned the `author` role automatically by a database trigger and cannot self-promote.
- The dashboard includes article drafts/review/publishing, title and slug, excerpt, body, category, comma-separated tags, thumbnail upload (JPG/PNG/WebP/AVIF up to 5 MB), featured flag, SEO title/description, canonical URL, Open Graph image, article list/search/edit, and category/tag creation.
- Thumbnail files use the public Supabase Storage bucket `article-thumbnails`. Only admin/editor roles may upload or replace files; public read access is required for published image URLs.
- Only admin/editor accounts can publish directly. Authors can save drafts and submit for review.
- **Initial administrator setup is intentionally manual and secure:** register an account in the dashboard first, verify the email if Supabase Auth requires it, then promote that specific user to admin in the Supabase SQL editor. Never allow public users to choose their own role.

Example SQL to run only after replacing the email with the exact email address of your own registered account:
```sql
insert into public.profiles (id, display_name, role)
select id, split_part(email, '@', 1), 'admin'
from auth.users
where lower(email) = lower('YOUR-EMAIL@example.com')
on conflict (id) do update set role = 'admin';
```

After changing the role, sign out and sign in again, then reload `/admin.html`. Do not put a Supabase service-role key in the browser.
