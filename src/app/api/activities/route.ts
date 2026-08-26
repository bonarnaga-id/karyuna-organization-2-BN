import { NextRequest } from "next/server";
import { desc, ilike, or, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireAuth } from "@/lib/auth";
import { checkRateLimit, jsonResponse, validateCsrf, writeAuditLog } from "@/lib/security";
import { activitySchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  if (!checkRateLimit(request)) return jsonResponse({ error: "Terlalu banyak permintaan" }, { status: 429 });
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(50, Math.max(5, Number(searchParams.get("limit") ?? 10)));
  const q = searchParams.get("q")?.trim();
  const filter = q ? or(ilike(schema.activities.name, `%${q}%`), ilike(schema.activities.location, `%${q}%`)) : undefined;
  const rows = await db.select().from(schema.activities).where(filter).orderBy(desc(schema.activities.startsAt)).limit(limit).offset((page - 1) * limit);
  const totalRows = await db.select({ count: sql<number>`count(*)::int` }).from(schema.activities).where(filter);
  return jsonResponse({ data: rows, page, limit, total: totalRows[0]?.count ?? 0 });
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request, "kegiatan");
  if (!auth.ok) return jsonResponse({ error: auth.message }, { status: auth.status });
  if (!validateCsrf(request)) return jsonResponse({ error: "Token keamanan tidak valid" }, { status: 403 });
  const parsed = activitySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonResponse({ error: parsed.error.issues[0]?.message ?? "Data kegiatan tidak valid" }, { status: 400 });
  const [activity] = await db.insert(schema.activities).values({
    ...parsed.data,
    startsAt: new Date(parsed.data.startsAt),
    endsAt: parsed.data.endsAt ? new Date(parsed.data.endsAt) : null,
    budget: String(parsed.data.budget),
    responsibleUserId: auth.user.id,
    proposalUrl: parsed.data.proposalUrl || null,
    reportUrl: parsed.data.reportUrl || null,
  }).returning();
  await writeAuditLog({ userId: auth.user.id, action: "BUAT_KEGIATAN", entity: "activities", entityId: activity.id, request });
  return jsonResponse({ data: activity }, { status: 201 });
}
