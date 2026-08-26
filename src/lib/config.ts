export const appConfig = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "Karyuna",
  logoUrl: process.env.NEXT_PUBLIC_LOGO_URL ?? "/assets/logo-karyuna.svg",
  faviconUrl: process.env.NEXT_PUBLIC_FAVICON_URL ?? "/assets/logo-karyuna.svg",
  primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR ?? "#16a34a",
  organizationName: process.env.NEXT_PUBLIC_ORGANIZATION_NAME ?? "Karang Taruna Karyuna",
  address: process.env.NEXT_PUBLIC_ORGANIZATION_ADDRESS ?? "Jl. Gotong Royong No. 17, Desa Harmoni",
  email: process.env.NEXT_PUBLIC_ORGANIZATION_EMAIL ?? "halo@karyuna.id",
  phone: process.env.NEXT_PUBLIC_ORGANIZATION_PHONE ?? "+62 812-3456-7890",
  domain: process.env.NEXT_PUBLIC_DOMAIN ?? "https://karyuna.local",
  support: {
    enabled: (process.env.VITE_SUPPORT_WIDGET_ENABLED ?? "true") === "true",
    recipientName: process.env.VITE_SUPPORT_RECIPIENT_NAME ?? "Perpus Opera",
    qrImageUrl: process.env.VITE_SUPPORT_QR_IMAGE_URL ?? "/assets/qr-traktiran.png",
    pageUrl: process.env.VITE_SUPPORT_PAGE_URL ?? "https://trakteer.id/perpus_opera/",
    amounts: (process.env.NEXT_PUBLIC_SUPPORT_AMOUNTS ?? "6000,12000,18000,24000,30000")
      .split(",")
      .map((item) => Number(item.trim()))
      .filter(Boolean),
  },
};

export type AppConfig = typeof appConfig;

export function formatRupiah(value: number | string) {
  const numberValue = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(numberValue) ? numberValue : 0);
}

export function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}
