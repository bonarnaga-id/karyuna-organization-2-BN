import { PublicNav } from "@/components/PublicNav";

const kegiatan = ["Kerja bakti lingkungan", "Pelatihan UMKM pemuda", "Turnamen olahraga warga", "Bakti sosial dan donor darah"];
export default function KegiatanPage() {
  return <main><PublicNav /><section className="mx-auto max-w-6xl px-4 py-14 sm:px-6"><p className="font-bold text-emerald-700">Kegiatan</p><h1 className="mt-3 text-4xl font-black text-slate-950">Agenda sosial, edukasi, dan kreativitas pemuda.</h1><div className="mt-8 grid gap-4 md:grid-cols-2">{kegiatan.map((item) => <article key={item} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100"><h2 className="text-xl font-black">{item}</h2><p className="mt-2 text-slate-600">Informasi lengkap, panitia, presensi, dokumentasi, proposal, dan laporan tersedia di dashboard.</p></article>)}</div></section></main>;
}