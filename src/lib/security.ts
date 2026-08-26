import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/db";

const buckets = new Map<string, { count: number; resetAt: number }>();

export function securityHeaders(response: NextResponse) {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Content-Security-Policy", "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
  if (process.env.NODE_ENV === "production") {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  return response;
}

export function jsonResponse(data: unknown, init?: ResponseInit) {
  return securityHeaders(NextResponse.json(data, init));
}

export function getClientIp(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "lokal";
}

export function checkRateLimit(request: NextRequest, limit = 80, windowMs = 60_000) {
  const key = `${getClientIp(request)}:${request.nextUrl.pathname}`;
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  current.count += 1;
  return current.count <= limit;
}

export function validateCsrf(request: NextRequest) {
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) return true;
  const cookieToken = request.cookies.get("karyuna_csrf")?.value;
  const headerToken = request.headers.get("x-csrf-token");
  return Boolean(cookieToken && headerToken && cookieToken === headerToken);
}

export async function writeAuditLog(params: {
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  request?: NextRequest;
  metadata?: Record<string, unknown>;
}) {
  try {
    await db.insert(schema.auditLogs).values({
      userId: params.userId,
      action: params.action,
      entity: params.entity,
      entityId: params.entityId,
      ipAddress: params.request ? getClientIp(params.request) : undefined,
      userAgent: params.request?.headers.get("user-agent") ?? undefined,
      metadata: params.metadata ?? {},
    });
  } catch {
    // Audit log tidak boleh menggagalkan transaksi utama.
  }
}

export function safeError(message = "Permintaan tidak dapat diproses") {
  return jsonResponse({ error: message }, { status: 400 });
}

export function apiError(error: unknown) {
  console.error("[Karyuna] Kesalahan API tidak tertangani:", error);
  const isProduction = process.env.NODE_ENV === "production";
  const message =
    !isProduction && error instanceof Error
      ? error.message
      : "Terjadi kesalahan pada server. Periksa koneksi dan skema database.";
  return jsonResponse({ error: message }, { status: 500 });
}

export function withApi(handler: (request: NextRequest) => Promise<Response> | Response) {
  return async function (request: NextRequest) {
    try {
      return await handler(request);
    } catch (error) {
      return apiError(error);
    }
  };
}
