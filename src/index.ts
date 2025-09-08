#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import packageJson from "../package.json" with { type: "json" };
import { setupPrompts } from "./prompts/index.js";
import { setupTools } from "./tools/index.js";

async function main() {
  const server = new McpServer({
    name: "ppdiary",
    version: packageJson.version,
    description: "Personal diary management system - ppdiary",
  });

  setupTools(server);
  setupPrompts(server);

  const transport = new StdioServerTransport();

  transport.onclose = () => {
    console.error("Transport closed");
  };

  transport.onerror = (error) => {
    console.error("Transport error:", error);
  };

  await server.connect(transport);
}

await main().catch((_error) => {
  process.exit(1);
});
