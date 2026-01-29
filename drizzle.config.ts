import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
  throw new Error("DATABASE_URL or POSTGRES_URL must be set. Ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || process.env.POSTGRES_URL || "",
  },
});
