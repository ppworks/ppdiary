import { z } from "zod";

import { formatToolResponse } from "../formatter/mcp-response";

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

export function getDiaryList(_args: z.infer<typeof getDiaryListSchema>) {
  return formatToolResponse("success");
}

export const getDiarySchema = z.object({
  id: z.string().describe("Diary's ID"),
});

export function getDiary(_args: z.infer<typeof getDiarySchema>) {
  return formatToolResponse("success");
}

export const createDiarySchema = z.object({
  title: z.string().describe("Diary's title"),
  contents: z.string().describe("Diary's contents"),
});

export function createDiary(_args: z.infer<typeof createDiarySchema>) {
  return formatToolResponse("success");
}

export const updateDiarySchema = z.object({
  id: z.string().describe("Diary's ID"),
  title: z.string().describe("Diary's title"),
  contents: z.string().describe("Diary's contents"),
});

export function updateDiary(_args: z.infer<typeof updateDiarySchema>) {
  return formatToolResponse("success");
}

export const deleteDiarySchema = z.object({
  id: z.string().describe("Diary's ID"),
});

export function deleteDiary(_args: z.infer<typeof deleteDiarySchema>) {
  return formatToolResponse("success");
}
