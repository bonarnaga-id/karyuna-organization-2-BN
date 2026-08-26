import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL wajib diisi");
}

const globalForDb = globalThis as typeof globalThis & {
  __karyunaPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__karyunaPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes("neon.tech") ? { rejectUnauthorized: false } : undefined,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__karyunaPostgresqlPool = pool;
}

export const db = drizzle(pool, { schema });
export { schema };
