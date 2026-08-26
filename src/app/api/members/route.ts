import { NextRequest } from "next/server";
import { and, desc, ilike, or, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireAuth } from "@/lib/auth";
import {checkRateLimit, jsonResponse, validateCsrf, writeAuditLog, withApi } from "@/lib/security";
import { memberSchema } from "@/lib/validators";

export const GET = withApi(async (request: NextRequest) => {
  if (!checkRateLimit(request)) return jsonResponse({ error: "Terlalu banyak permintaan" }, { status: 429 });
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(50, Math.max(5, Number(searchParams.get("limit") ?? 10)));
  const q = searchParams.get("q")?.trim();
  const filter = q ? or(ilike(schema.members.fullName, `%${q}%`), ilike(schema.members.memberNumber, `%${q}%`), ilike(schema.members.phone, `%${q}%`)) : undefined;
  const rows = await db.select().from(schema.members).where(filter).orderBy(desc(schema.members.createdAt)).limit(limit).offset((page - 1) * limit);
  const totalRows = await db.select({ count: sql<number>`count(*)::int` }).from(schema.members).where(filter);
  return jsonResponse({ data: rows, page, limit, total: totalRows[0]?.count ?? 0 });
});

export const POST = withApi(async (request: NextRequest) => {
  const auth = await requireAuth(request, "anggota");
  if (!auth.ok) return jsonResponse({ error: auth.message }, { status: auth.status });
  if (!validateCsrf(request)) return jsonResponse({ error: "Token keamanan tidak valid" }, { status: 403 });

  const parsed = memberSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonResponse({ error: parsed.error.issues[0]?.message ?? "Data anggota tidak valid" }, { status: 400 });

  const [member] = await db.insert(schema.members).values({
    ...parsed.data,
    email: parsed.data.email || null,
    education: parsed.data.education || null,
    occupation: parsed.data.occupation || null,
    skills: parsed.data.skills || null,
    photoUrl: parsed.data.photoUrl || null,
  }).returning();
  await writeAuditLog({ userId: auth.user.id, action: "BUAT_ANGGOTA", entity: "members", entityId: member.id, request });
  return jsonResponse({ data: member }, { status: 201 });
});
