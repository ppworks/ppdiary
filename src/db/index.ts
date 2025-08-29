import { execSync } from "node:child_process";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "./schema.js";

const dbPath = process.env.DATABASE_URL || "./data/diary.db";
const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });

if (dbPath === ":memory:") {
  migrate(db, { migrationsFolder: "./src/db/migrations" });
} else {
  execSync("npx drizzle-kit migrate", {
    stdio: ["ignore", "ignore", "pipe"], // Suppress progress output
    env: { ...process.env, NO_COLOR: "1", DATABASE_URL: dbPath },
  });
}
