import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { setupPrompts } from "../index.js";

describe("setupPrompts", () => {
  let server: McpServer;

  beforeEach(() => {
    server = new McpServer({
      name: "test-server",
      version: "1.0.0",
    });

    vi.clearAllMocks();
  });

  it("should register all prompts with correct handlers", () => {
    const registerPromptSpy = vi.spyOn(server, "registerPrompt");

    setupPrompts(server);

    expect(registerPromptSpy).toHaveBeenCalledTimes(1);

    for (let i = 0; i < 1; i++) {
      const [promptName, schema, handler] = registerPromptSpy.mock.calls[i];
      expect(typeof promptName).toBe("string");
      expect(promptName).toMatch(/^ppdiary_/); // All prompts should start with 'ppdiary_'
      expect(schema).toBeTypeOf("object"); // Schema verification handled by individual prompt tests
      expect(handler).toBeTypeOf("function"); // Handler functionality tested in specific prompt tests
    }
  });
});
