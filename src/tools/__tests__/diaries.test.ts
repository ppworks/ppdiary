import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { beforeEach, describe, expect, it } from "vitest";
import { db } from "../../db/index.js";
import { diaryEntries } from "../../db/schema.js";
import {
  createDiary,
  deleteDiary,
  getDiary,
  getDiaryList,
  updateDiary,
} from "../diaries.js";

function parseResult(result: CallToolResult) {
  const firstContent = result.content?.[0];
  if (
    firstContent &&
    "text" in firstContent &&
    typeof firstContent.text === "string"
  ) {
    try {
      return JSON.parse(firstContent.text);
    } catch {
      return { error: firstContent.text };
    }
  }
  return null;
}

function isError(result: CallToolResult): boolean {
  const parsed = parseResult(result);
  return parsed?.error !== undefined;
}

describe("Diaries Tool", () => {
  beforeEach(() => {
    db.delete(diaryEntries).run();
  });

  describe("createDiary", () => {
    it("should create a new diary entry", () => {
      const result = createDiary({
        title: "Test Title",
        content: "Test content for diary entry",
      });
      const parsed = parseResult(result);

      expect(isError(result)).toBe(false);
      expect(parsed).toMatchObject({
        title: "Test Title",
        content: "Test content for diary entry",
      });
      expect(parsed.id).toBeDefined();
      expect(parsed.createdAt).toBeDefined();
      expect(parsed.updatedAt).toBeDefined();
    });

    it("should handle empty title and content", () => {
      const result = createDiary({
        title: "",
        content: "",
      });
      const parsed = parseResult(result);

      expect(isError(result)).toBe(false);
      expect(parsed).toMatchObject({
        title: "",
        content: "",
      });
    });
  });

  describe("getDiary", () => {
    it("should retrieve an existing diary entry", () => {
      const created = createDiary({
        title: "Retrieved Test",
        content: "Content to retrieve",
      });
      const createdParsed = parseResult(created);

      const result = getDiary({
        id: createdParsed.id,
      });
      const parsed = parseResult(result);

      expect(isError(result)).toBe(false);
      expect(parsed).toMatchObject({
        id: createdParsed.id,
        title: "Retrieved Test",
        content: "Content to retrieve",
      });
    });

    it("should return error for non-existent diary", () => {
      const result = getDiary({
        id: "non-existent-id",
      });
      const parsed = parseResult(result);

      expect(isError(result)).toBe(true);
      expect(parsed.error).toContain("Diary not found");
    });
  });

  describe("getDiaryList", () => {
    beforeEach(async () => {
      createDiary({ title: "First Entry", content: "First content" });
      createDiary({ title: "Second Entry", content: "Second content" });
      createDiary({
        title: "Third Entry",
        content: "Third content with special word",
      });
    });

    it("should return all diary entries with default pagination", () => {
      const result = getDiaryList({});
      const parsed = parseResult(result);

      expect(isError(result)).toBe(false);
      expect(parsed.diaries).toHaveLength(3);
      expect(parsed.totalCount).toBe(3);
      expect(parsed.page).toBe(1);
      expect(parsed.perPage).toBe(10);
    });

    it("should search diary entries by title", () => {
      const result = getDiaryList({
        query: "Second",
      });
      const parsed = parseResult(result);

      expect(isError(result)).toBe(false);
      expect(parsed.diaries).toHaveLength(1);
      expect(parsed.diaries[0].title).toBe("Second Entry");
    });

    it("should search diary entries by content", () => {
      const result = getDiaryList({
        query: "special word",
      });
      const parsed = parseResult(result);

      expect(isError(result)).toBe(false);
      expect(parsed.diaries).toHaveLength(1);
      expect(parsed.diaries[0].title).toBe("Third Entry");
    });

    it("should handle pagination", () => {
      const result = getDiaryList({
        page: 2,
        perPage: 2,
      });
      const parsed = parseResult(result);

      expect(isError(result)).toBe(false);
      expect(parsed.diaries).toHaveLength(1);
      expect(parsed.totalCount).toBe(3);
      expect(parsed.page).toBe(2);
      expect(parsed.perPage).toBe(2);
    });

    it("should return empty result for non-matching search", () => {
      const result = getDiaryList({
        query: "non-existent",
      });
      const parsed = parseResult(result);

      expect(isError(result)).toBe(false);
      expect(parsed.diaries).toHaveLength(0);
      expect(parsed.totalCount).toBe(0);
    });
  });

  describe("updateDiary", () => {
    it("should update an existing diary entry", () => {
      const created = createDiary({
        title: "Original Title",
        content: "Original content",
      });
      const createdParsed = parseResult(created);

      const result = updateDiary({
        id: createdParsed.id,
        title: "Updated Title",
        content: "Updated content",
      });
      const parsed = parseResult(result);

      expect(isError(result)).toBe(false);
      expect(parsed).toMatchObject({
        id: createdParsed.id,
        title: "Updated Title",
        content: "Updated content",
      });
      expect(parsed.updatedAt).not.toBe(createdParsed.updatedAt);
    });

    it("should return error for non-existent diary", () => {
      const result = updateDiary({
        id: "non-existent-id",
        title: "Updated Title",
        content: "Updated content",
      });
      const parsed = parseResult(result);

      expect(isError(result)).toBe(true);
      expect(parsed.error).toContain("Diary not found");
    });
  });

  describe("deleteDiary", () => {
    it("should delete an existing diary entry", () => {
      const created = createDiary({
        title: "To Delete",
        content: "Content to delete",
      });
      const createdParsed = parseResult(created);

      const result = deleteDiary({
        id: createdParsed.id,
      });
      const parsed = parseResult(result);

      expect(isError(result)).toBe(false);
      expect(parsed).toMatchObject({
        id: createdParsed.id,
        title: "To Delete",
        content: "Content to delete",
      });

      const getResult = getDiary({ id: createdParsed.id });
      expect(isError(getResult)).toBe(true);
    });

    it("should return error for non-existent diary", () => {
      const result = deleteDiary({
        id: "non-existent-id",
      });
      const parsed = parseResult(result);

      expect(isError(result)).toBe(true);
      expect(parsed.error).toContain("Diary not found");
    });
  });
});
