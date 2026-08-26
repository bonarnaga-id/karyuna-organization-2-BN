import { NextRequest } from "next/server";
import { clearAuthCookies, getSessionFromRequest } from "@/lib/auth";
import {jsonResponse, validateCsrf, writeAuditLog, withApi } from "@/lib/security";

export const POST = withApi(async (request: NextRequest) => {
  if (!validateCsrf(request)) {
    return jsonResponse({ error: "Token keamanan tidak valid" }, { status: 403 });
  }
  const session = getSessionFromRequest(request);
  await clearAuthCookies();
  await writeAuditLog({ userId: session?.sub, action: "LOGOUT", entity: "users", entityId: session?.sub, request });
  return jsonResponse({ message: "Berhasil keluar" });
});
