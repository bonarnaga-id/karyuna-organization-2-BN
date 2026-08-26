import { NextRequest } from "next/server";
import { desc, eq, ilike, or, sql } from "drizzle-orm";
import { db, schema } from "@/db";
import { requireAuth } from "@/lib/auth";
import { checkRateLimit, jsonResponse, validateCsrf, writeAuditLog } from "@/lib/security";
import { financeSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request, "laporan_keuangan");
  if (!auth.ok) return jsonResponse({ error: auth.message }, { status: auth.status });
  if (!checkRateLimit(request)) return jsonResponse({ error: "Terlalu banyak permintaan" }, { status: 429 });
  const { searchParams } = request.nextUrl;
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(50, Math.max(5, Number(searchParams.get("limit") ?? 10)));
  const q = searchParams.get("q")?.trim();
  const filter = q ? or(ilike(schema.financeTransactions.category, `%${q}%`), ilike(schema.financeTransactions.description, `%${q}%`)) : undefined;
  const data = await db.select().from(schema.financeTransactions).where(filter).orderBy(desc(schema.financeTransactions.transactionDate)).limit(limit).offset((page - 1) * limit);
  const totals = await db.select({ type: schema.financeTransactions.type, total: sql<string>`coalesce(sum(${schema.financeTransactions.amount}),0)` }).from(schema.financeTransactions).where(eq(schema.financeTransactions.approvalStatus, "DISETUJUI")).groupBy(schema.financeTransactions.type);
  const totalRows = await db.select({ count: sql<number>`count(*)::int` }).from(schema.financeTransactions).where(filter);
  return jsonResponse({ data, page, limit, total: totalRows[0]?.count ?? 0, summary: totals });
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request, "kas");
  if (!auth.ok) return jsonResponse({ error: auth.message }, { status: auth.status });
  if (!validateCsrf(request)) return jsonResponse({ error: "Token keamanan tidak valid" }, { status: 403 });
  const parsed = financeSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonResponse({ error: parsed.error.issues[0]?.message ?? "Data transaksi tidak valid" }, { status: 400 });
  const [transaction] = await db.insert(schema.financeTransactions).values({
    ...parsed.data,
    amount: String(parsed.data.amount),
    fundingSource: parsed.data.fundingSource || null,
    proofUrl: parsed.data.proofUrl || null,
    createdBy: auth.user.id,
    changeHistory: [{ aksi: "Dibuat", oleh: auth.user.name, waktu: new Date().toISOString() }],
  }).returning();
  await writeAuditLog({ userId: auth.user.id, action: "BUAT_TRANSAKSI_KAS", entity: "finance_transactions", entityId: transaction.id, request });
  return jsonResponse({ data: transaction }, { status: 201 });
}
