import { NextRequest } from "next/server";
import { desc, eq, ilike, or, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { hashPassword, requireAuth } from "@/lib/auth";
import { checkRateLimit, jsonResponse, validateCsrf, writeAuditLog } from "@/lib/security";
import { userSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request, "akun");
  if (!auth.ok) return jsonResponse({ error: auth.message }, { status: auth.status });
  if (!checkRateLimit(request)) return jsonResponse({ error: "Terlalu banyak permintaan" }, { status: 429 });
  const q = request.nextUrl.searchParams.get("q")?.trim();
  const filter = q ? or(ilike(schema.users.name, `%${q}%`), ilike(schema.users.email, `%${q}%`)) : undefined;
  const data = await db.select({ id: schema.users.id, name: schema.users.name, email: schema.users.email, role: schema.users.role, isActive: schema.users.isActive, lastLoginAt: schema.users.lastLoginAt, createdAt: schema.users.createdAt }).from(schema.users).where(filter).orderBy(desc(schema.users.createdAt)).limit(50);
  const totalRows = await db.select({ count: sql<number>`count(*)::int` }).from(schema.users).where(filter);
  return jsonResponse({ data, total: totalRows[0]?.count ?? 0 });
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request, "akun");
  if (!auth.ok) return jsonResponse({ error: auth.message }, { status: auth.status });
  if (!validateCsrf(request)) return jsonResponse({ error: "Token keamanan tidak valid" }, { status: 403 });
  const parsed = userSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonResponse({ error: parsed.error.issues[0]?.message ?? "Data akun tidak valid" }, { status: 400 });
  const password = parsed.data.password || "Karyuna123!";
  const [user] = await db.insert(schema.users).values({
    name: parsed.data.name,
    email: parsed.data.email.toLowerCase(),
    passwordHash: await hashPassword(password),
    role: parsed.data.role,
    isActive: parsed.data.isActive,
  }).returning({ id: schema.users.id, name: schema.users.name, email: schema.users.email, role: schema.users.role, isActive: schema.users.isActive });
  await writeAuditLog({ userId: auth.user.id, action: "BUAT_AKUN", entity: "users", entityId: user.id, request });
  return jsonResponse({ data: user }, { status: 201 });
}
