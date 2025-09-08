import { beforeEach, describe, expect, it, vi } from "vitest";
import { extractDiary, extractDiarySchema } from "../extract-diary.js";

vi.mock("../../db/index.js", () => ({
  db: {
    select: vi.fn(),
  },
}));

vi.mock("../../formatter/date-formatter.js", () => ({
  formatDiaryDates: vi.fn((diary) => diary),
}));

describe("extractDiarySchema", () => {
  it("should validate correct input", () => {
    const result = extractDiarySchema.safeParse({
      diaryID: "test-id-123",
    });

    expect(result.success).toBe(true);
  });

  it("should require diaryID", () => {
    const result = extractDiarySchema.safeParse({});

    expect(result.success).toBe(false);
  });
});

describe("extractDiary", () => {
  const mockDiary = {
    id: "test-id-123",
    title: "Test Diary Entry",
    content: "This is a test diary content.",
    createdAt: "2025-09-08T00:00:00Z",
    updatedAt: "2025-09-09T00:00:00Z",
  };

  let mockSelect: ReturnType<typeof vi.fn>;
  let mockFrom: ReturnType<typeof vi.fn>;
  let mockWhere: ReturnType<typeof vi.fn>;
  let mockGet: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();

    mockGet = vi.fn();
    mockWhere = vi.fn().mockReturnValue({ get: mockGet });
    mockFrom = vi.fn().mockReturnValue({ where: mockWhere });
    mockSelect = vi.fn().mockReturnValue({ from: mockFrom });

    const { db } = vi.mocked(await import("../../db/index.js"));
    db.select = mockSelect;
  });

  it("should extract and format diary entry successfully", async () => {
    mockGet.mockReturnValue(mockDiary);

    const result = await extractDiary({ diaryID: "test-id-123" });

    expect(mockSelect).toHaveBeenCalled();
    expect(mockFrom).toHaveBeenCalled();
    expect(mockWhere).toHaveBeenCalled();
    expect(mockGet).toHaveBeenCalled();

    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].role).toBe("user");
    expect(result.messages[0].content.type).toBe("text");

    const promptText = result.messages[0].content.text;
    expect(promptText).toContain("Please display the following diary entries");
    expect(promptText).toContain("ID: test-id-123");
    expect(promptText).toContain("Title: Test Diary Entry");
    expect(promptText).toContain("Content: This is a test diary content.");
    expect(promptText).toContain("Created At: 2025-09-08T00:00:00Z");
    expect(promptText).toContain("Updated At: 2025-09-09T00:00:00Z");
  });

  it("should handle diary not found", async () => {
    mockGet.mockReturnValue(null);

    const result = await extractDiary({ diaryID: "non-existent-id" });

    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].role).toBe("user");
    expect(result.messages[0].content.type).toBe("text");
    expect(result.messages[0].content.text).toContain("Error: Diary not found");
  });

  it("should handle database errors", async () => {
    const dbError = new Error("Database connection failed");
    mockGet.mockImplementation(() => {
      throw dbError;
    });

    const result = await extractDiary({ diaryID: "test-id-123" });

    expect(result.messages).toHaveLength(1);
    expect(result.messages[0].role).toBe("user");
    expect(result.messages[0].content.type).toBe("text");
    expect(result.messages[0].content.text).toContain(
      "Error: Database connection failed",
    );
  });

  it("should apply date formatting", async () => {
    const { formatDiaryDates } = vi.mocked(
      await import("../../formatter/date-formatter.js"),
    );
    const formattedDiary = {
      ...mockDiary,
      createdAt: "2025-09-08T09:00:00+09:00",
      updatedAt: "2025-09-09T09:00:00+09:00",
    };
    formatDiaryDates.mockReturnValue(formattedDiary);
    mockGet.mockReturnValue(mockDiary);

    const result = await extractDiary({ diaryID: "test-id-123" });

    expect(formatDiaryDates).toHaveBeenCalledWith(mockDiary);

    const promptText = result.messages[0].content.text;
    expect(promptText).toContain("Created At: 2025-09-08T09:00:00+09:00");
    expect(promptText).toContain("Updated At: 2025-09-09T09:00:00+09:00");
  });
});
