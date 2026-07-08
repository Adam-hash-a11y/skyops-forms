export enum FormType {
  SELECT = "select",
  TEXT = "text",
  DATE_TIME_LOCAL = "datetime-local",
  NUMBER = "number",
}

export type Status = "scheduled" | "delayed" | "cancelled" | "landed";
