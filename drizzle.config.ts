import { defineConfig } from "drizzle-kit";

/**
 * @fileoverview Drizzle Kit configuration.
 * Configures how migrations are generated and pushed to the database.
 * Uses DATABASE_URL from environment variables for connection.
 */

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
