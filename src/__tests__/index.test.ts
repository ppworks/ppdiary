import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { MockInstance } from "vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("MCP Server", () => {
  let consoleErrorSpy: MockInstance<typeof console.error>;
  let processExitSpy: MockInstance<typeof process.exit>;

  const createMockServer = (behavior?: { shouldFailConnect?: boolean }) => {
    const mockConnect = behavior?.shouldFailConnect
      ? vi.fn().mockRejectedValue(new Error("Connection failed"))
      : vi.fn().mockResolvedValue(undefined);

    return {
      connect: mockConnect,
    } as unknown as McpServer;
  };

  const createMockTransport = () =>
    ({
      onclose: undefined as (() => void) | undefined,
      onerror: undefined as ((error: Error) => void) | undefined,
    }) as unknown as StdioServerTransport;

  const setupServerMocks = (
    mockServer: ReturnType<typeof createMockServer>,
    mockTransport: ReturnType<typeof createMockTransport>,
  ) => {
    const MockMcpServer = vi.fn().mockReturnValue(mockServer);
    const MockStdioServerTransport = vi.fn().mockReturnValue(mockTransport);
    const mockSetupTools = vi.fn();

    vi.doMock("@modelcontextprotocol/sdk/server/mcp.js", () => ({
      McpServer: MockMcpServer,
    }));
    vi.doMock("@modelcontextprotocol/sdk/server/stdio.js", () => ({
      StdioServerTransport: MockStdioServerTransport,
    }));
    vi.doMock("../tools/index.js", () => ({
      setupTools: mockSetupTools,
    }));

    return { MockMcpServer, MockStdioServerTransport, mockSetupTools };
  };

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    processExitSpy = vi
      .spyOn(process, "exit")
      .mockImplementation(() => undefined as never);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
    vi.resetModules();
  });

  it("should create MCP server and connect", async () => {
    const mockServer = createMockServer();
    const mockTransport = createMockTransport();

    const { MockMcpServer, mockSetupTools } = setupServerMocks(
      mockServer,
      mockTransport,
    );

    await import("../index.js");

    expect(MockMcpServer).toHaveBeenCalledWith({
      name: "ppdiary",
      version: "1.0.0",
      description: "Personal diary management system - ppdiary",
    });

    expect(mockSetupTools).toHaveBeenCalledWith(mockServer);
    expect(mockServer.connect).toHaveBeenCalled();
  });

  it("should set up transport error handlers", async () => {
    const mockServer = createMockServer();
    const mockTransport = createMockTransport();

    setupServerMocks(mockServer, mockTransport);

    await import("../index.js");

    expect(mockTransport.onclose).toBeDefined();
    expect(mockTransport.onerror).toBeDefined();

    mockTransport.onclose?.();
    expect(consoleErrorSpy).toHaveBeenCalledWith("Transport closed");

    const testError = new Error("Test error");
    mockTransport.onerror?.(testError);
    expect(consoleErrorSpy).toHaveBeenCalledWith("Transport error:", testError);
  });

  it("should handle server startup errors", async () => {
    const mockServer = createMockServer({ shouldFailConnect: true });
    const mockTransport = createMockTransport();

    setupServerMocks(mockServer, mockTransport);

    await import("../index.js");

    expect(processExitSpy).toHaveBeenCalledWith(1);
  });
});
