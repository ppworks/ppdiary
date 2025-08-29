import { asc, count, desc, eq, like, or, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/index.js";
import { diaryEntries } from "../db/schema.js";
import {
  formatToolError,
  formatToolResponse,
} from "../formatter/mcp-response.js";

export const getDiaryListSchema = z.object({
  query: z.string().optional().describe("Search query"),
  order: z.enum(["desc", "asc"]).optional().describe("Sort direction"),
  page: z.number().int().positive().optional().describe("Page number"),
  perPage: z
    .number()
    .int()
    .min(1)
    .max(100)
    .optional()
    .describe("Items per page"),
});

export function getDiaryList(args: z.infer<typeof getDiaryListSchema>) {
  try {
    const { query, order = "desc", page = 1, perPage = 10 } = args;

    const baseQuery = query
      ? db
          .select()
          .from(diaryEntries)
          .where(
            or(
              like(diaryEntries.title, `%${query}%`),
              like(diaryEntries.content, `%${query}%`),
            ),
          )
      : db.select().from(diaryEntries);

    const countQuery = query
      ? db
          .select({ count: count() })
          .from(diaryEntries)
          .where(
            or(
              like(diaryEntries.title, `%${query}%`),
              like(diaryEntries.content, `%${query}%`),
            ),
          )
      : db.select({ count: count() }).from(diaryEntries);

    // Get total count
    const totalCount = countQuery.get()?.count || 0;

    // Get paginated results
    const diaries = baseQuery
      .orderBy(
        order === "desc"
          ? desc(diaryEntries.createdAt)
          : asc(diaryEntries.createdAt),
      )
      .limit(perPage)
      .offset((page - 1) * perPage)
      .all();

    return formatToolResponse({
      diaries,
      totalCount,
      page,
      perPage,
    });
  } catch (error) {
    return formatToolError(error);
  }
}

export const getDiarySchema = z.object({
  id: z.string().describe("Diary's ID"),
});

export function getDiary(args: z.infer<typeof getDiarySchema>) {
  try {
    const { id } = args;
    const diary = db
      .select()
      .from(diaryEntries)
      .where(eq(diaryEntries.id, id))
      .get();

    if (!diary) {
      return formatToolError(new Error("Diary not found"));
    }

    return formatToolResponse(diary);
  } catch (error) {
    return formatToolError(error);
  }
}

export const createDiarySchema = z.object({
  title: z.string().describe("Diary's title"),
  content: z.string().describe("Diary's content"),
});

export function createDiary(args: z.infer<typeof createDiarySchema>) {
  try {
    const { title, content } = args;
    const result = db
      .insert(diaryEntries)
      .values({
        title,
        content,
      })
      .returning()
      .get();

    return formatToolResponse(result);
  } catch (error) {
    return formatToolError(error);
  }
}

export const updateDiarySchema = z.object({
  id: z.string().describe("Diary's ID"),
  title: z.string().describe("Diary's title"),
  content: z.string().describe("Diary's content"),
});

export function updateDiary(args: z.infer<typeof updateDiarySchema>) {
  try {
    const { id, title, content } = args;
    const result = db
      .update(diaryEntries)
      .set({
        title,
        content,
        updatedAt: sql`(strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))`,
      })
      .where(eq(diaryEntries.id, id))
      .returning()
      .get();

    if (!result) {
      return formatToolError(new Error("Diary not found"));
    }

    return formatToolResponse(result);
  } catch (error) {
    return formatToolError(error);
  }
}

export const deleteDiarySchema = z.object({
  id: z.string().describe("Diary's ID"),
});

export function deleteDiary(args: z.infer<typeof deleteDiarySchema>) {
  try {
    const { id } = args;
    const result = db
      .delete(diaryEntries)
      .where(eq(diaryEntries.id, id))
      .returning()
      .get();

    if (!result) {
      return formatToolError(new Error("Diary not found"));
    }

    return formatToolResponse(result);
  } catch (error) {
    return formatToolError(error);
  }
}
