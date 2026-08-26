import 'dotenv/config';
import bcrypt from 'bcryptjs';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : undefined });
const passwordHash = await bcrypt.hash('Karyuna123!', 12);

async function main() {
  await pool.query(`
    insert into users (name, email, password_hash, role, is_active)
    values
      ('Admin Karyuna', 'admin@karyuna.id', $1, 'SUPER_ADMIN', true),
      ('Siti Sekretaris', 'sekretaris@karyuna.id', $1, 'SEKRETARIS', true),
      ('Budi Bendahara', 'bendahara@karyuna.id', $1, 'BENDAHARA', true),
      ('Rina Anggota', 'anggota@karyuna.id', $1, 'ANGGOTA', true)
    on conflict (email) do update set password_hash = excluded.password_hash, role = excluded.role, is_active = true;
  `, [passwordHash]);

  await pool.query(`
    insert into members (member_number, full_name, birth_place, birth_date, gender, address, phone, email, education, occupation, skills, joined_at, status, photo_url)
    values
      ('KT-001', 'Andi Pratama', 'Harmoni', '1998-04-10', 'LAKI_LAKI', 'Dusun Melati RT 01', '081234567001', 'andi@karyuna.id', 'S1', 'Guru', 'Fasilitasi, olahraga', '2024-01-10', 'AKTIF', null),
      ('KT-002', 'Siti Aminah', 'Harmoni', '2000-08-22', 'PEREMPUAN', 'Dusun Mawar RT 02', '081234567002', 'siti@karyuna.id', 'D3', 'Desainer', 'Desain grafis, administrasi', '2024-02-12', 'AKTIF', null),
      ('KT-003', 'Budi Santoso', 'Harmoni', '1997-12-02', 'LAKI_LAKI', 'Dusun Kenanga RT 03', '081234567003', 'budi@karyuna.id', 'SMA', 'Wiraswasta', 'Keuangan, logistik', '2024-03-05', 'AKTIF', null)
    on conflict (member_number) do nothing;
  `);

  await pool.query(`
    insert into activities (name, description, location, starts_at, ends_at, committee, budget, participants, attendance_summary, documentation_urls, status)
    values
      ('Kerja Bakti Lingkungan', 'Membersihkan selokan dan area fasilitas umum bersama warga.', 'Balai Warga dan sekitarnya', now() + interval '7 days', now() + interval '7 days 3 hours', '["Andi", "Siti"]', 500000, '["KT-001", "KT-002"]', '{"hadir":0}', '[]', 'TERJADWAL'),
      ('Pelatihan UMKM Pemuda', 'Pelatihan pemasaran digital untuk usaha muda desa.', 'Aula Desa', now() + interval '14 days', now() + interval '14 days 4 hours', '["Budi", "Rina"]', 1500000, '["KT-001", "KT-003"]', '{"hadir":0}', '[]', 'TERJADWAL');
  `);

  await pool.query(`
    insert into finance_transactions (transaction_date, type, category, amount, funding_source, description, approval_status, change_history)
    values
      (current_date, 'PEMASUKAN', 'Iuran Anggota', 750000, 'Anggota', 'Iuran kas bulanan', 'DISETUJUI', '[{"aksi":"Seed","oleh":"Sistem"}]'),
      (current_date, 'PENGELUARAN', 'Konsumsi', 250000, 'Kas organisasi', 'Konsumsi rapat koordinasi', 'DISETUJUI', '[{"aksi":"Seed","oleh":"Sistem"}]');
  `);

  await pool.query(`insert into announcements (title, content, is_published) values ('Rapat Koordinasi Bulanan', 'Seluruh pengurus diharapkan hadir tepat waktu di Balai Warga.', true);`);
  await pool.query(`insert into documents (title, type, file_url, file_size, mime_type) values ('Template Proposal Kegiatan', 'PROPOSAL', '/dokumen/template-proposal.pdf', 1024, 'application/pdf');`);
  await pool.query(`insert into letters (type, number, subject, sender, recipient, letter_date) values ('MASUK', '001/KT/I/2026', 'Undangan Musyawarah Desa', 'Pemerintah Desa', 'Karang Taruna', current_date);`);
  await pool.query(`insert into app_settings (key, value) values ('backup_database', '{"jadwal":"harian","retensi":"30 hari","status":"aktif"}') on conflict (key) do update set value = excluded.value;`);
  console.log('Seed data Karyuna selesai. Login: admin@karyuna.id / Karyuna123!');
}

main().finally(async () => pool.end());
