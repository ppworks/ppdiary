import { afterEach, describe, expect, it } from "vitest";
import { formatDate } from "../date-formatter.js";

describe("formatDate", () => {
  const originalTZ = process.env.TZ;

  afterEach(() => {
    process.env.TZ = originalTZ;
  });

  it("should format ISO date with Z", () => {
    process.env.TZ = "UTC";
    const result = formatDate("2025-08-29T12:34:56.789Z");
    expect(result).toBe("2025-08-29T12:34:56+00:00");
  });

  it("should format SQLite datetime format without Z", () => {
    process.env.TZ = "UTC";
    const result = formatDate("2025-08-29 12:34:56");
    expect(result).toBe("2025-08-29T12:34:56+00:00");
  });

  it("should handle timezone conversion", () => {
    process.env.TZ = "Asia/Tokyo";
    const result = formatDate("2025-08-29T03:00:00.000Z");
    expect(result).toBe("2025-08-29T12:00:00+09:00");
  });

  it("should fallback to UTC when TZ is not set", () => {
    delete process.env.TZ;
    const result = formatDate("2025-08-29T12:34:56.789Z");
    expect(result).toBe("2025-08-29T12:34:56+00:00");
  });
});
