import { z } from "zod";

const requiredText = (label: string, max = 220) =>
  z.string({ error: `${label} wajib diisi` }).trim().min(1, `${label} wajib diisi`).max(max, `${label} terlalu panjang`);

export const loginSchema = z.object({
  email: z.string({ error: "Email wajib diisi" }).trim().email("Format email tidak valid"),
  password: z.string({ error: "Kata sandi wajib diisi" }).min(8, "Kata sandi minimal 8 karakter"),
});

export const userSchema = z.object({
  name: requiredText("Nama", 160),
  email: z.string({ error: "Email wajib diisi" }).trim().email("Format email tidak valid"),
  password: z.string().min(8, "Kata sandi minimal 8 karakter").optional().or(z.literal("")),
  role: z.enum(["SUPER_ADMIN", "ADMIN_ORGANISASI", "KETUA", "SEKRETARIS", "BENDAHARA", "KOORDINATOR_BIDANG", "ANGGOTA"]),
  isActive: z.boolean().default(true),
});

export const memberSchema = z.object({
  memberNumber: requiredText("Nomor anggota", 60),
  fullName: requiredText("Nama lengkap", 180),
  birthPlace: requiredText("Tempat lahir", 120),
  birthDate: requiredText("Tanggal lahir", 20),
  gender: z.enum(["LAKI_LAKI", "PEREMPUAN"], { error: "Jenis kelamin wajib dipilih" }),
  address: requiredText("Alamat", 1000),
  phone: requiredText("Nomor telepon", 40),
  email: z.string().trim().email("Format email tidak valid").optional().or(z.literal("")),
  education: z.string().trim().max(120).optional(),
  occupation: z.string().trim().max(120).optional(),
  skills: z.string().trim().max(1000).optional(),
  joinedAt: requiredText("Tanggal bergabung", 20),
  status: z.enum(["AKTIF", "NONAKTIF", "ALUMNI"]),
  photoUrl: z.string().trim().url("URL foto tidak valid").optional().or(z.literal("")),
});

export const activitySchema = z.object({
  name: requiredText("Nama kegiatan", 200),
  description: requiredText("Deskripsi", 4000),
  location: requiredText("Lokasi", 200),
  startsAt: requiredText("Tanggal dan waktu mulai", 40),
  endsAt: z.string().optional().or(z.literal("")),
  committee: z.array(z.string()).default([]),
  budget: z.coerce.number().min(0, "Anggaran tidak boleh negatif"),
  participants: z.array(z.string()).default([]),
  documentationUrls: z.array(z.string()).default([]),
  proposalUrl: z.string().optional().or(z.literal("")),
  reportUrl: z.string().optional().or(z.literal("")),
  status: z.enum(["DRAF", "TERJADWAL", "BERJALAN", "SELESAI", "DIBATALKAN"]),
});

export const financeSchema = z.object({
  transactionDate: requiredText("Tanggal transaksi", 20),
  type: z.enum(["PEMASUKAN", "PENGELUARAN"], { error: "Jenis transaksi wajib dipilih" }),
  category: requiredText("Kategori", 120),
  amount: z.coerce.number().positive("Nominal harus lebih dari 0"),
  fundingSource: z.string().trim().max(160).optional(),
  description: requiredText("Keterangan", 1200),
  proofUrl: z.string().trim().url("URL bukti tidak valid").optional().or(z.literal("")),
  approvalStatus: z.enum(["MENUNGGU", "DISETUJUI", "DITOLAK"]),
});

export const settingSchema = z.object({
  key: requiredText("Kunci pengaturan", 120),
  value: z.unknown(),
});
