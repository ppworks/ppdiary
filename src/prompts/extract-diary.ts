import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db/index.js";
import { diaryEntries } from "../db/schema.js";
import { formatDiaryDates } from "../formatter/date-formatter.js";
import {
  formatPromptError,
  formatPromptResponse,
} from "../formatter/mcp-response.js";

export const extractDiarySchema = z.object({
  diaryID: z.string().describe("Diary ID to extract"),
});

export async function extractDiary(args: z.infer<typeof extractDiarySchema>) {
  try {
    const { diaryID } = args;
    const diary = db
      .select()
      .from(diaryEntries)
      .where(eq(diaryEntries.id, diaryID))
      .get();

    if (!diary) {
      return formatPromptError(new Error("Diary not found"));
    }
    const formatedDiary = formatDiaryDates(diary);
    let prompt = `Please display the following diary entries in a simple format. Do not change the content, including the language:\n\n`;
    prompt += `ID: ${formatedDiary.id}\n`;
    prompt += `Title: ${formatedDiary.title}\n`;
    prompt += `Content: ${formatedDiary.content}\n`;
    prompt += `Created At: ${formatedDiary.createdAt}\n`;
    prompt += `Updated At: ${formatedDiary.updatedAt}\n`;

    return formatPromptResponse(prompt);
  } catch (error) {
    return formatPromptError(error);
  }
}
