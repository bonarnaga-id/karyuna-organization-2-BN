import { Mail, MapPin, Phone } from "lucide-react";
import { PublicNav } from "@/components/PublicNav";
import { appConfig } from "@/lib/config";

export default function KontakPage() {
  return <main><PublicNav /><section className="mx-auto max-w-5xl px-4 py-14 sm:px-6"><p className="font-bold text-emerald-700">Kontak</p><h1 className="mt-3 text-4xl font-black text-slate-950">Hubungi {appConfig.organizationName}</h1><div className="mt-8 grid gap-4"><div className="flex gap-3 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100"><MapPin className="text-emerald-600" /><span>{appConfig.address}</span></div><div className="flex gap-3 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100"><Mail className="text-emerald-600" /><span>{appConfig.email}</span></div><div className="flex gap-3 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100"><Phone className="text-emerald-600" /><span>{appConfig.phone}</span></div></div></section></main>;
}