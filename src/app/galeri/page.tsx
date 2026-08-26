import { PublicNav } from "@/components/PublicNav";

export default function GaleriPage() {
  return <main><PublicNav /><section className="mx-auto max-w-6xl px-4 py-14 sm:px-6"><p className="font-bold text-emerald-700">Galeri</p><h1 className="mt-3 text-4xl font-black text-slate-950">Dokumentasi kegiatan Karang Taruna.</h1><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="flex aspect-[4/3] items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-100 to-sky-100 font-bold text-slate-600 shadow-sm ring-1 ring-slate-100">Foto kegiatan {index + 1}</div>)}</div></section></main>;
}