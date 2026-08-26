import { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { createCsrfToken, createSessionToken, setAuthCookies, verifyPassword } from "@/lib/auth";
import {checkRateLimit, jsonResponse, writeAuditLog, withApi } from "@/lib/security";
import { loginSchema } from "@/lib/validators";

export const POST = withApi(async (request: NextRequest) => {
  if (!checkRateLimit(request, 8, 60_000)) {
    return jsonResponse({ error: "Terlalu banyak percobaan login. Coba lagi sebentar." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return jsonResponse({ error: parsed.error.issues[0]?.message ?? "Data login tidak valid" }, { status: 400 });
  }

  const user = await db.query.users.findFirst({ where: eq(schema.users.email, parsed.data.email.toLowerCase()) });
  if (!user || !user.isActive || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    await writeAuditLog({ action: "LOGIN_GAGAL", entity: "users", request, metadata: { email: parsed.data.email } });
    return jsonResponse({ error: "Email atau kata sandi salah" }, { status: 401 });
  }

  await db.update(schema.users).set({ lastLoginAt: new Date(), updatedAt: new Date() }).where(eq(schema.users.id, user.id));
  const csrf = createCsrfToken();
  const token = createSessionToken({ sub: user.id, name: user.name, email: user.email, role: user.role });
  await setAuthCookies(token, csrf);
  await writeAuditLog({ userId: user.id, action: "LOGIN_BERHASIL", entity: "users", entityId: user.id, request });

  return jsonResponse({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, csrfToken: csrf });
});
