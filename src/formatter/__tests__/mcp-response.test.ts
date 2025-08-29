import { describe, expect, it } from "vitest";
import { formatToolError, formatToolResponse } from "../mcp-response.js";

describe("response formatters", () => {
  describe("formatToolResponse", () => {
    it("should format data as JSON text content", () => {
      const data = { key: "value", count: 42 };
      const result = formatToolResponse(data);

      expect(result.content[0].type).toBe("text");
      expect(result.content[0].text).toBe(JSON.stringify(data, null, 2));
    });
  });
});

describe("error formatters", () => {
  it("should format Error instances", () => {
    const error = new Error("test error");
    const result = formatToolError(error);

    expect(result.content[0].text).toBe("Error: test error");
  });

  it("should format status codes as API responses", () => {
    const status = 404;
    const result = formatToolError(status);

    expect(result.content[0].text).toBe("Error: API Response(status: 404)");
  });

  it("should format object errors as JSON strings", () => {
    const error = { code: "NOT_FOUND", message: "Resource not found" };
    const expectedText = `Error: ${JSON.stringify(error, null, 2)}`;
    const result = formatToolError(error);

    expect(result.content[0].text).toBe(expectedText);
  });

  it("should maintain correct structure", () => {
    const error = new Error("test");
    const result = formatToolError(error);

    expect(result).toHaveProperty("content");
    expect(Array.isArray(result.content)).toBe(true);
    expect(result.content[0].type).toBe("text");
  });
});
