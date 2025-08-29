import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { z } from "zod";

import {
  createDiary,
  createDiarySchema,
  deleteDiary,
  deleteDiarySchema,
  getDiary,
  getDiaryList,
  getDiaryListSchema,
  getDiarySchema,
  updateDiary,
  updateDiarySchema,
} from "./diaries.js";

export function setupTools(server: McpServer): void {
  server.registerTool(
    "ppdiary_list_diary",
    {
      title: "Get diaries list",
      description: "Get all diaries or filter by query from ppdiary",
      inputSchema: getDiaryListSchema.shape,
    },
    async (params: z.infer<typeof getDiaryListSchema>) => getDiaryList(params),
  );

  server.registerTool(
    "ppdiary_get_diary",
    {
      title: "Get a diary",
      description: "Get a diary from ID from ppdiary",
      inputSchema: getDiarySchema.shape,
    },
    async (params: z.infer<typeof getDiarySchema>) => getDiary(params),
  );

  server.registerTool(
    "ppdiary_create_diary",
    {
      title: "Create a diary",
      description: "Create a diary from ppdiary",
      inputSchema: createDiarySchema.shape,
    },
    async (params: z.infer<typeof createDiarySchema>) => createDiary(params),
  );

  server.registerTool(
    "ppdiary_update_diary",
    {
      title: "Update a diary",
      description: "Update a diary by ID from ppdiary",
      inputSchema: updateDiarySchema.shape,
    },
    async (params: z.infer<typeof updateDiarySchema>) => updateDiary(params),
  );

  server.registerTool(
    "ppdiary_delete_diary",
    {
      title: "Delete a diary",
      description: "Delete a diary by ID from ppdiary",
      inputSchema: deleteDiarySchema.shape,
    },
    async (params: z.infer<typeof deleteDiarySchema>) => deleteDiary(params),
  );
}
