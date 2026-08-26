import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { jsonResponse } from "@/lib/security";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return jsonResponse({ error: auth.message }, { status: auth.status });
  return jsonResponse({ user: { id: auth.user.id, name: auth.user.name, email: auth.user.email, role: auth.user.role } });
}
