"use client";

import Image from "next/image";
import { useState } from "react";
import { Coffee, X } from "lucide-react";
import { formatRupiah } from "@/lib/config";

type SupportConfig = {
  enabled: boolean;
  recipientName: string;
  qrImageUrl: string;
  pageUrl: string;
  amounts: number[];
};

export function FloatingSupportWidget({ config }: { config: SupportConfig }) {
  const [visible, setVisible] = useState(true);
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState("");
  const [selected, setSelected] = useState(config.amounts[0] ?? 6000);

  if (!config.enabled || !visible) return null;

  return (
    <>
      <div className="fixed bottom-4 right-4 z-40 flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full bg-white p-2 shadow-2xl ring-1 ring-emerald-100 sm:bottom-6 sm:right-6">
        <button
          type="button"
          aria-label="Buka widget dukungan server"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-2 text-left text-xs font-semibold text-white transition hover:bg-emerald-700 sm:px-4"
        >
          <Coffee className="h-4 w-4 shrink-0" />
          <span className="hidden sm:inline">Web app ini gratis & bebas iklan. Kopi kecil, server tetap jalan</span>
          <span className="sm:hidden">Kopi server</span>
        </button>
        <button type="button" aria-label="Tutup widget dukungan" onClick={() => setVisible(false)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800">
          <X className="h-4 w-4" />
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Modal dukungan server Karyuna">
          <div className="w-full max-w-lg rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-emerald-700">Dukungan sukarela</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-950">Kopi kecil, server tetap jalan</h2>
                <p className="mt-2 text-sm text-slate-600">Pembayaran untuk {config.recipientName}. QR diambil dari konfigurasi pemilik akun.</p>
              </div>
              <button type="button" aria-label="Tutup modal dukungan" onClick={() => setOpen(false)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {config.amounts.map((amount) => (
                <button key={amount} type="button" onClick={() => { setSelected(amount); setCustom(""); }} className={`rounded-2xl border px-3 py-3 text-sm font-semibold transition ${selected === amount && !custom ? "border-emerald-600 bg-emerald-50 text-emerald-800" : "border-slate-200 hover:border-emerald-300"}`}>
                  {formatRupiah(amount)}
                </button>
              ))}
              <label className="col-span-2 rounded-2xl border border-slate-200 px-3 py-2 sm:col-span-3">
                <span className="text-xs font-medium text-slate-500">Nominal lainnya</span>
                <input aria-label="Nominal traktiran lainnya" inputMode="numeric" value={custom} onChange={(event) => { setCustom(event.target.value.replace(/\D/g, "")); setSelected(Number(event.target.value.replace(/\D/g, "")) || selected); }} placeholder="Masukkan nominal" className="mt-1 w-full border-none bg-transparent text-sm font-semibold outline-none" />
              </label>
            </div>

            <div className="mt-5 grid gap-4 rounded-3xl bg-slate-50 p-4 sm:grid-cols-[180px_1fr]">
              <div className="relative mx-auto aspect-square w-44 overflow-hidden rounded-2xl bg-white p-2 ring-1 ring-slate-200">
                <Image src={config.qrImageUrl} alt={`QR Code dukungan untuk ${config.recipientName}`} fill sizes="176px" className="object-contain p-2" />
              </div>
              <div className="flex flex-col justify-center text-sm text-slate-600">
                <p className="font-semibold text-slate-900">Nominal dipilih: {formatRupiah(custom ? Number(custom) : selected)}</p>
                <p className="mt-2">Pindai QR menggunakan aplikasi pembayaran. Jika QR belum muncul, pastikan `VITE_SUPPORT_QR_IMAGE_URL` mengarah ke QR resmi pemilik akun.</p>
                <a href={config.pageUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex w-fit rounded-full bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-700">Buka halaman dukungan</a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
