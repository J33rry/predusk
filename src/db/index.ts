import { neon } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let _db: NeonHttpDatabase<typeof schema> | null = null;

export function getDb(): NeonHttpDatabase<typeof schema> {
    if (_db) return _db;

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error("DATABASE_URL environment variable is required");
    }

    const sql = neon(connectionString);
    _db = drizzle(sql, { schema });
    return _db;
}

// Convenience export for use in API routes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
    get(_, prop) {
        return (getDb() as unknown as Record<string | symbol, unknown>)[prop];
    },
});

export type Database = NeonHttpDatabase<typeof schema>;
