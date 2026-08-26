import { NextRequest } from "next/server";
import { desc, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireAuth } from "@/lib/auth";
import { jsonResponse } from "@/lib/security";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request, "audit");
  if (!auth.ok) return jsonResponse({ error: auth.message }, { status: auth.status });
  const page = Math.max(1, Number(request.nextUrl.searchParams.get("page") ?? 1));
  const limit = Math.min(50, Math.max(10, Number(request.nextUrl.searchParams.get("limit") ?? 20)));
  const data = await db.select().from(schema.auditLogs).orderBy(desc(schema.auditLogs.createdAt)).limit(limit).offset((page - 1) * limit);
  const totalRows = await db.select({ count: sql<number>`count(*)::int` }).from(schema.auditLogs);
  return jsonResponse({ data, page, limit, total: totalRows[0]?.count ?? 0 });
}
