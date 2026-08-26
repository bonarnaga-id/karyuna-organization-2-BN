import { NextRequest } from "next/server";
import { db, schema } from "@/db";
import { requireAuth } from "@/lib/auth";
import {jsonResponse, validateCsrf, writeAuditLog, withApi } from "@/lib/security";
import { settingSchema } from "@/lib/validators";

export const GET = withApi(async (request: NextRequest) => {
  const auth = await requireAuth(request, "pengaturan");
  if (!auth.ok) return jsonResponse({ error: auth.message }, { status: auth.status });
  const data = await db.select().from(schema.appSettings).limit(100);
  return jsonResponse({ data });
});

export const POST = withApi(async (request: NextRequest) => {
  const auth = await requireAuth(request, "pengaturan");
  if (!auth.ok) return jsonResponse({ error: auth.message }, { status: auth.status });
  if (!validateCsrf(request)) return jsonResponse({ error: "Token keamanan tidak valid" }, { status: 403 });
  const parsed = settingSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return jsonResponse({ error: parsed.error.issues[0]?.message ?? "Pengaturan tidak valid" }, { status: 400 });
  await db.insert(schema.appSettings).values(parsed.data).onConflictDoUpdate({ target: schema.appSettings.key, set: { value: parsed.data.value, updatedAt: new Date() } });
  await writeAuditLog({ userId: auth.user.id, action: "UBAH_PENGATURAN", entity: "app_settings", entityId: parsed.data.key, request });
  return jsonResponse({ message: "Pengaturan tersimpan" });
});
