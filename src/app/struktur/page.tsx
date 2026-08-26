import { PublicNav } from "@/components/PublicNav";

const posisi = ["Ketua", "Sekretaris", "Bendahara", "Koordinator Bidang Sosial", "Koordinator Bidang Kreatif", "Koordinator Bidang Olahraga"];
export default function StrukturPage() {
  return <main><PublicNav /><section className="mx-auto max-w-6xl px-4 py-14 sm:px-6"><p className="font-bold text-emerald-700">Struktur Organisasi</p><h1 className="mt-3 text-4xl font-black text-slate-950">Struktur kerja ringkas dan akuntabel.</h1><div className="mt-8 grid gap-4 md:grid-cols-3">{posisi.map((item, index) => <article key={item} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100"><p className="text-sm font-bold text-emerald-700">Posisi {index + 1}</p><h2 className="mt-2 text-xl font-black">{item}</h2><p className="mt-2 text-sm text-slate-600">Data pejabat dapat dikelola dari dashboard internal.</p></article>)}</div></section></main>;
}