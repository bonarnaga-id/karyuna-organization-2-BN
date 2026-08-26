import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { appConfig } from "@/lib/config";
import { FloatingSupportWidget } from "@/components/FloatingSupportWidget";
import "./globals.css";

export const metadata: Metadata = {
  title: `${appConfig.appName} - Sistem Manajemen Karang Taruna`,
  description: "Sistem Manajemen Organisasi Karang Taruna modern, aman, dan responsif.",
  icons: [{ rel: "icon", url: appConfig.faviconUrl }],
};

export const viewport: Viewport = {
  themeColor: appConfig.primaryColor,
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-emerald-50/40 text-slate-900 antialiased">
        {children}
        <FloatingSupportWidget config={appConfig.support} />
      </body>
    </html>
  );
}
