import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import * as schema from "../shared/schema.js";

/**
 * @fileoverview Database Connection Setup.
 * Configures the connection to Neon Postgres using the Serverless driver.
 * Sets up WebSocket for efficient serverless connections.
 */

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
    throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?",
    );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });
