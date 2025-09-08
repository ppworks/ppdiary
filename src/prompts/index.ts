import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";

import { extractDiary, extractDiarySchema } from "./extract-diary.js";

export function setupPrompts(server: McpServer): void {
  server.registerPrompt(
    "ppdiary_extract_a_diary",
    {
      title: "Extract a Diary",
      description: "Extract ad Diary by ID",
      argsSchema: extractDiarySchema.shape,
    },
    async (params: z.infer<typeof extractDiarySchema>) => extractDiary(params),
  );
}
