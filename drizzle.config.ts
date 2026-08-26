import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config();
config({ path: ".env.local" });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL wajib diisi untuk menjalankan drizzle-kit");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: databaseUrl,
    ssl: databaseUrl.includes("neon.tech") ? { rejectUnauthorized: false } : undefined,
  },
});
