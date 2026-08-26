"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiFetch } from "@/lib/client-api";
import { loginSchema } from "@/lib/validators";

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "admin@karyuna.id", password: "Karyuna123!" },
  });

  async function onSubmit(values: LoginValues) {
    setError("");
    try {
      await apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify(values) });
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-[2rem] bg-white p-6 shadow-2xl shadow-emerald-900/10 ring-1 ring-emerald-100 sm:p-8">
      <div>
        <label className="text-sm font-bold text-slate-700" htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="email" {...register("email")} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500" />
        {errors.email ? <p className="mt-1 text-sm text-red-600">{errors.email.message}</p> : null}
      </div>
      <div className="mt-4">
        <label className="text-sm font-bold text-slate-700" htmlFor="password">Kata sandi</label>
        <input id="password" type="password" autoComplete="current-password" {...register("password")} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500" />
        {errors.password ? <p className="mt-1 text-sm text-red-600">{errors.password.message}</p> : null}
      </div>
      {error ? <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div> : null}
      <button disabled={isSubmitting} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 font-black text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70">
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />} Masuk dashboard
      </button>
      <p className="mt-4 text-center text-xs text-slate-500">Demo seed: admin@karyuna.id / Karyuna123!</p>
    </form>
  );
}
