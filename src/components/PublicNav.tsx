import Image from "next/image";
import Link from "next/link";
import { appConfig } from "@/lib/config";

const navItems = [
  ["Beranda", "/"],
  ["Profil", "/profil"],
  ["Visi Misi", "/visi-misi"],
  ["Struktur", "/struktur"],
  ["Kegiatan", "/kegiatan"],
  ["Berita", "/berita"],
  ["Galeri", "/galeri"],
  ["Kontak", "/kontak"],
];

export function PublicNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-emerald-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Kembali ke beranda Karyuna">
          <Image src={appConfig.logoUrl} alt="Logo Karyuna" width={40} height={40} className="rounded-xl" />
          <div>
            <p className="text-sm font-black text-slate-950">{appConfig.appName}</p>
            <p className="hidden text-xs text-slate-500 sm:block">{appConfig.organizationName}</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigasi utama">
          {navItems.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-700">{label}</Link>
          ))}
        </nav>
        <Link href="/login" className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700">Login dashboard</Link>
      </div>
    </header>
  );
}
