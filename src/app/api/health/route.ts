import { sql } from "drizzle-orm";
import { db } from "@/db";
import { jsonResponse } from "@/lib/security";

export async function GET() {
  await db.execute(sql`select 1`);
  return jsonResponse({ status: "sehat", aplikasi: "Karyuna", waktu: new Date().toISOString() });
}
