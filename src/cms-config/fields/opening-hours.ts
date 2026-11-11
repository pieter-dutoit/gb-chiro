import type { ArrayField, ArrayFieldValidation } from "payload";
import { TimeField } from "./time";

type OperatingHoursEntry = {
  opens: string | null;
  closes: string | null;
  Monday: boolean;
  Tuesday: boolean;
  Wednesday: boolean;
  Thursday: boolean;
  Friday: boolean;
  Saturday: boolean;
  Sunday: boolean;
};

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

// Count days selected, to ensure each day is selected at most once.
const detectDayOverlap: ArrayFieldValidation = (rows) => {
  if (!rows) return true;
  const daysCount = Object.fromEntries(DAYS.map((day) => [day, 0])) as Record<
    (typeof DAYS)[number],
    number
  >;

  for (const r of rows) {
    const row = r as OperatingHoursEntry;
    for (const d of DAYS) if (row[d]) daysCount[d]++;
  }

  const multipleDays = [...DAYS].filter((day) => daysCount[day] >= 2);

  if (multipleDays?.length >= 1)
    return `Duplicate hours detected for ${multipleDays.join(", ")}. Each day can only be set once.`;

  return true;
};

export const OpeningHoursField: ArrayField = {
  type: "array",
  name: "operatingHours",
  label: "Operating hours",
  labels: { singular: "Business hours", plural: "Business hours" },
  admin: {
    description:
      "Add one row per set of days that share the same hours. Tick the days this row applies to. Leave a day un-ticked to mark it closed.",
  },
  required: true,
  minRows: 1,
  maxRows: 7,
  validate: detectDayOverlap,
  fields: [
    {
      type: "row",
      fields: [
        TimeField("opens", "Opens at"),
        TimeField("closes", "Closes at"),
      ],
    },
    {
      type: "row",
      fields: DAYS.map((day) => ({
        defaultValue: false,
        name: day,
        label: day.slice(0, 3),
        type: "checkbox",
      })),
    },
    {
      type: "text",
      name: "note",
      label: "Note (Optional)",
      maxLength: 1000,
    },
  ],
};
