import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { diaryEntries } from "./schema.js";

const sqlite = new Database("./data/diary.db");
export const db = drizzle(sqlite, { schema: { diaryEntries } });
