import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { setupTools } from "../index.js";

vi.mock("../diaries.js", () => ({
  createDiary: vi.fn(),
  createDiarySchema: { shape: {} },
  deleteDiary: vi.fn(),
  deleteDiarySchema: { shape: {} },
  getDiary: vi.fn(),
  getDiaryList: vi.fn(),
  getDiaryListSchema: { shape: {} },
  getDiarySchema: { shape: {} },
  updateDiary: vi.fn(),
  updateDiarySchema: { shape: {} },
}));

describe("setupTools", () => {
  let mockServer: McpServer;

  beforeEach(() => {
    vi.clearAllMocks();
    mockServer = {
      registerTool: vi.fn(),
    } as unknown as McpServer;
  });

  it("should register all ppdiary tools", () => {
    setupTools(mockServer);

    expect(mockServer.registerTool).toHaveBeenCalledTimes(5);

    expect(mockServer.registerTool).toHaveBeenCalledWith(
      "ppdiary_list_diary",
      {
        title: "Get diaries list",
        description: "Get all diaries or filter by query from ppdiary",
        inputSchema: {},
      },
      expect.any(Function),
    );

    expect(mockServer.registerTool).toHaveBeenCalledWith(
      "ppdiary_get_diary",
      {
        title: "Get a diary",
        description: "Get a diary from ID from ppdiary",
        inputSchema: {},
      },
      expect.any(Function),
    );

    expect(mockServer.registerTool).toHaveBeenCalledWith(
      "ppdiary_create_diary",
      {
        title: "Create a diary",
        description: "Create a diary from ppdiary",
        inputSchema: {},
      },
      expect.any(Function),
    );

    expect(mockServer.registerTool).toHaveBeenCalledWith(
      "ppdiary_update_diary",
      {
        title: "Update a diary",
        description: "Update a diary by ID from ppdiary",
        inputSchema: {},
      },
      expect.any(Function),
    );

    expect(mockServer.registerTool).toHaveBeenCalledWith(
      "ppdiary_delete_diary",
      {
        title: "Delete a diary",
        description: "Delete a diary by ID from ppdiary",
        inputSchema: {},
      },
      expect.any(Function),
    );
  });
});
