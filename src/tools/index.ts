import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";

import {
  createDiary,
  createDiarySchema,
  getDiary,
  getDiarySchema,
} from "./diaries";

export function setupTools(server: McpServer): void {
  server.registerTool(
    "ppdiary_create_diary",
    {
      title: "Create a diary",
      description: "Create a diary",
      inputSchema: createDiarySchema.shape,
    },
    async (params: z.infer<typeof createDiarySchema>) => createDiary(params),
  );

  server.registerTool(
    "ppdiary_get_diary",
    {
      title: "Geta a diary",
      description: "Get a diary from ID",
      inputSchema: getDiarySchema.shape,
    },
    async (params: z.infer<typeof getDiarySchema>) => getDiary(params),
  );
}
