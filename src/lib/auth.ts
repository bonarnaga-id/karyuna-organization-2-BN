import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import type { UserRole } from "@/db/schema";

const SESSION_COOKIE = "karyuna_session";
const CSRF_COOKIE = "karyuna_csrf";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

type SessionPayload = {
  sub: string;
  name: string;
  email: string;
  role: UserRole;
  exp: number;
};

export const permissions = {
  akun: ["SUPER_ADMIN"],
  anggota: ["SUPER_ADMIN", "ADMIN_ORGANISASI", "KETUA", "SEKRETARIS"],
  struktur: ["SUPER_ADMIN", "ADMIN_ORGANISASI", "KETUA", "SEKRETARIS"],
  kegiatan: ["SUPER_ADMIN", "ADMIN_ORGANISASI", "KETUA", "SEKRETARIS", "KOORDINATOR_BIDANG"],
  kalender: ["SUPER_ADMIN", "ADMIN_ORGANISASI", "KETUA", "SEKRETARIS", "KOORDINATOR_BIDANG", "ANGGOTA"],
  presensi: ["SUPER_ADMIN", "ADMIN_ORGANISASI", "KETUA", "SEKRETARIS", "KOORDINATOR_BIDANG"],
  proposal: ["SUPER_ADMIN", "ADMIN_ORGANISASI", "KETUA", "SEKRETARIS", "KOORDINATOR_BIDANG"],
  surat: ["SUPER_ADMIN", "ADMIN_ORGANISASI", "KETUA", "SEKRETARIS"],
  dokumen: ["SUPER_ADMIN", "ADMIN_ORGANISASI", "KETUA", "SEKRETARIS", "BENDAHARA", "KOORDINATOR_BIDANG"],
  pengumuman: ["SUPER_ADMIN", "ADMIN_ORGANISASI", "KETUA", "SEKRETARIS"],
  kas: ["SUPER_ADMIN", "ADMIN_ORGANISASI", "KETUA", "BENDAHARA"],
  laporan_keuangan: ["SUPER_ADMIN", "ADMIN_ORGANISASI", "KETUA", "BENDAHARA"],
  audit: ["SUPER_ADMIN", "ADMIN_ORGANISASI"],
  pengaturan: ["SUPER_ADMIN", "ADMIN_ORGANISASI"],
} as const;

export type PermissionKey = keyof typeof permissions;

function secret() {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "karyuna-dev-secret-ganti-di-produksi";
}

function base64url(input: Buffer | string) {
  return Buffer.from(input).toString("base64url");
}

function sign(data: string) {
  return createHmac("sha256", secret()).update(data).digest("base64url");
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function createSessionToken(payload: Omit<SessionPayload, "exp">) {
  const body = base64url(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS }));
  return `${body}.${sign(body)}`;
}

function parseSessionToken(token?: string): SessionPayload | null {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;
  const expected = sign(body);
  const valid = timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  if (!valid) return null;
  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload;
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

export function createCsrfToken() {
  return randomBytes(24).toString("base64url");
}

export async function setAuthCookies(token: string, csrf: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  store.set(CSRF_COOKIE, csrf, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearAuthCookies() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  store.delete(CSRF_COOKIE);
}

export function getSessionFromRequest(request: NextRequest) {
  return parseSessionToken(request.cookies.get(SESSION_COOKIE)?.value);
}

export async function getCurrentSession() {
  const store = await cookies();
  return parseSessionToken(store.get(SESSION_COOKIE)?.value);
}

export function can(role: UserRole, permission: PermissionKey) {
  return permissions[permission].includes(role as never);
}

export async function requireAuth(request: NextRequest, permission?: PermissionKey) {
  const session = getSessionFromRequest(request);
  if (!session) return { ok: false as const, status: 401, message: "Sesi tidak valid atau telah berakhir" };
  const user = await db.query.users.findFirst({ where: eq(schema.users.id, session.sub) });
  if (!user || !user.isActive) return { ok: false as const, status: 401, message: "Akun tidak aktif" };
  if (permission && !can(user.role, permission)) {
    return { ok: false as const, status: 403, message: "Anda tidak memiliki hak akses" };
  }
  return { ok: true as const, user, session };
}
