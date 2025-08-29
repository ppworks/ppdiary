#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

async function main() {
  const server = new McpServer({
    name: "ppdiary",
    version: "1.0.0",
  });

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
