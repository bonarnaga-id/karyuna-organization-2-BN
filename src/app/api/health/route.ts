import { sql } from "drizzle-orm";
import { db } from "@/db";
import { jsonResponse, withApi } from "@/lib/security";

export const GET = withApi(async () => {
  await db.execute(sql`select 1`);
  return jsonResponse({ status: "sehat", aplikasi: "Karyuna", waktu: new Date().toISOString() });
});
