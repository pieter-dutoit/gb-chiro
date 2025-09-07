import { BusinessDetail } from "@/payload-types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type DayKey =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

const DAY_KEYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const DAY_SHORT: Record<DayKey, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

function formatTime(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(":");
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr ?? "0", 10) || 0;
  const period = h >= 12 ? "pm" : "am";
  h = h % 12 || 12;
  return m === 0
    ? `${h}${period}`
    : `${h}:${m.toString().padStart(2, "0")}${period}`;
}

/**
 * Convert operating hours to strings like: ["Mon - Fri 8am to 6pm", "Sat 8am to 11am"]
 */
export function formatOperatingHours(
  hours: BusinessDetail["operatingHours"]
): string[] {
  // Build a per-day map of opening/closing times (null = closed)
  const perDay: Array<{ opens: string; closes: string } | null> = DAY_KEYS.map(
    () => null
  );

  for (const entry of hours) {
    for (let i = 0; i < DAY_KEYS.length; i++) {
      const day = DAY_KEYS[i] as DayKey;
      if (entry[day]) perDay[i] = { opens: entry.opens, closes: entry.closes };
    }
  }

  // Group consecutive days with identical hours
  const result: string[] = [];
  let i = 0;

  while (i < DAY_KEYS.length) {
    const slot = perDay[i];
    if (!slot) {
      i++;
      continue;
    }

    const opens = slot.opens;
    const closes = slot.closes;

    const start = i;
    let end = i;

    while (
      end + 1 < DAY_KEYS.length &&
      perDay[end + 1] &&
      perDay[end + 1]!.opens === opens &&
      perDay[end + 1]!.closes === closes
    ) {
      end++;
    }

    const dayLabel =
      start === end
        ? DAY_SHORT[DAY_KEYS[start]]
        : `${DAY_SHORT[DAY_KEYS[start]]} - ${DAY_SHORT[DAY_KEYS[end]]}`;

    result.push(`${dayLabel}, ${formatTime(opens)} to ${formatTime(closes)}`);
    i = end + 1;
  }

  return result;
}

export function stringToSlug(item: string): string {
  return item
    .toLowerCase()
    .replace(/&/g, " and ") // turn & into "and"
    .replace(/\s+/g, "-") // spaces/tabs -> hyphen
    .replace(/[^a-z0-9-]/g, "") // drop anything not a-z, 0-9, or -
    .replace(/-+/g, "-") // collapse multiple hyphens
    .replace(/^-|-$/g, ""); // trim leading/trailing hyphens
}
