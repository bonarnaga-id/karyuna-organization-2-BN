import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";
import { appConfig } from "@/lib/config";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <section className="w-full max-w-md">
        <Link href="/" className="mx-auto mb-6 flex w-fit items-center gap-3 text-center">
          <Image src={appConfig.logoUrl} alt="Logo Karyuna" width={48} height={48} className="rounded-2xl" />
          <div className="text-left"><p className="font-black">{appConfig.appName}</p><p className="text-xs text-slate-500">Dashboard organisasi</p></div>
        </Link>
        <LoginForm />
      </section>
    </main>
  );
}
