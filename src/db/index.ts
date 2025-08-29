import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { diaryEntries } from "./schema.js";

const dbPath = "./data/diary.db";

// Check if database exists, if not run migrations
if (!existsSync(dbPath)) {
  execSync("npx drizzle-kit migrate", {
    stdio: ["ignore", "ignore", "pipe"], // Suppress progress output
    env: { ...process.env, NO_COLOR: "1" }, // Disable colors/spinners
  });
}

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema: { diaryEntries } });
