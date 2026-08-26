export function readCookie(name: string) {
  if (typeof document === "undefined") return "";
  return document.cookie.split("; ").find((item) => item.startsWith(`${name}=`))?.split("=")[1] ?? "";
}

export async function apiFetch<T>(url: string, init: RequestInit = {}): Promise<T> {
  const method = (init.method ?? "GET").toUpperCase();
  const headers = new Headers(init.headers);
  if (!(init.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (!["GET", "HEAD", "OPTIONS"].includes(method)) headers.set("x-csrf-token", decodeURIComponent(readCookie("karyuna_csrf")));
  const response = await fetch(url, { ...init, headers, credentials: "include" });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Terjadi kesalahan");
  return data as T;
}
