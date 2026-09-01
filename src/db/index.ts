import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required. Please check your .env.local file.");
}

const globalForDb = globalThis as typeof globalThis & {
  __mekiyaPostgresqlPool?: Pool;
};

// Supabase Connection Pooling Configuration
// - Use DATABASE_URL with ?pgbouncer=true for connection pooling (port 6543)
// - Use DIRECT_URL for migrations (port 5432)
export const pool =
  globalForDb.__mekiyaPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
    max: 10, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 10000, // Timeout after 10 seconds
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__mekiyaPostgresqlPool = pool;
}

export const db = drizzle(pool, { schema });
