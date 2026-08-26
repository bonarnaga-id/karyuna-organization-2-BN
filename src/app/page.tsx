import Link from "next/link";
import { ArrowRight, CalendarDays, FileText, ShieldCheck, Users, WalletCards } from "lucide-react";
import { PublicNav } from "@/components/PublicNav";
import { appConfig } from "@/lib/config";

const stats = ["124 anggota aktif", "38 kegiatan terdokumentasi", "100% bebas iklan", "7 role akses"];
const modules = [
  [Users, "Manajemen anggota", "Data anggota lengkap, status, foto, keahlian, dan pencarian cepat."],
  [CalendarDays, "Kalender kegiatan", "Agenda, panitia, presensi, proposal, dokumentasi, dan laporan."],
  [WalletCards, "Kas transparan", "Pemasukan, pengeluaran, bukti, persetujuan, dan riwayat perubahan."],
  [FileText, "Dokumen & surat", "Surat masuk keluar, dokumen organisasi, serta pengumuman internal."],
  [ShieldCheck, "Akses aman", "Role Super Admin sampai Anggota divalidasi di backend dan tercatat audit log."],
];

export default function HomePage() {
  return (
    <main>
      <PublicNav />
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,#bbf7d0,transparent_36%),radial-gradient(circle_at_bottom_left,#dbeafe,transparent_32%)]" />
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-bold text-emerald-800">Sistem Manajemen Organisasi Karang Taruna</p>
            <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">{appConfig.appName} membantu karang taruna bergerak rapi, transparan, dan kolaboratif.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Kelola anggota, struktur, kegiatan, presensi, dokumen, surat, pengumuman, kas, laporan keuangan, dan audit log dalam satu aplikasi modern berbahasa Indonesia.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/login" className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-6 py-3 font-bold text-white shadow-xl shadow-emerald-600/20 hover:bg-emerald-700">Masuk dashboard <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/profil" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 font-bold text-slate-700 hover:border-emerald-300">Lihat profil organisasi</Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((item) => <div key={item} className="rounded-2xl bg-white p-4 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-slate-100">{item}</div>)}
            </div>
          </div>
          <div className="glass-panel rounded-[2rem] p-5 shadow-2xl">
            <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
              <p className="text-sm text-emerald-200">Ringkasan hari ini</p>
              <h2 className="mt-2 text-2xl font-black">Dashboard Karyuna</h2>
              <div className="mt-6 grid gap-3">
                {modules.map(([Icon, title, desc]) => (
                  <div key={String(title)} className="flex gap-3 rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                    <Icon className="h-5 w-5 shrink-0 text-emerald-300" />
                    <div><p className="font-bold">{String(title)}</p><p className="mt-1 text-sm text-slate-300">{String(desc)}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Aman", "Hashing bcrypt, CSRF, rate limiting, security headers, validasi input, dan hak akses backend."],
            ["Cepat", "Lazy loading dashboard, pagination, debounce pencarian, skeleton, empty state, dan query efisien."],
            ["Siap deploy", "Skema database Drizzle, seed data, REST API, dokumentasi, dan healthcheck produksi."],
          ].map(([title, desc]) => <article key={title} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100"><h3 className="text-xl font-black">{title}</h3><p className="mt-3 text-slate-600">{desc}</p></article>)}
        </div>
      </section>
    </main>
  );
}
