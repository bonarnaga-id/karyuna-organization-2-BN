# Karyuna - Sistem Manajemen Organisasi Karang Taruna

Karyuna adalah web app full stack untuk manajemen Karang Taruna dengan antarmuka berbahasa Indonesia, responsif, dan siap dijalankan di atas PostgreSQL/Neon.

> Catatan platform: proyek sandbox ini menggunakan Next.js App Router yang tetap berbasis React + TypeScript + Tailwind CSS. API REST/serverless berada di `src/app/api/*`, database memakai PostgreSQL/Neon + Drizzle ORM.

## Struktur folder

- `src/app` - halaman publik, dashboard, API REST, healthcheck, 404.
- `src/components` - navigasi, widget dukungan, login form, dashboard interaktif.
- `src/db` - koneksi database dan skema Drizzle.
- `src/lib` - konfigurasi terpusat, autentikasi, keamanan, validasi, helper API client.
- `drizzle` - migration SQL hasil Drizzle Kit.
- `scripts/seed.mjs` - seed data demo berbahasa Indonesia.
- `public/assets` - logo dan QR dukungan yang dapat diganti.

## Halaman publik

- `/` Beranda
- `/profil` Profil Karang Taruna
- `/visi-misi` Visi dan misi
- `/struktur` Struktur organisasi
- `/kegiatan` Kegiatan
- `/berita` Berita atau pengumuman
- `/galeri` Galeri
- `/kontak` Kontak
- `/login` Login dashboard
- `/dashboard` Dashboard internal

## Endpoint REST

- `GET /api/health`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET, POST /api/members`
- `GET, POST /api/activities`
- `GET, POST /api/finance`
- `GET, POST /api/admin/users`
- `GET /api/audit-logs`
- `GET, POST /api/settings`
- `GET /api/support-config`

Hak akses divalidasi di backend melalui `src/lib/auth.ts`, bukan hanya disembunyikan di frontend.

## Role

- Super Admin
- Admin Organisasi
- Ketua
- Sekretaris
- Bendahara
- Koordinator Bidang
- Anggota

## Environment

Buat `.env`:

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="ganti-dengan-secret-panjang-acak"
NEXT_PUBLIC_APP_NAME="Karyuna"
NEXT_PUBLIC_ORGANIZATION_NAME="Karang Taruna Karyuna"
NEXT_PUBLIC_ORGANIZATION_ADDRESS="Jl. Gotong Royong No. 17"
NEXT_PUBLIC_ORGANIZATION_EMAIL="halo@karyuna.id"
NEXT_PUBLIC_ORGANIZATION_PHONE="+62 812-3456-7890"
NEXT_PUBLIC_DOMAIN="https://karyuna.id"
NEXT_PUBLIC_PRIMARY_COLOR="#16a34a"
NEXT_PUBLIC_LOGO_URL="/assets/logo-karyuna.svg"
NEXT_PUBLIC_FAVICON_URL="/favicon.ico"
VITE_SUPPORT_WIDGET_ENABLED=true
VITE_SUPPORT_RECIPIENT_NAME="Perpus Opera"
VITE_SUPPORT_QR_IMAGE_URL="/assets/qr-traktiran.png"
VITE_SUPPORT_PAGE_URL="https://trakteer.id/perpus_opera/"
NEXT_PUBLIC_SUPPORT_AMOUNTS="6000,12000,18000,24000,30000"
```

Jangan menaruh connection string atau secret di frontend. `DATABASE_URL` dan `AUTH_SECRET` hanya digunakan server-side.

## Instalasi lokal

```bash
npm install
npx drizzle-kit push
node scripts/seed.mjs
npm run build
npm run dev
```

Akun demo:

- Email: `admin@karyuna.id`
- Kata sandi: `Karyuna123!`

## Deployment Neon/Vercel

1. Buat database Neon PostgreSQL.
2. Salin connection string ke environment `DATABASE_URL`.
3. Tambahkan `AUTH_SECRET` acak minimal 32 karakter.
4. Set konfigurasi publik organisasi dan widget dukungan.
5. Jalankan `npx drizzle-kit push` atau migration SQL di folder `drizzle`.
6. Jalankan `node scripts/seed.mjs` jika membutuhkan data awal.
7. Deploy aplikasi.
8. Pastikan `/api/health` mengembalikan status `sehat`.

## Keamanan yang diterapkan

- Hash kata sandi bcrypt.
- Validasi input frontend dan backend memakai Zod.
- Query aman melalui Drizzle ORM untuk mengurangi risiko SQL injection.
- Cookie sesi HTTP-only, SameSite Lax, secure di production.
- Perlindungan CSRF untuk mutasi.
- Rate limiting in-memory per IP dan endpoint.
- Security headers termasuk CSP, X-Frame-Options, HSTS production.
- Role dan hak akses divalidasi di backend.
- Audit log untuk login, logout, dan perubahan penting.
- Pesan error aman dan berbahasa Indonesia.
- Debug mode tidak digunakan di production.
- Secret tidak disimpan di kode sumber.

## Upload file

Fondasi skema menyimpan URL, ukuran, dan MIME type. Untuk produksi, gunakan object storage dan validasi server:

- Maksimal ukuran sesuai kebutuhan organisasi.
- Batasi MIME: PDF, PNG, JPEG, DOCX.
- Scan malware bila memungkinkan.
- Simpan file dengan nama acak, bukan nama asli pengguna.

## Backup database

Rekomendasi produksi:

- Aktifkan backup/snapshot Neon harian.
- Simpan retensi minimal 30 hari.
- Uji restore berkala.
- Catat konfigurasi backup di modul Pengaturan aplikasi.

## Pengujian dasar

Jalankan:

```bash
npx next typegen
npm exec tsc -- --noEmit --pretty false
npm run build
```

Skenario manual:

1. Buka beranda dan semua halaman publik.
2. Login sebagai Super Admin.
3. Tambah anggota contoh dari dashboard.
4. Tambah kegiatan contoh.
5. Tambah transaksi kas contoh.
6. Buka audit log dan pastikan aktivitas tercatat.
7. Logout dan pastikan dashboard meminta login kembali.
8. Coba akses API admin tanpa login dan pastikan mendapat 401/403.

## Widget dukungan

Widget kanan bawah dapat ditutup, responsif, memakai QR dari konfigurasi, dan tidak mengarahkan pengguna saat dibuka. Ganti QR resmi melalui `VITE_SUPPORT_QR_IMAGE_URL`.
