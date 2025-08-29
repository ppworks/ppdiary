import { z } from "zod";

import { formatToolResponse } from "../formatter/mcp-response";

export const createDiarySchema = z.object({
  title: z.string().describe("Diary's title"),
  contents: z.string().describe("Diary's contents"),
});

export function createDiary(_args: z.infer<typeof createDiarySchema>) {
  return formatToolResponse("success");
}

export const getDiarySchema = z.object({
  id: z.string().describe("Diary's ID"),
});

export function getDiary(_args: z.infer<typeof getDiarySchema>) {
  return formatToolResponse("success");
}
