import { UTCDate } from "@date-fns/utc";
import { format } from "date-fns";

export const formatUtcTime = (date: string) => {
  const formattedDate = new UTCDate(date);
  const formattedTime = format(formattedDate, "HH:mm");
  return formattedTime + " UTC";
};

export const formatUtcDate = (date: string) => {
  const formattedDate = new UTCDate(date);
  return format(formattedDate, "dd MMM yyyy");
};
