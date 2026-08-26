import { PublicNav } from "@/components/PublicNav";

export default function VisiMisiPage() {
  return (
    <main>
      <PublicNav />
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <p className="font-bold text-emerald-700">Visi dan Misi</p>
        <h1 className="mt-3 text-4xl font-black text-slate-950">Pemuda aktif, mandiri, peduli, dan berdaya.</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100"><h2 className="text-2xl font-black">Visi</h2><p className="mt-3 text-slate-600">Menjadi wadah pengembangan generasi muda yang kreatif, berkarakter, dan berkontribusi nyata bagi kesejahteraan lingkungan.</p></article>
          <article className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100"><h2 className="text-2xl font-black">Misi</h2><ul className="mt-3 list-disc space-y-2 pl-5 text-slate-600"><li>Menguatkan kegiatan sosial dan kepemudaan.</li><li>Meningkatkan kapasitas anggota melalui pelatihan.</li><li>Mengelola administrasi dan kas secara transparan.</li><li>Membangun kolaborasi dengan warga dan mitra.</li></ul></article>
        </div>
      </section>
    </main>
  );
}
