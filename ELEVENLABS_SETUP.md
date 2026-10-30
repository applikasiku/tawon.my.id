# Audio berita ElevenLabs
Endpoint server: POST /api/audio dengan JSON slug artikel. Teks selalu diambil dari artikel terbit di Supabase, bukan teks bebas dari pengunjung. Pemutar tidak memakai speechSynthesis perangkat.

## Aktivasi
Di Cloudflare, buka Worker tawon-my-id → Settings → Variables and Secrets. Tambahkan tipe Secret:
- ELEVENLABS_API_KEY: API key ElevenLabs dengan izin text-to-speech dan batas penggunaan sesuai akun.
- ELEVENLABS_VOICE_ID: Voice ID dari suara perempuan asli bahasa Indonesia yang lembut/tenang, tersedia dan berizin untuk akun tersebut.

Pilih dan dengarkan sampel di Voice Library menggunakan filter Indonesian, Female, narasi tenang. Jangan menganggap nama sebuah suara menjamin aksen Indonesia. Integrasi belum dapat menghasilkan audio sebelum kedua secret tersedia. Jangan menaruh API key di GitHub, HTML, atau percakapan publik.

Konfigurasi permintaan: eleven_flash_v2_5, language_code id, kecepatan 0,94, stability 0,65. Model dipilih karena mendukung Indonesia dan teks panjang. Timbre mengikuti suara yang dipilih, bukan dijamin hanya dari pengaturan stability.

## Operasi
- Hanya teks artikel yang sudah terbit dapat dikonversi; batas 35.000 karakter.
- Cache berbasis hash teks, voice, dan model selama 24 jam pada lokasi Cloudflare; perubahan isi menghasilkan audio baru.
- Pembatas permintaan dan pembuatan audio memakai binding Cloudflare; bukan batas anggaran global. Cache juga bukan penyimpanan MP3 permanen lintas semua lokasi. Atur batas penggunaan di akun ElevenLabs sebelum aktivasi publik.
- Secret kosong menghasilkan status 503 yang jelas, bukan audio palsu atau fallback suara perangkat.
- Pengujian tanpa API key hanya memverifikasi routing, penanganan kegagalan, validasi, cache, dan UI. Kualitas suara perlu diuji setelah aktivasi.
