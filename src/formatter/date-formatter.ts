import { cdate } from "cdate";

export function formatDate(dateString: string): string {
  let inputDate: string;
  if (dateString.includes("T") || dateString.includes("Z")) {
    inputDate = dateString;
  } else {
    inputDate = `${dateString.replace(" ", "T")}Z`;
  }

  const timezone = process.env.TZ || "UTC";
  return cdate(inputDate).tz(timezone).format("YYYY-MM-DDTHH:mm:ssZ");
}

export function formatDiaryDates<
  T extends { createdAt?: string; updatedAt?: string },
>(diary: T): T {
  return {
    ...diary,
    ...(diary.createdAt && { createdAt: formatDate(diary.createdAt) }),
    ...(diary.updatedAt && { updatedAt: formatDate(diary.updatedAt) }),
  };
}
