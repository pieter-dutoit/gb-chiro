import type { TextField } from "payload";

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/; // "HH:MM" 24h

export const TimeField = (name: string, label?: string): TextField => ({
  name,
  label,
  type: "text",
  required: true,
  admin: {
    placeholder: "00:00",
    description: "24-hour time in HH:MM (e.g., 08:00, 13:45)",
  },
  validate: (value) =>
    TIME_REGEX.test(value || "") || "Use 24-hour HH:MM (e.g., 08:00)",
});
