import { PublicNav } from "@/components/PublicNav";

export default function BeritaPage() {
  return <main><PublicNav /><section className="mx-auto max-w-5xl px-4 py-14 sm:px-6"><p className="font-bold text-emerald-700">Berita dan Pengumuman</p><h1 className="mt-3 text-4xl font-black text-slate-950">Informasi terbaru organisasi.</h1><div className="mt-8 rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-100"><p className="text-lg font-bold">Belum ada pengumuman publik.</p><p className="mt-2 text-slate-600">Pengumuman dapat diterbitkan dari dashboard internal oleh pengurus yang berwenang.</p></div></section></main>;
}