import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-4 text-center">
      <section className="max-w-md rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
        <p className="text-sm font-bold text-emerald-700">404</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Halaman tidak ditemukan</h1>
        <p className="mt-3 text-slate-600">Alamat yang Anda buka tidak tersedia atau telah dipindahkan.</p>
        <Link href="/" className="mt-6 inline-flex rounded-full bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-700">Kembali ke beranda</Link>
      </section>
    </main>
  );
}
