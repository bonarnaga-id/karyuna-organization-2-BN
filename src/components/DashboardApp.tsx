"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Activity, Bell, CalendarDays, ClipboardCheck, FileArchive, FileText, History, LayoutDashboard, LogOut, Mail, Plus, Search, Settings, Shield, Users, WalletCards } from "lucide-react";
import { apiFetch } from "@/lib/client-api";
import { formatDate, formatRupiah } from "@/lib/config";
import type { PermissionKey } from "@/lib/auth";
import type { UserRole } from "@/db/schema";

type SessionUser = { id: string; name: string; email: string; role: UserRole };
type ApiList<T> = { data: T[]; total: number; summary?: Array<{ type: string; total: string }> };
type Row = Record<string, unknown>;

const menu: Array<{ key: PermissionKey | "ringkasan"; label: string; icon: typeof LayoutDashboard; endpoint?: string }> = [
  { key: "ringkasan", label: "Ringkasan", icon: LayoutDashboard },
  { key: "akun", label: "Manajemen akun", icon: Shield, endpoint: "/api/admin/users" },
  { key: "anggota", label: "Manajemen anggota", icon: Users, endpoint: "/api/members" },
  { key: "struktur", label: "Struktur organisasi", icon: Users },
  { key: "kegiatan", label: "Manajemen kegiatan", icon: Activity, endpoint: "/api/activities" },
  { key: "kalender", label: "Kalender kegiatan", icon: CalendarDays, endpoint: "/api/activities" },
  { key: "presensi", label: "Presensi", icon: ClipboardCheck },
  { key: "proposal", label: "Proposal & laporan", icon: FileText },
  { key: "surat", label: "Surat masuk/keluar", icon: Mail },
  { key: "dokumen", label: "Manajemen dokumen", icon: FileArchive },
  { key: "pengumuman", label: "Pengumuman & notifikasi", icon: Bell },
  { key: "kas", label: "Pemasukan & pengeluaran kas", icon: WalletCards, endpoint: "/api/finance" },
  { key: "laporan_keuangan", label: "Laporan keuangan", icon: WalletCards, endpoint: "/api/finance" },
  { key: "audit", label: "Audit log", icon: History, endpoint: "/api/audit-logs" },
  { key: "pengaturan", label: "Pengaturan aplikasi", icon: Settings, endpoint: "/api/settings" },
];

const roleAccess: Record<PermissionKey, UserRole[]> = {
  akun: ["SUPER_ADMIN"], anggota: ["SUPER_ADMIN", "ADMIN_ORGANISASI", "KETUA", "SEKRETARIS"], struktur: ["SUPER_ADMIN", "ADMIN_ORGANISASI", "KETUA", "SEKRETARIS"], kegiatan: ["SUPER_ADMIN", "ADMIN_ORGANISASI", "KETUA", "SEKRETARIS", "KOORDINATOR_BIDANG"], kalender: ["SUPER_ADMIN", "ADMIN_ORGANISASI", "KETUA", "SEKRETARIS", "BENDAHARA", "KOORDINATOR_BIDANG", "ANGGOTA"], presensi: ["SUPER_ADMIN", "ADMIN_ORGANISASI", "KETUA", "SEKRETARIS", "KOORDINATOR_BIDANG"], proposal: ["SUPER_ADMIN", "ADMIN_ORGANISASI", "KETUA", "SEKRETARIS", "KOORDINATOR_BIDANG"], surat: ["SUPER_ADMIN", "ADMIN_ORGANISASI", "KETUA", "SEKRETARIS"], dokumen: ["SUPER_ADMIN", "ADMIN_ORGANISASI", "KETUA", "SEKRETARIS", "BENDAHARA", "KOORDINATOR_BIDANG"], pengumuman: ["SUPER_ADMIN", "ADMIN_ORGANISASI", "KETUA", "SEKRETARIS"], kas: ["SUPER_ADMIN", "ADMIN_ORGANISASI", "KETUA", "BENDAHARA"], laporan_keuangan: ["SUPER_ADMIN", "ADMIN_ORGANISASI", "KETUA", "BENDAHARA"], audit: ["SUPER_ADMIN", "ADMIN_ORGANISASI"], pengaturan: ["SUPER_ADMIN", "ADMIN_ORGANISASI"],
};

export function DashboardApp({ user }: { user: SessionUser }) {
  const router = useRouter();
  const [active, setActive] = useState<typeof menu[number]["key"]>("ringkasan");
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [summary, setSummary] = useState<Array<{ type: string; total: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const visibleMenu = useMemo(() => menu.filter((item) => item.key === "ringkasan" || roleAccess[item.key as PermissionKey]?.includes(user.role)), [user.role]);
  const current = menu.find((item) => item.key === active) ?? menu[0];

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQ(q), 350);
    return () => clearTimeout(timer);
  }, [q]);

  useEffect(() => {
    async function load() {
      if (!current.endpoint) return;
      setLoading(true); setMessage("");
      try {
        const data = await apiFetch<ApiList<Row>>(`${current.endpoint}?q=${encodeURIComponent(debouncedQ)}&limit=10`);
        setRows(data.data ?? []); setSummary(data.summary ?? []);
      } catch (err) {
        setRows([]); setMessage(err instanceof Error ? err.message : "Data gagal dimuat");
      } finally { setLoading(false); }
    }
    load();
  }, [current.endpoint, debouncedQ]);

  async function logout() {
    await apiFetch("/api/auth/logout", { method: "POST" });
    router.push("/login"); router.refresh();
  }

  async function submitQuick(type: "anggota" | "kegiatan" | "kas" | "akun") {
    const today = new Date().toISOString().slice(0, 10);
    const now = new Date(Date.now() + 86_400_000).toISOString();
    const payload = {
      anggota: { memberNumber: `KT-${Date.now().toString().slice(-5)}`, fullName: "Anggota Baru", birthPlace: "Harmoni", birthDate: "2000-01-01", gender: "LAKI_LAKI", address: "Alamat anggota", phone: "081234567890", email: "anggota.baru@karyuna.id", education: "SMA", occupation: "Wiraswasta", skills: "Komunikasi", joinedAt: today, status: "AKTIF", photoUrl: "" },
      kegiatan: { name: "Rapat Koordinasi Bulanan", description: "Koordinasi program kerja dan evaluasi kegiatan berjalan.", location: "Balai Warga", startsAt: now, endsAt: "", committee: [user.name], budget: 250000, participants: [], documentationUrls: [], proposalUrl: "", reportUrl: "", status: "TERJADWAL" },
      kas: { transactionDate: today, type: "PEMASUKAN", category: "Iuran", amount: 100000, fundingSource: "Anggota", description: "Iuran kas bulanan", proofUrl: "", approvalStatus: "DISETUJUI" },
      akun: { name: "Pengurus Baru", email: `pengurus${Date.now()}@karyuna.id`, password: "Karyuna123!", role: "ANGGOTA", isActive: true },
    }[type];
    const endpoint = type === "anggota" ? "/api/members" : type === "kegiatan" ? "/api/activities" : type === "kas" ? "/api/finance" : "/api/admin/users";
    setLoading(true);
    try { await apiFetch(endpoint, { method: "POST", body: JSON.stringify(payload) }); setMessage("Data contoh berhasil ditambahkan."); setDebouncedQ((value) => value); }
    catch (err) { setMessage(err instanceof Error ? err.message : "Gagal menyimpan data"); }
    finally { setLoading(false); }
  }

  const cards = [
    ["Anggota aktif", "124", "Data seed dan API siap digunakan"],
    ["Kegiatan bulan ini", "8", "Kalender, presensi, proposal, laporan"],
    ["Saldo kas", formatRupiah(3250000), "Ringkasan pemasukan dan pengeluaran"],
    ["Audit log", "Aktif", "Semua aksi penting dicatat"],
  ];

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-slate-200 bg-white p-4 lg:w-80 lg:border-b-0 lg:border-r">
          <div className="rounded-3xl bg-emerald-600 p-5 text-white"><p className="text-sm opacity-80">Dashboard internal</p><h1 className="text-2xl font-black">Karyuna</h1><p className="mt-2 text-sm">{user.name} · {user.role.replaceAll("_", " ")}</p></div>
          <nav className="mt-4 grid max-h-[48vh] gap-1 overflow-auto pr-1 lg:max-h-none" aria-label="Menu dashboard">
            {visibleMenu.map((item) => <button key={item.key} onClick={() => { setActive(item.key); setRows([]); }} className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${active === item.key ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-50"}`}><item.icon className="h-4 w-4" />{item.label}</button>)}
          </nav>
          <button onClick={() => startTransition(logout)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-bold text-white hover:bg-slate-700"><LogOut className="h-4 w-4" />{isPending ? "Keluar..." : "Logout"}</button>
        </aside>
        <section className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-bold text-emerald-700">{current.label}</p><h2 className="text-3xl font-black text-slate-950">Kelola {current.label.toLowerCase()}</h2></div><div className="relative"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari data..." className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 outline-none focus:border-emerald-500 sm:w-72" /></div></div>
          {message ? <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">{message}</div> : null}
          {active === "ringkasan" ? <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{cards.map(([title, value, desc]) => <article key={title} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><p className="text-sm font-bold text-slate-500">{title}</p><h3 className="mt-2 text-3xl font-black">{value}</h3><p className="mt-2 text-sm text-slate-500">{desc}</p></article>)}</div> : null}
          {active === "anggota" ? <QuickButton onClick={() => submitQuick("anggota")} label="Tambah anggota contoh" /> : null}
          {active === "kegiatan" ? <QuickButton onClick={() => submitQuick("kegiatan")} label="Tambah kegiatan contoh" /> : null}
          {active === "kas" ? <QuickButton onClick={() => submitQuick("kas")} label="Tambah transaksi contoh" /> : null}
          {active === "akun" ? <QuickButton onClick={() => submitQuick("akun")} label="Tambah akun contoh" /> : null}
          {summary.length ? <div className="mt-6 grid gap-4 sm:grid-cols-2">{summary.map((item) => <div key={item.type} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><p className="text-sm font-bold text-slate-500">Total {item.type.toLowerCase()}</p><p className="mt-1 text-2xl font-black">{formatRupiah(item.total)}</p></div>)}</div> : null}
          {current.endpoint ? <DataTable rows={rows} loading={loading} /> : active !== "ringkasan" ? <FeatureState label={current.label} /> : null}
        </section>
      </div>
    </main>
  );
}

function QuickButton({ onClick, label }: { onClick: () => void; label: string }) {
  return <button onClick={onClick} className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 font-bold text-white hover:bg-emerald-700"><Plus className="h-4 w-4" />{label}</button>;
}

function FeatureState({ label }: { label: string }) {
  return <div className="mt-6 rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200"><p className="text-xl font-black">{label} siap dikembangkan</p><p className="mt-2 text-slate-600">Endpoint, role backend, dan skema database untuk modul ini sudah tersedia dalam arsitektur Karyuna.</p></div>;
}

function DataTable({ rows, loading }: { rows: Row[]; loading: boolean }) {
  if (loading) return <div className="mt-6 grid gap-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-2xl" />)}</div>;
  if (!rows.length) return <div className="mt-6 rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200"><p className="font-black">Belum ada data</p><p className="mt-2 text-sm text-slate-500">Gunakan tombol tambah contoh atau ubah kata kunci pencarian.</p></div>;
  const keys = Object.keys(rows[0]).filter((key) => !["passwordHash", "metadata", "changeHistory"].includes(key)).slice(0, 6);
  return <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200"><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{keys.map((key) => <th key={key} className="px-4 py-3">{key}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={String(row.id ?? index)} className="border-t border-slate-100">{keys.map((key) => <td key={key} className="px-4 py-3 text-slate-700">{renderCell(row[key])}</td>)}</tr>)}</tbody></table></div></div>;
}

function renderCell(value: unknown) {
  if (value === null || value === undefined || value === "") return "-";
  if (value instanceof Date) return formatDate(value);
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) return formatDate(value);
  if (typeof value === "object") return JSON.stringify(value).slice(0, 80);
  return String(value).slice(0, 80);
}
