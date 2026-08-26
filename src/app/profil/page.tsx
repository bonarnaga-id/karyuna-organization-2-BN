import { PublicNav } from "@/components/PublicNav";
import { appConfig } from "@/lib/config";

export default function ProfilPage() {
  return (
    <main>
      <PublicNav />
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <p className="font-bold text-emerald-700">Profil Karang Taruna</p>
        <h1 className="mt-3 text-4xl font-black text-slate-950">{appConfig.organizationName}</h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">Karyuna adalah platform manajemen untuk mendukung Karang Taruna dalam mengelola administrasi, kegiatan sosial, kepemudaan, dokumentasi, dan transparansi keuangan secara tertib. Organisasi ini bergerak melalui semangat gotong royong, inklusif, dan pelayanan masyarakat.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">{["Gotong royong", "Transparansi", "Kolaborasi"].map((item) => <div key={item} className="rounded-3xl bg-white p-6 font-bold shadow-sm ring-1 ring-slate-100">{item}</div>)}</div>
      </section>
    </main>
  );
}
